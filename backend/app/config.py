import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "InsightX Backend"
    version: str = "2.0.0"
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Universal LLM Configuration (OpenAI / Anthropic compatible)
    llm_protocol: str = os.getenv("LLM_PROTOCOL", "openai")  # "openai" | "anthropic"
    llm_base_url: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
    llm_api_key: str = os.getenv("LLM_API_KEY", "")
    llm_model: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    
    # Optional Third-party Services
    youtube_api_key: str = os.getenv("YOUTUBE_API_KEY", "")

settings = Settings()
