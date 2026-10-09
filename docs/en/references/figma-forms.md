# Forms on the canvas — text field, label, help, error and groups

> **Scope:** the text field and what surrounds it (label, help text, error message, trailing actions), groups of fields and the login form, described in Figma nodes.
> **Translates:** A11Y.md [`guide-forms.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-forms.md), with [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-cognitive.md) §1 and §6 (login and microcopy) and [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md) §6 (disabled), pinned at commit `57564be`. Checkbox, radio, switch and select are still read from [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md); a searchable select, from [`guide-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-autocomplete.md).
> **Before this guide:** [`figma-nodes.md`](figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

The whole field is **one component**: label, box, help and error travel together, so reusing the field never loses the label.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Field | `COMPONENT_SET` with a `State` variant property; each use is an `INSTANCE` | if the library's field has no label part, that is a Section 2 warning, never a reason to build another field |
| Field container | `COMPONENT` with vertical auto layout: Label, Box, Help or Error | the auto layout order is the reading order, so the label comes first. A label placed after the box, or taken out of the flow with `layoutPositioning: ABSOLUTE`, is read after the field |
| Label | `TEXT`, outside the box and before it | always visible, exposed as a `TEXT` component property named "Label" |
| Required mark | the word "required" in the label, or an asterisk explained at the top of the form | an asterisk with no explanation says nothing, and color alone says less |
| Box | `FRAME` with horizontal auto layout; the border is `strokes`, the background is `fills` | what must reach 3:1 is in Section 3 |
| Value and placeholder | `TEXT` inside the box | the placeholder is an example, never the label and never the only place for the format |
| Help text | `TEXT` below the box | the format ("DD/MM/YYYY") and the rules ("at least 8 characters") live here, visible before typing |
| Error message | `TEXT` and an icon `INSTANCE` below the box, visible only in `State=Error` | icon, text and color together; the text names the way out |
| Trailing action (clear, show password) | an icon `INSTANCE` inside its own `FRAME` | a separate target: its own box at the profile's minimum target and its own accessible name (Section 4) |
| Group of fields (date parts, address, a set of radios) | `FRAME` with auto layout and a visible group label `TEXT` first | never a `GROUP`, which has no box and accepts no annotation |

## 2. States the component must have

The `State` property has at least **Default, Hover, Focus, Filled, Error and Disabled**, plus Read-only when the product uses it. A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Focus.** An outline of at least 2px at 3:1 against the adjacent color, made with `strokes` and `strokeWeight`. A shadow in `effects` alone does not count, because it disappears in high-contrast mode.
- **Focus on a field with an error.** The person comes back to fix the field, so error and focus happen together. Either the set has that combination, or the Focus indicator still reaches 3:1 over the Error look.
- **Error.** Compare the Default and Error variants. If only the border color changes, the state fails SC 1.4.1. The icon and the message text must appear.
- **Disabled.** The disabled field is exempt from contrast (inactive components, SC 1.4.3 and 1.4.11). The text that explains why it is disabled is not exempt and follows the profile's text floor. A disabled field with no visible reason is a warning.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Label, value, help and error text | the `TEXT` `fills` against the fill of the nearest ancestor that has one | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| What shows a field is there | the box `strokes` (full border or bottom border) or the box `fills`, against the color around the box | 3:1 when that cue is the only visual sign of the field (SC 1.4.11) |
| The same, with a visible label right above the box | the same pair | the W3C does not require the boundary in this case. A border below 3:1 is a **warning** (delineating every control is a best practice for people with cognitive disabilities), not a failure. Report it, and never swap the library token on your own |
| Focus | the Focus variant's `strokes` and `strokeWeight` against the adjacent color | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7) |
| Error beyond color | the Default and Error variants side by side | an icon `INSTANCE` and an error `TEXT` become visible |
| Box height and trailing actions | `height` and `minHeight` of the box `FRAME` and of each action `FRAME` | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` between fields, and between a trailing action and its neighbors | 8px between neighboring targets (House Rule†) |
| Text that grows | `textAutoResize` of label, help and error, and `layoutSizingVertical` of their container | text set to `HEIGHT` or `WIDTH_AND_HEIGHT` inside a `HUG` container. `TRUNCATE`, `maxLines` or a `FIXED` height on label, help or error cuts the text at 200% zoom |
| Font size | `fontSize` of label, value, help and error | the profile's minimum font: 12px under Standard, 14px under Shield |

## 4. What becomes an annotation

The canvas has no field for any of this. Each item is an annotation in the **Accessibility** category on the field instance, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Name.** The name the field will have. When the visible label is shorter than the name needs to be, the name contains the visible text, in the same order (SC 2.5.3).
- **Autofill purpose** (SC 1.3.5): `name`, `email`, `tel`, `street-address`, `postal-code`, `username`, `current-password`, `new-password`, `one-time-code` or another value from the HTML list.
- **Required**, and how the design shows it.
- **Help text bound to the field**, so it is read together with the label.
- **Error message**, with its exact text, and the instruction that it is announced when it appears.
- **Mobile keyboard**: email, numeric or phone.
- **Trailing actions**: the accessible name of each one ("Show password", "Clear search").

Pin the measured value in the annotation ([`figma-nodes.md`](figma-nodes.md) Section 4). On the box, pin `minHeight` and `strokes` with the measured ratio. On the label, pin `fills` and `fontSize`. If someone changes the value later, the annotation shows the new one.

```markdown
**Agent suggestion — confirm**
Field "Email" · name: Email · autofill: email · keyboard: email · required
Help: "We'll never share your email." (read with the label)
Error (State=Error): "Enter an email like name@example.com" (announced when it appears)
```

## 5. Login and authentication

- **Nothing that tests memory** (SC 3.3.8). No "enter the 3rd and 7th characters of your password", no CAPTCHA to transcribe. The annotation says that paste is allowed in the password field and gives the autofill purpose, because that is what lets a password manager do the remembering.
- **Show password** is a trailing action with its own target and name.
- **Nothing typed twice** (SC 3.3.7). Data the person gave earlier in the same flow appears already filled in, or offered to pick. Password confirmation is the criterion's own exception.
- **The error names the way out:** "Wrong password. Try again or reset your password", never just "Wrong password".

## 6. When the task creates or changes the field in the design system

The DA11Y.md Section 2.2 context layer, applied to the field:

- **Description:** "Text field. Use it for one line of free text. Do not use it to choose from a list (use Select) or for long text (use Text area). Aliases: input, text input, form field."
- **Properties:** `State` (VARIANT), `Label`, `Help`, `Error message` (TEXT), `Required` (BOOLEAN), `Leading icon` (INSTANCE_SWAP).
- **Layers named for what they are, in reading order:** Label, Box, Value, Help text, Error message.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result of each state in each mode.

## 7. Anti-patterns on the canvas

- **Placeholder as label**, including the "floating" label that shrinks below the profile's minimum font when the field has a value.
- **The format only in the placeholder**, gone as soon as the person types.
- **Error shown by a red border only.**
- **Error message far from the field**, in a toast or only at the top of the page.
- **A field made of a `GROUP`** of a rectangle and a text: no box to measure and no place for evidence.
- **A disabled submit button with no visible reason** for being disabled.
- **Swapping the library's border token** because it measured below 3:1 with a visible label right above. That is a warning for the person to decide.

## 8. What stays for code

The label bound to the field, the help text and the error message bound to it, the invalid state, the error announcement, the autofill attribute and the group's name are implemented following A11Y.md [`guide-forms.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-forms.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
