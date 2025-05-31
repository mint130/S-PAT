from celery import Celery
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Celery 앱 생성
celery_app = Celery(
    "patent_classification",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

# Celery 설정
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Seoul",
    enable_utc=True,
)

# 작업 자동 발견
celery_app.autodiscover_tasks(['app.tasks', 'app.coordinator'])
celery_app.set_default()