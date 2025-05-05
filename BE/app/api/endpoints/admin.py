from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.crud.crud_excel import process_excel_file
from app.crud.crud_llm import classify_patent_with_multiple_llms
from app.schemas.llm import MultiLLMClassificationResponse

admin_router = APIRouter(prefix="/admin")

@admin_router.post("/{session_id}/classification", response_model=MultiLLMClassificationResponse, summary="여러 LLM으로 특허 분류 및 평가", description="4개의 LLM(GPT, Claude, Gemini, Grok3)으로 특허 분류 및 평가 결과를 반환합니다.")
async def classify_patent_by_multi_llm(session_id: str, file: UploadFile = File(...)):
    try:
        # 1. 엑셀 파일 처리 (특허 데이터 추출)
        patent_data = await process_excel_file(file)  # List[dict] 형태로 반환된다고 가정

        # 2. 여러 LLM에게 분류 및 평가 요청
        result = await classify_patent_with_multiple_llms(patent_data)

        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": str(e)})