// DA11Y.md — handoff.js
//
// Draws an accessibility handoff page in the Figma file, on the page
// "DA11Y — handoff", one block per screen or component:
//   1. Reading order: a copy of the screen with each reading stop outlined
//      and numbered, and a card per stop with what the screen reader reads.
//      What is not read is not drawn.
//   2. Controls and touch areas (an app) or Tab order and touch areas (the
//      web): a second copy with the controls outlined, and a card per control
//      with its box, the profile's minimum, the A11Y.md rule and the nearest
//      neighbor. In an app the focus order follows the reading, so each
//      control keeps its reading number; on the web it is numbered in Tab order.
//   3. Focus states: for each component behind a control, the control as it
//      is on the screen beside the same control in its focus variant, or the
//      note that the library has none. A library component is read from the
//      library, so a variant this file never used still counts.
// Markers sit outside the copy, on the nearest edge, with a line to the
// element, so they never cover the screen.
//
// The page follows the screen's design system when it has one: the text
// styles the screen uses most (title, strong, body) and the color variables
// of its text and its background, bound and not copied. The pair is measured
// first, and below 4.5:1 the page falls back to ink and paper. Whatever cannot
// be read or loaded falls back too, and the result says why.
//
// It is the drawing half of the handoff. The content (the order, what is read,
// the roles, which elements are controls) is the agent's proposal under
// DA11Y.md Sections 4 and 5; this file only places it, the same way every time.
// The measurements are made here, on the original nodes, with the numbers of
// measure.js (PROFILES, HOUSE_GAP).
//
// Where it runs: the Figma agent's code execution, a plugin, the console. It
// never changes the design: it only creates, and replaces, its own blocks on
// its own page.
//
//   return await handoff([{ screen: "123:456", title: "Login",
//     reading: [{ id: "123:460", text: "3–4 · entrar\n3) 🔊 campo \"E-mail\"\n4) 🔊 botão \"Entrar\"" }],
//     focus: [{ id: "123:470", text: "botão \"Entrar\"", n: 4 }] }],
//     { lang: "pt-BR", profile: "Standard", platform: "app" });
//
// reading: one item per element, in the short format of Section 5: the order
// and the element on the first line, then one 🔊 line per stop. A component
// with an action inside is one item with its stops numbered. When reading is
// missing, the reading annotations already on the screen are used.
// focus: the controls, in Tab order, each with what it is called and, in an
// app, n, the number of its stop in the reading. Without focus there is no
// second or third section. title, optional, is the name the block shows when
// the node's own name is a component's.
// A card is the agent's proposal until a person adds a line "✓ <name>" to it.
// A new run for the same screen replaces its block in place and keeps every
// card that has a ✓ as the person left it.
//
// Built by tools/build.py from tools/src/common.js and tools/src/handoff-page.js:
// edit those, then run `python3 tools/build.py`. Standard library only.

function parse(text) {
  // One reading item, in the short format of Section 5.
  const lines = String(text || "")
    .replace(/\\([\\`*_{}[\]()#+\-.!"])/g, "$1")
    .split("\n").map((l) => l.trim()).filter(Boolean);
  const m = lines.length ? lines[0].match(ORDER) : null;
  if (!m) return { problem: "the first line is the order and the element, such as \"4 · card\"" };
  const body = lines.slice(1);
  if (!body.some((l) => READ.test(l))) return { problem: "no 🔊 line: a reading stop says what is read" };
  if (body.some((l) => l.startsWith("🔇"))) return { problem: "🔇 lines are not drawn: what is not read stays off the page" };
  return { from: Number(m[1]), label: m[2] ? m[1] + "–" + m[2] : m[1], element: m[3].trim(), lines: body };
}

function distance(a, b) {
  // The gap between two boxes; 0 when they touch or overlap.
  const dx = Math.max(0, a.x - (b.x + b.w), b.x - (a.x + a.w));
  const dy = Math.max(0, a.y - (b.y + b.h), b.y - (a.y + a.h));
  return dx > 0 && dy > 0 ? Math.hypot(dx, dy) : Math.max(dx, dy);
}


function fromAnnotations(screen) {
  const nodes = [screen, ...screen.findAll((n) => "annotations" in n && n.annotations.length > 0)];
  const items = [];
  for (const n of nodes) for (const a of n.annotations || []) {
    const t = a.labelMarkdown || a.label || "";
    if (ORDER.test(t.split("\n")[0].trim()) && t.includes("🔊")) items.push({ id: n.id, text: t });
  }
  return items;
}


function decidedCards(block) {
  // The cards a person decided, by the node they describe, as the person left them.
  const out = {};
  if (!block) return out;
  for (const c of block.findAll((n) => n.type === "FRAME" && n.getSharedPluginData("da11y", "stop") !== "")) {
    const lines = c.children.filter((t) => t.type === "TEXT").map((t) => t.characters).join("\n")
      .split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.some((l) => DECIDED.test(l))) out[c.getSharedPluginData("da11y", "stop")] = lines;
  }
  return out;
}

async function componentOf(node) {
  if (node.type !== "INSTANCE") return null;
  const main = await node.getMainComponentAsync();
  if (!main) return null;
  const set = main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : null;
  const parents = [];
  for (let n = node.parent; n && n.type !== "PAGE"; n = n.parent) if (n.type === "INSTANCE") { parents.push(n.name.trim()); break; }
  return { main, set, parents };
}

async function variantsOf(set) {
  // All the set's variants: from the library when the set is a library's, since
  // the file may hold only the variants it uses.
  if (!set) return { list: [], from: "file" };
  if (set.remote && set.key && typeof figma.importComponentSetByKeyAsync === "function") {
    try {
      const full = await figma.importComponentSetByKeyAsync(set.key);
      return { list: full.children.filter((v) => v.type === "COMPONENT"), from: "library" };
    } catch (e) { /* the library is not available here: read what the file holds */ }
  }
  return { list: set.children.filter((v) => v.type === "COMPONENT"), from: "file" };
}

function focusVariantOf(main, variants) {
  // The variant that differs from the one in use only in a focus value.
  const used = main.variantProperties || {};
  const withFocus = variants.filter((v) => Object.values(v.variantProperties || {}).some((x) => FOCUS.test(x)));
  const exact = withFocus.find((v) => {
    const vp = v.variantProperties;
    const key = Object.keys(vp).find((k) => FOCUS.test(vp[k]));
    return Object.keys(used).every((k) => k === key || vp[k] === used[k]);
  });
  return exact || withFocus[0] || null;
}


async function section(block, title) {
  const row = stack(title, "HORIZONTAL", 48);
  block.appendChild(row);
  return row;
}

async function legend(row, title, th, note) {
  const col = stack(title, "VERTICAL", 12);
  row.appendChild(col);
  col.appendChild(await text(title, "title", th, null, SIZES.section));
  if (note) {
    const t = await text(note, "body", th);
    col.appendChild(t);
    t.layoutSizingHorizontal = "FIXED";
    t.resize(CARD_WIDTH, t.height);
    t.textAutoResize = "HEIGHT";
  }
  return col;
}

async function sample(parent, caption, node, main, variant, th, w) {
  // A captioned sample: the control with the screen's own content, or the bare
  // component when it cannot be copied, then swapped to the focus variant when
  // one is given. The copy leaves the screen first, and is removed if anything
  // after that fails, so nothing is ever left on the screen.
  const col = stack(caption, "VERTICAL", 8);
  parent.appendChild(col);
  col.appendChild(await text(caption, "strong", th, null, SIZES.small));
  let copy = null;
  try {
    try { copy = node.clone(); } catch (e) { copy = main.createInstance(); }
    col.appendChild(copy);
    // Out of its grid, a copy that filled its column shrinks: it keeps the original's size.
    try { copy.layoutSizingHorizontal = "FIXED"; copy.layoutSizingVertical = "FIXED"; } catch (e) { /* not in auto layout */ }
    const b = node.absoluteBoundingBox;
    if (b) copy.resize(Math.max(b.width, 1), Math.max(b.height, 1));
    if (variant && copy.type === "INSTANCE") copy.swapComponent(variant);
  } catch (e) {
    if (copy && !copy.removed) copy.remove();
    col.appendChild(await text(w.unreadable(e.message), "body", th, null, SIZES.small));
  }
}

async function focusStates(block, controls, w, th, platform) {
  // One row per component behind the controls: the control as it is, and in its focus variant.
  const groups = new Map();
  for (const c of controls) {
    let key = "none", info = null, problem = null;
    try { info = await componentOf(c.node); } catch (e) { problem = e.message; }
    if (info) key = (info.set || info.main).id;
    if (problem) key = "error:" + problem;
    if (!groups.has(key)) groups.set(key, { info, problem, controls: [] });
    groups.get(key).controls.push(c);
  }
  const col = stack(w.states, "VERTICAL", 24);
  block.appendChild(col);
  col.appendChild(await text(w.states, "title", th, null, SIZES.section));
  if (platform === "app") col.appendChild(await text(w.appNote, "body", th));
  const out = [];
  for (const g of groups.values()) {
    const row = stack("row", "VERTICAL", 8);
    col.appendChild(row);
    const names = g.controls.map((c) => c.label + " · " + c.element);
    row.appendChild(await text(names.join("   "), "strong", th));
    if (g.problem) {
      row.appendChild(await text(w.unreadable(g.problem), "body", th));
      out.push({ controls: names, focus: "unreadable" });
      continue;
    }
    if (!g.info) {
      const around = [...new Set(g.controls.map((c) => {
        for (let n = c.node.parent; n && n.type !== "PAGE"; n = n.parent) if (n.type === "INSTANCE") return n.name.trim();
        return null;
      }).filter(Boolean))];
      row.appendChild(await text(w.notInstance + (around.length ? " " + w.inside(around) : ""), "body", th));
      out.push({ controls: names, focus: "not an instance", inside: around });
      continue;
    }
    const name = (g.info.set || g.info.main).name.trim();
    const variants = await variantsOf(g.info.set);
    const focus = focusVariantOf(g.info.main, variants.list);
    row.appendChild(await text(w.component(name, g.info.parents) + " · " + w.variantsRead(variants.list.length, variants.from), "body", th, null, SIZES.small));
    const pair = stack("pair", "HORIZONTAL", 32);
    row.appendChild(pair);
    const node = g.controls[0].node;
    await sample(pair, w.onScreen, node, g.info.main, null, th, w);
    if (focus) {
      await sample(pair, w.focusVariant + " · " + focus.name, node, g.info.main, focus, th, w);
    } else {
      pair.appendChild(await text(w.noFocus, "body", th));
    }
    out.push({ controls: names, component: name, inside: g.info.parents, variants: variants.list.length, from: variants.from, focus: focus ? focus.name : null });
  }
  return out;
}


async function handoff(screens, options) {
  const o = options || {};
  const w = words(o.lang);
  const profile = PROFILES[o.profile] ? o.profile : "Standard";
  const floors = PROFILES[profile];
  const app = o.platform === "app";
  if (!Array.isArray(screens) || !screens.length) throw new Error("handoff.js: pass the screens, such as [{ screen: \"123:456\" }]");
  const started = Date.now();
  await figma.loadFontAsync(REGULAR);
  await figma.loadFontAsync(BOLD);
  let page = figma.root.children.find((p) => p.name === w.page);
  if (!page) { page = figma.createPage(); page.name = w.page; }
  if (typeof page.loadAsync === "function") await page.loadAsync();
  const date = new Date().toISOString().slice(0, 10);
  const out = [];

  for (const entry of screens) {
    const t0 = Date.now();
    const id = norm(entry.screen);
    const screen = await figma.getNodeByIdAsync(id);
    if (!screen) { out.push({ screen: id, error: "screen not found" }); continue; }
    if (!SCREENS.includes(screen.type)) { out.push({ screen: id, error: "a " + screen.type + " is not a screen: pass the frames inside it" }); continue; }
    const W = screen.absoluteBoundingBox.width, H = screen.absoluteBoundingBox.height;

    const refused = [];
    const resolve = async (list, read) => {
      const ok = [];
      for (const it of list || []) {
        const p = read ? parse(it.text) : { element: String(it.text || "").trim(), lines: [], n: it.n };
        if (p.problem) { refused.push({ id: it.id, reason: p.problem }); continue; }
        const node = await figma.getNodeByIdAsync(norm(it.id));
        const why = problemWith(node, screen);
        if (why) { refused.push({ id: it.id, reason: why }); continue; }
        ok.push(Object.assign(p, { id: node.id, node, box: boxIn(node, screen) }));
      }
      return ok;
    };
    const given = Array.isArray(entry.reading) && entry.reading.length > 0;
    const stops = (await resolve(given ? entry.reading : fromAnnotations(screen), true)).sort((a, b) => a.from - b.from);
    const controls = await resolve(entry.focus, false);
    if (!stops.length) {
      out.push({ screen: id, error: "no reading to draw: pass reading, or annotate the reading first", refused });
      continue;
    }
    // In an app each control keeps the number of its reading stop; on the web, its Tab order.
    // A control the reading does not reach gets "?", and the result says so: either n is
    // missing or the control was left out of the reading.
    const unread = [];
    controls.forEach((c, i) => {
      if (!app) { c.label = String(i + 1); return; }
      const own = stops.find((s) => s.id === c.id) || stops.find((s) => isWithin(c.node, s.node)) || stops.find((s) => isWithin(s.node, c.node));
      c.label = c.n != null ? String(c.n) : own ? own.label : "?";
      if (c.label === "?") unread.push({ id: c.id, reason: "a control outside the reading: pass n, or add it to the reading" });
    });

    const th = await themeOf(screen);

    // Replace this screen's block in place, keeping the cards a person decided.
    const old = page.children.find((c) => c.getSharedPluginData("da11y", "screen") === screen.id);
    const decided = decidedCards(old);
    const bottom = page.children.reduce((m, c) => (c === old ? m : Math.max(m, c.y + c.height)), 0);
    const x = old ? old.x : 0;
    const y = old ? old.y : (page.children.length ? bottom + 200 : 0);
    if (old) old.remove();

    const label = String(entry.title || screen.name).trim();
    const block = stack(w.title + " · " + label, "VERTICAL", 48);
    block.paddingLeft = block.paddingRight = block.paddingTop = block.paddingBottom = 48;
    block.setSharedPluginData("da11y", "screen", screen.id);
    block.setSharedPluginData("da11y", "tool", TOOL);
    page.appendChild(block);
    block.x = x;
    block.y = y;
    await matchModes(block, screen, th.notes);
    block.fills = [paint(th.paper)];
    const head = stack("head", "VERTICAL", 8);
    block.appendChild(head);
    head.appendChild(await text(w.title + " · " + label, "title", th));
    head.appendChild(await text(w.generated(screen.id, date, profile, screen.type !== "FRAME"), "body", th));

    // 1. Reading order.
    const reading = await section(block, w.reading);
    await draw(view(reading, screen, w.reading), stops, false, W, H, th);
    const rl = await legend(reading, w.reading, th);
    let kept = 0;
    for (const s of stops) {
      const lines = decided[s.id] || s.lines;
      if (decided[s.id]) { kept++; delete decided[s.id]; }
      rl.appendChild(await card(s.label, s.element, lines, false, s.id, th));
    }
    const orphans = Object.keys(decided);
    if (orphans.length) {
      rl.appendChild(await text(w.orphans, "strong", th));
      for (const k of orphans) rl.appendChild(await card("✓", "", decided[k], false, k, th));
    }

    // 2. Controls and touch areas, measured on the original nodes.
    const touch = [];
    let states = [];
    if (controls.length) {
      const title = app ? w.controlsApp : w.controlsWeb;
      const tab = await section(block, title);
      const tv = view(tab, screen, title);
      for (const c of controls) {
        if (c.box.w >= floors.target && c.box.h >= floors.target) continue;
        const f = floors.target;
        rect(tv, { x: GUTTER + c.box.x + c.box.w / 2 - f / 2, y: GUTTER + c.box.y + c.box.h / 2 - f / 2, w: f, h: f }, INK, "INSIDE", true);
      }
      await draw(tv, controls, true, W, H, th);
      const tl = await legend(tab, title, th, app ? w.appControls : null);
      for (const c of controls) {
        const meets = c.box.w >= floors.target && c.box.h >= floors.target;
        const house = c.box.w >= floors.advised && c.box.h >= floors.advised;
        // The 8 between neighbors applies when either target is below the A11Y.md rule's size, as in
        // A11Y.md, where it comes with dense UIs and targets smaller than 44: list rows may touch.
        const small = (b) => b.w < floors.advised || b.h < floors.advised;
        const others = controls.filter((d) => d !== c);
        const gap = others.length ? Math.min(...others.map((d) => distance(c.box, d.box))) : null;
        const tight = others.filter((d) => (small(c.box) || small(d.box)) && distance(c.box, d.box) < HOUSE_GAP);
        const tightGap = tight.length ? Math.min(...tight.map((d) => distance(c.box, d.box))) : null;
        const lines = [w.area(num(c.box.w, w), num(c.box.h, w)), w.floor(floors.target, meets), w.house(floors.advised, house)];
        if (gap !== null) lines.push(w.gap(num(gap, w)));
        if (tightGap !== null) lines.push(w.tight(num(tightGap, w), HOUSE_GAP, floors.advised));
        tl.appendChild(await card(c.label, c.element, lines, true, null, th));
        touch.push({ id: c.id, label: c.label, w: c.box.w, h: c.box.h, floor: floors.target, meets, houseRule: house, gap, spacing: tightGap === null ? "meets" : "below" });
      }

      // 3. Focus states.
      states = await focusStates(block, controls, w, th, o.platform);
    }

    out.push({
      screen: id, name: screen.name, block: block.id, replaced: !!old, fromAnnotations: !given,
      stops: stops.length, controls: controls.length, keptDecided: kept, decidedLeftReading: orphans,
      theme: {
        title: th.title.name || "Inter Bold", strong: th.strong.name || "Inter Bold", body: th.body.name || "Inter Regular",
        text: th.ink.name || "ink", background: th.paper.name || "paper", ratio: th.ratio || null, notes: th.notes,
      },
      touch, states, refused, outsideReading: unread, ignored: entry.notRead ? "notRead: what is not read is not drawn" : undefined,
      ms: Date.now() - t0,
    });
  }
  return { page: page.id, pageName: page.name, tool: TOOL, profile, platform: app ? "app" : "web", screens: out, ms: Date.now() - started };
}

