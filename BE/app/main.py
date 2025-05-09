from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import api_router
from app.core.redis import get_redis


app = FastAPI(
    title="S-PAT",
    description="API documentation",
    version="1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    root_path="/api"
)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/redis")
def redis_test(redis=Depends(get_redis)):
    try:
        redis.set("ping", "pong")
        value = redis.keys('*')
        return {"message": "success", "value": value}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)