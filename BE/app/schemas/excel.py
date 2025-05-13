from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from fastapi import UploadFile

class ExcelResponse(BaseModel):
    standards: List[Dict[str, Any]]

class StandardItem(BaseModel):
    code: str
    level: str
    name: str
    description: str

class StandardResponse(BaseModel):
    standards: List[StandardItem]

class StandardRequest(BaseModel):
    query: str
    file: UploadFile

class StandardLLMResponse(BaseModel):
    standards: List[StandardItem]
    query: str 