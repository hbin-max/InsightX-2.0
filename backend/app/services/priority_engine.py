import re
from typing import Dict, Any, List

# ═════════════════════════════════════════════════════════════════
#  INTELLIGENCE PRIORITY & SCORING ENGINE
#  Prioritizes:
#  1. New model launches & SOTA breakthroughs (P0)
#  2. Major price drops / pricing shifts (P0)
#  3. Prominent industry leaders' frontier statements (P1)
#  4. SOTA benchmark leadership updates (LMSYS Arena, SWE-bench) (P1)
# ═════════════════════════════════════════════════════════════════

# High-priority keywords
CRITICAL_EVENT_PATTERNS = [
    # 新模型上市与架构突破 (New Model & Breakthrough)
    (r"(发布|上线|推出|开源|推出全新|重磅|正式版|v3|r1|o1|o3|sonnet|llama\s*3|qwen\s*2|deepseek).*?(模型|架构|权重|moe|reasoning|sota)", 35, "新模型发布"),
    (r"(computer\s*use|多模态|突破|首次|自主演化|思维链|强化学习)", 25, "颠覆性功能"),
    
    # 售价剧烈变动与价格战 (Price Drops & Token Economics)
    (r"(降价|暴降|跳水|降幅|价格战|百万token|击穿|免费|半价|折|caching|削减|减免)", 35, "重大价格变动"),
    
    # 知名从业者与前沿言论 (Key Industry Leaders)
    (r"(altman|karpathy|lecun|amodei|梁文锋|黄仁勋|苏姿丰|扎克伯格|创始人|首席架构师|前核心|闭门|专访|言论|透露|坦言|指出)", 25, "行业大咖言论"),
    
    # 榜单更迭 (Benchmark Shifts)
    (r"(arena|天梯榜|榜首|登顶|超越|mmlu|swe-bench|排名第一|第一)", 25, "权威榜单天梯")
]

# Source Authority Boosts
SOURCE_AUTHORITY_WEIGHTS = {
    "official": 25,     # 官方更新日志 / 白皮书
    "lmsys": 25,        # LMSYS Arena 竞技场
    "huggingface": 20,  # HuggingFace Trending
    "spotify": 20,      # Spotify 播客原声 (Latent Space, 20VC, Dwarkesh)
    "xiaoyuzhou": 20,   # 小宇宙商业原声 (42章经, 乱翻书)
    "github": 18,       # GitHub Trending
    "x": 18,            # X (Twitter) 思想领袖
    "36kr": 15,         # 36氪深度
    "bilibili": 15,     # B站深度解析
    "weibo": 12         # 微博热搜
}

def calculate_priority(item: Dict[str, Any]) -> Dict[str, Any]:
    """
    对单条情报综合计算优先级评分 (0-100) 与优先级评级 (P0 / P1 / P2)
    """
    score = 50  # Base score
    reasons = []

    title = item.get("title", "")
    summary = item.get("summary", "")
    combined_text = f"{title} {summary} {item.get('action', '')} {item.get('monetization', '')}".lower()
    platform = item.get("sourcePlatform", "web").lower()

    # 1. Check Event Type Patterns
    for pattern, weight, reason in CRITICAL_EVENT_PATTERNS:
        if re.search(pattern, combined_text, re.IGNORECASE):
            score += weight
            reasons.append(reason)
            break

    # 2. Check Source Authority
    for src_key, auth_weight in SOURCE_AUTHORITY_WEIGHTS.items():
        if src_key in platform or src_key in item.get("source", "").lower():
            score += auth_weight
            break

    # 3. Model Spec / Token Pricing / Audio Snippet Bonus
    if item.get("modelSpecs") or item.get("model_specs"):
        score += 15
        reasons.append("包含模型硬件规格")
    if item.get("tokenPricing") or item.get("token_pricing"):
        score += 15
        reasons.append("包含定价核算指标")
    if item.get("audioSnippet") or item.get("audio_snippet"):
        score += 15
        reasons.append("包含现场录音原声")

    # 4. Cap and Grade
    final_score = min(score, 99)
    
    if final_score >= 88:
        level = "P0"
        level_label = "🚨 P0 极高优突发"
        level_color = "#F43F5E"  # Rose
    elif final_score >= 72:
        level = "P1"
        level_label = "🔥 P1 权威风向"
        level_color = "#6366F1"  # Electric Indigo
    else:
        level = "P2"
        level_label = "💡 P2 行业动态"
        level_color = "#10B981"  # Emerald

    item["priorityScore"] = final_score
    item["priorityLevel"] = level
    item["priorityLabel"] = level_label
    item["priorityColor"] = level_color
    item["priorityReasons"] = reasons[:2]
    return item

def sort_by_priority(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    按优先级评分从高到低严格排序
    """
    scored = [calculate_priority(it) for it in items]
    scored.sort(key=lambda x: x.get("priorityScore", 50), reverse=True)
    return scored
