import logging
import os
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.schema.runnable import RunnableMap
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

# LLM 모델 초기화
llm = ChatOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    model_name="gpt-4",
    temperature=0
)

# JSON 출력 파서 초기화
output_parser = JsonOutputParser()

# 프롬프트 템플릿 정의
template = """
당신은 특허 분류 체계를 제작하는 특허 분류 전문가입니다.
당신은 유저의 요청과 필수 규칙에 따라 특허 분류 체계를 상세히 작성해야 합니다.
엑셀 파일의 기존 분류 체계와 이전 생성한 분류 체계에서 확장/수정하는 방식으로 분류 체계를 생성해야 합니다.

[엑셀 파일의 기존 분류 체계]
{excel_data}

[이전 생성한 분류 체계]
{chat_history}

[유저의 요청]
{user_input}

[필수 규칙]
1. 응답은 반드시 JSON 배열 형태로만 반환해야 합니다. 다른 텍스트나 설명을 포함하지 마세요.
2. 각 항목은 code, level, name, description 필드만 무조건 포함해야 한다.
3. 각 코드는 계층 구조를 따라야 한다.
    예를 들어, 대분류: A01, 중분류: A01-01, 소분류: A01-01-01
4. 엑셀 파일의 기존 분류 체계가 있다면, 반드시 그 주제와 도메인을 유지하면서 확장해야 한다.
5. 이전 생성한 분류 체계가 있다면, 반드시 그 주제와 도메인을 유지하면서 확장해야 한다.
6. 이전 생성한 분류 체계가 있다면, 사용자의 요청에 따라 이전 생성한 분류 체계에서 수정하여 반영해야 한다.
7. 응답의 길이는 길어도 좋다.
8. 변경 사항만 제시하는 것이 아니라 반드시 기존 분류 체계에서 확장/수정하는 방식으로 분류 체계를 생성해야 한다.

[응답 형식 예시]
[
  {{
    "code": "H01",
    "level": "대분류",
    "name": "휴머노이드 플랫폼",
    "description": "휴머노이드 전체 시스템에서 하드웨어 및 소프트웨어가 통합되어 작동하는 플랫폼 구조"
  }}
]
"""

prompt = PromptTemplate(
    input_variables=["excel_data", "chat_history", "user_input"],
    template=template
)

# 세션별 메모리 저장소
conversation_memories = {}

def get_memory(session_id: str) -> ConversationBufferMemory:
    """
    세션 ID에 해당하는 메모리를 가져오거나 새로 생성합니다.
    """
    if session_id not in conversation_memories:
        chat_history = ChatMessageHistory()
        conversation_memories[session_id] = ConversationBufferMemory(
            memory_key="chat_history",
            chat_memory=chat_history,
            return_messages=True
        )
    return conversation_memories[session_id]

async def process_with_llm(
    session_id: str,
    excel_data: List[Dict[str, Any]],
    user_input: str
) -> List[Dict[str, Any]]:
    """
    LLM을 사용하여 엑셀 데이터와 사용자 입력을 처리합니다.
    
    Args:
        session_id (str): 세션 ID
        excel_data (List[Dict[str, Any]]): 엑셀에서 추출한 데이터
        user_input (str): 사용자의 프롬프트 입력
        
    Returns:
        List[Dict[str, Any]]: 처리된 분류 체계 데이터
    """
    try:
        # 메모리 가져오기
        memory = get_memory(session_id)
        
        # Chain 구성
        chain = RunnableMap({
            "excel_data": lambda _: excel_data,
            "chat_history": memory.load_memory_variables,
            "user_input": RunnablePassthrough()
        }) | prompt | llm | output_parser
        
        # Chain 실행
        response = await chain.ainvoke({"user_input": user_input})
        
        # 메모리에 대화 저장
        memory.chat_memory.add_user_message(user_input)
        memory.chat_memory.add_ai_message(response)
        
        return response
        
    except Exception as e:
        logger.error(f"Error in process_with_llm: {str(e)}")
        raise e
