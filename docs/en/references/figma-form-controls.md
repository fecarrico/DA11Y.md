# Form controls on the canvas — checkbox, radio, switch, slider, select and disabled

> **Scope:** checkbox, radio group, switch, slider and the closed select, and the disabled state they share, described in Figma nodes. Label, help text and error are in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md). A searchable select is in [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-autocomplete.md).
> **Translates:** A11Y.md [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Choose the control by what it does, never by its shape (SC 1.3.1). One choice among several is a radio group. Independent yes/no options are checkboxes. A setting that takes effect at once is a switch. A value in a range is a slider with a numeric field beside it. One option from a list is a select.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Control | `COMPONENT_SET` with `State` and a value property (`Checked`, `Selected`, `On`); each use is an `INSTANCE` | a control the library lacks is a warning (DA11Y.md Section 2), drawn only with authorization |
| Row (checkbox, radio, switch) | `COMPONENT` with horizontal auto layout: Control, Label | **the label is part of the target**: tapping the text toggles the control, so the row frame is the box to measure (SC 2.5.8) |
| Box, ring, track | `FRAME`, `RECTANGLE` or `ELLIPSE` inside the row | its border or fill reaches 3:1 (Section 3) |
| Mark (check, dot, knob) | `VECTOR` or an icon `INSTANCE`, shown by the value variant | the cue that does not depend on color (SC 1.4.1) |
| Group of options | `FRAME` with vertical auto layout and a group label `TEXT` first | the group label is read before the first option. Never a `GROUP` |
| Slider | `COMPONENT` with Label, Value `TEXT`, Track, Thumb `FRAME`, and step buttons or a numeric field | the current value is visible in text |
| Select, closed | the library field: Label, Box with Value and a chevron icon `INSTANCE` | the label sits outside the box, as in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md). Only the closed state is styled, because the open list belongs to the platform |
| Disabled reason | `TEXT` next to the control | visible text, at the profile's text floor |

## 2. States the component must have

| Control | Value property | `State` |
| :--- | :--- | :--- |
| Checkbox | `Checked`: False, True, and Indeterminate when a parent sums up its children | Default, Focus, Disabled, and Error when an answer is required |
| Radio | `Selected`: False, True | Default, Focus, Disabled. The group has Error when an answer is required |
| Switch | `On`: False, True | Default, Focus, Disabled |
| Slider | the value, shown in text | Default, Focus on the thumb, Disabled |
| Select | the chosen value | the text field's states ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md) Section 2) |

A state the library lacks is a warning (DA11Y.md Section 2): point it out and draw it only with authorization.

- **Every value is visible without color** (SC 1.4.1). Compare the variants. Checked has a mark and Indeterminate has its own. A selected radio has a filled dot, a check or a bolder label. On and Off differ by the knob position plus a text or an icon. If only the fill changes, the state fails.
- **Focus.** An outline of at least 2px at 3:1 against the adjacent color, made with `strokes` and `strokeWeight`. A shadow in `effects` alone does not count, because it disappears in high-contrast mode.
- **Disabled.** The disabled control is exempt from contrast (inactive components, SC 1.4.3 and 1.4.11). Grey alone does not say why (SC 1.4.1), so a visible text gives the reason, and that text is not exempt.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Label, value and reason text | the `TEXT` `fills` against the fill of the nearest ancestor that has one. In `State=Disabled`, only the reason text | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| Box, ring, track and thumb | `strokes` or `fills` against the adjacent color, in every value variant | 3:1 (SC 1.4.11). The switch track reaches it both On and Off |
| Mark | the mark `fills` against the box it sits on | 3:1 (meaningful graphic) |
| Value beyond color | the value variants side by side | a mark, a shape or a position changes, never the fill alone |
| Focus | the Focus variant's `strokes` and `strokeWeight` against the adjacent color | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7) |
| Target | `width`, `height`, `minWidth` and `minHeight` of the row frame, and of the slider's thumb frame | 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` between the options of a group | 8px between neighboring targets (House Rule†). Less is a warning, never a failure |
| Text that grows | `textAutoResize` of labels and `layoutSizingVertical` of the row | `HEIGHT` or `WIDTH_AND_HEIGHT` inside a `HUG` row. `TRUNCATE`, `maxLines` or a `FIXED` height cuts the label at 200% zoom |
| Font size | `fontSize` of labels and values | 12px under Standard, 14px under Shield |
| Slider without dragging | `reactions` of the track, the thumb and the step buttons | an `ON_CLICK` or `ON_PRESS` on the track or on step buttons changes the value. A value changed only by `ON_DRAG` fails SC 2.5.7 |
| Select that acts by itself | `reactions` of the options | choosing an option never navigates or submits. That waits for a button (SC 3.2.2) |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the control instance or on the group frame, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Name.** The visible label is the name. A group's name is its group label, read once before the first option.
- **Role, when the look misleads.** Switch or checkbox (DA11Y.md Section 4). A toggle that waits for a Save button is a checkbox, whatever its shape.
- **Starting value.** Which option starts selected, or none when the answer matters (Section 5).
- **Indeterminate.** Which children the parent checkbox sums up.
- **Slider.** Minimum, maximum, step and the larger step, and the meaning when the number alone says nothing: "Medium" on a 1–3 quality scale, "14:30" for a time. When a numeric field sits beside it, both are bound to the same value.
- **Select.** The options, the label of each section when the list has sections, and the real name of a blank choice ("No preference").
- **Disabled, which kind.** Removed from the focus order, because it truly cannot be used now. Or still reachable, so the person finds it and hears the reason.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4). On the row frame and on the thumb, pin `minWidth` and `minHeight`. On the box or the track, pin `strokes` or `fills` with the measured ratio. On the label, pin `fills` and `fontSize`.

```markdown
**Agent suggestion — confirm**
Radio group "Payment method" · name read before the first option
Options: Card, Bank transfer, Cash · none selected at start · required
Error (State=Error): "Choose a payment method"
```

## 5. Rules of each control

- **Checkbox.** Independent options only. If choosing one must clear the others, it is a radio group.
- **Radio group.** No option pre-selected when the answer matters, such as a consent or a payment method. The person chooses, and the form says when they did not (SC 3.3.1).
- **Switch.** The change takes effect now, with no Save button and no confirmation. If it needs either, it is a checkbox. The label names the setting, never the state or the action: "Notifications" stays "Notifications" on or off. A label that flips to "Turn off" is announced as "Turn off, switch, on" (SC 4.1.2).
- **Slider.** Dragging is a shortcut (SC 2.5.7). When the exact value matters, such as a price, a dosage or a date range, a numeric field sits beside the slider (House Rule†).
- **Select.** A placeholder option ("Choose a country") is not a label, because it disappears once a value is chosen. Search, multi-select with chips or options with icons make it a combobox ([`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-autocomplete.md)), and the decision to leave the native select goes to [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md).

## 6. When the task creates or changes a control in the design system

The DA11Y.md Section 2.2 context layer, applied to each control:

- **Description**, with when to use it, when not to and its aliases. For the switch: "Switch. Use it for a setting that takes effect at once. Do not use it when the change needs Save or confirmation (use Checkbox). Aliases: switch, toggle, on/off."
- **Properties:** `State` (VARIANT), the value as a VARIANT (`Checked`, `Selected`, `On`), `Label` and `Help` (TEXT).
- **Layers named for what they are, in reading order:** Control, Label for a row. Group label, then the options, for a group. Label, Value, Track, Thumb for a slider.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result of each value and state in each mode.

## 7. Anti-patterns on the canvas

- **A control chosen by its shape**: a switch that waits for Save, checkboxes that clear each other.
- **Checked, selected or on shown by fill color alone.**
- **A target that is only the box**, with the label outside the row frame.
- **A switch label that changes with the state.**
- **A pre-selected option** when the answer matters.
- **A slider changed only by dragging**, or with no value in text.
- **A placeholder option as the select's label**, or an option that navigates or submits on its own.

## 8. What stays for code

The native controls, their roles and states, the group name, the keys, the slider's values and the disabled state are implemented following A11Y.md [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
