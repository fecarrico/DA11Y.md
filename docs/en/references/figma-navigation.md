# Navigation on the canvas — regions, menus, links, breadcrumbs and headings

> **Scope:** the screen's regions, the skip link, menus and submenus, breadcrumbs, links, the heading outline and what repeats from screen to screen, described in Figma nodes.
> **Translates:** A11Y.md [`guide-navigation.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-navigation.md), pinned at commit `57564be`, with the A11Y.md core on page title (SC 2.4.2), focus not hidden (SC 2.4.11) and consistent help (SC 3.2.6).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Screen | `FRAME`, a direct child of the page, with vertical auto layout | the auto layout order of its regions is the reading order |
| Region (header, navigation, main, footer, aside) | `FRAME` named for what it is: "Header", "Main navigation", "Main" | never a `GROUP`, which accepts no annotation and leaves the region without a name |
| Skip link | `INSTANCE` with a Focus variant (Section 2) | first in the reading order (SC 2.4.1). Placed with `layoutPositioning: ABSOLUTE`, it leaves the flow, and the order annotation puts it first |
| Menu | `FRAME` with auto layout, one item `INSTANCE` per link | its auto layout order is the order of the items |
| Menu item | `INSTANCE` of a `COMPONENT_SET`; its box is a `FRAME` with the label `TEXT` | the box is the target, never the text |
| Menu button on small screens | icon-only button `INSTANCE` | follows [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md). A menu that opens as a drawer over the page follows [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-modals.md) |
| Breadcrumb | `FRAME` with horizontal auto layout, the current page last | its own navigation region, named "Breadcrumb", an ordered list, its last item marked "current page" |
| Link in running text | a `TEXT` segment with `hyperlink` (`getStyledTextSegments`) | Section 5 |
| Heading | `TEXT` | the level comes from structure, never from size (Section 5) |

## 2. States the components must have

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Menu item:** Default, Hover and Focus, each with `Current` on and off. Current shows by more than color (underline, bar, weight or icon).
- **Current with Focus.** Tabbing across the menu reaches the current item. Either the set has that combination, or the Focus outline still reaches 3:1 over the Current look.
- **Submenu trigger:** Collapsed and Expanded, each with Focus.
- **Skip link.** It needs Focus, the state in which it shows. Without it, nobody sees the skip link and development invents it.

## 3. What to measure, from the properties

Beyond the profile's floor (DA11Y.md Section 3), specific to navigation:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Current-item indicator | its `fills` or `strokes` against the color around it | the profile's floor (DA11Y.md Section 3) |
| Target | `minWidth` and `minHeight` of each item, breadcrumb link and menu button `FRAME` | the profile's floor (DA11Y.md Section 3). A link inside running text falls under the inline exception (SC 2.5.8, and SC 2.5.5 under Shield) |
| Hover only | `reactions` of the submenu trigger | it opens with `ON_CLICK` or `ON_PRESS`. With `ON_HOVER` or `MOUSE_ENTER` alone, keyboard and touch never reach it (🔴, DA11Y.md Section 1) |
| Another tab | a `URL` action with `openInNewTab` | the link's text or annotated name says "opens in a new tab" |

## 4. What becomes an annotation

Annotations (DA11Y.md Section 4):

- **On the screen frame:**
  - the page title (SC 2.4.2), unique in the product, most specific part first, as in `Invoice #482 · <product>`
  - the regions, with a distinct name for each one that repeats ("Main navigation", "Breadcrumb", "Footer navigation")
  - the numbered reading and focus order, with the skip link first and Main as its destination
  - the heading outline (Section 5)
- **On a destination screen reached without reload**, focus goes to the new content's H1 or to the top of the page, and the title changes.
- **On a header that stays in place while the page scrolls**, the focus of what passes under it is never entirely hidden (SC 2.4.11).
- **On the menu**, the annotation says "list, N items", marks "current page" on this screen's item and says that each submenu opens on `Enter`, click or tap and closes on `Esc`.

Pin the measured value: `minHeight` on the item, `fills` on its label and on the current indicator, `itemSpacing` on the menu, `textStyleId` and `fontSize` on each heading.

```markdown
**Your decision · agent proposal**
Region "Main navigation" · list, 5 items · current page: "Orders"
Submenu "Account": opens on Enter, click or tap · closes on Esc
Order: 1 "Skip to main content" → Main · 2 Logo · 3 Main navigation
```

## 5. Links, headings and the same navigation on every screen

- **The link text says where it goes** (SC 2.4.4). When cards repeat "Read more", the annotation gives each one a name made of the card title and the visible text.
- **A file link** gives the format and, ideally, the size: "Download the annual report (PDF, 2 MB)".
- **Headings** (SC 2.4.6, 1.3.1). One H1 per screen, describing it. Levels never skip: H2 then H4 is a hole in the outline. The text describes the section it opens. `textStyleId`, `fontSize` and `fontWeight` are clues, never the level. A bold body text that opens a section is a heading.
- **Lists.** Related items in sequence are a list, menus included. A list inside one `TEXT` is declared (`getRangeListOptions`), not typed characters.
- **The same navigation on every screen** (SC 3.2.3, 3.2.4). Header and menu are instances of the same main component on every screen of the flow: compare `mainComponent` and the order of the items, help included (SC 3.2.6).
- **Breadcrumb** (SC 2.4.8, AAA). Under Shield, SC 2.4.8 applies, and a breadcrumb is one way to meet it. Under Standard, it is recommended for any hierarchy deeper than two levels.
- **A side navigation with expandable sections is navigation, not a tree** ([`figma-treeview.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-treeview.md) Section 1).

## 6. When the task creates or changes the navigation in the design system

- **Description:** "Main navigation. Use it for the links repeated on every screen. Do not use it for actions on the page (use Button) or to choose in a hierarchy (use Tree view). Aliases: nav, menu, navbar, top bar."
- **Properties:** `State` (VARIANT: Default, Hover, Focus), `Current` and `Expanded` (VARIANT), `Label` (TEXT), `Has submenu` (BOOLEAN).

## 7. Anti-patterns on the canvas

- **A submenu that opens on hover only.**
- **A link to another tab that does not say so.**
- **A heading chosen by size**, or a bold text that opens a section and stays out of the outline.
- **The navigation redrawn on one screen**, outside the shared main component or with its items in another order.
- **A skip link with no Focus state drawn.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-navigation.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-navigation.md); its verification scenarios run on the built product and enter the report as requirements for development.
