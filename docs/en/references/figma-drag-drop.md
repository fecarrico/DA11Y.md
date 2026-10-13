# Drag and drop on the canvas — handle, Move menu, drop targets and file drop zone

> **Scope:** reorderable lists, kanban boards, file drop zones and anything sortable (the item, its handle, its Move menu, the item while it moves and the drop targets), described in Figma nodes.
> **Translates:** A11Y.md [`guide-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-drag-drop.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Dragging is a shortcut, never the mechanism. Draw the outcome first (move item X to position Y), then three ways to reach it: drag, a single pointer with no drag, and the keyboard.

| Part | Node | Rule |
| :--- | :--- | :--- |
| List or board column | `FRAME` with auto layout, items as `INSTANCE`s | the auto layout order is the item order and the reading order |
| Item | `INSTANCE` of the row or card, with a `State` variant | named for its content ("Invoice.pdf") |
| Handle | icon button `INSTANCE` in its own `FRAME`, at the profile's minimum target | a real button whose name names the item. A bare icon (`VECTOR`) has no target box, and a `BOOLEAN_OPERATION` accepts no annotation |
| Move menu | a menu button `INSTANCE` on the item, opening Move up, Move down and Move to… | the single-pointer alternative (SC 2.5.7), visible without hover |
| Drop target | `FRAME` whose target state adds an outline (`strokes`), a pattern or an insertion line (`LINE` or `RECTANGLE`) | 3:1 and a cue that is not color |
| File drop zone | `FRAME` with a `TEXT` and a button `INSTANCE` that opens the file chooser | Section 5 |

## 2. States the component must have

The item's `State` property has at least **Default, Focus and Grabbed** (picked up and moving). The handle and the menu button have Focus. A drop target has a state for a valid target, and one for the current target when the design highlights it. A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Focus during the move.** The Grabbed variant keeps the focus outline, because visible focus tracks the item through the whole move (SC 2.4.7).
- **Grabbed beyond color.** Compare Default and Grabbed: if only the fill changes, the state is shown by color alone.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Drag only | `ON_DRAG` reactions on items, handles and zones (on each `COMPONENT`, because the `COMPONENT_SET` has no prototyping) | the same move also exists in a drawn control, such as the Move menu or the file button. Without it, the action is drag-only: 🔴 CRITICAL (SC 2.5.7) |
| Hover only | `visible` of the handle and the menu button in the Default variant, and `ON_HOVER` or `MOUSE_ENTER` reactions that reveal them | both are visible with no hover |
| Drop indicator | the target variant's `strokes`, or the insertion line's `fills` or `strokes`, against the adjacent color | 3:1 (SC 1.4.11) |
| Target beyond color | the default and valid-target variants side by side | an outline, pattern or insertion line appears, not only a change of fill |
| Focus in Grabbed | `strokes` and `strokeWeight` of the Grabbed variant against the adjacent color | the profile's focus floor (DA11Y.md Section 3), the same as the Focus variant |

## 4. What becomes an annotation

Each item is an annotation on the handle or the list (DA11Y.md Section 4):

- **Handle.** A button named for the item ("Reorder Invoice.pdf"), with persistent instructions for moving it, because the pattern cannot be guessed.
- **Keyboard model.** `Space` or `Enter` picks up, the arrows move one position, `Space` drops, `Esc` cancels and returns the item to where it started. Focus stays on the item the whole time.
- **Three announcements, with exact text,** through one polite status: "Invoice.pdf grabbed, position 2 of 5" → "moved to position 3 of 5" → "dropped at position 3". On cancel: "reorder cancelled, returned to position 2". The current drop target is named in the announcement, not only highlighted.
- **Move menu.** Its options, and the announcement of the new position.
- **Native app.** The same moves exposed as custom actions ([`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-platform-native.md)).
- **File drop zone.** The button opens the file chooser.

Pin `minWidth` and `minHeight` on the handle `FRAME`, and `strokes` and `strokeWeight` with the measured ratio on the target variant ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4).

```markdown
**Your decision · agent proposal**
Handle on "Invoice.pdf" · role: button · name: Reorder Invoice.pdf
Instructions (persistent): Space or Enter picks up, arrows move, Space drops, Esc cancels
Announce (polite): "Invoice.pdf grabbed, position 2 of 5" → "moved to position 3 of 5" → "dropped at position 3"
Esc: "reorder cancelled, returned to position 2" · focus stays on the handle
```

## 5. Three paths to the same move, and the file drop zone

- **Drag:** `ON_DRAG` in the prototype. A shortcut.
- **Single pointer:** the Move menu, or a numbered position selection, drawn. It is also the path for voice control, switch access and touch users with motor impairments.
- **Keyboard:** the Section 4 annotation. An `ON_KEY_DOWN` reaction, when the prototype has one, shows that the design anticipated the keyboard, and it does not replace the annotation.
- **File drop zone:** the zone comes with a visible button that opens the file chooser ("Choose files"). "Drag files here" as the only path fails SC 2.5.7 at the first step of the flow.

## 6. When the task creates or changes the component in the design system

- **Description:** "Sortable item. Use it in a list or board the person can reorder, with its handle and its Move menu. Do not use it in a list with a fixed order. Aliases: drag handle, reorder, sortable, kanban card." For the zone: "File drop zone. Always with its Choose files button. Aliases: dropzone, file upload, uploader."
- **Properties:** `State` (VARIANT: Default, Hover, Focus, Grabbed), `Item name` (TEXT), the text the handle's name is built from. On the drop target, `State` (VARIANT: Default, Valid target, Current target).

## 7. Anti-patterns on the canvas

- **Drag as the only way** to reorder or to upload.
- **A handle that is just an icon**, with no box and no name, or one that shows only on hover.
- **The Move menu only on hover.**
- **A drop target shown by background color only.**
- **The focus outline lost in the Grabbed state.**
- **"Drag files here" with no button.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-drag-drop.md); its verification scenarios run on the built product and enter the report as requirements for development.
