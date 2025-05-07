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
    file: str = Field(..., description="처리된 엑셀 파일 (Base64 인코딩)")
    contentType: str = Field(default="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", description="파일 타입")
    patents: List[Patent] = Field(..., description="처리된 특허 정보 목록")