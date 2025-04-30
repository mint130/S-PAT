import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException
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

load_dotenv()

standard_router = APIRouter(prefix="/standard")

llm = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), temperature=0)

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
휴머노이드의 전원 시스템과 에너지 회수 기술에 대해 분류 체계를 만들어줘.

정답:
[
  {{
    "code": "H01-02",
    "level": "중분류",
    "name": "전원 및 배터리 시스템",
    "description": "휴머노이드 내부 전자 시스템과 모터를 작동시키기 위한 에너지를 공급하는 전원 시스템. 휴대성과 안정성 고려."
  }},
  {{
    "code": "H01-02-01",
    "level": "소분류",
    "name": "고출력 리튬이온 배터리",
    "description": "고출력 밀도의 리튬이온 배터리를 적용하여 장시간 사용 및 고속 충전 기능을 지원하는 전원 기술."
  }},
  {{
    "code": "H01-02-02",
    "level": "소분류",
    "name": "에너지 회수 시스템",
    "description": "휴머노이드의 움직임이나 제동 시 발생하는 에너지를 회수하여 배터리 효율을 높이는 기술."
  }}
]


[유저의 요청]
{user_input}

유저의 요청에 맞게 분류 체계를 생성해서 JSON 배열 형태로 반환해줘. 
각 항목은 code, level, name, description 필드를 포함해야 해. 
각 코드는 계층 구조(대분류: H01, 중분류: H01-01, 소분류: H01-01-01)를 따라야 해.
요청한 개수만큼 생성해줘.
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
        if session_id not in conversation_memories:
            conversation_memories[session_id] = ConversationBufferMemory(memory_key="chat_history")
        memory = conversation_memories[session_id]

        # 메모리에 입력 저장
        memory.chat_memory.add_user_message(conv.query)

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