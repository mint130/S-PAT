# LLM 초기화
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_xai import ChatXAI
from app.core.config import settings

# 분류용 LLM 모델
gpt = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model_name="gpt-4o", temperature=0)
claude = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0, api_key=settings.CLAUDE_API_KEY)
gemini = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0, google_api_key=settings.GEMINI_API_KEY)
grok = ChatXAI(model="grok-3-beta", temperature=0, xai_api_key=settings.GROK3_API_KEY)

# 평가용 LLM 모델 (Reasoning에 더 적합한 모델들)
# gpt, claude는 좀 더 reasoning에 적합한 모델로 변경할 수 있을 것 같으나, 현재는 모델 변경 시 소요 시간이 커지고 제대로 작동하지 않음.
# 따라서 현 모델을 사용하여 Reasoning 모델을 구현함. (현 모델로도 충분히 수행 가능)
gpt_reasoning = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model_name="gpt-4o", temperature=0)
claude_reasoning = ChatAnthropic(model="claude-3-7-sonnet-20250219", temperature=0, api_key=settings.CLAUDE_API_KEY)
gemini_reasoning = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro-preview-03-25",
    temperature=0,
    google_api_key=settings.GEMINI_API_KEY
)
grok_reasoning = ChatXAI(model="grok-3-beta", temperature=0, xai_api_key=settings.GROK3_API_KEY)

# LLM 매핑 딕셔너리
classification_llms = {
    "gpt": gpt,
    "claude": claude,
    "gemini": gemini,
    "grok": grok
}

reasoning_llms = {
    "gpt": gpt_reasoning,
    "claude": claude_reasoning,
    "gemini": gemini_reasoning,
    "grok": grok_reasoning
}

