from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.schemas.classification import Patent

class LLMClassificationSample(BaseModel):
    applicationNumber: str
    title: str
    abstract: str
    majorCode: str
    middleCode: str
    smallCode: str
    majorTitle: str
    middleTitle: str
    smallTitle: str

class LLMClassificationResult(BaseModel):
    name: str  # LLM 이름 (gpt, claude, gemini, grok3 등)
    speed: Optional[float] = None  # 처리 속도(초)
    similarity: Optional[float] = None  # 유사도(0~1)
    llmEval: Optional[float] = None  # LLM 자체 평가(0~1)
    sample: List[LLMClassificationSample]
    patents: List[Patent]
    evaluation_score: Dict[str, Any]

class MultiLLMClassificationResponse(BaseModel):
    results: List[LLMClassificationResult] 