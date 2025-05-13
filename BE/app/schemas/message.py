from pydantic import BaseModel, Field

class Progress(BaseModel):
    current: int = Field(..., description="현재 진행 중인 특허 순번")
    total: int = Field(..., description="전체 특허 개수")
    percentage: float = Field(..., description="진행률(%)")

class Message(BaseModel):
    status: str = Field(..., )
    message: str = Field(..., )