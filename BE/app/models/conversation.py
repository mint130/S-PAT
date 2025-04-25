from sqlalchemy import Column, String, TIMESTAMP, JSON
from sqlalchemy.sql import func
from db.database import Base

class Conversation(Base):
    __tablename__ = "conversation" 

    conversation_id = Column(String(50), primary_key=True, index=True, name="대화 아이디")
    created_at = Column(TIMESTAMP, default=func.now(), name="대화 시각")
    query = Column(String(250), name="질문")
    answer = Column(JSON, name="대답")