from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ModelSpecs(BaseModel):
    arch: str = Field(..., description="架构规格，如 671B MoE")
    context: str = Field(..., description="上下文窗口")
    license: str = Field(..., description="商用授权协议")
    benchmark: str = Field(..., description="核心跑分")

class TokenPricing(BaseModel):
    unit_price: str = Field(..., description="单次或每百万token价格")
    drop_percent: str = Field(..., description="降价幅度或毛利率")
    prev_price: Optional[str] = None

class AudioSnippet(BaseModel):
    quote: str = Field(..., description="高光发言原句")
    speaker: str = Field(..., description="发言人身份")
    timestamp: str = Field(..., description="时间戳区间")
    duration: str = Field("30s", description="音频时长")

class IntelligenceCard(BaseModel):
    id: int
    sector: str
    type: str = Field(..., description="warning | opportunity | normal")
    tag: str = Field(..., description="颠覆预警 | 增长机遇 | 模式观察")
    heat: str
    title: str
    original_title: Optional[str] = None
    source: str
    source_type: str = Field("article", description="article | audio | video")
    source_platform: str
    source_time: str
    summary: str
    monetization: str
    roi: str
    use_case: str
    friction: str
    action: str
    model_specs: Optional[ModelSpecs] = None
    token_pricing: Optional[TokenPricing] = None
    audio_snippet: Optional[AudioSnippet] = None
