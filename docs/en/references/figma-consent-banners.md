# Consent banners on the canvas — blocking or not, space for focus and equal choices

> **Scope:** consent notices, cookie banners and privacy overlays, as a modal over the page or as a strip that leaves the page usable, in Figma nodes.
> **Translates:** A11Y.md [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-consent-banners.md), pinned at commit `57564be`. The modal version also follows [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-modals.md), and the actions follow [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

**Decide first whether it blocks.** That fork defines everything else, and the wrong pattern is the most common failure.

| If the banner… | It is… | On the canvas |
| :--- | :--- | :--- |
| prevents using the page until answered | a **modal dialog** | it follows [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-modals.md) |
| leaves the page usable, in a strip | a **non-modal region** | no scrim over the page, and the page keeps space for the strip (Section 3) |

The classic error is the hybrid: a strip that dims the page and swallows clicks but does not trap focus. A scrim (a `FRAME` or `RECTANGLE` with `fills` over the page) makes the banner a modal, so the design either blocks for real or does not dim.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Banner | `INSTANCE` of the library's banner component, a `FRAME` with auto layout | message and actions travel together in one component |
| Title | `TEXT` | the banner's visible name, when it has one. Without a title, the name goes in the annotation |
| Message | `TEXT` | plain language ([`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-cognitive.md) Section 5): banner copy is the densest legal jargon in the interface |
| Actions: Accept all, Reject all, Manage preferences | button `INSTANCE`s, siblings in the same auto layout `FRAME` | Accept all and Reject all at the same level and with the same visual weight (Section 5) |
| Close | an icon button `INSTANCE` in its own `FRAME` | a button with its own target and name ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)) |

## 2. States the component must have

- **The flow.** The screen with the banner open, and the screen after each answer. Reject all reaches the answered screen with a single action, the same as Accept all.
- **No state where the banner closes itself.** A banner that closes on its own, or assumes consent after some seconds, fails SC 2.2.1 and the legal basis with it.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Actions | the checks of [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md) Section 3, on each action `FRAME` and on the close `FRAME` | the same as any control: the banner is not a density exception |
| Parity | `mainComponent` and `variantProperties` of Accept all and Reject all, and their parent | the same visual weight (House Rule†) and siblings in the same parent `FRAME`. The same component and variant passes; different variants are a doubt for the person to settle, never a pass by default |
| One click to reject | the banner and the `reactions` of Reject all | Reject all is on the banner, at the same level as Accept all. A reaction that goes through Manage preferences before the answered state fails |
| Focus not covered (SC 2.4.11) | the strip's `height` and `absoluteBoundingBox`, the page content's padding on the strip's side, and the `absoluteBoundingBox` of the interactive elements near the strip | the content reserves the strip's `height` (`paddingBottom` for a bottom strip), and no interactive element's box sits entirely inside the strip's box |
| No time limit | `reactions` with the `AFTER_TIMEOUT` trigger on the banner and on its screen | none |

## 4. What becomes an annotation

On the banner instance:

- **Pattern and name.** Modal dialog or non-modal region, and its name (the visible title, or a proposed one).
- **If modal.** Focus moves in, `Tab` stays inside, `Esc` closes it and returns focus, the page behind is unreachable ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-modals.md)).
- **If non-modal.** It does not take focus: it is reached in the natural order, at its place in the screen's reading-order annotation, and nothing holds the person in it. If it appears after the page loads, it is announced as a status message with the exact text, without moving focus.
- **Each action's name**, stating the outcome, and the close button's name.
- **No time limit.** It never closes itself and never assumes an answer.

Pin `minWidth`, `minHeight` and `fills` on each action, `height` on the strip, `padding` on the page content ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4).

```markdown
1 · banner "Cookies on this site"
📢 "We use cookies. Choose Accept all or Reject all."
🔊 buttons "Accept all", "Reject all", "Manage preferences", "Close cookie banner"
```

## 5. Parity between accept and reject

**House Rule†.** If Accept all is a one-click button, Reject all is a one-click button, at the same navigation level and with the same visual weight: the same component and variant, siblings in the same `FRAME`, both visible when the banner opens (the Parity row of Section 3). Never Reject behind Manage preferences, a list of vendors and a Save: that maze lands hardest on people with motor limitations and cognitive fatigue. WCAG does not name it; the European Accessibility Act (EAA) and the General Data Protection Regulation (GDPR) do, and Principle Zero answers it: if the task requires a maze, the task is broken.

Relaxing this House Rule is a product decision, recorded in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md).

## 6. When the task creates or changes the banner in the design system

- **Description:** "Consent banner. Use it to ask for consent to cookies or data use. Use the modal version only when the page cannot be used before the answer. Do not use it for other messages (use a toast or an alert). Aliases: cookie banner, cookie bar, consent notice, privacy banner."
- **Properties:** `Modal` (BOOLEAN), `Title` and `Message` (TEXT), with the actions as button instances.

## 7. Anti-patterns on the canvas

- **The hybrid**, a strip that dims the page but does not trap focus.
- **A strip drawn over the content** with no space reserved, so the last focused element hides under it.
- **Reject all hidden** behind Manage preferences, or drawn smaller, as a link or in a weaker variant than Accept all.
- **A banner that closes itself**, or an `AFTER_TIMEOUT` that assumes consent.
- **Smaller targets in the banner** to save space.
- **Actions drawn as text**, the close X included, instead of button instances.
- **Legal jargon** in the message.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-consent-banners.md); its verification scenarios run on the built product and enter the report as requirements for development. A consent management platform (CMP) does not transfer the obligation: the report asks for the vendor's banner to be tested with keyboard and screen reader before it is installed, a failure not replaceable in the cycle is an [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/EXCEPTIONS.md) entry, and options the CMP ships disabled belong to its configuration, not to the backlog.
