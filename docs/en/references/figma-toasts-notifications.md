# Toasts and notifications on the canvas — message, action, close and place

> **Scope:** the toast, the snackbar, the banner and the status message, described in Figma nodes.
> **Translates:** A11Y.md [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-toasts-notifications.md), pinned at commit `57564be`. A response that needs action now is a dialog: [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-modals.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

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

## 2. States and variants the component must have

- **`Type`: status and error.** Status is the default. Error, for what needs immediate attention, is the exception.
- **With an action or link, it persists** until dismissed. A timed action is a time limit (SC 2.2.1) that zoomed-in, screen reader and slow-reacting users all lose.
- **Without one, it may close by itself**, after long enough to be read: a baseline of about 6 seconds, more for a longer message.
- **Focus on Close and the action**, from the button component's `State` set ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)).
- **Collapsed repeat.** Three identical events are one toast ("3 items archived"), never a stack.

## 3. What to measure, from the properties

Beyond the profile's floor (DA11Y.md Section 3), specific to the toast:

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Error beyond color | the status and error variants side by side | icon and text differ, not only the fill |
| Time on screen | `reactions` on the instance or on the frame that shows it (a `COMPONENT_SET` has no prototyping) | with an action or link, no `AFTER_TIMEOUT` removes it. Without one, the `timeout` (in ms) gives about 6 seconds, more for a longer message |
| Same place | the toast's position inside each screen frame of the flow | the same relative place on every screen |

## 4. What becomes an annotation

**In the annotation on the toast instance**, with the reading from DA11Y.md Section 4 in the short format of Section 5:

- **Announcement, with the exact text:** as status, which waits its turn, or as alert, which interrupts, only for an error that needs immediate attention. Never both.
- **Close.** Its name is "Close".
- **Collapsed repeat**, with its text.

**In the report**, as requirements for development:

- **Focus does not move to the toast.** Whoever is typing keeps typing.
- **How long it stays.** With an action or a link, it stays until dismissed. Without an action, state its time on screen.
- **Close.** `Tab` reaches it. Esc dismisses the focused toast.
- **Where else the action lives:** the item's menu or the history.

Pin the measured value ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4): `minWidth` and `minHeight` on the Close `FRAME`, `fills` and `fontSize` on the message.

```markdown
5–6 · toast "Item archived."
📢 "Item archived."
5) 🔊 button "Undo"
6) 🔊 button "Close"
```

## 5. Where the action lives

- **The toast is a shortcut, not the feature's address.** "Undo" that exists only in the toast has an expiry date. Check that the item's menu or the history has the same operation. If not, warn the person.
- **A response that needs action now is a dialog**, not a toast ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-modals.md)).

## 6. When the task creates or changes the toast in the design system

- **Description:** "Toast. Use it for a short message about something that just happened. Do not use it for a field error (show it next to the field) or for a decision that needs an answer now (use Dialog). Aliases: snackbar, notification, status message, banner."
- **Properties:** `Type` (VARIANT), `Message` (TEXT), `Action` (BOOLEAN) with its label (TEXT). No property hides Close.

## 7. Anti-patterns on the canvas

- **An action or link in a toast that leaves on its own** through an `AFTER_TIMEOUT`.
- **"Undo" that exists only in the toast.**
- **A stack of identical toasts** instead of one collapsed message.
- **Toasts in a different place on each screen.**
- **No Close, or a Close icon with no name.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-toasts-notifications.md); its verification scenarios run on the built product and enter the report as requirements for development.
