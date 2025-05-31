import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

# 로컬(기본) PostgreSQL 연결 설정
# 사용자명(Username): postgres
# 비밀번호(Password): 1234
# 호스트(Host): localhost
# 포트(Port): 5432
# 데이터베이스 이름(Database name): mydb

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:1234@localhost:5432/mydb")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    CLAUDE_API_KEY: str = os.getenv("CLAUDE_API_KEY")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GROK3_API_KEY: str = os.getenv("GROK3_API_KEY")
    
    model_config = {
        "env_file": ".env",
        "extra": "allow"  
    }

settings = Settings()