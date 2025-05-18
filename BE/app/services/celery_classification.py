from datetime import datetime
import logging
import time
from celery import chain, chord, group
from langchain_openai import OpenAIEmbeddings
import pandas as pd
from langchain_community.vectorstores import FAISS
from app.schemas.message import Progress
from app.tasks import classification_completion, classify_patent, collect_evaluation_results, evaluate_classification_by_reasoning, evaluate_classification_by_vector, evaluation_completion

# 로그
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 특허 분류 작업을 celery에서 실행하는 함수
def process_patent_classification(
    session_id: str,
    LLM: str,
    df: pd.DataFrame,
    redis,
): 
    logger.info(f"호출 완료")

    logger.info(f"시작")
    total_patents = len(df)
    
    # 초기 진행률 설정 (0%)
    progress_data = Progress(
        current=0,
        total=total_patents,
        percentage=0,
    )

    # 로그 추가
    start_time = datetime.now()
    logger.info(f"[{session_id}] 분류 시작 시간: {start_time}")
        
    # 진행률, 시간 Redis에 저장
    redis.set(f"{session_id}:time", start_time.timestamp())
    redis.set(f"{session_id}:progress", progress_data.model_dump_json())
    redis.set(f"{session_id}:total_count", total_patents)
    redis.set(f"{session_id}:progress_counter", 0)
        
    # 개별 특허 분류 태스크 생성
    tasks = []

    # 각 행에 대해 RAG 처리 및 분류 추가
    for index, row in df.iterrows():
        try:
            application_number = row.get('출원번호', f"KR10-XXXX-{index:07d}")
            title = row.get('특허명', row.get('발명의 명칭', ''))
            abstract = row.get('요약', '')

            if not title and not abstract:
                logger.warning(f"[{index}] 제목과 요약이 비어있어 건너뜀")
                continue

            patent_info = f"특허명: {title} 요약: {abstract}"

            # celery 
            logger.info(f"[{index}] Celery 태스크 시작")
            tasks.append(
                classify_patent.s(LLM, session_id, patent_info, application_number, False)
            )   
        
        except Exception as e:
            logger.error(f"[{index}] 에러 발생: {e}")

    redis.expire(f"{session_id}:time", 86400)
    redis.expire(f"{session_id}:progress", 86400)
    redis.expire(f"{session_id}:total_count", 86400)
    redis.expire(f"{session_id}:progress_counter", 86400)

    chord(group(tasks))(classification_completion.s(session_id))    
        
def process_patent_classification_evaluation(
    session_id: str,
    LLM: str,
    df: pd.DataFrame,
    redis,
): 
    logger.info(f"호출 완료")

    logger.info(f"시작")
    total_patents = len(df)
    
    # 초기 진행률 설정 (0%)
    progress_data = Progress(
        current=0,
        total=total_patents,
        percentage=0,
    )

    key = f"{session_id}:{LLM}"
    # 로그 추가
    start_time = datetime.now()
    logger.info(f"[{key}] 분류 시작 시간: {start_time}")
        
    # 진행률, 시간 Redis에 저장
    redis.set(f"{key}:time", start_time.timestamp())
    redis.set(f"{key}:progress", progress_data.model_dump_json())
    redis.set(f"{key}:total_count", total_patents)
    redis.set(f"{key}:progress_counter", 0)
        
    # 개별 특허 분류 태스크 생성
    tasks = []

    # 각 행에 대해 RAG 처리 및 분류 추가
    for index, row in df.iterrows():
        try:
            application_number = row.get('출원번호', f"KR10-XXXX-{index:07d}")
            title = row.get('특허명', row.get('발명의 명칭', ''))
            abstract = row.get('요약', '')

            if not title and not abstract:
                logger.warning(f"[{index}] 제목과 요약이 비어있어 건너뜀")
                continue

            patent_info = f"특허명: {title} 요약: {abstract}"

            # celery 
            logger.info(f"[{index}] Celery 태스크 시작")
            
            # 특허 분류
            initial_task = classify_patent.s(LLM, session_id, patent_info, application_number, True)
            
            # 평가 실행
            evaluation_tasks = group(
                evaluate_classification_by_vector.s(LLM, session_id, patent_info, application_number),
                evaluate_classification_by_reasoning.s(LLM, session_id, patent_info, application_number)
            )

            # 진행률 업데이트
            finalize_task = collect_evaluation_results.s(LLM, session_id, application_number)

            workflow = chain(
                initial_task,
                evaluation_tasks,
                finalize_task
            )

            tasks.append(workflow)

        except Exception as e:
            logger.error(f"[{index}] 에러 발생: {e}")

    redis.expire(f"{key}:time", 86400)
    redis.expire(f"{key}:progress", 86400)
    redis.expire(f"{key}:total_count", 86400)
    redis.expire(f"{key}:progress_counter", 86400)

    chord(group(tasks))(evaluation_completion.s(LLM, session_id))    
