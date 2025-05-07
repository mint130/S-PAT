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
from anthropic import Anthropic
import google.generativeai as genai

# 각 LLM별 클라이언트(혹은 API 키) 준비
openai_api_key = settings.OPENAI_API_KEY
claude_api_key = settings.CLAUDE_API_KEY
gemini_api_key = settings.GEMINI_API_KEY
grok3_api_key = settings.GROK3_API_KEY

gpt_client = OpenAI(api_key=openai_api_key)
claude_client = Anthropic(api_key=claude_api_key)
genai.configure(api_key=gemini_api_key)
gemini_model = genai.GenerativeModel("gemini-pro")


async def process_standards_with_llm(file: UploadFile, query: str) -> tuple[List[StandardItem], str]:
    try:
        # 엑셀 파일 처리
        standards = await process_excel_file(file)
        
        # GPT 프롬프트 구성
        prompt = f"""
다음은 기술 분류 체계입니다:

{[{{
    "code": item.code,
    "level": item.level,
    "name": item.name,
    "description": item.description
}} for item in standards]}

사용자 질문: {query}

위 분류 체계를 참고하여 사용자의 질문에 답변해주세요. 
답변은 반드시 주어진 분류 체계 내에서 적절한 항목을 선택하여 제시해야 합니다.
선택한 항목들은 원래 형식을 그대로 유지하여 JSON 배열 형태로 반환해주세요.
"""

        # GPT API 호출
        response = gpt_client.chat.completions.create(
            model="gpt-4o",  # 또는 다른 적절한 모델
            messages=[
                {"role": "system", "content": "당신은 기술 분류 체계 전문가입니다. 주어진 분류 체계를 기반으로 사용자의 질문에 답변해주세요."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )

        # GPT 응답 처리
        try:
            gpt_response = response.choices[0].message.content
            # JSON 문자열을 파싱하여 StandardItem 객체 리스트로 변환하는 로직 필요
            # 이 부분은 GPT의 응답 형식에 따라 적절히 구현해야 함
            
            return standards, gpt_response
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"GPT 응답 처리 중 오류가 발생했습니다: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"처리 중 오류가 발생했습니다: {str(e)}")


# --- 여러 LLM을 비동기로 호출하는 함수 ---
async def classify_patent_with_multiple_llms(patent_data: List[dict], options: dict = None) -> MultiLLMClassificationResponse:
    # 각 LLM별 분류 함수 호출 (비동기)
    tasks = [
        classify_with_gpt(patent_data, options),
        classify_with_claude(patent_data, options),
        classify_with_gemini(patent_data, options),
        classify_with_grok3(patent_data, options)
    ]
    results = await asyncio.gather(*tasks)
    return MultiLLMClassificationResponse(results=results)

# --- 각 LLM별 분류 함수 (실제 API 연동) ---
async def classify_with_gpt(patent_data: List[dict], options: dict = None) -> LLMClassificationResult:
    start = time.time()
    # 프롬프트 구성 예시
    prompt = "GPT용 프롬프트 예시"
    response = gpt_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=2000
    )
    # 실제 응답 파싱 필요
    sample = [LLMClassificationSample(
        applicationNumber="KR10-2023-0045678",
        title="자연어처리모델을 이용한...",
        abstract="본 발명은...",
        majorCode="H04",
        middleCode="H04-01",
        smallCode="H04-01-01",
        majorTitle="인터페이스 및 인지 시스템",
        middleTitle="음성 인식 인터페이스",
        smallTitle="경량화 음성 모델"
    )]
    speed = time.time() - start
    return LLMClassificationResult(name="gpt", speed=speed, similarity=0.95, llmEval=0.9, sample=sample)

async def classify_with_claude(patent_data: List[dict], options: dict = None) -> LLMClassificationResult:
    start = time.time()
    prompt = "Claude용 프롬프트 예시"
    response = claude_client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )
    # 실제 응답 파싱 필요
    sample = [LLMClassificationSample(
        applicationNumber="KR10-2023-0098765",
        title="로봇 수술을 위한 시스템 및 방법",
        abstract="수술 기구와...",
        majorCode="H05",
        middleCode="H05-01",
        smallCode="H05-01-01",
        majorTitle="핸들(Hand) 기술",
        middleTitle="메커니컬 핸들",
        smallTitle="액추에이터 기반 관련 손"
    )]
    speed = time.time() - start
    return LLMClassificationResult(name="claude", speed=speed, similarity=0.92, llmEval=0.88, sample=sample)

async def classify_with_gemini(patent_data: List[dict], options: dict = None) -> LLMClassificationResult:
    start = time.time()
    prompt = "Gemini용 프롬프트 예시"
    response = gemini_model.generate_content(prompt)
    # 실제 응답 파싱 필요
    sample = [LLMClassificationSample(
        applicationNumber="KR10-2023-0012345",
        title="AI 기반 영상 처리 장치",
        abstract="영상 신호를...",
        majorCode="G06",
        middleCode="G06-01",
        smallCode="G06-01-01",
        majorTitle="영상 처리",
        middleTitle="딥러닝 영상 분석",
        smallTitle="경량화 영상 모델"
    )]
    speed = time.time() - start
    return LLMClassificationResult(name="gemini", speed=speed, similarity=0.93, llmEval=0.89, sample=sample)

async def classify_with_grok3(patent_data: List[dict], options: dict = None) -> LLMClassificationResult:
    start = time.time()
    prompt = "Grok3용 프롬프트 예시"
    client = OpenAI(
        api_key=grok3_api_key,
        base_url="https://api.x.ai/v1",
    )

    completion = client.chat.completions.create(
        model="grok-3-beta",
        messages=[
            {"role": "user", "content": "What is the meaning of life?"}
        ]
    )
    # 실제 응답 파싱 필요
    sample = [LLMClassificationSample(
        applicationNumber="KR10-2023-0076543",
        title="스마트 센서 네트워크",
        abstract="센서 데이터 처리...",
        majorCode="B07",
        middleCode="B07-01",
        smallCode="B07-01-01",
        majorTitle="센서 네트워크",
        middleTitle="스마트 센서",
        smallTitle="저전력 센서"
    )]
    speed = time.time() - start
    return LLMClassificationResult(name="grok3", speed=speed, similarity=0.91, llmEval=0.87, sample=sample) 