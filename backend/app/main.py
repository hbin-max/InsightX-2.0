from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.config import settings
from app.services.llm_extractor import test_llm_connection, call_llm

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="InsightX 2.0 商业情报参谋后端服务 API (支持 OpenAI / Anthropic 兼容协议)"
)

# Enable CORS for local & web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionTestRequest(BaseModel):
    protocol: str = "openai"  # "openai" | "anthropic"
    base_url: str = "https://api.openai.com/v1"
    api_key: str = ""
    model: str = "gpt-4o-mini"

class AnalyzeRequest(BaseModel):
    title: str
    content: str
    sector: str = "🔥 新模型速递"
    protocol: Optional[str] = None
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None

@app.get("/")
def read_root():
    return {
        "name": settings.app_name,
        "version": settings.version,
        "status": "online",
        "supported_protocols": ["OpenAI-Compatible (/chat/completions)", "Anthropic-Compatible (/messages)"]
    }

@app.post("/api/test-connection")
async def test_endpoint(req: ConnectionTestRequest):
    """
    测试大模型端点连通性 (支持 OpenAI 及 Anthropic 协议)
    """
    res = await test_llm_connection(
        protocol=req.protocol,
        base_url=req.base_url,
        api_key=req.api_key,
        model=req.model
    )
    if res.get("status") != "ok":
        raise HTTPException(status_code=400, detail=res.get("message"))
    return res

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
