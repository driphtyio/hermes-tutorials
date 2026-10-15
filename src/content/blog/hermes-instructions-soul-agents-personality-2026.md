---
title: "SOUL.md vs AGENTS.md vs /personality: Where Hermes Instructions Belong in 2026"
description: "Where Hermes instructions belong: SOUL.md for voice, AGENTS.md for project rules, /personality for a session switch, and the context-file load order."
pubDate: 2026-10-15
updatedDate: "2026-10-15"
tags: [guide, hermes-agent, soul-md, agents-md, personality, context-files]
lastVerified: "2026-10-15"
heroImage: "https://pub-0066f5275194430aa9f985cb23278abe.r2.dev/hermes-instructions-soul-agents-personality-2026-1792078232.webp"
---

**Who this is for:** Hermes users who want to know which file should hold which instruction, and why a change sometimes "doesn't stick."

**Honesty note:** This guide is based on the official Hermes documentation and the AGENTS.md open format. We did not run each precedence rule hands-on. Where two official pages disagree, we say so below instead of picking one.

---

## Which Hermes Files Shape Behavior?

Hermes is shaped by a few markdown files and one runtime switch. [The Which File Does What page](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what) maps them in one table: SOUL.md holds the agent's identity, USER.md holds your profile, MEMORY.md holds what the agent has learned, AGENTS.md (or .hermes.md) holds project rules. `/personality` is a session-level switch. Each has a different owner and a different scope.

**Direct answer:** Put durable voice in SOUL.md, project rules in AGENTS.md or .hermes.md, and temporary tone changes in `/personality`. The official docs say that if an instruction should follow you everywhere, it belongs in SOUL.md; if it belongs to a project, it belongs in AGENTS.md. (Source: [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what), [Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality).)

---

## SOUL.md: The Identity Layer

SOUL.md is the agent's primary identity. The [Personality docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) say it occupies slot #1 of the system prompt and replaces the hardcoded default identity. Hermes seeds a starter file at `~/.hermes/SOUL.md` and never overwrites an existing one.

Hermes loads SOUL.md only from `HERMES_HOME`, never from the directory you launch it in. The docs give the reason: personality should belong to the Hermes instance, not change between projects. If the file is empty or unreadable, Hermes falls back to a built-in identity. Content is injected verbatim after a scan and truncation.

**Direct answer:** SOUL.md defines tone, directness, and how the agent handles uncertainty or disagreement. It is read from `~/.hermes/SOUL.md` only. Project paths and repo conventions do not belong there. (Source: [Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality).)

---

## AGENTS.md and .hermes.md: The Project Layer

AGENTS.md holds project architecture, coding conventions, commands, ports, paths, and deployment notes. The [Context Files page](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) describes how it is discovered: Hermes loads the AGENTS.md in your working directory at startup, and as the agent moves into subdirectories it injects their context files when they become relevant. Each subdirectory is checked at most once per session.

AGENTS.md follows an open format. [agents.md](https://agents.md) describes it as plain Markdown with no required fields, stewarded by the Agentic AI Foundation under the Linux Foundation. Its FAQ says the closest AGENTS.md to the edited file wins, and explicit user chat prompts override everything.

.hermes.md (or HERMES.md) is Hermes-specific and, per the Which File page, takes priority over AGENTS.md.

**Direct answer:** AGENTS.md carries repo-specific rules and is discovered from your working directory and subdirectories. Use `.hermes.md` when you want a Hermes-specific project file that wins over AGENTS.md. (Source: [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files), [agents.md](https://agents.md).)

---

## /personality: The Session Switch

`/personality` changes the voice for the current session without editing a file. The Personality docs describe SOUL.md as the baseline voice and `/personality` as the temporary mode. Examples from the docs include keeping a pragmatic SOUL.md and switching to a teacher persona for a tutoring session.

The docs say `/personality` is a session-level overlay and do not describe it rewriting SOUL.md. Whether a switched personality persists across restarts is not stated on the pages we read, so we treat it as unverified.

**Direct answer:** Use `/personality` for a one-session tone change. Edit SOUL.md for a change you want every session to keep. (Source: [Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality).)

---

## The Project Context Load Order: A Documentation Conflict

Two official pages disagree about the project-context chain, and we are not going to resolve it by guessing.

- The **Context Files** page lists first-match-wins as `.hermes.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`, and says AGENTS.override.md replaces the committed AGENTS.md when both exist in the same directory.
- The **Which File Does What** page lists the chain as `.hermes.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules`, with no AGENTS.override.md.

Both pages agree that SOUL.md always loads independently as slot #1. Check the file names your own install actually loads before relying on AGENTS.override.md.

**Direct answer:** SOUL.md always loads on its own. For project files, the docs say only one loads per session, first match wins, but the two official pages differ on whether AGENTS.override.md is in that chain. (Source: [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files), [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what).)

---

## USER.md and MEMORY.md: Why They Are Not SOUL.md

People often put facts about themselves in SOUL.md and then wonder why memory did not change. The Which File page explains that SOUL.md and USER.md are separate systems. You edit SOUL.md directly. The agent writes USER.md and MEMORY.md through the `memory` tool. Both memory files are injected as a frozen snapshot at session start, so a fact saved mid-session appears in the next session's prompt.

**Direct answer:** Put your profile facts in conversation and let the agent save them to USER.md. Put durable voice rules in SOUL.md. The two files never feed each other. (Source: [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what).)

---

## Which File Should You Edit?

| Change you want | File | Scope | Source |
|---|---|---|---|
| Tone, directness, how to handle disagreement | SOUL.md | Every session, HERMES_HOME only | [Personality](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) |
| Repo architecture, commands, ports, paths | AGENTS.md | Project directory and subdirectories | [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) |
| Hermes-specific project rules that beat AGENTS.md | .hermes.md | Project, up to git root | [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what), [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) |
| Temporary voice for one session | /personality | Current session | [Personality](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) |
| Facts about you | USER.md (agent-written) | Injected at session start | [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what) |

---

## Common Mistakes

Common mix-ups to avoid, each tied to the layer that fixes it:

1. **Putting one-off project instructions in SOUL.md.** The [Personality page](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) says these belong in AGENTS.md.
2. **Expecting `/personality` to rewrite SOUL.md.** It is a session-level overlay. The [Personality page](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) and [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what) both describe it as a temporary switch with no file edit. Edit SOUL.md for a permanent change.
3. **Editing SOUL.md to save your name.** [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what) says SOUL.md and USER.md are separate systems that never feed each other. Tell the agent to remember it.
4. **Putting project conventions in SOUL.md.** The [Personality page](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality) says repo conventions belong in AGENTS.md.

**Direct answer:** Most instruction problems come from putting content in the wrong layer. Match each rule to the file that owns it. (Source: [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what).)

---

## Configuration Context

Hermes settings live in `~/.hermes/config.yaml`, and secrets go in `~/.hermes/.env`. CLI arguments override config, which overrides `.env`, which overrides built-in defaults. The [configuration page](https://hermes-agent.nousresearch.com/docs/user-guide/configuration) also includes a Context Files section. We did not read its full text, so this guide does not cite its size-cap defaults.

**Direct answer:** Instruction files are separate from `config.yaml`. Use config for settings and markdown files for instructions. (Source: [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration).)

---

## FAQ

### Does /personality edit SOUL.md?

No. The Personality docs describe `/personality` as a session-level overlay. It does not edit a file. Edit `~/.hermes/SOUL.md` for a change that should persist. (Source: [Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality).)

### Can I reuse an AGENTS.md written for another tool?

Yes, in principle. [agents.md](https://agents.md) describes AGENTS.md as plain Markdown with no required fields, and says the closest AGENTS.md to the edited file wins. Hermes loads AGENTS.md from your working directory and subdirectories, and the [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files) page says deeper files take precedence. That page also lists CLAUDE.md and .cursorrules as detected project context.

### Why didn't my USER.md or memory update when I edited SOUL.md?

Because SOUL.md and USER.md are separate systems. [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what) says editing SOUL.md does not populate memory, and the agent writes USER.md through the memory tool.

---

## The Bottom Line

Put durable voice in `~/.hermes/SOUL.md`. Put repo rules in AGENTS.md or `.hermes.md`. Use `/personality` for a single session. Let the agent write your profile to USER.md. Where the docs disagree on AGENTS.override.md, check your install before relying on it.

---

## How This Guide Was Built

This guide was compiled from official Hermes documentation pages and the agents.md format page, fetched 2026-10-15. Every claim above cites one of the pages below. We did not run the precedence rules hands-on.

**Pages read:**

- [Context Files](https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files)
- [Personality & SOUL.md](https://hermes-agent.nousresearch.com/docs/user-guide/features/personality)
- [Which File Does What](https://hermes-agent.nousresearch.com/docs/user-guide/which-file-does-what)
- [Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [CLI guide](https://hermes-agent.nousresearch.com/docs/user-guide/cli)
- [agents.md](https://agents.md)

**Further reading (listed in the official docs index, not read in full):**

- [Hermes Agent documentation home](https://hermes-agent.nousresearch.com/docs)
- [Quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
- [Persistent Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory)
- [Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)
- [TUI (terminal UI)](https://hermes-agent.nousresearch.com/docs/user-guide/tui)

**Gaps we did not close:**

- The full Configuration page section on Context Files was not read.
- Built-in `/personality` preset names were not extracted.
- Session persistence of `/personality` across restarts is not stated on the pages we read.
- The AGENTS.override.md conflict between the two context pages is unresolved on the docs side.

<!-- crosslinks -->

## 📖 Related Reads

- **[ToolBrain](https://toolbrain.net/)** — tool reviews, LLM comparisons, and AI workflow guides

*Cross-links automatically generated from Hermes Tutorials.*
