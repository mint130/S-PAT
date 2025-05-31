import logging
import pandas as pd
import pickle
import os
from app.core.celery import celery_app
from app.core.redis import get_redis_client
from app.services.celery_classification import process_patent_classification_evaluation

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@celery_app.task
def start_llm_classification_task(session_id, LLM):
    """단일 LLM에 대한 특허 분류 평가 작업 시작"""

    # 임시 저장된 데이터프레임 로드
    with open(f"./temp_data/{session_id}.pkl", "rb") as f:
        df = pickle.load(f)

    logger.info("LLM마다 함수 호출")
    # 실제 분류 처리 함수 호출
    process_patent_classification_evaluation(session_id, LLM, df)
    
    return {"status": "processing", "LLM": LLM, "session_id": session_id}