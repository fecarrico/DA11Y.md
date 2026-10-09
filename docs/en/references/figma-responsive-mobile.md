# Responsive layout on the canvas — widths, zoom, reflow and touch targets

> **Scope:** the web layout across screen widths, text that grows with zoom, touch targets and gestures, in Figma frames, auto layout and text properties. App screens (iOS, Android) are in [`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-platform-native.md).
> **Translates:** A11Y.md [`guide-responsive-mobile.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-responsive-mobile.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where it shows up in nodes

| What | Node and property | Rule |
| :--- | :--- | :--- |
| Screen at a width | `FRAME`, a direct child of the page, and its `width` | on a web screen, the file's unit stands for the CSS px |
| Content that adapts | auto layout with `layoutSizingHorizontal` `FILL` or `HUG`, `layoutWrap`, `minWidth` and `maxWidth` | a `FIXED` width does not follow the screen |
| Grid | `layoutMode: GRID` and `gridColumnCount` | the narrow frame shows how the columns fold |
| Element out of the flow | `layoutPositioning: ABSOLUTE` | auto layout does not place it: check it at each width |
| Text | `textAutoResize`, `maxLines`, `textTruncation` and the container's `layoutSizingVertical` | text the person reads grows in height |
| Target | the box of the interactive `FRAME` or `INSTANCE`: `width`, `height`, `minWidth`, `minHeight` | never the icon inside it |
| Gesture | a `reactions` entry with `ON_DRAG` | needs a tap or click path on a visible control |

## 2. The widths the design must show

- **The narrowest width, 320 wide** (320 CSS px, the same as 400% zoom on a 1280px viewport, SC 1.4.10). Code will need this layout. If no frame shows it, the developer invents it, as with a missing state (DA11Y.md Section 2.1). Point it out, and draw it only with authorization.
- **Text at 200%** (SC 1.4.4). The canvas does not zoom text. The properties in Section 3 show whether the text would grow or be cut.
- **Orientation** (SC 1.3.4). A design drawn only in portrait does not lock the orientation. A lock is a decision, and it needs a reason (Section 4).

## 3. What to measure

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Reflow | in the 320 frame, the `width` and `absoluteBoundingBox` of each child against the frame | nothing is wider than the frame, so nothing scrolls in two directions. Data tables, maps and charts are the exception and scroll inside their own container (SC 1.4.10) |
| Fixed widths | `layoutSizingHorizontal` and `width` of the containers of text and controls | `FILL` or `HUG`, with `maxWidth` when needed. A `FIXED` container wider than the frame breaks reflow |
| Text that grows | `textAutoResize`, `maxLines`, `textTruncation`, and `layoutSizingVertical` of the container | text in `HEIGHT` or `WIDTH_AND_HEIGHT` inside a `HUG` container. `TRUNCATE`, `maxLines` or a `FIXED` height cut the text at 200% (SC 1.4.4) and under the user's text spacing (SC 1.4.12) |
| Target | `width`, `height`, `minWidth` and `minHeight` of the interactive box | the profile's minimum target: 24×24 under Standard (SC 2.5.8), 44×44 under Shield (SC 2.5.5, 48×48 advised). On touch surfaces, design at 44×44 (House Rule†). Below the floor, a target passes only through an exception: an equivalent target that meets the floor does the same action (Standard and Shield), or, under Standard, the target sits inline in text or the 24 circle of DA11Y.md Section 3 touches no other target (SC 2.5.8) |
| Spacing | `itemSpacing` between targets, and `counterAxisSpacing` between wrapped rows | 8px between neighboring targets (House Rule†), at every width |
| Gestures | `ON_DRAG` reactions | the same result has an `ON_CLICK` or `ON_PRESS` on a visible control (SC 2.5.1) |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category, starting with the status `Agent suggestion — confirm`, on the screen frame or on the node:

- **What moves at the narrow width:** where each item that leaves the layout goes (a menu button, a disclosure), so no content and no function is lost.
- **Content that keeps scrolling in two directions** (table, map, chart): which container scrolls, as the exception of SC 1.4.10.
- **Orientation:** not locked. If the design locks it, why it is essential (SC 1.3.4).
- **Gesture equivalents:** for each swipe or multi-finger gesture, the visible control that does the same (SC 2.5.1).

Pin `width` on the screen frame, `minWidth` and `minHeight` on each target, and `itemSpacing` on the container of neighboring targets.

```markdown
**Agent suggestion — confirm**
Screen "Orders" at 320 wide · the filter bar moves into the "Filters" button
Table "Order history": scrolls horizontally inside its container (exception of SC 1.4.10)
Orientation: not locked · swipe between tabs: the tab buttons do the same
```

## 5. Anti-patterns on the canvas

- **Only a wide frame**, with the narrow layout left for the developer to invent.
- **A `FIXED` container wider than 320** holding text or controls.
- **Text in a `FIXED`-height box, or with `maxLines` or `TRUNCATE`**, cut at 200%.
- **The target measured on the icon**, not on the interactive box.
- **Swipe (`ON_DRAG`) as the only way** to move between items.
- **Content hidden at the narrow width** with no path to reach it.

## 6. What stays for code

Real text zoom, reflow at 320 CSS px, relative units, an orientation that is not locked and a hit area enlarged by padding are implemented following A11Y.md [`guide-responsive-mobile.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-responsive-mobile.md). Its rules are checked on the built product (browser zoom at 200%, a viewport 320 CSS px wide, a touch device), never on the canvas, and enter the design report as requirements for development.
