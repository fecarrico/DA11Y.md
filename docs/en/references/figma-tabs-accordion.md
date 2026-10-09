# Tabs and accordions on the canvas — tab list, tab, panel and accordion header

> **Scope:** the tab list and its panels, and the accordion with its headers and panels, described in Figma nodes.
> **Translates:** A11Y.md [`guide-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tabs-accordion.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Tabs show one panel at a time. An accordion opens and closes sections in place. In both, the panel comes right after what controls it, because that is where reading continues.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Tab list | `FRAME` with horizontal auto layout, one tab `INSTANCE` per tab | the auto layout order is the order of the tabs. Never a `GROUP` |
| Tab | `INSTANCE` of a `COMPONENT_SET` with `State` and `Selected`; its box is a `FRAME` with the label `TEXT` | the box is the target. The selected indicator (bar, underline) is a shape inside the box |
| Tab panel | `FRAME` right after the tab list in the parent's auto layout | one panel shows at a time, the selected tab's |
| Accordion | `FRAME` with vertical auto layout, one item `INSTANCE` per section | the auto layout order is the order of the sections |
| Accordion item | `COMPONENT_SET` with `State` and `Expanded`, vertical auto layout: Header, Panel | the panel comes right after its header |
| Accordion header | `FRAME` with the title `TEXT` and a chevron icon `INSTANCE` | the whole header is the target, never the chevron |
| Accordion panel | `FRAME` inside the item, after the header | with `Expanded` off it is absent or `visible: false`, so its content leaves the reading order |

## 2. States the components must have

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Tab:** Default, Hover and Focus, each with `Selected` on and off. Selected shows by more than color: a bar, an underline or a weight change, together with the color. If only the color changes between the two, the state fails (DA11Y.md Section 3).
- **Selected with Focus.** Entering the tab list lands on the selected tab, so the two always meet. Either the set has that combination, or the Focus outline still reaches 3:1 over the Selected look.
- **Accordion header:** Default, Hover and Focus, each with `Expanded` on and off. Focus stays on the header after it opens or closes, so Focus is drawn in both. The chevron changes direction and the panel appears, so the state is never color alone.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Tab and header text | the `TEXT` `fills` against the nearest ancestor fill, with `Selected` on and off | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield. An unselected tab is not disabled, and the floor holds for it |
| Selected indicator and chevron | their `fills` or `strokes` against the color around them | 3:1 |
| Focus | the Focus variant's `strokes` and `strokeWeight`, also with `Selected` or `Expanded` on | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7) |
| Target | `minWidth` and `minHeight` of each tab `FRAME` and each header `FRAME` | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` of the tab list and of the accordion | 8px between neighboring targets (House Rule†). Tabs or headers that touch are a warning, never a failure. Relaxing it goes to `A11Y-DECISIONS.md` |
| Hover only | `reactions` of tabs and headers | switching a tab or opening a panel uses `ON_CLICK` or `ON_PRESS`, never `ON_HOVER` or `MOUSE_ENTER` alone |
| Text that grows and font | `textAutoResize` and `fontSize` of labels, titles and panel text | no `TRUNCATE`, `maxLines` or `FIXED` height, and 12px under Standard, 14px under Shield |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the tab list or on the accordion, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Tabs.** The annotation gives the name of the tab list, "tab, n of N" on each tab and "selected" on the active one. The tab's panel comes next in the reading order. Keyboard: one stop for the whole list, `←` and `→` move between tabs, `Tab` goes into the panel.
- **Accordion.** Each header is a button that reads "collapsed" or "expanded". `Enter` or `Space` opens and closes it, and focus stays on the header. The content of a closed panel is skipped.

Pin the measured value: `minHeight` on the tab and on the header, `fills` on the selected indicator, `itemSpacing` on the tab list.

```markdown
**Agent suggestion — confirm**
Tabs "Order details" · 3 tabs · selected: "Items" (tab, 1 of 3)
Keyboard: one Tab stop for the list · ←/→ between tabs · Tab enters the panel
Panel: comes right after its tab in the reading order
```

## 5. Tabs only when they are tabs

Tabs are one of the cases where appearance misleads (DA11Y.md Section 4). A row that shows one panel at a time, in place, is tabs. A row that takes the person to other screens is navigation ([`figma-navigation.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-navigation.md)). A thumbnail strip or a set of filters is a row of buttons ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md)). Annotating a row as tabs promises the whole pattern: tab list, tabs, panels and arrow keys. Half the pattern is worse than plain buttons (A11Y.md core, Section 6).

## 6. When the task creates or changes tabs or accordions in the design system

- **Description, tabs:** "Tabs. Use them to switch between panels of related content on the same screen, one at a time. Do not use them to go to another screen (use Navigation) or to open several sections at once (use Accordion). Aliases: tab bar, tab group."
- **Description, accordion:** "Accordion. Use it for sections the person opens and closes in place. Do not use it to switch between views (use Tabs). Aliases: collapsible, expander, disclosure, expansion panel."
- **Properties:** on the tab, `State` (VARIANT: Default, Hover, Focus), `Selected` (VARIANT), `Label` (TEXT). On the accordion item, `State`, `Expanded` (VARIANT), `Title` (TEXT).
- **Layers in reading order:** Tab list, Tab, Panel. In the accordion item: Header (Title, Chevron), Panel.
- **Accessibility contract as data:** one item per check in Section 3, with the result of each state in each mode.

## 7. Anti-patterns on the canvas

- **The selected tab shown by color alone.**
- **An unselected tab below the text floor**, as if it were disabled.
- **The chevron as the only target** of the accordion header.
- **A tab or a panel that opens on hover only.**
- **A row annotated as tabs** that is navigation, a thumbnail strip or a set of filters.

## 8. What stays for code

The tab list, tab and panel roles, the selected state, the expanded state of each header, the link between a control and its panel, and arrow-key focus are implemented following A11Y.md [`guide-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-tabs-accordion.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
