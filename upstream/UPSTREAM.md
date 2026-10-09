# Provenance of the pinned A11Y.md copies

DA11Y.md compiles its shared blocks from these files. Never edit them by hand.

| Field | Value |
| :--- | :--- |
| Version | 2.3.0 |
| Commit | `57564be72e7d2c8e349f4cc2971cdb27f9043863` |
| Source | https://github.com/fecarrico/A11Y.md (MIT) |

| Edition | File | sha256 |
| :--- | :--- | :--- |
| en | `upstream/en/A11Y.md` | `85fba8924d1de3d6a58dd0e150598f4faf29174c0b47a7e0a914b2178d60cb06` |
| pt-BR | `upstream/pt-BR/A11Y.md` | `3275e9a2a7bfef8a0450f6f14c915e977c3eb66d80abb73f6754cfca9f475b1a` |

## Updating to a new A11Y.md version

1. Download both cores at a fixed tag or commit: `https://raw.githubusercontent.com/fecarrico/A11Y.md/<tag-or-commit>/docs/<lang>/A11Y.md`.
2. Update the commit and both sha256 values in this file, and the commit cited at the top of each `DA11Y.md` edition.
3. Run `python3 tools/compile.py`, review the diff of the compiled blocks, and confirm with `python3 tools/compile.py --check`.
