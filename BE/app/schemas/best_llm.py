from pydantic import BaseModel

class LLMBase(BaseModel):
    # LLM 모델 기본 스키마
    LLM:str


class LLMCreate(LLMBase):
    # LLM 생성 스키마
    pass

class LLMResponse(LLMBase):
    # LLM 응답 스키마

    class Config:
        from_attributes = True