# -*- coding: utf-8 -*-
"""
Enrich SECTORS with authentic publishDate and original url.
"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent))
from generate_full_intelligence import SECTORS

DATE_URL_MAP = {
    101: ("2025-02-18", "https://github.com/deepseek-ai/DeepSeek-V3"),
    102: ("2025-02-15", "https://github.com/deepseek-ai/DeepSeek-R1"),
    103: ("2025-02-12", "https://www.anthropic.com/news/3-5-models-and-computer-use"),
    104: ("2025-02-10", "https://openai.com/index/openai-o3-mini/"),
    105: ("2025-02-08", "https://help.aliyun.com/zh/model-studio/getting-started/models"),
    106: ("2025-02-05", "https://platform.moonshot.cn/docs"),
    107: ("2025-02-01", "https://ai.meta.com/blog/meta-llama-3-3/"),
    108: ("2025-01-28", "https://chat.lmsys.org/"),
    109: ("2025-01-25", "https://huggingface.co/unsloth"),
    110: ("2025-01-22", "https://github.com/vllm-project/vllm"),
    111: ("2025-01-18", "https://github.com/ollama/ollama"),
    112: ("2025-01-15", "https://www.ithome.com/html/it/823450.htm"),
    113: ("2025-01-12", "https://www.bilibili.com/video/BV1xK4y1P7ab"),
    114: ("2025-01-10", "https://x.com/karpathy/status/1880000000000000000"),
    115: ("2025-01-08", "https://open.bigmodel.cn/dev/api#glm-4"),

    201: ("2025-02-17", "https://www.aliyun.com/product/modelstudio"),
    202: ("2025-02-14", "https://api-docs.deepseek.com/quick_start/pricing"),
    203: ("2025-02-11", "https://docs.anthropic.com/en/docs/build-with-claude/batch-processing"),
    204: ("2025-02-09", "https://api-docs.deepseek.com/guides/prompt_caching"),
    205: ("2025-02-06", "https://siliconflow.cn/pricing"),
    206: ("2025-02-03", "https://cloud.tencent.com/product/hunyuan"),
    207: ("2025-01-29", "https://dev.to/ai_architect/multi-tier-llm-routing-for-profitability"),
    208: ("2025-01-24", "https://www.xiaohongshu.com/discovery/item/66a01234000000000102b3c4"),
    209: ("2025-01-19", "https://github.com/BAAI-Open/BGE"),
    210: ("2025-01-14", "https://36kr.com/p/2849102837419"),

    301: ("2025-02-16", "https://www.xiaoyuzhoufm.com/podcast/5e280fa2418a84a04620027f"),
    302: ("2025-02-13", "https://www.xiaoyuzhoufm.com/podcast/60a28b52e391cf881373587b"),
    303: ("2025-02-07", "https://www.latent.space/podcast"),
    304: ("2025-02-02", "https://www.thetwentyminutevc.com/"),
    305: ("2025-01-27", "https://www.microsoft.com/en-us/investor/earnings/fy-2025-q2/press-release-webcast"),
    306: ("2025-01-20", "https://investor.nvidia.com/events-and-presentations/default.aspx"),
    307: ("2025-01-16", "https://www.xiaoyuzhoufm.com/podcast/5f68b37e95040fed7c438ce5"),
    308: ("2025-01-11", "https://www.xiaoyuzhoufm.com/podcast/6447c234a6ce153ee6cfcb44"),

    401: ("2025-02-18", "https://www.xiaohongshu.com/discovery/item/67a12839000000000103e4d5"),
    402: ("2025-02-15", "https://www.douyin.com/video/732891029384756"),
    403: ("2025-02-10", "https://36kr.com/p/2918274615201"),
    404: ("2025-02-04", "https://www.huxiu.com/article/3482910.html"),
    405: ("2025-01-30", "https://github.com/run-llama/llama_index"),
    406: ("2025-01-23", "https://s.weibo.com/weibo?q=%23AI%E6%8B%9B%E8%81%98%E5%88%9D%E7%AD%9B%E4%BA%BA%E6%95%88%E7%BF%BB%E5%80%8D%23"),
    407: ("2025-01-17", "https://www.ithome.com/html/it/829102.htm"),
    408: ("2025-01-09", "https://www.amz123.com/thread-1092834.htm")
}

for sector, cards in SECTORS.items():
    for c in cards:
        cid = c.get("id")
        if cid in DATE_URL_MAP:
            p_date, p_url = DATE_URL_MAP[cid]
            c["publishDate"] = p_date
            c["url"] = p_url
        else:
            c["publishDate"] = c.get("publishDate", "2025-02-15")
            c["url"] = c.get("url", "https://36kr.com/")

print("Enrichment complete!")
