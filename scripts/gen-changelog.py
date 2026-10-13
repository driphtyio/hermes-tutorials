#!/usr/bin/env python3
"""Rebuild src/data/changelog.ts from ALL GitHub releases with the FULL release notes (body).

Keeps per-tag fields we curated earlier (codename, links, prs, highlights); refreshes the rest.
Body processing: drop the H1 title and "Release Date" line (the page shows both), HTML comments,
commit-statistics lines ("**Since vX:** ~N commits...") and any paragraph of an "About this release" section
that is commit statistics (the rest of that section is kept). Everything else is kept verbatim as markdown; the page renders it.
Usage: python3 scripts/gen-changelog.py
"""
import json, re, urllib.request

REPO = "NousResearch/hermes-agent"
TS_PATH = "/home/techgeek/hermes-tutorials/src/data/changelog.ts"
UA = {"User-Agent": "curl/8.5.0"}
ARR = "export const changelog: ChangelogEntry[] = "
STAT = re.compile(r"non-merge commits|changed files|\*\*[\d,~]+ commits|~?[\d,]+ commits|files changed|Measured at commit", re.I)


def fetch(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))


def clean_body(body):
    b = (body or "").replace("\r\n", "\n")
    b = re.sub(r"<!--.*?-->", "", b, flags=re.S)
    b = re.sub(r"\A\s*# [^\n]*\n", "", b)
    b = re.sub(r"^\*\*Release Date:\*\*[^\n]*\n", "", b, flags=re.M)
    b = re.sub(r"^\*\*Since v[^\n]*\n", "", b, flags=re.M)

    def about(m):
        # drop only the commit-statistics paragraphs; keep any real prose in the section
        paras = [q for q in m.group(2).strip().split("\n\n") if not STAT.search(q)]
        return (m.group(1) + "\n\n".join(paras)) if paras else ""

    b = re.sub(r"(## About this release\n\n)(.*?)(?=\n## |\Z)", about, b, flags=re.S)
    return re.sub(r"\n{3,}", "\n\n", b).strip()


def lead(body):
    m = re.search(r"^> (.+)$", body, re.M)
    if not m:
        return ""
    t = m.group(1).strip()
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"`([^`]+)`", r"<code>\1</code>", t)
    return t.replace("&", "&amp;").replace("&amp;amp;", "&amp;") if "<" not in t else t


def main():
    rels = []
    for pg in (1, 2, 3):
        chunk = fetch(f"https://api.github.com/repos/{REPO}/releases?per_page=100&page={pg}")
        rels += chunk
        if len(chunk) < 100:
            break
    rels = [r for r in rels if not r.get("draft")]
    rels.sort(key=lambda r: r["published_at"], reverse=True)

    src = open(TS_PATH).read()
    head, arr = src.split(ARR, 1)
    old = {e["tag"]: e for e in json.loads(arr.rstrip().rstrip(";"))}

    out = []
    for i, r in enumerate(rels):
        tag = r["tag_name"]
        o = old.get(tag, {})
        raw = r.get("body") or ""
        body = clean_body(raw)
        ver_m = re.search(r"v0\.[0-9]+\.[0-9]+", r.get("name") or "")
        pr_m = re.search(r"\*\*([0-9,]+) merged PRs\*\*", raw)
        prev = rels[i + 1]["tag_name"] if i + 1 < len(rels) else ""
        out.append({
            "tag": tag,
            "version": o.get("version") or (ver_m.group(0) if ver_m else tag),
            "codename": o.get("codename", ""),
            "date": r["published_at"][:10],
            "summary": lead(body),
            "highlights": o.get("highlights", []),
            "prs": o.get("prs") or (pr_m.group(1).replace(",", "") if pr_m else ""),
            "url": r["html_url"],
            "compare": f"https://github.com/{REPO}/compare/{prev}...{tag}" if prev else "",
            "links": o.get("links") or [{"url": r["html_url"], "label": "Release notes (" + tag + ")"}],
            "body": body,
        })

    dates = [e["date"] for e in out]
    assert dates == sorted(dates, reverse=True), "not newest-first"
    head = re.sub(r"\(\d+ releases, [0-9-]+\.\.[0-9-]+\)", f"({len(out)} releases, {min(dates)}..{max(dates)})", head, count=1)
    head = head.replace("  links: ChangelogLink[];\n}", "  links: ChangelogLink[];\n  body: string; // full release notes (markdown), commit-statistics removed\n}") if "body: string" not in head else head
    head = head.replace("Regenerate via /tmp/ht-changelog-gen.py", "Regenerate via scripts/gen-changelog.py")
    open(TS_PATH, "w").write(head + ARR + json.dumps(out, indent=2, ensure_ascii=False) + ";\n")
    print(f"wrote {len(out)} releases; newest {out[0]['version']} {out[0]['date']}; body bytes {sum(len(e['body']) for e in out)}")


if __name__ == "__main__":
    main()
