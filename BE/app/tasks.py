from datetime import datetime
import io
import json
import logging
import os
import pickle
import re
import time
from typing import Dict
from openai import RateLimitError as OpenAIRateLimitError
from anthropic import RateLimitError as ClaudeRateLimitError
from langchain_openai import OpenAIEmbeddings
from openpyxl import load_workbook
from openpyxl.styles import PatternFill
import pandas as pd
import requests
from app.core.celery import celery_app
from langchain_core.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.vectorstores import FAISS
from app.core.redis import get_redis_client
from app.schemas.classification import ClassificationSchema, Patent
from app.core.llm import gpt, claude, gemini, grok
from app.schemas.message import Message, Progress
from google.api_core import exceptions

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# LLM을 가져오는 함수
def get_llm_by_name(name: str):
    name = name.upper()
    if name == "GPT": 
        return gpt
    elif name == "CLAUDE": 
        return claude
    elif name == "GEMINI": 
        return gemini
    elif name == "GROK": 
        return grok
    else:
        raise ValueError(f"지원하지 않는 LLM 이름입니다: {name}")

# retriever을 가져오는 함수
def load_retriever_from_redis(session_id: str):
    redis = get_redis_client()
    path = redis.get(f"vectorstore:{session_id}:path")
    if path is None:
        raise Exception(f"{session_id}에 해당하는 벡터 저장소가 없습니다.")
    path = path.decode("utf-8") if isinstance(path, bytes) else path

    logger.info(f"FAISS index 경로: {path}")  # 경로 출력해서 확인

    embeddings = OpenAIEmbeddings(model="text-embedding-3-large", dimensions=3072)

    vector_store = FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)

    return vector_store.as_retriever(search_kwargs={"k": 3})


@celery_app.task(bind=True, retry_backoff=True, retry_backoff_max=10, retry_kwargs={'max_retries': 12})
def classify_patent(
    self,
    LLM: str, 
    session_id: str, 
    patent_info: str,
    application_number: str, 
 ) -> Dict[str, str]:
    redis = get_redis_client()
    logger.info("celery 시작")
    # retriever 가져옴
    retriever = load_retriever_from_redis(session_id)
    
    # llm 가져옴
    llm = get_llm_by_name(LLM)

    # 출력 파서 정의
    parser = PydanticOutputParser(pydantic_object=ClassificationSchema)
    
    # 프롬프트 템플릿 정의
    template = """
    다음은 특허 분류 데이터베이스에서 검색된 유사한 특허 정보입니다:
    
    {context}
    
    위 참고 정보를 바탕으로, 다음 특허 정보에 대한 대분류, 중분류, 소분류를 제공해주세요.
    대분류 코드와 명칭, 중분류 코드와 명칭, 소분류 코드와 명칭을 모두 포함해야 합니다.
    꼭 context안에 있는 기준으로 결과를 내세요.
    해당하는게 없으면 미분류로 결과 내세요.
    이유를 적지말고 응답 형식만 맞게 답 하세요.
    
    특허 정보: {query}
    
    너는 다음 JSON 형태로만 응답해야 해: {format_instructions}
    """
    prompt = ChatPromptTemplate.from_template(template)
    
    # 메타데이터를 포함한 형식으로 문서 포맷팅
    def format_docs(docs):
        formatted_docs = []
        for doc in docs:
            metadata = doc.metadata
            
            # 문서 레벨에 따라 다르게 포맷팅
            if metadata.get('level') == '중분류':
                formatted_doc = f"""
분류 정보:
- 코드: {metadata.get('code', '')}
- 명칭: {metadata.get('name', '')}
- 레벨: {metadata.get('level', '')}
- 상위 코드: {metadata.get('parent_code', '')}
- 상위 명칭: {metadata.get('parent_name', '')}
- 설명: {metadata.get('description', '')}

{doc.page_content}
"""
            elif metadata.get('level') == '소분류':
                formatted_doc = f"""
분류 정보:
- 코드: {metadata.get('code', '')}
- 명칭: {metadata.get('name', '')}
- 레벨: {metadata.get('level', '')}
- 상위 코드: {metadata.get('parent_code', '')}
- 상위 명칭: {metadata.get('parent_name', '')}
- 최상위 코드: {metadata.get('grand_parent_code', '')}
- 최상위 명칭: {metadata.get('grand_parent_name', '')}
- 설명: {metadata.get('description', '')}

{doc.page_content}
"""
            else:
                # 기타 레벨이나 메타데이터가 없는 경우
                formatted_doc = doc.page_content
                
            formatted_docs.append(formatted_doc)
            
        return "\n\n---\n\n".join(formatted_docs)
    
    rag_chain = (
        {
            "context": retriever | format_docs,
            "query": RunnablePassthrough(),
            "format_instructions": lambda _: parser.get_format_instructions()
        }
        | prompt
        | llm
        | StrOutputParser()
    )
    
    try:
        # 체인 실행
        logger.info(f"[{session_id}] rag_chain.invoke 시작")
        result = rag_chain.invoke(patent_info)
        logger.info(f"[{session_id}] rag_chain.invoke 완료")

        # 결과 파싱
        cleaned = re.sub(r"```(?:json)?\s*([\s\S]+?)\s*```", r"\1", result.strip())
        parsed = json.loads(cleaned)
        def replace_na(value):
            return value if value and value != "N/A" else "미분류"

        classifications = {
            "applicationNumber": application_number,  # 식별자 추가
            "majorCode": replace_na(parsed.get("majorCode")),
            "majorTitle": replace_na(parsed.get("majorTitle")),
            "middleCode": replace_na(parsed.get("middleCode")),
            "middleTitle": replace_na(parsed.get("middleTitle")),
            "smallCode": replace_na(parsed.get("smallCode")),
            "smallTitle": replace_na(parsed.get("smallTitle")),
        }
        
        # 진행률 업데이트
        progress_key = f"{session_id}:progress"
        current = redis.incr(f"{session_id}:progress_counter")  # +1 누적
        total = int(redis.get(f"{session_id}:total_count") or 1)
        percentage = int(current / total * 100)

        progress = Progress(
            current=current,
            total=total,
            percentage=percentage
        )

        redis.set(progress_key, progress.model_dump_json())
        redis.publish(progress_key, progress.model_dump_json())
        redis.expire(progress_key, 86400)

        return classifications
    
    except OpenAIRateLimitError as e:
        error_str = str(e)
        if 'rate_limit_exceeded' in error_str:
            # "Please try again in X.XXXs" 에서 시간 파싱
            logger.info(f"[{session_id}] OpenAI rate limit 발생")
            raise self.retry(countdown= 5)
        else:
            raise

    except ClaudeRateLimitError as e:
        error_str = str(e)
        logger.info(f"[{session_id}] Claude rate limit 발생")
        raise self.retry(countdown= 5)
    
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:
            logger.info(f"[{session_id}] Grok rate limit 발생")
            # 헤더에서 재시도 시간 확인
            retry_after = int(e.response.headers.get('Retry-After', 60))
            
            # X-RateLimit 헤더 정보 로깅
            limit = e.response.headers.get('X-RateLimit-Limit-Tokens', 'unknown')
            remaining = e.response.headers.get('X-RateLimit-Remaining-Tokens', 'unknown')
            reset = e.response.headers.get('X-RateLimit-Reset-Tokens', 'unknown')
            
            logger.info(f"[{session_id}] Grok Rate Limit 정보 - 한도: {limit}, 남은 토큰: {remaining}, 초기화: {reset}초 후")
            
            # 명시적 대기 시간이 있으면 해당 시간만큼 대기 후 재시도
            if retry_after:
                logger.warning(f"[{session_id}] Grok 명시적 대기: {retry_after}초")
                time.sleep(retry_after)
            
            raise self.retry(countdown= 5)
        else:
            logger.error(f"[{session_id}] HTTP 요청 에러 발생: {e}")
            raise

    except exceptions.ResourceExhausted as e:
        # gemini limit error
        if e.status_code == 429:
            logger.info(f"[{session_id}] Gemini rate limit 발생")
            # 지수 백오프
            logger.warning(f"[{session_id}] 백오프")
            raise self.retry(countdown= 5)
        else:
            logger.error(f"[{session_id}] 다른 Gemini API 에러 발생: {e}")
            raise

    except Exception as e:
        logger.error(f"[{session_id}] 분류 결과 처리 중 오류 발생: {e}")
        return {
            "applicationNumber": application_number,
            "majorCode": "미분류",
            "middleCode": "미분류",
            "smallCode": "미분류",
            "majorTitle": "미분류",
            "middleTitle": "미분류",
            "smallTitle": "미분류"
        }

@celery_app.task
def classification_completion(results, session_id):
    try:
        redis = get_redis_client()
        time_key = f"{session_id}:time"
        # 종료 시간
        end_time = datetime.now()
        start_time = redis.get(time_key)
        start_time = float(start_time)
        start_time = datetime.fromtimestamp(start_time)
        
        # 시간 저장
        elapsed = end_time - start_time
        redis.set(time_key, elapsed.total_seconds())
        redis.expire(time_key, 86400)  # 86400초 = 24시간

        # df 불러오기
        with open(f"./temp_data/{session_id}.pkl", "rb") as f:
            df = pickle.load(f)

        for result in results:
            logger.info(f"분류 결과: {result}")
    
            application_number = result["applicationNumber"]  # 식별자 추출
        
            # 데이터프레임에서 해당 application_number를 가진 행 찾기
            matching_rows = df[df['출원번호'] == application_number]

            if not matching_rows.empty:
                index = matching_rows.index[0]
                row = df.loc[index]

                title = row.get('특허명', row.get('발명의 명칭', ''))
                abstract = row.get('요약', '')

                # 원본 데이터프레임에 분류 결과 추가
                df.loc[index, '대분류코드'] = result["majorCode"]
                df.loc[index, '중분류코드'] = result["middleCode"]
                df.loc[index, '소분류코드'] = result["smallCode"]
                df.loc[index, '대분류명칭'] = result["majorTitle"]
                df.loc[index, '중분류명칭'] = result["middleTitle"]
                df.loc[index, '소분류명칭'] = result["smallTitle"]

                # 특허 정보 구성
                patent_data = Patent(
                    applicationNumber=application_number,
                    title=title,
                    abstract=abstract,
                    majorCode=result["majorCode"],
                    middleCode=result["middleCode"],
                    smallCode=result["smallCode"],
                    majorTitle=result["majorTitle"],
                    middleTitle=result["middleTitle"],
                    smallTitle=result["smallTitle"]
                )
                redis.rpush(session_id, patent_data.model_dump_json())
                redis.expire(session_id, 86400)
            else:
                logger.warning(f"출원번호 {application_number}에 해당하는 행을 찾을 수 없음")

        # 임시 파일명 생성
        filename = f"{session_id}_classified.xlsx"
        save_path = f"./classified_excels/{filename}"

        # 저장 디렉토리 확인
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # 먼저 데이터프레임을 엑셀로 저장
        buffer = io.BytesIO()
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name="Sheet1")
        buffer.seek(0)

        # 헤더 노란색 처리
        wb = load_workbook(buffer)
        ws = wb.active
        yellow_fill = PatternFill(start_color="FFFF00", end_color="FFFF00", fill_type="solid")
        for cell in ws[1]:
            cell.fill = yellow_fill

        # 저장
        wb.save(save_path)

        # 알림
        message = Message(
            status="completed",
            message="분류 작업이 완료되었습니다."
        )
        redis.publish(f"{session_id}:progress", message.model_dump_json())
        redis.set(f"{session_id}:progress", message.model_dump_json())
        redis.expire(f"{session_id}:progress", 86400)

    except Exception as e:
        logger.error(f"[{session_id}] 분류 결과 처리 중 오류 발생: {e}")
        message = Message(
            status="error",
            message=f"분류 작업 중 오류가 발생했습니다: {str(e)}"
        )
        redis.publish(f"{session_id}:progress", message.model_dump_json())
        redis.set(f"{session_id}:progress", message.model_dump_json())
        return False