# Hermes Tutorials — Agent Instructions

This is an Astro static site deployed to Cloudflare Pages (MDX-based).

## Commands

- `npm run dev` — Start local dev server
- `npm run build` — Build static site to `dist/`
- `npm run preview` — Preview built site locally

## Deploy

Run `bash ~/.hermes/scripts/deploy-hermes-tutorials.sh` — runs quality check, builds, and deploys to Cloudflare Pages.

If deploy is blocked:
- New untracked post → `git add -A && git diff --cached --quiet`
- MDX parse error → check for HTML comments (`<!-- -->`) — use `{/* */}` instead
- Build error → check `npm run build` output

## Content

Blog posts live in `src/content/blog/` as `.mdx` files.
Post frontmatter: `title`, `description`, `pubDate`, `tags`, `heroImage` (optional).

**CRITICAL:** Do NOT use HTML comments (`<!-- -->`) in `.mdx` files — they break the MDX parser. Use `{/* crosslinks */}` syntax instead.

## Quality Gates (MANDATORY)

1. **No HTML comments in MDX** — `<!-- -->` breaks the build. Use `{/* */}`.
2. **No unsourced stats** — All technical claims need citations or reproducible steps.
3. **Minimum length** — Posts under 400 words are skipped.
4. **Deploy guard** — Always `git add -A` before diff check.
5. **Cross-links verified** — `inject-crosslinks.py` runs at deploy; verify it completes.

## Anti-Patterns (DON'T)

- Don't use HTML comments in `.mdx` files.
- Don't fabricate command outputs or configurations.
- Don't write posts under 400 words.
- Don't skip the deploy guard.
- Don't reference yourself ("as an AI").
- **Don't silently degrade quality** — An MDX parse failure, a broken image, or a failed build must halt deployment. Never publish with known defects. Silent degradation is worse than a clean failure.

## Anti-Rationalization Rules (from addyosmani/agent-skills)

The following thoughts are incorrect and must be ignored:
- "This post is too short for quality checks"
- "I can just write this quickly without loading a skill"
- "I'll verify the claims after publishing"
- "The outline is obvious, I don't need to write it down"

Correct behavior: always load the relevant skill(s) first, always run quality checks before deploy, always verify claims before shipping.

## Style

- Focus: Hermes Agent tutorials, guides, build logs, and integrations
- Every command must be tested and shown with example output
- Include config snippets (JSON, YAML, TOML) in code blocks
- Headings: Sentence case. Always specify language in code fences.
