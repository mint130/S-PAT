from sqlalchemy import Column, String, TIMESTAMP, Integer
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.sql import func
from app.db.database import Base

class Conversation(Base):
    __tablename__ = "conversation" 

    conversation_id = Column(Integer, primary_key=True, index=True, name="conversation_id")
    session_id = Column(String(50), name="session_id")
    created_at = Column(TIMESTAMP, default=func.now(), name="created_at")
    query = Column(String(250), name="query")
    answer = Column(JSON, name="answer")