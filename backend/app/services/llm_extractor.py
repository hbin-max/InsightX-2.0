import json
import httpx
from typing import Dict, Any, Optional
from app.config import settings

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
    """
    proto = protocol or settings.llm_protocol
    url   = (base_url or settings.llm_base_url).rstrip("/")
    key   = api_key or settings.llm_api_key
    mdl   = model or settings.llm_model

    async with httpx.AsyncClient(timeout=45.0) as client:
        if proto == "anthropic":
            endpoint = url if url.endswith("/messages") else f"{url}/messages"
            headers = {
                "Content-Type": "application/json",
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
            resp = await client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("content", [{}])[0].get("text", "")
        else:
            # OpenAI-compatible (OpenAI, DeepSeek, Qwen, Moonshot, Ollama, etc.)
            endpoint = url if url.endswith("/chat/completions") else f"{url}/chat/completions"
            headers = {
                "Content-Type": "application/json",
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
            resp = await client.post(endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data.get("choices", [{}])[0].get("message", {}).get("content", "")

async def test_llm_connection(
    protocol: str = "openai",
    base_url: str = "https://api.openai.com/v1",
    api_key: str = "",
    model: str = "gpt-4o-mini"
) -> Dict[str, Any]:
    """
    测试指定端点的连通性与模型响应状态。
    """
    try:
        content = await call_llm(
            system_prompt="Reply with JSON",
            user_prompt="Say {'status': 'ok'}",
            protocol=protocol,
            base_url=base_url,
            api_key=api_key,
            model=model
        )
        return {"status": "ok", "response": content}
    except Exception as e:
        return {"status": "error", "message": str(e)}
