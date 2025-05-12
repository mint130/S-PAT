from sqlalchemy import Column, String, Integer
from app.db.database import Base


class LLM(Base):
    __tablename__ = "LLM"

    id = Column(Integer, primary_key=True)
    llm = Column(String(20), name="llm")