import logging
import asyncio
import io
from typing import List, Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
from app.crud.crud_classification import process_patent_classification
from app.schemas.classification import (
    ClassificationResponse, 
    MultiLLMClassificationResponse,
    LLMClassificationResult
)
from app.api.endpoints.user import user_vector_stores

logger = logging.getLogger(__name__)

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
            process_patent_classification(df, retriever, "gpt"),
            process_patent_classification(df, retriever, "claude"),
            process_patent_classification(df, retriever, "gemini"),
            process_patent_classification(df, retriever, "grok")
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
        patents, evaluation_score = await process_patent_classification(df, retriever, "gpt")
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
        patents, evaluation_score = await process_patent_classification(df, retriever, "claude")
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
        patents, evaluation_score = await process_patent_classification(df, retriever, "gemini")
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
        patents, evaluation_score = await process_patent_classification(df, retriever, "grok")
        return LLMClassificationResult(
            name="GROK",
            patents=patents,
            evaluation_score=evaluation_score
        )
    except Exception as e:
        logger.error(f"Grok 분류 처리 중 오류 발생: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))