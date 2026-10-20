> **AI agent reading this repository:** the normative core is [`docs/en/DA11Y.md`](docs/en/DA11Y.md) · [`docs/pt-BR/DA11Y.md`](docs/pt-BR/DA11Y.md). Read it first, then [`docs/en/references/figma-nodes.md`](docs/en/references/figma-nodes.md). Load a component guide only when its row in Section 7 matches what you are designing or evaluating. Designing or evaluating, the task ends only with the annotations written in the file, as Section 5 describes. [`llms.txt`](llms.txt) is the index.

🇧🇷 Read in Portuguese: [README.pt-BR.md](README.pt-BR.md)

<div align="center">
  <img src="./da11ymd.png" alt="The dally.md logotype between two of Dalí's elephants, in a landscape drawn in ASCII characters." width="100%" />
</div>

# DA11Y.md

*Accessibility before the first pixel*

**The design edition of [A11Y.md](https://github.com/fecarrico/A11Y.md).** It brings the same accessibility rules to whoever designs interfaces in design software, people and AI agents alike.

> **Status: draft 0.1.0, under test.** It was born from one pilot with the Figma agent in October 2026. Read [What we know so far](#what-we-know-so-far) before relying on it.

## Why it exists

A11Y.md makes a coding agent build accessible interfaces. But many accessibility decisions are made before the code exists, in the design file: contrast, touch target size, focus states, error messages, reading order. When the design ignores them, the developer fixes them in code, and the product ends up different from what was designed. DA11Y.md moves those rules to the moment the screen is drawn, so design and code answer to the same numbers.

## How it relates to A11Y.md

- **Same numbers.** The compliance profiles, the thresholds and the severity model are compiled from a pinned copy of A11Y.md. A script checks that they never drift, in English and in Portuguese.
- **Its own functions.** Everything specific to the canvas lives here: how to read a Figma file, how to evaluate what a design system already decided, and where the evidence goes.
- **A one-way link.** DA11Y.md points to A11Y.md. The A11Y.md core does not point back, so developers pay nothing for it in context.
- **Code stays with A11Y.md.** The design report ends with the instruction to implement following A11Y.md.

## The name and the logo

DA11Y.md is the D in design added to A11Y, short for accessibility. It can be read as "dally", which sounds like the name of the painter Salvador Dalí. The reference to art is deliberate, because it brings the project closer to design and creativity, which is where the people who will use it work.

The "a" in the logo carries the melting clock from the painting *The Persistence of Memory*. The choice shows the project's ambition, which is to be a persistent context in the agent's memory. The agent should use the protocol every time it designs an interface.

To fit in that memory, the protocol follows prompt engineering practices and loads each guide only when the task calls for it, which saves tokens. But the goal is not economy, it is accessibility.

## What it asks of the agent

1. **What already exists comes first.** The agent looks up the library's components, variables and styles, and the rules already on record, such as a `DESIGN.md`. It applies them as they are and then evaluates the result. It warns about every prior decision that affects accessibility, with its origin and its measurement. It fixes only with explicit authorization.
2. **Compute, never estimate.** Contrast is calculated from the token values, in every state and every mode. In the Figma agent, the computation comes from `tools/measure.js`, which it reads by link and runs.
3. **The evidence lives in the file.** Each evaluated frame gets a short native Figma annotation, with the status and the counts, in the Accessibility category. The full report goes onto a page of the file itself, `DA11Y — reports`, and is repeated in the chat, for the person to save as `REPORT.md` and hand to whoever builds. The chat alone is not enough, because it never reaches whoever builds the product.
4. **Every annotation asks for an action, in a few words.** When you ask for the accessibility handoff, or when the agent delivers a designed screen, each element where a screen reader stops gets one annotation, with the reading order and what is read (`🔊`), one stop per line, with the role from a closed vocabulary. The Tab order goes into the report, as a requirement for development. On an evaluation, the reading stays in the report, and the canvas gets only the errors and the structural questions. What is not read stays off the annotation and goes into the report, and the frame annotation says how many items there are. An error fits on one line, with the severity in color and in text, such as `🔴 CRITICAL · Library: no Focus state` or `🟠 HIGH · Here: white arrow on white`. Each type has its own annotation category, which the agent creates when the file lacks it, so each person can filter what they have to do. Measurements, caveats and what belongs to code only stay in the report, off the canvas. When you decide, you add a line with `✓` and your name.
5. **Building a design system includes context for agents.** When the task is to create components, the agent also writes what the next agent needs to read: the description, the aliases, the accessibility contract as data and the anatomy in reading order.

## Quick start

**The quickest way is the skill published in the Figma Community.** Open the [`da11y` skill page](https://www.figma.com/community/skill/136973/da11y), save it to your account and ask the agent, for example, `/da11y analyze this screen` or `/da11y prepare the accessibility handoff for this screen`. The skill only carries the rule from step 1 below, and the protocol stays a single source, here on GitHub.

DA11Y.md is portable Markdown, and the Figma agent reads the protocol by link, the same way a coding agent reads A11Y.md.

1. In your prompt to the Figma agent, or in the environment rules when the tool has that field, include this rule:

   ```
   When designing or evaluating flows, screens or components, follow strictly the accessibility rules in the file https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/DA11Y.md
   ```

2. The agent opens the core and, from it, `figma-nodes.md`. It opens one of the 27 component guides only when that guide's row in Section 7 matches what it is designing, the same way A11Y.md loads its guides.
3. Ask the agent to design or review as usual. It applies the library first and annotates what it found.
4. When it points out a failing contrast pair, check the same pair in Figma's own contrast check, in the color picker. Do not use the auto-correct button, because it changes the color that came from the library.

**To create the skill by hand**, under **Add context › Skills › Manage skills**, create a skill named `da11y`, with the rule from step 1 as its instructions and this description, which is what makes the skill run without typing `/`:

```
Required to design, edit, analyze or review the accessibility of screens, flows or components in Figma. Applies the DA11Y.md protocol, read from GitHub, measures contrast, targets and text with code, and ends only with the annotations written in the file.
```

The skill is only the rule. The protocol stays a single source on GitHub, and the skill does not change when the protocol does. In a test on 2026-10-16, the skill ran without `/`, but did not say it had.

**Another option, not yet tested, is library guidelines.** If you want the rule to come in by itself when someone asks the agent for a design with your library, download [`guidelines/accessibility-da11y.md`](guidelines/accessibility-da11y.md) and upload it as a library guideline, under **Library › Manage guidelines**. The file holds only the rule from step 1. Guidelines accept uploaded files only, not links ([Figma Help Center](https://help.figma.com/hc/en-us/articles/43509372175511)), so the file carries the rule, and the rule leads to the core, which stays a single, up-to-date source. The feature is in beta and requires a Professional, Organization or Enterprise plan. To review a finished screen, put the rule in your prompt, because the Help Center only promises guidelines when the request is to create a design with the library.

## What we know so far

- **One pilot, one task.** The Figma agent designed a banking login on a real corporate library, once without and once with A11Y.md. With A11Y.md, it raised the contrast of the input border, designed the focus state and wrote a full report for the developer. It also replaced the library's brand colors and the field border without saying why. That failure is the origin of Section 2.
- **Loading on demand worked inside Figma.** In the pilot, the agent fetched the A11Y.md core, eight guides and two templates by link. These were exactly the rows the map asks for in a mobile login.
- **A second test, on a sign-up flow.** The agent evaluated seven frames over a real corporate library. It wrote native annotations in the Accessibility category and pointed out the library's defects without changing anything. The annotations came out far too long, with the whole report inside them and the same findings repeated on every screen, and that is the origin of the short frame annotation.
- **A third test, on an app screen, with the skill.** The Figma agent ran `measure.js` read by link, after we found that, in its code, the selection is empty and nodes are found by id. It wrote 28 annotations, and 19 repeated the same text with another name inside: each card, its icon and its arrow in separate annotations, with measurements and caveats in all of them. That is the origin of one annotation per element, with the reading order and two lines at most per error.
- **A fourth test, on an app screen, with the published skill.** The agent evaluated a detail screen of a mobile app. The analysis was good: five real findings, contrast and origin right, hidden layers out, no false positive on contrast. The reading was mostly right, and the part it invented looked authoritative: two attachments became buttons named "Open …" with no control drawn, the map's alternative text repeated the address of the next stop, and the frame said "Your decisions — 14" when four were decisions and the rest were readings to confirm. Stark, axe for Designers, BrowserStack's design toolkit and GitHub's Annotation Toolkit keep the check and the handoff annotation as two modes, and their AI only suggests until the person accepts; the protocol gave a verdict and a proposal the same weight. That is the origin of the two modes: an evaluation leaves the errors and the structural questions on the canvas, and the reading is annotated when asked for, with a closed role vocabulary and the report on a page of the file.

## Repository layout

| Path | What it holds |
| :--- | :--- |
| `docs/en/`, `docs/pt-BR/` | the two editions and their reference guides |
| `upstream/` | the pinned A11Y.md copies, with their provenance: the core the shared blocks are compiled from, and the guides this project translates, which ground the numbers in its own guides |
| `docs/<lang>/templates/REPORT.md` | the design accessibility report that leaves the file with the design and reaches whoever builds |
| `guidelines/` | the ready-made Figma library guideline, in English and Portuguese, holding the activation rule |
| `tools/measure.js` | reads Figma screens through the Plugin API, by id, and returns contrast pairs, targets, spacing and text growth as data. The Figma agent reads it by link and runs it |
| `tools/annotate.js` | writes the annotations in the short format, with the frame one taken from the counts, and reads them back to check. It keeps people's annotations and refuses one outside the format. The Figma agent reads it by link and runs it |
| `tools/compile.py` | recompiles the shared blocks and checks numbers, guides and language parity |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The most useful contribution is a field report: you used DA11Y.md on a real design and something happened.

---

**Author:** Felipe A. Carriço · [LinkedIn](https://linkedin.com/in/fecarrico) · [A11Y.md](https://github.com/fecarrico/A11Y.md)
