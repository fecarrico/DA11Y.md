# Carousels on the canvas — slides, pause, Previous and Next, picker dots

> **Scope:** carousels, rotating banners and content sliders (the slides, the pause control, Previous and Next, the picker dots), described in Figma nodes. A slider that picks a value in a range is a form control ([`figma-form-controls.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-form-controls.md)).
> **Translates:** A11Y.md [`guide-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-carousels-sliders.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

Auto-advance is the accessibility problem. Everything else is a named set of slides with buttons.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Carousel | `FRAME` with auto layout, or an `INSTANCE` of the library's carousel, named for what it shows | the carousel's annotations go here |
| Pause control | button `INSTANCE` in its own `FRAME`, the **first** child in the carousel's auto layout order | first in focus order, reachable before the rotation changes anything. Placed over the slide with `layoutPositioning: ABSOLUTE`, it leaves the flow and its order comes from geometry, so the focus order annotation says it is first |
| Slide | `FRAME` or `INSTANCE`, one per slide, named with its position ("Slide 3 of 8") or its title | text over the slide image sits on a scrim (Section 3) |
| Previous and Next | button `INSTANCE`s, each in a `FRAME` at the profile's minimum target | visible in the default state, never only on hover. See [`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-buttons.md) |
| Picker dots | one button `INSTANCE` per slide, in a `FRAME` with horizontal auto layout | each dot is a target: the box is its `FRAME`, never the dot shape. Never a `GROUP` |

## 2. States the component must have

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Pause control: Playing and Paused.** Each shows its own icon and its own name ("Pause", "Play"). A carousel that advances on its own for more than 5 seconds with no paused state fails SC 2.2.2.
- **Reduced motion.** A variant in which auto-advance does not start (for example `Motion=Reduced`, with no `AFTER_TIMEOUT`). House Rule†, at every profile.
- **Focus** on the pause control, Previous, Next and every dot (Section 3).
- **Current dot.** Compare the dot variants. The current one differs in more than fill (size, shape or outline), or the carousel shows its position in text ("3 of 8"). Fill alone fails SC 1.4.1.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Auto-advance | `reactions` with `AFTER_TIMEOUT` on the slides or the variants (Section 5) | when the rotation runs for more than 5 seconds, a visible pause control exists and is first in order (SC 2.2.2, Level A, every profile) |
| Reduced motion | `animations`, `timelines`, `animationStyles` and the `AFTER_TIMEOUT` chain | a variant without motion exists, and nothing advances in it (House Rule†) |
| Controls without hover | `visible` of Previous, Next and pause in the default variant, and `ON_HOVER` or `MOUSE_ENTER` reactions that reveal them | the controls are visible with no hover (DA11Y.md Section 3) |
| Swipe only | `ON_DRAG` reactions on the slides | Previous and Next exist, with `ON_CLICK` or `ON_PRESS` |
| Current slide beyond color | the current and default dot variants side by side | something besides the fill changes (SC 1.4.1) |
| Dots and control icons | their `fills` and `strokes` against the color behind them, including the slide image | 3:1 (SC 1.4.11), in the worst case of the image |
| Text on slides | the `TEXT` `fills` against the scrim or fill behind it, and its `fontSize` | the profile's text floor (4.5:1 under Standard, 7:1 under Shield) and minimum font (12px under Standard, 14px under Shield). Over an image, on a scrim measured in the worst case |
| Focus | the Focus variant's `strokes` and `strokeWeight` against the adjacent color | at least 2px and 3:1 (House Rule†, on top of SC 2.4.7). A shadow in `effects` alone does not count |
| Targets | `width`, `height`, `minWidth` and `minHeight` of each control and dot `FRAME` | the profile's minimum target: 24×24 under Standard (44×44 advised), 44×44 under Shield (48×48 advised) |
| Spacing | `itemSpacing` of the dots frame and between controls | 8px between neighboring targets (House Rule†) |
| Text that grows | `textAutoResize` of the slide text and `layoutSizingVertical` of the slide | no `TRUNCATE`, `maxLines` or `FIXED` height that cuts the text at 200% zoom |

## 4. What becomes an annotation

Each item is an annotation in the **Accessibility** category on the carousel, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Role and name.** A carousel, with a name ("Featured products"). Each slide is a "slide" named by its position ("3 of 8") or its title.
- **Focus order.** Pause first, then the rest. Only the visible slide's content is reachable. Off-screen slides are out of focus and out of the accessibility tree.
- **Rotation stops** on hover, when focus enters the carousel and while a tooltip is open. The slide under focus never moves away.
- **Dots** are buttons named for their slide ("Slide 3: Spring collection"), with the current one marked as current.
- **Announcements.** After Previous or Next, a polite message with exact text ("Slide 4 of 8"). Automatic rotation is never announced.
- **Reduced motion.** Under the preference, auto-advance does not start.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4). On each dot and control `FRAME`, pin `minWidth` and `minHeight`. On the current dot, pin `fills` and `strokes` with the measured ratio.

```markdown
**Agent suggestion — confirm**
Carousel "Featured products" · each slide named "n of 8" or by its title
Focus order: Pause → Previous → Next → dots → visible slide only
Rotation stops on hover, on focus inside, with a tooltip open · never starts under reduced motion
After Next: "Slide 4 of 8" (polite) · automatic rotation: silent
```

## 5. Auto-advance in the prototype

- **Where to read.** On the slide frames and on each variant (`COMPONENT`). The `COMPONENT_SET` has no prototyping, so it shows nothing.
- **What counts.** An `AFTER_TIMEOUT` reaction that leads to the next slide is auto-advance. Follow the chain: the movement is the whole rotation, not one `timeout`. A chain that loops back to the first slide, or that runs past 5 seconds in total, needs the pause control (SC 2.2.2). Being decorative is not an exemption.
- **The pause in the prototype.** The pause control has an `ON_CLICK` reaction to a state with no `AFTER_TIMEOUT`. Auto-advance with no paused state is a Section 2 warning. The stop on focus and with a tooltip open cannot be prototyped, so it goes to the annotation.

## 6. When the task creates or changes the component in the design system

The DA11Y.md Section 2.2 context layer, applied to the carousel:

- **Description:** "Carousel. Use it to show a set of slides one at a time, with Previous, Next and picker dots, and a pause control when it advances on its own. Do not use it to pick a value in a range (use Slider). Aliases: carousel, slideshow, rotating banner, content slider."
- **Properties:** `Autoplay` (BOOLEAN), `Motion` (VARIANT: Default, Reduced), `Label` (TEXT) for the carousel's name. On the pause control, `Playback` (VARIANT: Playing, Paused). On the dot, `Current` (BOOLEAN) and `State` (VARIANT: Default, Hover, Focus).
- **Layers named for what they are, in reading order, pause first:** Pause, Previous, Next, Slides, Picker.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result of each state in each mode.

## 7. Anti-patterns on the canvas

- **Auto-advance with no pause**, or a pause that shows only on hover.
- **The pause control last in the order**, or placed over the slide with `ABSOLUTE` and no annotated order.
- **The current slide shown only by the dot's fill.**
- **Dots as bare shapes** with no target box of their own, or inside a `GROUP`.
- **Previous and Next only on hover.**
- **Swipe as the only way** to change slides.
- **Text over the slide image with no measured scrim.**
- **An annotation that announces the automatic rotation.**

## 8. What stays for code

The carousel and slide roles and names, Previous, Next and the dots as real buttons, the current dot, off-screen slides removed from focus and from the accessibility tree, the polite announcement after the person's action, the stop on hover and focus, and the reduced-motion preference are implemented following A11Y.md [`guide-carousels-sliders.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-carousels-sliders.md). The verification scenarios in that guide (keyboard and screen readers on desktop and phone) run on the built product, never on the canvas, and enter the design report as requirements for development.
