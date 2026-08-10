# Plan & Rubric — Beginner's Guide to Hermes Agent (Step 1b)

- **Pipeline step:** 1b (Plan & Rubric) — created BEFORE builders start
- **Plan model:** mimo-v2.5-pro
- **Blog:** hermes-tutorials.dev (Astro + MDX, Cloudflare Pages)
- **Post type:** Beginner's guide / tutorial
- **Target length:** 800–1500 words with inline citations
- **Mandated sources (both verified HTTP 200 on 2026-08-10):**
  - https://hermes-agent.nousresearch.com/docs
  - https://github.com/NousResearch/hermes-agent
- **Judge:** weighted 0–10 rubric (Section 6); pass threshold ≥ 7.5, hard-fail conditions apply

---

## 1. Angle (what makes this guide unique)

Existing content landscape: official docs are reference-heavy (quickstart assumes CLI comfort);
the blog already has an internal "Getting Started" hub (link-forwarding learning path),
comparison posts (hermes-vs-*), and topic deep-dives (plugins, cron, MCP). A plain "install &
first chat" post would be redundant.

**Unique angle:** the "no-hype, plain-English on-ramp" — a self-contained, jargon-light guide for
a non-expert that answers the three questions every beginner actually asks: *What is this?
Is it safe/free/privacy-respecting? How do I get it running in under 10 minutes?* It frames
Hermes Agent around **local-first privacy + provider freedom** (bring your own LLM, no vendor
lock-in, free & open-source) — the differentiators vs. cloud SaaS agents and vs. the docs —
and includes a "common mistakes" section the docs don't have. It is standalone (no dependency
on other blog posts) yet cross-links forward.

---

## 2. Required sections (IN THIS ORDER) with word targets

| # | Section (H2) | Target words | Requirements |
|---|---|---|---|
| 1 | Opening hook (before first H2) | 60–90 | Relatable problem → promise: "by the end you'll have your own local AI agent installed, configured, and chatting in ~10 minutes." No fluff, no "in this article we will…" |
| 2 | How This Guide Was Built (E-E-A-T) | 50–70 | Transparency block: facts verified against official docs (link) and GitHub repo (link); lastVerified date stated; no sponsorship/affiliate; corrections welcome via GitHub issues. |
| 3 | What It Does | 120–150 | Plain definition: open-source AI agent by Nous Research; runs locally on your machine (privacy); CLI-first; executes tasks/tools autonomously. |
| 4 | Key Features | 150–200 | Bulleted. MUST include: open-source (Nous Research); runs locally; multiple LLM providers supported; skills system; plugins; cron/scheduled jobs. Only claim details that appear in the cited sources. |
| 5 | Step-by-Step Setup | 200–300 | Numbered steps: prerequisites → install command (copy verbatim from docs) → `hermes setup` → provider/API key choice → first conversation → **verification step** ("you should see…"). Copy commands from the docs page; never invent flags. |
| 6 | Common Mistakes | 150–200 | 3–5 mistakes, each with a concrete fix (e.g., skipping provider config, wrong Python/Node version, assuming it's cloud-only, editing config in the wrong location, expecting Windows-native paths without WSL). |
| 7 | FAQ (2–3 questions) | 120–180 | Suggested: "Is Hermes Agent really free?" / "Which LLM providers can I use — do I need OpenAI?" / "Do I need a powerful computer to run it locally?" Answers 40–60 words each, sourced. |
| 8 | Where to Go Next | 50–80 | Link to docs, GitHub repo, and internal `/blog/` posts that EXIST (verified slugs: `cli-mastery`, `provider-setup`, `cron-job-patterns-2026`, `plugins-complete-list`, `mcp-servers-guide`, `gateway-setup`, `troubleshooting`). |

Every H2 body must be a **self-contained 40–60 word answer** (readable standalone, no "as
discussed above" dangling references).

---

## 3. Must-include facts (non-negotiable)

1. Hermes Agent is **open-source** and made by **Nous Research**.
2. It **runs locally** (privacy — your data stays on your machine).
3. It supports **multiple LLM providers** (bring your own keys; not locked to one vendor).
4. It has **skills** (self-improving capabilities), **plugins**, and **cron** (scheduled jobs) systems.

Each must be stated at least once and be traceable to the mandated sources.

---

## 4. Source URLs to cite

- https://hermes-agent.nousresearch.com/docs — primary factual source (features, install, setup)
- https://github.com/NousResearch/hermes-agent — open-source attribution, repo/community, issues
- Both verified HTTP 200 (2026-08-10). Additional external links allowed ONLY if verified HTTP 200.
- Internal `/blog/` links allowed only for slugs that exist in `src/content/blog/`.

---

## 5. Required frontmatter (schema-enforced)

```mdx
---
title: "Beginner's Guide to Hermes Agent: Install, Set Up & Chat With Your First Local AI Agent"
description: "<160 chars, SEO meta>"
pubDate: "2026-08-10"
tags: ["beginner-guide", "hermes-agent", "getting-started", "tutorial"]
heroImage: "/blog/..."   # mandatory for deploy (AGENTS.md)
---
```

Description MUST be ≤160 characters (Zod-enforced). Title MUST follow the
"Beginner's Guide to <Tool>" or equivalent SEO-friendly pattern.

---

## 6. Weighted scoring rubric (judge uses this)

Score each criterion 0–10, then: **Final = 0.30·Accuracy + 0.25·Sourcing + 0.20·Quality + 0.15·Practicality + 0.10·Engagement**. Pass ≥ 7.5.

### Accuracy (weight 30%)
| Score | Anchor |
|---|---|
| 9–10 | Every claim traceable to cited sources; zero invented features/stats/commands; all 4 must-include facts stated correctly (open-source, Nous Research, local, multi-provider, skills/plugins/cron). |
| 7–8 | Fully accurate; minor vagueness only (e.g., an unqualified number not present in sources) — no errors. |
| 5–6 | One factual error or one significant unsourced claim. |
| 3–4 | Multiple errors (wrong install command, wrong org, misdescribed feature). |
| 0–2 | Hallucinated content, or any fabricated testing/benchmark claim. |

### Sourcing (weight 25%)
| Score | Anchor |
|---|---|
| 9–10 | ≥5 inline markdown links; BOTH mandated URLs present; all links verified HTTP 200; contextual anchor text; zero `[1]`/`[2]`-style references. |
| 7–8 | Both mandated URLs present; 3–4 links; all resolve. |
| 5–6 | One mandated URL missing, or one dead/non-clickable link. |
| 3–4 | Multiple dead links or bare URLs; sparse sourcing. |
| 0–2 | No citations, or fabricated URLs. |

### Quality (weight 20%)
| Score | Anchor |
|---|---|
| 9–10 | All 8 sections present in required order; every H2 followed by a self-contained 40–60 word answer; E-E-A-T block present; FAQ with 2–3 Q&As; 800–1500 words; clear prose; valid frontmatter (description ≤160); no HTML comments; no numbered refs. |
| 7–8 | One minor deviation (one section slightly off word range, one sub-element missing). |
| 5–6 | Two+ structural misses (missing FAQ, no E-E-A-T block, sections out of order). |
| 3–4 | Poorly structured; several sections missing. |
| 0–2 | Unreadable or incomplete draft. |

### Practicality (weight 15%)
| Score | Anchor |
|---|---|
| 9–10 | Prerequisites listed; copy-paste install/setup commands matching docs; explicit verification step; common mistakes with concrete fixes; reader goes zero-to-first-conversation unaided. |
| 7–8 | Actionable but one piece missing (e.g., no verification step). |
| 5–6 | Steps vague/incomplete (e.g., "install it" with no command). |
| 3–4 | Mostly conceptual, few actionable steps. |
| 0–2 | No actionable content. |

### Engagement (weight 10%)
| Score | Anchor |
|---|---|
| 9–10 | Title follows "Beginner's Guide to Hermes Agent" pattern with a concrete benefit; hook in first 100 words sets stakes and promises payoff; scannable (bullets, bold, short paragraphs). |
| 7–8 | Solid title + hook; slightly generic. |
| 5–6 | Title on-pattern but bland; weak hook. |
| 3–4 | Off-pattern or clickbait title; no real hook. |
| 0–2 | Misleading title; opens with filler. |

### Hard fails (reject regardless of score; cap at 5.0)
- Any fabricated testing/benchmark claim ("we tested", "benchmarks show", "in our trials" — builders did not test).
- Any HTML comment (`<!-- -->`) in the .mdx file.
- Either mandated URL missing, or any cited URL returns non-200.
- Word count outside 800–1500.

---

## 7. Constraints (hard rules for builders)

1. **No HTML comments in MDX** — `<!-- -->` breaks the Astro/MDX parser. If a comment is ever needed use `{/* */}`; prefer none.
2. **No numbered references** `[1]` `[2]` — inline markdown links `[anchor text](url)` only.
3. **No fabricated testing claims** — never claim something was tested/benchmarked/verified hands-on.
4. **Inline clickable links only** — no bare URLs pasted as text.
5. **No self-reference as an AI** ("as an AI, I…") — AGENTS.md anti-pattern.
6. **No unsourced stats** — any number (providers, tools, stars) must appear in a cited source.
7. **Frontmatter valid** — description ≤160 chars; pubDate "2026-08-10"; heroImage present.
8. **Only link to existing internal slugs** (list in Section 2, #8) — no dead `/blog/` links.
9. **MDX only** — file at `src/content/blog/<slug>.mdx`.

---

## 8. Builder checklist (verify before submitting)

- [ ] Title uses "Beginner's Guide to …" pattern; description ≤160 chars
- [ ] 800–1500 words (count body only)
- [ ] All 8 sections present, in required order
- [ ] All 4 must-include facts stated and sourced
- [ ] Both mandated URLs cited inline; every link checked HTTP 200
- [ ] No `<!-- -->`, no `[1]`, no bare URLs, no testing claims
- [ ] Copy-paste commands match the docs page verbatim
- [ ] FAQ has 2–3 questions with 40–60 word answers
- [ ] E-E-A-T block states verification method + lastVerified date
