# DA11Y.md — Accessibility as a Baseline, in Interface Design
> **Version:** 0.1.0 (draft) | **Design edition of:** A11Y.md 2.3.0, commit `57564be` | **Target Standard:** WCAG 2.2 AA | **Last Updated:** 2026-10-09

This file is the **design edition** of A11Y.md: the same logic and the same numbers, for whoever designs screens and components in Figma — people and agents. The rules would hold in any design tool; the guides are written in Figma's nodes and properties, so this is the Figma edition. Code remains governed by A11Y.md. Blocks marked `compiled` come from the pinned A11Y.md and are **never edited by hand**.

**Before designing, read [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) (this project):** what each Figma node type can carry and where accessibility fits — including where it does **not** (a group cannot hold an annotation).

Depth per component: load **only** the Section 7 row that matches what you are designing, and open its link. Each `figma-*.md` guide translates the A11Y.md guide of the same name into Figma nodes, so there is no need to open A11Y.md's. The profile row is the exception and links A11Y.md directly, because choosing a profile is the same decision in design and in code.

## 0. Principle Zero
<!-- compiled:principle-zero -->
- Accessibility is not a feature or an incremental improvement; it is a **pre-condition for use**. 
- If a user cannot complete a task due to an accessibility barrier, the feature is considered **technically broken**.
- **Task Completion** success is our primary quality metric.
<!-- /compiled:principle-zero -->
- In design, the unit is the **flow**, not the isolated screen: if the task does not complete in the prototype, the design is broken.

## 0.1. Compliance Profile
If the profile is not defined, ask before the first frame. Default: Standard (AA).

<!-- compiled:profiles -->
| Profile | Target | Contrast (text / UI) | Min Font† | Min Target | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **🛡️ Shield (AAA)** | WCAG AAA | 7:1 / 3:1 (SC 1.4.6, 1.4.11) | 14px† | 44×44px (SC 2.5.5) · 48×48px† advised | Regulated industries, healthcare, gov |
| **⚖️ Standard (AA)** | WCAG AA | 4.5:1 / 3:1 (SC 1.4.3, 1.4.11) | 12px† | 24×24px (SC 2.5.8) · 44×44px† advised | Default. Production apps, public web |
| **🚀 Launchpad (A)** | WCAG A | 3:1† (house floor) | 10px† | 24×24px† | MVPs, internal tools, prototypes |

*† = **House Rule**, non-normative: this standard's ergonomic policy where WCAG requires less — or nothing — at that level. WCAG defines no minimum font size at any level; Level A defines no contrast or target-size criteria; 44–48px targets come from Apple HIG / Material Design. Skipping a **WCAG SC** at your target level MUST be logged in `EXCEPTIONS.md`; relaxing a **House Rule** is a product decision — record it in `A11Y-DECISIONS.md`.*
<!-- /compiled:profiles -->

On the canvas, the file's unit stands for the platform's: on an app screen, 1 unit = 1 pt (iOS) or 1 dp (Android); on a web screen, 1 unit = 1 CSS px. The platforms' touch targets, 44 pt on iOS and 48 dp on Android, meet the House Rule under Standard. Under Shield, 44 pt meets SC 2.5.5 and 48 is advised.

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
| 🔴 CRITICAL | an action that exists only on hover or drag, with no tap or click path · a flow that does not complete in the prototype · a modal with no designed way out · an interactive element on the flow's main path with no Focus state |
| 🟠 HIGH | contrast below the profile's floor · text below the profile's minimum font · state shown by color alone · a target below the profile's minimum with no exception that applies · a label that exists only as a placeholder |
| 🟡 MEDIUM | below a House Rule (44 or 48 target, 8px between targets, text rhythm) · a state missing outside the main path · a conflict between needs left without a decision |
| 🔵 LOW | layer names, the order of decorative layers, annotation hygiene |

## 2. What already exists comes first
The active library's design system and the design rules already on record — the project's `DESIGN.md`, the library guidelines, `A11Y-DECISIONS.md` — are **prior decisions**: the source of appearance and behavior. This file does not replace them; it **evaluates** them. The order is always this:

1. **Look up.** Before designing, find in the library the component, variable and style that serve the task, and read the prior rules (`DESIGN.md`, guidelines, decisions).
2. **Apply as is.** Use what exists without swapping tokens, overriding instances or recreating components — color, typography, spacing, radius and surfaces (backgrounds) included. The visual identity is not open for choice.
3. **Evaluate.** Measure the result against the active profile (Sections 0.1 and 3): contrast pairs, targets, states present, typography.
4. **Warn.** For every prior decision that affects accessibility, state its **origin** (the component, the token or the `DESIGN.md` rule), the **measurement**, the **floor**, the **severity** (Section 1) and a proposed adjustment — luminance first, at the source (the library or `DESIGN.md`), never on the instance. When the criterion's reading is debatable (for example, the border of a field that also has a visible label), state the doubt.
5. **Fix only with explicit authorization, and only where the defect lives.** A defect of **use** — the wrong variant, an override, a composition that breaks the reading order — is fixed in the file, after authorization, with the component guide (Section 7), and only **what was evaluated**. A defect of the **component itself** — a library button whose Focus variant fails 3:1 — is never fixed in the file that uses it, because that is an override in disguise: it gets an annotation `Library defect` on the instance, enters the report as *routed to the library*, and is fixed in the library by whoever owns it. If the person decides not to fix a WCAG criterion failure, it becomes an `EXCEPTIONS.md` entry (owner, approver, expiry); relaxing a House Rule goes to `A11Y-DECISIONS.md`.

With no library, no `DESIGN.md` and no prior decisions, there is nothing to preserve: the rules of this file guide the design from the first frame.

A passing ratio never justifies leaving the system, and a failing ratio does not authorize leaving it alone: accessibility and consistency are separate requirements, and the person arbitrates between them.

## 2.1. Behavior contract on the canvas
Any agent designing under this file **MUST**:

- **Not recreate what exists.** A parallel "accessible" component, a new token or a local style in place of the library's is a violation, even with good intent — the path is to warn (Section 2).
- **Compute, never estimate.** Contrast by the WCAG relative-luminance formula, on the token values, for every pair that carries meaning — text, control border, icon, focus ring — in every state (default, hover, focus, error, disabled) and every mode (light, dark). "Looks sufficient" is fabricated evidence. Where Plugin API code can run, run [`measure.js`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/tools/measure.js) on the selection: it returns the pairs, targets, spacing and text growth as data, with the ratio truncated, never rounded. Figma's own contrast check, in the color picker and in Check designs, serves the person, not the agent: no API exposes it, it does not state which background it compares, and its auto-correct changes the color — the Section 2 violation. Any tool that offers to fix a color is used to measure, never to fix.
- **Check the states the code will require.** Focus, error, disabled (with the reason in text), selected and checked must exist as a variant or frame. If the library component lacks the state, that is a Section 2 warning: point it out, and design the state only with authorization — or when there is no library. A state nobody designed is a state the developer invents, and the product diverges from the design.
- **Images: classify and draft; the person confirms.** By the removal test ("if I remove this image, what is lost?"), classify it as informative, functional or decorative and propose the alternative text as a draft. Declaring an image decorative is a human decision, never a default.
- **Media: ask.** Video or audio in the layout triggers three questions on the spot: does it inform or only set a mood? does it have audio? do captions and a transcript exist?
- **Conflicting needs: name and ask.** When serving one need creates a barrier for another (motion, contrast, density), name both populations and take the choice to the person.
- **Leave the evidence in the file, as a native annotation.** Each report becomes **one annotation** from the annotation tool, in the **Accessibility** category, attached to the evaluated frame (the screen or the component). Point findings and the intent the design does not show (Section 4) go in annotations on the affected nodes. The chat is not evidence: it never reaches whoever builds. If the annotation tool is unavailable (plan or seat), say so. The fallback for a component is its description field; for a screen, a `TEXT` layer named `A11Y report` inside a `FRAME` of the same name, next to the screen on the same page and never inside it. Never the chat alone.
- **Not declare what belongs to code.** Semantics, screen reader, real keyboard and automated tests do not happen on the canvas: they enter the report as **requirements for development**, never as verified.
- **Not approve itself.** Whoever designed declares the verification self-reported, and the status stays at CONDITIONAL at most until someone who did not design checks it.
- **Record decisions and exceptions** in the formats of the A11Y.md templates ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/EXCEPTIONS.md)). A decision the agent made is recorded as the agent's — never attributed to the person.

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
- **Touch target:** the profile's minimum, 24×24 under Standard (SC 2.5.8) and 44×44 under Shield (SC 2.5.5). Below that, only through the criterion's exceptions: under Standard, a 24 circle centered on the target touches no other target and no other small target's circle; under both, the same action is available through an equivalent target that meets the floor. House Rule: design at 44×44 (48×48 under Shield) with 8px between neighboring targets. Below the House Rule is a finding to report, never a WCAG failure. Measure the interactive frame's box, never the icon inside it.
- **Focus designed** on every interactive element: an outline of at least 2px at 3:1 against the background — an outline, not a shadow alone, which disappears in high-contrast mode — and never covered by a fixed header or footer. Under Shield, SC 2.4.13 (AAA) applies too: the indicator covers at least a 2px perimeter with 3:1 between the focused and unfocused states, so compare the Focus and Default variants. A focus shown only by a change of fill does not meet the outline above, and goes in the report.
- **Nothing hover-only or drag-only:** every action has a tap or click path and a visible control. A device gesture (shake, tilt) has an on-screen control.

### Understandable
- **Visible label, outside and before the field.** A placeholder is never a label. The expected format (for example, DD/MM/YYYY) is visible before typing.
- **Errors** in text, with icon and color, next to the field, naming the way out — "Wrong password. Try again or reset your password", not just "Wrong password".
- **Plain language:** active voice, short sentences, common words, expanded acronyms. A link says where it leads; a bare "click here" or "learn more" does not.
- **Consistency:** help and navigation in the same relative position on every screen of the flow; the same function has the same name everywhere.
- **Flow:** nothing the person must remember from one screen to the next, nothing they must type again, no transcription CAPTCHA, no "enter the 3rd and 7th characters of your password".

### Typography (House Rule†)
- The profile's minimum font. Density: 10px only with 7:1 and an `EXCEPTIONS.md` entry.
- Running text: line height of at least 1.5, spacing after paragraphs of at least 2× the font size, about 80 characters per line, start-aligned — never justified.

## 4. The intent the design does not show: the agent suggests, the person confirms
The canvas has no field for semantics, and this is where intent dies between design and code: nobody writes it down. When delivering a screen, the agent **suggests** this layer as **annotations** in the Accessibility category, attached to the nodes:

- **Reading and focus order** — one annotation on the screen frame with the numbered list. The proposed order comes from the structure (the auto layout order) checked against the visual reading; where the two diverge, an annotation on the node says so.
- **Headings and levels** (H1 to H6) and the **screen title**.
- **Accessible name** of every control without visible text (icon-only button); when there is visible text, the name contains it.
- **Role** when appearance misleads: clickable card, link that looks like a button, tabs, switch vs. checkbox.
- **Alternative text** for every image, with its class (informative, functional, decorative). Decorative is a human decision: the agent may suspect it, never conclude it.
- **Regions** of the screen: header, navigation, main content, footer.
- **Text of dynamic announcements** ("12 results loaded", "Wrong password. Try again or reset your password").
- **Language** of passages in another language.

Rules for suggestions:
- **Every suggested annotation starts with the status** `Agent suggestion — confirm`. When the person confirms or corrects it, the status becomes `Confirmed by <name>, <date>`. Whoever builds implements what is confirmed; what is still a suggestion, they ask about.
- **Never overwrite a human annotation.** If the agent disagrees with what the person annotated, it adds the divergence; it does not delete.
- **Do not suggest what a rule already decides.** Visible focus or contrast are not suggestions — they are Sections 2 and 3.
- While any suggestion is unconfirmed, the report stays at CONDITIONAL at most.

## 5. Delivery
- **For whoever designs — a short summary** in three blocks: what passed; what fails and **where it comes from** (component, token or `DESIGN.md` rule; measurement; floor; severity); what needs a human decision — including the question "shall I fix it?" for each warning and the number of Section 4 suggestions awaiting confirmation.
- **For whoever builds — the report, twice.** **In the file,** as the Section 2.1 annotation on the evaluated frame, short: status (CONDITIONAL at most), date, the version of this file and of A11Y.md, the counts (pairs measured and failing, targets, states missing, suggestions awaiting confirmation, library defects) and where the full report is. **Out of the file,** as `REPORT.md` from this project's [template](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/templates/REPORT.md), with the `A11Y-DECISIONS.md` and `EXCEPTIONS.md` entries in A11Y.md's formats ([`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md), [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/EXCEPTIONS.md)), delivered with the design — the ticket, the hand-off, the repository. Those files are what the coding agent reads under A11Y.md's *Decision Memory*: the design's decisions reach the code as prior decisions, and a Section 4 suggestion still unconfirmed reaches it as a question, never as a requirement. The report ends with the instruction: **implement following A11Y.md**. One report per evaluated frame; a new evaluation updates both instead of stacking another.
- **Ready for development is a gate.** A section or frame is marked ready for development (`devStatus`) only with a report at CONDITIONAL or better, no Section 4 suggestion unconfirmed and no WCAG failure outside `EXCEPTIONS.md`.
- **When the task created or changed the design system** — besides the report, the Section 2.2 context layer for agents, on the component itself and in the library guidelines.

## 6. Anti-patterns on the canvas
- **Swapping a token, overriding an instance or recreating a library component** without authorization — including to "fix" accessibility.
- **Fixing before warning**, or fixing beyond what was evaluated.
- **Presenting a suggestion as a decision** — an intent annotation without the `Agent suggestion — confirm` status.
- **A library defect fixed in the file that uses it** — an override in disguise.
- **A `GROUP` for anything interactive or anything that needs evidence.**
- **Marking ready for development** with no report, a suggestion unconfirmed or a WCAG failure not logged.
- **An "accessible mode" bar or icon** as the answer — accessibility is solved in the design, not in a layer on top.
- **Leaving the evidence only in the chat.**
- **Approving one's own design.**

## 7. Guide map (load only the row at hand)

| You are designing… | Guide |
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
| choosing or switching the profile | [`guide-compliance-profiles.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-compliance-profiles.md) |

## 8. Additional sources (non-normative)
Supporting material this file recommends but **does not incorporate**. The rules remain those of this file and of A11Y.md.

- **[Magoo](https://magoo.cc)**, by Marcelo Sales — a library of interaction behaviors, with design questions per component and per mode of use (before interaction, mouse, gestures, keyboard, screen reader), in Portuguese. A good source for designers to reflect on decisions no rule settles. Agents can consult it too, through the site or the project's MCP server ([`@acessibilidade/magoo-mcp`](https://www.npmjs.com/package/@acessibilidade/magoo-mcp)). Magoo describes itself as educational material, not normative.
- **[Astryx](https://github.com/facebook/astryx)**, by Meta — the reference for Section 2.2's context layer for agents: component documentation as typed data, accessibility requirements per component (criterion, requirement, states), anatomy in reading order, aliases so the agent finds the right component, and generation tests judged by a separate agent.
