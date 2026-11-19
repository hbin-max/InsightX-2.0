# -*- coding: utf-8 -*-
import json
import re
import sys
from pathlib import Path

# Load SECTORS from generate_full_intelligence
sys.path.append(str(Path(__file__).resolve().parent))
from generate_full_intelligence import SECTORS

index_path = Path("frontend/index.html")
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update CURATED_INTELLIGENCE
# Find const CURATED_INTELLIGENCE = { ... };
pattern = r'const CURATED_INTELLIGENCE\s*=\s*\{[\s\S]*?\n\};'
new_curated_js = "const CURATED_INTELLIGENCE = " + json.dumps(SECTORS, ensure_ascii=False, indent=4) + ";"

if re.search(pattern, html):
    html = re.sub(pattern, lambda m: new_curated_js, html, count=1)
    print("Replaced CURATED_INTELLIGENCE successfully!")
else:
    print("ERROR: Could not find CURATED_INTELLIGENCE pattern")
    sys.exit(1)

# 2. Update API_CONFIG defaults to DeepSeek
api_config_pattern = r'const API_CONFIG = \{[\s\S]*?\};'
new_api_config = """const API_CONFIG = {
    get protocol()   { return localStorage.getItem('insightx_api_protocol')  || 'openai'; },
    get baseUrl()    { return localStorage.getItem('insightx_api_base_url')  || 'https://api.deepseek.com/v1'; },
    get key()        { return localStorage.getItem('insightx_api_key')       || 'sk-9ecb9d2b073a4cf79a80854b4ac62913'; },
    get model()      { return localStorage.getItem('insightx_api_model')     || 'deepseek-chat'; },
    get youtubeKey() { return localStorage.getItem('insightx_youtube_key')   || ''; }
};"""
html = re.sub(api_config_pattern, new_api_config, html, count=1)
print("Updated API_CONFIG defaults to DeepSeek!")

# 3. Update advanceCardStack and replenishInfiniteStream with Deduplication & Cross-Sector Engine
replenish_pattern = r'// ── Infinite Replenishing Stream \(Never Run Out\) ───────────────[\s\S]*?function replenishInfiniteStream\(\) \{[\s\S]*?\n\}'

new_replenish_code = """// ── Card Seen History & Deduplication Engine ───────────────────
const seenCardKeys = new Set();

function recordSeenCard(card) {
    if (!card) return;
    if (card.title) seenCardKeys.add(card.title.trim());
    if (card.id) seenCardKeys.add(String(card.id));
}

function advanceCardStack() {
    setTimeout(() => {
        const swiped = currentCards.shift();
        if (swiped) {
            recordSeenCard(swiped);
        }

        // When fewer than 4 cards remain, dynamically replenish with UNSEEN cards
        if (currentCards.length < 4) {
            replenishInfiniteStream();
        }

        renderCards(currentCards);
    }, 280);
}

function replenishInfiniteStream() {
    const currentQueueTitles = new Set(currentCards.map(c => c.title.trim()));
    const candidates = [];

    // 1. First priority: Unseen cards from CURRENT sector
    const currentSectorMaster = CURATED_INTELLIGENCE[currentSector] || [];
    currentSectorMaster.forEach(card => {
        const titleKey = card.title.trim();
        if (!seenCardKeys.has(titleKey) && !seenCardKeys.has(String(card.id)) && !currentQueueTitles.has(titleKey)) {
            candidates.push(JSON.parse(JSON.stringify(card)));
            currentQueueTitles.add(titleKey);
        }
    });

    // 2. Second priority: Unseen high-priority cards from OTHER sectors (Cross-Sector Synergy)
    if (candidates.length < 4) {
        Object.keys(CURATED_INTELLIGENCE).forEach(sec => {
            if (sec !== currentSector) {
                (CURATED_INTELLIGENCE[sec] || []).forEach(card => {
                    const titleKey = card.title.trim();
                    if (!seenCardKeys.has(titleKey) && !seenCardKeys.has(String(card.id)) && !currentQueueTitles.has(titleKey)) {
                        const crossCard = JSON.parse(JSON.stringify(card));
                        crossCard.tag = '💡 跨界精选';
                        crossCard.heat = '跨赛道协同';
                        candidates.push(crossCard);
                        currentQueueTitles.add(titleKey);
                    }
                });
            }
        });
    }

    // 3. Fallback: If user has literally swiped through all cards in the entire database,
    // gracefully recycle the oldest seen cards with a "周期沉淀复盘" badge so it still never breaks!
    if (candidates.length === 0) {
        const halfSize = Math.floor(seenCardKeys.size / 2);
        let i = 0;
        for (const k of seenCardKeys) {
            if (i++ < halfSize) seenCardKeys.delete(k);
        }
        
        currentSectorMaster.slice(0, 5).forEach(card => {
            const recycled = JSON.parse(JSON.stringify(card));
            recycled.id = recycled.id + 10000 + Math.floor(Math.random() * 5000);
            recycled.tag = '周期复盘';
            recycled.heat = '深度沉淀';
            recycled.sourceTime = '经典沉淀';
            candidates.push(recycled);
        });
    }

    if (candidates.length > 0) {
        currentCards.push(...candidates.slice(0, 8));
    }
}"""

if re.search(replenish_pattern, html):
    html = re.sub(replenish_pattern, new_replenish_code, html, count=1)
    print("Replaced advanceCardStack and replenishInfiniteStream with Seen Engine!")
else:
    print("ERROR: Could not match replenish_pattern")
    sys.exit(1)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Saved updated frontend/index.html successfully!")
