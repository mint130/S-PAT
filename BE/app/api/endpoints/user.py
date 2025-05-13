import asyncio
import io
import json
import logging
import os
import re
from typing import Any, Dict, List
from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse, StreamingResponse
import pandas as pd
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from app.core.redis import get_redis
from app.core.sse import progress_event_generator
from app.crud.crud_best_llm import get_best_llm, update_best_llm
from app.schemas.best_llm import LLMCreate, LLMResponse
from app.schemas.classification import ClassificationResponse, Patent
from app.schemas.conversation import ConversationResponse
from app.db.database import get_db
from app.core.llm import gpt, claude, gemini, grok
from app.schemas.message import Message
from app.services.classification import create_faiss_database, process_patent_classification, process_standards_for_vectordb

load_dotenv()

# 로그
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 결과 저장 디렉토리
RESULT_DIR = "./classified_excels"
os.makedirs(RESULT_DIR, exist_ok=True)

user_router = APIRouter(prefix="/user")

user_vector_stores: Dict[str, FAISS] = {}

# 세션별 작업 진행 큐를 저장할 딕셔너리
session_progress_queues: Dict[str, asyncio.Queue] = {}
    
@user_router.post("/{session_id}/standard/save", status_code=status.HTTP_201_CREATED, summary="분류 체계 벡터 db에 저장", description="선택된 분류 체계를 Redis 및 FAISS에 저장")
async def save_standard(session_id: str, standard: ConversationResponse, db:Session = Depends(get_db)):
    
    standards = standard.standards
    
    if not standards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="분류 체계 데이터가 없습니다."
        )
    
    # 벡터 DB에 저장할 문서 준비
    documents = process_standards_for_vectordb(standards)
    
    # FAISS 벡터 DB 생성 및 메모리에 저장
    vectordb = create_faiss_database(documents, session_id)
    # print("벡터 db", vectordb.docstore._dict)
    
    # 전역 딕셔너리에 저장
    user_vector_stores[session_id] = vectordb


    return True

# 1. 파일 업로드 엔드포인트 (작업 시작만 담당), 202 반환
@user_router.post("/{session_id}/upload", status_code=status.HTTP_202_ACCEPTED, response_model = Message, summary="특허 데이터 파일 업로드", description="분류 하고 싶은 특허 데이터 파일을 업로드합니다.")
async def upload_and_start_classification(
    background_tasks: BackgroundTasks,
    session_id: str, 
    LLM: str, 
    file: UploadFile = File(...),
    redis = Depends(get_redis)
):
    # 업로드된 파일이 엑셀 파일인지 확인
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="업로드된 파일은 Excel (.xlsx 또는 .xls) 형식이어야 합니다")
    
    # session_id에 대한 벡터 스토어가 존재하는지 확인
    if session_id not in user_vector_stores:
        raise HTTPException(
            status_code=404, 
            detail="해당 세션에 대한 분류 체계가 존재하지 않습니다. 먼저 분류 체계를 저장해주세요."
        )

    if len(user_vector_stores[session_id].docstore._dict) == 0:
        raise HTTPException(status_code=400, detail="벡터 DB에 분류 체계 데이터가 없습니다. 먼저 분류 체계를 저장해주세요.")

    try:
        # 최적의 LLM 셋팅
        if LLM=="GPT":
            llm = gpt
        elif LLM == "CLAUDE":
            llm = claude
        elif LLM == "GEMINI":
            llm = gemini
        elif LLM == "GROK":
            llm = grok

        # 파일 내용을 메모리에서 읽기
        contents = await file.read()
        
        # 바이트 스트림을 IO 객체로 변환
        file_object = io.BytesIO(contents)
        
        # 엑셀 파일을 데이터프레임으로 읽기
        df = pd.read_excel(file_object)
        
        # retriever 생성
        retriever = user_vector_stores[session_id].as_retriever(search_kwargs={"k": 3})
        
        # 진행률 통신을 위한 큐 생성
        # 이미 존재하는 큐가 있다면 제거
        if session_id in session_progress_queues:
            del session_progress_queues[session_id]
        
        # 새 큐 생성
        progress_queue = asyncio.Queue()
        session_progress_queues[session_id] = progress_queue
        
        # 백그라운드에서 분류 작업 실행
        asyncio.create_task(
            process_patent_classification(
                session_id,
                llm,
                retriever,
                df,
                redis,
                progress_queue
            )
        )

        message = Message(
            status="processing",
            message="분류 작업이 시작되었습니다."
        )
        
        # 작업 시작 성공 응답 반환
        return message
        
    except Exception as e:
        # 예외 처리
        logger.error(f"분류 작업 시작 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=f"분류 작업 시작 중 오류가 발생했습니다: {str(e)}")

    
# 2. 진행 상황 스트리밍 엔드포인트 (SSE)
@user_router.get("/{session_id}/progress", summary="특허 분류 진행도 반환", description="특허 분류 진행도를 퍼센테이지로 반환합니다.")
async def stream_classification_progress(session_id: str):
    # 세션에 대한 진행 큐가 존재하는지 확인
    if session_id not in session_progress_queues:
        raise HTTPException(
            status_code=404,
            detail="해당 세션에 대한 진행 중인 분류 작업을 찾을 수 없습니다."
        )
    
    # 해당 세션의 진행 큐 가져오기
    progress_queue = session_progress_queues[session_id]
    
    # SSE 스트림 응답 반환
    return StreamingResponse(
        progress_event_generator(progress_queue),
        media_type="text/event-stream",
        headers={"Content-Type": "text/event-stream; charset=utf-8"}
    )

# 결과 json으로 반환환
@user_router.get("/{session_id}/classification", summary="특허 분류 결과 json 반환", response_model=ClassificationResponse, description="세션 아이디로 저장된 분류결과 JSON을 반환합니다.")
async def get_classified_patents(session_id: str, redis = Depends(get_redis)):
    # redis에 저장된 세션이 없을 경우
    if not redis.exists(session_id):
        raise HTTPException(status_code=404, detail="해당 세션에 대한 분류 결과가 존재하지 않습니다.")

    items = redis.lrange(session_id, 0, -1)
    patents = [Patent.model_validate(json.loads(item)) for item in items]
    return ClassificationResponse(patents=patents)

# 결과 excel로 반환
@user_router.get("/{session_id}/classification/excel", summary="특허 분류 결과 엑셀 파일 반환", description="사용자 로컬 디스크에 저장된 분류 결과 엑셀 파일을 반환합니다")
def download_classified_excel(session_id: str):
    file_path = os.path.join(RESULT_DIR, f"{session_id}_classified.xlsx")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="엑셀 파일이 존재하지 않습니다.")

    return FileResponse(
        path=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=f"{session_id}_classified.xlsx"
    )

# 최적의 LLM 반환
@user_router.get("/LLM", response_model=LLMResponse, summary="최적의 LLM 반환", description="DB에 저장된 최적의 LLM을 반환합니다.")
def read_best_llm(db: Session = Depends(get_db)):
    llm = get_best_llm(db)

    if llm is None:
        raise HTTPException(status_code=404, detail="LLM setting not found")
    return {"LLM": llm}

# 최적의 LLM 설정
@user_router.post("/LLM", response_model=LLMResponse, summary="최적의 LLM 설정")
def set_best_llm(llm_data: LLMCreate, db: Session = Depends(get_db)):
    llm_record = update_best_llm(db, llm_data.LLM)

    return {"LLM": llm_record.llm}

