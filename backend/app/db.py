import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "insightx.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sector TEXT NOT NULL,
        priority_level TEXT DEFAULT 'P1',
        priority_score INTEGER DEFAULT 80,
        type TEXT NOT NULL,
        tag TEXT NOT NULL,
        heat TEXT DEFAULT '匹配度 95%',
        title TEXT NOT NULL,
        original_title TEXT,
        source TEXT,
        source_type TEXT DEFAULT 'article',
        source_platform TEXT DEFAULT 'web',
        source_time TEXT,
        publish_date TEXT,
        url TEXT,
        summary TEXT,
        monetization TEXT,
        roi TEXT,
        use_case TEXT,
        friction TEXT,
        action TEXT,
        model_specs TEXT,
        token_pricing TEXT,
        audio_snippet TEXT,
        matrix_x INTEGER DEFAULT 50,
        matrix_y INTEGER DEFAULT 50,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    conn.commit()
    conn.close()

def save_card(card: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check for title duplicates
    cursor.execute("SELECT id FROM cards WHERE title = ?", (card.get("title", ""),))
    row = cursor.fetchone()
    if row:
        conn.close()
        return row["id"]

    cursor.execute("""
    INSERT INTO cards (
        sector, priority_level, priority_score, type, tag, heat, title, original_title, source, source_type,
        source_platform, source_time, publish_date, url, summary, monetization, roi, use_case,
        friction, action, model_specs, token_pricing, audio_snippet, matrix_x, matrix_y
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        card.get("sector", "🔥 新模型速递"),
        card.get("priorityLevel", "P1"),
        card.get("priorityScore", 80),
        card.get("type", "opportunity"),
        card.get("tag", "增长机遇"),
        card.get("heat", "匹配度 95%"),
        card.get("title", ""),
        card.get("originalTitle") or card.get("original_title", ""),
        card.get("source", "全网监测"),
        card.get("sourceType") or card.get("source_type", "article"),
        card.get("sourcePlatform") or card.get("source_platform", "web"),
        card.get("sourceTime") or card.get("source_time", "实时资讯"),
        card.get("publishDate") or card.get("publish_date", "2026-11-20"),
        card.get("url", ""),
        card.get("summary", ""),
        card.get("monetization", ""),
        card.get("roi", ""),
        card.get("useCase") or card.get("use_case", ""),
        card.get("friction", ""),
        card.get("action", ""),
        json.dumps(card.get("modelSpecs") or card.get("model_specs", {}), ensure_ascii=False) if (card.get("modelSpecs") or card.get("model_specs")) else None,
        json.dumps(card.get("tokenPricing") or card.get("token_pricing", {}), ensure_ascii=False) if (card.get("tokenPricing") or card.get("token_pricing")) else None,
        json.dumps(card.get("audioSnippet") or card.get("audio_snippet", {}), ensure_ascii=False) if (card.get("audioSnippet") or card.get("audio_snippet")) else None,
        card.get("matrixX") or card.get("matrix_x", 50),
        card.get("matrixY") or card.get("matrix_y", 50)
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id

def get_cards(sector: Optional[str] = None, limit: int = 60) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    # Order by publish_date DESC (newest first), then priority_score DESC (P0 -> P1 -> P2), then id DESC
    if sector and sector not in ("all", "全部"):
        cursor.execute("SELECT * FROM cards WHERE sector = ? ORDER BY publish_date DESC, priority_score DESC, id DESC LIMIT ?", (sector, limit))
    else:
        cursor.execute("SELECT * FROM cards ORDER BY publish_date DESC, priority_score DESC, id DESC LIMIT ?", (limit,))
    
    rows = cursor.fetchall()
    results = []
    for r in rows:
        d = dict(r)
        if d.get("model_specs"):
            try: d["modelSpecs"] = json.loads(d["model_specs"])
            except: d["modelSpecs"] = None
        if d.get("token_pricing"):
            try: d["tokenPricing"] = json.loads(d["token_pricing"])
            except: d["tokenPricing"] = None
        if d.get("audio_snippet"):
            try: d["audioSnippet"] = json.loads(d["audio_snippet"])
            except: d["audioSnippet"] = None
        
        # camelCase aliases for frontend
        d["priorityLevel"] = d.get("priority_level", "P1")
        d["priorityScore"] = d.get("priority_score", 80)
        d["originalTitle"] = d.get("original_title")
        d["sourceType"]     = d.get("source_type")
        d["sourcePlatform"] = d.get("source_platform")
        d["sourceTime"]     = d.get("source_time")
        d["publishDate"]    = d.get("publish_date") or "2026-11-20"
        d["url"]            = d.get("url") or ""
        d["useCase"]        = d.get("use_case")
        d["matrixX"]        = d.get("matrix_x")
        d["matrixY"]        = d.get("matrix_y")
        results.append(d)
    conn.close()
    return results

def count_cards_by_sector() -> Dict[str, int]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT sector, COUNT(*) as cnt FROM cards GROUP BY sector")
    rows = cursor.fetchall()
    res = {r["sector"]: r["cnt"] for r in rows}
    conn.close()
    return res
