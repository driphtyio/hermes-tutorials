#!/usr/bin/env python3
"""
Blog QA Review — Positive Feedback Loop for the Hermes Tutorial Blog

Architecture (HadAgent-derived):
  Monitor   → Parse every MDX post, check quality signals
  Detect    → Flag anomalies: missing sections, broken links, SEO gaps
  Promote   → Issues identified become checks for next cycle (self-improving)

Output: A structured scorecard with per-post scores and trend tracking.
"""

import os, re, sys, json, glob
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CONTENT_DIR = BASE / "src" / "content" / "blog"
HISTORY_FILE = BASE / ".hermes" / "qa-history.json"

# ── Schema: every test function returns (passed: bool, detail: str) ──

def check_frontmatter(slug, fm):
    """Validate frontmatter fields exist and meet constraints."""
    issues = []
    
    # Required fields
    for field in ["title", "description", "pubDate"]:
        if field not in fm or not fm.get(field):
            issues.append(f"Missing required field: {field}")
    
    # Description length
    desc = fm.get("description", "")
    if len(desc) > 160:
        issues.append(f"Description too long: {len(desc)} chars (max 160)")
    elif len(desc) < 50:
        issues.append(f"Description too short: {len(desc)} chars (min 50)")
    
    # Tags
    tags = fm.get("tags", [])
    if not tags:
        issues.append("No tags defined")
    
    # Keywords
    kw = fm.get("keywords", [])
    if not kw:
        issues.append("No keywords defined")
    elif len(kw) < 3:
        issues.append(f"Only {len(kw)} keywords (recommend 5+)")
    
    return issues


def check_tldr(body):
    """Check for TLDR section."""
    if re.search(r'> \*\*TLDR:\*\*', body):
        return True, "TLDR present"
    return False, "Missing TLDR section"


def check_faq(body):
    """Check for FAQ section."""
    if re.search(r'## FAQ\b', body):
        return True, "FAQ present"
    return False, "Missing FAQ section"


def check_key_takeaways(body):
    """Check for Key Takeaways section."""
    if re.search(r'## Key Takeaways\b', body):
        return True, "Key Takeaways present"
    return False, "Missing Key Takeaways section"


def check_internal_links(body, all_slugs):
    """Check that internal /blog/ links point to real posts."""
    links = re.findall(r'/blog/([^/"\')]+)', body)
    bad = []
    for slug in links:
        if slug not in all_slugs:
            bad.append(f"Broken internal link: /blog/{slug}/")
    if bad:
        return False, "; ".join(bad)
    return True, f"{len(links)} internal links all valid"


def check_cross_links(body, slug, all_slugs):
    """Check that the post links to OTHER posts (not just itself)."""
    links = set(re.findall(r'/blog/([^/"\')]+)', body))
    links.discard(slug)  # remove self-links
    if len(links) < 1:
        return False, "No cross-links to other posts"
    if len(links) < 2:
        return False, f"Only 1 cross-link (recommend 2+)"
    return True, f"{len(links)} cross-links to other posts"


def check_broken_markdown_links(body):
    """Check for broken markdown link syntax [text](url)."""
    links = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', body)
    bad = []
    for text, url in links:
        # Skip external URLs
        if url.startswith("http"):
            continue
        # Skip anchors
        if url.startswith("#"):
            continue
        # Skip .mdx/.md file links within content
        if url.endswith(".mdx") or url.endswith(".md"):
            bad.append(f"Relative file link: [{text}]({url}) — use /path/ not file.mdx")
    if bad:
        return False, "; ".join(bad[:3]) + (f"... and {len(bad)-3} more" if len(bad) > 3 else "")
    return True, "No broken markdown links"


def check_headings(body):
    """Check for proper heading hierarchy (no H1 after first line, no skips)."""
    # Strip code blocks first so we don't flag bash comments (#) as headings
    clean_body = re.sub(r'```[\s\S]*?```', '', body)
    lines = clean_body.split('\n')
    headings = []
    for i, line in enumerate(lines):
        m = re.match(r'^(#{1,6})\s+', line)
        if m:
            level = len(m.group(1))
            headings.append((i+1, level, line.strip()))
    
    issues = []
    # Check for H1 beyond the title
    h1s = [(ln, l, t) for ln, l, t in headings if l == 1]
    if len(h1s) > 1:
        for ln, l, t in h1s[1:]:
            issues.append(f"Extra H1 on line {ln}: '{t}'")
    
    # Check for heading level skips
    for i in range(1, len(headings)):
        prev_level = headings[i-1][1]
        curr_level = headings[i][1]
        if curr_level > prev_level + 1:
            issues.append(f"Heading skip on line {headings[i][0]}: H{prev_level} → H{curr_level}")
    
    if issues:
        return False, "; ".join(issues)
    return True, "Heading hierarchy clean"


def check_seo_density(body, keywords, slug):
    """Check that keywords appear in the body."""
    if not keywords:
        return True, "No keywords to check"
    body_lower = body.lower()
    missing = []
    for kw in keywords:
        # Check each word of the keyword phrase
        words = kw.lower().split()
        if not all(w in body_lower for w in words):
            missing.append(kw)
    if missing:
        return False, f"Keywords not found in body: {', '.join(missing[:3])}"
    return True, f"All {len(keywords)} keywords found in content"


def parse_frontmatter(content):
    """Parse YAML-ish frontmatter between --- markers."""
    m = re.match(r'^---\s*\n(.*?)\n---', content, re.DOTALL)
    if not m:
        return {}
    
    fm_text = m.group(1)
    fm = {}
    
    # Simple YAML key-value parsing (covers our frontmatter format)
    for line in fm_text.strip().split('\n'):
        # Skip array items that start with -
        if line.strip().startswith('- '):
            continue
        m2 = re.match(r'^(\w+):\s*(.+)$', line)
        if m2:
            key = m2.group(1)
            val = m2.group(2).strip()
            
            # Handle quoted strings
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            
            # Handle arrays [a, b, c]
            if val.startswith('[') and val.endswith(']'):
                val = [v.strip().strip('"\'') for v in val[1:-1].split(',') if v.strip()]
            else:
                # For list items like tags: [x, y], we need to handle multi-line
                pass
            
            fm[key] = val
    
    # Parse arrays that span multiple lines (tags, keywords)
    for key in ['tags', 'keywords']:
        m_arr = re.search(rf'^{key}:\s*\[(.+?)\]', fm_text, re.DOTALL)
        if m_arr:
            items = [v.strip().strip('"\'') for v in m_arr.group(1).split(',') if v.strip()]
            fm[key] = items
    
    # Parse dates
    if 'pubDate' in fm and isinstance(fm['pubDate'], str):
        try:
            fm['pubDate'] = datetime.fromisoformat(fm['pubDate'])
        except:
            pass
    
    return fm


def get_body(content):
    """Get body text (after frontmatter)."""
    m = re.match(r'^---.*?\n---\n(.*)', content, re.DOTALL)
    if m:
        return m.group(1)
    return content


def slug_from_filename(filename):
    return filename.replace('.mdx', '').replace('.md', '')


def load_history():
    """Load previous QA results for trend tracking."""
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text())
        except:
            return {"runs": [], "all_issues": {}}
    return {"runs": [], "all_issues": {}}


def save_history(history):
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    HISTORY_FILE.write_text(json.dumps(history, indent=2, default=str))


def run_review():
    print("╔══════════════════════════════════════════════════╗")
    print("║  Blog QA Review — Positive Feedback Loop        ║")
    print(f"║  {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC'):40s}║")
    print("╚══════════════════════════════════════════════════╝")
    
    # Collect all slugs for cross-link checking
    files = sorted(glob.glob(str(CONTENT_DIR / "*.mdx")))
    all_slugs = [slug_from_filename(os.path.basename(f)) for f in files]
    
    history = load_history()
    run_id = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    run_results = []
    grand_total_issues = 0
    
    for fpath in files:
        filename = os.path.basename(fpath)
        slug = slug_from_filename(filename)
        content = Path(fpath).read_text()
        fm = parse_frontmatter(content)
        body = get_body(content)
        
        title = fm.get('title', slug)
        issues = []
        checks = {}
        
        # ── Run all checks ──
        
        # Frontmatter
        fm_issues = check_frontmatter(slug, fm)
        issues.extend(fm_issues)
        checks['frontmatter'] = len(fm_issues) == 0
        
        # TLDR
        ok, msg = check_tldr(body)
        if not ok: issues.append(msg)
        checks['tldr'] = ok
        
        # FAQ
        ok, msg = check_faq(body)
        if not ok: issues.append(msg)
        checks['faq'] = ok
        
        # Key Takeaways
        ok, msg = check_key_takeaways(body)
        if not ok: issues.append(msg)
        checks['takeaways'] = ok
        
        # Internal links
        ok, msg = check_internal_links(body, all_slugs)
        if not ok: issues.append(msg)
        checks['internal_links'] = ok
        
        # Cross-links to other posts
        ok, msg = check_cross_links(body, slug, all_slugs)
        if not ok: issues.append(msg)
        checks['cross_links'] = ok
        
        # Broken markdown links
        ok, msg = check_broken_markdown_links(body)
        if not ok: issues.append(msg)
        checks['markdown_links'] = ok
        
        # Headings
        ok, msg = check_headings(body)
        if not ok: issues.append(msg)
        checks['headings'] = ok
        
        # SEO keyword density
        keywords = fm.get('keywords', [])
        ok, msg = check_seo_density(body, keywords, slug)
        if not ok: issues.append(msg)
        checks['seo_keywords'] = ok
        
        # ── Score ──
        total_checks = len(checks)
        passed = sum(1 for v in checks.values() if v)
        score = round(passed / total_checks * 100)
        
        run_results.append({
            'slug': slug,
            'title': title,
            'score': score,
            'passed': passed,
            'total': total_checks,
            'issues': issues,
            'checks': checks,
        })
        
        grand_total_issues += len(issues)
    
    # ── Display Results ──
    print()
    print(f"  Posts reviewed: {len(run_results)}")
    print(f"  Total issues:   {grand_total_issues}")
    print()
    
    # Sort by score (worst first for attention)
    run_results.sort(key=lambda r: r['score'])
    
    for r in run_results:
        emoji = "✅" if r['score'] >= 90 else "⚠️" if r['score'] >= 70 else "❌"
        bar = "█" * (r['score'] // 5) + "░" * ((20 - r['score'] // 5))
        print(f"  {emoji} {bar} {r['score']:3d}%  {r['title'][:50]}")
        
        if r['issues']:
            for issue in r['issues']:
                print(f"       • {issue}")
        
        # Missing checks detail
        missing = [k for k, v in r['checks'].items() if not v]
        if missing:
            print(f"       ─ {' | '.join(missing)}")
        print()
    
    # ── Summary ──
    avg_score = sum(r['score'] for r in run_results) / len(run_results)
    print(f"  ─" * 20)
    print(f"  Average score: {avg_score:.0f}%")
    
    top_issues = {}
    for r in run_results:
        for issue in r['issues']:
            category = issue.split(':')[0] if ':' in issue else issue
            top_issues[category] = top_issues.get(category, 0) + 1
    
    if top_issues:
        print(f"  Most common issues:")
        for cat, count in sorted(top_issues.items(), key=lambda x: -x[1])[:5]:
            print(f"    • {cat}: {count} posts")
    
    # ── Save to history for trend tracking ──
    run_record = {
        'run_id': run_id,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'avg_score': avg_score,
        'total_issues': grand_total_issues,
        'results': run_results,
    }
    history['runs'].append(run_record)
    
    # Track all unique issues across runs
    for r in run_results:
        for issue in r['issues']:
            if issue not in history['all_issues']:
                history['all_issues'][issue] = {'first_seen': run_id, 'count': 0}
            history['all_issues'][issue]['count'] += 1
    
    save_history(history)
    
    # ── Trend ──
    if len(history['runs']) >= 2:
        prev = history['runs'][-2]['avg_score']
        trend = "📈 up" if avg_score > prev else "📉 down" if avg_score < prev else "➡️ flat"
        print(f"  Trend vs last run: {trend} ({prev:.0f}% → {avg_score:.0f}%)")
    
    print()
    print(f"  History saved to: {HISTORY_FILE}")
    
    # Exit code: non-zero if any post below 70%
    min_score = min(r['score'] for r in run_results)
    return 1 if min_score < 70 else 0


if __name__ == "__main__":
    sys.exit(run_review())
