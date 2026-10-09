> **AI agent reading this repository:** the normative core is [`docs/en/DA11Y.md`](docs/en/DA11Y.md) · [`docs/pt-BR/DA11Y.md`](docs/pt-BR/DA11Y.md). Read it first, then [`docs/en/references/figma-nodes.md`](docs/en/references/figma-nodes.md). Load a component guide only when its row in Section 7 matches what you are designing. [`llms.txt`](llms.txt) is the index.

🇧🇷 Read in Portuguese: [README.pt-BR.md](README.pt-BR.md)

# DA11Y.md

*Accessibility before the first pixel*

**The design edition of [A11Y.md](https://github.com/fecarrico/A11Y.md).** It brings the same accessibility rules to whoever designs interfaces in design software, people and AI agents alike.

> **Status: draft 0.1.0, private, under test.** It was born from one pilot with the Figma agent in October 2026. Read [What we know so far](#what-we-know-so-far) before relying on it.

## Why it exists

A11Y.md makes a coding agent build accessible interfaces. But many accessibility decisions are made before the code exists, in the design file: contrast, touch target size, focus states, error messages, reading order. When the design ignores them, the developer fixes them in code, and the product ends up different from what was designed. DA11Y.md moves those rules to the moment the screen is drawn, so design and code answer to the same numbers.

## How it relates to A11Y.md

- **Same numbers.** The compliance profiles, the thresholds and the severity model are compiled from a pinned copy of A11Y.md. A script checks that they never drift, in English and in Portuguese.
- **Its own functions.** Everything specific to the canvas lives here: how to read a Figma file, how to evaluate what a design system already decided, and where the evidence goes.
- **A one-way link.** DA11Y.md points to A11Y.md. The A11Y.md core does not point back, so developers pay nothing for it in context.
- **Code stays with A11Y.md.** The design report ends with the instruction to implement following A11Y.md.

## What it asks of the agent

1. **What already exists comes first.** The agent looks up the library's components, variables and styles, and the rules already on record, such as a `DESIGN.md`. It applies them as they are and then evaluates the result. It warns about every prior decision that affects accessibility, with its origin and its measurement. It fixes only with explicit authorization.
2. **Compute, never estimate.** Contrast is calculated from the token values, in every state and every mode.
3. **The evidence lives in the file.** Each report becomes a native Figma annotation in the Accessibility category. The chat does not count as evidence, because it never reaches whoever builds the product.
4. **The agent suggests and a person confirms.** Reading order, headings, accessible names and alternative text are suggested as annotations marked "Agent suggestion — confirm". The developer implements what is confirmed.
5. **Building a design system includes context for agents.** When the task is to create components, the agent also writes what the next agent needs to read: the description, the aliases, the accessibility contract as data and the anatomy in reading order.

## Quick start

DA11Y.md is portable Markdown. With the Figma agent:

1. Attach `docs/en/DA11Y.md` and `docs/en/references/figma-nodes.md` to your design library as **library guidelines**, about 35 KB together. Figma hands every guidelines file to the agent on every prompt that uses the library, caps them at 200 KB in total and recommends three to eight files under 100 KB ([Figma Help Center](https://help.figma.com/hc/en-us/articles/43509372175511)). Library guidelines are in beta and require a Professional, Organization or Enterprise plan.
2. Leave the 27 component guides out. The agent opens one by link only when its row in Section 7 matches what it is designing, the same way A11Y.md loads its guides.
3. Ask the agent to design or review as usual. It applies the library first and annotates what it found.

While this repository is private, the links do not open for agents. To test a component, attach its guide as well.

## What we know so far

- **One pilot, one task.** The Figma agent designed a banking login on a real corporate library, once without and once with A11Y.md. With A11Y.md, it raised the contrast of the input border, designed the focus state and wrote a full report for the developer. It also replaced the library's brand colors and the field border without saying why. That failure is the origin of Section 2.
- **Loading on demand worked inside Figma.** In the pilot, the agent fetched the A11Y.md core, eight guides and two templates by link. These were exactly the rows the map asks for in a mobile login.
- **Not tested yet.** Whether the Figma agent can write native annotations, and whether the "warn before fixing" flow holds. Round 2 of the pilot tests both.

## Repository layout

| Path | What it holds |
| :--- | :--- |
| `docs/en/`, `docs/pt-BR/` | the two editions and their reference guides |
| `upstream/` | the pinned A11Y.md copies, with their provenance: the core the shared blocks are compiled from, and the guides this project translates, which ground the numbers in its own guides |
| `tools/compile.py` | recompiles the shared blocks and checks numbers, guides and language parity |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The most useful contribution is a field report: you used DA11Y.md on a real design and something happened.

---

**Author:** Felipe A. Carriço · [LinkedIn](https://linkedin.com/in/fecarrico) · [A11Y.md](https://github.com/fecarrico/A11Y.md)
