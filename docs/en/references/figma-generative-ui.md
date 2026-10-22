# Chat and generated answers on the canvas — conversation, message, streaming and composer

> **Scope:** the chat screen and its parts in Figma nodes: the conversation, each message and who speaks, the response while it is generated, stopped or failed, the per-message actions, the composer (the field where the person writes), and interface a model assembles at runtime.
> **Translates:** A11Y.md [`guide-generative-ui.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-generative-ui.md), pinned at commit `9fb9a02`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

## 1. Anatomy in nodes

| Part | Node | Rule |
| :--- | :--- | :--- |
| Conversation | `FRAME` with vertical auto layout, messages in the order they were sent | the auto layout order is the reading order. A message taken out of the flow with `layoutPositioning: ABSOLUTE` is read out of place |
| Message | `INSTANCE` of a message component, never a `GROUP` | one per turn, with a box to measure and a place for evidence |
| Speaker | `TEXT` with "You" or "Assistant" | who speaks is said in text. Avatar color, alignment and bubble shape say nothing to a screen reader and are ambiguous in high-contrast mode. If the design hides the text, the annotation carries it |
| Time | `TEXT` | a relative time ("2 minutes ago") needs the full date and time in the annotation |
| Response content | `TEXT` with a heading style for headings and lists declared as lists (`getRangeListOptions`) | Section 5 |
| Code block | `FRAME` with a `TEXT` naming the language and a Copy button | the language is in text |
| Per-message actions (Copy, Retry, rating) | button `INSTANCE`s, each in its own `FRAME` | each one is a target with its own box and a distinct name (Section 4) |
| Stop generating | button `INSTANCE`, visible while the response is generated | the same control for everyone |
| Skip to latest response | button `INSTANCE` | the explicit way to the newest answer. Nothing else moves focus there |
| Composer | the library's text field ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md)) and the Send button | visible label, and no time limit |
| What the assistant is | `TEXT` in the interface | says that the other side is an assistant |

## 2. States the component must have

- **Composer:** Default, Focus, Streaming and, when the product uses it, Disabled with the reason in text. Streaming is the state while the response is generated. It shows a visible Stop generating with its own target, because a response that cannot be stopped is moving content the person cannot escape (SC 2.2.2).
- **Response:** Streaming, Complete, Stopped and Error.
- **Stopped next to Complete.** Copy, Retry and the citations appear in both, because nothing may depend on the stream having finished.
- **Error.** A text that names the way out, because a stream that just stops leaves no signal.

A state the library lacks is a Section 2 warning: point it out and draw it only with authorization.

## 3. What to measure

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Message text | the `TEXT` `fills` against the bubble `fills`, not the page, in each mode | the profile's text floor (DA11Y.md Section 3) |
| Time limit | `AFTER_TIMEOUT` reactions on the composer or the chat screen | none on the composer. A session that expires mid-thought fails SC 2.2.1 |
| Structure of the response | text styles and list options of the response `TEXT` | headings use a heading style, not bold body text, and lists are declared, not typed "•" |

## 4. What becomes an annotation

Each item is an annotation on the conversation frame or on the node (DA11Y.md Section 4):

- **Conversation:** new messages are announced once, existing ones are never read again, and no message interrupts.
- **Streaming:** the text is not announced while it grows. Announced, with the exact text: "Generating response" when it starts, "Response ready, 240 words" when it ends (SC 4.1.3).
- **Focus:** stays in the composer when a response starts. "Skip to latest response" takes it to the newest answer (SC 2.4.3).
- **Speaker:** the prefix read before each message ("You:", "Assistant:") when it is not visible, and a heading per turn with its level.
- **Time:** the full date and time behind a relative one.
- **Per-message action names:** distinct, and containing the visible text, such as "Copy response 3" on a button that reads "Copy" (SC 2.5.3). The Copy button of a code block gets a unique name too.
- **Error:** the exact text, announced when it appears.

Pin `minWidth` and `minHeight` on each action, and `fills` and `fontSize` on the message text.

```markdown
3–4 · conversation
📢 "Generating response" → "Response ready, 240 words" · each new message, once
3) 🔊 button "Copy response 3"
4) 🔊 button "Retry response 3"
```

## 5. Generated content and interface assembled at runtime

- **What the model renders is structure.** The response template shows headings at the page's level, declared lists, tables with headers ([`figma-tables.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-tables.md)) and code blocks with the language in text (SC 1.3.1). Bold text where a heading belongs teaches the code to render bold text.
- **Images and charts the model generates** carry the same obligation as any image: classify, draft the alternative text, the person confirms (SC 1.1.1). See [`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-images.md) and [`figma-charts.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-charts.md).
- **Interface assembled at runtime** uses only library components. Then accessibility belongs to the library, verified once, and not to each generation. A design of generated interface made of one-off shapes is a warning.
- **What the generator cannot guarantee** (an image's alternative text, a media caption, a chart's data) is annotated as requested from the person in the loop.
- **The product's own copy** (labels, empty states, error text) is in plain language, and the assistant never asks again for what was already given (SC 3.3.7). See [`figma-cognitive.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-cognitive.md).

## 6. When the task creates or changes the chat components in the design system

- **Description:** "Chat message. Use it for one turn of a conversation between a person and an assistant. Do not use it for system notices (use Toast). Aliases: chat bubble, message, turn, assistant response."
- **Properties:** `State` (VARIANT: Streaming, Complete, Stopped, Error), `Speaker` and `Time` (TEXT). On the composer, `State` (VARIANT: Default, Focus, Streaming, Disabled).

## 7. Anti-patterns on the canvas

- **Who speaks shown only** by avatar color, alignment or bubble shape.
- **A Streaming state with no Stop generating.**
- **Copy and Retry only on a complete response.**
- **Twenty identical "Copy"** with no distinct name in the annotation.
- **Pseudo-headings** in bold body text, and bullets typed as characters.
- **An error that is only the stream stopping**, with no message.
- **A timer on the composer.**
- **Focus annotated as jumping to the new response.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-generative-ui.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/9fb9a023c7625a70a0ecbc8420181c100bcdb529/docs/en/references/guide-generative-ui.md); its verification scenarios run on the built product and enter the report as requirements for development.
