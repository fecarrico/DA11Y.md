# Tree views on the canvas — tree, node, chevron and depth

> **Scope:** tree views, file explorers, nested hierarchy pickers and layer panels, described in Figma nodes.
> **Translates:** A11Y.md [`guide-treeview.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-treeview.md), pinned at commit `68f4be1`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. First ask whether it is a tree

Most hierarchies drawn as trees are something else. Annotated as a tree, they get worse: a tree is a selection widget with arrow keys, so the person's normal reading commands stop working and links stop being announced as links. The role goes in the annotation (Section 5), so decide it first.

| What it really is | Annotate as | Guide |
| :--- | :--- | :--- |
| site or docs navigation with links | navigation: links in nested lists, expandable sections as buttons with an expanded state | [`figma-navigation.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-navigation.md) |
| sections of content that open and close | accordion | [`figma-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-tabs-accordion.md) |
| a filter with nested checkboxes | groups of checkboxes | [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-form-controls.md) |
| **selecting or exploring items in a hierarchy** (file explorer, org chart picker, layer panel) | **tree** | this guide |

If the person is going somewhere, it is navigation. If the person is choosing something in a hierarchy, it is a tree.

## 2. Anatomy in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Tree | `FRAME` with vertical auto layout | the auto layout order is the order of the visible nodes. Never a `GROUP` |
| Node | `INSTANCE` of a `COMPONENT_SET`; its row is a `FRAME` with horizontal auto layout: Chevron, Icon, Label | the whole row is the target. A chevron that does something other than the row is a target of its own, with its own `FRAME` |
| Children | a `FRAME` nested inside the parent node, after its row | the layer tree mirrors the hierarchy, and the children come right after their parent |
| Chevron | icon `INSTANCE`, only on nodes that have children | a leaf has no chevron and no Expanded state. A leaf that looks closed announces something that will never open |
| Depth | the nesting, or the row's `paddingLeft` | indentation is visual only. When the tree is drawn flat, with depth only in `paddingLeft`, the annotation gives each node its level (Section 5) |

## 3. States the component must have

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Node:** Default, Hover and Focus, each with `Selected` on and off. Selected shows by more than color: an icon, a bar or a weight change, together with the color.
- **Expanding is not selecting.** `Expanded` and `Selected` are separate variant properties, never two values of one `State`. A node can be open and not selected, or selected and closed. A set with a single "open and highlighted" look cannot draw "I opened this folder to look inside without choosing it".
- **Selected with Focus.** `Space` selects the focused node, so the two meet. Either the set has that combination, or the Focus outline still reaches 3:1 over the Selected look.
- **Loading**, on a branch that loads its children on demand. The announcement goes in Section 5.

## 4. What to measure, from the properties

Beyond the profile's floor (DA11Y.md Section 3), specific to the tree:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Selected indicator and chevron | their `fills` or `strokes` against the color around them | the profile's floor (DA11Y.md Section 3) |
| Hover only | `reactions` of the row and the chevron | expanding and selecting never happen through `ON_HOVER` or `MOUSE_ENTER` alone |

## 5. What becomes an annotation

On the tree (DA11Y.md Section 4):

- **Role and name:** "tree", with its name ("Project files"), only after Section 1 confirms it is a tree.
- **Level and position.** When branches load on demand, or only part of the tree is drawn at a time, the annotation says so. Then every visible node needs its level, its position and the size of its set: "src, expanded, level 1, 2 of 5".
- **Expanded or collapsed** on nodes with children, and neither on leaves.
- **Selection:** single or multiple. In a multi-select tree, every node reads "selected" or "not selected", never silence.
- **Loading**, with the exact text: the wait, then the result ("src expanded, 12 items").
- **Keyboard:** one `Tab` stop for the whole tree. `↑` and `↓` move through visible nodes only. `→` expands, then enters the first child. `←` collapses, then goes to the parent. `Home` and `End` reach the ends. `Enter` activates, `Space` selects, a letter jumps to the next node starting with it, and `*` expands every sibling.

Pin the measured value: `minHeight` on the row, `fills` on the selected indicator, `itemSpacing` on the tree.

```markdown
2 · tree "Project files"
🔊 tree "Project files" · each folder: expanded or collapsed
📢 branch loading: "Loading" → "src expanded, 12 items"
```

## 6. When the task creates or changes the tree in the design system

- **Description:** "Tree view. Use it to select or explore items in a hierarchy: files, an org chart, layers. Do not use it for site navigation (use Navigation), for sections that open and close (use Accordion) or for nested filters (use Checkbox). Aliases: tree, file explorer, hierarchy picker."
- **Properties:** `State` (VARIANT: Default, Hover, Focus, Loading), `Selected` and `Expanded` (VARIANT, separate), `Has children` (BOOLEAN), `Label` (TEXT), `Icon` (INSTANCE_SWAP).

## 7. Anti-patterns on the canvas

- **Navigation annotated as a tree.**
- **A chevron on a leaf**, or a leaf that looks closed.
- **Expanded and Selected drawn as one state.**
- **Depth only in `paddingLeft`**, with no level in any annotation.
- **A branch that loads with no announcement written.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-treeview.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-treeview.md); its verification scenarios run on the built product and enter the report as requirements for development.
