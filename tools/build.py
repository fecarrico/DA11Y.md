#!/usr/bin/env python3
"""Build the Figma drawing tools from their sources, so the agent reads only what it runs.

handoff.js and report.js share their drawing code (theme, markers, cards, copies of
the screen), which lives once in tools/src/common.js. Each output is its part's
header, then common.js, then the rest of its part, then its exports.

Usage:
  python3 tools/build.py            # write tools/handoff.js and tools/report.js
  python3 tools/build.py --check    # check only; exit 1 when an output is stale

Standard library only, like the other tools.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "tools" / "src"
OUTPUTS = {
    "handoff.js": ("handoff-page.js", ["handoff", "parse", "distance", "nearestSide", "layoutMarkers", "ratio", "focusVariantOf", "PROFILES", "HOUSE_GAP", "WORDS"]),
    "report.js": ("report-page.js", ["reportPage", "blocks", "inline", "columnWidths", "linkFrames", "nearestSide", "layoutMarkers", "ratio", "WORDS"]),
}


def build(part: str, exports: list[str]) -> str:
    text = (SRC / part).read_text(encoding="utf-8")
    lines = text.split("\n")
    n = 0
    while n < len(lines) and (lines[n].startswith("//") or not lines[n].strip()):
        n += 1
    header, body = "\n".join(lines[:n]).rstrip() + "\n", "\n".join(lines[n:]).strip() + "\n"
    common = (SRC / "common.js").read_text(encoding="utf-8").strip() + "\n"
    tail = "\nif (typeof module !== \"undefined\") {\n  module.exports = { " + ", ".join(exports) + " };\n}\n"
    return header + "\n" + common + "\n" + body + tail


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="check only, never write")
    args = parser.parse_args()
    stale = []
    for out, (part, exports) in OUTPUTS.items():
        text = build(part, exports)
        path = ROOT / "tools" / out
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != text:
                stale.append(out)
        else:
            path.write_text(text, encoding="utf-8")
            print(f"built tools/{out}")
    if stale:
        print("stale, run python3 tools/build.py: " + ", ".join(stale))
        return 1
    if args.check:
        print("OK — tools/handoff.js and tools/report.js match their sources.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
