from fastapi import APIRouter

from app.tasks import add
from app.core.celery import celery_app
from celery.result import AsyncResult

celery_router = APIRouter(prefix="/celery")

@celery_router.get("/")
def test_celery_task(x: int = 3, y: int = 4):
    result = add.delay(x, y)
    return {"task_id": result.id, "status": "submitted"}

@celery_router.get("/{task_id}")
def get_task_result(task_id: str):
    result = AsyncResult(task_id, app=celery_app)
    if result.ready():
        return {"status": result.status, "result": result.result}
    else:
        return {"status": result.status}