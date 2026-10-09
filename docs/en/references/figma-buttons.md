# Buttons on the canvas — text button, icon-only button and actions

> **Scope:** the button in every form (primary, secondary, text, icon-only), its label, states and target, and what looks like a button without being one, in Figma nodes.
> **Translates:** A11Y.md [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-buttons.md), with [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md) §6 (disabled), pinned at commit `57564be`. Trailing actions inside a field are in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Anything that looks and acts like a button is an **instance of the library's button**. Drawn by hand, it is the canvas form of the clickable div (A11Y.md core §6): no states, no defined target, nothing for code to map.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Button | `COMPONENT_SET` with a `State` variant property; each use is an `INSTANCE` | if the library has no button for the case, that is a warning (DA11Y.md Section 2), drawn only with authorization |
| Interactive frame | `COMPONENT` with horizontal auto layout and padding around the content | its box is the **target**: measure the frame, never the icon or the text inside it |
| Label | `TEXT` inside the frame, exposed as a `TEXT` component property named "Label" | says what the button does: "Download report", never "Click here" |
| Icon | an icon `INSTANCE` inside the frame, swappable with `INSTANCE_SWAP` | in an icon-only button it is the only visible cue: 3:1 (Section 3) and a name in an annotation (Sections 4 and 5) |
| Disabled reason | `TEXT` next to the button, on the screen | visible text, at the profile's text floor |
| Group of buttons (dialog footer, toolbar) | `FRAME` with auto layout | the auto layout order is the reading and focus order. A child with `layoutPositioning: ABSOLUTE` leaves the flow. Never a `GROUP` |

## 2. States the component must have

The `State` property has at least **Default, Focus and Disabled**, plus every other state the product shows, such as Hover and Pressed, measured like the rest. Each kind of button the set offers (primary, secondary, text, icon-only) has all of them. A state the library lacks is a warning (DA11Y.md Section 2): point it out and draw it only with authorization.

- **Focus.** An outline of at least 2px at 3:1 against the adjacent color, made with `strokes` and `strokeWeight`. A shadow in `effects` alone does not count, because it disappears in high-contrast mode. Measure it on every kind of button: a ring that passes on a light button can fail on a dark one.
- **Hover.** When the only place that names the action is a tooltip shown on hover, the button still needs its name annotation ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-tooltips-popovers.md)).
- **Disabled.** The disabled button is exempt from contrast (inactive components, SC 1.4.3 and 1.4.11). Grey alone does not say why (SC 1.4.1), so a visible text gives the reason, and that text is not exempt. A disabled button with no visible reason is a warning.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Label | the label `TEXT` `fills` against the frame `fills`, in every state but Disabled | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| Icon of an icon-only button | the icon `fills` or `strokes` against the frame `fills` | 3:1 (meaningful graphic, SC 1.4.11) |
| What shows a button is there | the frame `fills` or `strokes` against the color around the button | 3:1 when that is the only cue (SC 1.4.11). When the label alone already identifies the action, the reading is debatable: state the doubt (DA11Y.md Section 2) and never swap the library token on your own |
| Focus | the Focus variant's `strokes` and `strokeWeight` against the adjacent color | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7) |
| Target | `width`, `height`, `minWidth` and `minHeight` of the button frame | 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` between neighboring buttons | 8px between neighboring targets (House Rule†) |
| Label that grows | `textAutoResize` of the label and `layoutSizingHorizontal` of the frame | `WIDTH_AND_HEIGHT` or `HEIGHT` inside a `HUG` frame. `TRUNCATE`, `maxLines` or a `FIXED` width cuts the label at 200% zoom |
| Font size | `fontSize` of the label | 12px under Standard, 14px under Shield |
| How it is triggered | `reactions` of the instance | the action has an `ON_CLICK` or `ON_PRESS`. An action reached only through `ON_HOVER`, `MOUSE_ENTER` or `ON_DRAG` has no tap path (🔴, DA11Y.md Section 1) |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the button instance, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Name.** When the visible label says it all, the label is the name. When the name needs more ("Edit" repeated down a list), the name contains the visible text, in the same order: "Edit invoice 482" (SC 2.5.3).
- **Role, when the look misleads.** A button that goes to another screen or opens a `URL` is a link that looks like a button. A link styled as text that runs an action is a button. A whole clickable card also needs to say what it is.
- **Disabled, which kind.** Removed from the focus order, because it truly cannot be used now. Or still reachable, so the person finds it and hears the reason, as a submit button waiting for required fields.
- **Announcement**, with its exact text, when pressing the button changes the screen without taking the person anywhere: "Added to cart".

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4). On the button frame, pin `minWidth`, `minHeight` and `fills`. On the label, pin `fills` and `fontSize`. On the Focus variant, pin `strokes` and `strokeWeight`.

```markdown
**Agent suggestion — confirm**
Icon-only button · name: Close modal · role: button
Target: frame 44×44 (minWidth/minHeight pinned), icon 3:1 against the frame
```

## 5. Names that work out of context, and icon-only buttons

- **Screen reader users often list every button on the screen to move around**, so each name must work alone. "Click here" and "Learn more" say nothing. "Download report" and "Read about our history" do.
- **The icon-only button's name says what it does** ("Close modal", "Search"), never the icon ("X", "magnifier") or a file or component name ("ic_close_24").
- **Name the instance layer for the action.** The next agent reads layer names as a hint ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 1), so a layer called "Icon 3" misleads it. The annotation is still where the name lives.

## 6. When the task creates or changes the button in the design system

The DA11Y.md Section 2.2 context layer, applied to the button:

- **Description:** "Button. Use it to run an action on this screen: submit, save, open a dialog. Do not use it to go to another page (use Link). Aliases: button, CTA, action, icon button."
- **Properties:** `State` (VARIANT), `Variant` (VARIANT: Primary, Secondary, Text), `Label` (TEXT), `Icon only` (BOOLEAN), `Icon` (INSTANCE_SWAP).
- **Layers named for what they are, in reading order:** Button, Icon, Label.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result of each state in each mode, plus the name annotation every icon-only use needs.

## 7. Anti-patterns on the canvas

- **A button drawn by hand**: a `RECTANGLE` and a `TEXT`, or a `GROUP`, styled like the library's button.
- **An icon-only button with no name**, or named after its icon.
- **"Click here" or "Learn more"** as the whole label.
- **Focus drawn only as a shadow** in `effects`.
- **A label cut with an ellipsis** in a fixed-width button.
- **A disabled button with no visible reason.**
- **An action that exists only on hover.**

## 8. What stays for code

The native button, its role, `Enter` and `Space`, the accessible name and the disabled state are implemented following A11Y.md [`guide-buttons.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-buttons.md) and [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md) §6. The verification scenarios in those guides (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
