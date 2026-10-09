#!/usr/bin/env python3
"""Compile the blocks DA11Y.md shares with A11Y.md, and check the editions agree.

DA11Y.md is the design edition of A11Y.md: same logic, its own functions. What
is shared (Principle Zero, the compliance profiles and their thresholds, the
severity model) is never rewritten here. It is copied from the pinned copy of
A11Y.md in upstream/, between <!-- compiled:NAME --> ... <!-- /compiled:NAME -->
markers. Everything else evolves freely, under four checks:

  1. every compiled block matches the pinned source, in both languages;
  2. the pinned copies match the sha256 recorded in upstream/UPSTREAM.md, and
     every A11Y.md commit cited in an edition is the pinned one;
  3. every contrast ratio, size or px value in an edition's own text exists in
     A11Y.md, and every A11Y.md guide it cites exists in A11Y.md's loading map;
  4. the English and Portuguese editions keep the same section structure and
     cite the same reference files.

Usage:
  python3 tools/compile.py            # recompile the blocks in place, then check
  python3 tools/compile.py --check    # check only; exit 1 on any divergence

Standard library only, like the A11Y.md tools.
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROVENANCE = ROOT / "upstream" / "UPSTREAM.md"

EDITIONS = {
    "en": {
        "source": ROOT / "upstream" / "en" / "A11Y.md",
        "edition": ROOT / "docs" / "en" / "DA11Y.md",
        "severity_intro": "Evaluate",
        "examples": r" \(e\.g\., [^)]*\)",
    },
    "pt-BR": {
        "source": ROOT / "upstream" / "pt-BR" / "A11Y.md",
        "edition": ROOT / "docs" / "pt-BR" / "DA11Y.md",
        "severity_intro": "Avalie",
        "examples": r" \(Ex: [^)]*\)",
    },
}

MARKER = re.compile(
    r"(<!-- compiled:(?P<name>[a-z-]+) -->\n)(?P<body>.*?)(<!-- /compiled:(?P=name) -->)",
    re.S,
)


def section(text: str, heading_start: str) -> list[str]:
    """Lines between the heading starting with `heading_start` and the next ## heading."""
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.startswith(heading_start):
            body = []
            for nxt in lines[i + 1:]:
                if nxt.startswith("## "):
                    break
                body.append(nxt)
            return body
    raise SystemExit(f"Heading not found in source: {heading_start!r}")


def extract(source: str, cfg: dict) -> dict[str, str]:
    principle = [l for l in section(source, "## 0. Principle Zero") if l.startswith("- ")]

    profiles = section(source, "## 0.1.")
    table = [l for l in profiles if l.startswith("|")]
    note = [l for l in profiles if l.startswith("*† =")]
    if not table or len(note) != 1:
        raise SystemExit("Source §0.1 changed shape: table or † note not found.")

    severity = section(source, "## 1. Severity")
    intro = [l for l in severity if l.startswith(cfg["severity_intro"])]
    levels = [re.sub(cfg["examples"], "", l) for l in severity if l.startswith("- ")]
    if len(intro) != 1 or len(levels) != 4:
        raise SystemExit("Source §1 changed shape: expected one intro line and 4 severity levels.")

    return {
        "principle-zero": "\n".join(principle) + "\n",
        "profiles": "\n".join(table) + "\n\n" + note[0] + "\n",
        "severity": "\n".join(intro + [""] + levels) + "\n",
    }


def numbers(text: str) -> set[str]:
    """Ratios (4.5:1), sizes (24×24) and px values, normalized."""
    found = set()
    for pattern in (r"(?<![\d.,])\d+(?:[.,]\d+)?:1(?!\d)", r"(?<!\d)\d+\s?×\s?\d+(?!\d)", r"(?<!\d)\d+\s?px\b"):
        for m in re.findall(pattern, text):
            found.add(re.sub(r"\s", "", m).replace(",", "."))
    return found


def structure(text: str) -> list[tuple[int, str | None]]:
    """Sequence of (heading level, section number) — the skeleton both editions share."""
    out = []
    for line in text.splitlines():
        m = re.match(r"^(#{2,3}) (\d+(?:\.\d+)?)?", line)
        if m:
            out.append((len(m.group(1)), m.group(2)))
    return out


def cited_references(text: str) -> set[str]:
    return set(re.findall(r"references/([a-z0-9-]+\.md)", text))


def check_edition(lang: str, cfg: dict, text: str, source: str, blocks: dict[str, str], commit: str | None) -> list[str]:
    errors = []
    found = {m.group("name"): m.group("body") for m in MARKER.finditer(text)}
    for name, expected in blocks.items():
        if name not in found:
            errors.append(f"[{lang}] missing block: <!-- compiled:{name} -->")
        elif found[name] != expected:
            errors.append(f"[{lang}] block diverges from the pinned source: {name} (run tools/compile.py)")

    if commit:
        cited = set(re.findall(r"fecarrico/A11Y\.md/([0-9a-f]{7,40})/", text)) | set(re.findall(r"commit `([0-9a-f]{7,40})`", text))
        for c in cited:
            if not commit.startswith(c):
                errors.append(f"[{lang}] cited commit {c} differs from the pinned {commit[:7]}")

    own = MARKER.sub("", text)
    for n in sorted(numbers(own) - numbers(source)):
        errors.append(f"[{lang}] number with no ground in A11Y.md: {n}")

    for guide in sorted(r for r in cited_references(text) if r.startswith("guide-")):
        if f"references/{guide}" not in source:
            errors.append(f"[{lang}] cited guide not in A11Y.md's loading map: {guide}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="check only, never write")
    args = parser.parse_args()

    provenance = PROVENANCE.read_text(encoding="utf-8")
    commit_m = re.search(r"Commit \| `([0-9a-f]{40})`", provenance)
    commit = commit_m.group(1) if commit_m else None
    errors: list[str] = [] if commit else ["upstream/UPSTREAM.md has no pinned commit"]

    texts = {}
    for lang, cfg in EDITIONS.items():
        declared = re.search(rf"\| {re.escape(lang)} \| `[^`]+` \| `([0-9a-f]{{64}})`", provenance)
        actual = hashlib.sha256(cfg["source"].read_bytes()).hexdigest()
        if not declared or declared.group(1) != actual:
            errors.append(f"[{lang}] pinned A11Y.md does not match the sha256 in UPSTREAM.md")

        source = cfg["source"].read_text(encoding="utf-8")
        text = cfg["edition"].read_text(encoding="utf-8")
        blocks = extract(source, cfg)

        if not args.check:
            def swap(m: re.Match) -> str:
                if m.group("name") not in blocks:
                    raise SystemExit(f"[{lang}] marker with no extractor: {m.group('name')}")
                return m.group(1) + blocks[m.group("name")] + m.group(4)
            new = MARKER.sub(swap, text)
            if new != text:
                cfg["edition"].write_text(new, encoding="utf-8")
                print(f"[{lang}] blocks recompiled from upstream/{lang}/A11Y.md")
            text = new

        texts[lang] = text
        errors += check_edition(lang, cfg, text, source, blocks, commit)

    # Parity between the editions.
    if structure(texts["en"]) != structure(texts["pt-BR"]):
        errors.append("en and pt-BR editions have different section structure")
    if cited_references(texts["en"]) != cited_references(texts["pt-BR"]):
        errors.append("en and pt-BR editions cite different reference files")
    ref_en = {p.name for p in (ROOT / "docs" / "en" / "references").glob("*.md")}
    ref_pt = {p.name for p in (ROOT / "docs" / "pt-BR" / "references").glob("*.md")}
    if ref_en != ref_pt:
        errors.append(f"reference files differ between languages: {sorted(ref_en ^ ref_pt)}")
    for lang in EDITIONS:
        own_refs = {r for r in cited_references(texts[lang]) if not r.startswith("guide-")}
        for missing in sorted(own_refs - ref_en):
            errors.append(f"[{lang}] cites a reference that does not exist here: {missing}")

    if errors:
        print("FAIL — DA11Y.md diverges from the pinned A11Y.md or between languages:")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("OK — compiled blocks match the pinned A11Y.md in both languages; numbers, guides and language parity hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
