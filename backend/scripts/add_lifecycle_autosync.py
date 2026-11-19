# -*- coding: utf-8 -*-
"""
Inject App & WeChat Mini Program Lifecycle Auto-Sync Engine into frontend/index.html.
Guarantees automatic live synchronization of today's latest news upon opening the app/feed/library when online.
"""
import re
from pathlib import Path

index_path = Path("frontend/index.html")
with open(index_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update API_KEYS to include cloudApi
old_api_keys = r'const API_KEYS = \{[\s\S]*?\};'
new_api_keys = """const API_KEYS = {
    get protocol()   { return localStorage.getItem('insightx_api_protocol')  || 'openai'; },
    get baseUrl()    { return localStorage.getItem('insightx_api_base_url')  || 'https://api.deepseek.com/v1'; },
    get apiKey()     { return localStorage.getItem('insightx_api_key')       || ''; },
    get model()      { return localStorage.getItem('insightx_api_model')     || 'deepseek-chat'; },
    get cloudApi()   { return localStorage.getItem('insightx_cloud_api')     || 'http://localhost:8000'; },
    get youtubeKey() { return localStorage.getItem('insightx_youtube_key')   || ''; }
};"""
html = re.sub(old_api_keys, new_api_keys, html, count=1)

# 2. Add lifecycle hooks into setupBottomNav
old_nav_code = r'if \(target === \'view-library\'\) renderLibrary\(\);'
new_nav_code = """if (target === 'view-library') {
                renderLibrary();
                checkAndAutoSyncToday();
            }
            if (target === 'view-feed') {
                checkAndAutoSyncToday();
            }"""
html = re.sub(old_nav_code, new_nav_code, html, count=1)

# 3. Add Mobile App & Mini-Program Lifecycle Auto-Sync Engine right before generateAICards
target_func = r'// ── Card Rendering & Intelligence Generator ────────────────────'
engine_code = """// ── App & Mini-Program Lifecycle Auto-Sync Engine ─────────────
function getTodayString() {
    return new Date().toISOString().slice(0, 10);
}

function updateLiveStatusBadge(isOnline, dateStr) {
    const aiStatus = document.getElementById('ai-status-bar');
    if (!aiStatus) return;

    aiStatus.classList.remove('opacity-0');
    if (isOnline) {
        aiStatus.className = 'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 transition-all shrink-0';
        aiStatus.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-mono-code text-[9px] font-bold text-emerald-300">在线实时同步 · ${dateStr || getTodayString()}</span>
        `;
    } else {
        aiStatus.className = 'flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 transition-all shrink-0';
        aiStatus.innerHTML = `
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span class="font-mono-code text-[9px] font-bold text-amber-300">离线缓存智库</span>
        `;
    }
}

// Check and trigger today's auto-sync when entering page / foreground
async function checkAndAutoSyncToday(forced = false) {
    const today = getTodayString();
    const lastSync = localStorage.getItem('insightx_last_sync_date');
    const isOnline = (typeof navigator !== 'undefined') ? navigator.onLine : true;

    updateLiveStatusBadge(isOnline, today);
    if (!isOnline) return;

    if (!forced && lastSync === today) {
        return; // Already synchronized today
    }

    // Automatically refresh stream in background
    if (!isGenerating) {
        console.log('[AutoSync] Triggering today sync for date:', today);
        generateAICards(currentSector);
    }
}

// Lifecycle listeners for Mobile App (Capacitor/Cordova/React Native) & WeChat Mini-Program (web-view / Taro)
function setupLifecycleAutoSync() {
    // 1. Browser & WebView online / offline network listener
    window.addEventListener('online', () => {
        updateLiveStatusBadge(true, getTodayString());
        checkAndAutoSyncToday(true);
    });
    window.addEventListener('offline', () => {
        updateLiveStatusBadge(false);
    });

    // 2. Mobile App comes back to foreground (user unlocks phone, switches back to App)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkAndAutoSyncToday();
        }
    });
    window.addEventListener('focus', () => {
        checkAndAutoSyncToday();
    });

    // 3. WeChat Mini Program Bridge Hook (when embedded in Mini Program web-view)
    if (typeof window !== 'undefined') {
        if (window.WeixinJSBridge) {
            updateLiveStatusBadge(navigator.onLine, getTodayString());
        } else {
            document.addEventListener('WeixinJSBridgeReady', () => {
                updateLiveStatusBadge(navigator.onLine, getTodayString());
            });
        }
    }
}

// ── Card Rendering & Intelligence Generator ────────────────────"""

html = html.replace(target_func, engine_code)

# 4. In DOMContentLoaded, call setupLifecycleAutoSync()
old_dom = r'setupBottomNav\(\);'
new_dom = """setupBottomNav();
    setupLifecycleAutoSync();
    updateLiveStatusBadge(navigator.onLine, getTodayString());"""
html = re.sub(old_dom, new_dom, html, count=1)

# 5. In generateAICards, mark last_sync_date
old_generate = r'currentCards = \[\.\.\.liveCards, \.\.\.remainingMaster\];'
new_generate = """currentCards = [...liveCards, ...remainingMaster];
                localStorage.setItem('insightx_last_sync_date', getTodayString());
                updateLiveStatusBadge(true, getTodayString());"""
html = re.sub(old_generate, new_generate, html, count=1)

with open(index_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Injected Mobile & Mini-Program Lifecycle Auto-Sync Engine successfully!")
