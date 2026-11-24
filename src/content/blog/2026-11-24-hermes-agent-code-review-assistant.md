---
title: "Hermes Agent as a Code Review Assistant: PR Analysis and Automated Checks (2026)"
description: "Use Hermes Agent to assemble a PR review chain with gh, linters, and skills, with clear governance around approvals."
pubDate: 2026-11-24
heroImage: "https://pub-0066f5275194430aa9f985cb23278abe.r2.dev/hermes-agent-code-review-assistant-1795537618.webp"
tags: ["use-case", "code-review", "github", "hermes-agent", "automation"]
author: "Hermes Agent"
keywords:
  - Hermes Agent code review
  - GitHub CLI PR review
  - gh pr review
  - pre-commit
  - Semgrep
  - Danger JS
  - AI code review workflow
lastVerified: "2026-11-24"
---

## Can Hermes Review Your Pull Requests?

[Hermes Agent](https://hermes-agent.nousresearch.com/docs) is documented as an autonomous agent, not an IDE copilot. It can run on a "$5 VPS", GPU cluster, or serverless platforms such as Daytona and Modal. It ships with a terminal, a tool registry, and a skills system, but the documentation does not establish a native code-review feature, a built-in review skill, or any review benchmark.

That boundary matters. This guide does not treat Hermes as a drop-in review bot. Instead, it shows how to assemble a review chain from documented building blocks: the GitHub CLI for PR context and submission, deterministic linters for repeatable checks, Hermes [skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills) for reusable instructions, and Hermes [tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) for execution. Where the documentation does not establish a capability, this article says so plainly.

The result is a composable workflow you control. It is useful when you want review steps that match your repository's standards, but it is not the same as a hosted product that ships severity labels, queue triage, or sandboxed app testing out of the box.

## Prerequisites and One-Time Setup

Before you build the chain, install Hermes and confirm you have GitHub CLI access to the repository you want to review.

On Linux, macOS, or WSL2, run this in your terminal:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

On Windows, run this in your terminal:

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

After installation, run the portal setup:

```bash
hermes setup --portal
```

The documented setup flow uses one OAuth to cover a model plus all four Tool Gateway tools: web search, image generation, TTS, and browser.

Next, choose the toolsets you want available in a chat session and inspect the configured tools:

```bash
hermes chat --toolsets "web,terminal"
hermes tools
```

For the review workflow in this guide, the relevant Hermes tools are `terminal`, `read_file`, `patch`, `execute_code`, `delegate_task`, `todo`, and `cronjob`. Hermes can also select toolsets at launch, and its terminal backends include `local`, `docker`, `ssh`, `singularity` (plugin), `sprites` (plugin), `modal`, `daytona`, and `vercel_sandbox`.

You also need the [GitHub CLI](https://cli.github.com/manual/gh_pr_review) installed and authenticated in your environment. The `gh` commands below are the interface Hermes can use through the `terminal` tool to inspect and review pull requests.

## Step 1: Pull the PR Context With gh

A useful review starts with real PR data. Before asking Hermes to draft comments, pull the PR metadata, diff, and CI state so the agent reasons over CLI output instead of assumptions.

### Read the PR's metadata with gh pr view

Use [`gh pr view`](https://cli.github.com/manual/gh_pr_view) to display the title, body, and other information about a pull request. Without an argument, it selects the PR for the current branch.

```bash
gh pr view 123 --json number,title,state,isDraft,additions,deletions,changedFiles,reviewDecision,statusCheckRollup,latestReviews,url
```

The documented JSON fields include `additions`, `changedFiles`, `deletions`, `files`, `isDraft`, `latestReviews`, `mergeStateStatus`, `reviewDecision`, `reviews`, `state`, `statusCheckRollup`, `title`, `url`, `commits`, `labels`, `baseRefName`, and `headRefName`.

Two behavior notes from the documentation are worth keeping in mind. When `--comments` is used, terminal output includes the pull request details, comments, and reviews; when output is piped or redirected, only comments and reviews are printed. The command shows a snapshot. To wait for a pull request on `github.com` to be reviewed, merged, or closed, use `gh event listen` instead of polling.

### Inspect the actual changes with gh pr diff

Use [`gh pr diff`](https://cli.github.com/manual/gh_pr_diff) to view the changes in a pull request. It can show the full diff or just file names, and it supports excluding generated files.

```bash
gh pr diff
gh pr diff 123
gh pr diff --exclude '*.yml' --exclude 'generated/*'
gh pr diff --name-only --exclude '*.generated.*'
```

The documented flags include `--allow-escape-sequences`, `--color <string>` (default `"auto"`), `-e/--exclude <patterns>`, `--name-only`, `--patch`, `-w/--web`, and inherited `-R/--repo <[HOST/]OWNER/REPO>`. The `--exclude` pattern uses forward slashes as path separators on all platforms, and you can repeat the flag to exclude multiple patterns. By default, terminal escape sequences in the diff are neutralized because they could manipulate your terminal. Pass `--allow-escape-sequences` only if you intentionally want the diff printed verbatim.

For large PRs, start with `--name-only`. It gives Hermes a file map before it reads full diffs.

### Check CI state with gh pr checks

Use [`gh pr checks`](https://cli.github.com/manual/gh_pr_checks) to inspect CI status for a single pull request before drafting a review.

```bash
gh pr checks 123
gh pr checks 123 --required
gh pr checks 123 --json name,state,bucket,link
```

The documented JSON fields are `bucket`, `completedAt`, `description`, `event`, `link`, `name`, `startedAt`, `state`, and `workflow`. When the `--json` flag is used, the output includes a `bucket` field that categorizes the `state` field into `pass`, `fail`, `pending`, `skipping`, or `cancel`.

The command also documents additional exit code `8` for checks pending. Flags include `--fail-fast`, `-i/--interval <int>` (default `10`), `-q/--jq`, `--json <fields>`, `--required`, `-t/--template`, `--watch`, and `-w/--web`. If checks are still pending, a review comment can acknowledge that state instead of assuming a green build.

## Step 2: Run the Automated Checks

Deterministic tools should catch mechanical issues before an LLM spends tokens on style, formatting, or known security patterns. Hermes can run these commands through its `terminal` tool, but the tools themselves do the checking.

### pre-commit: catch the trivial stuff before a human sees it

[pre-commit](https://pre-commit.com/) is a hook manager for running checks before commits. Install it, add a configuration, install the Git hook, and run it across the repository:

```bash
pip install pre-commit
pre-commit --version
pre-commit sample-config > .pre-commit-config.yaml
pre-commit install
pre-commit run --all-files
```

The `pre-commit install` command writes `pre-commit installed at .git/hooks/pre-commit`. The configuration file is `.pre-commit-config.yaml`, and `pre-commit sample-config` can generate a basic one. The documentation shows hooks such as `check-yaml`, `end-of-file-fixer`, `trailing-whitespace`, and `id: black`.

Pre-commit usually runs only on changed files during Git hooks, and the docs suggest running it in CI too. The stated goal is to let reviewers focus on architecture rather than trivial style issues. It is useful hygiene, not a substitute for code review.

### Ruff and ESLint: linting inside the chain

[Ruff](https://docs.astral.sh/ruff/) is described as an extremely fast Python linter and code formatter, written in Rust. The documentation states it has over 900 built-in rules, `pyproject.toml` support, built-in caching, fix support, and Python 3.15 compatibility. It also claims "10-100x faster than existing linters (like Flake8)". Treat that speed comparison as a vendor claim, not a controlled benchmark from this dossier.

For JavaScript or TypeScript projects, [ESLint](https://eslint.org/docs/latest/use/getting-started) documents surfaces such as a Command Line Interface Reference, Rules Reference, MCP Server Setup, Bulk Suppressions, and Formatters Reference. The visible text in this dossier does not include an ESLint lint invocation command, so this guide does not invent one. If you use ESLint in your chain, run the command already defined by your project.

### Semgrep: security scanning on demand

[Semgrep](https://semgrep.dev/docs/getting-started/quickstart) provides static analysis through a CLI workflow. The documented quickstart requires Python 3.10 or later and supports installation through `pipx` or `uv`.

```bash
pipx install semgrep
# or
uv tool install semgrep

semgrep --version
semgrep login
semgrep ci
```

For the Docker path, the documentation shows:

```bash
docker pull semgrep/semgrep
docker run -e SEMGREP_APP_TOKEN=YOUR_TOKEN --rm -v "${PWD}:/src" semgrep/semgrep semgrep ci
```

`semgrep ci` requires a Semgrep account and login, and the Docker variant requires passing `SEMGREP_APP_TOKEN`. Semgrep's own AI assistant banner says, "Responses are generated using AI and may contain mistakes." That is a good reminder to treat automated findings as inputs to review, not final authority.

### Danger JS: encode team norms once

[Danger JS](https://danger.systems/js/) runs during your CI process and turns team norms into repeatable rules. The documented setup is straightforward:

```bash
yarn add danger -D
```

Then add `yarn danger ci` to the CI test run. Rules live in a `dangerfile.js` or `dangerfile.ts`, and the documented imports include `message`, `warn`, `fail`, and `markdown`. Danger is useful for rote checks such as missing changelog entries, oversized PRs, or required labels, while Hermes and human reviewers focus on design and correctness.

## Step 3: Have Hermes Analyze the Diff and Draft the Review

Once you have PR metadata, diff context, CI status, and linter output, Hermes can help synthesize the findings. The key is to give it concrete artifacts rather than asking for a vague review.

A practical pattern is to ask Hermes to read the `gh pr view --json` output, inspect the `gh pr diff --name-only` result, and then open only the files that matter. Hermes's `read_file` tool transcodes UTF-16 to UTF-8, but files over 10 MB and genuinely binary files still get the binary-file refusal. For large or binary changes, scope the review with `gh pr diff --name-only` and review relevant text files individually.

You can also use Hermes planning and skills to structure the review. The `/plan [request]` command writes a markdown implementation plan saved under `.hermes/plans/`. Any installed skill is a slash command, for example `/github-pr-workflow create a PR for the auth refactor`. Hermes supports skill stacking: "every leading `/skill` token (up to 5) is loaded". The documentation gives this stacked example:

```text
/github-pr-workflow /test-driven-development fix issue #123 and open a PR
```

That example is a PR-creation example, not a review one. It still illustrates the stacking mechanic you can use when you build your own review workflow. For example, you might combine a local review-standards skill with another workflow skill, as long as the skills you invoke are installed and appropriate for the task.

When you need a fast check of available skills, you can run:

```bash
hermes chat --toolsets skills -q "What skills do you have?"
```

Keep the agent's role clear: Hermes can summarize changes, group findings, and draft comments, but the documentation does not establish defect-detection rates, accuracy figures, or coverage guarantees for AI review.

## Step 4: Submit the Review — and Think Hard About --approve

After drafting comments, submit the review with [`gh pr review`](https://cli.github.com/manual/gh_pr_review). The command synopsis is:

```bash
gh pr review [<number> | <url> | <branch>] [flags]
```

The documented flags include `-a`, `--approve`; `-b`, `--body <string>`; `-F`, `--body-file <file>` (use `-` to read from standard input); `-c`, `--comment`; `-r`, `--request-changes`; and inherited `-R`, `--repo <[HOST/]OWNER/REPO>`. The documented examples are:

```bash
gh pr review --approve
gh pr review --comment -b "interesting"
gh pr review 123
gh pr review 123 -r -b "needs more ASCII art"
```

A comment-only review is often the safest default for an agent-assisted workflow:

```bash
gh pr review 123 --comment -b "Automated checks passed; please confirm the migration rollback path."
```

If you need to request changes, make the reason explicit:

```bash
gh pr review 123 -r -b "Please address the failing Semgrep finding before merge."
```

The `--approve` flag deserves deliberate governance. `gh pr review --approve` creates a real approval. That is different from [GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review), which by default leaves a "Comment" review, not Approve or Request changes, so its reviews do not count toward required approvals. Copilot also labels each comment "High," "Medium," or "Low," and it usually takes less than 30 seconds, but that latency is a qualitative "usually," not a guarantee.

For audit or read-back, the GitHub REST API provides `GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews`, which returns reviews in chronological order. A documented cURL request uses these headers:

```bash
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2026-03-10" \
  https://api.github.com/repos/OWNER/REPO/pulls/PULL_NUMBER/reviews?per_page=30&page=1
```

The `per_page` parameter defaults to `30` with a maximum of `100`, and `page` defaults to `1`. The response can include a review object with `"state": "APPROVED"`. Fine-grained tokens need "Pull requests" repository permissions (read); public resources can be requested unauthenticated. This REST path is useful as a read/audit surface after the CLI submits a review.

## Step 5: Turn the Chain Into a Repeatable Review Skill

A one-off review prompt is fragile. A skill makes the workflow repeatable. Hermes skills live in `~/.hermes/skills/` and are compatible with the agentskills.io open standard.

Use `/learn` to author a skill from sources or from a successful review session. The documented house standards include "≤60-char description, the standard section order, Hermes-tool framing, no invented commands". That last rule is especially important for review workflows: a skill should only instruct Hermes to use commands and flags that your team has verified.

You can install and manage skills from the CLI:

```bash
hermes skills install <identifier>
hermes skills opt-out
hermes skills opt-out --remove
hermes skills opt-in --sync
hermes profile create research --no-skills
```

The `hermes profile create research --no-skills` pattern is a useful isolation option when you want a profile without the default skill set. For large PRs, Hermes can also spawn isolated subagents for parallel workstreams, and `delegate_task` is available as a tool. That can help split work such as "summarize CI failures," "scan changed files," and "draft review comments," but the final submission decision should still be explicit.

## Optional: Schedule a Recurring PR Sweep

If you want a lightweight recurring check, Hermes has built-in cron with delivery to any platform. The `cronjob` tool supports `create`, `list`, `update`, `pause`, `resume`, `run`, and `remove`. You can use it to schedule a recurring PR sweep that runs `gh pr checks` or collects open PRs needing attention, then delivers a summary through Hermes's configured delivery path. Keep this as an extension of the review chain, not a replacement for deliberate human review. For details, see the [Hermes cron documentation](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron).

## Hermes vs. CodeRabbit vs. Copilot Code Review

The right tool depends on what you need: a composable chain you operate, or a hosted review product with packaged behaviors. The table below stays within the documented facts.

| Capability | Hermes agent (CLI + tools) | Hosted bots & dedicated review tools | Source |
|---|---|---|---|
| Submitting a review (approve / comment / request changes) | Yes, via `gh pr review` with `-a`, `-c -b`, `-r -b`. | Yes; Copilot posts reviews but defaults to a "Comment" review that does not count toward required approvals. | [gh pr review](https://cli.github.com/manual/gh_pr_review), [Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review) |
| Severity labels on comments | Not stated in documentation. | Copilot labels each comment High, Medium, or Low. | [Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review) |
| Review-queue triage and reviewer routing | Not stated in documentation; `todo` and `cronjob` are generic planning/automation tools. | CodeRabbit Triage ranks the queue and routes PRs to reviewers. | [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools), [CodeRabbit](https://docs.coderabbit.ai/) |
| Explaining large diffs | `/plan` writes a markdown plan under `.hermes/plans/`. | CodeRabbit Explain groups diffs into logical cohorts and layers with diagrams. | [Hermes skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [CodeRabbit](https://docs.coderabbit.ai/) |
| Testing changes against a running app | Not stated in documentation; Hermes can run commands in `docker`, `ssh`, `modal`, and `daytona` backends. | CodeRabbit Verify tests user journeys in an isolated sandbox with screenshots/recordings. | [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools), [CodeRabbit](https://docs.coderabbit.ai/) |
| Security scanning | No built-in scanner documented; Hermes can invoke `semgrep ci` via `terminal`. | CodeRabbit Secure scans vulnerabilities, leaked secrets, and vulnerable dependencies. | [Semgrep](https://semgrep.dev/docs/getting-started/quickstart), [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools), [CodeRabbit](https://docs.coderabbit.ai/) |
| Running linters/static analysis on demand | Yes — `pre-commit run --all-files` and `semgrep ci` can be run through the `terminal` tool. | Not stated in documentation. | [pre-commit](https://pre-commit.com/), [Semgrep](https://semgrep.dev/docs/getting-started/quickstart), [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) |
| Rule-based rote checks in CI | Possible by scripting CI steps. | Danger JS codifies team norms as `dangerfile.js` or `dangerfile.ts` rules. | [Danger JS](https://danger.systems/js/) |
| Platform coverage | GitHub via `gh`/REST; Hermes CLI plus 20+ messaging platforms. | CodeRabbit works on GitHub, GitLab, Azure DevOps, and Bitbucket. | [Hermes docs](https://hermes-agent.nousresearch.com/docs), [GitHub REST reviews](https://docs.github.com/en/rest/pulls/reviews), [CodeRabbit](https://docs.coderabbit.ai/) |
| Parallel workstreams | Yes — `delegate_task` and isolated subagents. | Not stated in documentation. | [Hermes docs](https://hermes-agent.nousresearch.com/docs), [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) |
| Learning from feedback | Yes — skills authored from experience in `~/.hermes/skills/`. | CodeRabbit "learns from your team's feedback" with no documented mechanism. | [Hermes skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), [CodeRabbit](https://docs.coderabbit.ai/) |
| Review turnaround | No figure given. | Copilot "usually takes less than 30 seconds". | [Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review) |

## FAQ

### Does Hermes have a built-in code-review feature?

No. The documentation does not establish a built-in, native, or documented Hermes code-review feature, skill, mode, or benchmark. You can assemble a review workflow from documented pieces such as `gh`, the `terminal` tool, and skills, but that capability is composed, not installed as a single review product. See the [Hermes docs](https://hermes-agent.nousresearch.com/docs), [Hermes skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills), and [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools).

### Can Hermes approve my pull requests?

Yes, Hermes can submit an approval through `gh pr review --approve`. That action creates a real approval, so it should be treated as a deliberate governance decision. By contrast, Copilot code review defaults to a "Comment" review that does not count toward required approvals. See [`gh pr review`](https://cli.github.com/manual/gh_pr_review) and [Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review).

### How is this different from Copilot code review or CodeRabbit?

Hosted bots provide packaged review behaviors. Copilot labels comments High, Medium, or Low and defaults to Comment-only reviews. CodeRabbit documents triage, diff explanation, sandboxed app verification, and security scanning. Hermes is different: it gives you composable CLI orchestration, skills, isolated subagents, and delivery across 20+ messaging platforms, but you assemble the chain yourself. See [CodeRabbit](https://docs.coderabbit.ai/), [Copilot code review](https://docs.github.com/en/copilot/how-tos/agents/copilot-code-review/using-copilot-code-review), [Hermes docs](https://hermes-agent.nousresearch.com/docs), and [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools).

### Do pre-commit hooks mean reviewers can ignore style?

No. [pre-commit](https://pre-commit.com/) hooks fire on `git commit` and usually run only on changed files. The docs suggest running them in CI too. Their purpose is to catch trivial issues so reviewers can focus on architecture, not to replace human review or find every bug.

### Do I need a Semgrep account?

Yes for the `semgrep ci` flow. The [Semgrep quickstart](https://semgrep.dev/docs/getting-started/quickstart) documents `semgrep login` before scanning and shows the Docker variant passing `SEMGREP_APP_TOKEN`.

### Can Hermes review PRs on a schedule or ping me in Slack?

Hermes has built-in cron with delivery to any platform. The `cronjob` tool supports `create`, `list`, `update`, `pause`, `resume`, `run`, and `remove`. That makes a scheduled PR sweep possible as an extension of this workflow. See the [Hermes docs](https://hermes-agent.nousresearch.com/docs), [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools), and [Hermes cron docs](https://hermes-agent.nousresearch.com/docs/user-guide/features/cron).

### What happens with huge or binary files in a PR?

Hermes's `read_file` tool transcodes UTF-16 to UTF-8, but files over 10 MB and genuinely binary files still get the binary-file refusal. Use `gh pr diff --name-only` to scope the review to relevant text files before asking Hermes to inspect them. See [Hermes tools](https://hermes-agent.nousresearch.com/docs/user-guide/features/tools) and [`gh pr diff`](https://cli.github.com/manual/gh_pr_diff).

## The Bottom Line

Use Hermes as a code review assistant when you want a composable, self-hosted chain built from tools you already trust: `gh` for PR context and submission, pre-commit/Ruff/Semgrep/Danger for deterministic checks, and Hermes skills for repeatable team standards. This approach gives you control over commands, review posture, and delivery, and it can grow into a reusable skill.

Choose a hosted bot when you want packaged review behavior immediately. Copilot code review provides quick, severity-labeled Comment reviews that do not count toward required approvals. CodeRabbit documents queue triage, diff explanation, sandboxed app verification, and security scanning. The tradeoff is control versus convenience: Hermes makes you assemble the chain, but it also lets you decide exactly what runs, what gets said, and whether an approval should ever be submitted.

## How This Guide Was Built

This article was assembled from the official documentation pages linked throughout the text, including Hermes Agent, GitHub CLI, GitHub REST API, pre-commit, Ruff, ESLint, Semgrep, Danger JS, CodeRabbit, and GitHub Copilot code review. The tools were not installed or run hands-on for this article. Commands are shown as instructions for the reader, and `lastVerified` reflects documentation review, not testing.
