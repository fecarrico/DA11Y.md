# Charts on the canvas — series, labels, data table and dashboards

> **Scope:** charts, graphs, dashboards and KPI tiles, described in Figma nodes: the series, what tells them apart, the text around them and the data table that is their alternative.
> **Translates:** A11Y.md [`guide-charts.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-charts.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

A chart is data, drawn. Its alternative is **the data**, not a description of the drawing: every informative chart ships an equivalent table, at every profile. Where a table is impractical (thousands of points, a live stream), a downloadable dataset or an API endpoint stated in the caption is acceptable. "The numbers are elsewhere in the product" is not.

## 1. Anatomy in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Chart | `FRAME` with vertical auto layout, or an `INSTANCE` of the library's chart | never a `GROUP`: no box to measure and no place for evidence. The auto layout order is the reading order: title, chart, data table control |
| Title | `TEXT`, first in the frame | names the question the chart answers ("Revenue by month"), never the type ("Bar chart 3") |
| Plot area | `FRAME` holding the series | its `fills` is the background every series is measured against |
| Series | `VECTOR`, `LINE` or `RECTANGLE` marks, one `FRAME` per series when it has several | color is never the encoding (Section 3) |
| Markers | `ELLIPSE`, `POLYGON`, `STAR` or an icon `INSTANCE` | a different shape per series is a second channel |
| Direct labels | `TEXT` at the end of each line or on each bar | beats a legend, which makes the reader hold a color↔name map in memory |
| Axes and ticks | `LINE` and `TEXT` | the text follows the profile's floors |
| Data table control | button `INSTANCE` ("View data as a table") in its own `FRAME` | a real target ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)) |
| Data table | `FRAME` built as in [`figma-tables.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-tables.md) | the same series, as rows |
| Chart exported as a picture | a node with an image fill | an image ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-images.md)), with the data table nearby |

## 2. States the chart must have

A static chart has no states. An interactive chart, or one that updates, has these. A state missing from the library is a Section 2 warning: point it out and draw it only with authorization.

- **Focused point.** A ring, a halo or an enlarged marker on the point (SC 2.4.7), never only a tooltip appearing.
- **Tooltip on focus.** If a point shows a tooltip on hover, the Focus state shows the same tooltip ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-tooltips-popovers.md)).
- **Range without drag.** If dragging selects a range (zoom or brush), a visible control selects the same range ([`figma-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-drag-drop.md)).
- **Paused, for live data.** A chart streaming live data has a visible pause control (SC 2.2.2). Continuous automatic movement is not exempt for being data.
- **Filtered.** The data table frame shows the same filtered set as the chart. A table with the unfiltered set is a second, contradictory answer.
- **Data table open.** The open state of the "View data as a table" control is designed, with the table visible.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Each series against the plot | the series `strokes` or `fills` against the plot area `fills` | 3:1 (SC 1.4.11) |
| Adjacent series | the `strokes` or `fills` of two series that touch or cross | 3:1 against each other, not only against the background |
| Second channel | the series side by side: marker shape, dash pattern, texture, direct label | every series differs from the others by something besides hue. The dash pattern has no property in [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) (to confirm): read it in the rendered chart |
| Title, labels, ticks, KPI value | the `TEXT` `fills` against the fill behind it (the plot, or the bar when the label sits on it) | the profile's floor (DA11Y.md Section 3) |
| Prototype | `reactions` on points and on the plot | an `ON_HOVER` or `MOUSE_ENTER` tooltip with no focus or click path is hover-only. An `ON_DRAG` range with no control is drag-only. An `AFTER_TIMEOUT` that updates the data needs the pause control |

## 4. What becomes an annotation

**In the annotation on the chart frame**, in the short format of DA11Y.md Section 5:

- **Shape:** static image, inline SVG or interactive. It decides what code owes, and getting it wrong is the root of most broken charts.
- **Text alternative**, as a draft with the trend and the extremes. It says what the reader would see, and the data table gives what they would learn.
- **Data equivalent:** where the table is, or the dataset or API endpoint stated in the caption.
- **What the focused point announces**, with exact text: "March: 35,000".
- **Announcement on update**, with the outcome: "Filtered by Q2: 3 series, 12 points", never "chart updated".

**In the report**, as requirements for development:

- **Keyboard, for an interactive chart:** one tab stop for the chart, arrows between points, `Esc` leaves zoom or brush without leaving the page.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4): on each series, `strokes` or `fills` with the ratio against the plot and against its neighbor. On labels and ticks, `fills` and `fontSize`. On each control, `minWidth` and `minHeight`.

```markdown
6–7 · chart "Revenue by month"
6) 🔊 heading level 2 "Revenue by month" · "Monthly revenue, 2026. Rises from 40k in January to 120k in June, with a dip to 35k in March."
7) 🔊 link "View data as a table"
📢 on filter change: "Filtered by Q2: 3 series, 12 points"
```

## 5. Dashboards

- **Each chart is a region with a real heading.** The chart `FRAME` starts with its title `TEXT`, which names the question, so the whole board is navigable by headings. The heading level is a Section 4 annotation.
- **A KPI tile is text.** The number is a `TEXT` node, never a `VECTOR` or an image fill.
- **Small metadata** is where the 10px density exception gets abused (DA11Y.md Section 3).

## 6. When the task creates or changes a chart in the design system

- **Description:** "Line chart. Use it to show how a value changes over time. Do not use it for a single number (use KPI tile). Aliases: graph, plot, line graph, trend chart."
- **Properties:** `Title` (TEXT), `Show data table` (BOOLEAN), `Marker` (INSTANCE_SWAP) per series, and on the point, `State` (VARIANT) with Default, Hover and Focus.

## 7. Anti-patterns on the canvas

- **A picture of the chart whose alternative describes the drawing** and no data table. It passes every checker and is useless.
- **Color as the only encoding** of series, categories or a "critical" state.
- **A legend as the only key** when the series could be labelled where they are drawn.
- **Two neighboring series that pass on the background and fail against each other.**
- **Focus shown only by a tooltip**, or a tooltip or range reachable only by hover or drag.
- **A live chart with no pause.**
- **A title that names the chart type.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-charts.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-charts.md); its verification scenarios run on the built product and enter the report as requirements for development.
