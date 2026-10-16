# Images on the canvas — image, icon, illustration and avatar

> **Scope:** every picture on the screen (shapes with an image fill, icons, illustrations, avatars), its class by the removal test and its alternative text, described in Figma nodes.
> **Translates:** A11Y.md [`guide-images.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-images.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where images show up in nodes

The Plugin API has no alternative text field. The class and the text of each image live in an annotation (Section 4), so every image needs a node that accepts one.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Photo or picture | a `RECTANGLE`, `ELLIPSE` or other shape whose `fills` holds an image | a shape with an image fill is an image |
| Icon | an `INSTANCE` of an icon component, with `VECTOR` or `BOOLEAN_OPERATION` inside | `BOOLEAN_OPERATION` accepts no annotation: annotate the icon instance |
| Icon inside a button or link | the icon `INSTANCE` inside the interactive `FRAME` | a functional image: its name is the action, on the control ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md) Section 5) |
| Illustration | a `FRAME` or `INSTANCE` holding the vectors | one annotation on the container, not one per vector. Made of a `GROUP`, it has no place for the annotation, and that is a warning |
| Avatar | a shape with the photo as fill, or an `INSTANCE` with initials in a `TEXT` | the removal test decides, in the context of each use |
| Chart or diagram | a `FRAME` with the drawing | a complex image: [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-charts.md) |

## 2. The removal test and the three classes

The removal test (DA11Y.md Section 2.1) runs per use: the content comes from the image and the purpose from the context, so the same photo can be decorative on one screen and informative on another. The class belongs to each use, not to the component.

| The person loses | Class | Draft alternative text |
| :--- | :--- | :--- |
| information | **informative** | the conclusion: "Bar chart showing a 20% sales growth in the first quarter", not "Sales chart" |
| a function (link or button) | **functional** | the action: "Print document", not "Printer icon" |
| nothing | **decorative candidate** | empty, only after the person confirms |

- **Decorative is a human decision** (DA11Y.md Section 2.1): an empty alternative applied without confirmation hides a possibly informative image, and no automated checker catches it.
- **Straight to the point:** no "Image of…" or "Photo of…". The screen reader already says it is an image.
- **Borderline cases** (a hero image that is arguably decorative) are pattern-level decisions: record them in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md) and reuse them.
- **An unresolved image blocks delivery:** functional 🔴, informative 🟠.

## 3. What to measure

Beyond the profile's floor (DA11Y.md Section 3), specific to images:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Icon or graphic that carries meaning | the vectors' `fills` or `strokes` against the nearest ancestor fill | the profile's floor (DA11Y.md Section 3) |
| Avatar initials | the `TEXT` `fills` against the avatar fill | the profile's floor (DA11Y.md Section 3) |
| Text over an image | the `TEXT` `fills` against the scrim, in the worst case | the profile's floor, measured as in [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-media.md) Section 5 |

## 4. What becomes an annotation

An image that is read goes into the annotation of the element that holds it, or into its own annotation, on the node that shows it. For a functional image it goes on the interactive `FRAME` or `INSTANCE`, because the action belongs to the control.

- **Informative or functional image:** a `🔊` line, with the draft alternative text.
- **Decorative candidate:** stays out of the annotation. It goes into the report as not read, with the answer to the removal test, for the person to confirm.
- **Complex image:** the conclusion in the alternative and the data in an equivalent table ([`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-charts.md)).
- **Hiding from the screen reader** only for a confirmed decorative image, never for an informative one.

Pin `fills` or `strokes` on the icon with the measured ratio, and `minWidth` and `minHeight` on the interactive frame.

```markdown
4 · product image
🔊 image "Blue running shoe, side view"
```

## 5. When the image comes from the person

A pasted screenshot, an uploaded asset or a referenced file gets its alternative before it enters the design.

1. **Check what you can perceive.** If you can see the image (multimodal input or an image-reading tool), describe it. If you cannot, ask the person for the description in the same turn. An alternative deduced from the layer name or the file name is fabricated evidence.
2. **Classify by the removal test** (Section 2).
3. **Propose, and the person decides.** The agent's reading of an image is a hypothesis, not evidence, so the confirmation is explicit.

## 6. When the task creates or changes an icon or image component in the design system

- **Description:** what it is, when to use it, its aliases ("Icon. Aliases: glyph, symbol, pictogram.") and the line "class and alternative text are decided per use, in an annotation on the instance".
- **Properties:** the icon as `INSTANCE_SWAP`, so each use swaps the icon instead of redrawing it.

## 7. Anti-patterns on the canvas

- **An alternative taken from the layer name or the file name.**
- **"Decorative" without the person's confirmation.**
- **A vague alternative**, one that starts with "Image of…", or a functional icon described by its looks.
- **An image made of a `GROUP`**, with no place for the evidence.
- **Text over an image with no measured scrim.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-images.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-images.md); its verification scenarios run on the built product and enter the report as requirements for development.
