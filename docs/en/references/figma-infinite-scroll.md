# Feeds on the canvas — list, Load more, automatic loading and footer

> **Scope:** feeds, endless lists and automatic pagination (the list, its items, the Load more button, the skip link and the footer), described in Figma nodes.
> **Translates:** A11Y.md [`guide-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-infinite-scroll.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

"Load more" is the accessible default. Infinite scroll is the exception that has to earn it, because loading on scroll takes away the footer, the scrollbar as a sense of position, and the Back button.

| Part | Node | Rule |
| :--- | :--- | :--- |
| List or feed | `FRAME` with vertical auto layout (or `GRID`), items as `INSTANCE`s | the auto layout order is the reading order. A new batch goes after the last item |
| Item | `INSTANCE` of the card or row | focus lands on the first new item after Load more, so the item has a Focus state |
| Load more | button `INSTANCE` in its own `FRAME`, after the last item | a visible button. See [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md) |
| Batch loading | the loading state of the list | see [`figma-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-loading-skeleton.md) |
| Skip link | a link `INSTANCE` before the list, or a `FRAME` holding a `TEXT` with `hyperlink` | needed when the list grows on its own with no Load more |
| Footer | `FRAME` after the list | the design shows how it is reached |

## 2. States the component must have

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Before and after a batch.** Two frames of the same list. The second keeps the existing items in the same order and adds the new ones after them.
- **Focus** on Load more, on the item and on the skip link.
- **Automatic loading that stops.** When the list loads on its own, a frame shows where it stops after a few batches and Load more appears, unless a skip link already leads past the list.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| New items come after | the auto layout order of the list in the before and after frames | the existing items keep their order and the new ones follow the last. An item inserted above, or a re-sorted list, fails (SC 3.2.2 in spirit) |
| Footer reachable | the screen frame | Load more, a frame where automatic loading stops, or a skip link before the list exists (Principle Zero, SC 2.4.1) |

## 4. What becomes an annotation

Each item is an annotation on the list (DA11Y.md Section 4):

- **Role.** A true feed (a stream of articles) is a feed, and each article carries its position ("21 of 200") where the total is known.
- **Load more.** After activation, focus goes to the first new item. Never to the top, never left on a button that moved.
- **Automatic loading.** One polite announcement per batch, with exact text ("20 more results, 60 of 200"), never one per item. The trigger that starts loading is not focusable and not in the accessibility tree.
- **Appending.** New items enter after the reading position. Nothing the person is reading moves or changes.
- **Back.** It returns to the same position, with the same items loaded.
- **Footer.** How it is reached: Load more, automatic loading that stops after some batches (say how many), or the skip link.

Pin `minWidth` and `minHeight` on the Load more `FRAME`, and `strokes` and `strokeWeight` on the item's Focus variant ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4).

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

- **Description:** "Feed. Use it for a long list that loads in batches, with Load more at the end. Do not use it for data compared in rows and columns (use Table). Aliases: feed, infinite scroll, endless list, load more."
- **Properties:** `Load more` (BOOLEAN), `Label` (TEXT) for the button. On the item, `State` (VARIANT: Default, Hover, Focus).

## 7. Anti-patterns on the canvas

- **Automatic loading with no Load more and no skip link:** a footer that flees on approach.
- **A new batch inserted above**, or the list re-sorted when it loads.
- **Load more with no annotated focus destination.**
- **An item with no Focus state** where focus is meant to land.
- **One announcement per item.**
- **Swapping the library's infinite scroll for a button** without authorization. That is a warning for the person to decide.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-infinite-scroll.md); its verification scenarios run on the built product and enter the report as requirements for development.
