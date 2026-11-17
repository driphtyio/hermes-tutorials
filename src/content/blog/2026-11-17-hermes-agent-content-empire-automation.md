---
title: "Content Empire Automation with Hermes Agent: Run a Multi-Blog Content Pipeline on Cron (2026)"
description: "Build a multi-blog content pipeline in Hermes Agent: queue files, cron drafting jobs, skills, delegation fan-out, script-only gates, and delivery."
pubDate: 2026-11-17
tags: [ "use-case", "hermes-agent", "content-automation", "cron", "delegation", "pipeline" ]
author: "Hermes Agent"
keywords: [ "hermes agent content pipeline", "multi-blog automation", "hermes cron content", "delegation fan-out", "script-only cron job", "hermes blog automation" ]
lastVerified: 2026-11-17
---

## What You're Building: One Scheduler, Thirteen Blogs

A content empire pipeline is one scheduler driving many properties through the same five stages on a repeating cadence: **source/queue → draft → review → publish → report**. In Hermes, this is not a shipped “pipeline” feature but a composition of documented primitives: [cron scheduling](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron), reusable [skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), isolated [delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation), script-only jobs, and delivery targets described in the [automation blueprints](https://hermes-agent.nousresearch.com/docs/guides/automation-blueprints).

The architecture in this guide is modeled on one verified fleet inventory measured 2026-11-17: **172** enabled jobs, **53** `no_agent` script-only jobs, **99** jobs attaching at least one skill, **90** jobs setting a `workdir`, **170** jobs using `deliver: "origin"`, **2** using `local`, **13** queue files, **650** queue items, and **3** jobs carrying a model pin. No new pipeline was run for this guide.

### The five stages, mapped to Hermes primitives

| Stage | Purpose | Hermes primitive |
|---|---|---|
| Source/queue | Keep a per-blog list of what to write | Files under a job `workdir` (queue layout is this article’s convention) |
| Drafting | Turn a queue item into an outline or draft | Agent cron job with a self-contained prompt and attached skills |
| Review/validation | Check drafts before they go anywhere | `--no-agent --script` gates and in-agent `execute_code` checks |
| Publish | Push results onward | Delivery targets plus a human or external-script hand-off (no CMS/deploy primitive documented) |
| Report | Tell a human what happened | `origin`, messaging targets, `local`, `bot-chat`, or `hermes send` |

## How This Guide Was Built

This guide was built from twelve Hermes documentation pages and one fleet inventory measured 2026-11-17. It includes no hands-on testing claims, no fabricated terminal output, and no “when we ran this” narrative. Every fleet statistic is one of the nine verified numbers above. Where the documentation does not define a mechanism—such as queue file schemas, dequeue behavior, job chaining, or publishing commands—this article states that it is undocumented and, when needed, labels the design choice as this article’s own convention.

## The Architecture: Queue → Cron → Skills → Delegation → Gates → Delivery

```text
[13 queue files in workdir]        (this article's convention)
            |
            v
[cron scheduler / gateway ticker]  --> fires agent or script jobs
            |
            +--> [drafting agent job] --skills--> [delegate_task fan-out per blog]
            |                                      (isolated children, summaries only)
            |
            +--> [validation gates]  --no-agent script / execute_code checks--
            |
            v
[delivery: origin / local / platform / bot-chat / hermes send]
            |
            v
[human or external-script hand-off for publish/deploy]  (undocumented in Hermes)
```

*The diagram above is this article’s composition of documented Hermes primitives.*

### Where the docs stop and the conventions start

The [Cron Jobs docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) document scheduling, fresh sessions, skills attachment, `workdir`, delivery, and webhook-triggered jobs. They do **not** document a queue primitive, job-to-job chaining, artifact hand-off between cron jobs, or a shared queue lock. In this design, files under the `workdir` are the contract between stages—explicitly a convention of this article, not a documented Hermes primitive.

### Concurrency and the gateway

Cron jobs fire from the gateway’s background ticker thread, which ticks every **60 seconds**. A regular CLI chat session does **not** automatically fire cron jobs. Start the gateway with `hermes gateway` (foreground) or `hermes gateway start` (installed service). For one-off debugging, `hermes cron tick` can trigger a tick, but that tick still needs the gateway: it never starts one. For fleet-scale ticks, `cron.max_parallel_jobs` is the documented concurrency lever.

## Stage 1: The Queue Layer

### Directory layout (convention)

This article uses `~/.hermes/blog-queues/` as the queue root. The verified fleet contains **13** queue files and **650** queue items. The **13** blog names are: `aigamingdev`, `careerml`, `codeintel`, `cybersec-ai`, `design-agent`, `healthywallet`, `hermes-tuts`, `niteagent`, `nocodeinsider`, `quantbrainai`, `shfg`, `stacksfree`, and `toolbrain`. This directory layout and file-per-blog mapping are **this article’s convention**; the docs do not define a queue schema.

### A queue-file shape that works (convention)

The following JSON shape is **this article’s convention** because the docs define neither the structure nor dequeue mechanics:

```json
{
  "blog": "codeintel",
  "items": [
    {
      "id": "ci-001",
      "title": "Example topic",
      "angle": "Practical walkthrough",
      "status": "queued",
      "added": "2026-11-17"
    }
  ]
}
```

Suggested statuses: `queued`, `in-progress`, `drafted`. Dequeue is modeled here as rewriting the file (for example, moving an item from `queued` to `in-progress` or `drafted`). That rewrite behavior is a convention, not documented Hermes behavior.

### `workdir`: the pipeline’s root

Set `--workdir` (CLI) or `workdir=` (tool call) to an absolute path that must exist. When set, `AGENTS.md`, `CLAUDE.md`, and `.cursorrules` from that directory are injected into the system prompt, and `terminal`, `read_file`, `write_file`, `patch`, `search_files`, and `execute_code` all use that directory as their working directory. Relative paths and missing directories are rejected at create/update time. Use `--workdir ""` (or `workdir=""` via the tool) on edit to clear it. A job without `workdir` runs detached from any repo context files.

## Stage 2: The Drafting Job

Cron jobs run in fresh agent sessions with no memory of your current chat. Prompts must be **completely self-contained**. This rule applies to every job prompt shown in this guide.

### The documented starting point

The [automation blueprints](https://hermes-agent.nousresearch.com/docs/guides/automation-blueprints) provide this single-blog starting point:

```bash
hermes cron create "0 10 * * 3" \
  "Research and draft a technical blog post outline about a trending topic in AI agents.1. Search the web for the most discussed AI agent topics this week2. Pick the most interesting one that's relevant to open-source AI agents3. Create an outline with:   - Hook/intro angle   - 3-4 key sections   - Technical depth appropriate for developers   - Conclusion with actionable takeaway4. Save the outline to ~/drafts/blog-$(date +%Y%m%d).mdKeep the outline to ~300 words. This is a starting point, not a finished post." \
  --name "Blog outline" \
  --deliver local
```

### Scaling one blog to thirteen (convention)

The following multi-blog drafter is **this article’s convention**, composed from documented cron, skill, `workdir`, and delegation primitives:

```bash
hermes cron create "0 9 * * 1-5" \
  "You are the content drafter. Workdir: ~/.hermes/blog-queues (absolute path required). 1) Determine today's blog from the 13 queue files (rotate deterministically by weekday logic you define). 2) Read that blog's queue JSON file. 3) If no item has status queued, respond with only [SILENT]. 4) Rewrite the file to mark one queued item in-progress, then draft it and save the draft under the workdir. 5) Use delegate_task for per-blog drafting subtasks when helpful; give each child a one-line goal and a fully self-contained prompt. 6) When done, rewrite the queue file to mark the item drafted. 7) If nothing changed or nothing to do, respond with only [SILENT]." \
  --name "Empire drafter" \
  --skill blog-drafting \
  --skill seo-checklist \
  --workdir /home/user/.hermes/blog-queues \
  --deliver origin
```

### Attaching skills instead of prompt-stuffing

Skills live in `~/.hermes/skills/` and follow a **progressive disclosure** pattern to minimize token usage (see [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)). Attach one with `--skill` or multiple with repeated `--skill` flags (CLI) or `skill="..."` / `skills=[...]` (tool). Skills are loaded in order, and the prompt becomes the task instruction layered on top of those skills. In the verified fleet, **99** jobs attach at least one skill.

### Pinning the cadence

Supported schedule formats include relative delays (`30m`), intervals (`every 2h`), standard cron expressions (`0 9 * * *`), and ISO timestamps (`2025-06-15T09:00:00`). Natural language like `daily at 9am` is not supported. A timezone pin makes the expression the pinned zone’s wall clock (it has no effect on interval jobs):

```bash
hermes cron create "0 9 * * 1-5" --timezone Asia/Hong_Kong "HK market open brief"
```

Missed occurrences run late only inside a catch-up window: half the job’s period, clamped to **2 min–2 h**. `--grace-minutes` overrides that per job (**0–1440**). `0` means never catch up; `--grace-minutes ""` restores the computed window. It only applies to cron expressions.

```bash
hermes cron edit market-open --grace-minutes 0
hermes cron edit market-open --grace-minutes 180
```

## Stage 3: Validation Gates Without a Gate Flag

### What the docs actually give you

The docs document a `script` parameter for deterministic work and `execute_code` for in-turn scripted checks, but **no** dedicated review gate, approval flag, or “require human sign-off before publish” mechanism is documented. Gates in this pipeline are therefore script-only jobs and in-agent checks—an architectural convention.

### A script-only watchdog job

Script-only mode means **no LLM call**, **zero tokens, zero agent loop, zero model spend**. The script decides whether to alert: emit output → message gets sent; emit nothing → silent tick. Empty stdout = no message.

```bash
hermes cron create "every 30m" --no-agent --script queue-watchdog.sh --deliver telegram --name "queue-watchdog"
```

Example `queue-watchdog.sh` logic (convention): emit only when a queue is empty or near-empty; otherwise print nothing.

### Script validation gate and interpreter rules

Interpreter rules for script jobs: `.sh` / `.bash` files run under `bash` from `PATH` when available, otherwise `/bin/bash`; any other extension runs under the current Python interpreter. Use `--interpreter` to pin a venv for Python scripts.

```bash
hermes cron create "every 2h" --no-agent --script validate-drafts.py --interpreter /path/to/venv/bin/python --deliver local --name "draft-validator"
```

A `validate-drafts.py` gate (convention) can check this article’s own draft conventions—such as frontmatter presence, link resolution, and a length band—and emit failures or nothing.

### Cheap in-agent checks and quiet delivery

Inside an agent turn, `execute_code` runs Python against `hermes_tools`. Only the script’s `print()` output is returned to the LLM; intermediate tool results never enter the context window (see [Code Execution](https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution)). Use `[SILENT]` deliberately for monitoring jobs: if nothing changed, respond with only `[SILENT]`. Cron treats `[SILENT]` as the delivery-suppression marker.

## Fleet-Scale Drafting: Delegation Fan-Out

### `delegate_task`: isolated children, summary-only returns

The `delegate_task` tool spawns child AIAgent instances with isolated context, inherited tool access, and their own terminal sessions. Only each child’s final summary enters the parent’s context (see [Delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation)). Useful patterns are described in [Delegation Patterns](https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns).

### Fan-out drafter prompt (convention)

Express fan-out as a self-contained cron-prompt instruction (convention): “For each target blog, call `delegate_task` with a one-line goal and a fully self-contained prompt that includes the blog name, queue file path, and required output path.” No CLI delegation command is documented.

### Caps, cost, and config pinning

Defaults: `delegation.max_iterations` **250**, `max_concurrent_children` **10**, `max_spawn_depth` **1**. Pin children globally in `~/.hermes/config.yaml`:

```yaml
delegation:
  model: "your-inexpensive-model"
  provider: "openrouter"   # optional
  max_iterations: 250       # optional; lower for simple fleets
```

Resolution order: `delegation.base_url` (direct endpoint) takes precedence, then `delegation.provider`; when neither is set children inherit the parent’s provider and credentials. `delegation.model` applies in all cases, and when it is empty children inherit the parent’s model. The pin is global.

### The durability line

Delegation is **not durable**. Top-level delegation remains tied to the owning session and Hermes process; session closure, `/stop`, `/new`, or a process restart can cancel or strand in-progress work. Use `cronjob_manage` or `terminal(background=True, notify_on_complete=True)` for work that must survive those boundaries.

Subagent failures surface as: `⚠️ Subagent failed — "your goal": <reason>`. Subagent summaries are summaries—verify important results yourself.

## Stages 4–5: Publish, Report, and the Delivery Boundary

### Delivery targets and fleet usage

| Target | Prerequisite | Use in this pipeline | Fleet usage |
|---|---|---|---|
| `origin` | Delivers to the chat where the job was created | Default report-back for drafter/review jobs | **170** |
| `local` | Write access to `~/.hermes/cron/output/` | Local artifacts/logs | **2** |
| `telegram` | `TELEGRAM_BOT_TOKEN` in `~/.hermes/.env` | Alerts/reports | not used in this fleet |
| `discord` | `DISCORD_BOT_TOKEN` | Alerts/reports | not used in this fleet |
| `slack` | `SLACK_BOT_TOKEN` | Ops rollups | not used in this fleet |
| `whatsapp` | WhatsApp gateway configured | Alerts/reports | not used in this fleet |
| `signal` | Signal gateway configured | Alerts/reports | not used in this fleet |
| `matrix` | Matrix homeserver configured | Alerts/reports | not used in this fleet |
| `email` | SMTP configured in `config.yaml` | Digest delivery | not used in this fleet |
| `sms` | SMS provider | Urgent alerts | not used in this fleet |
| `bot-chat` | Target profile on the same machine | Delivery that becomes a real turn | not used in this fleet |
| other platforms | Platform-specific config | `mattermost`, `homeassistant`, `dingtalk`, `feishu`, `wecom`, `weixin`, `bluebubbles`, `qqbot`, `webhook` | not used in this fleet |

Delivery targets are case-sensitive and require the correct platform to be configured. A misconfigured target silently drops the response. Target a specific chat with `platform:chat_id` syntax.

### `hermes send` for script-side reporting

Use [Pipe Script Output](https://hermes-agent.nousresearch.com/docs/guides/pipe-script-output) to push results from scripts:

```bash
./rollup.sh | hermes send --to slack:#content-ops --subject "Empire daily rollup"
```

Exit codes: `0` send/list succeeded, `1` delivery failed at the platform level (auth, permissions, network), `2` usage/argument/config error.

### `bot-chat`: delivery that becomes a turn

`bot-chat` delivers output into a profile’s canonical “Bot Chat” session as a real message. Bare `bot-chat` targets the job’s own profile; `bot-chat:<profile>` targets another profile on the same machine. Each delivery costs the target bot one full agent turn. It composes with other targets (e.g. `bot-chat,telegram`) but is never included in `all`. **Queued is not completed:** cron records receipt IDs and `queued`/`claimed` statuses in `last_delivery_queued`, with the durable receipt at `runtime/bot_live_delivery/<receipt-id>.json` authoritative for the turn itself.

### The honest publish boundary

No CMS, static-site, git-push, or deploy command is documented in Hermes. The publish stage in this architecture ends at delivery targets plus a human or external-script hand-off.

## Cost Control Across 172 Jobs

The verified fleet shows **172** enabled jobs, with **53** `no_agent` script-only jobs, **99** attaching at least one skill, **90** setting a `workdir`, and **3** jobs carrying a model pin. The “3 jobs carry a model pin” figure is presented here as a count only; per-cron-job pin syntax is undocumented in the provided sources. Route cost control through documented levers instead:

| Lever | Mechanism | Where set | Docs basis |
|---|---|---|---|
| No-agent jobs | No LLM call: zero tokens, zero agent loop, zero model spend | `--no-agent --script` or `no_agent=True` | [Cron Script-Only](https://hermes-agent.nousresearch.com/docs/guides/cron-script-only) |
| `script` parameter | Script handles fetching/I/O/state; agent reasons on stdout | Job/tool/script parameter | [Automate with Cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron) |
| `execute_code` isolation | Only `print()` output returns to the LLM; intermediate results stay out of context | In-agent tool call | [Code Execution](https://hermes-agent.nousresearch.com/docs/user-guide/features/code-execution) |
| `delegation.model` pin | Run children on a chosen model/provider globally | `~/.hermes/config.yaml` `delegation:` | [Delegation](https://hermes-agent.nousresearch.com/docs/user-guide/features/delegation) |
| `delegation.max_iterations` | Cap child iterations (default **250**) | `~/.hermes/config.yaml` | [Delegation Patterns](https://hermes-agent.nousresearch.com/docs/guides/delegation-patterns) |
| Skills via progressive disclosure | Load reusable workflow on demand instead of stuffing prompts | `~/.hermes/skills/`, `--skill` / `skills=[...]` | [Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) |
| `auxiliary.curator` pin | Run curator review on a specific auxiliary provider/model | `~/.hermes/config.yaml` `auxiliary.curator` | [Curator](https://hermes-agent.nousresearch.com/docs/user-guide/features/curator) |

```yaml
auxiliary:
  curator:
    provider: openrouter
    model: google/gemini-3-flash-preview
    timeout: 600
```

## When the Pipeline Breaks

Use the documented surfaces in order (see [Cron Troubleshooting](https://hermes-agent.nousresearch.com/docs/guides/cron-troubleshooting)):

### Job didn’t fire
1. **Exists/active:** check `hermes cron list` for `[active]`, `[paused]`, or `[completed]` (if `[completed]`, the repeat count may be exhausted).  
2. **Schedule validity:** supported formats are `30m`, `every 2h`, `0 9 * * *`, and `2025-06-15T09:00:00`.  
3. **Gateway ticker:** jobs fire from the gateway’s **60-second** ticker; run `hermes gateway` / `hermes gateway start` and use `hermes cron tick` only for debugging with a gateway running.  
4. **Timezone comparison:** compare `next_run` with local time; remember pinned zones use wall-clock time.

### Ran but nothing arrived
Execution and delivery are tracked separately. If the agent run succeeds but output never reaches the target, the job records `last_status: delivery_failed` with the reason in `last_delivery_error`. A delivery failure does not increment `failure_streak`. `hermes cron list` shows it in yellow as `delivery_failed: <reason>`, and `hermes cron doctor` reports it as a delivery issue. The next fully successful run returns the status to `ok`.

### A subagent died
Expect a notice: `⚠️ Subagent failed — "your goal": <reason>`. The parent receives the full error in the tool result; verify summaries yourself.

### Missed ticks
A missed occurrence runs late only inside the catch-up window: half the period, clamped to **2 min–2 h**. Override with `--grace-minutes` (**0–1440**); `0` means never catch up.

## Documented vs. Convention: What This Design Assumes

| Element | What the docs establish | What this article adds as convention | Risk if confused |
|---|---|---|---|
| Queue directory + JSON schema | Files can live under `workdir`; no queue primitive documented | `~/.hermes/blog-queues/`, per-blog JSON with `blog` and `items[{id,title,angle,status,added}]` | Treating a file layout as a Hermes feature can lead to brittle assumptions |
| Dequeue/stage hand-off | No job-chaining or artifact hand-off primitive documented | Rewrite queue files to move items between `queued`/`in-progress`/`drafted` | Assuming automatic hand-off can hide missing state transitions |
| Validation gate | `script` parameter and `execute_code` exist; no approval/gate flag documented | Script-only and in-agent checks as explicit gate jobs | Expecting a built-in sign-off step that does not exist |
| Publish/deploy step | Delivery to messaging/local targets is documented; no CMS/git-push/deploy command documented | Publish ends at delivery plus human or external-script hand-off | Assuming Hermes can publish to a CMS directly |
| 13-blog fan-out grouping | `delegate_task` and cron jobs are documented | Instruct per-blog `delegate_task` goals inside one drafter prompt | Confusing prompt-level orchestration with a native fan-out scheduler |
| Delivery targets | Fully documented (targets, prerequisites, `bot-chat`, `hermes send`) | None | — |
| Scheduling syntax | Fully documented (formats, timezone pin, grace window) | None | — |

## Rebuild It for Your Own Sites

### Parameterization map

| Stage | Primitive | What you rename/customize |
|---|---|---|
| Queue | Files in `workdir` (convention) | Queue directory, file names, JSON fields, status values |
| Draft | Agent cron job + skills | Schedule, prompt, `--skill` list, `--workdir`, delivery target |
| Validate | `--no-agent --script` or `execute_code` | Script path, checks, `--interpreter`, emit/no-emit rules |
| Fan-out | `delegate_task` + `delegation` config | Child goals, `delegation.model`, `delegation.provider`, iteration caps |
| Report/hand-off | `origin`/`local`/platform/`bot-chat`/`hermes send` | Target, subject, downstream human or external script |

### Launch order and checklist

1. **Create queue files** (convention) under an absolute `workdir` path.  
2. **Add a watchdog**: a `--no-agent --script` job that emits only when attention is needed.  
3. **Run one blog’s drafter**: a self-contained agent job with `--workdir`, explicit skills, and `[SILENT]` when idle.  
4. **Add fan-out**: instruct per-blog `delegate_task` calls in the prompt and pin `delegation.model` / `delegation.provider` if desired.  
5. **Wire delivery**: choose `origin`, `local`, platform targets, `bot-chat`, or `hermes send`; verify prerequisites.  
6. **Add a weekly review/report job**: summarize queue state and draft outputs; keep publish as delivery plus human/external-script hand-off.

For `hermes cron create` basics, schedule testing, and generic job management, see [Automate with Cron](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron).

## FAQ

### Does Hermes provide a built-in content queue or job-chaining primitive?
No. The documentation does not establish a queue primitive, job-to-job chaining, artifact hand-off between cron jobs, or a shared queue lock. Using files under `workdir` as the contract is a convention.

### Can a cron job publish directly to a CMS or Git-based site?
No CMS, static-site, git-push, or deploy command is documented. The publish stage ends at documented delivery targets plus a human or external-script hand-off.

### What makes a cron prompt reliable?
Cron jobs run in fresh agent sessions with no memory of your current chat, so prompts must be **completely self-contained**. Include paths, rules, and success/quiet conditions explicitly.

### How do I keep a large fleet cheap?
Use script-only jobs (**53** of **172** in the verified fleet), the `script` parameter, `execute_code` isolation (only `print()` output returns to the LLM), skills via progressive disclosure, and global delegation/auxiliary model pins such as `delegation.model` and `auxiliary.curator`.

### What does `delivery_failed` mean?
The agent run succeeded but output did not reach the target. Cron records `last_status: delivery_failed` and `last_delivery_error`, does not increment `failure_streak`, and `hermes cron doctor` reports it as a delivery issue.

## The Bottom Line

Build a multi-blog content pipeline in Hermes by composing documented primitives—cron, `workdir`, skills, script-only jobs, `execute_code`, delegation, and delivery—around a file-based queue convention you control. Treat queue schemas, dequeue rewrites, validation gates, and publish hand-offs as explicit conventions, start with one blog’s drafter, and scale to **13** blogs only after watchdogs, delivery, and failure checks are in place.

<!-- crosslinks -->

## 📖 Related Reads

- **[NiteAgent](https://niteagent.com/)** — AI agent development, frameworks, and production patterns
- **[NoCode Insider](https://nocodeinsider.com/)** — AI workflow automation with no-code tools, agents, and APIs

*Cross-links automatically generated from Hermes Tutorials.*
