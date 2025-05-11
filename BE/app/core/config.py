import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    CLAUDE_API_KEY: str = os.getenv("CLAUDE_API_KEY")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GROK3_API_KEY: str = os.getenv("GROK3_API_KEY")
    
    model_config = {
        "env_file": ".env",
        "extra": "allow"  
    }

settings = Settings()