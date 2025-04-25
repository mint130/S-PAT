import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 기본값은 로컬 개발환경용 설정
    DATABASE_URL: str = "postgresql://postgres:ssafy@localhost:5432/test"
    
    # 환경에 따른 설정 클래스 속성 추가 가능
    DEBUG: bool = True
    API_V1_STR: str = "/api"
    
    class Config:
        # .env 파일에서 환경 변수 로드
        env_file = ".env"

# # 환경 변수 ENVIRONMENT가 "production"이면 프로덕션 설정 사용
# if os.getenv("ENVIRONMENT") == "production":
#     settings = Settings(
#         DATABASE_URL="postgresql://test_user:ssafy@mint130.p-e.kr:54320/test_db",
#         DEBUG=False,
#     )
# else:
#     settings = Settings()  # 로컬 개발 환경 기본값 사용