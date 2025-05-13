from fastapi import APIRouter
from app.api.endpoints.admin import admin_router
from app.api.endpoints.user import user_router
from app.api.endpoints.standard import standard_router
from app.api.endpoints.test import test_router
from app.api.endpoints.celery import celery_router

api_router = APIRouter()
api_router.include_router(standard_router, tags=["standard"])
api_router.include_router(user_router, tags=["user"])
api_router.include_router(admin_router, tags = ["admin"])
api_router.include_router(test_router, tags = ["test"])
api_router.include_router(celery_router, tags = ["celery"])