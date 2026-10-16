# Tooltips and popovers on the canvas — trigger, tooltip and panel

> **Scope:** the tooltip (short text shown on hover and on focus of a control), the popover (a panel a control opens, which may hold controls) and their trigger, described in Figma nodes.
> **Translates:** A11Y.md [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tooltips-popovers.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Trigger | a button or link `INSTANCE` in its own `FRAME` | it receives focus, so it is a control, never a loose icon or plain text ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)) |
| Tooltip | `COMPONENT`: a `TEXT` in an auto layout `FRAME` that hugs it | short text, read after the trigger's name |
| Popover | `COMPONENT` with a vertical auto layout `FRAME` | the auto layout order is the reading order, and each control inside is a target |
| Place next to the trigger | over the screen, for example with `layoutPositioning: ABSOLUTE` | out of the flow, its order comes from geometry, so the annotation says it is read right after the trigger |

## 2. States the component must have

- **Trigger: Default, Hover and Focus.** A missing Focus is a Section 2 warning: point it out and draw it only with authorization.
- **Tooltip on hover and on focus.** The frame that shows it open pairs it with the trigger's Focus variant too, or the annotation says it also appears on focus.
- **Popover open**, next to its trigger, with the trigger's look while it is open.

## 3. What to measure, from the properties

Beyond the profile's floor (DA11Y.md Section 3), specific to the tooltip and the popover:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Prototype | `reactions` | no `AFTER_TIMEOUT` hides the tooltip (SC 1.4.13) or the popover. Opened only by `ON_HOVER` or `MOUSE_ENTER`, the popover is a hover-only action |

Hover in the prototype shows only the pointer path. The rest of SC 1.4.13 goes in the annotation.

## 4. What becomes an annotation

On the trigger instance (DA11Y.md Section 4):

- **Trigger name.** With visible text, the name contains it in the same order (SC 2.5.3). Icon only: give the name.
- **Tooltip text, read after the name**, without opening anything, on desktop and on a phone.
- **Appears on hover and on keyboard focus.**
- **SC 1.4.13:** Esc closes it without moving focus. It stays when the pointer moves onto it. It stays until dismissed, until the trigger loses hover or focus, or until the information stops being valid. It never times out.
- **Popover:** opens with Enter, a click or a tap. Esc closes it. Its content, controls included, comes right after the trigger in the reading order.

Pin the measured value ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4): `minWidth` and `minHeight` on the trigger `FRAME`, `fills` and `fontSize` on the tooltip text.

```markdown
3 · icon-only button
🔊 button "Fee information", with the description "Fees apply to transfers abroad."
```

## 5. Tooltip or popover

- **The tooltip never takes focus:** Esc closes it while focus stays on the trigger. A link or button inside it has no keyboard path (SC 2.1.1).
- **The popover is reached:** the person opens it, and every control inside it can be reached. Content with a control is a popover.

## 6. When the task creates or changes the tooltip or popover in the design system

- **Description, one per component:** "Tooltip. Use it for a short text about one control, shown on hover and on focus. Do not use it for content with links or buttons (use Popover). Aliases: hint, info bubble." and "Popover. Use it for a panel a control opens, which may hold links and buttons. Do not use it for a decision that needs an answer now (use Dialog). Aliases: flyout, hover card."
- **Properties:** the trigger's `State` (VARIANT) with Default, Hover and Focus, and the tooltip `Text` (TEXT).

## 7. Anti-patterns on the canvas

- **A tooltip on something that takes no focus**, such as a loose icon or plain text.
- **A tooltip drawn only with Hover**, with nothing saying it also appears on focus.
- **An `AFTER_TIMEOUT` that hides the tooltip or popover.**
- **A link or button inside a tooltip.**
- **A popover that opens only on hover.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tooltips-popovers.md); its verification scenarios run on the built product and enter the report as requirements for development.
