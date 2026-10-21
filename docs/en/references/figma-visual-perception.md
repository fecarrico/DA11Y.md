# Color and contrast on the canvas — paints, variables, modes and the pair matrix

> **Scope:** color in Figma nodes: the `fills`, `strokes` and `effects` of text, shapes and frames, the variables bound to them, the modes they resolve in (light, dark and any other the file uses), and the palette when the task creates or changes it.
> **Translates:** A11Y.md [`guide-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-visual-perception.md), pinned at commit `9fb9a02`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where color lives in nodes

| What | Node and property | Rule |
| :--- | :--- | :--- |
| Text color | `fills` of the `TEXT`. In text with different ranges, such as a link inside a paragraph, `fills`, `fontSize` and `fontWeight` return `figma.mixed`, and the reading is per range, with `getStyledTextSegments` | measured against what is behind it, never against white by default. Each range with its own color or size is a pair |
| What is behind | `fills` of the nearest ancestor that has one, or of a shape under the node (`children` run back to front, so the one under it comes earlier) | the stacking decides the background, not the layer tree alone |
| Border, icon, focus ring | `strokes` and `strokeWeight` of the `FRAME` or shape, `fills` of an icon's shapes | measured against the adjacent color |
| Shadow | `effects` | never the only boundary or the only focus, because it disappears in high-contrast mode |
| Transparency | the `opacity` of each paint, because a `SOLID` color has no alpha, the `opacity` of the node and that of each ancestor. Read straight from the variable, the color carries its alpha in the `a` channel | multiply the opacities and blend the color over what is behind it before applying the formula |
| Token | `boundVariables` shows which variable is bound to the paint | a paint with no variable keeps the same value in every mode. Measure it against the background of each mode and report its origin |
| Mode | `resolvedVariableModes` says which mode applies to the node. The Plugin API returns the value in that mode with `variable.resolveForConsumer(node)` | through the REST API only the variable's id comes back (the variables endpoint is Enterprise-only). With no value, the pair is "not tested", never estimated |
| Text over an image | the scrim between them, a shape or frame with its own `fills` | measured in the worst case of the image, see [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-images.md) and [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-media.md) |
| Text over a gradient | `gradientStops` of the `GRADIENT_LINEAR`, `GRADIENT_RADIAL`, `GRADIENT_ANGULAR` or `GRADIENT_DIAMOND` paint | the stops are not enough, because between two of them the color can have less contrast than both ends under sRGB interpolation, which is CSS's default. Measure points along the whole gradient, between each pair of neighboring stops, and use the worst. If it passes, the pair passes. If it does not, the pair stays "not measured" until someone checks the stretch behind the text |

## 2. Modes, states and the pair matrix

The unit of evidence is the **pair**: a color that carries meaning and the color it sits on.

- **Enumerate the pairs** of the evaluated frame: text on background, border on background, icon on background, focus ring on the adjacent color.
- **Every state** the variants have.
- **Every mode the file uses:** the modes found in `resolvedVariableModes` of the evaluated frames, and any mode a `SET_VARIABLE_MODE` action switches to. The mode on screen is only one of them.
- **Measuring another mode does not change the design.** Read the variable's value in that mode from `valuesByMode`, or from `valuesByModeForCollectionAsync(collection)` when the collection is an extension, and follow each `VARIABLE_ALIAS` to the final value, because these reads do not resolve aliases. In the alias's collection, the mode is the one the node's `resolvedVariableModes` gives for it. Switching the evaluated frame's mode changes the design without authorization (DA11Y.md Section 2).
- A pair whose value cannot be resolved in some mode is listed as "not tested" in that mode.

## 3. What to measure

The text, interface-part and focus pairs of Section 2 are measured at the profile's floors (DA11Y.md Section 3). What this guide adds:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Secondary metadata (badges) or a dense dashboard, at 10px | `fontSize` and the pair | only with 7:1 and an [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/EXCEPTIONS.md) entry (A11Y.md rule† density exception). Never body text or table data |
| Disabled | the pairs of the Disabled variant | measured and reported, with no floor: an inactive component is exempt (SC 1.4.3, SC 1.4.11). Its unavailability is not shown by color alone |
| Grayscale reading | the relative luminance of the paints that set states, levels or series apart | the hierarchy still reads. Paints that differ only in hue merge in grayscale: report them |
| Colors that must be told apart (two statuses, two series) | Delta E between the two paints | ΔE > 20 is noticeable for most people, ΔE > 40 is safe for colorblind people. The source does not name the ΔE formula: to confirm. A second channel is still required |
| Thin or small text | APCA Lc for text with a light weight or a small `fontSize` | Lc 60 for body text is the source's advice. A supplement only: it never replaces the WCAG ratio |

A simulator result (protanopia, deuteranopia, tritanopia) is never the agent's claim: the grayscale and luminance rows are the canvas computations, and a person may run the simulators.

## 4. What becomes an annotation

A measured contrast is not a proposal, because the floor is a rule (DA11Y.md Section 4). The measured pairs go into the report's pair table, with variables and resolved values, state, mode, ratio, floor and result ([`REPORT.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/templates/REPORT.md) §1). On the canvas, only a failing pair gets an annotation, on its own node, in the short format of DA11Y.md Section 5. After the severity, with its color and name, it says `Library:` when the color comes from the library's component, variable or style, and `Here:` when it comes from this file, such as an override or a color with no variable. The ratio and the floor stay in the report. Pin the `fills` or the `strokes` on the annotation, and also the `strokeWeight` for focus and the `opacity` when it changed the result. That way the evidence follows the value.

What the canvas cannot show becomes a `❓` line, in the `Proposal` category:

- **Which setting selects each mode:** the system theme, the system's contrast preference or a product preference.
- **Conflicting needs:** when a mode serves one group and hurts another (high contrast and brightness sensitivity), name both groups and take the choice to the person.

```markdown
🟠 HIGH · Library: "Due today" too light on the raised surface, in Dark mode (text/secondary)
```

## 5. When the task creates or changes the palette

Creating or changing variables, modes or color styles on request is the authorization of DA11Y.md Section 2.2, and the moment contrast is decided, so the palette is checked as it is born:

1. **Enumerate the intentional pairs** the variables will form: text on background and interface part on background, with the states and every mode.
2. **Compute each pair's WCAG ratio** on the values, in each mode, at definition time.
3. **Adjust luminance, not only hue,** until every pair clears the profile's floor (disabled pairs have none, Section 3).
4. **Record the pair matrix** (pair → measured ratio, per mode) in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/A11Y-DECISIONS.md), as one contrast item per pair in the Section 2.2 contract. The values feed the pair table of [`REPORT.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/templates/REPORT.md) §1. The matrix does not become an annotation, not even on the frame that documents the palette, because an annotation exists only when there is something to do (DA11Y.md Section 2.1).

## 6. Anti-patterns on the canvas

- **Measuring only the mode on screen** and declaring the whole palette.
- **The value of the wrong mode**, read from the variable instead of resolved for the node.
- **Switching the evaluated frame's mode** to measure another mode.
- **Reading text with ranges of different colors as a single color.** The link inside the paragraph is another pair.
- **Measuring a gradient at its stops only.**
- **Fixing a failing pair by changing the hue only.**
- **An APCA score presented as WCAG conformance.**

## 7. What stays for code

Contrast in the built product, the system's theme and contrast preferences and high-contrast mode are implemented following A11Y.md [`guide-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-visual-perception.md); its verification protocol runs on the built product and enters the report as requirements for development.
