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
gpt_reasoning = ChatOpenAI(
    api_key=settings.OPENAI_API_KEY, 
    model_name="o3-mini",
    use_responses_api=True,  # Responses API 사용 (리즈닝 모델에 필요)
    model_kwargs={
        "reasoning": {
            "effort": "high"  # 최대 추론 노력 (medium 또는 low로 설정 가능)
        }
    }
)
claude_reasoning = ChatAnthropic(
    model="claude-3-7-sonnet-20250219",
    temperature=1,
    api_key=settings.CLAUDE_API_KEY,
    thinking={
        "type": "enabled",
        "budget_tokens": 2000  # 추론에 할당할 토큰 수
    },
    max_tokens=6000
)
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

