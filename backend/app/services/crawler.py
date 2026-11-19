import asyncio
from typing import List, Dict, Any
from app.services.new_model_monitor import get_all_new_model_intelligence
from app.services.pricing_diff_radar import get_official_pricing_diffs
from app.services.podcast_pipeline import get_all_podcast_intelligence
from app.services.domestic_crawler import crawl_domestic_all
from app.services.international_crawler import crawl_international_all
from app.services.priority_engine import sort_by_priority

# ═════════════════════════════════════════════════════════════════
#  OMNICHANNEL INTELLIGENCE ORCHESTRATOR
#  Aggregates:
#  1. HuggingFace Trending & LMSYS Arena & Official Changelogs
#  2. Token Pricing Diffs & Price Drop Announcements
#  3. Xiaoyuzhou (小宇宙) & YouTube/Spotify Podcasts (yt-dlp+Whisper)
#  4. Domestic: 36Kr, ITHome, Bilibili, Weibo, Xiaohongshu, Douyin
#  5. International: GitHub, Spotify, X (Twitter), Hacker News
#  Then strictly sorts by Priority Score (P0 -> P1 -> P2 -> Long-tail)
# ═════════════════════════════════════════════════════════════════

async def crawl_raw_intelligence(sector: str = "all", scope: str = "all") -> List[Dict[str, Any]]:
    results = []

    # 1. Authority Radar (HuggingFace, LMSYS Arena, Official Changelogs)
    try:
        results.extend(get_all_new_model_intelligence())
    except Exception as e:
        print(f"[Orchestrator] Authority radar warning: {e}")

    # 2. Token Pricing Radar (Price drops, Caching, Unit Economics)
    try:
        results.extend(get_official_pricing_diffs())
    except Exception as e:
        print(f"[Orchestrator] Pricing radar warning: {e}")

    # 3. Podcasts Pipeline (Xiaoyuzhou, YouTube, Spotify)
    try:
        results.extend(get_all_podcast_intelligence())
    except Exception as e:
        print(f"[Orchestrator] Podcast pipeline warning: {e}")

    # 4. Domestic Platforms (36Kr, ITHome, Bilibili, Weibo, XHS, Douyin)
    if scope in ("all", "domestic"):
        try:
            dom = await crawl_domestic_all(sector)
            results.extend(dom)
        except Exception as e:
            print(f"[Orchestrator] Domestic warning: {e}")

    # 5. International Platforms (GitHub, Spotify, X)
    if scope in ("all", "international"):
        try:
            intl = await crawl_international_all(sector)
            results.extend(intl)
        except Exception as e:
            print(f"[Orchestrator] International warning: {e}")

    # Deduplicate by title
    seen = set()
    deduped = []
    for item in results:
        t = item.get("title", "")
        if t and t not in seen:
            seen.add(t)
            deduped.append(item)

    # Filter by sector if specified
    if sector and sector not in ("all", "全部"):
        filtered = [x for x in deduped if x.get("sector") == sector or sector[:2] in x.get("sector", "")]
        if len(filtered) >= 3:
            deduped = filtered

    # STRICTLY SORT BY PRIORITY & GOLD DENSITY (P0 -> P1 -> P2 -> Long-tail)
    sorted_items = sort_by_priority(deduped)
    return sorted_items
