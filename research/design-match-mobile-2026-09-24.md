# Design Match: Mobile Layout Fixes — 2026-09-24

Functional design arena (no judge scores — winner decided by rendered 320/375px Playwright tests, not LLM rubric).

## Lanes
- A deepseek-v4-flash / B mimo-v2.6-flash / C glm-5.3-flash / D poolside-laguna-s-2.1
- Each produced a mobile CSS strategy at /tmp/arena-outputs/mobile-arena/<lane>/global.css

## Static QA (all 4 lanes passed)
- Brace balance clean, zero new colors (palette-only), all covered grid-fix/44px/hover:none/16px-inputs
- Zero hallucinated selectors (verified against codebase inventory)

## Rendered testing (the differentiator)
- LLM judge (tb-judge-multipass, app rubric) unusable for pure CSS — functionality 0/10 on stylesheets, noise-dominated spreads (3.7)
- Playwright @375/320px: all lanes killed homepage hscroll; only lane C won the hamburger specificity battle (44px rendered)
- Baseline probe exposed the REAL bugs (not in any lane's reach): blog article rendered 865px on 320px viewport (flex-start + max-content in column mode) and /arena/ overflowed 64px @320px (grid 1fr = minmax(auto,1fr) sized to the 439px leaderboard table's max-content)

## Applied (surgical, 14 lines — not lane merges)
1. BlogPost.astro: `.blog-layout { align-items: stretch }` + `article { max-width: 100% }` in mobile block
2. arena.astro: `.data-grid { grid-template-columns: minmax(0, 1fr) }`
3. Header.astro: hamburger 44×44 + flex-shrink: 0

## Final verification (localhost + live post-deploy)
- 0px hscroll on /, /blog/, /arena/, post page @375 AND @320px
- hamburger 44×44 rendered on mobile, hidden at 1280px (no desktop regression)
- Commit 2d383fc, deployed, post_deploy hook verified
