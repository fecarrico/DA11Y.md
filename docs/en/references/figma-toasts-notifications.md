# Toasts and notifications on the canvas — message, action, close and place

> **Scope:** the toast, the snackbar, the banner and the status message, described in Figma nodes.
> **Translates:** A11Y.md [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-toasts-notifications.md), pinned at commit `57564be`. A response that needs action now is a dialog: [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-modals.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

A toast fails in three independent ways: nobody hears it, nobody reaches its action in time, or it is gone before anyone reads it. The prototype's timing shows the last two. The annotation carries the first.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Toast | `COMPONENT_SET` with a `Type` variant property; each use is an `INSTANCE` | one the library lacks is a warning (DA11Y.md Section 2), drawn only with authorization |
| Container | `FRAME` with horizontal auto layout: Icon, Message, Action, Close | the auto layout order is the reading order, with the message before Action and Close |
| Icon | icon `INSTANCE` | goes with text and color, never color alone |
| Message | `TEXT` | the whole message, never cut |
| Action or link ("Undo") | a button or link `INSTANCE` in its own `FRAME` | a target, and its presence makes the toast persist |
| Close | a button `INSTANCE` in its own `FRAME` | a real button with a name |
| Place on the screen | the instance over the screen frame, for example with `layoutPositioning: ABSOLUTE` | the same relative place on every screen of the product |

Never a `GROUP` for the toast or its buttons: no box to measure and no annotation.

## 2. States and variants the component must have

- **`Type`: status and error.** Status is the default. Error, for what needs immediate attention, is the exception.
- **With an action or link, it persists** until dismissed. A timed action is a time limit (SC 2.2.1) that zoomed-in, screen reader and slow-reacting users all lose.
- **Without one, it may close by itself**, after long enough to be read: a baseline of about 6 seconds, more for a longer message.
- **Focus on Close and the action**, from the button component's `State` set ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md)). A button without Focus is a Section 2 warning.
- **Collapsed repeat.** Three identical events are one toast ("3 items archived"), never a stack.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Message and action text | the `TEXT` `fills` against the toast's `fills` | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| Type icon and Close icon | the icon's `fills` or `strokes` against the toast's `fills` | 3:1 (SC 1.4.11) |
| Focus | the Focus variant's `strokes` and `strokeWeight` against the toast's fill | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7). A shadow in `effects` alone does not count |
| Close and action targets | `width`, `height`, `minWidth`, `minHeight` of each `FRAME`, never the icon | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` between action and Close | 8px between neighboring targets (House Rule†) |
| Text that grows | `textAutoResize` of the message, `layoutSizingVertical` of the container | `HEIGHT` or `WIDTH_AND_HEIGHT` inside `HUG`. `TRUNCATE`, `maxLines` or a `FIXED` height cuts the message at 200% zoom |
| Font size | `fontSize` of message and action | the profile's minimum font: 12px under Standard, 14px under Shield |
| Error beyond color | the status and error variants side by side | icon and text differ, not only the fill |
| Time on screen | `reactions` on the instance or on the frame that shows it (a `COMPONENT_SET` has no prototyping) | with an action or link, no `AFTER_TIMEOUT` removes it. Without one, the `timeout` (in ms) gives about 6 seconds, more for a longer message |
| Same place | the toast's position inside each screen frame of the flow | the same relative place on every screen |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the toast instance, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Announcement, with the exact text:** as status, which waits its turn, or as alert, which interrupts, only for an error that needs immediate attention. Never both.
- **Focus does not move to the toast.** Whoever is typing keeps typing.
- **How long it stays:** until dismissed, or its time on screen.
- **Close:** its name ("Close"), reached by `Tab`. Esc dismisses the focused toast.
- **Where else the action lives:** the item's menu or the history.
- **Collapsed repeat**, with its text.

Pin the measured value ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4): `minWidth` and `minHeight` on the Close `FRAME`, `fills` and `fontSize` on the message.

```markdown
**Agent suggestion — confirm**
Toast "Item archived." · announced as status (waits its turn) · focus does not move
Action "Undo" · stays until dismissed · also in the item's menu
Close: "Close" button, reached by Tab · Esc dismisses it · repeats: "3 items archived"
```

## 5. Where the action lives

- **The toast is a shortcut, not the feature's address.** "Undo" that exists only in the toast has an expiry date. Check that the item's menu or the history has the same operation. If not, warn the person.
- **A response that needs action now is a dialog**, not a toast ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-modals.md)).

## 6. When the task creates or changes the toast in the design system

The DA11Y.md Section 2.2 context layer, applied to the toast:

- **Description:** "Toast. Use it for a short message about something that just happened. Do not use it for a field error (show it next to the field) or for a decision that needs an answer now (use Dialog). Aliases: snackbar, notification, status message, banner."
- **Properties:** `Type` (VARIANT), `Message` (TEXT), `Action` (BOOLEAN) with its label (TEXT). No property hides Close.
- **Layers in reading order:** Icon, Message, Action, Close button.
- **Accessibility contract as data:** one item per check in Section 3, plus the announcement and persistence, marked not tested until code verifies them.

## 7. Anti-patterns on the canvas

- **An action or link in a toast that leaves on its own** through an `AFTER_TIMEOUT`.
- **"Undo" that exists only in the toast.**
- **A stack of identical toasts** instead of one collapsed message.
- **Toasts in a different place on each screen.**
- **An error toast told apart by color alone.**
- **No Close, or a Close icon with no name.**

## 8. What stays for code

The live region that exists before the first message, the status or alert role (never both), focus that does not move, the time on screen, Close as a real button and Esc are implemented following A11Y.md [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-toasts-notifications.md) (SC 4.1.3, 2.2.1 and 2.1.1). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
