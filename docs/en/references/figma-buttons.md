# Buttons on the canvas — text button, icon-only button and actions

> **Scope:** the button in every form (primary, secondary, text, icon-only), its label, states and target, and what looks like a button without being one, in Figma nodes.
> **Translates:** A11Y.md [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-buttons.md), with [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md) §6 (disabled), pinned at commit `57564be`. Trailing actions inside a field are in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Anything that looks and acts like a button is an **instance of the library's button**. Drawn by hand, it is the canvas form of the clickable div (A11Y.md core §6): no states, no target, nothing for code to map.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Button | `COMPONENT_SET` with a `State` variant property; each use is an `INSTANCE` | no button for the case in the library is a warning (DA11Y.md Section 2), drawn only with authorization |
| Interactive frame | `COMPONENT` with horizontal auto layout and padding | its box is the **target**: measure the frame, never the icon or the text inside it |
| Label | `TEXT` inside the frame, exposed as a `TEXT` component property named "Label" | says what the button does: "Download report", never "Click here" |
| Icon | an icon `INSTANCE`, swappable with `INSTANCE_SWAP` | in an icon-only button it is the only visible cue: 3:1 (Section 3) and a name in an annotation (Sections 4 and 5) |
| Group of buttons (dialog footer, toolbar) | `FRAME` with auto layout, never a `GROUP` | the auto layout order is the focus order. A child with `layoutPositioning: ABSOLUTE` leaves it |

## 2. States the component must have

`State` has at least **Default, Focus and Disabled**, plus every other state the product shows (Hover, Pressed), on each kind of button the set offers.

- **Focus.** Measure it on every kind of button: a ring that passes on a light button can fail on a dark one.
- **Hover.** When only a tooltip shown on hover names the action, the button still needs its name annotation ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-tooltips-popovers.md)).
- **Disabled.** Exempt from contrast as an inactive component (SC 1.4.3 and 1.4.11), but grey alone does not say why (SC 1.4.1): a visible `TEXT` next to the button gives the reason, at the profile's text floor. No visible reason is a warning.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Icon of an icon-only button | the icon `fills` or `strokes` against the frame `fills` | 3:1 (meaningful graphic, SC 1.4.11) |
| What shows a button is there | the frame `fills` or `strokes` against the color around the button | 3:1 when that is the only cue (SC 1.4.11). When the label alone identifies the action, the reading is debatable: state the doubt (DA11Y.md Section 2), never swap the token |
| How it is triggered | `reactions` of the instance | an `ON_CLICK` or `ON_PRESS`. An action reached only through `ON_HOVER`, `MOUSE_ENTER` or `ON_DRAG` has no tap path (🔴, DA11Y.md Section 1) |

## 4. What becomes an annotation

On the button instance:

- **Name.** The visible label, or, when it needs more ("Edit" repeated down a list), a name that contains it in the same order: "Edit invoice 482" (SC 2.5.3).
- **Role, when the look misleads.** A button whose reaction goes to another screen or opens a `URL` is a link; a text link that runs an action is a button; a clickable card says what it is.
- **Disabled, which kind.** Removed from the focus order, or still reachable so the person hears the reason, as a submit button waiting for required fields.
- **Announcement**, with its exact text, when the button changes the screen without taking the person anywhere: "Added to cart".

Pin `minWidth`, `minHeight` and `fills` on the button frame, `fills` and `fontSize` on the label, `strokes` and `strokeWeight` on the Focus variant ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4).

```markdown
**Agent suggestion — confirm**
Icon-only button · name: Close modal · role: button
Target: frame 44×44 (minWidth/minHeight pinned), icon 3:1 against the frame
```

## 5. Names that work out of context, and icon-only buttons

- **Each name works alone**, because screen reader users list every button on the screen to move around: "Download report", never "Click here" or "Learn more".
- **The icon-only button's name says what it does** ("Close modal", "Search"), never the icon ("X", "magnifier") or a file or component name ("ic_close_24").
- **Name the instance layer for the action**: the next agent reads layer names as a hint ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 1), and "Icon 3" misleads it. The name still lives in the annotation.

## 6. When the task creates or changes the button in the design system

- **Description:** "Button. Use it to run an action on this screen: submit, save, open a dialog. Do not use it to go to another page (use Link). Aliases: button, CTA, action, icon button."
- **Properties:** `State` (VARIANT), `Variant` (VARIANT: Primary, Secondary, Text), `Label` (TEXT), `Icon only` (BOOLEAN), `Icon` (INSTANCE_SWAP).

## 7. Anti-patterns on the canvas

- **A button drawn by hand**: a `RECTANGLE` and a `TEXT`, or a `GROUP`, styled like the library's button.
- **An icon-only button with no name**, or named after its icon.
- **A label cut with an ellipsis** in a fixed-width button.
- **A disabled button with no visible reason.**
- **An action that exists only on hover.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-buttons.md); its verification scenarios run on the built product and enter the report as requirements for development.
