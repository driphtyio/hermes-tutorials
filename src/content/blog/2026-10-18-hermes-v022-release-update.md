---
title: "Hermes Agent v0.22: What the 0.22 Release Line Changed, Upgrade Notes, and What to Do First"
description: "Hermes Agent v0.22.0 to v0.22.2 (October 13–15, 2026): what changed, which defaults move under you on upgrade, why v0.22.1 is skipped, and a practical upgrade checklist."
pubDate: 2026-10-18
tags: ["news", "hermes-agent", "upgrade", "release-notes"]
draft: false
---

## Quick Answer: Install v0.22.2 and Skip v0.22.1

Install **v0.22.2**, released October 15, 2026. Skip v0.22.1 entirely. Its release notes say it was built from the wrong commit: it shipped unreleased gateway work, and the Microsoft Store app could stick on "Connecting." The v0.22.2 notes describe that release as the one v0.22.1 was meant to be.

One known issue applies if you ran the 0.22.1 gateway: sessions that ran under it can't be deleted in v0.22.2. Plan for that before you upgrade.

## The 0.22 Line in One Paragraph

The 0.22 line has three releases. [v0.22.0](https://github.com/NousResearch/hermes-agent/releases/tag/v0.22.0) landed October 13, 2026, with the flagship features and the upgrade notes that change defaults. v0.22.1 followed on October 14 as a patch. v0.22.2 followed on October 15 and replaces v0.22.1. If you already installed v0.22.1, `hermes update` (or re-running the installer) moves you back onto the release line. The line builds on v0.21.7 (October 11, 2026), a stable rollup that also moved source installs to tagged releases. Work that is only on `main` ships with v0.23.0.

## The Headline Features of v0.22.0

### First-Launch Setup Chat

On a machine where you have never used Hermes, the desktop app starts a short setup chat instead of a settings screen. It asks for your name, an accent color, a layout, which apps to connect, and which plugins to install. It then gives a quick tour and offers up to four first tasks. The chat runs on a free trial model (`nous/welcome`, once per OS user), so no key is needed. **Skip setup** ends it, and **Settings → Run onboarding again** brings it back. The agent also gained a `set_theme` tool, so a request like "make it violet, dark mode" works in any desktop chat. See the [onboarding PR](https://github.com/NousResearch/hermes-agent/pull/137429).

### Connectors

Hermes can act inside hosted apps such as Linear and Notion through the Nous tool gateway. You ask for an app, sign in once in your browser, and the tools are usable in the same turn. You do not need a Nous account to start. On first use, Hermes creates a free connectors-only identity. The desktop Connectors page puts hosted apps and your MCP servers in one list and replaces the MCP tab. The same setup card appears in the TUI and CLI. You can connect several named accounts of one app, such as `work` and `home`, and manage them with `/connectors` or `hermes connectors`. See the [connectors work](https://github.com/NousResearch/hermes-agent/pull/106842).

### Local Models in One Click

Hermes can run open models entirely on your machine. Nothing leaves it, and no account or API key is needed. The release notes describe a managed llama.cpp runtime that picks the engine for your hardware (CPU, CUDA, Metal, Vulkan or ROCm), rates each catalog model against your GPU and RAM, and selects the highest-quality build that fits. Local Models is on by default on macOS, Windows and Linux. Find it under **Settings → Providers → Local Models**, or run `hermes model` and choose **Local models**.

## The Upgrade Notes That Change Your Defaults

These changes take effect on update, often without any config edit. Read this section before you upgrade.

### Python 3.14 Is the Runtime

Managed installs use Python 3.14, and the package manager installs it for you. KittenTTS is unavailable on 3.14. See [#102765](https://github.com/NousResearch/hermes-agent/pull/102765).

### Windows Desktop Is MSIX-Only

The Windows desktop app is MSIX-only and needs Windows 11 22H2 or newer. The NSIS and MSI installers are gone. The macOS app is Apple Silicon only in default builds. See [#102765](https://github.com/NousResearch/hermes-agent/pull/102765) and [#136603](https://github.com/NousResearch/hermes-agent/pull/136603).

### One Gateway per Machine

One gateway per machine is now the default. `hermes update` folds per-profile gateways into the multiplexed default when nothing conflicts. See [#112854](https://github.com/NousResearch/hermes-agent/pull/112854).

### Session Reset: Idle and Daily Timers Are Retired

Chats no longer reset on an idle or daily timer. The `session_reset` idle and daily modes are retired. Configs that still set them log a warning. Use `/new` or `/reset` to start fresh. See [#105021](https://github.com/NousResearch/hermes-agent/pull/105021) and [#126244](https://github.com/NousResearch/hermes-agent/pull/126244).

### Old Sessions Are Pruned by Default

`sessions.auto_prune` now defaults to on. Ended sessions inactive for 90 days are deleted at startup. Pinned and open sessions are never touched. To keep everything, set `sessions.auto_prune: false`.

### Memory Providers Moved to Catalog Plugins

Honcho, Supermemory, Hindsight, Mem0, OpenViking, and Holographic moved to catalog plugins, as did Home Assistant, Spotify, and Langfuse. Existing users are migrated on update or first start, with data intact. ByteRover and RetainDB remain bundled. See [#132469](https://github.com/NousResearch/hermes-agent/pull/132469).

## Comparison: v0.21.x vs v0.22.x by Area

| Area | v0.21.x behavior | v0.22.x behavior | Action needed |
|---|---|---|---|
| Runtime | Not the managed runtime; the notes do not detail the older version | Python 3.14 for managed installs; KittenTTS unavailable | Check whether you use KittenTTS |
| Windows desktop | NSIS and MSI installers | MSIX-only, Windows 11 22H2+ | Confirm OS version and use the MSIX package |
| Gateways | Per-profile gateways | One gateway per machine by default | Let `hermes update` fold them when nothing conflicts |
| Session reset | Idle and daily modes | Retired; warning logged | Remove them; use `/new` or `/reset` |
| Session pruning | No automatic pruning by default | `sessions.auto_prune` on: 90-day inactive ended sessions deleted | Set `sessions.auto_prune: false` to opt out |
| Memory plugins | Bundled | Catalog plugins; migrated with data intact (ByteRover, RetainDB stay bundled) | Verify your memory plugin after first start |
| Plugin compatibility | Import compatibility layer present | Layer removed | Stop relying on it |
| Tool names | `todo`, `cronjob`, `process` | `todo_list`, `cronjob_manage`, `process_manage`; old names still work | Update names when convenient |
| Update checks | `git fetch` every 30 minutes | One GitHub API call a day ([#107648](https://github.com/NousResearch/hermes-agent/pull/107648)) | None |
| Update channel | Source installs followed every commit on `main` | Tagged stable releases; `hermes update --set-channel main` keeps every-commit updates | Pick your channel |

The update-channel row reflects the v0.21.7 notes: v0.21.6 and v0.21.7 were the first releases through the stable gate.

## If You Write Plugins or Depend on Tool Names

Plugin authors have the most to change:

- The old plugin compatibility import layer is gone ([#126164](https://github.com/NousResearch/hermes-agent/pull/126164)).
- `hermes sync` (Skill Sync) was removed ([#132465](https://github.com/NousResearch/hermes-agent/pull/132465)).
- The bundled tirith scanner was removed ([#133832](https://github.com/NousResearch/hermes-agent/pull/133832)).
- Tools were renamed: `todo` to `todo_list`, `cronjob` to `cronjob_manage`, and `process` to `process_manage`. The old names still work ([#97979](https://github.com/NousResearch/hermes-agent/pull/97979)).
- Plugins now declare Python dependencies. Those are resolved with core across profiles. Conflicts are refused, and an update disables a plugin that no longer fits.

## The `hermes pm` Package Manager and Update Machinery

`hermes pm` manages a pinned, hash-checked toolchain: Python 3.14, uv, Node, ripgrep, FFmpeg, Chromium, and Git/Bash on Windows. Its commands are `hermes pm doctor`, `status`, `repair`, and `gc`. Contributors use `source ./activate` (or the `.ps1` and `.fish` variants).

- **Generations.** New dependency environments are checked before use, so a failed install keeps the working one. `gc` reclaims old ones. On one host, that cut usage from 92 GB to 18 GB ([#124968](https://github.com/NousResearch/hermes-agent/pull/124968)).
- **Lazy installs.** Opt-in SDKs (Anthropic, Bedrock) load mid-session without a restart. Set `security.allow_lazy_installs: false` to turn this off ([#122221](https://github.com/NousResearch/hermes-agent/pull/122221)).
- **Updates can't half-apply.** A killed update repairs itself on the next launch ([#132361](https://github.com/NousResearch/hermes-agent/pull/132361)).
- **Faster updates.** Updates rebuild only what changed (16.5 s vs 32.5 s on macOS), and clones are blobless ([#135092](https://github.com/NousResearch/hermes-agent/pull/135092)).
- **Installers.** `install.sh` and `install.ps1` verify pinned uv and Git, log to `logs/install.log`, and work on musl Linux (Alpine, Void), Windows 10, and Unicode Windows paths ([#132430](https://github.com/NousResearch/hermes-agent/pull/132430)).

## What v0.22.2 and v0.22.1 Fixed

### v0.22.2: The Gateway Starts After a Reboot

After a restart, Linux can hand an early PID to an unrelated process. The gateway could mistake that PID for a running gateway, so a supervised gateway (systemd, launchd, or Docker) refused to start. Hermes now records the boot it started in. When it can't tell, it asks the host lock, which only a live gateway holds. See [#138594](https://github.com/NousResearch/hermes-agent/pull/138594), which fixes [#133744](https://github.com/NousResearch/hermes-agent/issues/133744).

### v0.22.2: Long Local-Model Turns Survive on Laptops

Local requests always stream with prompt-reading progress in the status line. Stall timers skip time the machine was asleep. A recovered local server gets another try instead of a breaker that failed every later message. Compression no longer times out while the server is still reading a long conversation. On Windows unified-memory machines, model launch and the prompt cache are sized to free memory. See [#138560](https://github.com/NousResearch/hermes-agent/pull/138560).

### v0.22.2: Windows Store Bundle

The Store bundle now has its own `windows-store` lane. See [the commit](https://github.com/NousResearch/hermes-agent/commit/f9d8a74035101d95ef2a622fb01b2f9bbc34f0ef).

### v0.22.1 Patch Content

The v0.22.1 patch also shipped unreleased gateway work, which is why v0.22.2 replaced it. It carried these changes:

- Default parameters for nemotron super 3.5 ([commit](https://github.com/NousResearch/hermes-agent/commit/c59d299408e924c3682619e7d9d368891d4b709e)), and a curated model list at the top of the model picker.
- Language packs: `hermes-lang-ko` (Korean Desktop) and `hermes-lang-pt-br` (Brazilian Portuguese).
- Catalog plugins: `teamorouter`, `author-feed`, `aux-ledger` 1.4.0 ([commit](https://github.com/NousResearch/hermes-agent/commit/6048066e22f3019505d04caeab29577c803f4d71)), and `wait-ledger` ([commit](https://github.com/NousResearch/hermes-agent/commit/97e65322efebd1b8dc07d33634b685df078d5858)).
- Community plugins `lightningai` and `lightningai-rate-limit`, and Hermes AAC 0.1.0 at a reviewed source pin.

## What Was Reverted: Don't Wait for These

These items were merged and then pulled, or reverted. Do not expect them in v0.22.2:

- **Collective Wisdom V1.** An in-tree org skill marketplace was merged and removed. No wisdom code ships in this release ([#94266](https://github.com/NousResearch/hermes-agent/pull/94266)).
- **Card-style Skills/Plugins catalog browser.** Reverted three times, along with the "Install in Hermes" links. Desktop uses list tabs with the embedded catalog picker ([#119381](https://github.com/NousResearch/hermes-agent/pull/119381)).
- **Approval and clarify prompts that wait until answered.** Reverted. `approvals.timeout` still applies ([#130167](https://github.com/NousResearch/hermes-agent/pull/130167)).
- **Parallel group-chat rounds in Bot Mode.** Reverted. Rooms run serially ([#101112](https://github.com/NousResearch/hermes-agent/pull/101112)).
- **Full isolation of named profiles from the root `auth.json`.** Reverted. Profiles keep their own login when they have one ([#113425](https://github.com/NousResearch/hermes-agent/pull/113425)).
- **`hermes cron resnap` and creation-time model snapshots.** Replaced by cron following your main model. `pinned` locks a job to one model ([#106496](https://github.com/NousResearch/hermes-agent/pull/106496)).
- **The Classic default skin palette and a tirith catalog plugin.** Both reverted ([#130015](https://github.com/NousResearch/hermes-agent/pull/130015)).

## Providers, Models, and New Knobs

- **Providers as plugins.** ACP and CLI-driven providers install out of tree via `hermes plugins install`. `--provider chatgpt` selects ChatGPT Codex OAuth ([#101456](https://github.com/NousResearch/hermes-agent/pull/101456)).
- **Provider upgrades.** Bedrock serves GPT-6 (1M) and enforces Claude Guardrails. Azure Foundry lists deployments. Gemini accepts full JSON Schema tools. OpenCode Go routes Claude via Messages ([#133573](https://github.com/NousResearch/hermes-agent/pull/133573)).
- **New knobs.** `agent.text_verbosity` sets Responses answer length. Named custom providers run on the Codex app-server ([#115880](https://github.com/NousResearch/hermes-agent/pull/115880)).
- **Update channel.** Source installs of the official repository follow the latest tagged release. Forks and mirrors keep following `main`. To keep following every commit, run `hermes update --set-channel main`. The desktop app's Settings ▸ About ▸ Updates has a channel switch.

For the full docs, see the [Hermes Agent documentation](https://hermes-agent.nousresearch.com/docs).

## Upgrade Checklist

1. **Confirm your platform.** Windows desktop needs Windows 11 22H2 or newer (MSIX-only). macOS default builds are Apple Silicon. Source, musl, and Windows 10 installs go through `install.sh` or `install.ps1`.
2. **Check KittenTTS.** If you use it, note that it is unavailable on Python 3.14.
3. **Remove idle and daily `session_reset`.** Those modes are retired. Use `/new` or `/reset` instead.
4. **Decide on session pruning.** `sessions.auto_prune` defaults to on. Set `sessions.auto_prune: false` to keep everything.
5. **Expect gateway folding.** `hermes update` folds per-profile gateways into the one-gateway-per-machine default when nothing conflicts.
6. **Verify memory plugins.** Honcho, Supermemory, Hindsight, Mem0, OpenViking, Holographic, Home Assistant, Spotify, and Langfuse migrate on update or first start with data intact. Check yours.
7. **Opt out of lazy installs if needed.** Set `security.allow_lazy_installs: false`.
8. **Plugin authors:** rename tools to `todo_list`, `cronjob_manage`, and `process_manage` (old names still work), drop reliance on the compatibility import layer, `hermes sync`, and the tirith scanner, and declare Python dependencies.
9. **Install v0.22.2 directly.** Do not stop at v0.22.1.
10. **Know the known issue.** If you ran the 0.22.1 gateway, its sessions can't be deleted in v0.22.2.

## FAQ

### Should I Skip v0.22.1?

Yes. v0.22.1 was built from the wrong commit and shipped unreleased gateway work. Install v0.22.2 directly. If you already ran v0.22.1, expect the session-deletion known issue.

### Is My Windows 10 Machine Supported?

It depends on the install path. The packaged desktop app is MSIX-only and needs Windows 11 22H2 or newer. The `install.ps1` source-installer path now works on Windows 10.

### What Happens to My Old Sessions?

Ended sessions inactive for 90 days are deleted at startup, because `sessions.auto_prune` defaults to on. Pinned and open sessions are never touched. Set `sessions.auto_prune: false` to keep everything. The idle and daily `session_reset` modes are retired, so use `/new` or `/reset` for fresh chats.

### Where Did My Honcho or Mem0 Memory Plugin Go?

Honcho and Mem0 moved to catalog plugins, along with Supermemory, Hindsight, OpenViking, and Holographic. Existing users are migrated on update or first start with data intact. Honcho, Supermemory, Hindsight, Mem0, and Home Assistant auto-install where used.

### Do I Need a Nous Account for Connectors?

No. You can start without one. On first use, Hermes creates a free connectors-only identity.

### What Happened to `hermes sync`?

It was removed. Skill Sync is gone, and the release notes do not name a replacement.

### When Does the Rest of `main` Ship?

Work that is only on `main` ships with v0.23.0. This guide makes no claims about what that work contains.

## The Bottom Line

Upgrade to **v0.22.2**, and skip v0.22.1. Before you upgrade, work through the defaults checklist, especially session reset, auto-prune, the Python 3.14 runtime, and the Windows packaging change. Watch the known issue: sessions run under the 0.22.1 gateway can't be deleted in 0.22.2.

Confidence is high on version numbers, dates, and install paths, because they come from the release notes. Confidence is moderate on how your own setup will behave, because this guide is built from documentation, not from a hands-on run.

## How This Guide Was Built

This guide is built from the official GitHub release notes for Hermes Agent v0.22.0, v0.22.1, and v0.22.2, and for v0.21.7, fetched October 18, 2026. It also draws on the [official Hermes Agent docs](https://hermes-agent.nousresearch.com/docs). The author did NOT run the upgrade or try the features hands-on. This is a documentation-based guide, not a hands-on review. Where the release notes are silent, this guide says so rather than filling the gap.

HERO_IMAGE_PROMPT: A photorealistic desk scene with a laptop showing a clean developer terminal beside a coffee mug and a printed upgrade checklist, soft morning light, no text in image.