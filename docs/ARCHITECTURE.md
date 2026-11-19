# InsightX 2.0 系统技术架构 (Architecture Overview)

本文档阐述 InsightX 2.0 的端到端技术架构、数据流向及模块拆分设计。

```mermaid
flowchart TD
    subgraph DataSources [多模态原始数据源]
        A1[官方更新日志 / 模型发布]
        A2[播客 / 财报电话会音频 (YouTube/小宇宙)]
        A3[技术社区 (HackerNews / Dev.to / RSS)]
    end

    subgraph IngestionLayer [采集与预处理层 - FastAPI]
        B1[正文提取器 (Jina Reader / Firecrawl)]
        B2[音频切片与 Whisper ASR (带时间戳)]
        B3[向量化去重与事件聚类 (Semantic Deduplication)]
    end

    subgraph LLMEngine [商业结构化提取引擎]
        C1[新模型硬指标抽取 (Bento Specs)]
        C2[Token 经济与定价模型测算 (Pricing)]
        C3[播客金句与原声时间戳对齐 (Quotes)]
        C4[通用商业 4+1 要素标准化输出]
    end

    subgraph PresentationLayer [前端展示层 - Obsidian UI]
        D1[情报流 (Tinder Triage Feed)]
        D2[态势矩阵 (2D Strategic Matrix)]
        D3[智库归档与 Markdown 导出 (Vault)]
    end

    DataSources --> IngestionLayer
    IngestionLayer --> LLMEngine
    LLMEngine --> PresentationLayer
```

## 1. 核心模块与技术选型

| 模块 | 核心技术 | 职责说明 |
| :--- | :--- | :--- |
| **前端应用 (Frontend)** | HTML5 / TailwindCSS / Phosphor Icons | 采用 Linear 风格 Obsidian 极暗美学，支持手势滑动、Bento 参数格、ROI 滑块交互与原声波形试听 |
| **后端 API (Backend)** | Python 3.11+ / FastAPI / Pydantic | 提供卡片查询、实时采集、音频转录及代理 LLM 请求接口 |
| **音频转录 (ASR)** | `yt-dlp` + OpenAI Whisper / Groq Whisper | 提取播客与财报录音，输出带精确起始秒数的字幕逐字稿 |
| **大语言模型 (LLM)** | 阿里通义千问 (Qwen-Plus) / Claude 3.5 Sonnet | 执行零幻觉结构化提炼，强制输出经过校验的 JSON 数据 |

## 2. 目录结构
```text
InsightX/
├── .gitignore
├── LICENSE
├── README.md
├── docs/
│   ├── PRD_v2.0.md
│   ├── ARCHITECTURE.md
│   └── PRD_v1.0_legacy.md
├── frontend/
│   └── index.html           # 现代化单页应用 (直接在浏览器双击即可运行)
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 服务入口
│   │   ├── config.py        # 配置与环境变量管理
│   │   ├── models/          # 数据模型定义
│   │   └── services/        # 爬虫、转录与 LLM 提取服务
│   ├── requirements.txt
│   └── .env.example
└── archive/                 # 历史迭代草稿与旧版脚手架安全归档
```
