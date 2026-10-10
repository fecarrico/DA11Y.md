# Cognitive accessibility on the canvas — flows, time limits, microcopy, consistent help and conflicting needs

> **Scope:** what a flow asks of memory, attention, time and language, in Figma nodes: the screens of a flow and the prototype between them, help, time limits, text that must survive the person's own spacing, interface copy and conflicts between two access needs. Login and authentication are in [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md) Section 5.
> **Translates:** A11Y.md [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-cognitive.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where it shows up in nodes

In design, the unit is the flow, not the screen (DA11Y.md Principle Zero). Most of this guide is read across the screens of a flow.

| Topic | Node | Rule |
| :--- | :--- | :--- |
| Flow (sign-up, checkout, multi-step form) | each step is a screen `FRAME`, a direct child of the page; prototype `reactions` connect the steps | a way back (`BACK`, or navigation to the previous step) reaches a screen that shows what the person already filled in |
| Data given earlier in the flow | the field `INSTANCE` on the later screen, in `State=Filled`, or an option to pick the earlier value | never an empty field asking for it again (SC 3.3.7) |
| Help (human contact, phone, chat, contact form, automated help) | an `INSTANCE` of one component, inside the shared header or footer | the same relative order among its siblings on every screen where it appears (SC 3.2.6). The criterion does not require help to exist |
| Time limit (session, cart holding stock, timed test) | an `AFTER_TIMEOUT` reaction, a countdown or expiry `TEXT`, and the warning | the person can turn it off, adjust it or extend it (Section 2) |
| Login and authentication | the fields and any challenge | [`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-forms.md) Section 5. A CAPTCHA that cannot be avoided offers at least two modalities (visual and audio) or object recognition, never transcription of distorted text. Under Shield, SC 3.3.9 (AAA) applies and also removes the object-recognition and personal-content exceptions; under Standard, it is a recommendation |

## 2. What the flow must have

- **Data that survives the steps.** A later step shows earlier data filled in, or offers it to pick ("Same as delivery address"). The criterion's own exceptions: re-entry is essential (password confirmation), a security requirement, or data no longer valid.
- **A way out of every time limit** (SC 2.2.1). The person can turn it off, adjust it to at least 10× the default, or extend it. To extend, a warning appears at least 20 seconds before the end, with one simple action, available at least 10 times. A session that expires with no warning is a Level A failure.
- **Instructions visible while the person decides.** A critical instruction is a visible `TEXT`, never only a placeholder or a tooltip.

Moving content (carousels, autoplay) is SC 2.2.2, in [`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-media.md).

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Help position | on each screen, the help `INSTANCE` (`mainComponent`) and its place among its siblings in the auto layout order | the same component, in the same relative order, not the same coordinates: the layout may change with screen width as long as the order holds |
| Time limits | `reactions` with the `AFTER_TIMEOUT` trigger (`timeout` in ms), and any countdown or expiry text | each limit has a way out from Section 2. One that ends on an expired screen, with no warning and no way to turn it off, fails. A toast that disappears on its own is in [`figma-toasts-notifications.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-toasts-notifications.md) |
| Text that survives the person's spacing | `textAutoResize` of the `TEXT`, and `layoutSizingVertical` and `height` of its container | `HEIGHT` or `WIDTH_AND_HEIGHT` inside a `HUG` container, with `minHeight` where a floor is needed. A `FIXED` height, `TRUNCATE` or `maxLines` cuts the text when the person applies line height 1.5×, spacing after paragraphs 2×, letter spacing 0.12× and word spacing 0.16× (SC 1.4.12) |
| Instructions beyond the senses | the text of every instruction | it names the control by its visible label ("click **Submit**, at the end of the form"), never by shape, position, color or sound alone (SC 1.3.3) |

## 4. What becomes an annotation

- **On the first screen of the flow.** Which data from which step appears again, and where, and that it survives the Back button.
- **On the help instance.** Help lives in the shared header or footer, never placed screen by screen. Pin `mainComponent`.
- **On the screen with a time limit.** The default duration, which way out applies, when the warning appears, the extend action, and the exact text of the warning, announced when it appears.
- **On running text.** Pin `lineHeight` and `fontSize`. `paragraphSpacing` cannot be pinned, so write the measured value in the text.
- **On a node with a conflict between needs**, both populations and the preference or decision that settles it (Section 6).

```markdown
**Agent suggestion — confirm**
Session limit: 15 min · way out: extend · warning 1 min before the end, in a dialog
Warning: "Your session ends in 1 minute. Do you want more time?" (announced when it appears)
Action: "Extend session" (one activation, available at least 10 times)
```

## 5. Microcopy

Text the agent writes follows these rules from the first word. WCAG requires a reading level only at AAA (SC 3.1.5), so plain microcopy is a House Rule†; under Shield, SC 3.1.5 applies.

- **No double negatives** and no stacked conditionals. "Do not forget to confirm" becomes "Confirm".
- **Literal, not figurative.** Metaphor, irony and idiom are barriers for part of the autistic audience and for second-language readers.
- **The label states the outcome**, not the mechanism: "Save draft", not "Submit".
- **The error is an instruction, not a diagnosis.** "Invalid postcode" diagnoses. "A postcode has 5 digits — check whether one is missing" instructs.

## 6. Conflicting needs

Some conflicts are accessibility against accessibility. The agent never picks one population in silence and calls the result conformance.

| Axis | One need | The opposing need |
| :--- | :--- | :--- |
| Motion | transitions keep continuity for people who struggle to track a change of context | translation and parallax cause nausea in vestibular disorders |
| Language | simplifying reduces cognitive load | simplifying removes precision experts depend on |
| Contrast | maximum contrast serves low vision | maximum contrast hurts brightness sensitivity, as in migraine |
| Time | a short limit protects a sensitive session | a short limit excludes people who read or type slowly |
| Density | more per screen, less navigation for chronic pain or motor limits | more per screen, more load for attention deficits |

1. **Prefer the mechanism.** Where the person can choose (reduced motion, contrast, an account preference, system zoom), the design shows each side as a variant or a variable mode, and the annotation names the preference that switches it. Whatever animates has a reduced-motion variant ([`figma-media.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-media.md)).
2. **With no mechanism, take it to the person** with both populations and the options, and **record the decision** in the [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md) format, with both needs named and the reason.
3. **Majority is not a criterion.** "Most users prefer" is a usability argument, not an accessibility one.

## 7. Anti-patterns on the canvas

- **A step that asks again** for data given earlier, or a Back that leads to empty fields.
- **Help that moves** between header and footer, or drawn screen by screen instead of coming from the shared component.
- **A session that ends with no warning**, or a countdown with no way to extend.
- **A critical instruction only in a placeholder or a tooltip.**
- **"Click the round button on the right"**, or any instruction by shape, position or sound alone.
- **Choosing one side of a conflict in silence**, or by majority.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-cognitive.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-cognitive.md); its verification scenarios and the cognitive-load checks in [`REPORT.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/REPORT.md) §6 run on the built product and enter the report as requirements for development.
