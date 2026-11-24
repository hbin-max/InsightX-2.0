import json
import re
from typing import Dict, Any, Optional
from app.config import settings
from app.services.http_client import post_json

class ExtractionError(Exception):
    pass


async def call_llm(
    system_prompt: str,
    user_prompt: str,
    protocol: Optional[str] = None,
    base_url: Optional[str] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None
) -> str:
    """
    通用大模型调度器：自动适配 OpenAI 兼容标准与 Anthropic 官方标准格式。
    支持 httpx 与标准库 urllib.request 自动平滑降级。
    """
    proto = protocol or settings.llm_protocol
    url   = (base_url or settings.llm_base_url).rstrip("/")
    key   = api_key or settings.llm_api_key
    mdl   = model or settings.llm_model

    if proto == "anthropic":
        endpoint = url if url.endswith("/messages") else f"{url}/messages"
        headers = {
            "x-api-key": key,
            "anthropic-version": "2023-06-01"
        }
        payload = {
            "model": mdl,
            "max_tokens": 4096,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
            "temperature": 0.2
        }
        data = await post_json(endpoint, payload, headers=headers, timeout=60.0)
        return data.get("content", [{}])[0].get("text", "")
    else:
        endpoint = url if url.endswith("/chat/completions") else f"{url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}"
        }
        payload = {
            "model": mdl,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2
        }
        data = await post_json(endpoint, payload, headers=headers, timeout=60.0)
        return data.get("choices", [{}])[0].get("message", {}).get("content", "")

async def extract_structured_card(
    title: str,
    raw_content: str,
    sector: str = "🔥 新模型速递",
    protocol: Optional[str] = None,
    base_url: Optional[str] = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None
) -> Dict[str, Any]:
    """
    让大模型基于商业分析师视角，将原始资讯提取为标准 4+1 要素卡片与特化 Bento 字段。
    """
    system_prompt = f"""你是顶级 AI 商业情报分析师。请分析输入的原始技术资讯，从 B 端商业决策者视角提炼情报，并严格输出合法的 JSON 格式。

必须输出包含以下字段的合法 JSON（全部用简体中文）：
- type: "warning"（颠覆/风险）或 "opportunity"（增长机遇）或 "normal"（模式观察）
- tag: 4字简短标签（如"重磅发布"、"降价风暴"、"模式革新"、"端侧颠覆"）
- heat: 格式如 "匹配度 96%"
- chinese_title: 精炼有力的商业化中文标题 (18-28字)
- summary: 核心事实概述 (100-200字，忠实提炼要点与关键数字)
- monetization: 商业变现与定价策略 (30-60字)
- roi: 效能提升/ROI 测算分析 (30-60字)
- use_case: 2-3个具体 B 端落地场景 (30-60字)
- friction: 落地技术或合规阻碍 (20-40字)
- action: 面向高管的商业战略行动建议 (30-60字)
- model_specs: (如果是新模型，提供包含 arch(架构), context(上下文), license(商用协议), benchmark(跑分) 的对象，否则为 null)
- matrix_x: 落地阻碍分数 (10到90整数，越小阻碍越低)
- matrix_y: 商业价值/ROI分数 (10到95整数，越大商业价值越高)
"""

    system_prompt += "\n未披露的参数、定价与实测收益必须明确标为未披露，不要补造数字。"
    user_prompt = f"【赛道】：{sector}\n【标题】：{title}\n【内容片段】：\n{raw_content[:1500]}"

    try:
        raw_resp = await call_llm(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            protocol=protocol,
            base_url=base_url,
            api_key=api_key,
            model=model
        )
        cleaned = re.sub(r"^```json\s*", "", raw_resp.strip(), flags=re.IGNORECASE)
        cleaned = re.sub(r"```$", "", cleaned.strip())
        parsed = json.loads(cleaned)
        if not isinstance(parsed, dict) or not isinstance(parsed.get("summary"), str) or not parsed["summary"].strip():
            raise ValueError("Missing structured summary")
        parsed["title"] = parsed.get("chinese_title") or title
        parsed["original_title"] = title
        parsed["sector"] = sector
        return parsed
    except Exception as error:
        raise ExtractionError("模型提炼失败，请检查模型配置后重试。") from error

async def test_llm_connection(
    protocol: str = "openai",
    base_url: str = "https://api.openai.com/v1",
    api_key: str = "",
    model: str = "gpt-4o-mini"
) -> Dict[str, Any]:
    try:
        content = await call_llm(
            system_prompt="Reply with JSON",
            user_prompt="Say {'status': 'ok'}",
            protocol=protocol,
            base_url=base_url,
            api_key=api_key,
            model=model
        )
        if not isinstance(content, str) or not content.strip():
            return {"status": "error", "message": "模型未返回有效正文"}
        return {"status": "ok", "response": content}
    except Exception as e:
        return {"status": "error", "message": str(e)}
