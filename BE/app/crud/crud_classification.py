import logging
import json
import re
from typing import List, Dict, Any, Optional, Tuple
import pandas as pd
from fastapi import HTTPException
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_xai import ChatXAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from langchain.output_parsers import PydanticOutputParser
from app.schemas.classification import ClassificationResponse, ClassificationSchema, Patent
from app.core.config import settings

logger = logging.getLogger(__name__)

# LLM 초기화
gpt = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model_name="gpt-4o", temperature=0)
claude = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0, api_key=settings.CLAUDE_API_KEY)
gemini = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0, google_api_key=settings.GEMINI_API_KEY)
grok = ChatXAI(model="grok-3-beta", temperature=0, xai_api_key=settings.GROK3_API_KEY)

# 유사도 평가 기준점 설정
SIMILARITY_THRESHOLDS = {
    "major": 0.6,
    "middle": 0.5,
    "small": 0.4
}

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
    """
    # 1. 특허 정보와 가장 유사한 분류 체계 검색 (유사도 점수 포함)
    similar_docs = await retriever.aget_relevant_documents(patent_info)
    
    # 2. 가장 높은 유사도를 가진 분류 체계 선택
    best_match = similar_docs[0]
    best_score = best_match[1]
    best_classification = best_match[0].metadata
    
    # 3. 유사도 기준점을 기반으로 평가
    def evaluate_classification(llm_code: str, best_code: str, level: str) -> Dict[str, Any]:
        threshold = SIMILARITY_THRESHOLDS[level]
        
        if best_score < threshold:
            # 유사도가 기준점 미만인 경우
            if llm_code == "미분류":
                return {
                    "is_correct": True,
                    "reason": f"유사도({best_score:.2f})가 기준점({threshold}) 미만이므로 미분류가 정확함"
                }
            else:
                return {
                    "is_correct": False,
                    "reason": f"유사도({best_score:.2f})가 기준점({threshold}) 미만이므로 미분류여야 함"
                }
        else:
            # 유사도가 기준점 이상인 경우
            if llm_code == "미분류":
                return {
                    "is_correct": False,
                    "reason": f"유사도({best_score:.2f})가 기준점({threshold}) 이상이므로 분류가 필요함"
                }
            else:
                return {
                    "is_correct": llm_code == best_code,
                    "reason": "일반 분류 비교"
                }
    
    evaluation = {
        "similarity_score": best_score,
        "similarity_threshold": SIMILARITY_THRESHOLDS,
        "best_match": {
            "majorCode": best_classification.get("majorCode"),
            "majorTitle": best_classification.get("majorTitle"),
            "middleCode": best_classification.get("middleCode"),
            "middleTitle": best_classification.get("middleTitle"),
            "smallCode": best_classification.get("smallCode"),
            "smallTitle": best_classification.get("smallTitle")
        },
        "llm_classification": classification_result,
        "evaluation": {
            "major": evaluate_classification(
                classification_result["majorCode"],
                best_classification.get("majorCode"),
                "major"
            ),
            "middle": evaluate_classification(
                classification_result["middleCode"],
                best_classification.get("middleCode"),
                "middle"
            ),
            "small": evaluate_classification(
                classification_result["smallCode"],
                best_classification.get("smallCode"),
                "small"
            )
        }
    }
    
    return evaluation

async def calculate_vector_based_score(
    patent_evaluations: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    벡터 기반 유사도 평가의 최종 점수를 계산합니다.
    """
    total_patents = len(patent_evaluations)
    
    # 각 레벨별 정확도 계산
    level_scores = {}
    for level in ["major", "middle", "small"]:
        correct_classifications = sum(
            1 for eval in patent_evaluations 
            if eval["evaluation"][level]["is_correct"] == True
        )
        score = (correct_classifications / total_patents) * 100
        level_scores[level] = {
            "total": total_patents,
            "correct": correct_classifications,
            "score": score
        }
    
    # 전체 평균 점수 계산
    average_score = sum(level["score"] for level in level_scores.values()) / 3
    
    return {
        "total_patents": total_patents,
        "level_scores": level_scores,
        "average_score": average_score,
        "details": patent_evaluations
    }

async def process_patent_classification(
    df: pd.DataFrame,
    retriever: Any,
    llm_type: str
) -> Tuple[List[Patent], Dict[str, Any]]:
    """
    특허 데이터를 처리하고 분류합니다.
    """
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
        
        patents.append(patent_data)
        
        # 벡터 기반 평가 수행
        evaluation = await evaluate_classification_by_vector(
            patent_info,
            classifications,
            retriever
        )
        evaluations.append(evaluation)
    
    # 최종 평가 점수 계산
    evaluation_score = await calculate_vector_based_score(evaluations)
    
    return patents, evaluation_score 