---
title: "Your Personal-Ops Agent: Gmail, Calendar, a Task File, and a Morning Brief in Telegram"
description: "Build one scheduled Hermes Agent morning brief that reads Gmail, Calendar, and a markdown task file, then ships to Telegram at 08:00."
pubDate: 2026-11-03
heroImage: "https://pub-0066f5275194430aa9f985cb23278abe.r2.dev/hermes-personal-ops-agent-1793724099.webp"
tags: ["use-case", "hermes-agent", "personal-ops", "cron", "automation"]
---

## The Loop You're Building (Before Any Commands)

Most personal-automation attempts die the same way: you build three separate demos — one that reads your calendar, one that summarises email, one that keeps a list — and none of them talk to each other, so you stop opening all three.

This guide builds a single loop instead. If you want the wider context on scheduled work in Hermes first, the [automation guide](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron) covers the job lifecycle; here you wire three specific inputs into one output.

```
Gmail unread pass  ─┐
Calendar (today)   ─┼──► self-contained brief prompt ──► cron job 08:00
~/.hermes/tasks.md ─┘        (fresh session, no memory)          │
                                                                 ▼
        you act in a live session  ◄──────────────  deliver: "telegram"
        (writes need confirmation)                              │
                │                                               │
                └──► edit ~/.hermes/tasks.md ──► tomorrow's brief read-back

  /heartbeat every 10m  ┄┄► in-session variant only (dies with the session)
```

Three things to get straight before you type a command, because they shape every decision below.

**There is no built-in task manager.** Hermes schedules *jobs* — create, edit, pause, resume, remove, deliver — but the [cron reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) describes job management, not personal task tracking. Your task list will be a plain markdown file, and that is a design choice, not a workaround.

**Nothing syncs your inbox into tasks automatically.** No Hermes feature watches unread mail and files it as a task. If a line item shows up in your brief, it is because a prompt you wrote asked for it.

**Nothing here promises good triage.** The docs never claim the agent ranks or classifies mail correctly. The mechanics are things you choose — search operators, a `--max` count, a format. Quality is entirely the prompt you tune.

## Prerequisites: Make Sure Something Can Fire at 08:00

A cron job with no scheduler behind it is a text file with ambitions. Work through this chain before anything else.

First, get a model and provider configured. The [daily briefing guide](https://hermes-agent.nousresearch.com/docs/guides/daily-briefing-bot) says the fastest setup is `hermes setup --portal`, and is explicit that Hermes needs "a default model and provider configured globally" before you create jobs; the [cron reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) is where that resolution chain — per-job pin, then `cron.model`, then the main model from `hermes model` — is spelled out.

Second, install the gateway daemon, which is what actually executes cron runs. As a user service:

```bash
hermes gateway install
```

On Linux you can install it system-wide with `sudo hermes gateway install --system`, or run `hermes gateway` in the foreground while testing.

Third, verify it. From a terminal:

```bash
hermes cron status
```

The docs are blunt about the failure mode: "If the gateway isn't running, your jobs won't execute."

Fourth, set `FIRECRAWL_API_KEY` in your environment if your brief will do any web search — the briefing guide lists it as a prerequisite for web search.

One rule to hold onto now, because Pillar 3 depends on it: cron jobs "run in a completely fresh session — no memory of your previous conversations." Nothing you set up in a chat window this afternoon is visible to the job tomorrow morning.

## Pillar 1 — Calendar Awareness (the Cheapest Read First)

Calendar is the right first pillar because it is a single read-only call and it completes the OAuth handshake that the inbox pillar reuses. You authorise once, then both pillars work.

### One OAuth Handshake: `$GSETUP --check`

The google-workspace skill authenticates through Hermes-managed OAuth. Define the setup shorthand in your shell:

```bash
GSETUP="python ${HERMES_HOME:-$HOME/.hermes}/skills/productivity/google-workspace/scripts/setup.py"
$GSETUP --check
```

When it's done, `$GSETUP --check` prints `AUTHENTICATED`. If it doesn't, run the setup with `--install-deps`, restart Hermes, and rerun the OAuth command. The docs add a guardrail worth repeating: if Hermes itself isn't importable, run `hermes setup` rather than installing packages with pip.

The token lands at `~/.hermes/google_token.json` and auto-refreshes, so this is a one-time errand. Revoking later is `$GSETUP --revoke`. All of this is in the [google-workspace skill reference](https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/productivity/productivity-google-workspace).

### Prove It: `$GAPI calendar list`

Now define the API shorthand and make one real call:

```bash
GAPI="python ${HERMES_HOME:-$HOME/.hermes}/skills/productivity/google-workspace/scripts/google_api.py"
$GAPI calendar list
```

A bare `calendar list` defaults to the next seven days. To narrow it — which is what the brief will do — pass `--start` and `--end`. The Rules block is unambiguous here: "Calendar times must include timezone — always use ISO 8601 with offset (e.g., `2026-03-01T10:00:00-06:00`) or UTC (`Z`)."

```bash
$GAPI calendar list --start 2026-11-03T00:00:00-06:00 --end 2026-11-03T23:59:59-06:00
```

This is a read. Reads are safe to run unattended, which is exactly why the 08:00 job can do this and nothing else. Same page, same Rules block: it also tells the agent to respect rate limits and batch reads rather than firing calls in sequence.

## Pillar 2 — Inbox Triage (Three Email Paths, One Right Answer)

"Does Hermes do email?" is the wrong question. Hermes has three distinct email surfaces, they do different things, and picking the wrong one wastes an afternoon.

### The Table That Saves You an Afternoon

| Path | What it does | What it requires | Role in this loop |
|---|---|---|---|
| Email gateway adapter | People email the agent; it replies in-thread over IMAP/SMTP using Python's built-in modules | An IMAP/SMTP account plus credentials in `~/.hermes/.env` (`config.yaml` only for optional overrides) | None. This is inbound human→agent mail, not triage |
| Himalaya skill | The agent operates a mailbox through terminal commands | The external `himalaya` CLI and `~/.config/himalaya/config.toml` | Optional alternative mail driver; not required for Gmail |
| google-workspace skill | Gmail, Calendar, Drive, Contacts, Sheets and Docs via OAuth and a thin CLI wrapper | The OAuth handshake from Pillar 1 | This is the path. `gmail search`, `gmail get`, and labels |

The one-line rule: the adapter is for humans emailing the agent, Himalaya is for driving any mailbox from a CLI, and google-workspace is the Gmail/Calendar API. The [email gateway docs](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email) draw that line themselves, and the [Himalaya skill page](https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/email/email-himalaya) repeats it.

If you ever do enable the adapter — for a separate agent inbox, not this loop — the [agent email guide](https://hermes-agent.nousresearch.com/docs/guides/agent-email-address) is direct: "Create a fresh mailbox for the agent — never hand it your personal inbox." The gateway docs are just as direct about why: "Use a dedicated email account. Don't use your personal email — the agent stores the password in .env and has full inbox access via IMAP." That warning attaches to the adapter path only. It is not a description of the Gmail API path you are using.

### Tune the Triage Prompt Live, Then Freeze It

Do not write the cron prompt first. Tune in a live session where you can see output and correct it.

Start `hermes`, then have the agent load the search-syntax reference before it queries anything:

```
skill_view("google-workspace", file_path="references/gmail-search-syntax.md")
```

That file is the operator cheat sheet — `is:unread`, `from:`, `newer_than:` and the rest. Then run the pass:

```bash
$GAPI gmail search "is:unread newer_than:1d" --max 10
```

For anything that needs a decision, pull the body:

```bash
$GAPI gmail get MESSAGE_ID
```

Ask for three buckets — urgent, needs-reply, FYI — and iterate on wording until the shape is what you want. The briefing guide's advice transfers directly: try prompts until you get output you love, then put whatever you settled on into the job.

Two boundaries while you tune. First, label changes stay interactive: `$GAPI gmail modify MESSAGE_ID --remove-labels UNREAD` is a write, and the Rules block says never modify without confirming with the user first. Second, do not judge triage quality from the docs — they don't specify it. Judge it from your own output.

## Pillar 3 — The Persistent Task List Is a File, On Purpose

Here is where the fresh-session rule pays off. Your 08:00 job wakes up with no memory of yesterday. Anything it should know has to live somewhere it can read, and that somewhere has to be named in the prompt.

A plain markdown file is that somewhere. Pick a path — `~/.hermes/tasks.md` is a reasonable one — and bake it into every prompt that touches it.

```markdown
# Tasks

- [ ] Renew domain before Friday
- [ ] Reply to the contract thread
- [ ] Book the dentist
- [x] Send the invoice
```

The format is yours; a checkbox list is enough. What matters is that the file is the source of truth, that the brief reads it back each morning, and that you edit it during the day after the brief lands.

Why not memory? Because memory is not a task store. Hermes keeps two small curated files, `MEMORY.md` and `USER.md`, under `~/.hermes/memories/`, injected into the system prompt as a frozen snapshot at session start, per the [memory reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory). They are bounded and hard-capped: there is no auto-compact, and an over-limit write returns an error instead of silently dropping entries. Use them for stable preferences — your timezone, your tone, the people whose mail matters — and nothing that changes hourly. The docs also warn against pointing two agent processes at the same Hermes home directory, so keep one writer.

The honest limit, stated plainly: the docs establish no built-in task manager, so this file *is* the feature. There is no status field, no due-date engine, no reminder system. There is a path string in a prompt and a file on disk.

## The Glue: Writing the Self-Contained Morning Brief

The Golden Rule in the [daily briefing guide](https://hermes-agent.nousresearch.com/docs/guides/daily-briefing-bot) is that a cron prompt must contain everything the agent needs, because there is no earlier conversation to lean on. The guide's own bad example is "Do my usual morning briefing." The good example names what to search, how many, what format, and what tone.

Your brief needs five components. Here is a template with the slots marked:

```
Compose my morning brief. Read only — take no write action of any kind.

1. SOURCES AND WINDOWS
   - Mail: $GAPI gmail search "is:unread newer_than:1d" --max <N>
   - For anything ambiguous, $GAPI gmail get MESSAGE_ID before deciding
   - Calendar: $GAPI calendar list --start <YYYY-MM-DD>T00:00:00<OFFSET> --end <YYYY-MM-DD>T23:59:59<OFFSET>
   - Tasks: read ~/.hermes/tasks.md in full

2. STRUCTURE
   - URGENT: mail that needs action today. One line each: sender, subject, why.
   - NEEDS REPLY: threads where a human is waiting on me.
   - FYI: everything else worth a glance.
   - TODAY: calendar events in time order, flags for back-to-back or conflicts.
   - OPEN TASKS: unchecked items from ~/.hermes/tasks.md.

3. TONE AND CLOSING
   - Plain, calm, no exclamation marks, no filler.
   - End with a total count: "N urgent, N reply, N FYI, N events, N open tasks."

Return the brief as your final response.
```

Every slot is deliberate. The `newer_than:1d` window stops the brief dredging up last month. The ISO 8601 offsets stop the calendar call failing on timezone. The literal path `~/.hermes/tasks.md` is what makes the task read-back possible in a fresh session. The three-way structure is the shape you tuned. The closing count is the sanity check — if it says zero urgent, you can trust the shape without reading closely.

Two things the template deliberately omits. It carries **no send instruction**, because delivery is the scheduler's job, not the prompt's: "the agent's final response is automatically delivered to the configured `deliver:` target — the agent does not send messages itself, so there is nothing to call in the cron prompt," per the [cron reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron). And it carries **no write instruction** — no replies, no event creation, no label changes. The job is read-only by construction, which is the only thing that makes an unattended run of the google-workspace skill defensible under its Rules block.

The skill itself ships a procedure you can borrow: `references/daily-brief.md` is described as a "daily/morning brief procedure: schedule + conflicts + meeting prep + urgent mail from Gmail and Calendar," loaded when the user asks for a morning brief. That is a reference file, not a scheduled job — you still have to schedule it.

## Schedule It and Ship It to Telegram

Now the one command that turns all of the above into a loop. From a Hermes session:

```
/cron add "0 8 * * *" "<full self-contained prompt>"
```

With `deliver: "telegram"` on the job, the final response goes to your Telegram home channel, which reads `TELEGRAM_HOME_CHANNEL` from your configuration. If you want a specific chat instead of the home channel, use `deliver: "telegram:123456"`; for a topic inside a group, the `chat_id:thread_id` form `telegram:-100123:17585` works too.

Schedule variants are just the expression:

```
/cron add "0 8 * * 1-5" "<full self-contained prompt>"
```

That is weekdays at 08:00 — the version most people actually want. The [cron reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) accepts natural-language times (`9am`, `noon`, `midnight`) and compiles them to cron expressions internally, so `weekdays at 9am` works there. Note the contradiction: the [automation guide](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron) still states that "Natural language like daily at 9am is not supported". For a job you intend to keep, write the cron expression — it is the form both pages agree on.

No messaging configured yet? Don't block on it. Use `deliver: "local"` and the brief lands in `~/.hermes/cron/output/`, where you can read it over coffee. When you do configure Telegram, note that bot and channel creation live in the messaging-platform docs and are out of scope here — the cron side only needs the home channel set.

Once you trust the loop, fan out. `deliver: "telegram,discord"` sends to a specific set, `all` fans out to every connected home channel and is resolved at fire time. Delivered output is secret-redacted on the way out on every lane; the run document under `cron/output/<job_id>/` keeps the response as written.

## Operate It: `/heartbeat` vs `cron`, Failure Markers, and the Doctor

The most common mistake after the first successful brief is reaching for the wrong recurring tool. `/heartbeat` is not a scheduler — it gives the current session one recurring instruction, in the same conversation, with the same context and prompt cache. Cron is the durable one.

| Question | /heartbeat | hermes cron |
|---|---|---|
| Runs in | This conversation — full context, memory of the discussion | A fresh isolated session per tick |
| Survives restart | State survives in SessionDB; the gateway resumes watching after restart | Yes — fully durable scheduler |
| How many | One per session | Unlimited jobs |
| Best for | "Keep an eye on X in this thread while we work" | Standing jobs, reports, watchdogs, deliveries |

The rule of thumb from the [heartbeat reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/heartbeat): if the recurring prompt needs the conversation's context, use `/heartbeat every 10m Check the deploy and report meaningful changes`; if it's self-contained, use cron. Your morning brief is definitionally self-contained, so it's cron. Heartbeats also require the owning process to be running and are idle-only — they never interrupt a running turn.

Day-to-day operation is three commands. `/cron list` shows the fleet; the docs' own sample row looks like this:

```
a1b2c3d4 | Morning Briefing | 0 8 * * * | 2026-03-09 08:00 | telegram
```

`/cron remove a1b2c3d4` deletes a job. `hermes cron doctor` is the fleet health check when something looks wrong.

Read failures carefully, because delivery and execution are tracked separately. A `delivery_failed` status shows in yellow with a `last_delivery_error` — and it does not count toward the job's `failure_streak`. That distinction matters: a broken Telegram channel is not a broken prompt. For run-level signalling, `[CRON_FAILURE]` alone on the first line declares a failed run, and the marker is strict — mentioning it elsewhere in the report leaves the run successful. `[SILENT]` suppresses delivery entirely on a quiet day while still saving output locally; failed jobs deliver regardless.

Model resolution at fire time is a chain: per-job pin, then `cron.model` in `config.yaml`, then the main agent model from `hermes model`. The agent can't point a job at a different model — pins are user-owned.

## FAQ

**Why a markdown file and not a real task manager?** Because Hermes doesn't ship one. The cron reference covers job scheduling — create, edit, pause, resume, remove — and the [memory reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory) covers two small curated files, neither of which is a task store. A file at a known path, named in the prompt, is the only durable option the docs support. It also happens to be greppable, diffable, and yours.

**Can the brief reply to email or create events for me?** Not in this design, and the docs say why: never send email, create or delete calendar events, delete Drive files, share files, or modify Docs/Sheets without confirming with the user first, showing what will be done and asking for approval. An unattended job has nobody to confirm with. Let the brief land, then act in a live session — the confirmation flow works there.

**What if I don't want Telegram?** Use `deliver: "local"` and read `~/.hermes/cron/output/`. Email delivery via `EMAIL_HOME_ADDRESS` is another target; `all` fans out to everything connected. Start local if you're unsure — the brief is identical.

**Will it actually triage my inbox well?** The docs don't specify triage quality, so neither will I. What's specified is the mechanics: which operators you put in the search string, how many messages `--max` pulls, and the structure you asked for. Your prompt tuning is the only quality lever you have.

**My brief didn't arrive — what broke?** Check in this order: `hermes cron status` for the gateway ("If the gateway isn't running, your jobs won't execute"), then `/cron list` for a `delivery_failed` line, then `hermes cron doctor`. Delivery failure and run failure are separate; the yellow status tells you which one you have.

## The Bottom Line

Build it if your morning currently lives in three browser tabs — mail, calendar, and a list you keep forgetting to open. One cron job, one self-contained prompt, one Telegram message, and the three inputs become a single thing you read and act on. It is genuinely worth the setup afternoon.

Be clear-eyed about what you're getting. The loop is only as good as the prompt you tuned; there's no task manager underneath, no automatic sync from inbox to list, and no documented guarantee that the triage is smart. What you get is mechanical reliability around a read-only job and a file you control — which is more than most personal-ops setups ever achieve.

## How This Guide Was Built

This is a docs-based tutorial. Everything here is assembled from the official Hermes documentation, all pages fetched 2026-11-03: the [daily briefing bot guide](https://hermes-agent.nousresearch.com/docs/guides/daily-briefing-bot) for the self-contained-prompt rule and gateway setup, the [cron reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron) for delivery targets, markers, and the model chain, the [google-workspace skill page](https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/productivity/productivity-google-workspace) for OAuth, the CLI, and the Rules block, the [email gateway docs](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/email) and [agent email guide](https://hermes-agent.nousresearch.com/docs/guides/agent-email-address) for the three-paths distinction, the [Himalaya skill page](https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/email/email-himalaya), the [heartbeat reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/heartbeat), the [memory reference](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory), the [automation guide](https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron), and the [skills overview](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills).

To state it plainly: this guide is based on the official documentation — we did not run this end-to-end on a live mailbox. On a live mailbox we would verify three things first: that your OAuth scopes cover the Gmail search calls you intend, how your own unread volume behaves against a `--max 10` cap, and whether your Telegram home channel resolves correctly before you trust an 08:00 delivery.
