#!/usr/bin/env python3
"""Regenerate hermes-tutorials changelog.ts additions from GitHub releases.

Keeps existing entries; appends releases newer than the newest stored date.
Usage: python3 gen-changelog.py
"""
import json
import re
import urllib.request

REPO = "NousResearch/hermes-agent"
TS_PATH = "/home/techgeek/hermes-tutorials/src/data/changelog.ts"
UA = {"User-Agent": "curl/8.5.0"}


def fetch(url):
    return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30))


def esc(s):
    return json.dumps(s or "")


def main():
    releases = fetch(f"https://api.github.com/repos/{REPO}/releases?per_page=15")

    src = open(TS_PATH).read()
    dates = re.findall(r'"date": "([0-9]{4}-[0-9]{2}-[0-9]{2})"', src)
    newest = max(dates) if dates else "2000-01-01"
    new_entries = [r for r in releases if (r.get("published_at") or "")[:10] > newest]
    print(f"stored newest: {newest}; new releases: {[r['tag_name'] for r in new_entries]}")
    if not new_entries:
        print("nothing to append")
        return

    blocks = []
    for r in new_entries:
        body = r.get("body") or ""
        summ = ""
        am = re.search(r"## About this release\n\n(.*?)(?=\n## |\Z)", body, re.S)
        if am:
            summ = am.group(1).strip().split("\n\n")[0][:600]
        ver_m = re.search(r"v0\.[0-9]+\.[0-9]+", (r.get("name") or ""))
        version = ver_m.group(0) if ver_m else r["tag_name"]
        highlights = []
        hm = re.search(r"## (?:✨ )?Highlights\n(.*?)(?=\n## |\Z)", body, re.S)
        if hm:
            for hline in re.findall(r"^- (.+)$", hm.group(1), re.M)[:6]:
                highlights.append(hline[:280])
        pr_m = re.search(r"\*\*([0-9,]+) merged PRs\*\*", body)
        date = (r.get("published_at") or "")[:10]
        links = [{"url": r["html_url"], "label": "Release notes (" + r["tag_name"] + ")"}]
        cmp_url = "https://github.com/" + REPO + "/compare/"
        entry = {
            "tag": r["tag_name"],
            "version": version,
            "codename": "",
            "date": date,
            "summary": summ,
            "highlights": highlights,
            "prs": pr_m.group(1).replace(",", "") if pr_m else "",
            "url": r["html_url"],
            "compare": cmp_url,
            "links": links,
        }
        block = json.dumps(entry, indent=2, ensure_ascii=False)
        # indent to match file style (2-space inside the array)
        block = "\n".join("  " + ln if ln else ln for ln in block.split("\n"))
        blocks.append("  " + block)

    marker = "export const changelog: ChangelogEntry[] = [\n"
    assert marker in src, "changelog array marker not found"
    src = src.replace(marker, marker + ",\n".join(blocks) + ",\n", 1)

    # update header comment: releases count + date range
    new_count = src.count('"tag":')
    all_dates = re.findall(r'"date": "([0-9]{4}-[0-9]{2}-[0-9]{2})"', src)
    src = re.sub(
        r"\(\d+ releases, [0-9-]+\.\.[0-9-]+\)",
        "(" + str(new_count) + " releases, " + min(all_dates) + ".." + max(all_dates) + ")",
        src,
        count=1,
    )
    open(TS_PATH, "w").write(src)
    print(f"appended {len(blocks)} entries; total {new_count}")


if __name__ == "__main__":
    main()
