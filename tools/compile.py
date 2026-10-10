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
     A11Y.md, every A11Y.md guide it cites exists in A11Y.md's loading map, and
     every guide in that map is either in the Section 7 map or in NOT_ON_CANVAS;
  4. the English and Portuguese editions keep the same section structure and
     cite the same reference files;
  5. this project's own guides (docs/<lang>/references/) pass the same checks:
     numbers grounded in the core or in a pinned A11Y.md guide they cite, cited
     guides present in A11Y.md's map, the pinned commit, and the same structure
     in both languages. Every pinned file matches its sha256 in UPSTREAM.md;
  6. every guide and template is a full link, because an agent reading an
     attached file has no address to complete a path: A11Y.md's at the pinned
     commit, this project's at the tag of the edition's version (written by
     this script), both in the text's own language and pointing at a file
     that exists;
  7. the pinned A11Y.md commit is written by this script into every edition
     and guide, so a version bump edits one file, upstream/UPSTREAM.md;
  8. the Section 7 map links this project's guides only (A11Y.md's guide is
     linked directly only when listed in DIRECT_FROM_A11Y), and every A11Y.md
     guide in A11Y.md's map is translated by a figma-*.md guide of the same
     name, linked directly, or listed in NOT_ON_CANVAS.

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

# A11Y.md guides that cover nothing drawn on a canvas, so they stay out of the
# Section 7 map. Any other guide A11Y.md has, or adds in a new version, must be
# mapped there or listed here, by decision.
NOT_ON_CANVAS = {
    "guide-agentic-web.md": "how browser agents consume a built page",
    "guide-framework-mapping.md": "A11Y.md's code examples per framework",
    "guide-governance.md": "audits, statements and compliance of the program",
}

# A11Y.md guides the Section 7 map links directly, with no figma-*.md guide,
# because there is nothing to translate into the canvas.
DIRECT_FROM_A11Y = {
    "guide-compliance-profiles.md": "choosing a profile is the same decision in design and code",
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


A11Y_URL = re.compile(
    r"https://raw\.githubusercontent\.com/fecarrico/A11Y\.md/[0-9a-f]{7,40}/docs/([^/]+)/((?:references|templates)/[A-Za-z0-9.-]+\.md)"
)
OWN_URL = re.compile(
    r"https://raw\.githubusercontent\.com/fecarrico/DA11Y\.md/([^/]+)/docs/([^/]+)/((?:references|templates)/[A-Za-z0-9-]+\.md)"
)
OWN_TOOL_URL = re.compile(r"https://raw\.githubusercontent\.com/fecarrico/DA11Y\.md/([^/]+)/(tools/[a-z0-9-]+\.[a-z]+)")
A11Y_COMMIT_URL = re.compile(r"(fecarrico/A11Y\.md/)([0-9a-f]{7,40})(/)")
BARE_PATH = re.compile(r"(?<!\[)`(?:references|templates)/[^`]+`")
RELATIVE_LINK = re.compile(r"\]\(((?:references/|templates/|tools/)?[A-Za-z0-9-]+\.(?:md|js))\)")


def version_of(text: str) -> str | None:
    m = re.search(r"\*\*(?:Version|Versão):\*\* (\d+\.\d+\.\d+)", text)
    return m.group(1) if m else None


def own_base(version: str, lang: str) -> str:
    return f"https://raw.githubusercontent.com/fecarrico/DA11Y.md/v{version}/docs/{lang}/"


def absolutize(text: str, version: str, lang: str, in_references: bool, commit: str | None = None) -> str:
    """Write every link to this project's files as a full URL at the version tag,
    and every A11Y.md commit as the pinned one."""
    base = own_base(version, lang)
    tools = f"https://raw.githubusercontent.com/fecarrico/DA11Y.md/v{version}/"
    if in_references:
        text = re.sub(r"\]\(([a-z0-9-]+\.md)\)", lambda m: f"]({base}references/{m.group(1)})", text)
    text = re.sub(r"\]\(((?:references|templates)/[A-Za-z0-9-]+\.md)\)", lambda m: f"]({base}{m.group(1)})", text)
    text = re.sub(r"\]\((tools/[a-z0-9-]+\.[a-z]+)\)", lambda m: f"]({tools}{m.group(1)})", text)
    text = OWN_URL.sub(lambda m: base + m.group(3), text)
    text = OWN_TOOL_URL.sub(lambda m: tools + m.group(2), text)
    if commit:
        text = A11Y_COMMIT_URL.sub(lambda m: m.group(1) + commit + m.group(3), text)
        text = re.sub(r"commit `[0-9a-f]{7,40}`", f"commit `{commit[:7]}`", text)
    return text


def link_errors(name: str, lang: str, text: str, source: str, version: str | None) -> list[str]:
    errors = []
    for bare in sorted(set(BARE_PATH.findall(text))):
        errors.append(f"{name} has a path with no link, which an agent reading an attached file cannot open: {bare}")
    for url_lang, path in A11Y_URL.findall(text):
        if url_lang != lang:
            errors.append(f"{name} links the {url_lang} A11Y.md from the {lang} text: {path}")
        if path.startswith("templates/") and f"]({path})" not in source:
            errors.append(f"{name} links a template A11Y.md does not have: {path}")
    for rel in sorted(set(RELATIVE_LINK.findall(text))):
        errors.append(f"{name} has a relative link, which an attached file cannot resolve (run tools/compile.py): {rel}")
    for ref, url_lang, path in sorted(set(OWN_URL.findall(text))):
        if version and ref != f"v{version}":
            errors.append(f"{name} links {path} at {ref}, not at the edition's tag v{version} (run tools/compile.py)")
        if url_lang != lang:
            errors.append(f"{name} links the {url_lang} {path} from the {lang} text")
        if not (ROOT / "docs" / lang / path).exists():
            errors.append(f"{name} links a file that does not exist here: {path}")
    for ref, path in sorted(set(OWN_TOOL_URL.findall(text))):
        if version and ref != f"v{version}":
            errors.append(f"{name} links {path} at {ref}, not at the edition's tag v{version} (run tools/compile.py)")
        if not (ROOT / path).exists():
            errors.append(f"{name} links a tool that does not exist here: {path}")
    return errors


def cited_commits(text: str) -> set[str]:
    return set(re.findall(r"fecarrico/A11Y\.md/([0-9a-f]{7,40})/", text)) | set(re.findall(r"commit `([0-9a-f]{7,40})`", text))


def check_own_guide(lang: str, path: Path, source: str, commit: str | None, version: str | None) -> list[str]:
    """A guide of this project: grounded numbers, real guides, pinned commit."""
    errors = []
    text = path.read_text(encoding="utf-8")
    name = f"[{lang}] references/{path.name}"
    cited = {r for r in cited_references(text) if r.startswith("guide-")}
    for guide in sorted(cited):
        if f"references/{guide}" not in source:
            errors.append(f"{name} cites a guide not in A11Y.md's loading map: {guide}")
    ground = numbers(source)
    for guide in cited:
        pinned = ROOT / "upstream" / lang / "references" / guide
        if pinned.exists():
            ground |= numbers(pinned.read_text(encoding="utf-8"))
    for n in sorted(numbers(text) - ground):
        errors.append(f"{name} number with no ground in A11Y.md: {n}")
    for c in cited_commits(text):
        if commit and not commit.startswith(c):
            errors.append(f"{name} cites commit {c}, not the pinned {commit[:7]}")
    errors += link_errors(name, lang, text, source, version)
    if path.name.startswith("figma-") and path.name != "figma-nodes.md":
        namesake = "guide-" + path.name.removeprefix("figma-")
        if namesake not in cited:
            errors.append(f"{name} does not link the A11Y.md guide it translates: {namesake}")
        elif not (ROOT / "upstream" / lang / "references" / namesake).exists():
            errors.append(f"{name} translates {namesake}, which is not pinned in upstream/")
    return errors


def check_edition(lang: str, cfg: dict, text: str, source: str, blocks: dict[str, str], commit: str | None, version: str | None) -> list[str]:
    errors = []
    found = {m.group("name"): m.group("body") for m in MARKER.finditer(text)}
    for name, expected in blocks.items():
        if name not in found:
            errors.append(f"[{lang}] missing block: <!-- compiled:{name} -->")
        elif found[name] != expected:
            errors.append(f"[{lang}] block diverges from the pinned source: {name} (run tools/compile.py)")

    if commit:
        for c in cited_commits(text):
            if not commit.startswith(c):
                errors.append(f"[{lang}] cited commit {c} differs from the pinned {commit[:7]}")

    own = MARKER.sub("", text)
    for n in sorted(numbers(own) - numbers(source)):
        errors.append(f"[{lang}] number with no ground in A11Y.md: {n}")

    cited_guides = {r for r in cited_references(text) if r.startswith("guide-")}
    source_guides = {r for r in cited_references(source) if r.startswith("guide-")}
    own_dir = ROOT / "docs" / lang / "references"
    translated = {"guide-" + f.name.removeprefix("figma-") for f in own_dir.glob("figma-*.md")}
    for guide in sorted(cited_guides - source_guides):
        errors.append(f"[{lang}] cited guide not in A11Y.md's loading map: {guide}")
    for guide in sorted(cited_guides - DIRECT_FROM_A11Y.keys()):
        errors.append(f"[{lang}] links A11Y.md's {guide} directly; the map links this project's figma-*.md guide")
    for guide in sorted(source_guides - translated - cited_guides - NOT_ON_CANVAS.keys()):
        errors.append(f"[{lang}] A11Y.md guide with no figma-*.md translation, no direct link and no NOT_ON_CANVAS entry: {guide}")
    for guide in sorted((translated | cited_guides) & NOT_ON_CANVAS.keys()):
        errors.append(f"[{lang}] guide listed as NOT_ON_CANVAS but translated or linked: {guide}")
    errors += link_errors(f"[{lang}]", lang, text, source, version)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="check only, never write")
    args = parser.parse_args()

    provenance = PROVENANCE.read_text(encoding="utf-8")
    commit_m = re.search(r"Commit \| `([0-9a-f]{40})`", provenance)
    commit = commit_m.group(1) if commit_m else None
    errors: list[str] = [] if commit else ["upstream/UPSTREAM.md has no pinned commit"]

    # Every pinned file is declared, and matches its declared sha256.
    declared = dict(re.findall(r"\| (?:en|pt-BR) \| `([^`]+)` \| `([0-9a-f]{64})` \|", provenance))
    pinned = {str(f.relative_to(ROOT)) for f in (ROOT / "upstream").rglob("*.md") if f != PROVENANCE}
    for rel in sorted(pinned - declared.keys()):
        errors.append(f"pinned file missing from UPSTREAM.md: {rel}")
    for rel, sha in sorted(declared.items()):
        f = ROOT / rel
        if not f.exists():
            errors.append(f"UPSTREAM.md lists a file that does not exist: {rel}")
        elif hashlib.sha256(f.read_bytes()).hexdigest() != sha:
            errors.append(f"pinned file does not match its sha256 in UPSTREAM.md: {rel}")

    texts = {}
    versions = {lang: version_of(cfg["edition"].read_text(encoding="utf-8")) for lang, cfg in EDITIONS.items()}
    if None in versions.values() or len(set(versions.values())) != 1:
        errors.append(f"the editions must declare the same version: {versions}")
    version = versions["en"]
    for lang, cfg in EDITIONS.items():
        if str(cfg["source"].relative_to(ROOT)) not in declared:
            errors.append(f"[{lang}] pinned A11Y.md core is not declared in UPSTREAM.md")

        source = cfg["source"].read_text(encoding="utf-8")
        text = cfg["edition"].read_text(encoding="utf-8")
        blocks = extract(source, cfg)

        if not args.check:
            def swap(m: re.Match) -> str:
                if m.group("name") not in blocks:
                    raise SystemExit(f"[{lang}] marker with no extractor: {m.group('name')}")
                return m.group(1) + blocks[m.group("name")] + m.group(4)
            new = MARKER.sub(swap, text)
            if version:
                new = absolutize(new, version, lang, in_references=False, commit=commit)
            if new != text:
                cfg["edition"].write_text(new, encoding="utf-8")
                print(f"[{lang}] blocks and links recompiled")
            text = new
            for folder, in_refs in (("references", True), ("templates", False)):
                for guide in sorted((ROOT / "docs" / lang / folder).glob("*.md")):
                    old = guide.read_text(encoding="utf-8")
                    new = absolutize(old, version, lang, in_references=in_refs, commit=commit) if version else old
                    if new != old:
                        guide.write_text(new, encoding="utf-8")
                        print(f"[{lang}] links and commit written in {folder}/{guide.name}")

        texts[lang] = text
        errors += check_edition(lang, cfg, text, source, blocks, commit, version)
        for guide in sorted((ROOT / "docs" / lang / "references").glob("*.md")):
            errors += check_own_guide(lang, guide, source, commit, version)

    # Parity between the editions.
    if structure(texts["en"]) != structure(texts["pt-BR"]):
        errors.append("en and pt-BR editions have different section structure")
    if cited_references(texts["en"]) != cited_references(texts["pt-BR"]):
        errors.append("en and pt-BR editions cite different reference files")
    ref_en = {p.name for p in (ROOT / "docs" / "en" / "references").glob("*.md")}
    ref_pt = {p.name for p in (ROOT / "docs" / "pt-BR" / "references").glob("*.md")}
    if ref_en != ref_pt:
        errors.append(f"reference files differ between languages: {sorted(ref_en ^ ref_pt)}")
    for ref in sorted(ref_en & ref_pt):
        en = (ROOT / "docs" / "en" / "references" / ref).read_text(encoding="utf-8")
        pt = (ROOT / "docs" / "pt-BR" / "references" / ref).read_text(encoding="utf-8")
        if structure(en) != structure(pt):
            errors.append(f"references/{ref} has different section structure in en and pt-BR")
        if cited_references(en) != cited_references(pt):
            errors.append(f"references/{ref} cites different files in en and pt-BR")
    tpl_en = {p.name for p in (ROOT / "docs" / "en" / "templates").glob("*.md")}
    tpl_pt = {p.name for p in (ROOT / "docs" / "pt-BR" / "templates").glob("*.md")}
    if tpl_en != tpl_pt:
        errors.append(f"template files differ between languages: {sorted(tpl_en ^ tpl_pt)}")
    for tpl in sorted(tpl_en & tpl_pt):
        en = (ROOT / "docs" / "en" / "templates" / tpl).read_text(encoding="utf-8")
        pt = (ROOT / "docs" / "pt-BR" / "templates" / tpl).read_text(encoding="utf-8")
        if structure(en) != structure(pt):
            errors.append(f"templates/{tpl} has different section structure in en and pt-BR")
    for lang in EDITIONS:
        own_refs = {r for r in cited_references(texts[lang]) if not r.startswith("guide-")}
        for missing in sorted(own_refs - ref_en):
            errors.append(f"[{lang}] cites a reference that does not exist here: {missing}")

    if errors:
        print("FAIL — DA11Y.md diverges from the pinned A11Y.md or between languages:")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("OK — compiled blocks match the pinned A11Y.md in both languages; numbers, guides and language parity hold, in the edition and in this project's guides.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
