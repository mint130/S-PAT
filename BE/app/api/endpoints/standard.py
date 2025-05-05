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

standard_router = APIRouter(prefix="/standard")

llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), model_name="gpt-4o", temperature=0)

# json output parser 정의
output_parser = JsonOutputParser()

# template 정의
template = """
너는 특허 분류 체계를 생성하는 AI야.

아래는 입력과 그에 대한 정답 예시야.

[예시1]
요청:
휴머노이드의 플랫폼 기술에 대한 분류 체계를 만들어줘.

정답:
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
  }}
]

---

[예시2]
요청:
자동차 바퀴 특허 기술에 대한 분류 체계를 만들어줘.

정답:
[
  {{
  "code": "A01",
  "level": "대분류",
  "name": "자동차 바퀴 기술",
  "description": "자동차의 구동, 제동, 조향 성능에 직결되는 바퀴(휠 및 타이어) 관련 핵심 기술로, 구조, 재료, 성능 향상, 내구성, 환경 대응 등을 포함한다."
  }},
  {{
  "code": "A01-01",
  "level": "중분류",
  "name": "휠 구조 및 재료 기술",
  "description": "자동차 바퀴의 휠에 적용되는 구조적 설계 및 사용 재료에 관한 기술로, 경량화, 강성 확보, 디자인 향상 등을 포함한다."
  }},
  {{
  "code": "A01-01-01",
  "level": "소분류",
  "name": "단조 알루미늄 휠",
  "description": "고온·고압에서 가공된 알루미늄을 사용하여 강도와 경량을 동시에 확보한 휠 제조 기술로, 고성능 차량에 주로 적용된다."
  }},
  {{
  "code": "A01-02",
  "level": "중분류",
  "name": "타이어 성능 향상 기술",
  "description": "노면 접지력, 주행 안정성, 마모 저항성, 연비 향상 등을 위해 타이어의 재질, 구조, 패턴 등을 최적화하는 기술."
  }},
  {{
  "code": "A01-02-01",
  "level": "소분류",
  "name": "저연비 실리카 타이어",
  "description": "타이어 트레드에 실리카를 첨가하여 회전 저항을 줄이고 연비를 향상시키는 동시에 젖은 노면에서의 접지력을 유지하는 친환경 기술."
  }}
]

[이전 생성한 분류 체계]
{chat_history}

[유저의 요청]
{user_input}

유저의 요청에 맞게 분류 체계를 생성해서 JSON 배열 형태로 반환해줘. 
각 항목은 code, level, name, description 필드를 포함해야 해. 
각 코드는 계층 구조(대분류: H01, 중분류: H01-01, 소분류: H01-01-01)를 따라야 해.
반드시 이전에 생성한 분류 체계의 주제와 도메인을 유지하면서 확장해야 해.
예를 들어, 이전에 비행기 날개에 대한 분류였다면, 추가되는 분류도 반드시 비행기 날개 관련 기술이어야 해.
이전 생성한 분류체계가 있다면 요청에 따라 새로운 체계를 생성하는 것이 아닌 기존 분류체계에서 수정하여 반영해줘.
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
        print("메모리 내용:", memory.load_memory_variables)

        # Chain 만들기
        chain = RunnableMap({
            "chat_history": memory.load_memory_variables,
            "user_input": RunnablePassthrough()
        }) | prompt | llm | output_parser

        # Chain 실행
        response = await chain.ainvoke({"user_input": conv.query})
        print(f"Running chain with input: {conv.query}")
        print(f"Chain response type: {type(response)}")
        print(f"Chain response: {response[0]}")

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
    return {"standard": standards}


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