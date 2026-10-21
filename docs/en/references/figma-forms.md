# Forms on the canvas — text field, label, help, error and groups

> **Scope:** the text field and what surrounds it (label, help text, error message, trailing actions), groups of fields and the login form, described in Figma nodes.
> **Translates:** A11Y.md [`guide-forms.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-forms.md), with [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-cognitive.md) §1 and §6 (login and microcopy) and [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-form-controls.md) §6 (disabled), pinned at commit `68f4be1`. Checkbox, radio, switch and select are in [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-form-controls.md); a searchable select, in [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-autocomplete.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

The whole field is **one component**: label, box, help and error travel together, so reusing the field never loses the label.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Field | `COMPONENT_SET` with a `State` variant property; each use is an `INSTANCE` | a library field with no label part is a warning (DA11Y.md Section 2), never a reason to build another field |
| Field container | `COMPONENT` with vertical auto layout: Label, Box, Help or Error | the auto layout order is the reading order: a label after the box, or out of the flow with `layoutPositioning: ABSOLUTE`, is read after the field |
| Label | `TEXT`, outside the box and before it | always visible, exposed as a `TEXT` component property named "Label" |
| Required mark | the word "required" in the label, or an asterisk explained at the top of the form | an unexplained asterisk says nothing, and color alone says less |
| Box | `FRAME` with horizontal auto layout; the border is `strokes`, the background is `fills` | measured in Section 3 |
| Value and placeholder | `TEXT` inside the box | the placeholder is an example, never the label and never the only place for the format |
| Help text | `TEXT` below the box | the format ("DD/MM/YYYY") and the rules ("at least 8 characters") live here, visible before typing |
| Error message | `TEXT` and an icon `INSTANCE` below the box, visible only in `State=Error` | icon, text and color together; the text names the way out |
| Trailing action (clear, show password) | an icon `INSTANCE` inside its own `FRAME` | a separate target with its own accessible name (Section 4) |
| Group of fields (date parts, address, a set of radios) | `FRAME` with auto layout and a visible group label `TEXT` first | never a `GROUP`, which has no box and accepts no annotation |

## 2. States the component must have

`State` has at least **Default, Focus, Filled, Error and Disabled**, plus Read-only when the product uses it. Hover, when the library has it, is measured like the rest.

- **Focus on a field with an error.** The person comes back to fix the field, so error and focus happen together: either the set has that combination, or the Focus indicator still reaches 3:1 over the Error look.
- **Error.** Compare the Default and Error variants: if only the border color changes, the state fails SC 1.4.1. The icon and the message text must appear.
- **Disabled.** Exempt from contrast as an inactive component (SC 1.4.3 and 1.4.11). The text that explains why is not exempt, and a disabled field with no visible reason is a warning.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| What shows a field is there | the box `strokes` (full border or bottom border) or the box `fills`, against the color around the box | 3:1 when that cue is the only visual sign of the field (SC 1.4.11) |
| The same, with a visible label right above the box | the same pair | the W3C does not require the boundary here ([Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)): a border below 3:1 is a **warning**, not a failure, because delineating every control is a best practice for cognitive disabilities. Report it, never swap the library token on your own |
| Box height and trailing actions | `height` and `minHeight` of the box `FRAME` and of each action `FRAME` | the profile's floor (DA11Y.md Section 3) |

## 4. What becomes an annotation

**In the annotation on the field instance**, in the short format of DA11Y.md Section 5:

- **Name**, containing the visible label in the same order (SC 2.5.3).
- **Required**, and how the design shows it.
- **Help text bound to the field**, so it is read together with the label.
- **Error message**, with its exact text, announced when it appears.
- **Trailing actions**: the accessible name of each one ("Show password", "Clear search").

**In the report**, as requirements for development:

- **Autofill purpose** (SC 1.3.5 for data about the person; SC 3.3.8 in login, Section 5): `name`, `email`, `tel`, `street-address`, `postal-code`, `username`, `current-password`, `new-password`, `one-time-code` or another value from the HTML list.
- **Mobile keyboard**: email, numeric or phone.

Pin `minHeight` and `strokes` with the measured ratio on the box, `fills` and `fontSize` on the label ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4).

```markdown
2 · field "Email"
🔊 field "Email", required, with the help "We'll never share your email."
📢 on error: "Enter an email like name@example.com"
```

## 5. Login and authentication

- **Nothing that tests memory** (SC 3.3.8): no "enter the 3rd and 7th characters of your password", no CAPTCHA to transcribe. The annotation says paste is allowed in the password field and gives the autofill purpose: that is what lets a password manager do the remembering.
- **CAPTCHA and the Shield profile.** The alternatives to a CAPTCHA that cannot be avoided, and SC 3.3.9 under Shield, are in [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-cognitive.md) Section 1.
- **Nothing typed twice** (SC 3.3.7). Data the person gave earlier in the same flow appears already filled in, or offered to pick. Password confirmation is the criterion's own exception.
- **The error names the way out:** "Wrong password. Try again or reset your password", never just "Wrong password".

## 6. When the task creates or changes the field in the design system

- **Description:** "Text field. Use it for one line of free text. Do not use it to choose from a list (use Select) or for long text (use Text area). Aliases: input, text input, form field."
- **Properties:** `State` (VARIANT), `Label`, `Help`, `Error message` (TEXT), `Required` (BOOLEAN), `Leading icon` (INSTANCE_SWAP).

## 7. Anti-patterns on the canvas

- **Placeholder as label**, including the "floating" label that shrinks below the profile's minimum font when the field has a value.
- **The format only in the placeholder**, gone as soon as the person types.
- **Error message far from the field**, in a toast or only at the top of the page.
- **Swapping the library's border token** because it measured below 3:1 with a visible label right above. That is a warning for the person to decide.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-forms.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-forms.md); its verification scenarios run on the built product and enter the report as requirements for development.
