import os
from pathlib import Path

# Load .env file manually if exists
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

class Settings:
    def __init__(self):
        self.app_name: str = "InsightX Backend"
        self.version: str = "2.0.0"
        self.debug: bool = os.getenv("DEBUG", "False").lower() == "true"
        
        # Universal LLM Configuration (OpenAI / Anthropic compatible)
        self.llm_protocol: str = os.getenv("LLM_PROTOCOL", "openai")  # "openai" | "anthropic"
        self.llm_base_url: str = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
        self.llm_api_key: str = os.getenv("LLM_API_KEY", "")
        self.llm_model: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
        
        # Optional Third-party Services
        self.youtube_api_key: str = os.getenv("YOUTUBE_API_KEY", "")

settings = Settings()
