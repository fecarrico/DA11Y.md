# Modals on the canvas — dialog, backdrop, close and confirmation

> **Scope:** the modal dialog open over a screen, including the drawer and the confirmation dialog, described in Figma nodes.
> **Translates:** A11Y.md [`guide-modals.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-modals.md), with A11Y.md Section 6 (*Leaked Focus Traps*), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Each open dialog is a frame of the flow: the screen behind, a backdrop and the dialog on top.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Dialog | `COMPONENT` in the library; each use is an `INSTANCE` | one the library lacks is a warning (DA11Y.md Section 2), drawn only with authorization |
| Container | `FRAME` with vertical auto layout: Title, Body, Actions | the auto layout order is the reading order, and the title, which names the dialog, comes first |
| Title | `TEXT`, visible, exposed as a `TEXT` property named "Title" | says what the dialog is for ("Confirm deletion") |
| Close button | a button `INSTANCE` in its own `FRAME` | always present, visible and labeled. In a corner with `layoutPositioning: ABSOLUTE` it leaves the flow, so the order annotation says where it sits |
| Body | `TEXT` and instances in a `FRAME` that hugs them | content that grows pushes the dialog, never gets cut |
| Actions | button `INSTANCE`s in a horizontal auto layout `FRAME` | each one a target |
| Backdrop | `RECTANGLE` or `FRAME` covering the screen | the page behind it leaves the reading and focus order while the dialog is open |

## 2. States the component must have

- **Focus on Close and every action**, from the button component's `State` set ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md)).
- **One open frame per dialog**, over the screen that holds the control that opens it, so the annotation can name where focus returns.
- **A confirmation frame** when the dialog holds input (Section 5).

## 3. What to measure, from the properties

Beyond the profile's floor (DA11Y.md Section 3), specific to the dialog:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Ways in and out | `reactions` of the opening control and of Close | the opener has `ON_CLICK` or `ON_PRESS`. Close has its own reaction that closes the dialog (`CLOSE`, `BACK` or navigation back). An `ON_KEY_DOWN` for Esc is welcome. Without it, Esc goes in the annotation |

## 4. What becomes an annotation

On the dialog instance (DA11Y.md Section 4):

- **Role and name:** a modal dialog, named by its visible title.
- **Focus when it opens:** inside the dialog, on the title or the first control. Say which.
- **Focus stays inside:** `Tab` and `Shift+Tab` cycle only through the dialog. The page behind is out of reach by keyboard and by screen reader.
- **Esc always closes it.**
- **Focus when it closes:** back on the control that opened it. Name that control.
- **Close name:** "Close", when Close is an icon only.
- **Order:** on the open frame, the order annotation lists only the dialog's elements.

Pin the measured value ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4): `minWidth` and `minHeight` on the Close `FRAME`, `fills` and `fontSize` on the title, `fills` on the container.

```markdown
**Agent suggestion — confirm**
Modal dialog "Confirm deletion" · name: from the title · opened by: "Delete file"
Focus: lands on the title · Tab cycles inside only · page behind out of reach
Esc and "Close" close it · focus returns to "Delete file"
```

## 5. Unsaved input and confirmation

- **Unsaved input.** When the dialog holds input and the person presses Esc or Close, the product asks before the input is lost. On the canvas that is one more frame of the flow, reached from Close in the prototype. The annotation says Esc leads there too. A flow without it is a warning to the person.
- **Destructive confirmation.** A dialog or an alert dialog are equally conformant. The annotation proposes one, and the choice goes to [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md) by pattern, never by screen (A11Y.md Section 2, *Decision Memory*).

## 6. When the task creates or changes the dialog in the design system

- **Description:** "Modal dialog. Use it for a task or decision that needs an answer before going back to the page. Do not use it for a passing message (use Toast) or for extra information about one control (use Tooltip or Popover). Aliases: modal, dialog, popup, drawer."
- **Properties:** `Title` and the action labels (TEXT). Never a BOOLEAN that hides Close.

## 7. Anti-patterns on the canvas

- **No visible, labeled Close**, or Close hidden by a component property.
- **Esc or a click outside as the only way out.**
- **An order annotation that still lists the page behind** the open dialog.
- **A dialog with a form and no confirmation** before what was typed is lost.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-modals.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-modals.md); its verification scenarios run on the built product and enter the report as requirements for development.
