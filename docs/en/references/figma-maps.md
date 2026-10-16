# Maps on the canvas — the list, the map, markers and controls

> **Scope:** embedded and interactive maps (store locators, delivery tracking, area pickers, coverage displays), described in Figma nodes. Principle Zero applies: if the task can only be completed on the map, the task cannot be completed.
> **Translates:** A11Y.md [`guide-maps.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-maps.md), pinned at commit `57564be`.
> **Before this guide:** [`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md). The floors come from the profile table in DA11Y.md Section 0.1.

**The list is the map's alternative**, and for a large share of people it is the primary path, not a fallback (Section 5). Once the list exists, what remains is making the map itself not hostile.

## 1. Where it shows up in nodes

First classify the map. The agent suggests the class and the person confirms it, because calling a map decorative is a human decision.

| Kind | On the canvas | What it owes |
| :--- | :--- | :--- |
| Decorative | a stylized city illustration behind a heading | hidden from assistive technology, and the address written as `TEXT`, as always |
| Static informative | a node with an image fill showing one location | it is an image ([`figma-images.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-images.md)). The alternative is the address, never "Map showing our location" |
| Interactive | pan, zoom, clickable markers, filters | everything below |

An interactive map, in nodes:

| Part | Node | Rule |
| :--- | :--- | :--- |
| Section | `FRAME` with vertical auto layout, a heading `TEXT` first ("Stores near 01310-100") | the auto layout order is the reading order: heading, map, list |
| Map area | `FRAME` holding the base map (tiles as an image fill, or the place where a provider's map goes) | its name is an annotation (Section 4) |
| Markers | `INSTANCE` of the library's marker, in its own `FRAME` | shape, number or label besides color |
| Routes and areas | `LINE`, `VECTOR` or `POLYGON` | meaningful graphics: 3:1 (Section 3) |
| Map controls | button `INSTANCE`s ("Zoom in", "Zoom out", one per pan direction), each in its own `FRAME` | real targets with names ([`figma-buttons.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-buttons.md)), never an icon in a `GROUP` |
| Labels you place on the map | `TEXT` | follow the profile's floors |
| Result list | `FRAME` with vertical auto layout, one item `FRAME` per result: name, address, distance, status, action | in the flow, with every marker's information and action |
| Address field | the library's text field ([`figma-forms.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-forms.md)) | present whenever a pin can be dragged to set a location |

## 2. States the map must have

A state missing from the library is a Section 2 warning: point it out and draw it only with authorization.

- **Map focus.** The map area is a single tab stop, so it has a Focus state.
- **Marker:** Default, Hover, Focus and Selected. When the map follows the list's selection, the list item has a Selected state too, and both show it beyond color.
- **Hover information on focus.** What a marker reveals on hover also appears on Focus ([`figma-tooltips-popovers.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-tooltips-popovers.md)) and is in the list.
- **Map controls** come from the library's button, with its Focus state.
- **Paused, for live tracking.** Tracking that updates continuously has a visible pause control (SC 2.2.2).
- **Filtered.** The list and the map show the same filtered set.

## 3. What to measure, from the properties

| Check | Read | Passes when |
| :--- | :--- | :--- |
| Routes, areas and markers | their `strokes` or `fills` against the colors around them | 3:1 (SC 1.4.11). When the base map is an image fill, no property gives the color behind the line: record the pair as not tested and name the area someone must check |
| Two routes or zones side by side | their `strokes` or `fills` against each other | 3:1 |
| Category beyond color | the marker variants of each category ("available", "full") side by side | shape, number or label changes, not only `fills` (SC 1.4.1) |
| Labels you place | the `TEXT` `fills` against what is behind it, and `fontSize` | the profile's floor (DA11Y.md Section 3). Map text is exempt from nothing |
| Text in the tiles | the base map image | it does not resize and often fails contrast. Anything that matters is repeated as `TEXT` in the list |
| Markers as targets | `width`, `height`, `minWidth`, `minHeight` of each marker `FRAME` | the profile's floor (DA11Y.md Section 3). A marker below it passes only under the equivalent-target exception of SC 2.5.8 and SC 2.5.5: the list offers the same action through a target that meets the floor |
| Prototype | `reactions` on the map and on markers | an `ON_DRAG` that places a pin with no address field is drag-only. Marker information on `ON_HOVER` or `MOUSE_ENTER` with no focus or click path is hover-only. An `AFTER_TIMEOUT` that updates the position needs the pause control |

Pinch and two-finger pan are not among the prototype triggers ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 5). Both need buttons as their single-pointer alternative (SC 2.5.1): zoom for pinch, pan for two-finger pan.

## 4. What becomes an annotation

Each item is an annotation on the map area or on the marker:

- **Kind:** decorative, static informative or interactive.
- **Name of the map:** "Map of nearby stores", never an unnamed frame. With a provider's embed, it is also the `title` of the provider's iframe.
- **Keyboard:** the map is a single tab stop that can be entered and left, `Esc` always returns to the page, arrows pan and `+`/`-` zoom.
- **Markers:** each one's name ("Paulista branch, 1.2 km"), or the decision that markers are reached through the list and the map follows the list's selection. The second design is easier to get right.
- **Gestures:** pinch and two-finger pan, with the zoom and pan buttons as the alternative.
- **Announcement**, with the outcome: "4 stores in view", never "map moved". Live tracking does not re-announce on every tick.

Pin the measured value in the annotation ([`figma-nodes.md`](https://raw.githubusercontent.com/fecarrico/DA11Y.md/main/docs/en/references/figma-nodes.md) Section 4): on routes and areas, `strokes` or `fills` with the ratio, or "not tested" and the area. On markers and map controls, `minWidth` and `minHeight`. On labels, `fills` and `fontSize`.

```markdown
3 · map "Map of nearby stores"
🔊 buttons "Zoom in", "Zoom out" · markers through the store list
📢 on pan or filter: "4 stores in view"
```

## 5. The list beside the map

- **Everything the map communicates is text in the list:** what is here, how far, in what order, what happens if I pick it. Each item has the name, the address, the distance, the status and the action ("Details").
- **Same page, same filters.** The list updates with the filters that change the map.
- **Never make the map the only way** to choose an address, pick a delivery area, select a store, confirm a location or see a status.
- **Dragging a pin is never the only way to set a location.** A drag-a-pin flow with no address field is a form that cannot be used by keyboard.

## 6. When the task creates or changes the map in the design system

- **Description of the marker:** "Map marker. Use it to show one place on an interactive map. Do not use it as the only way to choose a place (the list beside the map is that path). Aliases: pin, map pin, location marker."
- **Properties:** on the marker, `State` (VARIANT) with Default, Hover, Focus and Selected, `Category` (VARIANT, a different shape per category) and `Number` (TEXT). On the list item, `State` with Default, Focus and Selected.

## 7. Anti-patterns on the canvas

- **The map as the only way** to do the task, including a pin to drag with no address field.
- **A static map whose alternative is "Map showing our location".**
- **"Green = available, red = full"** with no shape, number or label.
- **Information only on marker hover.**
- **Zoom or pan only by gesture**, or map controls as icons in a `GROUP`, with no box and no name.
- **What matters only in the tiles**, and labels you placed below the profile's floors.
- **A list that does not follow the map's filters.**

## 8. What stays for code

Semantics, keyboard and screen reader are implemented following A11Y.md [`guide-maps.md`](https://raw.githubusercontent.com/fecarrico/A11Y.md/57564be72e7d2c8e349f4cc2971cdb27f9043863/docs/en/references/guide-maps.md); its verification scenarios run on the built product and enter the report as requirements for development.
