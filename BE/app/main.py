from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers import api_router


app = FastAPI(
    title="S-PAT",
    description="API documentation",
    version="1.0"
)

app.include_router(api_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)