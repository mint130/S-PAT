import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    model_config = {
        "env_file": ".env",
        "extra": "allow"  
    }

settings = Settings()