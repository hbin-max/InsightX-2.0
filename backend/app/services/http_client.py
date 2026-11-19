import asyncio
import json
import urllib.request
import urllib.error
from typing import Optional, Dict, Any

try:
    import httpx
    HAS_HTTPX = True
except ImportError:
    HAS_HTTPX = False

async def fetch_text(url: str, headers: Optional[Dict[str, str]] = None, timeout: float = 12.0) -> str:
    """
    Asynchronous HTTP GET returning response text.
    Falls back gracefully to urllib.request if httpx is not installed.
    """
    req_headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }
    if headers:
        req_headers.update(headers)

    if HAS_HTTPX:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True, headers=req_headers) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.text
    else:
        def _sync_get():
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req, timeout=timeout) as response:
                return response.read().decode("utf-8", errors="ignore")
        return await asyncio.to_thread(_sync_get)

async def fetch_json(url: str, headers: Optional[Dict[str, str]] = None, timeout: float = 12.0) -> Any:
    """
    Asynchronous HTTP GET returning parsed JSON.
    """
    text = await fetch_text(url, headers=headers, timeout=timeout)
    return json.loads(text)

async def post_json(url: str, data: Dict[str, Any], headers: Optional[Dict[str, str]] = None, timeout: float = 60.0) -> Dict[str, Any]:
    """
    Asynchronous HTTP POST with JSON body.
    """
    req_headers = {
        "Content-Type": "application/json",
        "User-Agent": "InsightX-Intelligence-Engine/2.0"
    }
    if headers:
        req_headers.update(headers)

    if HAS_HTTPX:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True, headers=req_headers) as client:
            resp = await client.post(url, json=data)
            resp.raise_for_status()
            return resp.json()
    else:
        def _sync_post():
            body = json.dumps(data).encode("utf-8")
            req = urllib.request.Request(url, data=body, headers=req_headers, method="POST")
            with urllib.request.urlopen(req, timeout=timeout) as response:
                res_body = response.read().decode("utf-8", errors="ignore")
                return json.loads(res_body)
        return await asyncio.to_thread(_sync_post)
