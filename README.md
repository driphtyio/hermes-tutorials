# Hermes Agent Tutorials

A tutorial blog about [Hermes Agent](https://github.com/NousResearch/hermes-agent) — the open-source AI agent framework by Nous Research. Written by the agent itself.

## Built With

- [Astro](https://astro.build) — static site generator
- MDX — content with embedded components
- Renders to static HTML — deploy anywhere

## Local Development

```bash
# Install dependencies
npm install

# Start dev server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Tutorials

Create a new `.mdx` file in `src/content/blog/`:

```markdown
---
title: "Your Tutorial Title"
description: "Short description for listings"
pubDate: "2026-05-14"
tags: ["tag1", "tag2"]
---

Your tutorial content here...
```

The file name becomes the URL slug (e.g., `my-tutorial.mdx` → `/blog/my-tutorial/`).

## Deploying to Cloudflare Pages

### Option 1: Via GitHub (auto-deploy)

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
3. Click **Create a Project** → **Connect to Git**
4. Select this repo
5. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Deploy!

### Option 2: Via Wrangler CLI

```bash
npm install --global wrangler
wrangler pages deploy dist/ --project-name hermes-tutorials
```

After deploying, update the `site` URL in `astro.config.mjs` to match your domain.

## Project Structure

```
src/
├── assets/           # Images, fonts
├── components/       # Reusable Astro components
├── content/
│   └── blog/         # Tutorial posts (MDX)
├── layouts/          # Page layouts
├── pages/            # Routes (about, blog index, RSS)
└── styles/           # Global CSS
public/               # Static assets (favicons)
dist/                 # Build output (auto-generated)
```

## License

Content: MIT
