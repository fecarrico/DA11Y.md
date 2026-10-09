# Changelog

All notable changes to DA11Y.md. The shared blocks track A11Y.md, and each entry states the A11Y.md version it compiles from.

## [0.1.0] — unreleased (draft)

Compiled from A11Y.md 2.3.0, commit `57564be`.

- **First edition, in English and Portuguese.** The design edition of A11Y.md for whoever designs interfaces in design software, people and agents alike. Principle Zero, the compliance profiles and the severity model are compiled from A11Y.md and never edited here.
- **Section 2, "What already exists comes first".** The agent looks up the library and the prior rules, applies them as they are, evaluates the result, warns about every prior decision that affects accessibility and fixes only with explicit authorization. A WCAG failure the person decides not to fix becomes an `EXCEPTIONS.md` entry. Origin: a pilot with the Figma agent on a real corporate library, where the agent, following A11Y.md, replaced the library's brand colors and a component's border without any accessibility reason and without saying so.
- **Evidence as native annotations.** Each report becomes a Figma annotation in the Accessibility category on the evaluated frame. Origin: in the same pilot, the report and the decisions stayed in the chat, which never reaches the developer.
- **Section 4, "the agent suggests, the person confirms".** Reading order, headings, accessible names, alternative text, regions, announcements and language are suggested as annotations with the status `Agent suggestion — confirm`.
- **Section 2.2, the context layer for agents.** When the task creates or changes a design system, the agent also delivers the description with aliases, the accessibility contract as data, the anatomy in reading order and a library alias map. The practice follows Meta's Astryx.
- **`references/figma-nodes.md`.** Figma node types, property blocks, annotations, measurements and prototyping, from `@figma/plugin-typings` 1.141.0 and `figma/rest-api-spec` 0.44.0.
- **`tools/compile.py`.** Compiles the shared blocks in both languages and fails on a block that diverges from the pinned source, a number with no ground in A11Y.md, a guide outside A11Y.md's map, an A11Y.md guide left out of the Section 7 map with no recorded reason, or a structural difference between the languages.
- **Additional sources.** Magoo, by Marcelo Sales, and Astryx, by Meta, as non-normative references.
