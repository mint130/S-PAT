import logging
import asyncio
import io
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
import pandas as pd
from app.crud.crud_classification import process_patent_classification
from app.schemas.classification import (
    ClassificationResponse, 
    MultiLLMClassificationResponse,
    LLMClassificationResult,
    SampledClassificationResponse
)
from app.api.endpoints.user import user_vector_stores
from app.core.redis import get_redis_client
import json
import random
import math

logger = logging.getLogger(__name__)

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
    
    return math.ceil(sample_size)

admin_router = APIRouter(prefix="/admin")

@admin_router.post("/{session_id}/classification", response_model=MultiLLMClassificationResponse, summary="여러 LLM으로 특허 분류 및 평가", description="4개의 LLM(GPT, Claude, Gemini, Grok3)으로 특허 분류 및 평가 결과를 반환합니다.")
async def classify_patent_by_multi_llm(session_id: str, file: UploadFile = File(...)) -> MultiLLMClassificationResponse:
    try:
        # 1. 엑셀 파일 처리
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다.")
        
        # 파일 내용을 메모리에서 읽기
        contents = await file.read()
        file_object = io.BytesIO(contents)
        df = pd.read_excel(file_object)
        
        # 2. session_id에 대한 벡터 스토어 확인
        if session_id not in user_vector_stores:
            raise HTTPException(
                status_code=404, 
                detail="해당 세션에 대한 분류 체계가 존재하지 않습니다."
            )

        # 3. retriever 생성
        retriever = user_vector_stores[session_id].as_retriever(search_kwargs={"k": 3})
        
        # 4. 각 LLM별 분류 작업을 비동기로 실행
        tasks = [
            process_patent_classification(session_id, df, retriever, "gpt"),
            process_patent_classification(session_id, df, retriever, "claude"),
            process_patent_classification(session_id, df, retriever, "gemini"),
            process_patent_classification(session_id, df, retriever, "grok")
        ]
        
        # 모든 LLM의 분류 결과를 동시에 수집
        results = await asyncio.gather(*tasks)
        
        # 5. 결과 구성
        llm_results = []
        for llm_type, (patents, evaluation_score) in zip(["GPT", "CLAUDE", "GEMINI", "GROK"], results):
            result = LLMClassificationResult(
                name=llm_type,
                patents=patents,
                evaluation_score=evaluation_score
            )
            llm_results.append(result)
        
        return MultiLLMClassificationResponse(results=llm_results)
        
    except Exception as e:
        logger.error(f"분류 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@admin_router.post("/{session_id}/classification/gpt", response_model=LLMClassificationResult, summary="GPT로 특허 분류 및 평가")
async def classify_patent_gpt(session_id: str, file: UploadFile = File(...)) -> LLMClassificationResult:
    try:
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다.")
        contents = await file.read()
        file_object = io.BytesIO(contents)
        df = pd.read_excel(file_object)
        if session_id not in user_vector_stores:
            raise HTTPException(status_code=404, detail="해당 세션에 대한 분류 체계가 존재하지 않습니다.")
        retriever = user_vector_stores[session_id].as_retriever(search_kwargs={"k": 3})
        patents, evaluation_score = await process_patent_classification(session_id, df, retriever, "gpt")
        return LLMClassificationResult(
            name="GPT",
            patents=patents,
            evaluation_score=evaluation_score
        )
    except Exception as e:
        logger.error(f"GPT 분류 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@admin_router.post("/{session_id}/classification/claude", response_model=LLMClassificationResult, summary="Claude로 특허 분류 및 평가")
async def classify_patent_claude(session_id: str, file: UploadFile = File(...)) -> LLMClassificationResult:
    try:
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다.")
        contents = await file.read()
        file_object = io.BytesIO(contents)
        df = pd.read_excel(file_object)
        if session_id not in user_vector_stores:
            raise HTTPException(status_code=404, detail="해당 세션에 대한 분류 체계가 존재하지 않습니다.")
        retriever = user_vector_stores[session_id].as_retriever(search_kwargs={"k": 3})
        patents, evaluation_score = await process_patent_classification(session_id, df, retriever, "claude")
        return LLMClassificationResult(
            name="CLAUDE",
            patents=patents,
            evaluation_score=evaluation_score
        )
    except Exception as e:
        logger.error(f"Claude 분류 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@admin_router.post("/{session_id}/classification/gemini", response_model=LLMClassificationResult, summary="Gemini로 특허 분류 및 평가")
async def classify_patent_gemini(session_id: str, file: UploadFile = File(...)) -> LLMClassificationResult:
    try:
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다.")
        contents = await file.read()
        file_object = io.BytesIO(contents)
        df = pd.read_excel(file_object)
        if session_id not in user_vector_stores:
            raise HTTPException(status_code=404, detail="해당 세션에 대한 분류 체계가 존재하지 않습니다.")
        retriever = user_vector_stores[session_id].as_retriever(search_kwargs={"k": 3})
        patents, evaluation_score = await process_patent_classification(session_id, df, retriever, "gemini")
        return LLMClassificationResult(
            name="GEMINI",
            patents=patents,
            evaluation_score=evaluation_score
        )
    except Exception as e:
        logger.error(f"Gemini 분류 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@admin_router.post("/{session_id}/classification/grok", response_model=LLMClassificationResult, summary="Grok로 특허 분류 및 평가")
async def classify_patent_grok(session_id: str, file: UploadFile = File(...)) -> LLMClassificationResult:
    try:
        if not file.filename.endswith((".xlsx", ".xls")):
            raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다.")
        contents = await file.read()
        file_object = io.BytesIO(contents)
        df = pd.read_excel(file_object)
        if session_id not in user_vector_stores:
            raise HTTPException(status_code=404, detail="해당 세션에 대한 분류 체계가 존재하지 않습니다.")
        retriever = user_vector_stores[session_id].as_retriever(search_kwargs={"k": 3})
        patents, evaluation_score = await process_patent_classification(session_id, df, retriever, "grok")
        return LLMClassificationResult(
            name="GROK",
            patents=patents,
            evaluation_score=evaluation_score
        )
    except Exception as e:
        logger.error(f"Grok 분류 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
@admin_router.get(
    "/{session_id}/classification/sampling",
    response_model=SampledClassificationResponse,
    summary="샘플링된 특허 분류 결과 및 평가 점수 조회",
    description="신뢰도와 오차범위를 기반으로 샘플링된 특허 분류 결과와 평가 점수를 반환합니다."
)
async def get_sampled_classification(
    session_id: str,
    confidence_level: float = Query(0.95, ge=0.8, le=0.99, description="신뢰도 (범위: 0.8~0.99)"),
    margin_error: float = Query(0.05, ge=0.01, le=0.1, description="오차 범위 (범위: 0.01~0.1)")
) -> SampledClassificationResponse:
    try:
        redis = get_redis_client()
        if not redis:
            raise HTTPException(
                status_code=500,
                detail="Redis 연결에 실패했습니다."
            )
        
        # 해당 세션에 대한 분류 결과가 있는지 확인
        llm_types = ["gpt", "claude", "gemini", "grok"]
        all_patents = {}
        
        for llm_type in llm_types:
            patents_key = f"{session_id}:{llm_type}:patents"
            if not redis.exists(patents_key):
                continue
                
            try:
                # 특허 데이터 가져오기
                patent_jsons = redis.lrange(patents_key, 0, -1)
                patents = []
                for patent_json in patent_jsons:
                    try:
                        patent = json.loads(patent_json)
                        patents.append(patent)
                    except json.JSONDecodeError as e:
                        logger.error(f"특허 데이터 파싱 실패 (LLM: {llm_type}): {str(e)}")
                        continue
                all_patents[llm_type] = patents
            except Exception as e:
                logger.error(f"특허 데이터 조회 실패 (LLM: {llm_type}): {str(e)}")
                continue
        
        if not all_patents:
            raise HTTPException(
                status_code=404,
                detail="해당 세션에 대한 분류 결과가 존재하지 않습니다."
            )
        
        # 대표 LLM으로 전체 특허 수 확인
        representative_llm = next(iter(all_patents))
        total_patents = len(all_patents[representative_llm])
        
        if total_patents == 0:
            raise HTTPException(
                status_code=404,
                detail="분류된 특허가 없습니다."
            )
        
        # 샘플 크기 계산
        sample_size = calculate_sample_size(total_patents, confidence_level, margin_error)
        sample_size = min(sample_size, total_patents)
        
        # 랜덤 샘플링 인덱스 생성
        random.seed(session_id)  # 세션 ID를 시드로 사용하여 결과 재현성 보장
        sampled_indices = sorted(random.sample(range(total_patents), sample_size))
        
        # 샘플링 정보 구성
        sampling_info = {
            "total_patents": total_patents,
            "sample_size": sample_size,
            "confidence_level": confidence_level,
            "margin_error": margin_error,
            "indices": sampled_indices
        }
        
        # 각 LLM의 샘플링된 결과 및 평가 점수 구성
        results = []
        for llm_type in llm_types:
            if llm_type not in all_patents:
                continue
                
            try:
                # 평가 점수 가져오기
                evaluation_key = f"{session_id}:{llm_type}:evaluation"
                evaluation_json = redis.get(evaluation_key)
                if not evaluation_json:
                    logger.warning(f"평가 점수를 찾을 수 없음 (LLM: {llm_type})")
                    evaluation_data = {"vector_accuracy": 0.0, "reasoning_score": 0.0}
                else:
                    evaluation_data = json.loads(evaluation_json)
                
                # 샘플링된 특허만 선택
                sampled_patents = [all_patents[llm_type][idx] for idx in sampled_indices if idx < len(all_patents[llm_type])]
                
                # 결과 구성
                result = {
                    "name": llm_type.upper(),
                    "vector_accuracy": evaluation_data.get("vector_accuracy", 0.0),
                    "reasoning_score": evaluation_data.get("reasoning_score", 0.0),
                    "patents": sampled_patents
                }
                
                results.append(result)
            except Exception as e:
                logger.error(f"LLM 결과 처리 중 오류 발생 (LLM: {llm_type}): {str(e)}")
                continue
        
        if not results:
            raise HTTPException(
                status_code=500,
                detail="샘플링된 결과를 생성할 수 없습니다."
            )
        
        return {
            "sampling_info": sampling_info,
            "results": results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"샘플링된 분류 결과 조회 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))