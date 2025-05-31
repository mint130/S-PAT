from typing import Any, Dict, List
from fastapi import UploadFile
from pydantic import BaseModel, Field

# 특허 정보를 위한 Pydantic 모델
class Patent(BaseModel):
    applicationNumber: str = Field(..., description="특허 출원 번호")
    title: str = Field(..., description="특허명")
    abstract: str = Field(..., description="요약")
    majorCode: str = Field(..., description="대분류 코드")
    middleCode: str = Field(..., description="중분류 코드")
    smallCode: str = Field(..., description="소분류 코드")
    majorTitle: str = Field(..., description="대분류 명칭")
    middleTitle: str = Field(..., description="중분류 명칭")
    smallTitle: str = Field(..., description="소분류 명칭")

class ClassificationRequest(BaseModel):
    file: UploadFile


class ClassificationResponse(BaseModel):
    patents: List[Patent] = Field(..., description="처리된 특허 정보 목록")

class ClassificationSchema(BaseModel):
    majorCode: str
    majorTitle: str
    middleCode: str
    middleTitle: str
    smallCode: str
    smallTitle: str

class LLMClassificationResult(BaseModel):
    name: str = Field(..., description="LLM 이름 (GPT, Claude, Gemini, Grok)")
    patents: List[Patent] = Field(..., description="분류된 특허 목록")
    evaluation_score: Dict[str, Any] = Field(..., description="벡터 기반 유사도 평가 점수")

class MultiLLMClassificationResponse(BaseModel):
    results: List[LLMClassificationResult] = Field(..., description="각 LLM의 분류 결과 목록")

class SampledClassificationResponse(BaseModel):
    """샘플링된 분류 결과 및 평가 점수 응답 모델"""
    sampling_info: Dict[str, Any] = Field(..., description="샘플링 정보 (총 특허 수, 샘플 크기, 신뢰도, 오차 범위, 인덱스)")
    results: List[Dict[str, Any]] = Field(..., description="각 LLM의 샘플링된 분류 결과 및 평가 점수, 걸리는 시간")