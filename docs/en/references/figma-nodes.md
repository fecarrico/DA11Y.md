# Figma nodes and what the API offers — the base for designing accessibly

> **Scope:** what each Figma node type can carry, read and write, and where accessibility fits (and does not fit) in that model. It is the foundation of DA11Y.md's component guides.
> **Sources, checked on 2026-10-09:** the official Plugin API typings, `@figma/plugin-typings` **1.141.0** (published 2026-10-05), and the REST API OpenAPI specification, `figma/rest-api-spec` **0.44.0** (2026-10-07). Anything not from these two sources is marked.

## 0. The ways in

| Way in | Who uses it | Reads | Writes |
| :--- | :--- | :--- | :--- |
| **Plugin API** | plugins, the official MCP server's `use_figma` and, as the documentation suggests, the Figma agent | everything, including the selection | everything |
| **REST API** | outside tools, with a token | the whole file and rendered images; cannot see the selection | only comments, dev resources, webhooks and (Enterprise) variables — **never layers** |

Layout and appearance names are the same in both (`layoutMode`, `itemSpacing`, `fills`…). The differences that matter are in Section 6.

## 1. What does not exist: no accessibility field at all
The Plugin API has **no** role, accessible name, alternative text, heading level, focus order or region. No node type carries any of it. That whole layer exists only in three places, by convention:

1. **Annotation** (Section 4) — the right channel, visible in Dev Mode.
2. **Layer name** — read by agents as a clue; that is why it cannot lie.
3. **Component description** (`description`, `descriptionMarkdown`) — the context that travels with the component wherever it goes.

Figma Sites has its own semantics fields (HTML tags, `alt`, `aria-label`, `role`), but they do not appear in the Plugin API typings used in Figma Design.

## 2. Node types

The Plugin API defines **34 scene node types**. The ones that matter for interface design:

| Type | What it is | Auto layout | Accepts annotation | For accessibility |
| :--- | :--- | :--- | :--- | :--- |
| `FRAME` | container; a direct child of the page = a screen | ✅ (incl. `GRID`) | ✅ | the interactive frame's box is the **touch area**; the auto layout order is the **structural order** |
| `COMPONENT` | main component | ✅ | ✅ | where the real fix happens; carries description and properties |
| `COMPONENT_SET` | variant set | ✅ | ✅ | where you check that required states exist; **has no prototyping** (`ReactionMixin` absent) |
| `INSTANCE` | use of a component | ✅ | ✅ | the role comes from the main component; a local override breaks the token |
| `SLOT` | free content area inside a component | ✅ | ✅ | exists in the API; the Figma agent does not use slots yet ("coming soon") |
| `GROUP` | grouping | ❌ | ❌ | no padding, no auto layout and **no annotation**: a "button" made of a group has no defined touch area and no place for evidence |
| `TRANSFORM_GROUP` | group with a transform (beta) | ❌ | ❌ | like a group |
| `SECTION` | file organization | ❌ | ❌ | not a screen; has `devStatus` |
| `TEXT` | text | — | ✅ | contrast, size, rhythm, alignment, truncation, lists, links |
| `RECTANGLE`, `ELLIPSE`, `POLYGON`, `STAR`, `LINE`, `VECTOR` | shapes and icons | — | ✅ | a meaningful graphic needs 3:1; with an image fill, it is an image |
| `BOOLEAN_OPERATION` | compound icon | — | ❌ | annotate the frame or instance that contains it |
| `TEXT_PATH` | text on a path | — | ✅ | rare in interfaces |
| `TABLE`, `MEDIA` | table, media | — | ❌ | opaque nodes: the API exposes little |

The others (`STICKY`, `CONNECTOR`, `SHAPE_WITH_TEXT`, `WIDGET`, `SLIDE`…) belong to FigJam, Slides or widgets, and are out of scope.

## 3. The blocks that matter
Each node is made of property blocks ("mixins"). The ones that decide accessibility:

| Block | Fields | Use |
| :--- | :--- | :--- |
| Dimension and position | `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `absoluteBoundingBox` | measure the target; `minWidth`/`minHeight` guarantee the floor even with small content |
| Layout | `absoluteRenderBounds`, `rotation`, `layoutSizingHorizontal`/`Vertical` (`FIXED`, `HUG`, `FILL`) | `FIXED` on a text container clips when the text grows |
| Auto layout | `layoutMode` (`NONE`, `HORIZONTAL`, `VERTICAL`, `GRID`), `paddingTop`/`Right`/`Bottom`/`Left`, `itemSpacing`, `counterAxisSpacing`, `layoutWrap`, `primaryAxisAlignItems`, `counterAxisAlignItems`, `itemReverseZIndex`, `primaryAxisSizingMode`, `counterAxisSizingMode` | reading order, distance between targets, touch area |
| Auto layout child | `layoutPositioning` (`AUTO`, `ABSOLUTE`), `layoutAlign`, `layoutGrow` | an `ABSOLUTE` child leaves the flow: its order then comes from geometry |
| Grid | `gridRowCount`, `gridColumnCount`, `gridRowGap`, `gridColumnGap`, `gridRowSizes`, `gridColumnSizes`; on the child, `gridRowAnchorIndex`, `gridColumnAnchorIndex`, spans | order in the grid: row, then column |
| Children | `children` — **back to front** (the first is the bottom one) | stacking is not reading order |
| Scene node | `visible`, `locked`, `boundVariables`, `setBoundVariable`, `inferredVariables`, `resolvedVariableModes`, `componentPropertyReferences` | which token is bound, in which mode |
| Paint and effect | `fills`, `strokes`, `strokeWeight`, `effects`, `isMask`, `opacity` | contrast; a focus ring made of a shadow disappears in high contrast |
| Text | `textAutoResize` (`NONE`, `WIDTH_AND_HEIGHT`, `HEIGHT`, `TRUNCATE`), `textTruncation`, `maxLines`, `textAlignHorizontal` (includes `JUSTIFIED`), `lineHeight`, `paragraphSpacing`, lists (`getRangeListOptions`), `hyperlink` per segment (`getStyledTextSegments`) | text that clips, rhythm, alignment, declared lists and links |
| Publishable | `description`, `descriptionMarkdown`, `documentationLinks` | the context layer for agents (DA11Y.md, Section 2.2) |
| Component properties | `componentPropertyDefinitions` — `VARIANT`, `BOOLEAN`, `TEXT`, `INSTANCE_SWAP`, `SLOT`; `add`/`edit`/`deleteComponentProperty` | states as variants; the label as a text property |
| Variant | `variantProperties` | which state this instance shows |
| Prototyping | `reactions`, `setReactionsAsync` | see Section 5 |
| Dev status | `devStatus`, dev resources (`addDevResourceAsync`…) | link the component to documentation and code |
| Motion | `animations`, `timelines`, `animationStyles` | whatever animates needs a reduced-motion variant |

## 4. Annotations and measurements — where the evidence lives

**Annotation** (`node.annotations`, a list — a node accepts several):

| Field | Holds |
| :--- | :--- |
| `label` | plain text |
| `labelMarkdown` | formatted text (a subset of Markdown) |
| `categoryId` | the category; design files ship with four presets — Development, Interaction, **Accessibility** and Content — and the id comes from `figma.annotations.getAnnotationCategoriesAsync()` |
| `properties` | **pinned properties**: the node's real value, shown live in Dev Mode |

The properties an annotation can pin: `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, `maxHeight`, `fills`, `strokes`, `effects`, `strokeWeight`, `cornerRadius`, `textStyleId`, `textAlignHorizontal`, `fontFamily`, `fontStyle`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `itemSpacing`, `padding`, `layoutMode`, `alignItems`, `opacity`, `mainComponent`, `gridRowGap`, `gridColumnGap`, `gridRowCount`, `gridColumnCount`, `gridRowAnchorIndex`, `gridColumnAnchorIndex`, `gridRowSpan`, `gridColumnSpan`.

**Why it matters:** an accessibility annotation can **pin the value it comments on**. "44 target — House Rule" with `minWidth` and `minHeight` pinned; "Text contrast, Standard floor 4.5:1" with `fills` pinned; "Paragraph rhythm" with `lineHeight` and `fontSize`. If someone changes the value later, the annotation shows the new value — the evidence does not go stale in silence.

**Where it cannot go:** `GROUP`, `TRANSFORM_GROUP`, `SECTION`, `BOOLEAN_OPERATION`, `TABLE` and `MEDIA` do not accept annotations. Annotate the frame, the instance or the text.

**Measurement** (`figma.currentPage.addMeasurement`): a distance drawn between two nodes, from a chosen side of each, always on the same axis — for example, the 8px between two neighboring targets. **It only works in Dev Mode** (documented in the typings).

**To confirm:** whether the Figma agent, working in Figma Design, can write annotations. The official example of a Markdown annotation checks that the editor is in Dev Mode, and writing requires a Full seat.

## 5. Prototyping

| Trigger (`trigger.type`) | Accessibility reading |
| :--- | :--- |
| `ON_CLICK`, `ON_PRESS` | the node is interactive |
| `ON_HOVER`, `MOUSE_ENTER`, `MOUSE_LEAVE` (with `delay`) | without a click equivalent, a hover-only action |
| `ON_DRAG` | without a click alternative, a drag-only action |
| `AFTER_TIMEOUT` (with `timeout` in ms) | automatic motion, a toast that disappears, a carousel that rotates |
| `ON_KEY_DOWN` (with `device` and `keyCodes`) | the design anticipated a keyboard |
| `MOUSE_UP`, `MOUSE_DOWN`, `ON_MEDIA_HIT`, `ON_MEDIA_END` | fine-grained interaction and media |

Actions (`action.type`): `BACK`, `CLOSE`, `URL` (with `openInNewTab` — a link that opens another tab must say so in its text), `UPDATE_MEDIA_RUNTIME`, `SET_VARIABLE`, `SET_VARIABLE_MODE`, `CONDITIONAL`, plus navigation between screens.

## 6. Execution context and differences between the ways in

- **Editor:** `figma.editorType` is `figma`, `figjam`, `dev`, `slides` or `buzz`. Measurements require `dev`.
- **Selection:** `figma.currentPage.selection` (Plugin API). The REST API cannot see the selection.
- **Dynamic page access:** with `"documentAccess": "dynamic-page"` in the manifest, the old synchronous getters throw; use the async ones (`getNodeByIdAsync`…).
- **Variables:** the Plugin API resolves the value in the consumer's mode (`variable.resolveForConsumer(node)`). The REST API returns only the variable's id, and the variables endpoint is Enterprise-only.

| Difference | Plugin API | REST |
| :--- | :--- | :--- |
| Prototyping | `reactions` | `interactions` |
| Annotations | full `annotations` (Section 4) | the 0.44.0 specification declares the block empty |
| `children` order | documented: back to front | undocumented (same order, to confirm) |
| Writing | everything | no layers |

## 7. What this changes in design
- **Evidence goes on a frame, instance, text or shape — never on a group.** An interactive element made of a group is a warning: without its own box there is no touch area and no annotation.
- **Pin in the annotation the value it comments on**, so the evidence follows the change.
- **Measurements only in Dev Mode.** An agent working in Figma Design records distances in the annotation's text.
- **Layer names and component descriptions are evidence for the next agent:** write what the thing is.
