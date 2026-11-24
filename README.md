# InsightX 2.0 (AI 商业决策参谋)

> **极简高信噪比的 AI 商业决策雷达**：新模型速递 · Token 经济学 · 播客长音频原声解密。  
> 专为商业化产品经理、业务负责人及一级市场投资人打造。

## 🎬 产品宣传片

https://github.com/user-attachments/assets/06a27e40-b8fd-49e5-8eed-ed9f997f1569

---

## 💡 解决什么痛点？它能干什么？

追踪 AI 商业动态并做出技术选型与预算决策，往往需要 **刷十几个信息源 → 过滤 90% 公关水稿 → 啃完两小时播客找一句关键原话 → 手动换算各家定价单位 → 整理成团队研报**，动辄耗时大半天。

**InsightX 2.0** 将整套情报获取与商业分析链路浓缩到一个极简高信噪比的决策参谋工作台里：

- **输入**：选定核心决策赛道（新模型速递 / Token 经济学 / 播客与财报原声 / SaaS 商业化）+ 多端口并发采集（支持浏览器直连、FastAPI 后端或离线内置样例）；
- **输出**：结构化商业情报卡片（Bento 2×2 参数格、交互式 ROI 算账滑块、30s 播客原声定位、2D 战略态势散点雷达）+ **一键导出 Markdown 决策研报**；
- **隐私与成本**：单页前端无需构建即可在**本地浏览器开箱即用**，API Key 与偏好严格保存于本地 `localStorage`，零密钥泄露风险。

---

## 🔄 核心使用流程

```text
① 选定决策赛道 ──▶ ② 多端口并发扫描 & 8 卡门禁解锁 ──▶ ③ 左滑忽略噪音 / 右滑收藏入库 ──▶ ④ 深度算账 & 矩阵透视 & 一键导出 MD
```

---

## ✨ 核心功能清单

1. ⚡ **多端口并发检索与 8 卡门禁 (Omnichannel & Gatekeeper)**
   - **全端口透明遥测**：并发检索 HuggingFace、HackerNews、IT之家、36氪、GitHub Trending、Token 定价雷达、小宇宙等渠道，可在遥测大盘实时查看各端口状态、耗时与埋点日志；
   - **8 卡门禁与 20 张缓冲限额**：集齐满 8 张高信噪比卡片自动解锁浏览流，队列严格限制在 20 张以内，拒绝信息过载。
2. 🃏 **Tinder 式手势分拣与三大特化组件 (Smart Decision Cards)**
   - **极简划卡分拣**：卡片堆叠浏览，**← 左滑忽略**公关通稿，**右滑收藏 →** 归档至智库；点击卡片可展开完整深度拆解与原文出处；
   - **🏷️ Bento 2×2 参数格**：将架构规格、上下文长度、商用协议与跑分评测浓缩进 4 格卡片，1 秒看穿技术硬指标；
   - **🎚️ 交互式 ROI 动态推演滑块**：对同口径降价情报，拖动日调用量滑块（20 万–500 万 Token/日），实时换算月省金额与降幅；
   - **🎙️ 播客与财报原声定位胶囊**：攻克长音频收听门槛，直接锚定创始人发言时间戳、原声金句与节目出处链接。
3. 📊 **二维战略态势矩阵 (Matrix Radar)**
   - **一图锁定高价值区**：以「技术/合规落地阻碍」为横轴、「商业价值与 ROI」为纵轴构建二维散点图，点击任意散点节点即刻透视 ROI 收益与落地行动建议。
4. 🔖 **归档智库与一键导出研报 (Vault & Export)**
   - **分类沉淀与一键输出**：右滑收藏的情报自动按「颠覆预警 / 增长机遇 / 模式观察」分类管理，支持**一键导出结构化 Markdown 研报**，直接对接 Obsidian 或团队周报。

---

## ⚡ 快速体验 (Quick Start)

### 方式一：前端纯客户端即开即用（无需安装任何环境）
前端无需构建，可使用浏览器直连部分公开来源。采集不可用时会显示标有「样例」的内置卡片。
1. 直接在电脑浏览器中双击打开 `frontend/index.html`；
2. 可体验卡片滑动、Bento 参数格和基于同口径单价的 Token 成本推演；
3. 点击右上角设置图标，可配置本地私有的大模型 API Key（仅存储于浏览器本地 `localStorage`）。

### 方式二：启动 Python FastAPI 后端服务
```bash
# 1. 进入后端目录
cd backend

# 2. 安装 Python 依赖
pip install -r requirements.txt

# 3. 复制环境变量并配置密钥
cp .env.example .env

# 4. 启动服务
uvicorn app.main:app --reload --port 8000
```
启动后访问 `http://localhost:8000/docs` 可查阅 OpenAPI / Swagger 接口文档。

前端自动连接本机 8000 端口的聚合接口。在线渠道包括 Hacker News、DEV.to、vLLM 和 Transformers 官方发布，以及 Latent Space 的公开播客 RSS。播客卡可播放 RSS 提供的节目音频。若需换源，在 `backend/.env` 中设置 `PODCAST_RSS_URL`，并重启后端。

---

## 📂 项目工程结构

```text
InsightX/
├── .gitignore               # 规范的依赖与环境过滤规则
├── LICENSE                  # MIT 开源协议
├── README.md                # 项目主说明文档
├── docs/
│   ├── PRD_v2.0.md          # 完整的 PRD 2.0 需求规格文档
│   ├── ARCHITECTURE.md      # 系统技术架构与数据流图
│   └── PRD_v1.0_legacy.md   # 历史 v1.0 需求存档
├── frontend/
│   └── index.html           # Linear 风格 Obsidian 极暗美学单页客户端
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI 服务入口
│   │   ├── config.py        # 环境变量配置
│   │   ├── models/          # Pydantic 商业情报数据模型
│   │   └── services/        # 抓取、Whisper 转录与 LLM 提取逻辑
│   ├── requirements.txt     # 后端依赖声明
│   └── .env.example         # 环境变量配置模板
└── archive/                 # 历史迭代草稿与早期脚手架存档
```

---

## 🛡️ 安全与隐私规范 (Security & Privacy)

- **零密钥泄露**：全量源码中不包含任何硬编码 API Key；
- **本地自治**：前端仅在本地浏览器 `localStorage` 中记录用户偏好与配置的 API 密钥；
- **事实求真**：所有引用的 ROI 效能数据及定价均附带溯源校验机制，杜绝大模型盲目脑补。

---

## 📄 授权协议 (License)

本项目采用 [MIT License](LICENSE) 授权许可。
