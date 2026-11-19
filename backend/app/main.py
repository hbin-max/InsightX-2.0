from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from app.config import settings
from app.models.schemas import IntelligenceCard

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="InsightX 2.0 商业情报参谋后端服务 API"
)

# Enable CORS for local and web frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "name": settings.app_name,
        "version": settings.version,
        "status": "online",
        "pillars": [
            "🔥 新模型发布与技术速递",
            "💰 Token 经济学与定价雷达",
            "🎙️ 播客与财报长音频决策内参",
            "🌐 SaaS 商业化综合"
        ]
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
