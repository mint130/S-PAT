import asyncio
import io
import json
import logging
import os
import pickle
import random
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, logger, status
from fastapi.responses import FileResponse, StreamingResponse
import pandas as pd
from requests import Session
from app.coordinator.tasks import start_llm_classification_task
from app.core.redis import get_redis, get_redis_client, get_redis_async_pool
from app.core.sse import format_sse
from app.db.database import get_db
from app.schemas.classification import ClassificationResponse, Patent, SampledClassificationResponse
from app.schemas.conversation import ConversationResponse
from app.schemas.message import Message
from app.services.admin_classification import calculate_sample_size
from app.services.celery_classification import process_patent_classification, process_patent_classification_evaluation
from app.services.classification import create_faiss_database, process_standards_for_vectordb
from app.core.celery import celery_app
from celery.result import AsyncResult

celery_router = APIRouter(prefix="/celery")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
    
# 결과 저장 디렉토리
RESULT_DIR = "./classified_excels"
os.makedirs(RESULT_DIR, exist_ok=True)

@celery_router.post("/{session_id}/standard/save", status_code=status.HTTP_201_CREATED, summary="분류 체계 벡터 db에 저장", description="선택된 분류 체계를 Redis 및 FAISS에 저장")
async def save_standard(session_id: str, standard: ConversationResponse, db: Session = Depends(get_db)):
    standards = standard.standards
    redis = get_redis_client()
    if not standards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="분류 체계 데이터가 없습니다."
        )

    # 벡터 DB에 저장할 문서 준비
    documents = process_standards_for_vectordb(standards)

    # FAISS 벡터 DB 생성
    vectordb = create_faiss_database(documents, session_id)

    # 로컬 경로에 저장 (세션별 디렉터리)
    save_dir = f"./vectorstores/{session_id}"
    
    # 디렉토리가 존재하지 않으면 생성
    import os
    os.makedirs(save_dir, exist_ok=True)
    
    # 벡터 DB 저장
    vectordb.save_local(save_dir)

    # Redis에 경로 저장
    vector_key=f"vectorstore:{session_id}:path"
    redis.set(vector_key, f"./vectorstores/{session_id}")
    redis.expire(vector_key, 86400)
    return True

@celery_router.post("/{session_id}/upload", status_code=status.HTTP_202_ACCEPTED, response_model = Message, summary="특허 데이터 파일 업로드", description="분류 하고 싶은 특허 데이터 파일을 업로드합니다.")
async def upload_and_start_classification(
    session_id: str, 
    LLM: str, 
    file: UploadFile = File(...),
    redis = Depends(get_redis)
):
    # 업로드된 파일이 엑셀 파일인지 확인
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="업로드된 파일은 Excel (.xlsx 또는 .xls) 형식이어야 합니다")
    
    # Redis에서 벡터 DB 경로 확인
    vector_key = f"vectorstore:{session_id}:path"
    vector_path = redis.get(vector_key)
    
    if vector_path is None:
        raise HTTPException(
            status_code=404,
            detail="해당 세션에 대한 분류 체계가 존재하지 않습니다. 먼저 분류 체계를 저장해주세요."
        )

    try:
        # 파일 내용을 메모리에서 읽기
        contents = await file.read()
        
        # 바이트 스트림을 IO 객체로 변환
        file_object = io.BytesIO(contents)
        
        # 엑셀 파일을 데이터프레임으로 읽기
        df = pd.read_excel(file_object)
        
        # df temp로 저장
        os.makedirs("./temp_data", exist_ok=True)
        with open(f"./temp_data/{session_id}.pkl", "wb") as f:pickle.dump(df, f)
    
        # celery 실행
        process_patent_classification(session_id, LLM, df, redis)

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

@celery_router.get("/{session_id}/progress", summary="특허 분류 진행도 반환", description="특허 분류 진행도를 퍼센테이지로 반환합니다.")
async def stream_classification_progress(session_id: str, redis=Depends(get_redis_async_pool)):
    """
    특허 분류 진행도를 SSE 스트림으로 반환합니다.
    진행도가 100%에 도달하면 'done' 이벤트를 전송하고 스트림을 종료합니다.
    """
    async def event_generator():
        pubsub = redis.pubsub()
        await pubsub.subscribe(f"{session_id}:progress")

        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=10.0)
                if message:
                    data = json.loads(message["data"])
                    yield format_sse(data)

                    if data.get("status") == "completed":
                        yield format_sse("done", event="done")
                        break

                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe(f"{session_id}:progress")
            await pubsub.close()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Content-Type": "text/event-stream; charset=utf-8"}
    )

@celery_router.post("/admin/{session_id}/upload", status_code=status.HTTP_202_ACCEPTED, response_model = Message, summary="특허 데이터 파일 업로드", description="분류 하고 싶은 특허 데이터 파일을 업로드합니다.")
async def upload_and_start_classification_and_evaluation(
    session_id: str,
    file: UploadFile = File(...),
    redis = Depends(get_redis)
):
    # 업로드된 파일이 엑셀 파일인지 확인
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="업로드된 파일은 Excel (.xlsx 또는 .xls) 형식이어야 합니다")
    
    # Redis에서 벡터 DB 경로 확인
    vector_key = f"vectorstore:{session_id}:path"
    vector_path = redis.get(vector_key)
    
    if vector_path is None:
        raise HTTPException(
            status_code=404,
            detail="해당 세션에 대한 분류 체계가 존재하지 않습니다. 먼저 분류 체계를 저장해주세요."
        )

    try:
        # 파일 내용을 메모리에서 읽기
        contents = await file.read()
        
        # 바이트 스트림을 IO 객체로 변환
        file_object = io.BytesIO(contents)
        
        # 엑셀 파일을 데이터프레임으로 읽기
        df = pd.read_excel(file_object)
        
        # df temp로 저장
        os.makedirs("./temp_data", exist_ok=True)
        with open(f"./temp_data/{session_id}.pkl", "wb") as f:pickle.dump(df, f)
    
        # celery 실행        
        for LLM in ["gpt", "claude", "gemini", "grok"]:
            start_llm_classification_task.delay(session_id, LLM)
            
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
    
@celery_router.get("/admin/{session_id}/progress", summary="특허 분류 진행도 반환", description="특허 분류 진행도를 퍼센테이지로 반환합니다.")
async def stream_classification_progress(session_id: str, LLM: str, redis=Depends(get_redis_async_pool)):
    """
    특허 분류 진행도를 SSE 스트림으로 반환합니다.
    진행도가 100%에 도달하면 'done' 이벤트를 전송하고 스트림을 종료합니다.
    """
    async def event_generator():
        pubsub = redis.pubsub()
        await pubsub.subscribe(f"{session_id}:{LLM.lower()}:progress")

        try:
            while True:
                message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=10.0)
                if message:
                    data = json.loads(message["data"])
                    yield format_sse(data)

                    if data.get("status") == "completed":
                        yield format_sse("done", event="done")
                        break

                await asyncio.sleep(0.1)
        finally:
            await pubsub.unsubscribe(f"{session_id}:{LLM}:progress")
            await pubsub.close()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Content-Type": "text/event-stream; charset=utf-8"}
    )