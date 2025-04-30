import os
from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
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
import faiss
from langchain_community.vectorstores import FAISS

from app.schemas.conversation import ConversationRequest, ConversationResponse, SessionHistoryResponse
from app.db.database import get_db
from app.models.conversation import Conversation
from app.crud.crud_conversation import create_conversation_record, get_conversation_history_by_session

load_dotenv()

user_router = APIRouter(prefix="/user")


# 텍스트 분할
text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=0)

user_vector_stores: Dict[str, FAISS] = {}

    
@user_router.get("/standard/{session_id}", response_model=List[SessionHistoryResponse], summary="해당 세션 아이디의 모든 대화 조회", description="해당 세션 아이디에 발생한 질문과 답변을 json형태로 반환합니다.")
async def get_session_history(session_id: str, db: Session = Depends(get_db)):
    # 데이터베이스에서 해당 세션 ID의 대화 내역 조회
    conversations = get_conversation_history_by_session(db, session_id)

    if not conversations:
        raise HTTPException(status_code=404, detail=f"Session ID {session_id} not found")
    
    return conversations




