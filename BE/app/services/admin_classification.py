import asyncio
from datetime import datetime
import logging
import json
import math
import re
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
from fastapi import Depends, HTTPException
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.output_parsers import PydanticOutputParser
from app.core.redis import get_redis_client
from app.schemas.classification import ClassificationSchema, Patent
from app.core.config import settings
from app.core.llm import classification_llms, reasoning_llms
from app.schemas.message import Message, Progress

logger = logging.getLogger(__name__)

# 유사도 평가 기준점 설정
THRESHOLD = 0.5  # 단일 임계값으로 변경

async def classify_with_llm(llm: Any, retriever: Any, patent_info: str) -> Dict[str, str]:
    """
    특정 LLM을 사용하여 특허를 분류합니다.
    """
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
    def format_docs(docs: List[Any]) -> str:
        formatted_docs = []
        for doc in docs:
            metadata = doc.metadata
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
    
    # 체인 실행
    result = await rag_chain.ainvoke(patent_info)
    
    # 결과 파싱
    try:
        cleaned = re.sub(r"```(?:json)?\s*([\s\S]+?)\s*```", r"\1", result.strip())
        parsed = json.loads(cleaned)

        return {
            "majorCode": parsed.get("majorCode", "미분류"),
            "majorTitle": parsed.get("majorTitle", "미분류"),
            "middleCode": parsed.get("middleCode", "미분류"),
            "middleTitle": parsed.get("middleTitle", "미분류"),
            "smallCode": parsed.get("smallCode", "미분류"),
            "smallTitle": parsed.get("smallTitle", "미분류"),
        }

    except Exception as e:
        logger.error(f"분류 결과 파싱 중 오류: {str(e)}")
        return {
            "majorCode": "미분류",
            "middleCode": "미분류",
            "smallCode": "미분류",
            "majorTitle": "미분류",
            "middleTitle": "미분류",
            "smallTitle": "미분류"
        }

async def evaluate_classification_by_vector(
    patent_info: str,
    classification_result: Dict[str, str],
    retriever: Any
) -> Dict[str, Any]:
    """
    벡터 기반 유사도로 분류 결과를 평가합니다.
    가장 유사한 문서 하나만을 사용하여 평가합니다.
    """
    # 1. 특허 정보와 가장 유사한 분류 체계 검색 (유사도 점수 포함)
    vectorstore = retriever.vectorstore
    
    similar_docs_with_score = await vectorstore.asimilarity_search_with_relevance_scores(patent_info, k=1)
    best_match, best_score = similar_docs_with_score[0]
    
    # numpy 타입을 Python 기본 타입으로 변환하고 0~1 사이로 정규화
    best_score = float(best_score)
    normalized_score = (best_score + 1) / 2  # -1~1 범위를 0~1 범위로 변환
    
    # 2. 평가 로직
    # LLM이 미분류로 분류한 경우
    is_unclassified = (
        classification_result["majorCode"] == "미분류" or
        classification_result["middleCode"] == "미분류" or
        classification_result["smallCode"] == "미분류"
    )
    
    # 평가 결과 결정
    if is_unclassified:
        # 미분류로 분류한 경우
        if normalized_score < THRESHOLD:
            # 유사도가 기준점보다 낮으면 미분류가 정확
            is_correct = True
            reason = f"유사도({normalized_score:.2f})가 기준점({THRESHOLD}) 미만이므로 미분류가 정확함"
        elif normalized_score == THRESHOLD:
            # 유사도가 기준점보다 낮으면 미분류가 정확
            is_correct = True
            reason = "분류 결과가 일치함"
        else:
            # 유사도가 기준점보다 높으면 미분류가 부정확
            is_correct = False
            reason = f"유사도({normalized_score:.2f})가 기준점({THRESHOLD}) 이상이므로 분류가 필요함"
    else:
        # 일반 분류의 경우
        if normalized_score < THRESHOLD:
            # 유사도가 기준점보다 낮으면 분류가 부정확
            is_correct = False
            reason = f"유사도({normalized_score:.2f})가 기준점({THRESHOLD}) 미만이므로 미분류여야 함"
        else:
            # 유사도가 기준점보다 높으면 분류 결과 비교
            is_correct = (
                classification_result["majorCode"] == best_match.metadata.get("grand_parent_code", "미분류") and
                classification_result["middleCode"] == best_match.metadata.get("parent_code", "미분류") and
                classification_result["smallCode"] == best_match.metadata.get("code", "미분류")
            )
            reason = "분류 결과가 일치함" if is_correct else "분류 결과가 일치하지 않음"
    
    # 3. 평가 결과 구성
    level = best_match.metadata.get("level", "")
    
    # 레벨에 따라 적절한 메타데이터 매핑
    if level == "대분류":
        major_code = best_match.metadata.get("code", "미분류")
        major_title = best_match.metadata.get("name", "미분류")
        middle_code = "미분류"
        middle_title = "미분류"
        small_code = "미분류"
        small_title = "미분류"
    elif level == "중분류":
        major_code = best_match.metadata.get("parent_code", "미분류")
        major_title = best_match.metadata.get("parent_name", "미분류")
        middle_code = best_match.metadata.get("code", "미분류")
        middle_title = best_match.metadata.get("name", "미분류")
        small_code = "미분류"
        small_title = "미분류"
    elif level == "소분류":
        major_code = best_match.metadata.get("grand_parent_code", "미분류")
        major_title = best_match.metadata.get("grand_parent_name", "미분류")
        middle_code = best_match.metadata.get("parent_code", "미분류")
        middle_title = best_match.metadata.get("parent_name", "미분류")
        small_code = best_match.metadata.get("code", "미분류")
        small_title = best_match.metadata.get("name", "미분류")
    else:
        major_code = "미분류"
        major_title = "미분류"
        middle_code = "미분류"
        middle_title = "미분류"
        small_code = "미분류"
        small_title = "미분류"

    evaluation = {
        "similarity_score": normalized_score,
        "best_match": {
            "majorCode": major_code,
            "majorTitle": major_title,
            "middleCode": middle_code,
            "middleTitle": middle_title,
            "smallCode": small_code,
            "smallTitle": small_title
        },
        "llm_classification": classification_result,
        "evaluation": {
            "is_correct": is_correct,
            "reason": reason
        }
    }
    
    return evaluation

async def calculate_vector_based_score(
    patent_evaluations: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    벡터 기반 유사도 평가와 Reasoning LLM 평가의 최종 점수만 계산합니다.
    간소화된 결과를 반환합니다.
    """
    total_patents = len(patent_evaluations)
    
    # 벡터 기반 평가 점수 계산
    vector_correct_classifications = sum(
        1 for eval in patent_evaluations 
        if eval["vector_based"]["evaluation"]["is_correct"] == True
    )
    vector_accuracy = (vector_correct_classifications / total_patents) * 100
    
    # Reasoning LLM 평가 점수 계산 (평균 점수)
    reasoning_scores = [
        eval["reasoning"]["score"] 
        for eval in patent_evaluations
    ]
    reasoning_average_score = sum(reasoning_scores) / total_patents * 100
    
    # 간소화된 평가 점수만 반환
    return {
        "total_patents": total_patents,
        "vector_accuracy": vector_accuracy,
        "reasoning_score": reasoning_average_score
    }

# SSE 포함 분류 함수
async def process_patent_classification(
    session_id: str,
    df: pd.DataFrame,
    retriever: Any,
    llm_type: str,
    progress_queue: asyncio.Queue
):
    """
    특허 데이터를 처리하고 분류합니다.
    """
    try:    
        redis = get_redis_client()
        # 분류용 LLM 선택
        llm = classification_llms.get(llm_type.lower())
        if not llm:
            raise HTTPException(status_code=400, detail=f"지원하지 않는 LLM 타입입니다: {llm_type}")

        patents: List[Patent] = []
        evaluations: List[Dict[str, Any]] = []

        total_patents = len(df)
        
        # 로그 추가
        start_time = datetime.now()
        logger.info(f"[{session_id}] 분류 및 평가 시작 시간: {start_time}")

        # 각 행에 대해 RAG 처리 및 분류
        for index, row in df.iterrows():
            # 출원번호와 특허 정보 확인
            application_number = str(row.get('출원번호', f"KR10-XXXX-{index:07d}"))
            title = str(row.get('특허명', row.get('발명의 명칭', '')))
            abstract = str(row.get('요약', ''))
            
            # 특허 정보가 없으면 다음 행으로
            if not title and not abstract:
                continue
                
            # 특허 정보 구성
            patent_info = f"특허명: {title} 요약: {abstract}"
            
            # RAG를 통한 분류
            classifications = await classify_with_llm(llm, retriever, patent_info)
            def replace_na(value):
                return value if value and value != "N/A" else "미분류"
        
            # 특허 정보 구성
            patent_data = Patent(
                applicationNumber=application_number,
                title=title,
                abstract=abstract,
                majorCode=replace_na(classifications["majorCode"]),
                middleCode=replace_na(classifications["middleCode"]),
                smallCode=replace_na(classifications["smallCode"]),
                majorTitle=replace_na(classifications["majorTitle"]),
                middleTitle=replace_na(classifications["middleTitle"]),
                smallTitle=replace_na(classifications["smallTitle"])
            )
            logger.info(f"[{session_id}_{llm_type}] 분류된 특허: {patent_data.model_dump()}")

            # redis에 저장
            patents_key=f"{session_id}:{llm_type}:patents"
            redis.rpush(patents_key, patent_data.model_dump_json())
            
            patents.append(patent_data)

            # 벡터 기반 평가 수행
            vector_evaluation = await evaluate_classification_by_vector(
                patent_info,
                classifications,
                retriever
            )
            
            # 각 LLM의 Reasoning 모델로 평가 수행
            reasoning_evaluation = await evaluate_classification_by_reasoning(
                patent_info,
                classifications,
                retriever,
                llm_type
            )

            # reason 값만 추출해서 redis에 저장
            reasoning_key=f"{session_id}:{llm_type}:reasoning"
            redis.rpush(reasoning_key, json.dumps(reasoning_evaluation, ensure_ascii=False))
            
            # 통합 평가 결과
            evaluation = {
                "vector_based": vector_evaluation,
                "reasoning": reasoning_evaluation
            }
            logger.info(f"[{session_id}_{llm_type}] 특허 분류 평가: {json.dumps(evaluation, ensure_ascii=False)}")
            evaluations.append(evaluation)

            # 진행률 업데이트
            progress_data = Progress(
                    current=index + 1,
                    total=total_patents,
                    percentage=round(((index + 1) / total_patents) * 100, 2),
            )
            await progress_queue.put(progress_data.model_dump())
        
            # time.sleep(0.5)
            await asyncio.sleep(0.5)
        
        # 분류 결과 만료 시간 설정
        redis.expire(patents_key, 86400)
        redis.expire(reasoning_key, 86400)
        
        # 종료 시간 기록
        end_time = datetime.now()
        elapsed = end_time - start_time
        logger.info(f"[{session_id}] 분류 및 평가 종료 시간: {end_time}")
        logger.info(f"[{session_id}] 분류 및 평가 소요 시간: {elapsed} (총 {elapsed.total_seconds():.2f}초)")
        
        # 걸린 시간 redis에 저장
        time_key = f"{session_id}:{llm_type}:time"
        redis.set(time_key, elapsed.total_seconds())
        redis.expire(time_key, 86400)

        # 최종 평가 점수 계산 (간소화된 버전)
        evaluation_score = await calculate_vector_based_score(evaluations)
        
        # Redis에 간소화된 평가 점수만 저장
        evaluation_key = f"{session_id}:{llm_type}:evaluation"
        simplified_evaluation = {
            "vector_accuracy": evaluation_score["vector_accuracy"],
            "reasoning_score": evaluation_score["reasoning_score"]
        }
        
        redis.set(evaluation_key, json.dumps(simplified_evaluation, ensure_ascii=False))

        # 평과 결과 만료 시간 설정
        redis.expire(evaluation_key, 86400)
        
        # 작업 완료 메시지
        completion_data = Message(
            status="completed",
            message="분류 및 평가 작업이 완료되었습니다.",
        )

        await progress_queue.put(completion_data.model_dump())  

    except  Exception as e:
        # 오류가 발생한 경우 메시지 전송
        error_message = Message(
            status="error",
            message=f"오류가 발생했습니다: {str(e)}"
        )
       
        await progress_queue.put(error_message.model_dump())

async def evaluate_classification_by_reasoning(
    patent_info: str,
    classification_result: Dict[str, str],
    retriever: Any,
    llm_type: str
) -> Dict[str, Any]:
    """
    각 LLM의 Reasoning 모델을 사용하여 분류 결과를 평가합니다.
    0.0~1.0 사이의 점수로 평가합니다.
    """
    # Reasoning LLM 선택
    llm = reasoning_llms.get(llm_type.lower())
    if not llm:
        raise HTTPException(status_code=400, detail=f"지원하지 않는 LLM 타입입니다: {llm_type}")

    # 유사도 기반 분류 체계 검색
    similar_docs = await retriever.ainvoke(patent_info)
    
    # 유사도 기반 분류 체계 포맷팅
    similar_classifications = []
    for doc in similar_docs:
        metadata = doc.metadata
        classification = f"""
분류 체계:
- 대분류: {metadata.get('grand_parent_code', '')} ({metadata.get('grand_parent_name', '')})
- 중분류: {metadata.get('parent_code', '')} ({metadata.get('parent_name', '')})
- 소분류: {metadata.get('code', '')} ({metadata.get('name', '')})
- 설명: {metadata.get('description', '')}
"""
        similar_classifications.append(classification)
    
    similar_classifications_text = "\n---\n".join(similar_classifications)

    # 프롬프트 템플릿 정의
    template = """
    당신은 특허 분류 전문가입니다. 다음 특허의 분류 결과를 평가해주세요.
    특허 정보는 대상 특허 데이터의 특허명과 요약을 포함합니다.
    현재 분류 결과는 저장된 분류 체계를 기반으로 분류한 결과입니다.
    유사도 기반 추천 분류 체계는 분류 체계 중 특허 정보와 가장 유사한 3개의 분류입니다.
    당신의 목표는 이것들을 기준으로 이 특허 분류가 정확한지 평가하는 것입니다.
    평가 필수 요구 사항과 주의사항에 맞게 잘 평가해 주세요.
    
    [특허 정보]
    {patent_info}

    [현재 분류 결과]
    대분류: {major_code} ({major_title})
    중분류: {middle_code} ({middle_title})
    소분류: {small_code} ({small_title})

    [유사도 기반 추천 분류 체계]
    {similar_classifications}

    [평가 필수 요구 사항] (중요)
    1. 분석: 유사도 기반 추천 분류 체계와 현재 분류 결과를 비교하여 평가해야 합니다.
    2. 점수: 0.0, 0.5, 1.0 중 하나의 점수로 평가해야 합니다.
       - 0.0: 부적절한 분류
       - 0.5: 부분적으로 적절한 분류
       - 1.0: 완벽하게 적절한 분류
    3. 이유: 분석을 1줄 요약하여 작성해주세요.
    
    [응답 예시]
    분석: 분석 내용
    점수: 0.5
    이유: 유사도 기반 추천 분류 체계와 현재 분류 결과가 부분적으로 일치합니다.

    [주의사항]
    1. 반드시 분류 체계를 기반으로 평가해야 합니다.
    2. 분류 결과가 '미분류'인 경우, (중요)
        - 분류 체계에 없는 분류는 '미분류'로 간주합니다.
        - 주어진 분류 체계만으로 분류가 힘들 경우, '미분류'가 정답이 됩니다. 따라서 이런 경우 '미분류'는 높은 점수를 받습니다.
        - 반대로 주어진 분류 체계 내에서 분류가 가능한 경우, '미분류'는 낮은 점수를 받습니다.
    3. 응답은 평가 필수 요구 사항의 포맷 [1. 분석 2. 점수 3. 이유]를 반드시 지켜야 합니다.
    """

    prompt = ChatPromptTemplate.from_template(template)
    
    # 프롬프트에 값 채우기
    filled_prompt = prompt.format(
        patent_info=patent_info,
        major_code=classification_result["majorCode"],
        major_title=classification_result["majorTitle"],
        middle_code=classification_result["middleCode"],
        middle_title=classification_result["middleTitle"],
        small_code=classification_result["smallCode"],
        small_title=classification_result["smallTitle"],
        similar_classifications=similar_classifications_text
    )
    
    # 선택된 LLM 호출
    response = await llm.ainvoke(filled_prompt)
    
    # 응답에서 점수 추출 (0.0~1.0 사이의 숫자)
    try:
        score_match = re.search(r'(?:점수|score)[:：\s]*(\d*\.?\d+)', response.content, re.IGNORECASE)
        if score_match:
            score = float(score_match.group(1))
            # 0.0~1.0 범위로 정규화
            score = max(0.0, min(1.0, score))
        else:
            # 이유(reason) 추출
            reason_match = re.search(r"이유.*?[:：\s]\s*(.+?)(?:\n##|$)", response.content, re.DOTALL)
            reason = reason_match.group(1).strip() if reason_match else response.content
            logger.warning(f"점수를 찾을 수 없어 LLM에 이유를 재질문합니다. reason: {reason}")
            score = await get_score_from_reason_with_llm(reason, llm)
    except Exception as e:
        logger.error(f"점수를 추출 중 오류 발생: {str(e)}")
        score = 0.0

    # 응답에서 평가 이유 추출
    reason_match = re.search(r"이유.*?[:：\s]\s*(.+?)(?:\n##|$)", response.content, re.DOTALL)
    reason = reason_match.group(1).strip() if reason_match else ""
    logger.info(reason)

    return {
        "score": score,
        "reason": reason
    }

def calculate_sample_size(total_population: int, confidence_level: float, margin_error: float) -> int:
    """
    Cochran의 공식을 사용하여 필요한 샘플 크기를 계산합니다.
    
    Args:
        total_population (int): 전체 모집단 크기
        confidence_level (float): 신뢰도 (0.8 ~ 0.99)
        margin_error (float): 허용 오차 범위 (0.01 ~ 0.1)
    
    Returns:
        int: 필요한 샘플 크기
    """
    # Z-score 계산 (신뢰도에 따른)
    z_scores = {
        0.80: 1.282,
        0.85: 1.440,
        0.90: 1.645,
        0.95: 1.960,
        0.99: 2.576
    }
    z_score = z_scores.get(confidence_level, 1.960)  # 기본값 95% 신뢰도
    
    # p = 0.5 (최대 표본 크기를 위한 보수적 추정)
    p = 0.5
    q = 1 - p
    
    # Cochran의 공식 적용
    sample_size = (z_score ** 2 * p * q) / (margin_error ** 2)
    
    # 유한 모집단 보정 적용
    if total_population > 0:
        sample_size = sample_size / (1 + (sample_size - 1) / total_population)
    
    # 표본 크기가 모집단 크기보다 크지 않도록 보정 (반올림 적용)
    sample_size = min(round(sample_size), total_population)
    
    return sample_size

async def get_score_from_reason_with_llm(reason_text, llm):
    prompt = (
        f"다음 설명은 분류에 대한 평가의 이유야. 이 설명을 보고 0.0, 0.5, 1.0 중 어떤 점수를 줬을지 추측해줘."
        f"설명: {reason_text}"
        f"점수만 숫자로 답변해줘."
    )
    response = await llm.ainvoke(prompt)
    import re
    match = re.search(r"\d*\.?\d+", response.content)
    if match:
        score = float(match.group())
        return max(0.0, min(1.0, score))
    else:
        return 0.5  # 기본값
