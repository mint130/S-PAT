import logging
import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import PydanticOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.schema.runnable import RunnableMap
from langchain_openai import OpenAIEmbeddings

from app.schemas.conversation import ConversationRequest, ConversationResponse, SessionHistoryResponse
from app.db.database import get_db
from app.models.conversation import Conversation
from app.crud.crud_conversation import create_conversation_record, get_conversation_history_by_session

from app.crud.crud_excel import process_excel_file
from app.schemas.excel import StandardResponse, StandardLLMResponse
from app.crud.crud_llm import process_standards_with_llm

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)  # 모듈 이름 기반으로 로거 생성

standard_router = APIRouter(prefix="/standard")

llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), model_name="gpt-4o", temperature=0)

# json output parser 정의
output_parser = JsonOutputParser()

# template 정의
template = """
당신은 특허 분류 체계를 제작하는 특허 분류 전문가입니다.
당신은 유저의 요청과 필수 규칙에 따라 특허 분류 체계를 상세히 작성해야 합니다.
아래는 유저의 요청과 그 응답의 예시입니다.

[예시]
요청:
휴머노이드 기술에 대한 분류 체계를 만들어 주세요.

응답:
[
  {{
    "code": "H01",
    "level": "대분류",
    "name": "휴머노이드 플랫폼",
    "description": "휴머노이드 전체 시스템에서 하드웨어 및 소프트웨어가 통합되어 작동하는 플랫폼 구조로, 구동 방식, 모듈 조립성, 안정성 등을 포함하는 핵심 구조 기술."
  }},
  {{
    "code": "H01-01",
    "level": "중분류",
    "name": "모듈형 프레임 구조",
    "description": "휴머노이드의 몸통, 팔다리 등을 모듈화하여 교체 및 업그레이드가 가능하도록 설계한 뼈대 구조. 수리 및 유지보수의 효율성을 높이기 위함."
  }},
  {{
    "code": "H01-01-01",
    "level": "소분류",
    "name": "경량 합금 프레임",
    "description": "알루미늄 합금 또는 탄소 복합 소재 등 고강도 경량 재료를 활용하여 휴머노이드 프레임 무게를 줄이고 기능성을 향상시키는 기술."
  }},
  {{
    "code": "H02",
    "level": "대분류",
    "name": "휴머노이드 운동 제어",
    "description": "다관절 관절 구조를 기반으로 한 사람과 유사한 운동을 구현하며, 보행 안정성 및 동작 다양성 확보를 위한 제어 기술 집합."
  }},
  ...
]

[이전 생성한 분류 체계]
{chat_history}

[유저의 요청]
{user_input}

[필수 규칙]
1. 유저의 요청에 맞게 생성한 분류 체계는 JSON 배열 형태로 반환해야 한다.
2. 각 항목은 code, level, name, description 필드만 무조건 포함해야 한다.
3. 각 코드는 계층 구조를 따라야 한다.
    예를 들어, 대분류: A01, 중분류: A01-01, 소분류: A01-01-01
4. 이전 생성한 분류 체계가 있다면, 반드시 그 주제와 도메인을 유지하면서 확장해야 한다.
5. 이전 생성한 분류 체계가 있다면, 사용자의 요청에 따라 이전 생성한 분류 체계에서 수정하여 반영해야 한다.
6. 각 분류마다 지정된 최소 분류 개수 이상의 분류 항목이 있어야 한다.
    [최소 분류 개수]
    대분류: 무조건 5개 이상,
    중분류: 각 대분류마다 5개 이상,
    소분류: 각 중분류마다 3개 이상
    적어도 총 대분류5 + 중분류25 + 소분류75 = 105개의 항목이 존재해야 한다(중요).
7. 응답의 길이는 길어도 좋다.
"""


# prompttemplate 정의
prompt = PromptTemplate(
    input_variables=["chat_history", "user_input"],
    template=template,
)


# 메모리 저장소
conversation_memories = {}

# 세션별 메모리 가져오기
def get_memory(session_id: str) -> ConversationBufferMemory:
    if session_id not in conversation_memories:
        chat_history = ChatMessageHistory()
        conversation_memories[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            chat_memory=chat_history,
            return_messages=True
        )
    return conversation_memories[session_id]


@standard_router.post("/{session_id}", response_model=ConversationResponse, summary="분류 체계 프롬프트로 생성", description="사용자(관리자)가 프롬프트로 특허 분류 체계를 생성하여 json을 반환합니다.")
async def create_conversation(session_id: str, conv: ConversationRequest, db: Session = Depends(get_db)):
    try:
        # 메모리 가져오기
        memory = get_memory(session_id)

        # 메모리에 입력 저장
        memory.chat_memory.add_user_message(conv.query)
        # print("메모리 내용:", memory.load_memory_variables)

        # Chain 만들기
        chain = RunnableMap({
            "chat_history": memory.load_memory_variables,
            "user_input": RunnablePassthrough()
        }) | prompt | llm | output_parser

        # Chain 실행
        response = await chain.ainvoke({"user_input": conv.query})
        # print(f"Running chain with input: {conv.query}")
        # print(f"Chain response type: {type(response)}")
        # print(f"Chain response: {response[0]}")

        # db에 대화 저장
        create_conversation_record(db, session_id, conv.query, response)

        # 메모리에 응답 저장
        memory.chat_memory.add_ai_message(response)
        
        # JSON 응답 반환
        return {"standards": response}
    
    except Exception as e:
        import traceback
        error_detail = str(e) + "\n" + traceback.format_exc()
        print(f"Error occurred: {error_detail}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

    

@standard_router.get("/{session_id}/conversation", response_model=List[SessionHistoryResponse], summary="해당 세션 아이디의 모든 대화 조회", description="해당 세션 아이디에 발생한 질문과 답변을 json형태로 반환합니다.")
async def get_session_history(session_id: str, db: Session = Depends(get_db)):
    # 데이터베이스에서 해당 세션 ID의 대화 내역 조회
    conversations = get_conversation_history_by_session(db, session_id)

    if not conversations:
        raise HTTPException(status_code=404, detail=f"Session ID {session_id} not found")
    
    return conversations


@standard_router.post("/{session_id}/upload", response_model=StandardResponse, summary="엑셀 파일 업로드 후 JSON 변환", description="엑셀 파일을 업로드하여 분류 체계를 JSON으로 변환합니다.")
async def upload_excel(session_id: str, file: UploadFile = File(...)):
    standards = await process_excel_file(file)
    return {"standards": standards}


@standard_router.post("/{session_id}/upload/prompt", response_model=StandardLLMResponse, summary="엑셀 파일 업로드와 프롬프트로 분류 체계 생성", description="엑셀 파일을 업로드하고 GPT를 사용하여 분류 체계를 처리합니다.")
async def process_with_llm(
    session_id: str,
    file: UploadFile = File(...),
    query: str = Form(...),
    db: Session = Depends(get_db)
):
    # 1. 엑셀 파일 처리
    standards = await process_excel_file(file)
    
    # 2. 메모리 가져오기
    if session_id not in conversation_memories:
        conversation_memories[session_id] = ConversationBufferMemory(memory_key="chat_history")
    memory = conversation_memories[session_id]

    # 3. 메모리에 입력 저장
    memory.chat_memory.add_user_message(query)

    # 4. Chain 만들기
    chain = RunnableMap({
        "chat_history": memory.load_memory_variables,
        "user_input": RunnablePassthrough()
    }) | prompt | llm | output_parser

    # 5. Chain 실행
    response = await chain.ainvoke({"user_input": query})
    
    # 6. db에 대화 저장
    create_conversation_record(db, session_id, query, response)
    
    return {
        "standards": response,
        "query": query
    }