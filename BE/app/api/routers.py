from fastapi import APIRouter
from endpoints.admin import admin_router
from endpoints.user import user_router
from endpoints.standard import standard_router

api_router = APIRouter()
api_router.include_router(standard_router, tags=["standard"])
api_router.include_router(user_router, tags=["user"])
api_router.include_router(admin_router, tags = ["admin"])
