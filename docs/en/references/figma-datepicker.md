# Date fields on the canvas — typed field, format, calendar grid and ranges

> **Scope:** the date field (a text field with a calendar button), the calendar (month caption, month buttons, weekday headers, day cells) and the range picker, in Figma nodes. The label, help text and error of the field are in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md).
> **Translates:** A11Y.md [`guide-datepicker.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-datepicker.md), pinned at commit `68f4be1`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

**The text field is the feature. The calendar is an extra on top of it.** Someone who knows the date types it in a second; when the calendar is the only way in, keyboard, voice-control and screen-reader users walk through a month to enter a date they could have typed.

With no range, no custom unavailable dates and no specific visual identity, the platform's own picker is the better answer: the design annotates the native picker instead of drawing a calendar (on an app screen, [`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-platform-native.md)). The reasons not to use it are product decisions, recorded once in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/templates/A11Y-DECISIONS.md).

| Part | Node | Rule |
| :--- | :--- | :--- |
| Date field | the library's text field `INSTANCE` ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md)) | a field the person types into. Never a `FRAME` reading "Select a date" that only opens the calendar |
| Format and limits | help `TEXT` ("Format: DD/MM/YYYY"), visible in the empty state | outside the field, before typing. A limit that matters ("no later than 30 days from today") sits beside the label, never only in the error |
| Calendar button | an icon `INSTANCE` inside its own `FRAME`, at the end of the field | a separate target with its own name. When there is a prototype, the `ON_CLICK` that opens the calendar sits on this `FRAME` |
| Calendar | `FRAME` with vertical auto layout: month header, weekday headers, days | the auto layout order is the reading order |
| Month caption | `TEXT` with month and year ("March 2026") | always visible: it is the grid's name |
| Month buttons | icon `INSTANCE`s, each in its own `FRAME` | separate targets, each with its own name ("Next month") |
| Weekday headers | `TEXT` in the first row of the grid | column headers, not decoration |
| Days | `FRAME` with `layoutMode: GRID` and 7 columns, or a vertical auto layout of week rows | rows are weeks and cells are days, read row then column. A cell set to `layoutPositioning: ABSOLUTE` leaves that order |
| Day cell | `INSTANCE` of a day `COMPONENT_SET` with a `State` variant, never a `GROUP` | its own `FRAME` box is the target |
| Unavailable day | the same cell in `State=Unavailable` | it stays in the grid, visible, marked by more than color (Section 3), with its reason in the annotation |

## 2. States the component must have

- **Calendar button and month buttons.** The button states in [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md) Section 2, with Focus always.
- **Day cell.** `State` with at least **Default, Focus, Selected, Today and Unavailable**, plus **Range start, In range and Range end** when the product picks ranges.
- **Focus on the selected day.** Opening the calendar puts focus on the selected date, or on today, so focus happens together with Selected and with Today: either the set has those combinations, or the Focus outline still reaches 3:1 over the Selected and Today looks.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Day numbers, caption, weekday headers, help | the `TEXT` `fills` against the nearest ancestor fill, except the day number in `State=Unavailable`, exempt as an inactive component (SC 1.4.3) | the profile's text floor (DA11Y.md Section 3) |
| What marks Selected, Today and the range | the marker's `fills` or `strokes` against the color around it | 3:1 (SC 1.4.11) |
| State beyond color | the Default, Selected, Today, Unavailable and range variants side by side | each differs by more than color: shape, line, text or icon (SC 1.4.1). Range endpoints are marked by text or shape, never by a background tint alone |
| Targets | `minWidth` and `minHeight` of each day cell `FRAME`, of the calendar button and of the month buttons | the profile's floor (DA11Y.md Section 3) |
| Spacing | `gridColumnGap` and `gridRowGap`, or `itemSpacing` of the week rows | the A11Y.md rule's gap between neighboring targets (DA11Y.md Section 3). Less is a warning, never a failure |
| Format before typing | the field's Default variant, empty | the help `TEXT` with the format is visible, not only in `State=Error` or in the placeholder |

## 4. What becomes an annotation

**In the element's annotation**, in the short format of DA11Y.md Section 5:

- **On the field.** Its name and the format bound to it, heard while the field is empty.
- **On the calendar button.** Its name: "Choose check-in date from calendar".
- **On the calendar.** A date picker dialog with a grid, named by the visible caption. Each day is named by its full date ("15 March 2026"), plus "selected", or "unavailable" with the reason ("minimum stay two nights"). Today is marked as the current date. The new month's name is announced when the grid changes month.

**In the report**, as requirements for development:

- **On the field.** It accepts `01/02/2026`, `1/2/26`, `2026-02-01` and paste, because blocking paste turns a copy into a memory test (SC 3.3.8). Numeric keyboard on mobile.
- **Keyboard and focus on the calendar.** One `Tab` stop in the grid. ←/→ move by day, ↑/↓ by week, `Home`/`End` to the week's edges, `PageUp`/`PageDown` by month, and `Shift` with those by year. Opening puts focus on the selected date or today. `Esc` closes and returns focus to the calendar button. Choosing a day closes, returns focus to the field, and the field holds the date as text.

Pin `minWidth`, `minHeight` and `fills` on the day cell, `fontSize` and `fills` on the weekday headers, `gridColumnGap` and `gridRowGap` on the grid ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4).

```markdown
4 · calendar of "Check-in date"
🔊 dialog "March 2026" · each day: "15 March 2026", with "selected" or "unavailable, minimum stay two nights"
📢 the month change
```

## 5. Ranges

- **Two fields**, each with its own label ("Start date", "End date"), never one field the person must click twice.
- **The range is visible without a background tint alone.** The endpoints are also marked by text or shape, with the Range start and Range end variants.
- **The selection state is announced**, with its exact text in the annotation, for example "Start 12 March selected. Choose an end date."
- **A limit the first date sets on the second** is announced when it changes. Greying out half the grid is not enough.

## 6. When the task creates or changes the date picker in the design system

- **Description:** "Date field. Use it to enter one date by typing, with a calendar as an optional extra. Do not use it when the platform's picker serves, or as a single field for a range (use two). Aliases: date picker, datepicker, calendar, date input."
- **Properties:** on the field, those of [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md) Section 6. On the day cell, `State` (VARIANT) with the values of Section 2 and `Day` (TEXT).

## 7. Anti-patterns on the canvas

- **The calendar as the only way in**, with a field reading "Select a date" whose click only opens the grid.
- **The format only in the placeholder or only in the error.**
- **One field for a range**, expecting two clicks.
- **Unavailable days removed from the grid**, or marked by color alone.
- **A range shown only by a background tint.**
- **A custom calendar where the platform's picker would serve**, with no recorded decision.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-datepicker.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/68f4be1170e672144c8d0e416a7f9fa49102ed6b/docs/en/references/guide-datepicker.md); its verification scenarios run on the built product and enter the report as requirements for development.
