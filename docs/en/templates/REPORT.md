# Design Accessibility Report — [screen or component]

> **DA11Y.md:** [version] · **A11Y.md:** [version], commit `[hash]` · **Profile:** [Shield | Standard | Launchpad] · **Platform:** [web | iOS app | Android app], from [evidence] · **Date:** [YYYY-MM-DD]
> **File and node:** [file name · node id or link] · **Modes evaluated:** [light, dark]
> **Evaluated by:** [agent and model, or person] — **self-reported** · **Status:** [CONDITIONAL | FAIL] — PASS only after someone who did not design checks it

This report leaves the file with the design and is read by whoever builds. Nothing here is verified on the built product: semantics, keyboard and screen reader are requirements for development (Section 7).

## 1. Measured pairs

Ratios computed by the WCAG formula on the resolved token value, truncated, never rounded.

| Element | Pair (foreground / background) | Mode | Tokens | Ratio | Floor | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [Label] | [#hex / #hex] | [light] | [text/primary / surface/default] | [4.54:1] | [4.5:1] | [pass] |

## 2. Targets and spacing

| Element | Box (w×h) | Spacing to neighbors | Floor | Result or exception |
| :--- | :--- | :--- | :--- | :--- |
| [Show password] | [44×44] | [8] | [24×24 · A11Y.md rule 44] | [pass] |

## 3. States

| Component | Default | Focus | Error | Disabled | [other] | Missing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [Text field] | [✓] | [✓] | [✓] | [✓] | [—] | [none] |

## 4. Intent: what came from the structure and what awaits a decision (DA11Y.md Section 4)

| Order | Node | Reading and intent | Status |
| :--- | :--- | :--- | :--- |
| [2] | [Email field] | [🔊 field "Email", required · autofill: email · keyboard: email] | [proposal] |

Marks, as on the handoff card: `🔊` read · `📢` announced · `❓` open structural choice. Heading level, regions and language go here too. The keyboard focus order goes in Section 7.

Status: from the structure (reaches the code as a requirement) · proposal, on the handoff card or in the `Proposal` category (reaches the code as a question) · `✓ <name>` (decided).

On an evaluation, the reading goes here as a draft, and there is no handoff (DA11Y.md Section 4). A question of content or product, such as a value that looks wrong or a date that does not match, goes in Section 5 as a finding, never as a `❓`.

### Not read

What the reading left out. Each item is a proposal until the person confirms it, and the code hides it from the screen reader (`alt=""` on the web, out of the accessibility tree in an app).

| Node | What it is | Why it is not read | Status |
| :--- | :--- | :--- | :--- |
| [Card icon] | [category icon] | [redundant with the text "Parking"] | [proposal · `✓ <name>`] |

## 5. Findings and prior decisions

The number is the finding's on the report page, and on its `Fix here` annotation (`· finding 1`), so the three places name the same finding. One sequence: `Fix here` first, then the design system errors of Section 6, then the open questions.

| # | Finding | Origin | Measurement | Floor | Severity | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [1] | [Field border] | [token border/default] | [2.9:1] | [3:1, debatable with visible label] | [🟡] | [awaiting the person · fixed with authorization · EXCEPTIONS.md · A11Y-DECISIONS.md] |

## 6. Design system errors, routed

| # | Component | Variant or state | Defect | Routed to |
| :--- | :--- | :--- | :--- | :--- |
| [2] | [Button / Primary] | [Focus] | [outline 1.8:1 against surface] | [library owner · issue link] |

## 7. For development — requirements, not verified here

Implement following A11Y.md. The verification scenarios of each component guide run on the built product.

- [Label bound to the field; help and error bound by description; error announced when it appears]
- [Autofill: email, current-password]
- [Keyboard focus order: Email → Password → Sign in]
- [Focus on opening: the screen title. Platform controls with the system's focus]

## 8. Not measured

| What | Why | Who checks |
| :--- | :--- | :--- |
| [Text over hero image] | [image fill, no single background color] | [designer, worst frame] |
