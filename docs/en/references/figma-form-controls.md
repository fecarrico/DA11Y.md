# Form controls on the canvas — checkbox, radio, switch, slider, select and disabled

> **Scope:** checkbox, radio group, switch, slider and the closed select, and the disabled state they share, described in Figma nodes. Label, help text and error are in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-forms.md). A searchable select is in [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-autocomplete.md).
> **Translates:** A11Y.md [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-form-controls.md), pinned at commit `9fb9a02`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Choose the control by what it does, never by its shape (SC 1.3.1). One choice among several is a radio group. Independent yes/no options are checkboxes. A setting that takes effect at once is a switch. A value in a range is a slider with a numeric field beside it. One option from a list is a select.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Control | `COMPONENT_SET` with `State` and a value property (`Checked`, `Selected`, `On`); each use is an `INSTANCE` | a control the library lacks is a warning (DA11Y.md Section 2), drawn only with authorization |
| Row (checkbox, radio, switch) | `COMPONENT` with horizontal auto layout: Control, Label | **the label is part of the target**: tapping the text toggles the control, so the row frame is the box to measure (SC 2.5.8) |
| Mark (check, dot, knob) | `VECTOR` or an icon `INSTANCE`, shown by the value variant | the cue that does not depend on color (SC 1.4.1) |
| Group of options | `FRAME` with vertical auto layout and a group label `TEXT` first, never a `GROUP` | the group label is read before the first option |
| Slider | `COMPONENT` with Label, Value `TEXT`, Track, Thumb `FRAME`, and step buttons or a numeric field | the current value is visible in text |
| Select, closed | the library field: Label, Box with Value and a chevron icon `INSTANCE` | the label sits outside the box ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-forms.md)). Only the closed state is styled: the open list belongs to the platform |

## 2. States the component must have

| Control | Value property | `State` |
| :--- | :--- | :--- |
| Checkbox | `Checked`: False, True, and Indeterminate when a parent sums up its children | Default, Focus, Disabled, and Error when an answer is required |
| Radio | `Selected`: False, True | Default, Focus, Disabled. The group has Error when an answer is required |
| Switch | `On`: False, True | Default, Focus, Disabled |
| Slider | the value, shown in text | Default, Focus on the thumb, Disabled |
| Select | the chosen value | the text field's states ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-forms.md) Section 2) |

- **Every value is visible without color** (SC 1.4.1). Compare the value variants: Checked has a mark and Indeterminate its own; a selected radio has a filled dot, a check or a bolder label; On and Off differ by knob position plus a text or an icon. If only the fill changes, the state fails.
- **Disabled.** Exempt from contrast as an inactive component (SC 1.4.3 and 1.4.11), but grey alone does not say why (SC 1.4.1): a visible `TEXT` next to the control gives the reason, and it is not exempt.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Box, ring, track and thumb | `strokes` or `fills` against the adjacent color, in every value variant | 3:1 (SC 1.4.11). The switch track reaches it both On and Off |
| Mark | the mark `fills` against the box it sits on | 3:1 (meaningful graphic) |
| Target | `minWidth` and `minHeight` of the row frame, label included, and of the slider's thumb frame | the profile's floor (DA11Y.md Section 3) |
| Slider without dragging | the step buttons, and the `reactions` of the track and the thumb | the value changes without dragging, through drawn step buttons or a click on the track. With no buttons, the click on the track goes into the report, as a requirement for development. A value changed only by `ON_DRAG` fails SC 2.5.7 |
| Select that acts by itself | `reactions` of the options | choosing an option never navigates or submits; that waits for a button (SC 3.2.2) |

## 4. What becomes an annotation

On the control instance or on the group frame:

- **Name.** The visible label. A group's name is its group label, read once before the first option.
- **Role, when the look misleads.** A toggle that waits for a Save button is a checkbox, whatever its shape.
- **Starting value.** Which option starts selected, or none when the answer matters (Section 5).
- **Indeterminate.** Which children the parent checkbox sums up.
- **Slider.** Minimum, maximum, step and larger step, the meaning when the number alone says nothing ("Medium" on a 1–3 quality scale, "14:30" for a time), and that a numeric field beside it is bound to the same value.
- **Select.** The options, the label of each section when the list has sections, and the real name of a blank choice ("No preference").
- **Disabled, which kind.** Removed from the focus order, or still reachable so the person hears the reason.

Pin `minWidth` and `minHeight` on the row frame and on the thumb, `strokes` or `fills` with the measured ratio on the box or the track, `fills` and `fontSize` on the label ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-nodes.md) Section 4).

```markdown
5–7 · group "Payment method"
5) 🔊 radio "Card", group "Payment method", required, 1 of 3
6) 🔊 radio "Bank transfer", 2 of 3
7) 🔊 radio "Cash", 3 of 3
📢 on error: "Choose a payment method"
```

## 5. Rules of each control

- **Checkbox.** Independent options only. If choosing one must clear the others, it is a radio group.
- **Radio group.** No option pre-selected when the answer matters, such as a consent or a payment method. The person chooses, and the form says when they did not (SC 3.3.1).
- **Switch.** The change takes effect now, with no Save and no confirmation; if it needs either, it is a checkbox. The label names the setting, never the state or the action: "Notifications" stays "Notifications" on or off. A label that flips to "Turn off" is announced as "Turn off, switch, on" (SC 4.1.2).
- **Slider.** Dragging is a shortcut (SC 2.5.7). When the exact value matters (a price, a dosage, a date range), a numeric field sits beside the slider (A11Y.md rule†).
- **Select.** A placeholder option ("Choose a country") is not a label: it disappears once a value is chosen. Search, multi-select with chips or options with icons make it a combobox ([`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-autocomplete.md)), and the decision to leave the native select goes to [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/A11Y-DECISIONS.md).

## 6. When the task creates or changes a control in the design system

- **Description**, with when to use it, when not to and its aliases. For the switch: "Switch. Use it for a setting that takes effect at once. Do not use it when the change needs Save or confirmation (use Checkbox). Aliases: switch, toggle, on/off."
- **Properties:** `State` (VARIANT), the value as a VARIANT (`Checked`, `Selected`, `On`), `Label` and `Help` (TEXT).

## 7. Anti-patterns on the canvas

- **A control chosen by its shape**: a switch that waits for Save, checkboxes that clear each other.
- **A target that is only the box**, with the label outside the row frame.
- **A switch label that changes with the state.**
- **A pre-selected option** when the answer matters.
- **A slider changed only by dragging**, or with no value in text.
- **A placeholder option as the select's label**, or an option that navigates or submits on its own.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-form-controls.md); its verification scenarios run on the built product and enter the report as requirements for development.
