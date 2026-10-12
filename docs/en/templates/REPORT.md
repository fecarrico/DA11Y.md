# Design Accessibility Report — [screen or component]

> **DA11Y.md:** [version] · **A11Y.md:** [version], commit `[hash]` · **Profile:** [Shield | Standard | Launchpad] · **Date:** [YYYY-MM-DD]
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
| [Show password] | [44×44] | [8] | [24×24 · House Rule 44] | [pass] |

## 3. States

| Component | Default | Focus | Error | Disabled | [other] | Missing |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [Text field] | [✓] | [✓] | [✓] | [✓] | [—] | [none] |

## 4. Intent: what came from the structure and what awaits a decision (DA11Y.md Section 4)

| Node | Kind | Text | Status |
| :--- | :--- | :--- | :--- |
| [Email field] | [name · autofill · keyboard] | [Email · email · email] | [Your decision · agent proposal] |

Kinds: reading and focus order · heading level · accessible name · role · alternative text · region · announcement · language.

Status: from the structure (reaches the code as a requirement) · `Your decision · agent proposal` (reaches the code as a question) · `Decided by <name>`.

## 5. Findings and prior decisions

| Finding | Origin | Measurement | Floor | Severity | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- |
| [Field border] | [token border/default] | [2.9:1] | [3:1, debatable with visible label] | [🟡] | [awaiting the person · fixed with authorization · EXCEPTIONS.md · A11Y-DECISIONS.md] |

## 6. Design system errors, routed

| Component | Variant or state | Defect | Routed to |
| :--- | :--- | :--- | :--- |
| [Button / Primary] | [Focus] | [outline 1.8:1 against surface] | [library owner · issue link] |

## 7. For development — requirements, not verified here

Implement following A11Y.md. The verification scenarios of each component guide run on the built product.

- [Label bound to the field; help and error bound by description; error announced when it appears]
- [Autofill: email, current-password]
- [Focus order as annotated on the screen frame]

## 8. Not measured

| What | Why | Who checks |
| :--- | :--- | :--- |
| [Text over hero image] | [image fill, no single background color] | [designer, worst frame] |
