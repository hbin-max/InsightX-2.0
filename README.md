<h1 align="center">InsightX 2.0</h1>

<p align="center"><strong>An AI intelligence desk for product and business decisions.</strong><br>Discover releases, compare token costs, listen to source audio, and turn a shortlist into a research brief.</p>

<p align="center"><a href="#quick-start">Quick start</a> · <a href="#how-it-works">Workflow</a> · <a href="#api-reference">API</a> · <a href="#documentation">Documentation</a></p>

## See it in action

https://github.com/user-attachments/assets/06a27e40-b8fd-49e5-8eed-ed9f997f1569

## Why InsightX

A model announcement answers one question. A rollout decision needs several more. What actually shipped? What does the license allow? How does the price affect your traffic? Where can a teammate check the original source?

InsightX collects those questions around a reviewable card. Product managers, AI business leads, and early-stage investors can triage updates quickly and spend their time on the records worth investigating. The browser workbench has no build step. A local FastAPI service adds aggregation, model-assisted extraction, and database-backed cards.

## How it works

1. **Pick a track.** Follow model launches, token economics, podcast and earnings coverage, or SaaS commercialization.
2. **Inspect the intake.** The feed opens when eight cards are ready and caps its active queue at twenty. Channel telemetry shows where items came from and distinguishes live results from built-in examples, empty responses, and failed requests.
3. **Triage the stack.** Swipe left to dismiss or right to save a card. Open the detail view to inspect its analysis and the available primary-source link.
4. **Work through the evidence.** Compare technical specifications, estimate token costs, open the source audio where available, or inspect a card in the matrix.
5. **Keep what is useful.** Filter saved cards in the vault and copy a Markdown brief for further editing or team notes.

## What you can do

| Workspace | What it helps you decide |
| --- | --- |
| **Feed and telemetry** | See which channels supplied eligible items and whether a result is live, empty, failed, or a sample. |
| **Bento specifications** | Review architecture, context window, license, and benchmark information when the source provides it. |
| **Token cost calculator** | Change daily volume from 200,000 to 5,000,000 tokens and compare prices on the same currency and unit basis. |
| **Podcast cards** | Open the episode or play available RSS audio. A source may provide an excerpt, a full episode, or metadata only. |
| **Decision matrix** | Compare estimated deployment friction and business value. Items awaiting a score are marked accordingly. |
| **Vault** | Keep shortlisted items together and copy a Markdown summary to the clipboard. |

### Example: estimate a monthly token-cost change

Take an illustrative workload of 2,000,000 tokens per day. At ¥5 per million tokens the 30-day cost is ¥300. At ¥2 per million it is ¥120. The estimated difference is **¥180 per month**, or 60% of the original token line item.

The calculation is `daily tokens × 30 ÷ 1,000,000 × (old unit price − new unit price)`. For a decision memo, record the currency, the billing unit, and the input/output mix behind the rates you selected. If comparable prices are unavailable, the app leaves the estimate unavailable.

### Where the feed comes from

Browser-side fetches can supplement a local aggregation service. Backend sources include Hacker News, DEV Community, GitHub releases for vLLM and Transformers, and the public Latent Space podcast RSS feed. Other channels can show bundled examples or no results when live data is unavailable. Examine the source and status before citing a card in a decision.

## Quick start

### Open the browser workbench

Open [frontend/index.html](frontend/index.html) from your local checkout in a browser. Pick a track and start with the cards that are available. Browser-based requests depend on network access and each provider's cross-origin rules. Labeled sample cards provide a way to explore the interface when a live source is unavailable.

### Start the optional FastAPI service

From the repository root:

```bash
cd backend
python -m venv .venv
```

Activate the environment with `source .venv/bin/activate` on macOS or Linux, or `.venv\Scripts\Activate.ps1` on Windows PowerShell. Then run:

```bash
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open [the local interactive API docs](http://127.0.0.1:8000/docs) and use the browser workbench with the service running on port 8000. To configure providers, copy [backend/.env.example](backend/.env.example) to `backend/.env` and supply the relevant settings. Set `PODCAST_RSS_URL` and restart the service to try another public podcast feed.

## API reference

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Check whether the local service is ready to respond. |
| `GET /api/omni-feed` | Aggregate feed items and return per-channel outcomes. |
| `GET /api/channels/status` | List configured channels and their metadata. |
| `GET /api/cards` | Read stored cards, optionally filtered by track. |
| `GET /api/stats` | Count stored cards by track. |
| `POST /api/ingest` | Extract and store items from a bounded batch, with duplicate and failure counts. |
| `POST /api/custom-extract` | Turn manually supplied text into a structured card and store the result on success. |
| `POST /api/test-connection` | Check whether a configured model can return a usable response. |
| `GET /api/telemetry` | Inspect recent backend telemetry events. |

## Architecture and data handling

- **[Browser client](frontend/index.html).** A single-page front end manages navigation, interactions, the card queue, and the local vault. On that browser origin, preferences, saved cards, and browser-side provider configuration are stored in `localStorage`.
- **[API service](backend/app/main.py).** FastAPI exposes aggregation, extraction, connection checks, and card reads. A local SQLite database persists cards created through the backend.
- **Provider calls.** Enabling a model integration sends the data needed for its requests to the selected endpoint. Store backend credentials in the local environment. Treat browser-side API keys as sensitive browser data.
- **Evidence and estimates.** Source availability varies. Verify the original license, benchmark, or price before making a decision. A cost projection applies to its entered rates and volume.

## Working with a shortlist

A useful shortlist is small enough that every saved item can be traced back to a release, episode, or other source. For a model evaluation, save the release first, then record which workload, context limit, and license you are comparing. Use the matrix to prioritize what to investigate and the Markdown output to share those questions.

| If you see this | What to check |
| --- | --- |
| The feed stays in its waiting state | Inspect channel telemetry and retry after enough distinct items are available. |
| A source is marked as a sample | Use it to explore the interface and open the original publication when making a real decision. |
| There is no cost projection | Check that the old and new rates use the same currency and billing unit. |
| No audio player appears | Open the source episode link if one is available. A playable enclosure depends on the feed. |
| Extraction returns an error | Check the model endpoint, model name, and response format. Failed extractions are reported separately from stored cards. |

## Documentation

- [Architecture and data flow](docs/ARCHITECTURE.md)
- [Product requirements](docs/PRD_v2.0.md)
- [Repository index](REPO_INDEX.md)
- [Project handover](HANDOVER.md)
- [Showreel source](insightx-showreel-v2)

Licensed under the [MIT License](LICENSE).
