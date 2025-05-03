import os
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.output_parsers import PydanticOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.schema.runnable import RunnableMap

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

from app.schemas.conversation import ConversationRequest, ConversationResponse, SessionHistoryResponse
from app.db.database import get_db
from app.models.conversation import Conversation
from app.crud.crud_conversation import create_conversation_record, get_conversation_history_by_session
# from app.core.redis_config import redis_config

load_dotenv()
# redis = redis_config()

user_router = APIRouter(prefix="/user")
embeddings_openai = OpenAIEmbeddings(model="text-embedding-3-large", dimensions=3072)

user_vector_stores: Dict[str, FAISS] = {}

def process_standards_for_vectordb(standards: List[Dict[Any, Any]]) -> List[Dict[Any, Any]]:
    """
    분류 체계 데이터를 벡터 DB에 저장하기 위한 형태로 가공합니다.
    """
    # 대분류, 중분류, 소분류 딕셔너리 생성
    high_categories = {}  # 대분류
    mid_categories = {}   # 중분류
    low_categories = {}   # 소분류
    
    # 먼저 각 분류 레벨별로 분류
    for standard in standards:
        level = standard['level']
        
        if level == '대분류':
            high_categories[standard['code']] = standard
        elif level == '중분류':
            mid_categories[standard['code']] = standard
        elif level == '소분류':
            low_categories[standard['code']] = standard
    
    # 처리된 문서를 저장할 리스트
    documents = []
    
    # 중분류 처리
    for code, mid_category in mid_categories.items():
        # 상위 대분류 찾기
        for high_code, high_category in high_categories.items():
            # 대분류 코드가 중분류 코드의 접두어인지 확인 (예: H01이 H01-01의 접두어)
            if code.startswith(high_code):
                # 임베딩 텍스트 생성 (대분류 설명 + 중분류 설명)
                embedding_text = f"{high_category['description']} {mid_category['description']}"
                
                # 벡터 DB용 문서 생성
                document = {
                    'code': code,
                    'name': mid_category['name'],
                    'level': mid_category['level'],
                    'parent_code': high_code,
                    'parent_name': high_category['name'],
                    'text': embedding_text,  # 임베딩에 사용될 텍스트
                    'description': mid_category['description']
                }
                
                documents.append(document)
                break
    
    # 소분류 처리
    for code, low_category in low_categories.items():
        # 상위 대분류와 중분류 찾기
        parent_mid = None
        parent_high = None
        
        # 먼저 상위 중분류 찾기
        for mid_code, mid_category in mid_categories.items():
            if code.startswith(mid_code):
                parent_mid = mid_category
                
                # 중분류의 상위 대분류 찾기
                for high_code, high_category in high_categories.items():
                    if mid_code.startswith(high_code):
                        parent_high = high_category
                        break
                
                break
        
        # 상위 분류를 모두 찾았는지 확인
        if parent_mid and parent_high:
            # 임베딩 텍스트 생성 (대분류 설명 + 중분류 설명 + 소분류 설명)
            embedding_text = f"{parent_high['description']} {parent_mid['description']} {low_category['description']}"
            
            # 벡터 DB용 문서 생성
            document = {
                'code': code,
                'name': low_category['name'],
                'level': low_category['level'],
                'parent_code': parent_mid['code'],
                'parent_name': parent_mid['name'],
                'grand_parent_code': parent_high['code'],
                'grand_parent_name': parent_high['name'],
                'text': embedding_text,  # 임베딩에 사용될 텍스트
                'description': low_category['description']
            }
            
            documents.append(document)
    
    return documents


def create_faiss_database(documents: List[Dict[Any, Any]], session_id: str, embedding_model_name: str = "text-embedding-ada-002"):
    """
    처리된 문서로부터 FAISS 벡터 데이터베이스를 생성하고 메모리에 저장합니다.
    """
    
    # FAISS에 사용할 텍스트와 메타데이터 준비
    texts = [doc['text'] for doc in documents]
    metadatas = documents  # 전체 문서를 메타데이터로 사용
    
    # FAISS 벡터 데이터베이스 생성
    vectordb = FAISS.from_texts(
        texts=texts,
        embedding=embeddings_openai,
        metadatas=metadatas
    )
    
    return vectordb

    
@user_router.post("/{session_id}/standard/save", status_code=status.HTTP_201_CREATED, summary="분류 체계 벡터 db에 저장", description="선택된 분류 체계를 Redis 및 FAISS에 저장")
async def save_standard(session_id: str, standard: ConversationResponse, db:Session = Depends(get_db)):
    
    standards = standard.standards
    
    if not standards:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="분류 체계 데이터가 없습니다."
        )
    
    # 벡터 DB에 저장할 문서 준비
    documents = process_standards_for_vectordb(standards)
    
    # FAISS 벡터 DB 생성 및 메모리에 저장
    vectordb = create_faiss_database(documents, session_id)
    # print("벡터 db", vectordb.docstore._dict)
    
    # 전역 딕셔너리에 저장
    user_vector_stores[session_id] = vectordb


    return True
