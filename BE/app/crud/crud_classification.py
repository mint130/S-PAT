import logging
import json
import re
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
from fastapi import Depends, HTTPException
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_xai import ChatXAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.output_parsers import PydanticOutputParser
from app.core.redis import get_redis_client
from app.schemas.classification import ClassificationResponse, ClassificationSchema, Patent
from app.core.config import settings

logger = logging.getLogger(__name__)

# LLM 초기화
gpt = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model_name="gpt-4o", temperature=0)
claude = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0, api_key=settings.CLAUDE_API_KEY)
gemini = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0, google_api_key=settings.GEMINI_API_KEY)
grok = ChatXAI(model="grok-3-beta", temperature=0, xai_api_key=settings.GROK3_API_KEY)

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
    벡터 기반 유사도 평가와 Reasoning LLM 평가의 최종 점수를 계산합니다.
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
    
    return {
        "total_patents": total_patents,
        "vector_based": {
            "correct_classifications": vector_correct_classifications,
            "accuracy": vector_accuracy
        },
        "reasoning": {
            "average_score": reasoning_average_score
        },
        "details": patent_evaluations
    }

async def process_patent_classification(
    session_id: str,
    df: pd.DataFrame,
    retriever: Any,
    llm_type: str,
) -> Tuple[List[Patent], Dict[str, Any]]:
    """
    특허 데이터를 처리하고 분류합니다.
    """
    redis = get_redis_client()
    # LLM 선택
    llm_map: Dict[str, Any] = {
        "gpt": gpt,
        "claude": claude,
        "gemini": gemini,
        "grok": grok
    }
    llm = llm_map.get(llm_type.lower())
    if not llm:
        raise HTTPException(status_code=400, detail=f"지원하지 않는 LLM 타입입니다: {llm_type}")

    patents: List[Patent] = []
    evaluations: List[Dict[str, Any]] = []
    
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
        
        # 특허 정보 구성
        patent_data = Patent(
            applicationNumber=application_number,
            title=title,
            abstract=abstract,
            majorCode=classifications["majorCode"],
            middleCode=classifications["middleCode"],
            smallCode=classifications["smallCode"],
            majorTitle=classifications["majorTitle"],
            middleTitle=classifications["middleTitle"],
            smallTitle=classifications["smallTitle"]
        )
        
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
        
        # Reasoning LLM 평가 수행 (Claude 사용)
        reasoning_evaluation = await evaluate_classification_by_reasoning(
            patent_info,
            classifications,
            retriever
        )
        
        # 통합 평가 결과
        evaluation = {
            "vector_based": vector_evaluation,
            "reasoning": reasoning_evaluation,
            "is_correct": vector_evaluation["evaluation"]["is_correct"] and reasoning_evaluation["is_correct"]
        }
        
        evaluations.append(evaluation)
    
    # 만료 시간 설정
    redis.expire(patents_key, 86400)

    # 최종 평가 점수 계산
    evaluation_score = await calculate_vector_based_score(evaluations)
    
    # Redis에 최종 평가 점수 저장
    evaluation_key = f"{session_id}:{llm_type}:evaluation"
    evaluation = json.dumps(evaluation_score, ensure_ascii=False)
    redis.set(evaluation_key, evaluation)

    # 만료 시간 설정
    redis.expire(evaluation_key, 86400)
    
    return patents, evaluation_score

async def evaluate_classification_by_reasoning(
    patent_info: str,
    classification_result: Dict[str, str],
    retriever: Any
) -> Dict[str, Any]:
    """
    Claude를 사용하여 분류 결과를 평가합니다.
    0.0~1.0 사이의 점수로 평가합니다.
    """
    # 프롬프트 템플릿 정의
    template = """
    다음은 특허 분류 결과입니다:

    특허 정보:
    {patent_info}

    분류 결과:
    - 대분류: {major_code} ({major_title})
    - 중분류: {middle_code} ({middle_title})
    - 소분류: {small_code} ({small_title})

    이 분류가 적절한지 평가해주세요.
    0.0부터 1.0 사이의 점수로 평가해주세요.
    0.0은 완전히 부적절한 분류, 1.0은 완벽하게 적절한 분류를 의미합니다.

    점수와 함께 평가 근거를 간단히 설명해주세요.
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
        small_title=classification_result["smallTitle"]
    )
    
    # Claude 호출
    response = await claude.ainvoke(filled_prompt)
    
    # 응답에서 점수 추출 (0.0~1.0 사이의 숫자)
    try:
        score_match = re.search(r'0\.\d+|1\.0', response.content)
        if score_match:
            score = float(score_match.group())
        else:
            score = 0.0
            logger.warning("점수를 찾을 수 없어 기본값 0.0을 사용합니다.")
    except Exception as e:
        logger.error(f"점수를 추출 중 오류 발생: {str(e)}")
        score = 0.0
    
    return {
        "score": score,
        "reason": response.content,
        "is_correct": score >= 0.7  # 0.7 이상을 정확한 분류로 간주
    } 