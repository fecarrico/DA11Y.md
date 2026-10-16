# Sign language on the canvas — Libras, automatic translators and the interpreter window

> **Scope:** screens for a Brazilian audience or any sign-language population: copy that automatic Libras translators can reach, copy that survives translation, the Libras interpreter window over a video and where an avatar stops being enough, described in Figma nodes.
> **Translates:** A11Y.md [`guide-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-sign-language-br.md), pinned at commit `57564be`. Plain language for microcopy is in [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-cognitive.md); the video itself, in [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-media.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

For most sign-language users, Libras is the first language and written Portuguese is the **second**. Automatic translators (avatar widgets) are best effort: they read the rendered text when the person clicks or selects it, and translate what the code exposes, in the quality the text offers. The design decides both halves: copy that becomes real text, and copy that survives translation.

## 1. Where it shows up in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Copy | `TEXT` | every word the person reads is a `TEXT` node. Words inside an image fill, or drawn as `VECTOR` shapes, reach no translator |
| Paragraph | one `TEXT` node per paragraph | never a wall of text in a single node: a translator truncates beyond its limit |
| Sentence with mixed styles | one `TEXT` node with styled segments (`getStyledTextSegments`) | never a sentence split across several `TEXT` nodes for styling, or one node per line: capture is per element, and fragments translate without context |
| Informative image | the shape, with its annotation ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-images.md)) | for at least one translator, the alternative text is the translatable content (SC 1.1.1) |
| Libras window | a `FRAME` in the video's frame | Section 5 |

## 2. Copy that survives translation

- **Plain language** ([`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-cognitive.md)) serves the second-language reader and measurably improves automatic translation.
- **Acronyms expanded on first occurrence** in the visible text (SC 3.1.4). A word missing from the sign dictionary is fingerspelled letter by letter (datilologia), the frustration Libras users report most with avatars.
- **Short blocks:** one paragraph per node, under about 500 to 1000 characters.

## 3. What to measure

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Copy is text | the nodes that show words: `TEXT`, image fills, `VECTOR` shapes | every word is in a `TEXT` node |
| Block size | the text of each `TEXT` node | one paragraph, under about 500 to 1000 characters |
| Fragmented sentence | neighboring `TEXT` nodes in the same auto layout | no sentence runs from one node into the next |
| Acronyms | the first occurrence of each acronym in the reading order | expanded in the visible text |
| Libras window placement | `absoluteBoundingBox` of the window and of the nodes around it | it covers no essential visual content. What the video itself shows is not readable on the canvas: ask |

## 4. What becomes an annotation

Each item is an annotation on the node it names:

- **Language** of the screen, on the screen frame, and of each passage in another language, on its `TEXT` (SC 3.1.1, 3.1.2). Translators assume the page language.
- **Acronym**, on the `TEXT`: the expansion, and that code marks it as an abbreviation.
- **Libras window**, on the frame of each prerecorded video with audio: does it exist, who produces it, by when.
- **Critical content** (health, legal, financial, assessments): a video with a human interpreter. Whether the content is critical is the person's call.
- **Translation widget:** best effort, declared as such on the accessibility page.

Pin `width` and `height` on the Libras window frame.

```markdown
2 · video "How to apply"
❓ Libras window: does it exist? Who produces it, by when?
```

## 5. The Libras window, and where the avatar stops

- **Prerecorded video with audio SHOULD offer a Libras interpretation window:** SC 1.2.6 (AAA), recommendation 5.14.6 of ABNT NBR 17225, and a recurring hard requirement in Brazilian public procurement. Under Shield, SC 1.2.6 applies, and skipping it is an [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/EXCEPTIONS.md) entry (DA11Y.md Section 0.1). Under Standard, it is a recommendation.
- **Captions do not replace it:** they are Portuguese, the second language.
- **The window follows the broadcast conventions (NBR 15290):** interpreter visible from the waist up, contrast with the background, no overlap with essential visual content.
- **An avatar does not reproduce the facial grammar of Libras.** Negation, question and intensity are facial in the language, and the interpreters' community formally rejects avatars as substitutes. For critical content, the widget is a complement, never the answer.
- **The widget is never what makes the site "accessible in Libras".** An icon or bar offered as that answer is the "accessible mode" anti-pattern of DA11Y.md Section 6.

## 6. When the task creates or changes the player in the design system

- **Description** of the player says when the window is on (prerecorded video with audio) and that captions do not replace it. Aliases: "Libras window", "sign language window", "interpreter window".
- **Properties:** `Libras window` (BOOLEAN), so each video turns the window on through a property.

## 7. Anti-patterns on the canvas

- **Copy inside an image or drawn as vectors.**
- **A sentence split across `TEXT` nodes**, or one node per line.
- **A wall of text in a single node.**
- **An acronym never expanded.**
- **Captions offered in place of the Libras window.**
- **The translation widget as the Libras answer**, or an avatar as the only path to critical content.
- **A Libras window over essential content.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-sign-language-br.md); its verification scenarios run on the built product and enter the report as requirements for development.
