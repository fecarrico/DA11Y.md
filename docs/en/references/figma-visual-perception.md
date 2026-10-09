# Color and contrast on the canvas — paints, variables, modes and the pair matrix

> **Scope:** color in Figma nodes: the `fills`, `strokes` and `effects` of text, shapes and frames, the variables bound to them, the modes they resolve in (light, dark and any other the file uses), and the palette when the task creates or changes it.
> **Translates:** A11Y.md [`guide-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-visual-perception.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where color lives in nodes

| What | Node and property | Rule |
| :--- | :--- | :--- |
| Text color | `fills` of the `TEXT` | measured against what is behind it, never against white by default |
| What is behind | `fills` of the nearest ancestor that has one, or of a shape under the node (`children` run back to front, so the one under it comes earlier) | the stacking decides the background, not the layer tree alone |
| Border, icon, focus ring | `strokes` and `strokeWeight` of the `FRAME` or shape, `fills` of an icon's shapes | measured against the adjacent color |
| Shadow | `effects` | never the only boundary or the only focus, because it disappears in high-contrast mode |
| Transparency | `opacity` of the node and of each ancestor | blend the color over what is behind it before applying the formula |
| Token | `boundVariables` shows which variable is bound to the paint | a paint with no variable keeps the same value in every mode. Measure it against the background of each mode and report its origin |
| Mode | `resolvedVariableModes` says which mode applies to the node. The Plugin API returns the value in that mode with `variable.resolveForConsumer(node)` | through the REST API only the variable's id comes back (the variables endpoint is Enterprise-only). With no value, the pair is "not tested", never estimated |
| Text over an image | the scrim between them, a shape or frame with its own `fills` | measured in the worst case of the image, see [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-images.md) and [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-media.md) |

## 2. Modes, states and the pair matrix

The unit of evidence is the **pair**: a color that carries meaning and the color it sits on.

- **Enumerate the pairs** of the evaluated frame: text on background, border on background, icon on background, focus ring on the adjacent color.
- **Every state** the variants have: Default, Hover, Focus, Error, Disabled, Selected, as applicable.
- **Every mode the file uses:** the modes found in `resolvedVariableModes` of the evaluated frames, and any mode a `SET_VARIABLE_MODE` action switches to. The mode on screen is only one of them.
- A pair whose value cannot be resolved in some mode is listed as "not tested" in that mode.

## 3. What to measure

Every ratio is computed by the WCAG relative-luminance formula on the resolved value, in each mode, never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Text | the `TEXT` `fills` against what is behind it | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield, 3:1 under Launchpad (House Rule†) |
| Interface parts and meaningful graphics | `strokes` or `fills` of borders, icons and chart marks against the adjacent color | 3:1 (SC 1.4.11) |
| Focus | the Focus variant's `strokes` and `strokeWeight` against the adjacent color | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7) |
| Secondary metadata (badges) or a dense dashboard, at 10px | `fontSize` and the pair | only with 7:1 and an [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/EXCEPTIONS.md) entry (House Rule† density exception). Never body text or table data |
| Disabled | the pairs of the Disabled variant | measured and reported, with no floor: an inactive component is exempt (SC 1.4.3, SC 1.4.11). Its unavailability is not shown by color alone |
| State beyond color | the variants of each state side by side | an icon, a text or a shape changes too, not only the paint |
| Grayscale reading | the relative luminance of the paints that set states, levels or series apart | the hierarchy still reads. Paints that differ only in hue merge in grayscale: report them |
| Colors that must be told apart (two statuses, two series) | Delta E between the two paints | ΔE > 20 is noticeable for most people, ΔE > 40 is safe for colorblind people. The source does not name the ΔE formula: to confirm. A second channel is still required |
| Thin or small text | APCA Lc for text with a light weight or a small `fontSize` | Lc 60 for body text is the source's advice. A supplement only: it never replaces the WCAG ratio |

When a pair fails, the proposal changes **luminance** first (lighter against darker), not only the hue, and at the source (the variable or the library), never on the instance (DA11Y.md Section 2).

## 4. What becomes an annotation

A measured contrast is not a suggestion, because a rule decides it (DA11Y.md Section 4). The pair table goes into the report annotation on the evaluated frame (DA11Y.md Section 5): pair, variables and resolved values, state, mode, ratio, floor and result. A failing pair also gets an annotation on its node, in the **Accessibility** category, with `fills` or `strokes` pinned (and `strokeWeight` for focus, `opacity` when it changed the result), so the evidence follows the value.

What the canvas cannot show is suggested with the status `Agent suggestion — confirm`:

- **Which setting selects each mode:** the system theme, the system's contrast preference or a product preference.
- **Conflicting needs:** when a mode serves one group and hurts another (high contrast and brightness sensitivity), name both groups and take the choice to the person.

```markdown
Contrast · State=Default · mode Dark
"Due today": text/secondary on surface/raised → N:1 · Shield floor 7:1 · fails 🟠
Origin: variable text/secondary (library) · proposal: raise its luminance at the source · fix? awaiting the person
```

## 5. When the task creates or changes the palette

Creating or changing variables, modes or color styles on request is the authorization of DA11Y.md Section 2.2. It is also the moment contrast is decided, so the palette is checked as it is born:

1. **Enumerate the intentional pairs** the variables will form: text on background and interface part on background, with the states (hover, focus, disabled, error) and every mode.
2. **Compute each pair's WCAG ratio** on the values, in each mode, at definition time.
3. **Adjust luminance, not only hue,** until every pair clears the profile's floor (disabled pairs have none, Section 3).
4. **Record the pair matrix** (pair → measured ratio, per mode) in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md). The values feed the pair table of [`REPORT.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/REPORT.md) §1. On the canvas, the same matrix goes as an annotation on the frame that documents the palette.

The accessibility contract as data (DA11Y.md Section 2.2) has one contrast item per pair, with the result in each mode.

## 6. Anti-patterns on the canvas

- **Measuring only the mode on screen** and declaring the whole palette.
- **"Looks dark enough"**, or a ratio read from the swatch by eye.
- **The value of the wrong mode**, read from the variable instead of resolved for the node.
- **A shadow as the only boundary or focus.**
- **Fixing a failing pair by changing the hue only.**
- **Swapping a library variable or overriding an instance's paint** to make a pair pass, without authorization.
- **An APCA score presented as WCAG conformance.**

## 7. What stays for code

Contrast in the built product (the static gate recomputes the pairs of the report), the theme and contrast preferences of the system, and high-contrast mode are implemented following A11Y.md [`guide-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-visual-perception.md). Its verification protocol runs again on the built product and enters the design report as requirements for development. On the canvas, the grayscale and luminance checks are the Section 3 computations. A simulator result (protanopia, deuteranopia, tritanopia) is never the agent's claim, and a person may run the simulators on the canvas.
