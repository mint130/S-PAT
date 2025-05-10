from typing import Any, Dict, List
from fastapi import UploadFile
from pydantic import BaseModel, Field

from app.schemas.classification import Patent

class Progress(BaseModel):
    current: int = Field(..., description="현재 진행 중인 특허 순번")
    total: int = Field(..., description="전체 특허 개수")
    percentage: float = Field(..., description="진행률(%)")
    patent: Patent = Field(..., description="현재 처리 중인 특허 정보")

class CompletionMessage(BaseModel):
    status: str = Field(..., description="완료 상태")
    message: str = Field(..., description="완료 메시지")
    results: List[Patent] = Field(..., description="완료된 특허 정보 목록")

class Message(BaseModel):
    status: str = Field(..., )
    message: str = Field(..., )