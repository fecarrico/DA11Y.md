# Loading on the canvas — skeleton, spinner, progress and entry animation

> **Scope:** the loading state of a region (skeleton blocks, spinner, progress bar), the loaded state that replaces it, and content that enters with an animation, described in Figma nodes.
> **Translates:** A11Y.md [`guide-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-loading-skeleton.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

A loading state is a promise, not content. On the canvas it is a **state of the region that waits**, drawn in the place of the content that replaces it.

| Part | Node | Rule |
| :--- | :--- | :--- |
| Region that waits | `FRAME` with auto layout, or the `INSTANCE` that fills it, named for what it holds ("Results") | the waiting is marked on this region, never on the whole screen. The Section 4 annotations go here |
| Skeleton | `FRAME` holding the placeholder blocks (`RECTANGLE` or `FRAME`), named "Skeleton" | scenery: no reactions and no focus. Never a `GROUP`, which accepts no annotation. Name the blocks "Skeleton / Title", never "Title", because the next agent reads a layer name as evidence |
| Spinner | icon `INSTANCE` with a `TEXT` beside it that says what is happening | past a moment, a spinner alone says nothing |
| Progress bar | `FRAME` with a track and a fill (`RECTANGLE`) and a visible label `TEXT` | when the fraction is measurable, the design shows progress, not a spinner |
| Loaded content | the `State=Loaded` variant of the same region | the outcome replaces the promise in the same region |
| Content with an entry animation | the screen `FRAME` shows it readable | Section 5 |

## 2. States the component must have

The region, or the component that fills it, has a `State` property with at least **Loading** and **Loaded**. A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

- **Reduced motion.** A skeleton that pulses or shimmers has a variant without motion (for example `Motion=Reduced`), with the blocks still. A page-wide shimmer is exactly the ambient motion the preference exists to stop (House Rule†, at every profile).
- **No focus on the skeleton.** No block has a Focus variant. The controls of the loaded content keep their own states.

## 3. What to measure, from the properties

Every ratio is computed by the WCAG formula on the resolved token value, in each mode the file uses (`resolvedVariableModes`), never estimated.

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Motion | `animations`, `timelines` or `animationStyles` on the skeleton, and loops of `AFTER_TIMEOUT` reactions between its variants (read on each `COMPONENT`, because the `COMPONENT_SET` has no prototyping) | every variant that animates has a variant without motion (House Rule†) |
| Skeleton is scenery | `reactions` of the skeleton and its blocks | there are none. A reaction makes a block interactive, and no skeleton block receives focus |
| Spinner text and progress label | the `TEXT` `fills` against the fill behind it, and its `fontSize` | the profile's text floor (4.5:1 under Standard, 7:1 under Shield) and minimum font (12px under Standard, 14px under Shield) |
| Spinner and progress fill | the icon `fills`, and the bar fill against the track | 3:1 (SC 1.4.11) |
| Text that grows | `textAutoResize` of the spinner text and the progress label | `HEIGHT` or `WIDTH_AND_HEIGHT`. `TRUNCATE`, `maxLines` or a `FIXED` height cuts the text at 200% zoom |
| The readable state is the drawn one | `opacity` and `visible` of the content on the screen `FRAME` | the content is visible on the frame itself, not only at the end of a reaction (Section 5) |

## 4. What becomes an annotation

The canvas has no field for any of this. Each item is an annotation in the **Accessibility** category on the region, starting with the status `Agent suggestion — confirm` (DA11Y.md Section 4):

- **Busy region.** This region, and not the screen, is marked busy while it loads, until the content lands.
- **Two announcements, with exact text.** One when loading starts ("Loading results") and one with the outcome ("12 results loaded"). A polite status, never an alert, never one per block.
- **Skeleton hidden.** The blocks are hidden from assistive technology and never take focus.
- **Focus.** It stays where it was when the content lands. If it was inside the replaced region, it goes to the nearest stable ancestor: name that node.
- **Progress.** The label of the bar, read with its value.
- **Motion.** The pulse stops under the reduced-motion preference.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/v0.1.0/docs/en/references/figma-nodes.md) Section 4). On the spinner text and the progress label, pin `fills` and `fontSize`. On content with an entry animation, pin `opacity`, so a change to 0 shows up in Dev Mode.

```markdown
**Agent suggestion — confirm**
Region "Results" · busy while loading
Announce (polite, once each): "Loading results" → "12 results loaded"
Skeleton: hidden from assistive technology, never focusable · Motion=Reduced: blocks still
Focus: stays put. If it was inside "Results", it goes to "Search panel"
```

## 5. Entry animation: the readable state is the drawn one

A loading state that never resolves is the A11Y.md anti-pattern *Content Held Hostage by JavaScript*. Its common form is an entry animation that starts from invisible: when the script fails, is blocked or has not run, the page stays empty.

- **The screen frame shows the content readable.** The animation is an addition, in the motion fields (`animations`, `timelines`) or in a reaction that starts from the visible state.
- **The end of a reaction as the only readable state is a warning.** Content at `opacity` 0 or `visible: false` on the screen, shown only after an `AFTER_TIMEOUT`, is the shape code will copy. Point it out, and change the frame only with authorization.
- **Reveal on scroll is the same case.** Content below the fold exists before any reveal. The annotation says the animation is added to visible content, never that it adds the content.

## 6. When the task creates or changes the component in the design system

The DA11Y.md Section 2.2 context layer, applied to the loading state:

- **Description:** "Skeleton. Use it as the loading state of a region whose layout is known. Do not use it for a wait whose fraction is measurable (use Progress bar). Aliases: skeleton, placeholder, shimmer, loading state."
- **Properties:** `State` (VARIANT: Loading, Loaded), `Motion` (VARIANT: Default, Reduced), `Status text` (TEXT) for the spinner.
- **Layers named for what they are, in reading order:** Status, Skeleton, Content.
- **Accessibility contract as data:** one item per check in Section 3, with the measured result of each state in each mode.

## 7. Anti-patterns on the canvas

- **The silent skeleton:** a loading state with no announcement annotated.
- **The chatty skeleton:** one announcement per block, or progress announced as an alert.
- **Skeleton blocks named as content** ("Title", "Price"), or with reactions.
- **A skeleton made of a `GROUP`**, with no place for the annotation.
- **A shimmer with no variant without motion.**
- **A spinner alone for a long wait**, or a spinner where the fraction is known.
- **Content that exists only at the end of a reaction**, starting from `opacity` 0.
- **An annotation that sends focus to the new content** or to the top of the page.

## 8. What stays for code

The busy state of the region, the status region and its two messages, hiding the skeleton from assistive technology, the reduced-motion preference, focus that does not move, the progress element and a default render that does not depend on a script are implemented following A11Y.md [`guide-loading-skeleton.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-loading-skeleton.md). The verification scenarios in that guide (keyboard, screen readers on desktop and phone, and the page with the script blocked) run on the built product, never on the canvas, and enter the design report as requirements for development.
