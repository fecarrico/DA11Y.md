# Consent banners on the canvas — blocking or not, space for focus and equal choices

> **Scope:** consent notices, cookie banners and privacy overlays, as a modal over the page or as a strip that leaves the page usable, in Figma nodes.
> **Translates:** A11Y.md [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-consent-banners.md), pinned at commit `57564be`. The modal version also follows [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-modals.md), and the actions follow [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

**Decide first whether it blocks.** That fork defines everything else, and the wrong pattern is the most common failure.

| If the banner… | It is… | On the canvas |
| :--- | :--- | :--- |
| prevents using the page until answered | a **modal dialog** | it follows [`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-modals.md) |
| leaves the page usable, in a strip | a **non-modal region** | no scrim over the page, and the page keeps space for the strip (Section 3) |

The classic error is the hybrid: a strip that dims the page and swallows clicks but does not trap focus. It looks modal and means nothing to a screen reader. A scrim (a `FRAME` or `RECTANGLE` with `fills` over the page) makes the banner a modal, so the design either blocks for real or does not dim.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Banner | `INSTANCE` of the library's banner component, a `FRAME` with auto layout | message and actions travel together in one component |
| Title | `TEXT` | the banner's visible name, when it has one. Without a title, the name goes in the annotation |
| Message | `TEXT` | plain language ([`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-cognitive.md) Section 5). Banner copy is the densest legal jargon in the interface |
| Actions: Accept all, Reject all, Manage preferences | button `INSTANCE`s, siblings in the same auto layout `FRAME` | Accept all and Reject all at the same level and with the same visual weight (Section 5) |
| Close | an icon button `INSTANCE` in its own `FRAME` | a button with its own target and name ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md)) |

## 2. States the component must have

A state or screen the library or the flow lacks is a warning (DA11Y.md Section 2): point it out and draw it only with authorization.

- **Actions and close button.** The button states in [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md) Section 2, with Focus always.
- **The flow.** The screen with the banner open, and the screen after each answer. In the prototype, Reject all reaches the answered screen with one `ON_CLICK`, the same as Accept all.
- **No state where the banner closes itself.** A banner that closes on its own, or assumes consent after some seconds, fails SC 2.2.1 and the legal basis with it.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Title, message and action text | the `TEXT` `fills` against the fill of the nearest ancestor that has one | the profile's text floor: 4.5:1 under Standard, 7:1 under Shield |
| Actions | the checks of [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md) Section 3 | the same as any control, because the banner is not a density exception |
| Targets | `width`, `height`, `minWidth` and `minHeight` of each action `FRAME` and of the close `FRAME` | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` between the actions and the close button | 8px between neighboring targets (House Rule†) |
| Parity | `mainComponent` and `variantProperties` of Accept all and Reject all, and their parent | the same visual weight (House Rule†) and siblings in the same parent `FRAME`. The same component and variant passes. Different variants are a doubt for the person to settle, never a pass by default |
| One click to reject | the `reactions` of Reject all | one `ON_CLICK` to the answered state, never through Manage preferences |
| Focus not covered (SC 2.4.11) | the strip's `height` and `absoluteBoundingBox`, the page content's padding on the strip's side, and the `absoluteBoundingBox` of the interactive elements near the strip | the content reserves the strip's `height` (`paddingBottom` for a bottom strip), and no interactive element's box sits entirely inside the strip's box |
| No time limit | `reactions` with the `AFTER_TIMEOUT` trigger on the banner and on its screen | none |
| Text that grows | `textAutoResize` of the message, and `layoutSizingVertical` of the banner | `HEIGHT` inside a `HUG` banner. A `FIXED` height cuts the message at 200% zoom |
| Font size | `fontSize` of title, message and actions | the profile's minimum font: 12px under Standard, 14px under Shield |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the banner instance, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Pattern and name.** Modal dialog or non-modal region, and its name (the visible title, or a proposed one).
- **If modal.** Focus moves into it when it appears, `Tab` stays inside, `Esc` closes it and returns focus to where it was, and the page behind cannot be reached ([`figma-modals.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-modals.md)).
- **If non-modal.** It does not take focus. It is reached in the natural order, at its place in the screen's reading-order annotation, and nothing holds the person in it. If it appears after the page loads, it is announced as a status message with the exact text, without moving focus.
- **Each action's name**, stating the outcome, and the close button's name.
- **No time limit.** It never closes itself and never assumes an answer.

Pin the measured value ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4): on each action, `minWidth`, `minHeight` and `fills`. On the strip, `height`. On the page content, `padding`.

```markdown
**Agent suggestion — confirm**
Consent banner · non-modal region · name: "Cookies on this site" (visible title) · does not take focus
After load, announced as a status: "We use cookies. Choose Accept all or Reject all."
Actions: "Accept all", "Reject all", "Manage preferences" · close: "Close cookie banner" · never closes on its own
```

## 5. Parity between accept and reject

**House Rule†.** If Accept all is a one-click button, Reject all is a one-click button, at the same navigation level and with the same visual weight. On the canvas, parity reads like this:

- **The same visual weight.** The same component and variant (`mainComponent`, `variantProperties`) settles it. A primary Accept all next to a Reject all drawn as a link or a weaker variant breaks parity.
- **Siblings in the same `FRAME`**, both visible when the banner opens.
- **Never Reject behind Manage preferences**, a list of vendors and a Save. That maze lands hardest on people with motor limitations and cognitive fatigue. WCAG does not name it. The European Accessibility Act (EAA) and the General Data Protection Regulation (GDPR) do, and Principle Zero answers it: if the task requires a maze, the task is broken.

Relaxing this House Rule is a product decision, recorded in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md).

## 6. When the task creates or changes the banner in the design system

The DA11Y.md Section 2.2 context layer, applied to the consent banner:

- **Description:** "Consent banner. Use it to ask for consent to cookies or data use. Use the modal version only when the page cannot be used before the answer. Do not use it for other messages (use a toast or an alert). Aliases: cookie banner, cookie bar, consent notice, privacy banner."
- **Properties:** `Modal` (BOOLEAN), `Title` and `Message` (TEXT), with the actions as button instances.
- **Layers named for what they are, in reading order**, for example: Title, Message, Accept all, Reject all, Manage preferences, Close.
- **Accessibility contract as data:** one item per check in Section 3, parity included, with the measured result of each state in each mode.

## 7. Anti-patterns on the canvas

- **The hybrid**, a strip that dims the page but does not trap focus.
- **A strip drawn over the content** with no space reserved, so the last focused element hides under it.
- **Reject all hidden** behind Manage preferences, or drawn smaller, as a link or in a weaker variant than Accept all.
- **A banner that closes itself**, or an `AFTER_TIMEOUT` that assumes consent.
- **Smaller targets in the banner** to save space.
- **Actions drawn as text or as a `GROUP`**, the close X included, instead of button instances.
- **Legal jargon** in the message.

## 8. What stays for code

The dialog or region semantics, focus moved and contained or left alone, `Esc`, the status announcement of a late banner, native buttons and the space reserved in the layout are implemented following A11Y.md [`guide-consent-banners.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-consent-banners.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.

When the banner comes from a consent management platform (CMP), the obligation does not transfer with the script. The report asks for the vendor's banner to be tested with keyboard and screen reader before it is installed. If it fails and cannot be replaced in the current cycle, that is an [`EXCEPTIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/EXCEPTIONS.md) entry with risk owner, issue and expiry. Accessibility options the CMP ships disabled belong to its configuration, not to the backlog.
