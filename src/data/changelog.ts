// AUTO-GENERATED from NousResearch/hermes-agent GitHub releases (32 releases, 2026-03-12..2026-09-07).
// Regenerate via /tmp/ht-changelog-gen.py — do not hand-edit entries.
export interface ChangelogLink {
  url: string;
  label: string;
}

export interface ChangelogEntry {
  tag: string;
  version: string;
  codename: string;
  date: string;
  summary: string;
  highlights: string[];
  prs: string;
  url: string;
  compare: string;
  links: ChangelogLink[];
}

export const changelog: ChangelogEntry[] = [
  {
    "tag": "v2026.9.7",
    "version": "v0.21.1",
    "codename": "",
    "date": "2026-09-07",
    "summary": "Measured at commit 6178e9f4eed8d99f4fc550add939d58c7bed6206, the window since v0.21.0 contains <strong>5,139 non-merge commits</strong> across <strong>4,364 changed files</strong> (+601,014 / \u2212768,419). GitHub reports <strong>632 merged PRs</strong> in the release window at preparation time. These figures exclude the release-version commit.",
    "highlights": [],
    "prs": "632",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.7",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.31...v2026.9.7",
    "links": []
  },
  {
    "tag": "v2026.8.31",
    "version": "v0.21.0",
    "codename": "Pantheon Release",
    "date": "2026-08-31",
    "summary": "",
    "highlights": [
      "<strong>Bot Mode \u2014 your agents become a society, built in</strong> \u2014 Bot Mode is now a bundled, default-on part of the desktop app: every agent profile gets a name, a deterministic avatar face (with randomize/lock controls), and a place in a shared roster. Create Discord-s\u2026",
      "<strong>`hermes peer` \u2014 bot-to-bot DMs between your agents</strong> \u2014 Any Hermes agent can now message any other by handle, across profiles and gateways, from the CLI or from inside a conversation. Ask your research bot to hand findings to your coding bot and get the reply\u2026",
      "<strong>Cron jobs that remember</strong> \u2014 Scheduled jobs stopped being goldfish. Cron agents now load and update persistent memory like every other agent, `continuity=true` carries each run's output into the next (so a monitor can dedupe against what it already reported),\u2026",
      "<strong>Steer your subagents while they run</strong> \u2014 `delegate_task` gained live orchestration: list running children, steer one mid-flight with a course correction, or stop it early and keep the partial result. Add optional JSON-schema validation on child outputs, per-d\u2026",
      "<strong>The MCP command center</strong> \u2014 MCP servers and the catalog merged into one coherent desktop page with drag-in \"paste anything\" import, background health checks that nudge you to re-auth before a tool call fails, a fleet cost/usage overlay showing schema token es\u2026"
    ],
    "prs": "2,475",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.3...v2026.8.31",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      },
      {
        "url": "/blog/cron-job-patterns-2026/",
        "label": "Cron patterns guide"
      }
    ]
  },
  {
    "tag": "v2026.8.27",
    "version": "v0.20.6",
    "codename": "",
    "date": "2026-08-27",
    "summary": "Since v0.20.5 (v2026.8.19, tagged August 21), this window landed <strong>~1,313 commits</strong> across <strong>~1,557 files</strong> (+177,113 / \u221221,682) \u2014 <strong>~525 merged PRs</strong> including consent-gated real-profile browsing (use your default Chromium profile for local browsing, with Windows close-with-approval flow); the desktop Browser getting its own OS window plus a managed SSH remote-update engine and fleet profile rail",
    "highlights": [],
    "prs": "525",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.27",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.19...v2026.8.27",
    "links": [
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.8.19",
    "version": "v0.20.5",
    "codename": "",
    "date": "2026-08-21",
    "summary": "Since v0.20.4 (v2026.8.18, tagged August 18), this window landed <strong>~746 commits</strong> across <strong>~1,250 files</strong> (+111,500 / \u221220,701) \u2014 <strong>~323 merged PRs</strong> including Bot Mode group-room threads, foldable conversation summaries, blob-face avatars, and PDF/file attachments with drag & drop; the keyless web tier (5-vendor free rotation with ring failover, web search on fresh installs with zero keys); a CLI ",
    "highlights": [],
    "prs": "323",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.19",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.18...v2026.8.19",
    "links": [
      {
        "url": "/blog/hermes-v0205-release/",
        "label": "Our release deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.8.18",
    "version": "v0.20.4",
    "codename": "",
    "date": "2026-08-18",
    "summary": "Since v0.20.3 (v2026.8.16.2, tagged August 17), this window landed <strong>~146 commits</strong> across <strong>~265 files</strong> (+21,697 / \u22122,217) \u2014 <strong>~74 merged PRs</strong> including the desktop glass/translucency surface work (matte glass, frost picker, macOS pre-select), the tabbed SESSIONS|BOTS sidebar with per-bot hide/unhide, Bot Mode group-chat fixes (long-running member turns, Markdown rendering, cross-machine routin",
    "highlights": [],
    "prs": "74",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.18",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.16.2...v2026.8.18",
    "links": [
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.8.16.2",
    "version": "v0.20.3",
    "codename": "",
    "date": "2026-08-17",
    "summary": "Since v0.20.2 (v2026.8.16, tagged earlier today), this window landed <strong>~250 commits</strong> across <strong>~461 files</strong> (+42,613 / \u22121,641) \u2014 <strong>~125 merged PRs</strong> including the MCP 2.x SDK migration and 2026-07-28 stateless protocol support, the bundled Bot Mode (hermes-bots) plugin with the core teammate protocol, the CommandCode provider plugin, subprocess Python runtime ownership hardening (PYTHONHOME/PYTHON",
    "highlights": [],
    "prs": "125",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.16.2",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.16...v2026.8.16.2",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.8.16",
    "version": "v0.20.2",
    "codename": "",
    "date": "2026-08-16",
    "summary": "Since v0.20.1 (v2026.8.13, tagged August 13), this window landed <strong>~967 commits</strong> across <strong>~1,279 files</strong> (+128,522 / \u22127,622) \u2014 <strong>~397 merged PRs</strong> of fixes and improvements spanning the desktop app (multi-gateway Connections registry, profile-scoped refreshes, MCP health checks and deep links), the CLI (Windows update probes, Kitty keyboard protocol, chat -c hardening), the gateway (persisted mod",
    "highlights": [],
    "prs": "397",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.16",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.13...v2026.8.16",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.8.13",
    "version": "v0.20.1",
    "codename": "",
    "date": "2026-08-13",
    "summary": "Since v0.20.0 (August 3), this window landed <strong>1,444 commits</strong> across <strong>~656 merged PRs</strong>, touching <strong>2,172 files</strong> (+233,872 / \u221275,244), and closed <strong>~481 issues</strong>. It is a broad stabilization-and-fixes rollup spanning the desktop app, gateway platforms, installers, tool system, and provider catalogs.",
    "highlights": [],
    "prs": "656",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.13",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.8.3...v2026.8.13",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.8.3",
    "version": "v0.20.0",
    "codename": "Herald Release",
    "date": "2026-08-03",
    "summary": "",
    "highlights": [
      "<strong>Talk to Hermes \u2014 streaming, conversational voice with barge-in</strong> \u2014 Voice mode used to mean: speak, wait for the whole reply to generate, then listen to one long audio file. Now Hermes speaks clause-by-clause as the response streams, you can interrupt it mid-\u2026",
      "<strong>Wake words and hands-free control</strong> \u2014 Say your own open-vocabulary wake phrase (\"hey Hermes\", or anything you pick) and Hermes starts listening \u2014 detection runs on-device, so no audio leaves your machine while it waits. Multi-profile voice routing means diff\u2026",
      "<strong>Voice on every platform</strong> \u2014 Send a voice note to Hermes on WhatsApp, Feishu, DingTalk, LINE, QQ, Photon, or Weixin and it's transcribed and answered; auto-TTS replies are delivered platform-aware (opus where platforms want opus, captions attached correctly).\u2026",
      "<strong>Research you can trust \u2014 grounded citations with fact-checking</strong> \u2014 The new `grounded-citations` skill makes Hermes produce research where every claim is backed by a verifiable source: quotes are matched against the actual page text (not hallucinated), citati\u2026",
      "<strong>Outbound webhooks \u2014 Hermes pushes events to your systems</strong> \u2014 Until now, integrating with Hermes meant polling or listening on a platform. Now Hermes pushes <strong>signed lifecycle events</strong> (session activity, turn completions, tool events) to any HTTP endpoint you\u2026"
    ],
    "prs": "1,400",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.3",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.7.20...v2026.8.3",
    "links": [
      {
        "url": "/blog/2026-08-08-hermes-herald-release-v020/",
        "label": "Our release deep-dive"
      },
      {
        "url": "/skills/",
        "label": "Skill Library"
      }
    ]
  },
  {
    "tag": "v2026.7.30",
    "version": "v0.19.1",
    "codename": "",
    "date": "2026-07-30",
    "summary": "Since v2026.7.20 (v0.19.0, July 20): <strong>~2,789 commits \u00b7 ~4,748 files changed \u00b7 ~442,000 insertions \u00b7 ~392,300 deletions</strong> on main. This window is dominated by bug-fix and salvage waves across the gateway, voice subsystem, desktop app, and installer, plus continued platform work (Buzz/Nostr channel, FLUX3 video generation and delivery, Telegram media reliability, voice-mode regressions).",
    "highlights": [],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.30",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.7.20...v2026.7.30",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.7.20",
    "version": "v0.19.0",
    "codename": "Quicksilver Release",
    "date": "2026-07-20",
    "summary": "",
    "highlights": [
      "<strong>Hermes got dramatically faster \u2014 first token in a fraction of the time</strong> \u2014 Cold-start \"Initializing agent...\" used to eat ~4.3 seconds before your first turn even reached the model; it's now ~0.9s, an ~80% cut that applies to the CLI, gateway, TUI, desktop, \u2026",
      "<strong>The desktop app speed wave \u2014 20+ targeted perf PRs</strong> \u2014 Long replies used to cost 14\u00d7 more CPU in the markdown splitter than they do now; giant diffs froze the review pane until we virtualized it; switching sessions thrashes layout no more. Streaming no longe\u2026",
      "<strong>Manage your Nous plan from the terminal \u2014 `/subscription` and `/topup`</strong> \u2014 Changing your subscription used to mean a trip to the billing website. Now `/subscription` opens a full flow right in the TUI or classic CLI: see your plan and remaining allowance, pr\u2026",
      "<strong>Smart approvals are now the default</strong> \u2014 When Hermes wants to run a flagged command, an LLM reviewer now assesses it independently instead of asking you to approve every single one \u2014 and each verdict covers only that exact command, so a later command matching\u2026",
      "<strong>Plug your password manager into Hermes \u2014 Bitwarden & 1Password secret sources</strong> \u2014 API keys no longer have to live in a plaintext `.env`. A new pluggable `SecretSource` interface lets Hermes fetch secrets from Bitwarden and 1Password (`op://` references) at l\u2026"
    ],
    "prs": "1,065",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.7.1...v2026.7.20",
    "links": [
      {
        "url": "/blog/2026-07-20-hermes-quicksilver-release-v019/",
        "label": "Our release deep-dive"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.7.7.2",
    "version": "v0.18.2",
    "codename": "",
    "date": "2026-07-08",
    "summary": "",
    "highlights": [],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7.2",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.7.7...v2026.7.7.2",
    "links": []
  },
  {
    "tag": "v2026.7.7",
    "version": "v0.18.1",
    "codename": "",
    "date": "2026-07-08",
    "summary": "This is an infrastructure-driven patch tag rather than a fully curated release. Since v0.18.0 shipped six days ago, main has accumulated roughly <strong>667 commits across ~990 files (+89.5k/\u221210.4k lines)</strong>, including installer/updater self-healing on Windows, dashboard and gateway fixes, WhatsApp dashboard pairing, MCP and provider fixes, and a large volume of stability work.",
    "highlights": [],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.7",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.7.1...v2026.7.7",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.7.1",
    "version": "v0.18.0",
    "codename": "Judgment Release",
    "date": "2026-07-01",
    "summary": "",
    "highlights": [
      "<strong>Mixture-of-Agents is now a first-class model you can pick</strong> \u2014 MoA used to be a mode you toggled; now every named MoA preset shows up as a selectable model under a `moa` provider, right alongside Claude, GPT, and Grok in every model picker (CLI, TUI, desktop,\u2026",
      "<strong>See every model's reasoning, then watch the answer stream in</strong> \u2014 When a MoA ensemble runs, each reference model's full output now renders as its own labelled block \u2014 you can read what GPT-5 thought, what Claude thought, and what Grok thought, before the aggr\u2026",
      "<strong>The agent verifies its own work \u2014 \"done\" means proven, not claimed</strong> \u2014 Hermes now records verification evidence for coding work and can decide it's finished by actually running your project's checks, not by asserting success. `/goal` gained **completion cont\u2026",
      "<strong>`/learn` \u2014 turn anything into a reusable skill by describing it</strong> \u2014 Run `/learn <anything>` and Hermes distills a reusable skill out of whatever you point it at \u2014 a directory, a URL, or just the workflow you walked it through five minutes ago. It writes the \u2026",
      "<strong>`/journey` \u2014 a playable timeline of everything Hermes has learned about you</strong> \u2014 The CLI and TUI gained `/journey`, a learning timeline that shows the memories and skills Hermes has accumulated over time \u2014 and you can edit or delete any of them right from the\u2026"
    ],
    "prs": "998",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.1",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.6.19...v2026.7.1",
    "links": [
      {
        "url": "/blog/2026-07-04-hermes-judgment-release-v018/",
        "label": "Our release deep-dive"
      },
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.6.19",
    "version": "v0.17.0",
    "codename": "Reach Release",
    "date": "2026-06-19",
    "summary": "",
    "highlights": [
      "<strong>Hermes reaches iMessage \u2014 Photon Spectrum, no Mac relay required</strong> \u2014 There's now an iMessage platform plugin built on Photon's managed line pool. Run `hermes photon login`, authenticate with a device code, and Hermes can send and receive iMessage \u2014 no Mac si\u2026",
      "<strong>Raft \u2014 Hermes joins the Raft agent network as a gateway channel</strong> \u2014 A new bundled Raft platform adapter lets Hermes connect to Raft as an external agent through a wake-channel bridge. Set `RAFT_PROFILE`, run the bridge, and Raft can wake Hermes to handle mes\u2026",
      "<strong>A substantially more capable desktop app</strong> \u2014 v0.16.0 shipped the desktop app; v0.17.0 deepened it across dozens of PRs. Rebindable keyboard shortcuts, native OS notifications with per-type toggles, live subagent <strong>watch-windows</strong> that stream a delegated agen\u2026",
      "<strong>Background / async subagents \u2014 delegate work and keep going</strong> \u2014 `delegate_task(background=true)` now dispatches a subagent that runs in the background and returns a handle immediately. You and the model keep working while it churns, and the full result re-en\u2026",
      "<strong>Edit images, not just generate them \u2014 image-to-image in `image_generate`</strong> \u2014 `image_generate` can now edit and transform a source image, not only create one from scratch. Pass an existing image and a prompt and it routes to the backend's edit endpoint (same \u2026"
    ],
    "prs": "800",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.6.19",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.6.5...v2026.6.19",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      }
    ]
  },
  {
    "tag": "v2026.6.5",
    "version": "v0.16.0",
    "codename": "Surface Release",
    "date": "2026-06-06",
    "summary": "",
    "highlights": [
      "<strong>Hermes Desktop \u2014 a real native app, not a terminal wrapper</strong> \u2014 This is the headline. There's now a `apps/desktop/` Electron application that installs like any other desktop app on macOS, Linux, and Windows, updates itself in place from inside the app, and gi\u2026",
      "<strong>Run the desktop app against a remote Hermes \u2014 sign in with OAuth or username/password</strong> \u2014 The desktop app doesn't have to run Hermes locally. Point it at a remote Hermes gateway (your homelab, a hosted box, a teammate's server) and it connects over a secure \u2026",
      "<strong>The web dashboard is now a full admin panel \u2014 configure everything from the browser</strong> \u2014 The dashboard grew from \"view your sessions\" into a complete administration surface. There's a Channels page that sets up every gateway messaging platform (Telegram, Disc\u2026",
      "<strong>Hermes Desktop speaks Simplified Chinese \u2014 full \u7b80\u4f53\u4e2d\u6587 in the chat GUI</strong> \u2014 The desktop app now ships a complete Simplified Chinese (\u7b80\u4f53\u4e2d\u6587) translation across every UI surface \u2014 the chat window itself, sidebar, settings, command center, cron, messaging, profiles\u2026",
      "<strong>Leaner default skill set \u2014 Hermes ships only what you actually need</strong> \u2014 The bundled skill set got a deliberate trim. Skills that were redundant or dead are gone (`spotify` \u2014 superseded by the native Spotify plugin's 7 tools; `linear` \u2014 superseded by `hermes \u2026"
    ],
    "prs": "542",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.6.5",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.5.29.2...v2026.6.5",
    "links": [
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/blog/2026-06-06-hermes-desktop-surface-release/",
        "label": "Desktop deep-dive"
      },
      {
        "url": "/blog/cron-job-patterns-2026/",
        "label": "Cron patterns guide"
      }
    ]
  },
  {
    "tag": "v2026.5.29.2",
    "version": "v0.15.2",
    "codename": "",
    "date": "2026-05-29",
    "summary": "",
    "highlights": [],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.5.29.2",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.5.29...v2026.5.29.2",
    "links": []
  },
  {
    "tag": "v2026.5.29",
    "version": "v0.15.1",
    "codename": "Patch Release",
    "date": "2026-05-29",
    "summary": "",
    "highlights": [
      "<strong>Dashboard 401 reload loop fixed</strong> \u2014 In loopback mode the dashboard's identity probe (`/api/auth/me`) returns 401 by design, but v0.15.0's stale-token reload guard treated every 401 as a rotated session token and full-page-reloaded to pick up a fresh one. Eve\u2026",
      "<strong>Docker dashboard `--insecure` is now an explicit env opt-in, never derived from bind host</strong> \u2014 Previously the Docker entrypoint inferred `--insecure` when the dashboard bound to a non-loopback host. That conflated \"I want LAN access\" with \"I want to disable t\u2026",
      "<strong>MCP bare command resolution under Docker</strong> \u2014 MCP servers configured with bare commands (`npx`, `npm`, `node`) now resolve against `/usr/local/bin` so they actually launch inside the Docker image where those binaries live. v0.15.0 left these failing silently \u2026",
      "<strong>Skills page sidebar / source pills restored</strong> \u2014 A stale `useMemo` dependency in the new dashboard skills page collapsed the source pills and category sidebar to \"All\" only. Fixed; both surfaces now reflect the live catalog state. (#34194)",
      "<strong>Kanban worker can be killed again</strong> \u2014 `SIGTERM` on a kanban worker was being absorbed by an intermediate process and the worker stayed running. Closes #28181. (#34045)"
    ],
    "prs": "21",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.5.29",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.5.28...v2026.5.29",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/skills/",
        "label": "Skill Library"
      }
    ]
  },
  {
    "tag": "v2026.5.28",
    "version": "v0.15.0",
    "codename": "Velocity Release",
    "date": "2026-05-28",
    "summary": "",
    "highlights": [
      "<strong>The Big Refactor \u2014 `run_agent.py` is no longer 16,000 lines</strong> \u2014 The file at the heart of Hermes \u2014 the agent conversation loop \u2014 has been reduced from 16,083 lines to 3,821 (-76%), with the extracted code redistributed across 14 cohesive modules under `agent/\u2026",
      "<strong>Kanban grew into a real multi-agent platform \u2014 104 PRs end to end</strong> \u2014 Triage auto-decomposes one task into a tree of sub-tasks. `hermes kanban swarm` creates a full Swarm v1 graph in one command \u2014 root, parallel workers, gated verifier, gated synthesizer, sh\u2026",
      "<strong>Cold-start perf wave keeps going \u2014 another second saved, 47% fewer per-turn function calls</strong> \u2014 Three new optimization rounds: defer `openai._base_client` import (-240ms / -17MB on every CLI invocation), hot-path optimizations cut 47% of per-conversation func\u2026",
      "<strong>`session_search` rebuilt \u2014 no LLM, no cost, 4,500\u00d7 faster</strong> \u2014 The old `session_search` was an aux-LLM-powered tool that cost ~$0.30/call and took ~30 seconds to summarize three sessions, sometimes confabulating when the right session wasn't even in the FTS5 \u2026",
      "<strong>Promptware defense \u2014 Brainworm-class attacks blocked at three chokepoints</strong> \u2014 Inspired by recent Brainworm / Promptware Kill Chain research (Origin HQ, arxiv 2601.09625), Hermes now defends the context window against prompt-injection attacks that try to hija\u2026"
    ],
    "prs": "747",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.5.28",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.5.16...v2026.5.28",
    "links": []
  },
  {
    "tag": "v2026.5.16",
    "version": "v0.14.0",
    "codename": "",
    "date": "2026-05-16",
    "summary": "",
    "highlights": [
      "<strong>xAI Grok via SuperGrok OAuth \u2014 and grok-4.3 jumps to a 1M context window</strong> \u2014 If you pay for SuperGrok, you can now use Grok inside Hermes by signing in with your xAI account \u2014 no API key, no separate billing. The wire-through also bumps grok-4.3 to a 1M toke\u2026",
      "<strong>OpenAI-compatible local proxy for OAuth providers</strong> \u2014 Run `hermes proxy` and you get a `http://localhost:port` endpoint that speaks the OpenAI API but is backed by whichever OAuth provider you're signed into \u2014 Claude Pro, ChatGPT Pro, SuperGrok. Now any tool\u2026",
      "<strong>`x_search` \u2014 first-class X (Twitter) search tool</strong> \u2014 The agent can now search X directly without installing a skill or wiring up a custom integration. Search the timeline, find threads, surface specific posts \u2014 straight from the chat. Auth with either your X\u2026",
      "<strong>Microsoft Teams \u2014 end-to-end</strong> \u2014 Hermes can now read messages from Teams and post back. The full Microsoft Graph stack lands together: auth + client foundation, a webhook listener that receives Teams events, a pipeline plugin runtime, and outbound delivery. \u2026",
      "<strong>Debloating wave \u2014 lighter installs, less you don't use</strong> \u2014 A clean `pip install hermes-agent` used to pull down everything: every messaging adapter SDK, every image-gen SDK, every voice/TTS provider, whether you used them or not. Now those heavy backends (Sl\u2026"
    ],
    "prs": "633",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.5.16",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.5.7...v2026.5.16",
    "links": [
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.5.7",
    "version": "v0.13.0",
    "codename": "",
    "date": "2026-05-07",
    "summary": "",
    "highlights": [
      "<strong>Multi-agent Kanban \u2014 delegate to an AI team that actually finishes</strong> \u2014 Spin up a durable board, drop tasks on it, and let multiple Hermes workers pick them up, hand off, and close them out. Heartbeats, reclaim, zombie detection, retry budgets, and a hallucin\u2026",
      "<strong>`/goal` \u2014 the agent doesn't forget what you asked it to do</strong> \u2014 Lock the agent onto a target and it stays on task across turns. The Ralph loop as a first-class primitive. (#18262, #18275, #21287)",
      "<strong>Show it a video</strong> \u2014 new `video_analyze` tool for native video understanding on Gemini and compatible multimodal models. (@alt-glitch) (#19301)",
      "<strong>Clone a voice</strong> \u2014 xAI Custom Voices lands as a TTS provider with voice cloning support. (@alt-glitch) (#18776)",
      "<strong>Hermes speaks your language</strong> \u2014 static gateway + CLI messages translate to 7 locales: Chinese, Japanese, German, Spanish, French, Ukrainian, and Turkish. Docs site gains a Chinese (zh-Hans) locale. (#20231, #20329, #20467, #20474, #20430, #20431)"
    ],
    "prs": "588",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.5.7",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.4.30...v2026.5.7",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.4.30",
    "version": "v0.12.0",
    "codename": "",
    "date": "2026-04-30",
    "summary": "",
    "highlights": [
      "<strong>Autonomous Curator</strong> \u2014 `hermes curator` runs as a background agent on the gateway's cron ticker (7-day cycle default). It grades your skill library, consolidates related skills, prunes dead ones, and writes per-run reports to `logs/curator/run.json` + `REPOR\u2026",
      "<strong>Self-improvement loop \u2014 substantially upgraded</strong> \u2014 The background review fork (the core of Hermes' self-improvement: after each turn it decides what memories/skills to save or update) is now class-first (rubric-based rather than free-form), active-update bia\u2026",
      "<strong>Skill integrations \u2014 major expansion</strong> \u2014 <strong>ComfyUI v5</strong> with official CLI + REST + hardware-gated local install, moved from optional to <strong>built-in by default</strong> (#17610, #17631, #17734). <strong>TouchDesigner-MCP</strong> bundled by default, expanded with GLSL, post-FX, a\u2026",
      "<strong>LM Studio \u2014 first-class provider</strong> \u2014 upgraded from a custom-endpoint alias to a full-blown native provider: dedicated auth, `hermes doctor` checks, reasoning transport, live `/models` listing. (Salvage of @kshitijk4poor's #17061.) (#17102)",
      "<strong>Four more new inference providers</strong> \u2014 <strong>GMI Cloud</strong> (first-class, salvage of #11955 \u2014 @isaachuangGMICLOUD), <strong>Azure AI Foundry</strong> with auto-detection, <strong>MiniMax OAuth</strong> with PKCE browser flow (salvage #15203), <strong>Tencent Tokenhub</strong> (salvage of #16860). (#16663\u2026"
    ],
    "prs": "550",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.30",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.4.23...v2026.4.30",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.4.23",
    "version": "v0.11.0",
    "codename": "",
    "date": "2026-04-23",
    "summary": "",
    "highlights": [
      "<strong>New Ink-based TUI</strong> \u2014 `hermes --tui` is now a full React/Ink rewrite of the interactive CLI, with a Python JSON-RPC backend (`tui_gateway`). Sticky composer, live streaming with OSC-52 clipboard support, stable picker keys, status bar with per-turn stopwatch\u2026",
      "<strong>Transport ABC + Native AWS Bedrock</strong> \u2014 Format conversion and HTTP transport were extracted from `run_agent.py` into a pluggable `agent/transports/` layer. `AnthropicTransport`, `ChatCompletionsTransport`, `ResponsesApiTransport`, and `BedrockTransport` each \u2026",
      "<strong>Five new inference paths</strong> \u2014 Native NVIDIA NIM (#11774), Arcee AI (#9276), Step Plan (#13893), Google Gemini CLI OAuth (#11270), and Vercel ai-gateway with pricing + dynamic discovery (#13223 \u2014 @jerilynzheng). Plus Gemini routed through the native AI Studio \u2026",
      "<strong>GPT-5.5 over Codex OAuth</strong> \u2014 OpenAI's new GPT-5.5 reasoning model is now available through your ChatGPT Codex OAuth, with live model discovery wired into the model picker so new OpenAI releases show up without catalog updates. (#14720)",
      "<strong>QQBot \u2014 17th supported platform</strong> \u2014 Native QQBot adapter via QQ Official API v2, with QR scan-to-configure setup wizard, streaming cursor, emoji reactions, and DM/group policy gating that matches WeCom/Weixin parity. (#9364, #11831)"
    ],
    "prs": "761",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.23",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.4.13...v2026.4.23",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      }
    ]
  },
  {
    "tag": "v2026.4.16",
    "version": "v0.10.0",
    "codename": "",
    "date": "2026-04-16",
    "summary": "",
    "highlights": [
      "<strong>Nous Tool Gateway</strong> \u2014 Paid Nous Portal subscribers now get automatic access to <strong>web search</strong> (Firecrawl), <strong>image generation</strong> (FAL / FLUX 2 Pro), <strong>text-to-speech</strong> (OpenAI TTS), and <strong>browser automation</strong> (Browser Use) through their existing subscription.\u2026"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.16",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.4.13...v2026.4.16",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      }
    ]
  },
  {
    "tag": "v2026.4.13",
    "version": "v0.9.0",
    "codename": "",
    "date": "2026-04-13",
    "summary": "",
    "highlights": [
      "<strong>Local Web Dashboard</strong> \u2014 A new browser-based dashboard for managing your Hermes Agent locally. Configure settings, monitor sessions, browse skills, and manage your gateway \u2014 all from a clean web interface without touching config files or the terminal. The eas\u2026",
      "<strong>Fast Mode (`/fast`)</strong> \u2014 Priority processing for OpenAI and Anthropic models. Toggle `/fast` to route through priority queues for significantly lower latency on supported models (GPT-5.4, Codex, Claude). Expands across all OpenAI Priority Processing models an\u2026",
      "<strong>iMessage via BlueBubbles</strong> \u2014 Full iMessage integration through BlueBubbles, bringing Hermes to Apple's messaging ecosystem. Auto-webhook registration, setup wizard integration, and crash resilience. (#6437, #6460, #6494)",
      "<strong>WeChat (Weixin) & WeCom Callback Mode</strong> \u2014 Native WeChat support via iLink Bot API and a new WeCom callback-mode adapter for self-built enterprise apps. Streaming cursor, media uploads, markdown link handling, and atomic state persistence. Hermes now covers t\u2026",
      "<strong>Termux / Android Support</strong> \u2014 Run Hermes natively on Android via Termux. Adapted install paths, TUI optimizations for mobile screens, voice backend support, and the `/image` command work on-device. (#6834)"
    ],
    "prs": "269",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.13",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.4.8...v2026.4.13",
    "links": [
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      }
    ]
  },
  {
    "tag": "v2026.4.8",
    "version": "v0.8.0",
    "codename": "",
    "date": "2026-04-08",
    "summary": "",
    "highlights": [
      "<strong>Background Process Auto-Notifications (`notify_on_complete`)</strong> \u2014 Background tasks can now automatically notify the agent when they finish. Start a long-running process (AI model training, test suites, deployments, builds) and the agent gets notified on compl\u2026",
      "<strong>Free Xiaomi MiMo v2 Pro on Nous Portal</strong> \u2014 Nous Portal now supports the free-tier Xiaomi MiMo v2 Pro model for auxiliary tasks (compression, vision, summarization), with free-tier model gating and pricing display in model selection. (#6018, #5880)",
      "<strong>Live Model Switching (`/model` Command)</strong> \u2014 Switch models and providers mid-session from CLI, Telegram, Discord, Slack, or any gateway platform. Aggregator-aware resolution keeps you on OpenRouter/Nous when possible, with automatic cross-provider fallback wh\u2026",
      "<strong>Self-Optimized GPT/Codex Tool-Use Guidance</strong> \u2014 The agent diagnosed and patched 5 failure modes in GPT and Codex tool calling through automated behavioral benchmarking, dramatically improving reliability on OpenAI models. Includes execution discipline guidanc\u2026",
      "<strong>Google AI Studio (Gemini) Native Provider</strong> \u2014 Direct access to Gemini models through Google's AI Studio API. Includes automatic models.dev registry integration for real-time context length detection across any provider. (#5577)"
    ],
    "prs": "209",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.8",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.4.3...v2026.4.8",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.4.3",
    "version": "v0.7.0",
    "codename": "",
    "date": "2026-04-03",
    "summary": "",
    "highlights": [
      "<strong>Pluggable Memory Provider Interface</strong> \u2014 Memory is now an extensible plugin system. Third-party memory backends (Honcho, vector stores, custom DBs) implement a simple provider ABC and register via the plugin system. Built-in memory is the default provider. Ho\u2026",
      "<strong>Same-Provider Credential Pools</strong> \u2014 Configure multiple API keys for the same provider with automatic rotation. Thread-safe `least_used` strategy distributes load across keys, and 401 failures trigger automatic rotation to the next credential. Set up via the s\u2026",
      "<strong>Camofox Anti-Detection Browser Backend</strong> \u2014 New local browser backend using Camoufox for stealth browsing. Persistent sessions with VNC URL discovery for visual debugging, configurable SSRF bypass for local backends, auto-install via `hermes tools`. (#4008, #\u2026",
      "<strong>Inline Diff Previews</strong> \u2014 File write and patch operations now show inline diffs in the tool activity feed, giving you visual confirmation of what changed before the agent moves on. (#4411, #4423)",
      "<strong>API Server Session Continuity & Tool Streaming</strong> \u2014 The API server (Open WebUI integration) now streams tool progress events in real-time and supports `X-Hermes-Session-Id` headers for persistent sessions across requests. Sessions persist to the shared Sessio\u2026"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.4.3",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.3.30...v2026.4.3",
    "links": [
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.3.30",
    "version": "v0.6.0",
    "codename": "",
    "date": "2026-03-30",
    "summary": "",
    "highlights": [
      "<strong>Profiles \u2014 Multi-Instance Hermes</strong> \u2014 Run multiple isolated Hermes instances from the same installation. Each profile gets its own config, memory, sessions, skills, and gateway service. Create with `hermes profile create`, switch with `hermes -p <name>`, expo\u2026",
      "<strong>MCP Server Mode</strong> \u2014 Expose Hermes conversations and sessions to any MCP-compatible client (Claude Desktop, Cursor, VS Code, etc.) via `hermes mcp serve`. Browse conversations, read messages, search across sessions, and manage attachments \u2014 all through the Mo\u2026",
      "<strong>Docker Container</strong> \u2014 Official Dockerfile for running Hermes Agent in a container. Supports both CLI and gateway modes with volume-mounted config. (#3668, closes #850)",
      "<strong>Ordered Fallback Provider Chain</strong> \u2014 Configure multiple inference providers with automatic failover. When your primary provider returns errors or is unreachable, Hermes automatically tries the next provider in the chain. Configure via `fallback_providers` in \u2026",
      "<strong>Feishu/Lark Platform Support</strong> \u2014 Full gateway adapter for Feishu (\u98de\u4e66) and Lark with event subscriptions, message cards, group chat, image/file attachments, and interactive card callbacks. (#3799, #3817, closes #1788)"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.30",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.3.28...v2026.3.30",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.3.28",
    "version": "v0.5.0",
    "codename": "",
    "date": "2026-03-28",
    "summary": "",
    "highlights": [
      "<strong>Nous Portal now supports 400+ models</strong> \u2014 The Nous Research inference portal has expanded dramatically, giving Hermes Agent users access to over 400 models through a single provider endpoint",
      "<strong>Hugging Face as a first-class inference provider</strong> \u2014 Full integration with HF Inference API including curated agentic model picker that maps to OpenRouter analogues, live `/models` endpoint probe, and setup wizard flow (#3419, #3440)",
      "<strong>Telegram Private Chat Topics</strong> \u2014 Project-based conversations with functional skill binding per topic, enabling isolated workflows within a single Telegram chat (#3163)",
      "<strong>Native Modal SDK backend</strong> \u2014 Replaced swe-rex dependency with native Modal SDK (`Sandbox.create.aio` + `exec.aio`), eliminating tunnels and simplifying the Modal terminal backend (#3538)",
      "<strong>Plugin lifecycle hooks activated</strong> \u2014 `pre_llm_call`, `post_llm_call`, `on_session_start`, and `on_session_end` hooks now fire in the agent loop and CLI/gateway, completing the plugin hook system (#3542)"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.28",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.3.23...v2026.3.28",
    "links": [
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.3.23",
    "version": "v0.4.0",
    "codename": "",
    "date": "2026-03-24",
    "summary": "",
    "highlights": [
      "<strong>OpenAI-compatible API server</strong> \u2014 Expose Hermes as an `/v1/chat/completions` endpoint with a new `/api/jobs` REST API for cron job management, hardened with input limits, field whitelists, SQLite-backed response persistence, and CORS origin protection (#1756,\u2026",
      "<strong>6 new messaging platform adapters</strong> \u2014 Signal, DingTalk, SMS (Twilio), Mattermost, Matrix, and Webhook adapters join Telegram, Discord, and WhatsApp. Gateway auto-reconnects failed platforms with exponential backoff (#2206, #1685, #1688, #1683, #2166, #2584)",
      "<strong>@ context references</strong> \u2014 Claude Code-style `@file` and `@url` context injection with tab completions in the CLI (#2343, #2482)",
      "<strong>4 new inference providers</strong> \u2014 GitHub Copilot (OAuth + token validation), Alibaba Cloud / DashScope, Kilo Code, and OpenCode Zen/Go (#1924, #1879 by @mchzimm, #1673, #1666, #1650)",
      "<strong>MCP server management CLI</strong> \u2014 `hermes mcp` commands for installing, configuring, and authenticating MCP servers with full OAuth 2.1 PKCE flow (#2465)"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.23",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.3.17...v2026.3.23",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      },
      {
        "url": "/blog/cron-job-patterns-2026/",
        "label": "Cron patterns guide"
      }
    ]
  },
  {
    "tag": "v2026.3.17",
    "version": "v0.3.0",
    "codename": "",
    "date": "2026-03-17",
    "summary": "",
    "highlights": [
      "<strong>Unified Streaming Infrastructure</strong> \u2014 Real-time token-by-token delivery in CLI and all gateway platforms. Responses stream as they're generated instead of arriving as a block. (#1538)",
      "<strong>First-Class Plugin Architecture</strong> \u2014 Drop Python files into `~/.hermes/plugins/` to extend Hermes with custom tools, commands, and hooks. No forking required. (#1544, #1555)",
      "<strong>Native Anthropic Provider</strong> \u2014 Direct Anthropic API calls with Claude Code credential auto-discovery, OAuth PKCE flows, and native prompt caching. No OpenRouter middleman needed. (#1097)",
      "<strong>Smart Approvals + /stop Command</strong> \u2014 Codex-inspired approval system that learns which commands are safe and remembers your preferences. `/stop` kills the current agent run immediately. (#1543)",
      "<strong>Honcho Memory Integration</strong> \u2014 Async memory writes, configurable recall modes, session title integration, and multi-user isolation in gateway mode. By @erosika. (#736)"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.17",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v2026.3.12...v2026.3.17",
    "links": [
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  },
  {
    "tag": "v2026.3.12",
    "version": "v0.2.0",
    "codename": "",
    "date": "2026-03-12",
    "summary": "",
    "highlights": [
      "<strong>Multi-Platform Messaging Gateway</strong> \u2014 Telegram, Discord, Slack, WhatsApp, Signal, Email (IMAP/SMTP), and Home Assistant platforms with unified session management, media attachments, and per-platform tool configuration.",
      "<strong>MCP (Model Context Protocol) Client</strong> \u2014 Native MCP support with stdio and HTTP transports, reconnection, resource/prompt discovery, and sampling (server-initiated LLM requests). (#291 \u2014 @0xbyt4, #301, #753)",
      "<strong>Skills Ecosystem</strong> \u2014 70+ bundled and optional skills across 15+ categories with a Skills Hub for community discovery, per-platform enable/disable, conditional activation based on tool availability, and prerequisite validation. (#743 \u2014 @teyrebaz33, #785 \u2014 @te\u2026",
      "<strong>Centralized Provider Router</strong> \u2014 Unified `call_llm()`/`async_call_llm()` API replaces scattered provider logic across vision, summarization, compression, and trajectory saving. All auxiliary consumers route through a single code path with automatic credential\u2026",
      "<strong>ACP Server</strong> \u2014 VS Code, Zed, and JetBrains editor integration via the Agent Communication Protocol standard. (#949)"
    ],
    "prs": "",
    "url": "https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.12",
    "compare": "https://github.com/NousResearch/hermes-agent/compare/v0.1.0...v2026.3.12",
    "links": [
      {
        "url": "/tools/",
        "label": "Tools Reference"
      },
      {
        "url": "/skills/",
        "label": "Skill Library"
      },
      {
        "url": "/gateway/",
        "label": "Gateway Guide"
      },
      {
        "url": "/providers/",
        "label": "Providers Reference"
      }
    ]
  }
];
