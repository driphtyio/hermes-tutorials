---
title: "Hermes Agent v0.21.6: Dashboard Auth, Git Filter and Email Sender Fixes"
description: "A practical operator guide to Hermes Agent v0.21.6: dashboard auth hardening, git filter lockdown, and the email sender fix, with an update checklist."
pubDate: 2026-10-11
tags: [release notes, Hermes Agent, security, updates]
lastVerified: 2026-10-11
---
## Update now: operator checklist

- [ ] **Docker:** Move the Hermes Agent image to `nousresearch/hermes-agent:stable` or `nousresearch/hermes-agent:latest`. This release also ships to Hermes Cloud.
- [ ] **CLI git install:** Update with `hermes update`, or re-run the installer one-liner.
- [ ] **Desktop and Termux:** No action for this release; those apps update with the next bundled release.
- [ ] **Verify each security fix:** Check the deployed version and the relevant proxy, repository, or email-gateway setup using the steps below.
- [ ] **Keep scope clear:** The full curated notes are planned for v0.22.0; that release had not shipped when v0.21.6 was published.

Hermes Agent v0.21.6 is a patch release published on 2026-10-08. The release record describes a large rollup since v2026.9.24 (v0.21.5), with operator-relevant changes concentrated in dashboard authentication, Git filter handling, and email sender validation. This guide focuses on those changes and what operators can check now; it does not repeat coverage of v0.21.1–v0.21.5, which is available in the [earlier release-line coverage](/blog/2026-10-02-hermes-v021x-release-line/).

The primary records are the [v0.21.6 release page](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) and its [comparison with v2026.9.24](https://github.com/NousResearch/hermes-agent/compare/v2026.9.24...v0.21.6). The release reports **“8,867 non-merge commits, 8,342 changed files, 2,106 merged PRs, 3,027 closed issues.”** That scale is context, not a reason to assume every deployment path changes in the same way.

## What changes for each update channel

The release identifies where v0.21.6 is available and where it is not. In particular, do not infer that an updated server means a bundled desktop or Termux app has also changed.

| Channel | v0.21.6 coverage | Operator action |
|---|---|---|
| Docker | Ships to `nousresearch/hermes-agent:stable` or `:latest` | Pull or deploy the applicable image tag. |
| Hermes Cloud | Ships to Hermes Cloud | Confirm the service is on the release; follow the applicable Cloud update process. |
| CLI git install | Update path is `hermes update` or re-running the installer one-liner | Use one of those listed update methods, then check the installed version. |
| Desktop app | No change in this release | Wait for the next bundled release. |
| Termux | No change in this release | Wait for the next bundled release. |

For the exact release scope, consult the [release record’s channel notes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) alongside the [v2026.9.24 comparison](https://github.com/NousResearch/hermes-agent/compare/v2026.9.24...v0.21.6). Those records are the basis for the distinctions in the table; no additional update mechanism is assumed here.

## Dashboard authentication: address the request-boundary fixes

The dashboard changes respond to four reported authentication weaknesses. A spoofed `X-Forwarded-For` value could reset the password-login rate limit and bypass the per-IP cap on native sign-in ([#133367](https://github.com/NousResearch/hermes-agent/pull/133367)). Unauthenticated login requests could write unbounded values to the authentication audit log ([#133369](https://github.com/NousResearch/hermes-agent/pull/133369)), and public `/auth/` routes had no request-body size limit ([#133370](https://github.com/NousResearch/hermes-agent/pull/133370)). Separately, native sign-in could send login codes to a non-loopback redirect, enabling session takeover ([#130685](https://github.com/NousResearch/hermes-agent/pull/130685)).

The release attributes the redirect issue to a report also made independently and fixed by @Froraut. The forwarded-address fix builds on community work by @hinotoi-agent and @BearHuddleston ([#40285](https://github.com/NousResearch/hermes-agent/pull/40285)). These are specific boundaries to pay attention to: the origin of client-address information, the amount of unauthenticated data accepted, and where a sign-in code can be sent. The [release entry for the authentication fixes](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) and the [tag comparison](https://github.com/NousResearch/hermes-agent/compare/v2026.9.24...v0.21.6) provide the source record.

### Dashboard verification

1. **Check the deployed build.** Confirm the dashboard’s Hermes Agent deployment is at v0.21.6. Use the version information available in your deployment or its release metadata; this guide does not prescribe an unlisted version-check command.
2. **Review proxy handling.** Check whether the proxy in front of the dashboard supplies `X-Forwarded-For` from a trusted proxy path rather than allowing arbitrary client-supplied values to determine it. The release identifies spoofed forwarded addresses as the issue, but does not provide a deployment-specific proxy recipe.
3. **Keep verification scoped to the release.** Confirm that the deployed build includes the v0.21.6 authentication fixes. The release record does not specify a particular test procedure or dashboard configuration key, so do not treat an invented setting or ad hoc test as proof of the fix.

## Git filters: keep untrusted repository configuration from running early

The Git hardening concerns automatic Git calls made by Hermes, including session workspace snapshots, subagent worktrees, Kanban, worktree cleanup, and `hermes -w`. Before the fix, those calls could run `clean`, `smudge`, or `process` filter programs defined by an untrusted repository’s own configuration before the first prompt.

That timing matters for operators who open or process repositories they do not trust: the risk described is not limited to an intentional Git operation after a conversation begins. It involves automatic calls that can occur earlier. The release lists this hardening as [#130661](https://github.com/NousResearch/hermes-agent/pull/130661). The report was private from 燕涛; related public fixes were [#126017](https://github.com/NousResearch/hermes-agent/pull/126017) and [#126019](https://github.com/NousResearch/hermes-agent/pull/126019) by @jonpol01 and [#126075](https://github.com/NousResearch/hermes-agent/pull/126075) by @JoaoMarcos44. See the [release record](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) and [comparison view](https://github.com/NousResearch/hermes-agent/compare/v2026.9.24...v0.21.6) for the recorded change.

### Git-filter verification

1. **Check the installed build.** Confirm that the Hermes Agent CLI responsible for the automatic Git calls is at v0.21.6. For a CLI git installation, update using `hermes update` or re-run the installer one-liner, then check the installed version through your existing deployment or installation metadata.
2. **Check the repository boundary.** When reviewing an untrusted repository, inspect its Git configuration for filter definitions and treat those definitions as untrusted input. The release identifies repository-defined filters as the source of the pre-prompt execution risk; checking the version is the key way to confirm the released fix is present.
3. **Do not infer protection from a separate app update.** Desktop and Termux have no change in v0.21.6, so their bundled versions do not verify this release’s CLI Git hardening.

## Email gateway: validate the sender, not just its display name

The email gateway fix addresses a quoted display name in the `From` header that could make an attacker’s message pass the email allowlist. This is sender-validation hardening, not a broader change to email features described by the release. The fix is [#125212](https://github.com/NousResearch/hermes-agent/pull/125212), recorded as fixed in [#124322](https://github.com/NousResearch/hermes-agent/pull/124322) by Daniel Steele (@keeltrace). The [release page](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) and [comparison view](https://github.com/NousResearch/hermes-agent/compare/v2026.9.24...v0.21.6) are the primary references for the change.

### Email-sender verification

1. **Check the gateway’s Hermes Agent version.** Confirm the component handling inbound email is running v0.21.6.
2. **Review the existing allowlist.** Check that its entries represent the sender identities your policy intends to allow, rather than relying on a display name alone. The release record does not specify a configuration key or prescribe an allowlist format.
3. **Keep the check separate from dashboard and Git checks.** A dashboard or CLI update does not establish that the email gateway has been updated; verify the deployed gateway component itself.

## Before and after: the operator-relevant behavior

This table summarizes the behavior described in the release record. “After” refers to the fix in v0.21.6; it is not a claim that this guide independently tested the behavior.

| Area | Before v0.21.6 | After v0.21.6 |
|---|---|---|
| Dashboard rate limit | Spoofed `X-Forwarded-For` could reset the password-login rate limit and bypass the per-IP cap on native sign-in. | The release includes a fix for the spoofed forwarded-address issue. |
| Native sign-in redirect | Login codes could be sent to a non-loopback redirect, enabling session takeover. | The release includes a fix for the non-loopback redirect issue. |
| Repository Git filters | Automatic Git calls could run filter programs from an untrusted repository’s configuration before the first prompt. | The release includes Git filter hardening for those automatic calls. |
| Email allowlist | A quoted display name in `From` could make an attacker’s message pass the allowlist. | The release includes the email sender-hardening fix. |

The table is deliberately limited to the reported before-and-after behavior. It does not claim details about implementation, tests, or configuration options that are not stated in the [release record](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6).

## Other items: names only, details pending

The release lists additional items without the full curated notes. Treat these as **listed in the release, details pending v0.22.0**: `stt.streaming`, `auxiliary.voice_chat`, `plugins.isolation: host`, `hermes status --short/--full`, a unified Kanban workflow definition, GPT-6.1 Sol and Claude Sonnet 5.5 / Haiku 5.5 in catalogs, and `activate.fish`.

The full curated notes ship with v0.22.0, which had not been released at the time of writing. These names are included to mark the release’s scope, not to describe capabilities or recommend a configuration change. Consult the [v0.21.6 release page](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) for the release record; do not treat the pending notes as already available.

## FAQ

### Does `:stable` or `:latest` include v0.21.6?

The release says v0.21.6 ships to `nousresearch/hermes-agent:stable` or `:latest`. Confirm the image actually deployed in your environment rather than assuming a running deployment has refreshed.

### Should Desktop and Termux users update now?

There is no Desktop or Termux change in this release. Those apps update with the next bundled release, so v0.21.6 does not provide a separate app update for them.

### What should CLI git-install users run?

The release lists `hermes update` or re-running the installer one-liner. Afterward, verify the installed version using the version information available in your environment.

### Are the additional feature details available in this release?

Only the names listed above are included here. The full curated notes ship with v0.22.0; they were not available at the time of writing. See the [release record](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) rather than inferring feature behavior from names.

## The Bottom Line

For operators, the immediate task is to update the affected deployment paths and verify them separately. The dashboard fixes address forwarded-address rate-limit handling, authentication request limits, and the non-loopback login-code redirect. The Git fix addresses repository-defined filter programs running during automatic calls before the first prompt. The email change addresses quoted display names bypassing the sender allowlist.

Prioritize the component that handles each surface: dashboard, CLI/workspace Git operations, and email gateway. Docker `:stable`/`:latest` and Hermes Cloud receive the release; CLI git installs have the stated update paths; Desktop and Termux do not change this time. For exact scope, use the [release record](https://github.com/NousResearch/hermes-agent/releases/tag/v0.21.6) and [comparison from v2026.9.24](https://github.com/NousResearch/hermes-agent/compare/v2026.9.24...v0.21.6), not assumptions based on the size of the rollup.

## How This Guide Was Built

This post rests on the v0.21.6 release record and its comparison view, which are the primary sources for the update channels, reported fixes, issue and pull-request identifiers, and deferred-note status. It includes no hands-on testing of v0.21.6, and makes no claims that the fixes were independently reproduced or benchmarked.

Credits, exactly as recorded: Tenable Research (TRA-725..728), 燕涛, @jonpol01, @JoaoMarcos44, Daniel Steele (@keeltrace), @Froraut, @hinotoi-agent, @BearHuddleston.

<!-- crosslinks -->

## 📖 Related Reads

- **[ToolBrain](https://toolbrain.net/)** — tool reviews, LLM comparisons, and AI workflow guides
- **[CodeIntel Log](https://codeintel.xyz/)** — code quality, debugging, and software engineering benchmarks

*Cross-links automatically generated from Hermes Tutorials.*
