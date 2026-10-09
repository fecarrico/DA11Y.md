# Feeds on the canvas — list, Load more, automatic loading and footer

> **Scope:** feeds, endless lists and automatic pagination (the list, its items, the Load more button, the skip link and the footer), described in Figma nodes.
> **Translates:** A11Y.md [`guide-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-infinite-scroll.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

"Load more" is the accessible default. Infinite scroll is the exception that has to earn it, because loading on scroll takes away the footer, the scrollbar as a sense of position, and the Back button.

| Part | Node | Rule |
| :--- | :--- | :--- |
| List or feed | `FRAME` with vertical auto layout (or `GRID`), items as `INSTANCE`s | the auto layout order is the reading order. A new batch goes after the last item |
| Item | `INSTANCE` of the card or row | focus lands on the first new item after Load more, so the item has a Focus state |
| Load more | button `INSTANCE` in its own `FRAME`, after the last item | a visible button. See [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md) |
| Batch loading | the loading state of the list | see [`figma-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-loading-skeleton.md) |
| Skip link | a link `INSTANCE` before the list, or a `FRAME` holding a `TEXT` with `hyperlink` | needed when the list grows on its own with no Load more |
| Footer | `FRAME` after the list | the design shows how it is reached |

## 2. States the component must have

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Before and after a batch.** Two frames of the same list. The second keeps the existing items in the same order and adds the new ones after them.
- **Focus** on Load more, on the item and on the skip link (Section 3).
- **Automatic loading that stops.** When the list loads on its own, a frame shows where it stops after a few batches and Load more appears, unless a skip link already leads past the list.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| New items come after | the auto layout order of the list in the before and after frames | the existing items keep their order and the new ones follow the last. An item inserted above, or a re-sorted list, fails (SC 3.2.2 in spirit) |
| Footer reachable | the screen frame | Load more, a frame where automatic loading stops, or a skip link before the list exists (Principle Zero, SC 2.4.1) |
| Focus | the Focus variant's `strokes` and `strokeWeight` of the item, Load more and the skip link | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7) |
| Load more and skip link target | `width`, `height`, `minWidth` and `minHeight` of their `FRAME` | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Text | the `TEXT` `fills` of items, Load more and the skip link against the fill behind them, and their `fontSize` | the profile's text floor (4.5:1 under Standard, 7:1 under Shield) and minimum font (12px under Standard, 14px under Shield) |
| Text that grows | `textAutoResize` of item text and `layoutSizingVertical` of the item | no `TRUNCATE`, `maxLines` or `FIXED` height that cuts the text at 200% zoom |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the list, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Role.** A true feed (a stream of articles) is a feed, and each article carries its position ("21 of 200") where the total is known.
- **Load more.** After activation, focus goes to the first new item. Never to the top, never left on a button that moved.
- **Automatic loading.** One polite announcement per batch, with exact text ("20 more results, 60 of 200"), never one per item. The trigger that starts loading is not focusable and not in the accessibility tree.
- **Appending.** New items enter after the reading position. Nothing the person is reading moves or changes.
- **Back.** It returns to the same position, with the same items loaded.
- **Footer.** How it is reached: Load more, automatic loading that stops after some batches (say how many), or the skip link.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4). On the Load more `FRAME`, pin `minWidth` and `minHeight`. On the item's Focus variant, pin `strokes` and `strokeWeight`.

```markdown
**Agent suggestion — confirm**
List "Search results" · feed of articles · each one "n of 200"
Load more → focus on the first new item ("21 of 200")
Automatic loading: "20 more results, 60 of 200" (polite, once per batch)
Footer: automatic loading stops after <n> batches, then Load more · Back: same position, same items
```

## 5. Load more or automatic loading

Automatic loading drawn in the design, or built into the library, is a prior decision (DA11Y.md Section 2). The agent does not swap it for a button. It checks that what makes it acceptable is in the file, and warns about what is missing:

- the announcement per batch, annotated with exact text;
- a reachable footer: loading that stops and becomes Load more, or a skip link;
- a recoverable position: Back and "n of m" annotated.

The report also states that Load more is the accessible default, as a choice for the person.

## 6. When the task creates or changes the component in the design system

The DA11Y.md Section 2.2 context layer, applied to the feed:

- **Description:** "Feed. Use it for a long list that loads in batches, with Load more at the end. Do not use it for data compared in rows and columns (use Table). Aliases: feed, infinite scroll, endless list, load more."
- **Properties:** `Load more` (BOOLEAN), `Label` (TEXT) for the button. On the item, `State` (VARIANT: Default, Hover, Focus).
- **Layers named for what they are, in reading order:** Skip link, Items, Load more.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result of each state in each mode.

## 7. Anti-patterns on the canvas

- **Automatic loading with no Load more and no skip link:** a footer that flees on approach.
- **A new batch inserted above**, or the list re-sorted when it loads.
- **Load more with no annotated focus destination.**
- **An item with no Focus state** where focus is meant to land.
- **One announcement per item.**
- **Swapping the library's infinite scroll for a button** without authorization. That is a warning for the person to decide.

## 8. What stays for code

Focus on the first new item, the polite status for each batch, the loading trigger kept out of focus and out of the accessibility tree, the position restored by Back, the "n of m" position and the feed role are implemented following A11Y.md [`guide-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-infinite-scroll.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
