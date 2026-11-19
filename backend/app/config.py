import os
from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "InsightX Backend"
    version: str = "2.0.0"
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # API Keys
    qwen_api_key: str = os.getenv("QWEN_API_KEY", "")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    youtube_api_key: str = os.getenv("YOUTUBE_API_KEY", "")

settings = Settings()
