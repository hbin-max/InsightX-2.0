from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager

from app.config import settings
from app.db import init_db, save_card, get_cards, count_cards_by_sector
from app.services.crawler import crawl_raw_intelligence
from app.services.llm_extractor import test_llm_connection, extract_structured_card

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema
    init_db()
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="InsightX 2.0 商业情报参谋全自动抓取与结构化提取后端",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionTestRequest(BaseModel):
    protocol: str = "openai"
    base_url: str = "https://api.openai.com/v1"
    api_key: str = ""
    model: str = "gpt-4o-mini"

class IngestRequest(BaseModel):
    sector: str = "🔥 新模型速递"
    protocol: Optional[str] = None
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    model: Optional[str] = None

class CustomExtractRequest(BaseModel):
    title: str
    content: str
    sector: str = "🔥 新模型速递"
    source: str = "自定义输入"
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
        "endpoints": [
            "GET  /api/cards?sector=...",
            "POST /api/ingest",
            "POST /api/custom-extract",
            "POST /api/test-connection",
            "GET  /api/stats"
        ]
    }

@app.get("/api/cards")
def list_cards(sector: Optional[str] = None, limit: int = 40):
    """
    获取数据库中保存的最新情报卡片（优先返回动态入库数据）
    """
    return get_cards(sector=sector, limit=limit)

@app.get("/api/stats")
def get_stats():
    """
    获取各赛道入库情报统计数量
    """
    return count_cards_by_sector()

@app.post("/api/ingest")
async def trigger_ingestion(req: IngestRequest):
    """
    触发自动化数据流水线：爬取最新原料 -> 调用 LLM 提炼 -> 自动入库持久化
    """
    raw_items = await crawl_raw_intelligence(req.sector)
    if not raw_items:
        return {"status": "ok", "message": "未能抓取到新数据或源暂无更新", "added_count": 0}

    added = []
    for item in raw_items[:4]:  # Batch limit
        card_data = await extract_structured_card(
            title=item.get("title", ""),
            raw_content=item.get("summary", ""),
            sector=req.sector,
            protocol=req.protocol,
            base_url=req.base_url,
            api_key=req.api_key,
            model=req.model
        )
        card_data["source"] = item.get("source", "全网情报监控")
        card_data["source_platform"] = item.get("sourcePlatform", "web")
        card_data["source_type"] = item.get("sourceType", "article")
        new_id = save_card(card_data)
        card_data["id"] = new_id
        added.append(card_data)

    return {
        "status": "ok",
        "message": f"成功提取并入库 {len(added)} 篇最新商业情报！",
        "added_count": len(added),
        "cards": added
    }

@app.post("/api/custom-extract")
async def custom_extract(req: CustomExtractRequest):
    """
    自定义单篇文本结构化提炼入库接口
    """
    card_data = await extract_structured_card(
        title=req.title,
        raw_content=req.content,
        sector=req.sector,
        protocol=req.protocol,
        base_url=req.base_url,
        api_key=req.api_key,
        model=req.model
    )
    card_data["source"] = req.source
    new_id = save_card(card_data)
    card_data["id"] = new_id
    return {"status": "ok", "card": card_data}

@app.post("/api/test-connection")
async def test_endpoint(req: ConnectionTestRequest):
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
