---
name: hermes-post-patterns
description: Hermes Tutorials-specific post patterns — step-by-step Hermes Agent tutorials, config guides, build logs
version: 1.0.0
triggers:
  - hermestuts
  - blog post
  - writing
---

# Hermes Tutorials Post Patterns

## Frontmatter Template

```yaml
---
title: "Post Title Here"
description: "150-160 char meta description"
pubDate: YYYY-MM-DD
tags: ["hermes-agent", "tutorial", "MCP"]
heroImage: "https://r2.example.com/hermestuts/image.webp"
---
```

## Writing Style

- **Voice**: Tutorial-focused, step-by-step. Assume reader installed Hermes but hasn't configured it.
- **Structure**: Goal → Setup → Steps → Output → Next.
- **Citations**: Commands must be tested. Show real output.
- **Length**: 800-1500 words.
- **CRITICAL**: No HTML comments (`<!-- -->`) in `.mdx` — use `{/* ... */}`.

## Content Structure

### Tutorial
```
## What You'll Build
## Prerequisites
## Step 1: ...
## Step 2: ...
## Verification
## Next Steps
```

### Configuration Guide
```
## Use Case
## Config Options
## Examples
## Troubleshooting
```

## Required Elements

- Every command shown with example output
- Config snippets in JSON/YAML/TOML with language-specified code blocks
- heroImage optional (tutorials benefit more from code)
- Sentence-case headings
- `{/* crosslinks */}` never `<!-- crosslinks -->`

## Tag Convention

- Lowercase: hermes-agent, tutorial, MCP, configuration, plugins, skills, cron
- Prefer existing tags from `src/content/blog/`
