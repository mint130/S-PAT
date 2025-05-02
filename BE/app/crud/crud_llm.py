from typing import List
import os
from openai import OpenAI
from app.schemas.excel import StandardItem
from app.crud.crud_excel import process_excel_file
from fastapi import UploadFile, HTTPException

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def process_standards_with_llm(file: UploadFile, query: str) -> tuple[List[StandardItem], str]:
    try:
        # 엑셀 파일 처리
        standards = await process_excel_file(file)
        
        # GPT 프롬프트 구성
        prompt = f"""
다음은 기술 분류 체계입니다:

{[{
    "code": item.code,
    "level": item.level,
    "name": item.name,
    "description": item.description
} for item in standards]}

사용자 질문: {query}

위 분류 체계를 참고하여 사용자의 질문에 답변해주세요. 
답변은 반드시 주어진 분류 체계 내에서 적절한 항목을 선택하여 제시해야 합니다.
선택한 항목들은 원래 형식을 그대로 유지하여 JSON 배열 형태로 반환해주세요.
"""

        # GPT API 호출
        response = client.chat.completions.create(
            model="gpt-4-turbo-preview",  # 또는 다른 적절한 모델
            messages=[
                {"role": "system", "content": "당신은 기술 분류 체계 전문가입니다. 주어진 분류 체계를 기반으로 사용자의 질문에 답변해주세요."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
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