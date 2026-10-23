# Tables on the canvas — caption, headers, rows and cells

> **Scope:** data tables and data grids, built from frames so that every row and every cell is a node that can be measured, named and annotated.
> **Translates:** A11Y.md [`guide-tables.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-tables.md), pinned at commit `9fb9a02`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

The `TABLE` node is opaque: the API exposes little of it and it accepts no annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-nodes.md) Sections 2 and 4). A table that needs evidence is built from frames. When the file already has a `TABLE` node, Section 5 applies.

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

Cells take no focus. Only the real controls inside the table do (links, buttons, checkboxes), in reading order, and each brings its own states from its own component, Focus included ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-buttons.md), [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-form-controls.md)). A control without its Focus state is a Section 2 warning. A Focus state drawn on a plain cell contradicts what the built table must do: point it out to the person.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Caption, header and cell text | the `TEXT` `fills` against the fill of the nearest ancestor that has one: the cell, the row (each striped row included) or the table | the profile's floor (DA11Y.md Section 3) |
| Font size | `fontSize` of caption, headers and cells | the profile's minimum (DA11Y.md Section 3). The 10px density exception covers secondary metadata such as a badge, never the data cells |
| Control in a cell | `width`, `height`, `minWidth`, `minHeight` of the control's `FRAME` | the profile's floor (DA11Y.md Section 3). In a dense table where the visible control is smaller than the floor, the control's `FRAME`, with its padding, carries the hit area |
| Text that grows | `textAutoResize` of each cell `TEXT`, and `layoutSizingVertical` of the rows | text set to `HEIGHT` or `WIDTH_AND_HEIGHT` inside `HUG` rows. A `FIXED` row height hides the content at 200% zoom |
| Order | the auto layout order of rows and cells, or the `GRID` order | matches the visual reading, with no `ABSOLUTE` row or cell |

## 4. What becomes an annotation

Each item is an annotation on the table `FRAME`:

- **Role:** data table.
- **Caption**, with its exact text, when the drawn title is not the caption or there is none.
- **Column headers:** which row holds them.
- **Row headers:** which column holds them, when there is one.
- **Cells take no focus.** The controls in them do, in reading order.
- **Name of each control without visible text** in a cell.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.2.0/docs/en/references/figma-nodes.md) Section 4): on a `GRID` table, `gridRowCount` and `gridColumnCount`. On header and cell text, `fills` and `fontSize`. On each control `FRAME`, `minWidth` and `minHeight`.

```markdown
4–5 · table "Employee data"
4) 🔊 table "Employee data" · headers: row 1 (Name, Role) and column 1 (each employee's name)
5) 🔊 in each row, button "Edit"
```

## 5. When the file already has a `TABLE` node

- **The library comes first.** Do not rebuild it on your own.
- **It accepts no annotation.** Annotate the nearest `FRAME` or `INSTANCE` that contains it, and say which table the annotation is about.
- **What cannot be read from it is not tested**, never estimated. Say so in the report.
- **Warn the person** that a table built from frames gives every row and cell a node for evidence. Rebuild it only with authorization.

## 6. When the task creates or changes the table in the design system

- **Description:** "Data table. Use it for data people compare across rows and columns. Do not use it for a single list of items (use List). Aliases: table, data grid, grid, datatable."
- **Properties:** `Caption` (TEXT), and on the cell component, `Type` (VARIANT) with Column header, Row header and Data, so code knows which cells are headers.

## 7. Anti-patterns on the canvas

- **A new table built on a `TABLE` node**, which accepts no annotation.
- **A table made of a `GROUP`** or of loose `TEXT` layers placed by hand.
- **No caption**, nothing that names the table.
- **Headers that are only bolder text**, with no annotation saying they are headers.
- **A Focus state on plain cells.**
- **An icon in a cell as the only target**, with no `FRAME` of its own.
- **Content cut by an ellipsis or a fixed row height.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-tables.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-tables.md); its verification scenarios run on the built product and enter the report as requirements for development.
