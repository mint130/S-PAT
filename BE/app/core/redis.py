import redis
from fastapi import Depends
from dotenv import load_dotenv
import os

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = 0
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    db=REDIS_DB,
    password=REDIS_PASSWORD,
    decode_responses=True  # 문자열 반환
)

# 라우터 내에서 사용
def get_redis():
    try:
        yield redis_client
    finally:
        pass

# 일반 함수에서 사용
def get_redis_client():
    return redis_client