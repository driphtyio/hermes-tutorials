# Hermes Tutorials — Agent Instructions

## Directory Guide

| File | Purpose |
|------|---------|
| `DESIGN.md` | Brand design system (colors, typography, spacing) — read before designing pages |

This is an Astro static site deployed to Cloudflare Pages (MDX-based).

## Commands

- `npm run dev` — Start local dev server
- `npm run build` — Build static site to `dist/`
- `npm run preview` — Preview built site locally

### Command Output (keep it quiet)

See `~/.hermes/AGENTS-BASE.md` — shared across all blogs.

## Deploy

Run `bash ~/.hermes/scripts/deploy-hermes-tutorials.sh` — runs quality check, builds, and deploys to Cloudflare Pages.

If deploy is blocked:
- New untracked post → `git add -A && git diff --cached --quiet`
- MDX parse error → check for HTML comments (`<!-- -->`) — use `{/* */}` instead
- Build error → check `npm run build` output

## Failure Modes

| Symptom | Root Cause | Cause | Fix |
|---------|-----------|-------|-----|
| Build error | MDX files don't accept raw HTML — comments (`<!-- -->`) or injection output breaks the parser silently, or frontmatter field mismatch | Missing import, broken frontmatter, HTML comments in MDX | Check `npm run build` output — use `{/* */}` not `<!-- -->` |
| Deploy blocked (no changes) | CI requires staged changes — new files need `git add -A` before `git diff` catches them | `git add -A` not run before diff | Run `git add -A && git diff --cached --quiet` |
| Feature image 404 | R2 upload raced with deploy, or slug doesn't match uploaded filename | heroImage URL not uploaded | Generate via `gen-image-verified.sh`, verify HTTP 200 |
| Quality gate blocked | New post below blog floor for word count or citations | Content metrics dropped below floor | Improve post (add citations, word count) |
| Cross-link injection failed | `inject-crosslinks.py` writes HTML `<!-- -->` syntax into `.mdx` files, which MDX parser rejects | HTML comments from injection in MDX | Ensure inject-crosslinks.py uses `{/* */}` syntax for MDX blogs |

## Content

Blog posts live in `src/content/blog/` as `.mdx` files.
Post frontmatter: `title`, `description`, `pubDate`, `tags`, `heroImage` (mandatory).

**CRITICAL:** Do NOT use HTML comments (`<!-- -->`) in `.mdx` files — they break the MDX parser. Use `{/* crosslinks */}` syntax instead.

## Quality Gates (MANDATORY)

1. **No HTML comments in MDX** — `<!-- -->` breaks the build. Use `{/* */}`.
2. **Cross-links verified** — `inject-crosslinks.py` runs at deploy; verify it completes.

Shared gates (no unsourced stats, minimum length, deploy guard) apply from `~/.hermes/AGENTS-BASE.md`.

## Source-Driven Development

See `~/.hermes/AGENTS-BASE.md` — shared across all blogs.

## Context Engineering Hierarchy

See `~/.hermes/AGENTS-BASE.md` — shared across all blogs.

## Anti-Patterns (DON'T)

- Don't use HTML comments in `.mdx` files.
- Don't fabricate command outputs or configurations.
- Don't write posts under 400 words.
- Don't skip the deploy guard.
- Don't reference yourself ("as an AI").
- **Don't silently degrade quality** — An MDX parse failure, a broken image, or a failed build must halt deployment. Never publish with known defects. Silent degradation is worse than a clean failure.

## Anti-Rationalization Rules

See `~/.hermes/AGENTS-BASE.md` — shared across all blogs.
