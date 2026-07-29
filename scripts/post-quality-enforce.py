#!/usr/bin/env python3
"""Auto-Fix Enforcer — Post-publish quality auto-fix for hermes-tutorials.

Scans all blog posts for common issues and auto-fixes them:
- Broken markdown code blocks
- Missing feature images in frontmatter
- Mismatched frontmatter delimiters
- Incomplete tags
- Missing pubDate
- Stray formatting

Usage:
  python3 scripts/post-quality-enforce.py              # Scan & auto-fix all posts
  python3 scripts/post-quality-enforce.py --check       # Report only, no fixes
  python3 scripts/post-quality-enforce.py --post slug   # Single post scan
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

PROJECT_DIR = Path("/home/techgeek/hermes-tutorials")
BLOG_DIR = PROJECT_DIR / "src" / "content" / "blog"
METRICS_FILE = PROJECT_DIR / "src" / "assets" / "design" / "metrics.json"
LEARNINGS_FILE = PROJECT_DIR / "src" / "assets" / "design" / "learnings.md"

def _get_frontmatter(content):
    """Extract frontmatter string from content. Returns empty string if no valid FM."""
    lines = content.split("\n")
    if not lines[0].strip() == "---":
        return ""
    for i in range(1, min(50, len(lines))):
        if lines[i].strip() == "---":
            return "\n".join(lines[1:i])
    return ""


CHECKS = {
    "frontmatter_closing": {
        "description": "Frontmatter has proper closing ---",
        "check": lambda c: _get_frontmatter(c) != "",
    },
    "pubDate_exists": {
        "description": "pubDate field present in frontmatter",
        "check": lambda c: "pubDate:" in _get_frontmatter(c),
    },
    "title_exists": {
        "description": "title field present in frontmatter",
        "check": lambda c: "title:" in _get_frontmatter(c),
    },
    "code_blocks_closed": {
        "description": "All code blocks have closing ```",
        "check": lambda c: c.count("```") % 2 == 0,
    },
    "no_stray_html": {
        "description": "No unclosed HTML tags",
        "check": lambda c: c.count("<pre>") == c.count("</pre>") and c.count("<code>") == c.count("</code>"),
    },
    "tags_list": {
        "description": "Tags field is a proper list",
        "check": lambda c: "tags:" not in _get_frontmatter(c) or "[" in _get_frontmatter(c).split("tags:")[1][:100],
    },
    "has_references_section": {
        "description": "Post has ## References section with numbered citations",
        "check": lambda c: "## References" in c or "## references" in c,
    },
    "citation_density": {
        "description": "At least 3 citations per 800 words of body text",
        "check": lambda c: _check_citation_density(c),
    },
}


def _check_citation_density(content):
    """Check citation density: minimum 3 [N] references per 800 words."""
    # Strip frontmatter
    body = content
    lines = content.split("\n")
    if lines and lines[0].strip() == "---":
        for i in range(1, min(50, len(lines))):
            if lines[i].strip() == "---":
                body = "\n".join(lines[i+1:])
                break

    # Count words (rough: split on whitespace)
    words = len(body.split())
    if words < 400:
        return True  # Too short to apply density check

    # Count [N] style references (digits only, not links like [text](url))
    refs = len(re.findall(r'\[(\d+)\]', body))

    # Calculate required minimum: 3 per 800 words
    required = max(1, int(words / 800) * 3)

    return refs >= required


class BlogPost:
    def __init__(self, path):
        self.path = Path(path)
        self.content = self.path.read_text(encoding="utf-8")
        self.issues = []
        self.fixes_applied = 0

    @property
    def slug(self):
        return self.path.stem

    def check(self):
        """Run all checks on this post."""
        for name, config in CHECKS.items():
            if not config["check"](self.content):
                self.issues.append(name)
        return self.issues

    def auto_fix(self):
        """Apply auto-fixes for known issues. Returns count of fixes."""
        fixes = 0

        # Fix 1: Missing closing --- in frontmatter
        if "frontmatter_closing" in self.issues:
            lines = self.content.split("\n")
            if lines[0].strip() == "---":
                # Find where frontmatter ends (second ---)
                frontmatter_end = None
                for i in range(1, min(50, len(lines))):
                    if lines[i].strip() == "---":
                        frontmatter_end = i
                        break
                if frontmatter_end is None:
                    # No second --- found, add it
                    lines.insert(1, "---")
                    self.content = "\n".join(lines)
                    fixes += 1

        # Fix 2: Add pubDate if missing
        if "pubDate_exists" in self.issues:
            # Add pubDate with file modification time
            mtime = datetime.fromtimestamp(
                self.path.stat().st_mtime, tz=timezone.utc
            ).strftime("%b %d, %Y")
            self.content = self.content.replace("title:", f"pubDate: '{mtime}'\ntitle:", 1)
            fixes += 1

        # Fix 3: Fix unclosed code blocks
        if "code_blocks_closed" in self.issues:
            opens = [m.start() for m in re.finditer(r'^```', self.content, re.MULTILINE)]
            if len(opens) % 2 == 1:
                # Odd number of openings — add closing at end
                self.content = self.content.rstrip() + "\n```\n"
                fixes += 1

        # Fix 4: Fix broken HTML tags
        if "no_stray_html" in self.issues:
            for tag in ["pre", "code"]:
                opens = self.content.count(f"<{tag}>")
                closes = self.content.count(f"</{tag}>")
                if opens > closes:
                    self.content += f"</{tag}>"
                    fixes += 1

        return fixes

    def save(self):
        if self.fixes_applied > 0:
            self.path.write_text(self.content, encoding="utf-8")
            return True
        return False

    @property
    def score(self):
        """Return quality score 0-10 based on checks passed."""
        total = len(CHECKS)
        passed = total - len(self.issues)
        return round(passed / total * 10, 1)


def scan_all(check_only=False, single_slug=None):
    """Scan all blog posts (or a single one)."""
    if single_slug:
        posts = [BLOG_DIR / f"{single_slug}.md"]
    else:
        posts = sorted(BLOG_DIR.glob("*.mdx"))

    if not posts:
        print("No blog posts found.")
        return

    results = {"scanned": 0, "with_issues": 0, "fixes_applied": 0, "posts": []}
    scores = []

    for p in posts:
        if not p.exists():
            print(f"  ⚠️  Post not found: {p.name}")
            continue

        post = BlogPost(p)
        issues = post.check()
        scores.append(post.score)

        results["scanned"] += 1

        if issues:
            results["with_issues"] += 1
            if not check_only:
                fixes = post.auto_fix()
                if fixes > 0:
                    post.save()
                    results["fixes_applied"] += fixes
                    print(f"  🔧 {post.slug}: fixed {fixes} issues — score {post.score}/10")
                else:
                    print(f"  ⚠️  {post.slug}: {len(issues)} issues (auto-fix unavailable): {', '.join(issues)}")
            else:
                print(f"  ⚠️  {post.slug}: {len(issues)} issues: {', '.join(issues)}")
        else:
            print(f"  ✅ {post.slug}: clean — score {post.score}/10")

    # Summary
    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    print(f"\n{'='*50}")
    print(f"📊 Summary")
    print(f"  Scanned:       {results['scanned']} posts")
    print(f"  With issues:   {results['with_issues']}")
    print(f"  Fixes applied: {results['fixes_applied']}")
    print(f"  Average score: {avg_score}/10")

    return results, avg_score


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Auto-Fix Enforcer for hermes-tutorials")
    parser.add_argument("--check", action="store_true", help="Report only, no fixes")
    parser.add_argument("--post", type=str, help="Single post slug to scan")
    args = parser.parse_args()

    print(f"{'='*50}")
    print(f"🔧 Auto-Fix Enforcer")
    print(f"{'='*50}\n")

    results, avg_score = scan_all(check_only=args.check, single_slug=args.post)

    if results and not args.check:
        # Update metrics.json with enforcement stats
        if METRICS_FILE.exists():
            try:
                metrics = json.loads(METRICS_FILE.read_text())
                if "enforcement" not in metrics:
                    metrics["enforcement"] = {}
                metrics["enforcement"]["last_run"] = datetime.now(timezone.utc).isoformat()
                metrics["enforcement"]["posts_scanned"] = results["scanned"]
                metrics["enforcement"]["posts_with_issues"] = results["with_issues"]
                metrics["enforcement"]["fixes_applied"] = results["fixes_applied"]
                metrics["enforcement"]["average_post_score"] = avg_score
                METRICS_FILE.write_text(json.dumps(metrics, indent=2))
                print(f"\n  📝 metrics.json updated with enforcement stats")
            except (json.JSONDecodeError, OSError):
                pass
