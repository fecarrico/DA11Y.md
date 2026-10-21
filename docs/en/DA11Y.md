# DA11Y.md — Accessibility as a Baseline, in Interface Design
> **Version:** 0.1.0 | **Design edition of:** A11Y.md 2.5.0, commit `9fb9a02` | **Target Standard:** WCAG 2.2 AA | **Last Updated:** 2026-10-21

This file is the **design edition** of A11Y.md: the same logic and the same numbers, for whoever designs or evaluates screens and components in Figma — people and agents. The rules would hold in any design tool; the guides are written in Figma's nodes and properties, so this is the Figma edition. Code remains governed by A11Y.md. Blocks marked `compiled` come from the pinned A11Y.md and are **never edited by hand**.

**Before designing or evaluating, read [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) (this project):** what each Figma node type can carry and where accessibility fits — including where it does **not** (a group cannot hold an annotation).

Depth per component: load **only** the Section 7 row that matches what you are designing or evaluating, and open its link. Each `figma-*.md` guide translates the A11Y.md guide of the same name into Figma nodes, so there is no need to open A11Y.md's. The profile row is the exception and links A11Y.md directly, because choosing a profile is the same decision in design and in code.

**Designing and evaluating end the same way: with the evidence written in the file** (Section 5), the annotations on the evaluated frames and the report and handoff pages. This holds for creating, editing, analyzing and reviewing. Annotating and drawing those pages do not change the design, so they need none of the authorization Section 2 asks for before fixing.

## 0. Principle Zero
<!-- compiled:principle-zero -->
- Accessibility is not a feature or an incremental improvement; it is a **pre-condition for use**. 
- If a user cannot complete a task due to an accessibility barrier, the feature is considered **technically broken**.
- **Task Completion** success is our primary quality metric.
<!-- /compiled:principle-zero -->
- A screen on its own is evaluated by what it shows. Connecting screens in the prototype is the designer's choice, not an accessibility requirement. What is required is the drawn control, such as a modal's Close, not the reaction that makes it work. A reaction that exists can show a barrier, such as a hover-only action or a toast that disappears on its own, and a missing reaction never fails.

## 0.1. Compliance Profile
If the profile is not defined, ask before the first frame. Default: Standard (AA).

<!-- compiled:profiles -->
| Profile | Target | Contrast (text / UI) | Min Font† | Min Target | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🛡️ Shield (AAA)** | WCAG AAA | 7:1 / 3:1 (SC 1.4.6, 1.4.11) | 14px† | 44×44px (SC 2.5.5) · 48×48px† advised | Regulated industries, healthcare, gov |
| **⚖️ Standard (AA)** | WCAG AA | 4.5:1 / 3:1 (SC 1.4.3, 1.4.11) | 12px† | 24×24px (SC 2.5.8) · 44×44px† advised | Default. Production apps, public web |
| **🚀 Launchpad (A)** | WCAG A | 3:1† (house floor) | 10px† | 24×24px† | MVPs, internal tools, prototypes |

*† = **A11Y.md rule**, non-normative: this standard's ergonomic policy where WCAG requires less — or nothing — at that level. WCAG defines no minimum font size at any level; Level A defines no contrast or target-size criteria; 44–48px targets come from Apple HIG / Material Design. Skipping a **WCAG SC** at your target level MUST be logged in `EXCEPTIONS.md`; relaxing an **A11Y.md rule** is a product decision — record it in `A11Y-DECISIONS.md`.*
<!-- /compiled:profiles -->

On the canvas, the file's unit stands for the platform's: on an app screen, 1 unit = 1 pt (iOS) or 1 dp (Android); on a web screen, 1 unit = 1 CSS px. The platforms' touch targets, 44 pt on iOS and 48 dp on Android, meet the A11Y.md rule under Standard. Under Shield, 44 pt meets SC 2.5.5 and 48 is advised.

**Platform.** Before evaluating, state whether the screen is web or app (iOS or Android) and which evidence shows it: the system's status or navigation bar, iOS or Material components, the name of the page, the file or the library. The frame's width does not decide, because a 375 screen can be web on a phone. With no evidence, ask, as with the profile. The platform decides the unit and the target above, the annotation's vocabulary (heading levels exist on the web only, Section 4) and whether the app guide applies (Section 7), and goes on the last line of the frame annotation, next to the profile (Section 5).

## 1. Severity
<!-- compiled:severity -->
Evaluate the impact of any design or implementation decision following these levels:

- 🔴 **CRITICAL:** **Operation** failures. Blocks **Task Completion** or renders the function unusable. **MUST FIX.**
- 🟠 **HIGH:** **Perception and Readability** failures. Significantly increases **Error or Abandonment Rate**. **MUST FIX.**
- 🟡 **MEDIUM:** Reduces **Efficiency and Satisfaction**. **SHOULD FIX.**
- 🔵 **LOW:** **Cosmetic or Polish** impact. **MAY FIX.**
<!-- /compiled:severity -->

On the canvas, the same levels read like this:

| Level | What it looks like in the file |
| :--- | :--- |
| 🔴 CRITICAL | an action that exists only on hover or drag, with no tap or click path · a modal with no designed way out · an interactive element on the flow's main path with no Focus state (on the web; in an app, only a control drawn from scratch, Section 3) |
| 🟠 HIGH | contrast below the profile's floor · text below the profile's minimum font · state shown by color alone · a target below the profile's minimum with no exception that applies · a label that exists only as a placeholder |
| 🟡 MEDIUM | below an A11Y.md rule (44 or 48 target, 8px between targets, text rhythm) · a state missing outside the main path · a conflict between needs left without a decision |
| 🔵 LOW | layer names, the order of decorative layers, annotation hygiene |

## 2. What already exists comes first
The active library's design system, the design rules already on record — the project's `DESIGN.md`, the library guidelines, the description of each component and of its variant set, `A11Y-DECISIONS.md` — and the brand assets the person points to are **prior decisions**: the source of appearance and behavior. This file does not replace them; it **evaluates** them. The order is always this:

1. **Look up.** Before designing or evaluating, find in the library the component, variable and style that serve the task, and read the prior rules (`DESIGN.md`, guidelines, decisions) and the description of each component used and of its variant set. What a description says about behavior, such as the touch area, is a prior decision. When the design contradicts a description, as with a card described as a touch area that has a button inside, the doubt becomes a structural question (❓, Section 4), and the agent does not pick a side. In the Figma agent, `measure.js` returns these descriptions with the measurements. From the brand assets pointed to, read the values in the nodes themselves: the font family and style, the colors and the weights.
2. **Apply as is.** Use what exists without swapping tokens, overriding instances or recreating components — color, typography, spacing, radius and surfaces (backgrounds) included. The visual identity is not open for choice. A brand value goes in exactly, never approximated.
3. **Evaluate.** Measure the result against the active profile (Sections 0.1 and 3): contrast pairs, targets, states present, typography.
4. **Warn.** For every prior decision that affects accessibility, state its **origin** (the component, the token or the `DESIGN.md` rule), the **measurement**, the **floor**, the **severity** (Section 1) and a proposed adjustment — luminance first, at the source (the library or `DESIGN.md`), never on the instance. When the criterion's reading is debatable (for example, the border of a field that also has a visible label), state the doubt. The warning goes to the chat and to the file, as a finding of its type (Section 5): `Fix here` on the affected node, for a defect of use, and `Design system error` on the evaluated component, for a defect of the library, once per failing variant in the evaluated set, on the first instance where it appears, because variants of the same component pass and fail separately. Writing it in the file is part of warning and needs no authorization.
5. **Fix only with explicit authorization, and only where the defect lives.** A defect of **use** — the wrong variant, an override, a composition that breaks the reading order — is fixed in the file, after authorization, with the component guide (Section 7), and only **what was evaluated**. A defect of the **component itself** — a library button whose Focus variant fails 3:1 — is never fixed in the file that uses it, because that is an override in disguise. A library component is one that comes from outside the evaluated file (`remote`, in [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md)). When evaluating a file that uses the library, the agent never annotates or edits the library's file. The defect enters the report as *routed to the library* and is fixed there by whoever owns it. A local component, whose main component lives in the evaluated file, gets `Fix here` on the main component and is fixed there, never on the instance. When the evaluated file is the library itself, the `Design system error` goes on the main component, and the authorized fix is made there. If the person decides not to fix a WCAG criterion failure, it becomes an `EXCEPTIONS.md` entry (owner, approver, expiry); relaxing an A11Y.md rule goes to `A11Y-DECISIONS.md`.

With no library, no rules on record and no brand pointed to, there is nothing to preserve: the rules of this file guide the design from the first frame. With a brand and no library, the brand's values are the prior decision, and the rest is born under the rules of this file.

A passing ratio never justifies leaving the system, and a failing ratio does not authorize leaving it alone: accessibility and consistency are separate requirements, and the person arbitrates between them.

## 2.1. Behavior contract on the canvas
Any agent designing or evaluating under this file **MUST**:

- **Not recreate what exists.** A parallel "accessible" component, a new token or a local style in place of the library's is a violation, even with good intent — the path is to warn (Section 2).
- **Compute, never estimate.** Contrast by the WCAG relative-luminance formula, on the token values, for every pair that carries meaning — text, control border, icon, focus ring — in every state (default, hover, focus, error, disabled) and every mode (light, dark). "Looks sufficient" is fabricated evidence. The ratio is truncated, never rounded. In the Figma agent, the computation comes from [`measure.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/measure.js), read by link and run on the screens' ids ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md), Section 6). Its numbers stand and are never recomputed by hand. When a pair fails, ask the person to check the same pair in Figma's own contrast check, in the color picker. No API exposes that check to the agent, and its auto-correct changes the color — the Section 2 violation. Any tool that offers to fix a color is used to measure, never to fix.
- **Evaluate only what is visible.** A hidden layer, on the node itself or on an ancestor, stays out of the measurements, the reading and the annotations, inside instances too. A state that exists only as a hidden layer is checked through the component's properties, the variant or the boolean that turns the layer on.
- **Check the states the code will require.** Focus, error, disabled (with the reason in text), selected and checked must exist as a variant or frame. If the library component lacks the state, that is a Section 2 warning: point it out, and design the state only with authorization — or when there is no library. The exception is the focus of a platform control on an app screen, which goes into the report (Section 3). A state nobody designed is a state the developer invents, and the product diverges from the design.
- **Images: classify and draft; the person confirms.** By the removal test ("if I remove this image, what is lost?"), classify it as informative, functional or decorative and propose the alternative text as a draft. Declaring an image decorative is a human decision, never a default.
- **Media: ask.** Video or audio in the layout triggers three questions on the spot: does it inform or only set a mood? does it have audio? do captions and a transcript exist?
- **Conflicting needs: name and ask.** When serving one need creates a barrier for another (motion, contrast, density), name both populations and take the choice to the person.
- **Leave the evidence in the file, as a native annotation.** Each evaluated frame (the screen or the component) gets **one short annotation** from the annotation tool, in the **Accessibility** category, in the Section 5 format. Beyond it, **there is an annotation only when the person has something to fix in this file**: one `Fix here` per finding, in the short format of Section 5. The design system errors, the open questions and the reading go onto the report and handoff pages, numbered on a copy of the screen (Section 5). A tool that cannot draw those pages annotates them too, one per element, in the type's category. What passed and what belongs to code only go into the report. An annotation is a signal for whoever designs, not the report: hex values and token names go in only when the problem is structural, such as a library component's token. The chat is not evidence: it never reaches whoever builds. If the annotation tool is unavailable (plan or seat), say so. The fallback for a component is its description field; for a screen, the report page of Section 5. Never the chat alone.
- **Not declare what belongs to code.** Semantics, screen reader, real keyboard and automated tests do not happen on the canvas: they enter the report as **requirements for development**, never as verified.
- **Not approve itself.** Whoever designed declares the verification self-reported, and the status stays at CONDITIONAL at most until someone who did not design checks it.
- **Record decisions and exceptions** in the formats of the A11Y.md templates ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/EXCEPTIONS.md)). A decision the agent made is recorded as the agent's — never attributed to the person.

## 2.2. When the task is to create or change the design system
Creating or changing a library component, variable or style **on request** is the explicit authorization of Section 2: here the agent applies this file's rules from the first frame and delivers, together with the component, the **context layer for agents** — what another agent needs to read to use the right component, the right way, without recreating it:

1. **Component description** (the component's description field): what it is, when to use it, when **not** to, and the **aliases** someone would ask for it by ("switch", "toggle", "on/off").
2. **Accessibility contract as data**, one item per requirement: name, category (Contrast, Keyboard, Semantics, Content), WCAG criterion, requirement (for example, "4.5:1"), states covered and a description that lets another person or agent reproduce the check — with the measured result of each state in each mode (pass, fail, not tested).
3. **Anatomy in reading order:** layers named for what they are ("Label", "Control", "Helper text"), in the order keyboard and screen reader will traverse them. A layer name is evidence for the next agent — it cannot lie.
4. **Properties with names code recognizes:** the state property with values such as Default, Hover, Focus, Disabled and Error; the label as a text property; never "Variant 2".
5. **Link to code**, when it exists: the component's documentation link and, if there is one, Code Connect.
6. **Library alias map**, as a JSON file for the library guidelines: component → aliases → role → required states. The agent writes the file and a person attaches it, because guidelines are attached in the library's settings. It is what makes the next agent find the component that exists instead of creating another.

Keep it all short: the reading agent pays for every word, and context nobody can read in full is not context.

## 3. What the design must meet

### Perceivable
- **Contrast** by the profile's floors (Section 0.1). Interface components and meaningful graphics: 3:1 against their neighbor.
- **Never color alone.** Compare a state's variants: if only the color changes between "default" and "error", the state fails. Icon, text or shape go with the color.
- **Charts:** every series has a second channel besides color (dash, marker, direct label); adjacent series at 3:1 against each other.
- **Text over image or video** sits on a contrast layer (scrim) measured in the worst case.
- **Text that grows:** text the person needs to read has no fixed height and no truncation — it must survive 200% and the spacing the user chooses.
- **Motion:** whatever animates has a reduced-motion variant; automatic motion lasting more than 5 seconds has a visible pause; nothing flashes more than 3 times per second.

### Operable
- **Touch target:** the profile's minimum, 24×24 under Standard (SC 2.5.8) and 44×44 under Shield (SC 2.5.5). Below that, only through the criterion's exceptions: under Standard, a 24 circle centered on the target touches no other target and no other small target's circle; under both, the same action is available through an equivalent target that meets the floor. A11Y.md rule: design at 44×44 (48×48 under Shield). When either of two neighboring targets is below that size, keep 8px between them, as A11Y.md asks in dense UIs. Targets of that size may touch, like the rows of a list. Below the A11Y.md rule is a finding to report, never a WCAG failure. Measure the interactive frame's box, never the icon inside it.
- **Focus designed** on every interactive element: an outline of at least 2px at 3:1 against the background — an outline, not a shadow alone, which disappears in high-contrast mode — and never covered by a fixed header or footer. Under Shield, SC 2.4.13 (AAA) applies too: the indicator covers at least a 2px perimeter with 3:1 between the focused and unfocused states, so compare the Focus and Default variants. A focus shown only by a change of fill does not meet the outline above, and goes in the report. On an app screen, the library instance that stands for a platform control inherits the system's focus ([`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-platform-native.md), Section 1): a missing Focus variant goes into the report, as the requirement to use the system's focus or to design the state, and is not an error. In an app, Section 1's 🔴 CRITICAL for a missing Focus applies to a control drawn from scratch.
- **Nothing hover-only or drag-only:** every action has a tap or click path and a visible control. A device gesture (shake, tilt) has an on-screen control.

### Understandable
- **Visible label, outside and before the field.** A placeholder is never a label. The expected format (for example, DD/MM/YYYY) is visible before typing.
- **Errors** in text, with icon and color, next to the field, naming the way out — "Wrong password. Try again or reset your password", not just "Wrong password".
- **Plain language:** active voice, short sentences, common words, expanded acronyms. A link says where it leads; a bare "click here" or "learn more" does not.
- **Consistency:** help and navigation in the same relative position on every screen of the flow; the same function has the same name everywhere.
- **Flow:** nothing the person must remember from one screen to the next, nothing they must type again, no transcription CAPTCHA, no "enter the 3rd and 7th characters of your password".

### Typography (A11Y.md rule†)
- The profile's minimum font. Density: 10px only with 7:1 and an `EXCEPTIONS.md` entry.
- Running text: line height of at least 1.5, spacing after paragraphs of at least 2× the font size, about 80 characters per line, start-aligned — never justified.

## 4. The intent the design does not show: the agent proposes, the person decides
The canvas has no field for semantics, and this is where intent dies between design and code: nobody writes it down. When delivering a screen, the agent handles this layer in two ways. What holds for the whole screen and follows from the structure (regions from the layer names, autofill from the field type) goes into the report as a requirement for development. The reading of each element goes onto the handoff page, as a numbered card beside a copy of the screen (Section 5). It is what whoever designs checks and whoever builds implements. The handoff is drawn when the request is to deliver the designed screen or to prepare the handoff ("prepare the handoff", "annotate the reading"). When the request is to evaluate, analyze or review, there is no handoff: the evaluation delivers the measurements, the errors, the `❓` lines and the frame annotation, and the report carries the reading as a draft, for the person to ask for the handoff once the design settles. A verdict and a proposal do not carry the same weight. An error is a measured fact or a rule; the reading is a proposal, and it becomes a specification only with the `✓`. The elements where a screen reader stops get this card: headings, controls, components and containers with one action. A component carries its own reading and its children's in a closed list: what sits inside it and is not on the list is not read, such as a card's icon and arrow. A component with an action inside, such as a card with an Edit button, is one item, even when the card itself is not tappable. Its first line takes the range (`5–6 · payment`), and each stop is numbered. The layer includes:

- **Reading order** — the number of each stop, in the order a screen reader goes through, text included. It opens the card and, when the card has more than one stop, each `🔊` line. It comes from the structure (the auto layout order), checked against the visual reading. Where the two diverge, the number follows the visual reading and a `❓` line says the structure is in another order. The keyboard focus order, with the controls only, goes into the report.
- **Headings** and the **screen title**. On the web, a heading carries its level, H1 to H6 (`🔊 heading H2 "Orders"`). In an app, it is just "heading", because iOS and Android have no levels.
- **Accessible name** of every control without visible text (icon-only button); when there is visible text, the name contains it.
- **Role** when appearance misleads: clickable card, link that looks like a button, tabs, switch vs. checkbox.
- **Role vocabulary**, closed: button, link, heading, field, combobox, checkbox, radio, switch, slider, tab, menu, dialog, modal dialog, list, table, tree, group, navigation, image and map. Text with no role goes in quotes only (`🔊 "Protocol number, 48213"`). "Text", "header" and "informative image" are not roles, and `annotate.js` refuses any word outside the list.
- **Alternative text** for every image, with its class (informative, functional, decorative). Decorative is a human decision: the agent may suspect it, never conclude it. Informative and functional images go into the reading, with their alternative text. One the agent suspects is decorative stays out of the reading and goes into the report as not read. Alternative text that would only repeat the text next to it, such as the address written under the map, makes the image a decorative candidate.
- **Regions** of the screen: header, navigation, main content, footer.
- **Text of dynamic announcements** ("12 results loaded", "Wrong password. Try again or reset your password").
- **Language** of passages in another language.

Rules for proposals:
- **A proposal stays a proposal until the `✓`.** Without a `✓`, whoever builds asks. When the person decides, they add the line `✓ <name>` to the card, or to the annotation in the `Proposal` category, whose name says what it is, not what it becomes. Whoever builds implements what has a `✓`, and asks about what is still a proposal. The agent never writes the `✓`, and a new run keeps every card and annotation a person decided.
- **Never overwrite a human annotation.** If the agent disagrees with what the person annotated, it adds the divergence; it does not delete.
- **Do not propose what a rule already decides.** Visible focus or contrast are not proposals — they are Sections 2 and 3.
- **`❓` for structure and role only.** The question is about what the marks do not say: tabs or navigation, whether the card is a control, whether the panel collapses. A question of content or product (a value that looks wrong, a date that does not match) and a question of behavior go into the report. A `❓` never repeats an error, because the defect is already in its own finding.
- **An error is certain.** A `Here:` or `Library:` finding never depends on an answer ("if it collapses…"). What depends on an answer is a `❓`, and the error comes in only after it.
- **One item per element, on the element itself:** one card on the handoff page, or one annotation on the canvas. Each screen gets only what it has: what holds for the whole flow, such as a form's autofill, appears once, on the first screen where it appears.
- While any proposal is undecided, the report stays at CONDITIONAL at most.

## 5. Delivery
- **For whoever designs — a short summary** in three blocks: what passed; what fails and **where it comes from** (component, token or `DESIGN.md` rule; measurement; floor; severity); what needs a human decision — including the question "shall I fix it?" for each warning and the number of decisions waiting for the person.
- **For whoever builds — the report, twice.** **In the file,** each evaluated frame gets the Section 2.1 annotation with its own counts, in this format, with a blank line between the blocks:

  ```
  **CONDITIONAL**

  Open questions — <n>
  Readings to confirm — <n>
  Fix here — <n>
  Design system errors — <n>
  Not read — <n>

  Full report on the page DA11Y — reports

  <profile> · <platform> · DA11Y.md <version> · A11Y.md <version>
  ```

  Open questions counts the `❓` still without a `✓`, and Readings to confirm the reading annotations without a `✓`. An item with both counts in both. When the reading is not on the canvas, on an evaluation and when it is on the handoff page, whose cards carry their own `✓`, the line says `Readings — not annotated` in place of the count, because a zero would say nothing is pending. Not read is what the reading left out, listed in the report with the reason, for the person to confirm. With all five counts at zero, the annotation says `Nothing to do on this screen` in their place, so whoever builds knows the screen was evaluated. The status comes first, and the last line carries the profile, the platform and the versions, such as `Standard (AA) · app · DA11Y.md 0.1.0 · A11Y.md 2.5.0`, because a ratio that passes under Standard fails under Shield. No date, no hex values, no token names, no recommendations and no caveats: the detail belongs to the report.

  Each finding and each reading is short, in its type's format, and its start says the type. Measurements, caveats, recommendations and how to check go into the report's text, never into the finding or the card:

  | Type | When | Format | What the person does |
  | :--- | :--- | :--- | :--- |
  | `Proposal` | the reading of an element (Section 4) and the choices the design does not settle | the order and the element on the first line (`4 · card`, `2–3 · tabs`). Then one line per mark: `🔊` one screen reader stop, with the role from the Section 4 vocabulary and what it reads in quotes, one line per stop · `📢` what it announces when it happens · `❓` a choice of structure or role the marks do not express, such as tabs or navigation, with the proposal — never content, behavior or a repeated error (Section 4). The list is closed: what sits inside the element and is not on a `🔊` line is not read, and the `✓` confirms the whole list, what was left out included. An informative image goes in as `🔊 image "alternative text"`. Long text goes in by its beginning, with an ellipsis inside the quotes (`🔊 "On the 27th I parked at this…"`), never described. With more than one stop, each `🔊` line starts with its number (`2) 🔊 tab "Items"`). Repeated items that follow one mold, such as each row of a table, fit on one line (`🔊 each row: "…"`) | checks it and adds `✓ <name>` |
  | `Fix here` | a defect of use in this file: the wrong variant, an override, a composition that breaks the order | one finding per annotation, on one line, two at most when the sentence does not fit, and the second never starts another severity: the severity, with its Section 1 color and name, and `Here:` | fixes it, or authorizes the agent to |
  | `Design system error` | a defect of the library's component, token or style | one finding per annotation, on one line, two at most, the same way: the severity, with its color and name, and `Library:` | routes it to whoever maintains the library, without fixing this instance |

  ```
  4 · card
  🔊 button "Home insurance, Active"
  ```

  ```
  5–7 · request status
  5) 🔊 heading "Request status"
  6) 🔊 "Protocol number, 48213"
  7) 🔊 "Status, Under review"
  ```

  `🔴 CRITICAL · Library: no Focus state` · `🟠 HIGH · Here: white arrow on white`

  The severity is never color alone. The circle comes with its Section 1 name: 🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM or 🔵 LOW.

  Section 4 of each guide lists what the agent settles for the component. Only the reading goes onto the handoff, in the format above: where a guide says the element's annotation, it is the element's card on the handoff page. Keyboard, focus and behavior go into the report, as requirements for development.

  **Where each goes.** The canvas keeps only what the person fixes in this file: the frame annotation and the `Fix here` annotations, each ending with the number of its finding (`· finding 2`). The rest goes onto two pages of the file, beside a copy of the screen, so the canvas does not fill with annotations:

  - **`DA11Y — reports`**, for an evaluation: the full report (below), with each evaluated screen at full size and every finding numbered on its edge, beside its card. `Fix here` comes first, by severity, then `Design system error` by component, then the `❓`. The numbers are the ones on the canvas, and the frame annotation's report line links to the report.
  - **`DA11Y — handoff`**, when delivering the designed screen or preparing the handoff (Section 4): one block per screen or component. The reading order, on a copy with each stop outlined and numbered beside its card. The controls and their touch areas, measured against the profile's minimum and the A11Y.md rule (Section 3), numbered by the reading in an app and by Tab order on the web. The focus states, each control beside its focus variant from the library, or the note that the library has none. What is not read is not drawn.

  The person decides on the page: a `✓ <name>`, or the answer to a `❓`, goes onto the card. A new run of the same set replaces its block in place and keeps every card a person decided. Both pages follow the screen's design system, its text styles and its color variables, when their pair passes 4.5:1, and they are the only nodes the agent creates without asking. In the Figma agent, [`report.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/report.js) and [`handoff.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/handoff.js), read by link, draw them the same way every time: the agent decides the content, and the script places it and measures it in the file. A tool that cannot draw the pages writes every finding and the reading as annotations on their nodes, in the categories below (`annotate.js` with `onPage: false`).

  **Each type has its own annotation category**, and the category is what lets each person filter the annotations by what they have to do: whoever maintains the library, for example, filters the design system errors. Before annotating, the agent reads the file's categories (`figma.annotations.getAnnotationCategoriesAsync()`) and creates the missing ones (`figma.annotations.addAnnotationCategoryAsync({ label, color })`), with these names and colors:

  | Category | Color | What it holds |
  | :--- | :--- | :--- |
  | `Accessibility` | `pink` | the frame annotation; it is the design files' preset category |
  | `Proposal` | `blue` | the reading of each element and the open choices, and later the `✓ <name>` |
  | `Fix here` | `orange` | `Here:` |
  | `Design system error` | `violet` | `Library:` |

  On the canvas of the Figma agent, only `Accessibility` and `Fix here` are used. `Proposal` and `Design system error` hold what a tool that cannot draw the pages annotates. If the agent's tool does not let it create a category, the action annotation goes in `Accessibility`, and the agent says in the chat that the categories are missing. The start of each annotation still says the type.

  **The evaluation ends in the file.** An evaluation, an analysis or a review ends only when the annotations are written and read back: the agent reads each evaluated frame back and checks that the counts in the frame annotation match the findings, the ones on the frame and the ones on the report page. With no annotation written, the delivery did not happen. The agent says so in the chat, instead of offering to annotate later. In the Figma agent, [`annotate.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/annotate.js), read by link, does both. It writes the annotations, and the frame annotation with the counts taken from them. In a separate execution, it reads them back and checks. It refuses an annotation outside the format, and it numbers the findings the report page draws.

  **Out of the file,** as `REPORT.md` from this project's [template](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/templates/REPORT.md), with the `A11Y-DECISIONS.md` and `EXCEPTIONS.md` entries in A11Y.md's formats ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/templates/EXCEPTIONS.md)), delivered with the design — the ticket, the hand-off, the repository. An agent that cannot create files, such as Figma's, draws the full report in the Figma file itself, on the `DA11Y — reports` page, one block per evaluated set, named after the set, and repeats it in the chat in Markdown for the person to save as `REPORT.md`. In the Figma agent, `reportPage()` in [`report.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/report.js) draws the Markdown as headings, tables and lists, with the evaluated screens and the numbered findings, and keeps the Markdown on the block, so `REPORT.md` can be read back exactly. Those files are what the coding agent reads under A11Y.md's *Decision Memory*: the design's decisions reach the code as prior decisions, and a Section 4 proposal still undecided reaches it as a question, never as a requirement. The report ends with the instruction: **implement following A11Y.md**. One report per evaluated set (the screen, the flow or the section asked for), and each frame gets the annotation with its own counts; a new evaluation updates both instead of stacking another. In it, the agent measures again and replaces its own annotations and cards with the new ones: the reading ones, the `Here:` ones and the `Library:` ones without a `✓`, and the frame one. An annotation or a card with `✓ <name>`, or an annotation outside this format, belongs to a person, and the agent does not touch it. A decided card whose finding left the new analysis is listed apart. If an item with a `✓` keeps an old order number, the agent says so in the report.
- **Ready for development is a gate.** A section or frame is marked ready for development (`devStatus`) only with a report at CONDITIONAL or better, no Section 4 proposal undecided and no WCAG failure outside `EXCEPTIONS.md`.
- **When the task created or changed the design system** — besides the report, the Section 2.2 context layer for agents, on the component itself and in the library guidelines.

## 6. Anti-patterns on the canvas
- **Swapping a token, overriding an instance or recreating a library component** without authorization — including to "fix" accessibility.
- **Fixing before warning**, or fixing beyond what was evaluated.
- **Presenting a proposal as a decision made** — a `✓` written by the agent, or an element's reading outside its card or the `Proposal` category.
- **The same element in several cards or annotations** — the card, the icon and the arrow read separately.
- **Drawing or annotating what is not read** — the handoff shows only the reading, and what it leaves out goes into the report.
- **An annotation with no action** — what passed, what belongs to code only, or what nobody needs to do, annotated on the canvas.
- **A `❓` about content or behavior**, or one that repeats an error — that belongs to the report.
- **A conditional error** — `Here:` or `Library:` with an "if…"; what depends on an answer is a `❓`.
- **Two findings in one annotation** — the frame's count loses one.
- **The handoff when the request was to evaluate** — the reading comes in when the person asks for it or when the agent delivers the designed screen.
- **Every finding on the canvas when the pages can be drawn** — the canvas keeps the frame annotation and `Fix here` only.
- **A design system error fixed in the file that uses it** — an override in disguise.
- **Annotating or editing the library's file** instead of the evaluated component.
- **An annotation that becomes the report** — measurements, caveats, recommendations or how to check on the canvas, more than two lines per error, or the same finding repeated on every screen.
- **A `GROUP` for anything interactive or anything that needs evidence.**
- **Marking ready for development** with no report, a proposal undecided or a WCAG failure not logged.
- **An "accessible mode" bar or icon** as the answer — accessibility is solved in the design, not in a layer on top.
- **Leaving the evidence only in the chat**, also when the request was only to evaluate.
- **Approving one's own design.**

## 7. Guide map (load only the row at hand)

| You are designing or evaluating… | Guide |
| :--- | :--- |
| anything on the canvas — node types, auto layout, annotations, measurements | [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) (this project) |
| button, CTA, icon-only button | [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md) |
| form, text field, label, error message, login form | [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md) |
| checkbox, radio, switch, slider, select, disabled control | [`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-form-controls.md) |
| autocomplete, combobox, searchable select | [`figma-autocomplete.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-autocomplete.md) |
| login, sign-up, multi-step flow, time limit, checkout, microcopy | [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-cognitive.md) |
| modal, dialog, drawer, confirmation | [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-modals.md) |
| cookie or consent banner | [`figma-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-consent-banners.md) |
| menu, header, navigation, page headings | [`figma-navigation.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-navigation.md) |
| tabs, accordion, collapsible panel | [`figma-tabs-accordion.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-tabs-accordion.md) |
| tooltip, popover | [`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-tooltips-popovers.md) |
| toast, snackbar, alert | [`figma-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-toasts-notifications.md) |
| skeleton, loading, entry animation | [`figma-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-loading-skeleton.md) |
| carousel, rotating banner | [`figma-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-carousels-sliders.md) |
| drag and drop, reordering, kanban | [`figma-drag-drop.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-drag-drop.md) |
| feed, infinite scroll, "load more" | [`figma-infinite-scroll.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-infinite-scroll.md) |
| image, icon, illustration, avatar | [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-images.md) |
| video, audio, background video, parallax | [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-media.md) |
| chart, dashboard, KPI | [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-charts.md) |
| table, data grid | [`figma-tables.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-tables.md) |
| date field, calendar | [`figma-datepicker.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-datepicker.md) |
| tree view, file explorer, nested hierarchy picker | [`figma-treeview.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-treeview.md) |
| map, store locator | [`figma-maps.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-maps.md) |
| chat, assistant, generated response | [`figma-generative-ui.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-generative-ui.md) |
| color, palette, tokens, theme | [`figma-visual-perception.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-visual-perception.md) |
| breakpoint, zoom, responsive layout, touch target | [`figma-responsive-mobile.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-responsive-mobile.md) |
| iOS or Android app screen, or an app for a Brazilian audience | [`figma-platform-native.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-platform-native.md) |
| Brazilian audience, Libras | [`figma-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-sign-language-br.md) |
| choosing or switching the profile | [`guide-compliance-profiles.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-compliance-profiles.md) |

## 8. Additional sources (non-normative)
Supporting material this file recommends but **does not incorporate**. The rules remain those of this file and of A11Y.md.

- **[Magoo](https://magoo.cc)**, by Marcelo Sales — a library of interaction behaviors, with design questions per component and per mode of use (before interaction, mouse, gestures, keyboard, screen reader), in Portuguese. A good source for designers to reflect on decisions no rule settles. Agents can consult it too, through the site or the project's MCP server ([`@acessibilidade/magoo-mcp`](https://www.npmjs.com/package/@acessibilidade/magoo-mcp)). Magoo describes itself as educational material, not normative.
- **[Astryx](https://github.com/facebook/astryx)**, by Meta — the reference for Section 2.2's context layer for agents: component documentation as typed data, accessibility requirements per component (criterion, requirement, states), anatomy in reading order, aliases so the agent finds the right component, and generation tests judged by a separate agent.
