import asyncio
import time
from typing import List, Dict, Any
from app.services.new_model_monitor import (
    fetch_huggingface_trending_models,
    fetch_lmsys_arena_leaderboard,
    get_all_new_model_intelligence
)
from app.services.pricing_diff_radar import get_official_pricing_diffs
from app.services.podcast_pipeline import get_all_podcast_intelligence
from app.services.domestic_crawler import (
    fetch_36kr_ai_news,
    fetch_ithome_ai_news,
    fetch_xhs_and_douyin_bridge,
    fetch_weibo_ai_hot,
    crawl_domestic_all
)
from app.services.international_crawler import (
    fetch_github_trending_ai,
    fetch_x_thought_leaders,
    crawl_international_all
)
from app.services.priority_engine import sort_by_priority

# ═════════════════════════════════════════════════════════════════
#  OMNICHANNEL 9-PORT INTELLIGENCE ORCHESTRATOR & TELEMETRY
#  1. HuggingFace: HF Trending Models & Weights
#  2. LMSYS: Chatbot Arena Elo Benchmark
#  3. Pricing: Token Economics & Price Drop Radar
#  4. ITHome: Domestic Breaking AI Hardware/Software News
#  5. 36Kr: Enterprise AI & VC Commercialization Feed
#  6. GitHub: Trending Repositories & Agent Frameworks
#  7. Podcast: Xiaoyuzhou & Spotify Executive Interviews
#  8. Community: Xiaohongshu & Douyin Practical Monetization
#  9. Social: Weibo Trending & X Thought Leaders
# ═════════════════════════════════════════════════════════════════

CHANNEL_METADATA = {
    "huggingface": {"name": "HuggingFace 权威模型", "icon": "🤗", "category": "model"},
    "lmsys":       {"name": "LMSYS Arena 天梯",  "icon": "🏆", "category": "benchmark"},
    "pricing":     {"name": "Token 定价雷达",     "icon": "💰", "category": "pricing"},
    "ithome":      {"name": "IT之家 行业突发",    "icon": "🔴", "category": "domestic"},
    "36kr":        {"name": "36氪 商业创投",      "icon": "📰", "category": "domestic"},
    "github":      {"name": "GitHub Trending",   "icon": "🐙", "category": "code"},
    "podcast":     {"name": "小宇宙与播客原声",   "icon": "📻", "category": "audio"},
    "community":   {"name": "小红书与抖音实操",   "icon": "📕", "category": "social"},
    "social":      {"name": "微博与 𝕏 商业前沿",   "icon": "👁️", "category": "social"}
}

async def fetch_single_channel_safe(channel_key: str, sector: str = "all") -> Dict[str, Any]:
    """
    Safely executes a single channel crawler, measuring latency and capturing any exception.
    Guarantees no channel crashes the pipeline. If a channel fails, it logs the reason and marks SKIPPED.
    """
    start_t = time.perf_counter()
    status = "SUCCESS"
    reason = "OK"
    items = []

    try:
        if channel_key == "huggingface":
            items = fetch_huggingface_trending_models()
            for x in items:
                x["sector"] = x.get("sector") or "🔥 新模型速递"
                x["sourcePlatform"] = "huggingface"

        elif channel_key == "lmsys":
            items = fetch_lmsys_arena_leaderboard()
            for x in items:
                x["sector"] = x.get("sector") or "🔥 新模型速递"
                x["sourcePlatform"] = "lmsys"

        elif channel_key == "pricing":
            items = get_official_pricing_diffs()
            for x in items:
                x["sector"] = x.get("sector") or "💰 Token 经济学"
                x["sourcePlatform"] = x.get("sourcePlatform") or "36kr"

        elif channel_key == "ithome":
            items = await fetch_ithome_ai_news()
            for x in items:
                x["sector"] = x.get("sector") or "🔥 新模型速递"
                x["sourcePlatform"] = "ithome"

        elif channel_key == "36kr":
            items = await fetch_36kr_ai_news()
            for x in items:
                x["sector"] = x.get("sector") or "🌐 SaaS 商业化综合"
                x["sourcePlatform"] = "36kr"

        elif channel_key == "github":
            items = await fetch_github_trending_ai()
            for x in items:
                x["sector"] = x.get("sector") or "🔥 新模型速递"
                x["sourcePlatform"] = "github"

        elif channel_key == "podcast":
            items = get_all_podcast_intelligence()
            for x in items:
                x["sector"] = x.get("sector") or "🎙️ 播客与财报原声"
                x["sourcePlatform"] = x.get("sourcePlatform") or "xiaoyuzhou"

        elif channel_key == "community":
            items = await fetch_xhs_and_douyin_bridge()
            for x in items:
                x["sector"] = x.get("sector") or "🌐 SaaS 商业化综合"
                x["sourcePlatform"] = x.get("sourcePlatform") or "xiaohongshu"

        elif channel_key == "social":
            weibo_items = await fetch_weibo_ai_hot()
            x_items = await fetch_x_thought_leaders()
            items = weibo_items + x_items
            for x in items:
                x["sector"] = x.get("sector") or "🌐 SaaS 商业化综合"
                x["sourcePlatform"] = x.get("sourcePlatform") or "weibo"

        latency_ms = int((time.perf_counter() - start_t) * 1000)
        return {
            "channel": channel_key,
            "status": "SUCCESS",
            "latency_ms": latency_ms,
            "items_count": len(items),
            "reason": f"成功拉取 {len(items)} 条情报",
            "items": items
        }

    except Exception as e:
        latency_ms = int((time.perf_counter() - start_t) * 1000)
        error_msg = str(e) or type(e).__name__
        print(f"[OmnichannelCrawler] Channel '{channel_key}' skipped: {error_msg}")
        return {
            "channel": channel_key,
            "status": "SKIPPED",
            "latency_ms": latency_ms,
            "items_count": 0,
            "reason": f"接口异常已跳过: {error_msg}",
            "items": []
        }

async def crawl_omnichannel_with_telemetry(sector: str = "all") -> Dict[str, Any]:
    """
    Mandatory Omnichannel Sweep:
    Queries ALL 9 ports concurrently without skipping any.
    Records per-channel status, latency, and skipping reasons.
    Re-ranks all gathered items by importance & sector relevance.
    """
    channel_keys = list(CHANNEL_METADATA.keys())
    tasks = [fetch_single_channel_safe(k, sector) for k in channel_keys]
    channel_reports = await asyncio.gather(*tasks)

    all_items = []
    telemetry_channels = []

    for rep in channel_reports:
        k = rep["channel"]
        meta = CHANNEL_METADATA.get(k, {})
        telemetry_channels.append({
            "id": k,
            "name": meta.get("name", k),
            "icon": meta.get("icon", "📡"),
            "status": rep["status"],
            "latency_ms": rep["latency_ms"],
            "items_count": rep["items_count"],
            "reason": rep["reason"]
        })
        all_items.extend(rep.get("items", []))

    # Deduplicate by title
    seen = set()
    deduped = []
    for item in all_items:
        t = item.get("title", "").strip()
        if t and t not in seen:
            seen.add(t)
            deduped.append(item)

    # Sector-aware importance re-ranking
    # Boost items that match target sector, but keep diversity
    if sector and sector not in ("all", "全部"):
        # We sort prioritizing sector matches first, then authority/P0
        def sector_weight(item):
            s = item.get("sector", "")
            return 1 if (s == sector or sector[:2] in s) else 0

        # Primary sort: sector affinity, then general priority
        deduped.sort(key=sector_weight, reverse=True)

    sorted_items = sort_by_priority(deduped)

    return {
        "items": sorted_items,
        "total_items": len(sorted_items),
        "telemetry": {
            "scanned_channels": len(channel_keys),
            "successful_channels": sum(1 for r in channel_reports if r["status"] == "SUCCESS"),
            "skipped_channels": sum(1 for r in channel_reports if r["status"] == "SKIPPED"),
            "channels": telemetry_channels
        }
    }

async def crawl_raw_intelligence(sector: str = "all", scope: str = "all") -> List[Dict[str, Any]]:
    """
    Legacy wrapper maintaining backward compatibility for existing endpoints.
    """
    res = await crawl_omnichannel_with_telemetry(sector=sector)
    return res["items"]

