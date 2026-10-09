# Provenance of the pinned A11Y.md copies

DA11Y.md compiles its shared blocks from the two cores, and grounds the numbers of its own guides in the core and in the A11Y.md guides they translate. Never edit these files by hand.

| Field | Value |
| :--- | :--- |
| Version | 2.3.0 |
| Commit | `57564be72e7d2c8e349f4cc2971cdb27f9043863` |
| Source | https://github.com/fecarrico/A11Y.md (MIT) |

| Edition | File | sha256 |
| :--- | :--- | :--- |
| en | `upstream/en/A11Y.md` | `85fba8924d1de3d6a58dd0e150598f4faf29174c0b47a7e0a914b2178d60cb06` |
| pt-BR | `upstream/pt-BR/A11Y.md` | `3275e9a2a7bfef8a0450f6f14c915e977c3eb66d80abb73f6754cfca9f475b1a` |
| en | `upstream/en/references/guide-forms.md` | `3e4a013c60a0b9939ba705dd8caf0e07e02c7c8b736beae6ec654ff8ac97401e` |
| en | `upstream/en/references/guide-cognitive.md` | `3bc9dcabc752695ff89774cc1a306279dc39992c4a4c5f73929a37ca5f654b60` |
| en | `upstream/en/references/guide-form-controls.md` | `5f0c419d89b07ac29c6ff63711caa0cba51ca860e0ba6f3c1c5b277a854a9608` |
| pt-BR | `upstream/pt-BR/references/guide-forms.md` | `2c80b43bdf2c20bddf397ccc3c972b7e176f737645313034d3d35713b0a3136c` |
| pt-BR | `upstream/pt-BR/references/guide-cognitive.md` | `413ae56016a46655808b022e4304308dc108f11c05c7efcac99718e593c31067` |
| pt-BR | `upstream/pt-BR/references/guide-form-controls.md` | `49d483499591eb0cb7dcc40ae2c73394b9112fa1a67f74eb7d910a94e784771e` |

## Updating to a new A11Y.md version

1. Download both cores and every pinned guide at a fixed tag or commit: `https://raw.githubusercontent.com/fecarrico/A11Y.md/<tag-or-commit>/docs/<lang>/A11Y.md` and `.../docs/<lang>/references/<guide>.md`.
2. Update the commit and every sha256 value in this file, and the commit cited at the top of each `DA11Y.md` edition and of each `figma-*.md` guide. When a pinned guide changed, review the guide that translates it.
3. Run `python3 tools/compile.py`, review the diff of the compiled blocks, and confirm with `python3 tools/compile.py --check`.
