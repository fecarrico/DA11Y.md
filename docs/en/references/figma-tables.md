# Tables on the canvas — caption, headers, rows and cells

> **Scope:** data tables and data grids, built from frames so that every row and every cell is a node that can be measured, named and annotated.
> **Translates:** A11Y.md [`guide-tables.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tables.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

The `TABLE` node is opaque: the API exposes little of it and it accepts no annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Sections 2 and 4). A table that needs evidence is built from frames. When the file already has a `TABLE` node, Section 5 applies.

## 1. Anatomy in nodes

Two structures work, and in both the auto layout order is the reading order:

- **A `FRAME` with `layoutMode: GRID`.** The columns stay aligned and the order is row, then column. There is no row node.
- **A vertical `FRAME` of row `FRAME`s**, each a horizontal auto layout of cells. Every row is its own node, which mirrors the row structure code needs.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Table | `FRAME` (or an `INSTANCE` of the library's table) with one of the structures above | never a `GROUP`, and never loose `TEXT` layers placed by hand: without auto layout the order comes from geometry, and `children` run back to front |
| Caption | `TEXT`, first in the table frame | describes the table ("Employee data"). It becomes the caption |
| Header row | `FRAME` with horizontal auto layout, the first row | its cells are the column headers |
| Column header | `FRAME` with a `TEXT` | named for the column ("Name", "Role") |
| Row | `FRAME` with horizontal auto layout, in data order | an `ABSOLUTE` row or cell leaves the flow, and with it the reading order |
| Row header | the first cell of a row, when that cell identifies the row | that it is a header is a Section 4 annotation |
| Cell | `FRAME` with a `TEXT` | takes no focus (Section 2) |
| Control in a cell (link, button, checkbox) | the library's `INSTANCE` in its own `FRAME` | the only thing in the table that takes focus |

## 2. What takes focus

Cells take no focus. Only the real controls inside the table do (links, buttons, checkboxes), in reading order, and each brings its own states from its own component, Focus included ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md), [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-form-controls.md)). A control without its Focus state is a Section 2 warning. A Focus state drawn on a plain cell contradicts what the built table must do: point it out to the person.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Caption, header and cell text | the `TEXT` `fills` against the fill of the nearest ancestor that has one: the cell, the row (each striped row included) or the table | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| Font size | `fontSize` of caption, headers and cells | the profile's minimum font: 12px under Standard, 14px under Shield. 10px only under the density exception, with 7:1 and an `EXCEPTIONS.md` entry, for secondary metadata such as a badge. Never for the data cells |
| Control in a cell | `width`, `height`, `minWidth`, `minHeight` of the control's `FRAME`, never the icon | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised). In a dense table where the visible control is smaller than 44px, the control's `FRAME`, with its padding, carries the hit area |
| Spacing | `itemSpacing` between controls in a cell and between neighboring cells with controls | 8px between neighboring targets (House Rule†). Less is a warning, never a failure, and relaxing it is a product decision for `A11Y-DECISIONS.md` |
| Text that grows | `textAutoResize` of each cell `TEXT`, and `layoutSizingVertical` of the rows | text set to `HEIGHT` or `WIDTH_AND_HEIGHT` inside `HUG` rows. `TRUNCATE`, `maxLines` or a `FIXED` row height hides the content at 200% zoom |
| Order | the auto layout order of rows and cells, or the `GRID` order | matches the visual reading, with no `ABSOLUTE` row or cell |

## 4. What becomes an annotation

The canvas has no field for any of this. Each item is an annotation in the **Accessibility** category on the table `FRAME`, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Role:** data table.
- **Caption**, with its exact text, when the drawn title is not the caption or there is none.
- **Column headers:** which row holds them.
- **Row headers:** which column holds them, when there is one.
- **Cells take no focus.** The controls in them do, in reading order.
- **Name of each control without visible text** in a cell.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4). On a `GRID` table, pin `gridRowCount` and `gridColumnCount`. On header and cell text, pin `fills` and `fontSize`. On each control `FRAME`, pin `minWidth` and `minHeight`.

```markdown
**Agent suggestion — confirm**
Data table · caption: "Employee data"
Column headers: row 1 (Name, Role) · row headers: column 1 (each employee's name)
Cells take no focus · in each row, the "Edit" button, in reading order
```

## 5. When the file already has a `TABLE` node

- **The library comes first.** Do not rebuild it on your own.
- **It accepts no annotation.** Annotate the nearest `FRAME` or `INSTANCE` that contains it, and say which table the annotation is about.
- **What cannot be read from it is not tested**, never estimated. Say so in the report.
- **Warn the person** that a table built from frames gives every row and cell a node for evidence. Rebuild it only with authorization.

## 6. When the task creates or changes the table in the design system

The DA11Y.md Section 2.2 context layer, applied to the table:

- **Description:** "Data table. Use it for data people compare across rows and columns. Do not use it for a single list of items (use List). Aliases: table, data grid, grid, datatable."
- **Properties:** `Caption` (TEXT), and on the cell component, `Type` (VARIANT) with Column header, Row header and Data, so code knows which cells are headers.
- **Layers named for what they are, in reading order:** Caption, Header row, Column header, Row, Row header, Cell.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result in each mode.

## 7. Anti-patterns on the canvas

- **A new table built on a `TABLE` node**, which accepts no annotation.
- **A table made of a `GROUP`** or of loose `TEXT` layers placed by hand.
- **No caption**, nothing that names the table.
- **Headers that are only bolder text**, with no annotation saying they are headers.
- **A Focus state on plain cells.**
- **An icon in a cell as the only target**, with no `FRAME` of its own.
- **Content cut by an ellipsis or a fixed row height.**

## 8. What stays for code

The caption, the header cells with their scope, the native table and cells that take no focus are implemented following A11Y.md [`guide-tables.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tables.md). If the table cannot be native, the ARIA structure must be complete, with a row role on every row. The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
