# Media on the canvas — video, audio, background video and parallax

> **Scope:** video and audio placed in the layout, the player and its controls, the background video of a hero, text over moving media, parallax and other motion that starts on its own, described in Figma nodes.
> **Translates:** A11Y.md [`guide-media.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-media.md), pinned at commit `57564be`. The Libras window over a video is in [`figma-sign-language-br.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-sign-language-br.md).
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Where media shows up in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Video or audio | a `MEDIA` node, or a shape whose fill is the poster | `MEDIA` is opaque and accepts no annotation: the evidence goes on the `FRAME` that contains it |
| Poster (still frame) | a shape with an image fill | an image ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-images.md)) and the fallback for reduced motion and blocked autoplay. Chosen on purpose, it becomes the real hero image |
| Player controls (play/pause, seek, volume, captions) | each in its own `FRAME` or button `INSTANCE` | a target with its own name and states ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)) |
| Scrim | a `RECTANGLE` or `FRAME` with `fills`, between the media and the text in `children` (back to front) | the surface the text contrast is measured against (Section 5) |
| Pause control of a background video | a button `INSTANCE`, visible, in the hero's auto layout flow | never part of the media, which the screen reader skips |
| Transcript link | a `TEXT` link next to the player | next to it, not three clicks away |
| Layers that move on their own or with scroll | nodes with `animations` or `timelines`, or reached by `AFTER_TIMEOUT` | each has a reduced-motion variant |

## 2. Classify before placing: the three questions

The agent cannot perceive a media file: `MEDIA` exposes little, and a pasted frame is not the video. The three questions of DA11Y.md Section 2.1 go to the person **in the same turn**, each with its follow-up:

1. **Information, function or only atmosphere?** The class is the person's answer, not the agent's guess.
2. **An audio track?** If so, must it be heard, or can it ship muted?
3. **Captions, transcript or audio description?** If not, who produces them, and by when?

The removal test of [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-images.md) applies unchanged: *"If I remove this media, what does the person lose?"*

| The person loses | Class | What it owes |
| :--- | :--- | :--- |
| information | **informative** | captions (SC 1.2.2), transcript, and audio description when the picture carries what the soundtrack does not (SC 1.2.5) |
| a function (plays a step, confirms an action) | **functional** | a name for the control **and** a path to the same outcome without the media |
| only atmosphere | **decorative** | no captions, but still a pause (SC 2.2.2), silence (SC 1.4.2) and reduced-motion behavior |

- **Decorative is not a synonym for background.** A hero video showing the product in use is informative and sits in the background.
- **Machine captions and transcripts are drafts** for human review, never the delivered alternative.
- **Unresolved media blocks delivery:** functional without an alternative 🔴, informative without captions 🟠, autoplaying audio without a control 🔴.

## 3. What to measure

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Text over media | the `TEXT` `fills` against the scrim over the lightest frame | the profile's floor (DA11Y.md Section 3), measured as in Section 5 |
| Control icons over the video | the vectors' `fills` against the bar or scrim behind them | 3:1 (SC 1.4.11) |
| Pause | the hero frame | a visible control when the loop lasts more than 5 seconds (SC 2.2.2, Level A, every profile) |
| Motion | `animations`, `timelines` and `AFTER_TIMEOUT` reactions | a reduced-motion variant exists |

## 4. What becomes an annotation

The canvas does not show whether media plays on its own, has sound or has captions. Each item is an annotation on the `FRAME` that holds the media, because `MEDIA` accepts none:

- **Class**, with the person's answers to the three questions.
- **Audio:** ships muted, or how it is stopped. Audio that plays on its own for more than 3 seconds has its own control (SC 1.4.2).
- **Autoplay and loop**, and that under reduced motion nothing plays and the poster stays.
- **Captions** with meaningful sounds ("[door slams]", speaker changes), who reviews them, and where the transcript sits.
- **Decorative background video:** hidden from the screen reader and from `Tab`. The pause control has a name per state ("Pause background video", "Play background video").
- **Player:** each control's name and state.
- **Embedded third-party player:** the embed does not transfer the obligation. It has a title saying what it contains, and captions confirmed on the hosted video.

Pin `fills` and `opacity` on the scrim, `fills` and `fontSize` on the text, `minWidth` and `minHeight` on each control.

```markdown
1 · hero background video
🔇 decorative, no audio
🔊 button "Pause background video" / "Play background video", outside the video
```

## 5. Background video, text over media and parallax

**Background video.** A silent decorative loop still owes three things: silence, a visible pause control and no autoplay under reduced motion. The control's two names are two variants of it. "It is just a background" is not an exemption in SC 2.2.2.

**Text over media.** The contrast over video changes frame by frame, and every automated checker passes it.

- Measure against the **composited worst case**: the lightest frame seen through the scrim.
- If the frames cannot be read, the ratio is not measured, and the report says so. An opaque band behind the text is measurable from its `fills` alone and survives a video swap: propose it, and change the scrim only with authorization.
- A gradient tuned to the current cut breaks at the next video. A shadow in the text's `effects` changes how it looks, not the ratio.
- Record the accepted scrim value in [`A11Y-DECISIONS.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/templates/A11Y-DECISIONS.md): the next hero will need it.

**Parallax.** Motion driven by scroll is a vestibular trigger (nausea, dizziness), and the pause control does not cover it, because the person never asked for it. The static composition, where the layers stand still and the section still reads, is a designed variant and the default one, and motion is added on top. Text that scrolls on its own for more than 5 seconds needs a stop control. How the file represents scroll-driven motion is to confirm: [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) lists only `animations`, `timelines` and `animationStyles`.

## 6. When the task creates or changes the player in the design system

- **Description:** "Video player. Use it for video with sound or with information. It carries the controls, captions and the transcript link. Aliases: video, media player."
- **Properties:** `State` (VARIANT) on each control (Default, Hover, Focus, Disabled), play and pause as variants of one control, `Captions` (BOOLEAN), `Transcript link` (TEXT).

## 7. Anti-patterns on the canvas

- **Classifying media as decorative on the agent's own**, or because it sits in the background.
- **Machine captions treated as delivered.**
- **A background loop with no visible pause control**, or with the control inside the video.
- **Text over video with no measured scrim:** "the video is dark enough", a gradient tuned to one cut, a text shadow as the only fix.
- **Motion with no reduced-motion variant**, including parallax with no static composition.

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-media.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-media.md); its verification scenarios run on the built product and enter the report as requirements for development.
