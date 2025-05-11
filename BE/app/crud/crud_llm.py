from typing import List
import os
from openai import OpenAI
from app.schemas.excel import StandardItem
from app.crud.crud_excel import process_excel_file
from fastapi import UploadFile, HTTPException
from app.schemas.llm import LLMClassificationResult, LLMClassificationSample, MultiLLMClassificationResponse
import asyncio
import time
from app.core.config import settings
import logging
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.schema.runnable import RunnableMap
#from anthropic import Anthropic
#import google.generativeai as genai

logger = logging.getLogger(__name__)

# 각 LLM별 클라이언트(혹은 API 키) 준비
openai_api_key = settings.OPENAI_API_KEY
claude_api_key = settings.CLAUDE_API_KEY
gemini_api_key = settings.GEMINI_API_KEY
grok3_api_key = settings.GROK3_API_KEY

gpt_client = OpenAI(api_key=openai_api_key)
#claude_client = Anthropic(api_key=claude_api_key)
#genai.configure(api_key=gemini_api_key)
#gemini_model = genai.GenerativeModel("gemini-pro")

class LLMProcessor:
    def __init__(self):
        self.llm = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model_name="gpt-4o",
            temperature=0
        )
        self.output_parser = JsonOutputParser()
        self.prompt = PromptTemplate(
            input_variables=["standards", "query"],
            template="""
당신은 특허 분류 체계를 제작하는 특허 분류 전문가입니다.
다음은 기술 분류 체계입니다:

{standards}

사용자 질문: {query}

위 분류 체계를 참고하여 사용자의 질문에 답변해주세요. 
답변은 반드시 주어진 분류 체계 내에서 적절한 항목을 선택하여 제시해야 합니다.
선택한 항목들은 원래 형식을 그대로 유지하여 JSON 배열 형태로 반환해주세요.
"""
        )
        self.memories = {}

    def _get_memory(self, session_id: str) -> ConversationBufferMemory:
        if session_id not in self.memories:
            chat_history = ChatMessageHistory()
            self.memories[session_id] = ConversationBufferMemory(
                memory_key="chat_history",
                chat_memory=chat_history,
                return_messages=True
            )
        return self.memories[session_id]

    async def process_with_llm(self, standards: List[StandardItem], query: str, session_id: str) -> List[StandardItem]:
        try:
            # 메모리 가져오기
            memory = self._get_memory(session_id)
            
            # 메모리에 입력 저장
            memory.chat_memory.add_user_message(query)

            # Chain 구성
            chain = RunnableMap({
                "standards": lambda x: "\n".join([
                    f"코드: {item.code}, 단계: {item.level}, 명칭: {item.name}, 설명: {item.description}"
                    for item in standards
                ]),
                "query": RunnablePassthrough()
            }) | self.prompt | self.llm | self.output_parser

            # Chain 실행
            response = await chain.ainvoke({"query": query})
            
            # 메모리에 응답 저장
            memory.chat_memory.add_ai_message(response)

            # 응답 파싱
            processed_standards = self._parse_response(response)
            return processed_standards

        except Exception as e:
            logger.error(f"LLM 처리 중 오류 발생: {str(e)}")
            raise HTTPException(status_code=500, detail=f"LLM 처리 중 오류가 발생했습니다: {str(e)}")

    def _parse_response(self, response: str) -> List[StandardItem]:
        try:
            # JSON 문자열을 파싱하여 StandardItem 객체 리스트로 변환
            # 실제 구현에서는 response를 적절히 파싱하여 StandardItem 객체 리스트를 생성해야 함
            # 여기서는 임시로 빈 리스트 반환
            return []
        except Exception as e:
            logger.error(f"응답 파싱 중 오류 발생: {str(e)}")
            raise HTTPException(status_code=500, detail=f"응답 파싱 중 오류가 발생했습니다: {str(e)}")

# 싱글톤 인스턴스 생성
llm_processor = LLMProcessor()