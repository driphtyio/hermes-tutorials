---
version: alpha
name: hermestuts-design
description: "A dark-theme Hermes Agent tutorial blog anchored on deep charcoal canvas (#0a0a0b) with purple accent (#6c5ce7) as the single chromatic signature. The system reads as developer tool documentation: educational, terminal-focused, and CLI-oriented. Purple accent drives links, CTAs, code syntax highlighting, and callout borders. Page rhythm uses terminal screenshots, MCP architecture diagrams, and tool-configuration examples. Typography uses Atkinson Hyperlegible (bundled) for reading comfort, JetBrains Mono for code. Content-width is tight (860px) for focused reading."

colors:
  primary: "#6c5ce7"
  primary-hover: "#a29bfe"
  primary-dark: "#5a4bd1"
  primary-glow: "rgba(108, 92, 231, 0.15)"
  ink: "#e8e8ed"
  ink-secondary: "#a1a1aa"
  ink-muted: "#6b6b76"
  canvas: "#0a0a0b"
  surface-1: "#121214"
  surface-2: "#1a1a1e"
  surface-3: "#202026"
  border: "#1e1e22"
  border-light: "#2a2a2e"
  border-hover: "#3a3a42"
  code-bg: "#1a1a1e"
  inverse-canvas: "#ffffff"
  inverse-surface: "#f5f5f7"
  inverse-ink: "#000000"
  semantic-success: "#22c55e"
  semantic-warning: "#eab308"
  semantic-error: "#ef4444"
  semantic-info: "#3b82f6"

typography:
  display-xl:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.03em
  display-lg:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em
  display-md:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.20
    letterSpacing: -0.02em
  headline:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  subheadline:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.30
    letterSpacing: 0px
  body-lg:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0px
  body:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0px
  body-sm:
    fontFamily: "Atkinson Hyperlegible, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.60
    letterSpacing: 0px
  code:
    fontFamily: "JetBrains Mono, SF Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.60
    letterSpacing: 0px
  code-sm:
    fontFamily: "JetBrains Mono, SF Mono, ui-monospace, monospace"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0px

spacing:
  section: 56px
  card-padding: 20px
  content-width: 860px
  grid-width: 1200px
  nav-height: 64px
  content-gap: 20px
  element-gap: 12px
  inline-gap: 8px

border-radius:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px

shadows:
  card: "0 1px 2px rgba(0,0,0,0.3)"
  elevated: "0 4px 12px rgba(0,0,0,0.4)"
  modal: "0 8px 30px rgba(0,0,0,0.5)"
  screenshot: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)"

design-principles:
  - "Dark-first: default to dark backgrounds, light text — #0a0a0b canvas darker than sibling blogs"
  - "Purple as single accent: links, CTAs, code highlights, callout left-borders"
  - "Terminal-and-tools: terminal screenshots, CLI output, and MCP/config diagrams over abstract imagery"
  - "Educational density: code examples must show actual output, command outputs are primary storytelling"
  - "Narrow focus: 860px content width for concentrated reading"
  - "Step-by-step clarity: tutorials need numbered steps with real config examples"
  - "Hermes-first: examples reference real Hermes Agent features and workflows"

anti-patterns:
  - "No teal gradients — purple accent only as signature"
  - "No blue accent — purple distinguishes HermesTuts from codeintel (blue) and niteagent (teal)"
  - "No sans-serif-only typography — Atkinson Hyperlegible is the reading font"
  - "No left-border accent cards in blue/teal — use purple border if needed"
  - "No purple→magenta trust gradients — use flat purple or neutral surface"
  - "No emoji as UI icons — terminal output and config blocks are the visual language"
  - "No placeholder/lorem images — always use real CLI screenshots or generated feature images"
  - "No fabricated command outputs or configs — every CLI example must be real and tested"
  - "No AI-writing tics ('delve into', 'comprehensive guide', 'landscape of') — write direct technical instruction"
  - "No abstract hero images — feature images should reference Hermes, MCP, or CLI tooling"
