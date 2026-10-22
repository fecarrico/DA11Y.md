# App screens on the canvas — iOS, Android and the Brazil mobile layer

> **Scope:** iOS and Android app screens in Figma nodes: the unit, targets, text that scales with the system, gestures and their custom actions, intent annotated in platform words, and what ABNT NBR 17060 decides on the canvas for a Brazilian audience. Only what is decided on the canvas: the platform APIs stay with code.
> **Translates:** A11Y.md [`guide-platform-native.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-platform-native.md), pinned at commit `9fb9a02`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where it shows up in nodes

| What | Node and property | Rule |
| :--- | :--- | :--- |
| App screen | `FRAME`, a direct child of the page | 1 unit = 1 pt on iOS, 1 dp on Android (DA11Y.md Section 0.1) |
| System status bar (time, battery) | the `FRAME` or `INSTANCE` at the top of the screen, above the navigation bar | out of the reading, the measurements and the annotations: it belongs to the system, not to the screen |
| Navigation bar | the `FRAME` or `INSTANCE` with Back, the title and the screen's actions | read in this order: Back, the title as `heading`, the actions on the right. The large content title, when there is one, is another `heading`, right after |
| Platform control (button, switch, alert) | `INSTANCE` of the library component that stands for it | the native control brings semantics, focus and target. A control drawn from scratch owes the whole contract |
| Target | the box of the interactive `FRAME` or `INSTANCE` | never the icon inside it |
| Text | `TEXT` with `textAutoResize`, `maxLines` and `textStyleId` | it grows with the system font size |
| Action behind a gesture | a variant that reveals it (row swiped, menu open) or an `ON_DRAG` reaction | needs a custom action, and a visible path when it is essential (Section 5) |
| Motion | `animations` and `timelines` | a reduced-motion variant, for the system's reduced-motion setting |
| Timer | an `AFTER_TIMEOUT` reaction | can be turned off, adjusted or extended (SC 2.2.1), see [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-cognitive.md) |

## 2. States the screen must have

- **Focus** on every interactive element, because an external keyboard and switch control move through the same order.
- **The revealed state of every gesture** (row swiped, long-press menu open), so each action has a visible name to annotate.

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

## 3. What to measure

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Target | `width`, `height`, `minWidth` and `minHeight` of the interactive box | the platform norm, 44×44 on iOS and 48×48 on Android, which meets the A11Y.md rule†. A control drawn from scratch below it still meets the profile's floor (DA11Y.md Section 3) |
| Text at the largest system size | `textAutoResize`, `maxLines`, `textTruncation`, and `layoutSizingVertical` of the container | text grows in height inside `HUG` containers. `TRUNCATE`, `maxLines` or a `FIXED` height cut it or make it overlap |
| Contrast | the pairs of each mode, including increased contrast when the file has it | [`figma-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-visual-perception.md) |
| Action only by gesture | `ON_DRAG` reactions and the variants a gesture reveals | each action also has a custom action, and a visible path when essential (Section 5, SC 2.5.1 and 2.5.7) |

## 4. What becomes an annotation

On an app screen, the annotation says the intent in plain words: "heading", "announced", "read as one". It never carries ARIA or a CSS pixel, because code would copy a web idiom the platform does not have, and that is 🔴 CRITICAL.

**In the element's annotation**, with the reading from DA11Y.md Section 4 in the short format of Section 5:

- **Headings** and the screen title, as `heading`, with no level. The navigation bar's title is one of them, and the status bar stays off the list (Section 1).
- **The name** of every control without visible text. A name contains the visible text (SC 2.5.3), and a verb the screen does not show ("Open …") does not go into the name.
- **Read as one:** a label and its value that are read together ("Balance, 120 reais").
- **The announcements** (toasts, async results, validation errors), with their exact text.
- **Custom actions** of each element (Section 5).

**In the report**, as requirements for development:

- **Focus or announcement on opening:** where focus lands, or what is announced, when the screen opens. By default, the screen title.
- **Focus of each control:** a platform control uses the system's focus; a control drawn from scratch needs its Focus state designed (DA11Y.md Section 3).
- **Modal:** what the screen behind it blocks.

Pin `minWidth` and `minHeight` on each target, and `fontSize` and `textStyleId` on the texts.

```markdown
4 · row "March invoice"
🔊 "March invoice, 120 reais, due on the 10th" · actions "Archive", "Delete"
📢 after Archive: "Invoice archived"
```

## 5. Gestures and custom actions

An action that exists only as a gesture (swipe, long press, drag) does not exist for a screen reader, switch control or voice control.

1. **List every action reachable only by gesture** as a custom action, in the element's annotation. The row's tap stays a tap. What is listed are the consequences of the swipe: archive, delete, pin.
2. **Each label** is short, starts with the verb and repeats the text the interface shows for the same action elsewhere (SC 2.5.3).
3. **No duplicates.** If the row's buttons are focusable on their own, say whether they become custom actions instead. Both at once means every action is announced twice.
4. **A supplement, never a hiding place.** An action essential to the task also has a visible path for everyone, such as a menu or a details screen. Check that this path is drawn. If it is not, that is a warning.

## 6. Brazil — ABNT NBR 17060 on the canvas

When the product reaches a Brazilian audience on a phone or tablet (native, hybrid or web app, and a site opened on the phone), ABNT NBR 17060:2022 sits beside WCAG. A design that meets this standard at its profile already meets nearly every item. This is what the canvas decides:

- **Visible label before the field** (5.1.1.11): above or to the left of the field, and a placeholder is never the label. See [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md).
- **Steps in sequence** (5.1.1.16): a flow in steps shows the total and the current position ("Step 2 of 4"). A paginated list shows the range and the total ("11–20 of 57 items"). The current step differs by more than color.
- **Accessibility settings** (5.1.2.1): text that grows and a reduced-motion variant, because the system's font, contrast and motion settings are honored.
- **Time limits** (5.1.2.6): every timer that is not essential, chat windows included, follows SC 2.2.1.
- **Flashing** (5.1.1.25): nothing flashes more than three times per second, and content that may flash has a warning drawn before it plays. See [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-media.md).
- **Target** (5.1.2.13, a recommendation): the norm recommends 44×44, and the platform norms already exceed it.
- **No stall in sequential navigation** (5.1.2.14): the focus order annotation reaches every control. The test itself is human.
- **Mapping:** under Standard, every requirement of the norm. Under Shield, every requirement and every recommendation, and each unmet recommendation is justified in [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/EXCEPTIONS.md). The report annotation names NBR 17060 beside the profile. The agent never claims conformance with the norm: the human validator does, from the report.

## 7. Anti-patterns on the canvas

- **ARIA or CSS pixels** in the annotations of an app screen.
- **An action that exists only as a swipe, long press or drag.**
- **The same action annotated as a button and as a custom action.**
- **A control drawn from scratch** where the library has the platform's own.
- **Text in a `FIXED` box** that cannot grow with the system font size.
- **A row of dots as the only step indicator**, with no position and no total in text.
- **Claiming NBR 17060 conformance** in the report.

## 8. What stays for code

The platform APIs are implemented following A11Y.md [`guide-platform-native.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-platform-native.md); its verification runs on the built app, by a person, and enters the report as requirements for development.
