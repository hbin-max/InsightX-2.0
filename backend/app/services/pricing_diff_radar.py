from typing import List, Dict, Any

# ═════════════════════════════════════════════════════════════════
#  TOKEN PRICING DIFF RADAR
#  - Monitors Official Pricing Pages & Price Drop Announcements
#  - Tracks OpenAI, DeepSeek, Alibaba Cloud, Anthropic
# ═════════════════════════════════════════════════════════════════

def get_official_pricing_diffs() -> List[Dict[str, Any]]:
    """
    监控全网主流厂商最新定价表变动、降价公告与单位经济学测算
    """
    return [
        {
            "id": 501,
            "type": "warning",
            "tag": "降价通告",
            "heat": "匹配度 99%",
            "title": "阿里云百炼宣布全系模型最高降价 97%：千问 Turbo 降至 ¥0.3/百万Token",
            "originalTitle": "Alibaba Cloud Slashes Model Studio API Prices by Up to 97%",
            "source": "阿里云官方计费规则变动公告",
            "sourcePlatform": "36kr",
            "sourceType": "article",
            "sourceTime": "官方正式生效",
            "tokenPricing": {
                "unitPrice": "¥0.0003 / 千 Token",
                "dropPercent": "最高直降 97%",
                "prevPrice": "¥0.008"
            },
            "summary": "阿里云宣布对百炼平台上的通义千问全系商业模型实行历史级降价，Qwen-Turbo 输入成本直降 97%，百万 Token 价格仅需 3 毛钱，Qwen-Plus 降幅亦达 80% 以上。",
            "monetization": "打破原有商业壁垒，以极致薄利多销策略压制中小模型厂商，抢占国内开发者生态。",
            "roi": "原本单月需要 10 万元 API 预算的中型 SaaS 业务，切换后月度开销直接收缩至 5,000 元以内。",
            "useCase": "海量文本清洗打标、全网舆情监控过滤、电商长篇评论情感分析。",
            "friction": "极低价格吸引大量突发并发，建议核心业务配置 2 家以上备用云厂商路由。",
            "action": "立即重构低附加值批量数据清洗任务的后端模型配置，全部切到千问降本。",
            "matrixX": 18,
            "matrixY": 96
        },
        {
            "id": 502,
            "type": "opportunity",
            "tag": "定价对比",
            "heat": "匹配度 97%",
            "title": "2025 全球大模型 API 性价比横向透视：DeepSeek 与 GPT-4o 经济学测算",
            "originalTitle": "Global LLM Pricing Telemetry: Unit Economics Breakdown for 2025",
            "source": "InsightX 商业定价实测雷达",
            "sourcePlatform": "web",
            "sourceTime": "本周最新测算",
            "tokenPricing": {
                "unitPrice": "输入 ¥1 / 输出 ¥2",
                "dropPercent": "性价比倍率 8.5x",
                "prevPrice": "GPT-4o $2.5 / $10"
            },
            "summary": "通过真实业务场景 100 万次混合长文本测试：在相同准确率要求下，DeepSeek-V3 的实际账单支出仅为 GPT-4o 的 12%，为开发者释放了至少 88% 的算力毛利缓冲区。",
            "monetization": "企业级软件从原本紧绷的'每席位限制50次对话'，可直接放开为'无限次畅想调用'。",
            "roi": "毛利率由原先危险的 28% 直接提升至 74%，SaaS 估值模型大幅改善。",
            "useCase": "代码生成助理、知识库长文本检索与综合多 Agent 协同系统。",
            "friction": "欧美客户可能因数据主权与服务器物理位置要求指定境外云节点。",
            "action": "出海客户继续采用海外端点，国内业务全面切换到高性价比国产端点。",
            "matrixX": 22,
            "matrixY": 94
        },
        {
            "id": 503,
            "type": "opportunity",
            "tag": "批量特惠",
            "heat": "匹配度 93%",
            "title": "Anthropic 与 OpenAI 全面上线 Batch API：离线异步调用直接半价",
            "originalTitle": "Batch API Explosion: 50% Flat Discount for 24-Hour Asynchronous Inference",
            "source": "OpenAI & Anthropic 官方定价文档",
            "sourcePlatform": "devto",
            "sourceTime": "阅读 6min",
            "tokenPricing": {
                "unitPrice": "全额立减 50%",
                "dropPercent": "半价计费",
                "prevPrice": "实时调用原价"
            },
            "summary": "针对不要求毫秒级实时返回的非在线业务（如夜间报表汇总、历史数据打标签、离线翻译评测），只要允许在 24 小时内异步完成，即可直接享受 50% 的硬性折扣，且享有独立的并发通道。",
            "monetization": "将非核心低延时业务转入夜间跑批队列，将白天宝贵的 API 速率配额留给实时用户。",
            "roi": "企业离线分析与批量内容生成任务的账单即刻腰斩，且绝无网络超速报错烦恼。",
            "useCase": "夜间财务报表自动化分析、历史文章向量化抽取、大规模产品库多语言翻译。",
            "friction": "需要后端自建异步任务结果轮询或 Webhook 接收队列，研发工时约 1-2 天。",
            "action": "梳理当前系统的所有 LLM 调用点，将所有非实时用户请求全部拆分为 Batch 任务。",
            "matrixX": 26,
            "matrixY": 89
        }
    ]
