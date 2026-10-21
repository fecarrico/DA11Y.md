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

"use strict";

const WORDS = {
  "pt-BR": {
    page: "DA11Y — handoff",
    title: "Handoff de acessibilidade",
    reading: "Ordem de leitura",
    controlsApp: "Controles e áreas de toque",
    controlsWeb: "Ordem do Tab e áreas de toque",
    states: "Estados de foco",
    generated: (id, date, profile, part) => "Gerado pelo DA11Y.md a partir " + (part ? "do componente " : "da tela ") + id + ", em " + date + ", no perfil " + profile + ". Cada card é proposta até receber ✓ com o nome de quem decidiu.",
    appControls: "No app, o foco do teclado externo e do controle por acionador segue a ordem de leitura. Cada controle leva o número da sua parada.",
    area: (w, h) => "Área: " + w + " × " + h,
    floor: (f, ok) => "Mínimo do perfil (" + f + " × " + f + "): " + (ok ? "atende" : "abaixo, confira as exceções do critério"),
    house: (a, ok) => "Regra do A11Y.md (" + a + " × " + a + "): " + (ok ? "atende" : "abaixo, é achado e não falha de WCAG"),
    gap: (g) => "Vizinho mais próximo: " + g,
    tight: (t, h, a) => "Espaço entre alvos (regra do A11Y.md, " + h + " quando um dos dois é menor que " + a + " × " + a + "): abaixo, " + t,
    onScreen: "Na tela",
    focusVariant: "Foco",
    component: (name, parents) => "componente " + name + (parents.length ? ", dentro de " + parents.join(", ") : ""),
    variantsRead: (n, from) => n + " variantes lidas " + (from === "library" ? "da biblioteca" : "do arquivo"),
    noFocus: "Sem variante de foco na biblioteca.",
    notInstance: "Não é instância de componente: o estado de foco precisa ser desenhado.",
    inside: (list) => "Fica dentro de " + list.join(", ") + ".",
    unreadable: (m) => "Não deu para ler o componente: " + m,
    appNote: "Em app, onde falta a variante, o controle usa o foco do sistema ou o estado precisa ser desenhado.",
    orphans: "Cards com ✓ que saíram da leitura nova",
    orphanFindings: "Cards com ✓ que saíram da análise nova",
    evaluated: "O que foi avaliado",
    groups: { fix: "Corrigir aqui", library: "Erros do design system", proposal: "Perguntas abertas" },
    componentOf: (name) => "componente " + name,
    findingsColumn: "Achados",
    decimal: ",",
  },
  en: {
    page: "DA11Y — handoff",
    title: "Accessibility handoff",
    reading: "Reading order",
    controlsApp: "Controls and touch areas",
    controlsWeb: "Tab order and touch areas",
    states: "Focus states",
    generated: (id, date, profile, part) => "Drawn by DA11Y.md from " + (part ? "component " : "screen ") + id + ", on " + date + ", on the " + profile + " profile. Each card is a proposal until it gets a ✓ with the name of who decided.",
    appControls: "In an app, the focus of an external keyboard or a switch follows the reading order. Each control keeps the number of its stop.",
    area: (w, h) => "Area: " + w + " × " + h,
    floor: (f, ok) => "Profile minimum (" + f + " × " + f + "): " + (ok ? "meets" : "below, check the criterion's exceptions"),
    house: (a, ok) => "A11Y.md rule (" + a + " × " + a + "): " + (ok ? "meets" : "below, a finding and not a WCAG failure"),
    gap: (g) => "Nearest neighbor: " + g,
    tight: (t, h, a) => "Space between targets (A11Y.md rule, " + h + " when either is smaller than " + a + " × " + a + "): below, " + t,
    onScreen: "On the screen",
    focusVariant: "Focus",
    component: (name, parents) => "component " + name + (parents.length ? ", inside " + parents.join(", ") : ""),
    variantsRead: (n, from) => n + " variants read from the " + (from === "library" ? "library" : "file"),
    noFocus: "No focus variant in the library.",
    notInstance: "Not a component instance: the focus state has to be drawn.",
    inside: (list) => "It sits inside " + list.join(", ") + ".",
    unreadable: (m) => "Could not read the component: " + m,
    appNote: "In an app, where the variant is missing, the control uses the system focus or the state has to be drawn.",
    orphans: "Cards with a ✓ that left the new reading",
    orphanFindings: "Cards with a ✓ that left the new analysis",
    evaluated: "What was evaluated",
    groups: { fix: "Fix here", library: "Design system errors", proposal: "Open questions" },
    componentOf: (name) => "component " + name,
    findingsColumn: "Findings",
    decimal: ".",
  },
};
// The same numbers as measure.js.
const PROFILES = {
  Shield: { target: 44, advised: 48 },
  Standard: { target: 24, advised: 44 },
  Launchpad: { target: 24, advised: 44 },
};
const HOUSE_GAP = 8;
const TEXT_FLOOR = 4.5;
const INK = { r: 0.078, g: 0.078, b: 0.078 };
const WHITE = { r: 1, g: 1, b: 1 };
const REGULAR = { family: "Inter", style: "Regular" };
const BOLD = { family: "Inter", style: "Bold" };
const SIZES = { title: 24, section: 18, strong: 14, body: 14, small: 12, marker: 13 };
const GUTTER = 72;
const MARKER = 28;
const CARD_WIDTH = 380;
const ORDER = /^(\d+)(?:\s*[–-]\s*(\d+))?\s*·\s*(.*)$/;
const READ = /^(\d+\)\s*)?🔊/u;
const DECIDED = /^✓/u;
const FOCUS = /foc/i;
const HEAVY = /bold|semi|demi|medium|black|heavy/i;
const SCREENS = ["FRAME", "COMPONENT", "INSTANCE"];
const REPORT_PAGES = { "pt-BR": "DA11Y — relatórios", en: "DA11Y — reports" };
// Written on every block it draws, so a block can be told from one an agent drew by hand.
const TOOL = "DA11Y.md 0.1.0";
const GALLERY_HEIGHT = 480;
const REPORT_WIDTH = 960;
const MONO = { family: "Roboto Mono", style: "Regular" };

const words = (lang) => WORDS[lang] || WORDS["pt-BR"];
const norm = (id) => String(id).trim().replace(/-/g, ":");
const markerWidth = (label) => MARKER + 8 * (label.length - 1);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function num(n, w) {
  return String(Math.round(n * 10) / 10).replace(".", w.decimal);
}

// Contrast, as in measure.js.
function channel(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance(rgb) {
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}
function ratio(fg, bg) {
  const a = luminance(fg), b = luminance(bg);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return Math.floor(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}


function nearestSide(b, W, H) {
  // The copy's edge closest to the element; ties go left, as in the Specs anatomy.
  const d = { left: b.x, right: W - (b.x + b.w), top: b.y, bottom: H - (b.y + b.h) };
  return Object.keys(d).reduce((a, k) => (d[k] < d[a] ? k : a), "left");
}

function layoutMarkers(items, W, H) {
  // Positions for each marker in the gutter around the copy, never overlapping,
  // and the point where its line meets the element. Copy coordinates start at GUTTER.
  const out = [];
  const bySide = { left: [], right: [], top: [], bottom: [] };
  for (const it of items) bySide[nearestSide(it.box, W, H)].push(it);
  for (const s of ["left", "right"]) {
    let next = -Infinity;
    for (const it of bySide[s].sort((a, b) => a.box.y + a.box.h / 2 - (b.box.y + b.box.h / 2))) {
      const mw = markerWidth(it.label);
      const y = Math.max(GUTTER + it.box.y + it.box.h / 2 - MARKER / 2, next);
      next = y + MARKER + 6;
      const cy = y + MARKER / 2;
      const x = s === "left" ? GUTTER - 20 - mw : GUTTER + W + 20;
      const ty = clamp(cy, GUTTER + it.box.y + 2, GUTTER + it.box.y + it.box.h - 2);
      const from = s === "left" ? [x + mw, cy] : [x, cy];
      const to = s === "left" ? [GUTTER + it.box.x, ty] : [GUTTER + it.box.x + it.box.w, ty];
      out.push({ it, x, y, w: mw, from, to });
    }
  }
  for (const s of ["top", "bottom"]) {
    let next = -Infinity;
    for (const it of bySide[s].sort((a, b) => a.box.x + a.box.w / 2 - (b.box.x + b.box.w / 2))) {
      const mw = markerWidth(it.label);
      const x = Math.max(GUTTER + it.box.x + it.box.w / 2 - mw / 2, next);
      next = x + mw + 6;
      const cx = x + mw / 2;
      const y = s === "top" ? GUTTER - 20 - MARKER : GUTTER + H + 20;
      const tx = clamp(cx, GUTTER + it.box.x + 2, GUTTER + it.box.x + it.box.w - 2);
      const from = s === "top" ? [cx, y + MARKER] : [cx, y];
      const to = s === "top" ? [tx, GUTTER + it.box.y] : [tx, GUTTER + it.box.y + it.box.h];
      out.push({ it, x, y, w: mw, from, to });
    }
  }
  return out;
}


// ---------- Figma reads ----------


function problemWith(node, screen) {
  if (!node) return "node not found";
  let inside = false;
  for (let n = node; n && n.type !== "PAGE"; n = n.parent) {
    if (n.visible === false) return "hidden layer: only what is visible is drawn";
    if (n.id === screen.id) inside = true;
  }
  if (!inside) return "not on this screen";
  if (!node.absoluteBoundingBox) return "the node has no box to draw";
  return null;
}

function boxIn(node, screen) {
  // The node's box in the copy's own coordinates.
  const b = node.absoluteBoundingBox, s = screen.absoluteBoundingBox;
  return { x: b.x - s.x, y: b.y - s.y, w: b.width, h: b.height };
}

function isWithin(node, ancestor) {
  for (let n = node; n; n = n.parent) if (n.id === ancestor.id) return true;
  return false;
}


async function colorOf(paint, consumer) {
  // A solid paint's color and, when bound, its variable, resolved for the node that uses it.
  const id = paint.boundVariables && paint.boundVariables.color && paint.boundVariables.color.id;
  if (id) {
    const variable = await figma.variables.getVariableByIdAsync(id);
    if (variable) {
      const v = variable.resolveForConsumer(consumer).value;
      if (v && typeof v.r === "number") return { rgb: { r: v.r, g: v.g, b: v.b }, variable, name: variable.name };
    }
  }
  return { rgb: paint.color, variable: null, name: null };
}

async function themeOf(screen) {
  // The screen's own design system, as far as it can be read and measured.
  const theme = {
    title: { font: BOLD }, strong: { font: BOLD }, body: { font: REGULAR },
    ink: { rgb: INK, variable: null, name: null }, paper: { rgb: WHITE, variable: null, name: null },
    notes: [],
  };
  const texts = screen.findAll((n) => n.type === "TEXT" && n.visible !== false).slice(0, 400);
  const styles = new Map();
  const inks = new Map();
  for (const n of texts) {
    const sid = n.textStyleId;
    if (typeof sid === "string" && sid) styles.set(sid, (styles.get(sid) || 0) + 1);
    const p = Array.isArray(n.fills) ? n.fills.find((f) => f.type === "SOLID" && f.visible !== false) : null;
    if (p) {
      const key = (p.boundVariables && p.boundVariables.color && p.boundVariables.color.id) || JSON.stringify(p.color);
      const e = inks.get(key) || { count: 0, paint: p, node: n };
      e.count++;
      inks.set(key, e);
    }
  }

  // Text styles: the largest is the title, the most used regular one is body, and strong is
  // the most used heavy one, other than the title, at least as large as the body.
  const found = [];
  for (const [id, count] of styles) {
    try {
      const s = await figma.getStyleByIdAsync(id);
      if (s && s.type === "TEXT") found.push({ id, count, style: s });
    } catch (e) { /* unreadable style: skipped */ }
  }
  if (found.length) {
    const byCount = (a, b) => b.count - a.count;
    const title = found.slice().sort((a, b) => b.style.fontSize - a.style.fontSize)[0];
    const body = found.filter((f) => f !== title && !HEAVY.test(f.style.fontName.style)).sort(byCount)[0]
      || found.filter((f) => f !== title).sort(byCount)[0] || title;
    // A heavy style smaller than the body is a tag or a caption, not a heading.
    const heavy = found.filter((f) => f !== body && f !== title && HEAVY.test(f.style.fontName.style) && f.style.fontSize >= body.style.fontSize).sort(byCount)[0] || title;
    for (const [role, f] of [["title", title], ["strong", heavy], ["body", body]]) {
      try {
        await figma.loadFontAsync(f.style.fontName);
        theme[role] = { font: f.style.fontName, style: f.style, name: f.style.name };
      } catch (e) {
        theme.notes.push(role + ": the font of " + f.style.name + " did not load, Inter instead");
      }
    }
  } else {
    theme.notes.push("no text style on the screen: Inter");
  }

  // Colors: of the screen's text colors, the one with the most contrast on the screen's own
  // background, which is the primary text; the most used one is often the secondary.
  try {
    const bg = Array.isArray(screen.fills) ? screen.fills.find((f) => f.type === "SOLID" && f.visible !== false) : null;
    const candidates = [...inks.values()].sort((a, b) => b.count - a.count).slice(0, 8);
    if (candidates.length && bg) {
      const paper = await colorOf(bg, screen);
      let ink = null, r = 0;
      for (const c of candidates) {
        const k = await colorOf(c.paint, c.node);
        const kr = ratio(k.rgb, paper.rgb);
        if (kr > r) { ink = k; r = kr; }
      }
      if (r >= TEXT_FLOOR) { theme.ink = ink; theme.paper = paper; theme.ratio = r; }
      else theme.notes.push("the screen's text and background measure " + r + ":1, below " + TEXT_FLOOR + ": ink and paper instead");
    } else {
      theme.notes.push("no solid text color or background on the screen: ink and paper");
    }
  } catch (e) {
    theme.notes.push("colors unreadable (" + e.message + "): ink and paper");
  }
  return theme;
}

// ---------- Figma writes ----------

function paint(color) {
  const p = { type: "SOLID", color: color.rgb };
  if (!color.variable) return p;
  try { return figma.variables.setBoundVariableForPaint(p, "color", color.variable); } catch (e) { return p; }
}

async function text(chars, role, th, color, size) {
  const t = figma.createText();
  const r = th[role];
  t.fontName = r.font;
  t.characters = chars;
  if (r.style && !size && r.style.fontSize >= SIZES[role]) {
    try { await t.setTextStyleIdAsync(r.style.id); } catch (e) { t.fontSize = SIZES[role]; }
  } else {
    t.fontSize = size || SIZES[role];
  }
  t.fills = [paint(color || th.ink)];
  return t;
}

async function wrapped(parent, chars, role, th) {
  const t = await text(chars, role, th);
  parent.appendChild(t);
  t.layoutSizingHorizontal = "FILL";
  t.textAutoResize = "HEIGHT";
  return t;
}

function stack(name, direction, gap) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.itemSpacing = gap;
  f.fills = [];
  return f;
}

function rect(parent, b, color, align, dashed) {
  const r = figma.createRectangle();
  parent.appendChild(r);
  r.x = b.x;
  r.y = b.y;
  r.resize(Math.max(b.w, 1), Math.max(b.h, 1));
  r.fills = [];
  r.strokes = [{ type: "SOLID", color }];
  r.strokeWeight = 2;
  r.strokeAlign = align;
  if (dashed) r.dashPattern = [6, 4];
  return r;
}

function outline(parent, b, dashed) {
  // Ink inside and white outside, so the outline shows on any screen, whatever its design system.
  rect(parent, b, WHITE, "OUTSIDE", false);
  rect(parent, b, INK, "INSIDE", dashed);
}

function line(parent, from, to) {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  if (len < 1) return;
  const c = (to[0] - from[0]) / len, s = (to[1] - from[1]) / len;
  for (const [color, weight] of [[WHITE, 4], [INK, 1.5]]) {
    const l = figma.createLine();
    parent.appendChild(l);
    l.resize(len, 0);
    l.relativeTransform = [[c, -s, from[0]], [s, c, from[1]]];
    l.strokes = [{ type: "SOLID", color }];
    l.strokeWeight = weight;
  }
}

async function marker(label, square, th) {
  const f = figma.createFrame();
  f.name = label;
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "FIXED";
  f.counterAxisSizingMode = "FIXED";
  f.resize(markerWidth(label), MARKER);
  f.primaryAxisAlignItems = "CENTER";
  f.counterAxisAlignItems = "CENTER";
  f.cornerRadius = square ? 4 : MARKER / 2;
  f.fills = [paint(th.ink)];
  f.strokes = [{ type: "SOLID", color: WHITE }];
  f.strokeWeight = 2;
  f.strokeAlign = "OUTSIDE";
  f.appendChild(await text(label, "strong", th, th.paper, SIZES.marker));
  return f;
}

async function card(label, title, lines, square, stop, th) {
  const c = figma.createFrame();
  c.name = title ? label + " · " + title : label;
  c.layoutMode = "VERTICAL";
  c.counterAxisSizingMode = "FIXED";
  c.resize(CARD_WIDTH, 40);
  c.primaryAxisSizingMode = "AUTO";
  c.paddingLeft = c.paddingRight = c.paddingTop = c.paddingBottom = 12;
  c.itemSpacing = 6;
  c.cornerRadius = 8;
  c.fills = [paint(th.paper)];
  c.strokes = [paint(th.ink)];
  c.strokeWeight = 1;
  if (stop) c.setSharedPluginData("da11y", "stop", stop);
  const head = stack("head", "HORIZONTAL", 8);
  c.appendChild(head);
  head.layoutSizingHorizontal = "FILL";
  head.appendChild(await marker(label, square, th));
  if (title) await wrapped(head, title, "strong", th);
  for (const l of lines) await wrapped(c, l, "body", th);
  return c;
}

function view(row, screen, name) {
  // The copy, in a frame with a gutter around it for the markers.
  const s = screen.absoluteBoundingBox;
  const v = figma.createFrame();
  v.name = name;
  v.fills = [];
  v.clipsContent = false;
  v.resize(s.width + 2 * GUTTER, s.height + 2 * GUTTER);
  row.appendChild(v);
  const copy = screen.type === "COMPONENT" ? screen.createInstance() : screen.clone();
  v.appendChild(copy);
  copy.x = GUTTER;
  copy.y = GUTTER;
  try { if ("devStatus" in copy && copy.devStatus) copy.devStatus = null; } catch (e) { /* the copy is not a screen to build */ }
  return v;
}

async function draw(v, items, square, W, H, th) {
  // Outlines, then lines, then markers on top.
  const at = (b) => ({ x: b.x + GUTTER, y: b.y + GUTTER, w: b.w, h: b.h });
  for (const it of items) outline(v, at(it.box), false);
  const placed = layoutMarkers(items, W, H);
  for (const p of placed) line(v, p.from, p.to);
  for (const p of placed) {
    const m = await marker(p.it.label, square, th);
    v.appendChild(m);
    m.x = p.x;
    m.y = p.y;
  }
}


async function matchModes(block, screen, notes) {
  // The block takes the screen's variable modes, so the copies and the bound colors look as on the screen.
  const modes = screen.resolvedVariableModes || {};
  for (const id of Object.keys(modes)) {
    try {
      const collection = await figma.variables.getVariableCollectionByIdAsync(id);
      if (collection) block.setExplicitVariableModeForCollection(collection, modes[id]);
    } catch (e) {
      notes.push("mode of collection " + id + " not set: " + e.message);
    }
  }
}

function defaultTheme() {
  return {
    title: { font: BOLD }, strong: { font: BOLD }, body: { font: REGULAR },
    ink: { rgb: INK, variable: null, name: null }, paper: { rgb: WHITE, variable: null, name: null }, notes: [],
  };
}

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

if (typeof module !== "undefined") {
  module.exports = { handoff, parse, distance, nearestSide, layoutMarkers, ratio, focusVariantOf, PROFILES, HOUSE_GAP, WORDS };
}
