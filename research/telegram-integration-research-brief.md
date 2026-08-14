# Research Brief — Hermes Agent Tutorial: "Connect Hermes Agent to Telegram"

**Prepared:** August 14, 2026 · **Researcher:** Hermes subagent (research pipeline)
**Status:** All facts verified against fetched HTTP-200 sources. No invented versions, pricing, or features.

---

## 1. Topic

### Chosen topic (primary)
**"How to connect Hermes Agent to Telegram: chat with your AI agent from your phone (beginner's guide)"** — a TOOL/INTEGRATION tutorial teaching the complete Telegram → Hermes Agent setup: creating a bot with BotFather, securing it with user allowlists, running the Messaging Gateway, and leveling up with voice memos, images/files, group chats, and cron delivery.

Why this topic:
- **Native, first-class integration** — Telegram is one of Hermes' headline platforms. The official docs homepage literally says: *"Talk to it from Telegram while it works on a cloud VM you never SSH into yourself."* The integration needs **zero glue code** (no custom webhook server, no API wrapper) — the gateway's built-in Telegram adapter (built on `python-telegram-bot`) does the work. Ideal beginner tutorial.
- **Free, no credit card** — Telegram is free for users and developers (official statement: "The Telegram Bot Platform hosts more than 10 million bots and is free for both users and developers").
- **Clear content gap confirmed** — hermes-tutorials.dev has 58 guides; the only Telegram-adjacent posts are: `gateway-setup` (multi-platform quick start, Jul 17 2026), `cron-job-patterns-2026` (delivery to Telegram), and a PT-BR install tutorial. **No dedicated English Telegram guide exists.**
- Strong "wow" factor + phone-first UX; works on any device; pairs naturally with published voice-mode and cron posts (cross-linking opportunities).
- High search demand: "telegram bot + AI agent" is a heavily searched how-to space (n8n/OpenAI equivalents rank highly, confirming demand).

### Backup topic 1
**"Add semantic memory to Hermes Agent with the Qdrant MCP server"** — vector-database memory layer via Qdrant's official MCP server (`qdrant/mcp-server-qdrant`, Apache-2.0, ~1.5k stars). Verified: free-forever Qdrant Cloud tier (single node, 0.5 vCPU / 1GB RAM / 4GB disk, free cloud inference with selected models); MCP server exposes store/find tools, config via `QDRANT_URL`, `QDRANT_API_KEY`, `COLLECTION_NAME`; install via `uv` or Docker; works with Hermes' MCP integration. Distinct from the generic "MCP servers guide" + "build custom MCP server" posts because it's a specific vendor tool tutorial.

### Backup topic 2
**"Use Supabase as the hosted Postgres backend for Hermes Agent"** — hosted Postgres with a free tier for agent data/checkpoints. Verified from supabase.com/pricing: Free $0/mo (unlimited API requests, 50,000 MAU, 500MB database, 5GB egress, 1GB file storage, pauses after 1 week inactivity, 2 active projects); Pro from $25/mo; Team from $599/mo; compute from $10/mo (Micro, first instance free on paid plans). Integration angle: Postgres connection string in Hermes config / Supabase MCP.

---

## 2. Primary long-tail keyword

**Primary:** `how to connect your AI agent to telegram`
(how-to shaped, includes both the tool (Telegram) and the goal; matches real search intent — n8n/OpenAI "build a telegram AI bot" guides rank for near variants, confirming demand.)

**Alternates (for title/H2/H3 variants):**
- `how to create a telegram bot for your ai agent`
- `chat with your ai agent from telegram`
- `hermes agent telegram bot setup`
- `how to set up a telegram bot that talks to chatgpt-style agents` (avoid — implies wrong product)
- Question variant: `can you chat with an ai agent on telegram`

---

## 3. Verified tool details (Telegram Bot Platform)

All verified against fetched sources (URLs in section 4).

### What it is
- Telegram bots are "small applications that run entirely within the Telegram app" with flexible interfaces supporting any task/service (core.telegram.org/bots).
- The platform is free: **"The Telegram Bot Platform hosts more than 10 million bots and is free for both users and developers."**
- Telegram natively supports AI chatbot use cases: threaded conversations for parallel topics, and **streaming live responses** as they're generated; threaded mode toggled via BotFather.
- **Bot API 10.1 (June 11, 2026)** added "Rich Messages" — highly structured text and streaming AI-generated replies with rich formatting (from the official API changelog).

### Key API facts (for the guide's "how it works" section)
- Every bot gets an **API token** from **@BotFather** (Telegram's official bot management tool). Token format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`.
- All Bot API calls: `https://api.telegram.org/bot<token>/METHOD_NAME`, **HTTPS required**.
- **Two mutually exclusive ways to receive updates**: `getUpdates` (long polling / pull) and `setWebhook` (push). Updates are stored server-side but **never longer than 24 hours**.
- `setWebhook`: Telegram sends an **HTTPS POST** with a JSON-serialized `Update`; retries on non-2XX responses.
- Webhook server requirements (only relevant if you DIY; Hermes uses long polling): IPv4 only (IPv6 not supported for webhooks), accept POSTs from subnets `149.154.160.0/20` and `91.108.4.0/22` on ports 443/80/88/8443, TLS 1.2+, verified or self-signed cert with CN/SAN matching the domain.

### Pricing
- **Free** for users and developers. No credit card, no paid tier required to run bots. (Telegram Stars exist for payments/mini-app monetization — out of scope.)

### Platform availability
- Telegram apps: Android, iOS, Windows/macOS/Linux desktop, web, and the in-app BotFather flow. Bots are created inside the Telegram app itself; the bot runs server-side (your machine or a VPS).

### Signup / setup flow (verified, condensed)
1. Install Telegram, create an account (free).
2. Open a chat with **@BotFather** → `/newbot` → display name → unique username ending in `bot` → receive API token.
3. (Optional) `/setdescription`, `/setabouttext`, `/setuserpic`, `/setcommands`, `/setprivacy`.
4. Get your numeric **user ID** (not username) via **@userinfobot** or **@get_id_bot**.
5. Give the token + user ID to Hermes (see outline) → `hermes gateway` → bot comes online in seconds.

---

## 4. Verified source URLs (all fetched, HTTP 200, content confirmed)

| # | URL | Status | What it supports |
|---|-----|--------|------------------|
| 1 | https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram | 200 (web_extract) | **Primary source.** Complete Hermes Telegram steps: BotFather /newbot flow, token format & secrecy (/revoke), privacy mode for groups (disable via BotFather → Bot Settings → Group Privacy, must re-add bot), finding user ID via @userinfobot/@get_id_bot, config via `hermes gateway setup` or `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ALLOWED_USERS` in `~/.hermes/.env`, `hermes gateway` startup, built on python-telegram-bot, text/voice/images/files support, status indicator, command menu (60-command default, 100 max), group forum topics, MEDIA: file delivery + Docker path pitfall, troubleshooting. |
| 2 | https://hermes-agent.nousresearch.com/docs/user-guide/messaging | 200 (web_extract) | Gateway architecture: 20+ platforms from one background process; Telegram capability row (Voice/Images/Files/Threads/Typing/Streaming ✅); `hermes gateway setup/install/start/stop/status` commands; cron scheduler ticks every 60s; full chat command table (/new, /model, /sethome, /sessions, /background, /voice…); security: deny-by-default allowlists, `TELEGRAM_ALLOWED_USERS`, DM pairing (`hermes pairing approve telegram <code>`, 1-hour expiry), admin vs regular user tiers; delivery ledger. |
| 3 | https://core.telegram.org/bots | 200 (curl) | Official intro: bots are in-app applications; "hosts more than 10 million bots and is free for both users and developers"; native AI-chatbot support incl. streaming replies; BotFather is the bot-management tool. |
| 4 | https://core.telegram.org/bots/api | 200 (curl) | Bot API reference: token format `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`; HTTPS endpoint `https://api.telegram.org/bot<token>/METHOD_NAME`; getUpdates vs webhooks are mutually exclusive; updates kept max 24h; setWebhook HTTPS POST with JSON Update + retry behavior; changelog: Bot API 10.1 (June 11, 2026) Rich Messages for streaming AI replies. |
| 5 | https://core.telegram.org/bots/webhooks | 200 (hybrid_fetch) | "Marvin's Marvellous Guide to All Things Webhook": getUpdates = pull, setWebhook = push; webhook server requirements (IPv4, subnets, ports 443/80/88/8443, TLS 1.2+, self-signed certs allowed); webhooks deliver updates immediately (lower latency). Supports the "why Hermes uses long polling" explanation. |
| 6 | https://hermes-agent.nousresearch.com/docs | 200 (web_extract) | Hermes positioning: "Talk to it from Telegram while it works on a cloud VM…"; Messaging Gateway link; install commands (`curl -fsSL https://hermes-agent.nousresearch.com/install.sh \| bash`); platform support; Nous Portal note (bots need a model provider + tool providers). |

*Backup-topic verification URLs:* https://github.com/qdrant/mcp-server-qdrant (200; official MCP server, Apache-2.0, v0.8.1, env vars, uv/Docker install) · https://qdrant.tech/pricing/ (200; free-forever tier: 1 node, 0.5 vCPU/1GB RAM/4GB disk, free inference on selected models) · https://supabase.com/pricing (200; Free $0: 500MB DB, 50k MAU, unlimited API requests, pauses after 1 week, 2 active projects; Pro $25; Team $599).

---

## 5. Guide description + step-by-step outline

**One-paragraph description:** This beginner tutorial shows how to turn your Hermes Agent into a personal Telegram bot you can message from any device. Readers will create a bot with BotFather, lock it down with a user allowlist, start the Messaging Gateway, and immediately chat with their agent — then level up with voice memos that get auto-transcribed, image/file attachments, group-chat usage, scheduled cron deliveries straight into Telegram, and a 24/7 systemd service. No custom code, no webhook server, no paid services: everything runs on Hermes' built-in Telegram adapter and Telegram's free Bot API.

**Step-by-step outline (10 steps):**
1. **What you'll build & prerequisites** — Hermes Agent installed (one-line installer), a model provider configured (Nous Portal / OpenRouter / local); free Telegram account; the "why": docs quote "Talk to it from Telegram…".
2. **Create your bot with BotFather** — open @BotFather, `/newbot`, pick display name + username ending in `bot`, copy the API token; security warning (keep secret, `/revoke` if leaked).
3. **Polish the bot (optional)** — `/setdescription`, `/setabouttext`, `/setuserpic`, `/setcommands` (recommended set: help/new/sethome).
4. **Find your Telegram user ID** — message @userinfobot (or @get_id_bot); note the numeric ID ≠ username.
5. **Configure Hermes** — Option A (recommended): `hermes gateway setup` interactive wizard (select Telegram, enter token + allowed user IDs). Option B: manual `TELEGRAM_BOT_TOKEN` / `TELEGRAM_ALLOWED_USERS` in `~/.hermes/.env`.
6. **Start the gateway & first message** — `hermes gateway`; bot online within seconds; send your first prompt; try slash commands (/new, /model, /status, /sethome).
7. **Security defaults** — why deny-by-default matters for a bot with terminal access; allowlists vs DM pairing (`hermes pairing approve telegram <code>`); admin vs regular-user tiers; `/whoami`.
8. **Level up: voice, media, groups** — voice memos auto-transcribed (links to published voice-mode post); sending generated files via `MEDIA:` paths (+ Docker backend pitfall: paths must be host-visible); group chats — privacy mode ON by default (only /-commands, replies, service messages), disable via BotFather → Group Privacy or promote bot to admin; must remove & re-add bot after the change.
9. **Automate into Telegram** — cron jobs deliver results to Telegram (links to published cron post); background sessions (`/background`); status indicator (`status_indicator: true` → Online/Offline).
10. **Run it 24/7 & troubleshoot** — `hermes gateway install` (systemd/launchd); run on a cheap VPS; troubleshooting table (bot silent → check token/allowed users; group bot blind → privacy mode; updates ≤24h retention; getUpdates vs setWebhook explanation; `hermes gateway status`).

---

## 6. Hermes Agent integration angle

**Mechanism: Hermes Messaging Gateway — native platform adapter (NOT webhooks, NOT MCP, NOT a plugin).**
- The gateway is a single background process that connects to 20+ platforms; Telegram is a first-class adapter **built on `python-telegram-bot`**, using the **Bot API token via long polling (`getUpdates`)** — so no public HTTPS endpoint, webhook server, or tunnel is needed.
- Config surface: `hermes gateway setup` wizard, or env vars `TELEGRAM_BOT_TOKEN` + `TELEGRAM_ALLOWED_USERS` in `~/.hermes/.env` (config.yaml/gateway.json for advanced: `status_indicator`, `command_menu`, per-channel prompts, allowed_chats/group modes).
- The same gateway process also runs the **cron scheduler** (60s tick) and delivers scheduled results to Telegram — one process powers chat + automation + voice.
- Security model to teach: gateway denies all users by default; Telegram access controlled via allowlist or DM pairing codes; admin/user tiers gate slash commands.
- Complementary, non-overlapping with published posts: this is a Telegram-specific deep dive (BotFather lifecycle, privacy mode, group behavior, MEDIA delivery) vs. the existing generic `gateway-setup` quick start; it cross-links the published voice-mode and cron posts.
- Alternative integration patterns worth a "compare" box (not the main path): DIY `setWebhook` HTTPS endpoint, or Telegram via an MCP server — both unnecessary given the native adapter.
