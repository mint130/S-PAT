from typing import Any, Dict
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON


class ConversationRequest(BaseModel):
    query: str

class ConversationResponse(BaseModel):
    standards: list

    model_config = {
        "from_attributes": True,  # 최신 Pydantic 버전에서는 orm_mode 대신 이걸 사용
        "arbitrary_types_allowed": True  # 이 옵션을 추가해서 문제 해결
    }

class SessionHistoryResponse(BaseModel):
    created_at: str
    query: str
    answer: Dict[str, Any]    
