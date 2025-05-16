# LLM 초기화
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_xai import ChatXAI
from app.core.config import settings

gpt = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model_name="gpt-4o", temperature=0)
claude = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0, api_key=settings.CLAUDE_API_KEY)
gemini = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0, google_api_key=settings.GEMINI_API_KEY)
grok = ChatXAI(model="grok-3-beta", temperature=0, xai_api_key=settings.GROK3_API_KEY)

