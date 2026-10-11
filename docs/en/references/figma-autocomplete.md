# Autocomplete on the canvas — combobox, list of options and result count

> **Scope:** the field that suggests options as the person types (autocomplete, combobox, searchable select), its list of options and its result count, described in Figma nodes. The field itself follows [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md).
> **Translates:** A11Y.md [`guide-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-autocomplete.md), with [`guide-form-controls.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-form-controls.md) §5 (when a select becomes a combobox), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

The field and its list are **one component**. The list belongs to the field, and the cursor stays in the field while the person moves through the options.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Combobox | `COMPONENT_SET` with `State` and an `Expanded` variant property; each use is an `INSTANCE` | no combobox in the library is a warning (DA11Y.md Section 2), drawn only with authorization |
| Field | an `INSTANCE` of the library's text field (Label, Box, Value, Help, Error) | the label sits outside the box and before it. "Search…" inside the box is a placeholder, never the label |
| Button that opens the list, when there is one | an icon `INSTANCE` inside its own `FRAME`, at the end of the box | a trailing action ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md) Section 1), with its own target and name |
| List of options | `FRAME` with vertical auto layout, right below the field | the auto layout order is the order of the options. A list placed with `layoutPositioning: ABSOLUTE` leaves the flow (Section 4) |
| Option | `INSTANCE` of an option `COMPONENT` with `State`, and a `TEXT` inside | the option's text is what the person hears ("Brazil, 1 of 5") |
| Result count | `TEXT` in the list, when the design shows it | when it is not visible, the count still exists as an announcement (Section 4) |

## 2. States the component must have

- **`Expanded`: False and True.** Draw the expanded list with matches and with none, because the count exists for zero too.
- **The field** has the text field's states ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md) Section 2) and **keeps its Focus look while the list is open**: the cursor stays in the field as the highlight moves, so the expanded variant shows the field in Focus and one option Highlighted at the same time.
- **The option** has Default and Highlighted, plus Selected when the list marks the chosen value. Highlighted is the focus the person sees inside the list, so it meets the same check as Focus. Selected shows an icon or a shape, never color alone.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Highlighted option | the Highlighted variant's `strokes` and `strokeWeight` against the adjacent color | the focus floor (DA11Y.md Section 3). A highlight made of `fills` alone has no outline to measure: state the doubt (DA11Y.md Section 2) |
| Option target | `height` and `minHeight` of the option frame | the profile's floor (DA11Y.md Section 3) |

## 4. What becomes an annotation

On the combobox instance:

- **Role.** A field with a list of options that filters as the person types: it looks like a text field or a select, so the role is written down.
- **Name.** The field's visible label.
- **Result count**, with its exact text, announced when matches appear: "5 results available". For zero: "No results" (SC 4.1.3).
- **Keys the canvas cannot show.** `↓` and `↑` move the highlight while the cursor stays in the field. `Enter` fills the field with the highlighted option and closes the list. `Tab` closes the list and moves on.
- **A list outside the flow** (`ABSOLUTE`) belongs to this field.

Pin `minHeight` on the option frame, `fills` and `fontSize` on the option text, `strokes` and `strokeWeight`, or `fills`, on the Highlighted variant ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4).

```markdown
**Agent suggestion — confirm**
Combobox "Country" · name: Country · a field with a list of options
Count, announced as matches appear: "5 results available" · zero: "No results"
Keys: ↓/↑ move the highlight, the cursor stays in the field · Enter picks and closes · Tab closes and moves on
```

## 5. Select or combobox

- **A short list with nothing to search is a select** ([`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-form-controls.md)). Search, multi-select with chips or options with icons make it a combobox, and the decision to leave the native select goes to [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md).
- **Each chip's remove action is an icon-only button**, with its own target and a name that says what it removes: "Remove Brazil" ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)).

## 6. When the task creates or changes the combobox in the design system

- **Description:** "Combobox. Use it to pick a value from a long list by typing to filter it. Do not use it for a short list with nothing to search (use Select) or for free text (use Text field). Aliases: autocomplete, combobox, searchable select, typeahead."
- **Properties:** `State` and `Expanded` (VARIANT), `Label`, `Help` and `Error message` (TEXT). On the option, `State` (VARIANT: Default, Highlighted, Selected).

## 7. Anti-patterns on the canvas

- **"Search…" in the box as the only label.**
- **A list drawn apart from the field**, as a loose frame or a `GROUP`.
- **An expanded variant where the field loses its focus look**, as if focus had moved into the list.
- **No text for the result count**, zero included.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-autocomplete.md); its verification scenarios run on the built product and enter the report as requirements for development.
