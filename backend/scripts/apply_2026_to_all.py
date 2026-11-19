# -*- coding: utf-8 -*-
"""
Apply 2026 dates, latest live cards, and replace fallback dates in frontend/index.html and backend/app/db.py.
"""
import json
import re
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent))
from update_to_2026 import SECTORS
from generate_full_intelligence import SECTORS as UPDATED_SECTORS

index_path = Path("frontend/index.html")
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update CURATED_INTELLIGENCE with 2026 SECTORS
pattern = r'const CURATED_INTELLIGENCE\s*=\s*\{[\s\S]*?\n\};'
new_curated_js = "const CURATED_INTELLIGENCE = " + json.dumps(SECTORS, ensure_ascii=False, indent=4) + ";"
html = re.sub(pattern, lambda m: new_curated_js, html, count=1)

# 2. Replace all remaining '2025-02-18' with '2026-11-20'
html = html.replace("'2025-02-18'", "'2026-11-20'")
html = html.replace('"2025-02-18"', '"2026-11-20"')

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated frontend/index.html to 2026 successfully!")

# 3. Update backend/app/db.py default date
db_path = Path("backend/app/db.py")
with open(db_path, "r", encoding="utf-8") as f:
    db_text = f.read()

db_text = db_text.replace('"2025-02-18"', '"2026-11-20"')
with open(db_path, "w", encoding="utf-8") as f:
    f.write(db_text)
print("Updated backend/app/db.py default date to 2026-11-20!")

# 4. Re-seed backend/insightx.db
import os
sys.path.append("backend")
from app.db import init_db, save_card, get_cards

db_file = Path("backend/insightx.db")
if db_file.exists():
    os.remove(db_file)

init_db()
count = 0
for sector, cards in SECTORS.items():
    for c in cards:
        c["sector"] = sector
        save_card(c)
        count += 1

print(f"Re-seeded SQLite with {count} fresh 2026 cards!")
latest = get_cards(sector="🔥 新模型速递", limit=3)
for c in latest:
    print(f"  -> [{c.get('publishDate')}] {c.get('title')[:35]} ({c.get('source')})")
