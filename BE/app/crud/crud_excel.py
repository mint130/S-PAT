import pandas as pd
from fastapi import UploadFile, HTTPException
from typing import List, Dict, Any
from app.schemas.excel import StandardItem

async def process_excel_file(file: UploadFile) -> List[StandardItem]:
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="엑셀 파일만 업로드 가능합니다.")

    try:
        # 엑셀 파일 읽기
        df = pd.read_excel(file.file)
        
        # 컬럼 매핑 정의
        column_mapping = {
            '분류코드': 'code',
            '분류단계': 'level',
            '명칭': 'name',
            '상세 설명': 'description'
        }
        
        # 필수 컬럼 존재 확인
        if not all(col in df.columns for col in column_mapping.keys()):
            raise HTTPException(
                status_code=400, 
                detail="엑셀 파일은 '분류코드', '분류단계', '명칭', '상세 설명' 열을 포함해야 합니다."
            )
        
        # 컬럼명 변경
        df = df.rename(columns=column_mapping)

        # JSON 형식으로 변환
        result = []
        for _, row in df.iterrows():
            if pd.notna(row['code']):  # code가 있는 행만 처리
                standard = StandardItem(
                    code=str(row['code']).strip(),
                    level=str(row['level']).strip(),
                    name=str(row['name']).strip(),
                    description=str(row['description']).strip()
                )
                result.append(standard)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"파일 처리 중 오류가 발생했습니다: {str(e)}") 