from fastapi import APIRouter
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI

user_router = APIRouter(prefix="/user")

