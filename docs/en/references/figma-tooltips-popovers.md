# Tooltips and popovers on the canvas — trigger, tooltip and panel

> **Scope:** the tooltip (short text shown on hover and on focus of a control), the popover (a panel a control opens, which may hold controls) and their trigger, described in Figma nodes.
> **Translates:** A11Y.md [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tooltips-popovers.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Trigger | a button or link `INSTANCE` in its own `FRAME` | it receives focus, so it is a control, never a loose icon or plain text ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md)) |
| Tooltip | `COMPONENT`: a `TEXT` in an auto layout `FRAME` that hugs it | short text, read after the trigger's name |
| Popover | `COMPONENT` with a vertical auto layout `FRAME` | the auto layout order is the reading order, and each control inside is a target |
| Place next to the trigger | over the screen, for example with `layoutPositioning: ABSOLUTE` | out of the flow, its order comes from geometry, so the annotation says it is read right after the trigger |

Never a `GROUP` for any of them: no box to measure and no annotation.

## 2. States the component must have

- **Trigger: Default, Hover and Focus.** A missing Focus is a Section 2 warning: point it out and draw it only with authorization.
- **Tooltip on hover and on focus.** The frame that shows it open pairs it with the trigger's Focus variant too, or the annotation says it also appears on focus.
- **Popover open**, next to its trigger, with the trigger's look while it is open.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Tooltip and popover text | the `TEXT` `fills` against the tooltip's or popover's `fills` | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| Trigger icon | the icon's `fills` or `strokes` against the fill behind it | 3:1 (SC 1.4.11) |
| Trigger focus | the Focus variant's `strokes` and `strokeWeight` against the adjacent color | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7). A shadow in `effects` alone does not count |
| Trigger and popover targets | `width`, `height`, `minWidth`, `minHeight` of each `FRAME`, never the icon | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` around the trigger and between popover controls | 8px between neighboring targets (House Rule†) |
| Text that grows | `textAutoResize` of the text, `layoutSizingVertical` of its container | `HEIGHT` or `WIDTH_AND_HEIGHT` inside `HUG`. `TRUNCATE`, `maxLines` or a `FIXED` height cuts the text at 200% zoom |
| Font size | `fontSize` of tooltip and popover text | the profile's minimum font: 12px under Standard, 14px under Shield |
| Prototype | `reactions` | no `AFTER_TIMEOUT` hides the tooltip (SC 1.4.13) or the popover. The popover opens with `ON_CLICK` or `ON_PRESS`: opened only by `ON_HOVER` or `MOUSE_ENTER`, it is a hover-only action |

Hover in the prototype shows only the pointer path. The rest of SC 1.4.13 goes in the annotation.

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the trigger instance, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Trigger name.** With visible text, the name contains it in the same order (SC 2.5.3). Icon only: give the name.
- **Tooltip text, read after the name**, without opening anything, on desktop and on a phone.
- **Appears on hover and on keyboard focus.**
- **SC 1.4.13:** Esc closes it without moving focus. It stays when the pointer moves onto it. It stays until dismissed, until the trigger loses hover or focus, or until the information stops being valid. It never times out.
- **Popover:** opens with Enter, a click or a tap. Esc closes it. Its content, controls included, comes right after the trigger in the reading order.

Pin the measured value ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4): `minWidth` and `minHeight` on the trigger `FRAME`, `fills` and `fontSize` on the tooltip text.

```markdown
**Agent suggestion — confirm**
Trigger "Fee information" (icon-only button) · name: Fee information
Tooltip: "Fees apply to transfers abroad." (read after the name · on hover and on focus)
Esc closes it, focus stays on the trigger · stays under the pointer · never times out
```

## 5. Tooltip or popover

- **The tooltip never takes focus:** Esc closes it while focus stays on the trigger. A link or button inside it has no keyboard path (SC 2.1.1).
- **The popover is reached:** the person opens it, and every control inside it can be reached. Content with a control is a popover.

## 6. When the task creates or changes the tooltip or popover in the design system

The DA11Y.md Section 2.2 context layer:

- **Tooltip description:** "Tooltip. Use it for a short text about one control, shown on hover and on focus. Do not use it for content with links or buttons (use Popover). Aliases: hint, info bubble."
- **Popover description:** "Popover. Use it for a panel a control opens, which may hold links and buttons. Do not use it for a decision that needs an answer now (use Dialog). Aliases: flyout, hover card."
- **Properties:** the trigger's `State` (VARIANT) with Default, Hover and Focus, and the tooltip `Text` (TEXT).
- **Layers in reading order:** Trigger, then Tooltip text or Popover content.
- **Accessibility contract as data:** one item per check in Section 3, plus the SC 1.4.13 conditions, marked not tested until code verifies them.

## 7. Anti-patterns on the canvas

- **A tooltip on something that takes no focus**, such as a loose icon or plain text.
- **A tooltip drawn only with Hover**, with nothing saying it also appears on focus.
- **An `AFTER_TIMEOUT` that hides the tooltip or popover.**
- **A link or button inside a tooltip.**
- **A popover that opens only on hover.**

## 8. What stays for code

The trigger's role and name, the tie between trigger and tooltip, showing on focus, Esc without moving focus, staying under the pointer, never timing out, and the popover's opening, closing and place in the focus order are implemented following A11Y.md [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tooltips-popovers.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
