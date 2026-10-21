// DA11Y.md — report.js
//
// Draws the full report on the page "DA11Y — relatórios" / "DA11Y — reports":
// the Markdown the agent writes from templates/REPORT.md, with headings, the
// header block, tables as rows and columns, lists, bold, code and links, in
// the screen's design system. Figma shows Markdown as plain characters, so a
// report left as text reads as pipes and asterisks.
//
//   return await reportPage(markdown, { title: "Login", lang: "pt-BR", screens: ["123:456"], findings });
//
// screens: the evaluated screens or components (a section counts as its
// frames). They open the report, under its header, each with its name linked
// to the original, since one file may hold many reports. The first one gives
// the report its design system.
// findings: the numbered list annotate.js returns. A screen with findings is
// drawn at full size with each finding numbered on the edge, beside cards
// grouped as "Corrigir aqui", "Erros do design system" (by component) and
// "Perguntas abertas"; the numbers are annotate.js's, so they match the
// "Corrigir aqui" left on the canvas. A screen without findings is shown as a
// copy scaled to fit.
// A finding's card is the agent's until a person adds a line to it, such as
// "✓ <name>" or the answer to a ❓. A new run of the same set replaces the
// report in place and keeps every card a person decided as the person left
// it; a decided card whose finding left the new analysis is listed apart.
// The frame annotation of each evaluated screen gets its "full report" line
// linked to the drawn report. The link needs the file's key, read from Figma
// when it can be, and from fileUrl, the file's link, when it cannot.
// The Markdown stays on the block (shared plugin data "da11y" / "markdown"), so
// REPORT.md can be read back exactly, and the report replaces, in place, the
// plain TEXT annotate.js's report() writes for the same set.
//
// Where it runs: the Figma agent's code execution, a plugin, the console. It
// never changes the design: it only creates, and replaces, its own blocks on
// its own page, and links the frame annotations.
//
// Built by tools/build.py from tools/src/common.js and tools/src/report-page.js:
// edit those, then run `python3 tools/build.py`. Standard library only.

// ---------- the report ----------

// ---------- Markdown, the subset templates/REPORT.md uses ----------

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

function inline(md) {
  // Bold, code and links out of a line: the plain text and the ranges to style.
  const out = { plain: "", bold: [], code: [], links: [] };
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0, m;
  // A pipe escaped for a table ("\\|") is a plain pipe anywhere else.
  const src = String(md || "").replace(/\\\|/g, "|");
  while ((m = re.exec(src))) {
    out.plain += src.slice(last, m.index);
    const start = out.plain.length;
    const body = m[1] || m[2] || m[3];
    out.plain += body;
    if (m[1]) out.bold.push([start, out.plain.length]);
    else if (m[2]) out.code.push([start, out.plain.length]);
    else out.links.push([start, out.plain.length, m[4]]);
    last = re.lastIndex;
  }
  out.plain += src.slice(last);
  return out;
}

function cells(line) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").replace(/\\\|/g, "\u0000")
    .split("|").map((c) => c.replace(/\u0000/g, "|").trim());
}

function blocks(markdown) {
  // The report as blocks: headings, paragraphs, quotes, lists, tables and rules.
  const out = [];
  const lines = String(markdown || "").replace(/\r/g, "").split("\n");
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    const h = l.match(/^(#{1,3})\s+(.*)$/);
    if (!l.trim()) { i++; continue; }
    if (h) { out.push({ type: "h" + h[1].length, text: h[2].trim() }); i++; continue; }
    if (/^\s*-{3,}\s*$/.test(l)) { out.push({ type: "rule" }); i++; continue; }
    if (/^\s*\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        const r = cells(lines[i]);
        if (!r.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(r);
        i++;
      }
      out.push({ type: "table", rows });
      continue;
    }
    if (/^>\s?/.test(l)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push({ type: "quote", lines: q.filter((x) => x.trim()) });
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        const m = lines[i].match(/^\s*([-*]|\d+\.)\s+(.*)$/);
        items.push({ mark: /\d/.test(m[1]) ? m[1] : "•", text: m[2] });
        i++;
      }
      out.push({ type: "list", items });
      continue;
    }
    const p = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>|\s*\||\s*([-*]|\d+\.)\s|\s*-{3,}\s*$)/.test(lines[i])) { p.push(lines[i].trim()); i++; }
    out.push({ type: "p", text: p.join(" ") });
  }
  return out;
}

function columnWidths(rows, width) {
  // Each column is at least as wide as its longest word, so no word breaks in the middle
  // ("MED IUM"); what is left is shared by the column's content, capped, so a long column
  // does not starve the rest.
  const n = Math.max(...rows.map((r) => r.length));
  const longest = (c) => Math.max(0, ...rows.map((r) => Math.max(0, ...inline(r[c] || "").plain.split(/\s+/).map((x) => x.length))));
  const floor = Array.from({ length: n }, (_, c) => Math.max(56, Math.ceil(longest(c) * 8.2) + 20));
  const total = floor.reduce((a, b) => a + b, 0);
  if (total >= width) {
    const w = floor.map((x) => Math.floor((x * width) / total));
    w[w.length - 1] += width - w.reduce((a, b) => a + b, 0);
    return w;
  }
  const weight = Array.from({ length: n }, (_, c) => Math.min(40, Math.max(6, ...rows.map((r) => inline(r[c] || "").plain.length))));
  const sum = weight.reduce((a, b) => a + b, 0);
  const w = floor.map((x, c) => x + Math.floor(((width - total) * weight[c]) / sum));
  w[w.indexOf(Math.max(...w))] += width - w.reduce((a, b) => a + b, 0);
  return w;
}


async function rich(parent, md, role, th, extra) {
  // One text with its bold, code and link ranges; the Markdown marks themselves are not drawn.
  const r = inline(md);
  const t = await text(r.plain || " ", role, th, null, extra && extra.size);
  parent.appendChild(t);
  t.layoutSizingHorizontal = "FILL";
  t.textAutoResize = "HEIGHT";
  for (const [a, b] of r.bold) t.setRangeFontName(a, b, th.strong.font);
  if (extra && extra.mono) for (const [a, b] of r.code) t.setRangeFontName(a, b, extra.mono);
  for (const [a, b, url] of r.links) {
    if (/^https?:\/\//.test(url)) t.setRangeHyperlink(a, b, { type: "URL", value: url });
    t.setRangeTextDecoration(a, b, "UNDERLINE");
  }
  return t;
}

async function drawTable(parent, rows, th, mono) {
  const widths = columnWidths(rows, REPORT_WIDTH);
  const table = stack("table", "VERTICAL", 0);
  parent.appendChild(table);
  table.strokes = [paint(th.ink)];
  table.strokeWeight = 1;
  table.cornerRadius = 8;
  table.clipsContent = true;
  for (let r = 0; r < rows.length; r++) {
    const row = figma.createFrame();
    row.name = r === 0 ? "header" : "row " + r;
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisSizingMode = "FIXED";
    row.resize(REPORT_WIDTH, 10);
    row.counterAxisSizingMode = "AUTO";
    // The header row and the separators are ink at low opacity, never color alone: the header is also bold.
    row.fills = r === 0 ? [{ type: "SOLID", color: th.ink.rgb, opacity: 0.06 }] : [];
    if (r < rows.length - 1) {
      row.strokes = [{ type: "SOLID", color: th.ink.rgb, opacity: 0.25 }];
      row.strokeTopWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0; row.strokeBottomWeight = 1;
    }
    table.appendChild(row);
    for (let c = 0; c < widths.length; c++) {
      const cell = figma.createFrame();
      cell.name = "cell";
      cell.layoutMode = "VERTICAL";
      cell.counterAxisSizingMode = "FIXED";
      cell.resize(widths[c], 10);
      cell.primaryAxisSizingMode = "AUTO";
      cell.paddingLeft = cell.paddingRight = 10;
      cell.paddingTop = cell.paddingBottom = 8;
      cell.fills = [];
      row.appendChild(cell);
      await rich(cell, rows[r][c] || "", r === 0 ? "strong" : "body", th, { mono });
    }
  }
}

async function linkedName(parent, n, th, w) {
  const name = await text(n.name.trim() || n.id, "strong", th, null, SIZES.small);
  parent.appendChild(name);
  try {
    name.setRangeHyperlink(0, name.characters.length, { type: "NODE", value: n.id });
    name.setRangeTextDecoration(0, name.characters.length, "UNDERLINE");
  } catch (e) { /* the name stays as text */ }
  parent.appendChild(await text(n.id, "body", th, null, SIZES.small));
}

function findingKey(f) {
  // The node, the kind and the finding's first line: what a new run of the same analysis repeats.
  return f.id + "|" + f.kind + "|" + String(f.text).split("\n")[0].trim();
}

function decidedFindings(doc) {
  // The finding cards a person decided, by their key, with the lines as the person left them.
  const out = new Map();
  if (!doc) return out;
  for (const c of doc.findAll((n) => n.type === "FRAME" && n.getSharedPluginData("da11y", "finding") !== "")) {
    const lines = c.children.filter((t) => t.type === "TEXT").map((t) => t.characters).join("\n")
      .split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.some((l) => DECIDED.test(l))) out.set(c.getSharedPluginData("da11y", "finding"), { lines, title: c.name });
  }
  return out;
}

async function analysis(box, screen, items, th, w, decided, kept) {
  // One screen at full size with its findings numbered on the edge, and their cards grouped beside it.
  const head = stack(screen.name, "VERTICAL", 4);
  box.appendChild(head);
  await linkedName(head, screen, th, w);
  const row = stack(screen.name, "HORIZONTAL", 48);
  box.appendChild(row);
  const W = screen.absoluteBoundingBox.width, H = screen.absoluteBoundingBox.height;
  await draw(view(row, screen, screen.name), items, false, W, H, th);
  const col = stack(w.findingsColumn, "VERTICAL", 12);
  row.appendChild(col);
  for (const k of ["fix", "library", "proposal"]) {
    const group = items.filter((f) => f.kind === k);
    if (!group.length) continue;
    col.appendChild(await text(w.groups[k], "title", th, null, SIZES.section));
    for (const f of group) {
      const all = String(f.text).split("\n").map((l) => l.trim()).filter(Boolean);
      const key = findingKey(f);
      let more = all.slice(1);
      if (k === "library" && f.component) more.push(w.componentOf(f.component));
      if (decided.has(key)) { more = decided.get(key).lines; decided.delete(key); kept.push(key); }
      const c = await card(f.label, all[0], more, false, null, th);
      c.setSharedPluginData("da11y", "finding", key);
      col.appendChild(c);
    }
  }
}

async function gallery(doc, nodes, th, w, findings, decided, kept) {
  // What was evaluated: a screen with findings at full size with them numbered, every other
  // screen or component as a copy scaled to fit, each with its name linked to the original.
  const box = stack(w.evaluated, "VERTICAL", 12);
  doc.appendChild(box);
  box.layoutSizingHorizontal = "FILL";
  box.appendChild(await text(w.evaluated, "title", th, null, SIZES.section));
  const placed = new Map(), notPlaced = [];
  for (let i = 0; i < (findings || []).length; i++) {
    const f = findings[i];
    const node = await figma.getNodeByIdAsync(norm(f.id));
    const screen = node && nodes.find((s) => SCREENS.includes(s.type) && isWithin(node, s));
    if (!screen || !node.absoluteBoundingBox || problemWith(node, screen)) { notPlaced.push(f.id); continue; }
    if (!placed.has(screen)) placed.set(screen, []);
    placed.get(screen).push(Object.assign({}, f, { label: String(f.n || i + 1), box: boxIn(node, screen) }));
  }
  for (const [screen, items] of placed) await analysis(box, screen, items, th, w, decided, kept);
  if (decided.size) {
    // A card a person decided whose finding left the new analysis is never dropped.
    box.appendChild(await text(w.orphanFindings, "strong", th));
    for (const [key, d] of decided) {
      const c = await card("✓", "", d.lines, false, null, th);
      c.setSharedPluginData("da11y", "finding", key);
      box.appendChild(c);
    }
  }
  const rest = nodes.filter((n) => !placed.has(n));
  if (!rest.length) return { shown: [...placed.keys()].map((n) => ({ id: n.id, name: n.name.trim(), findings: placed.get(n).length })), notPlaced };
  const row = figma.createFrame();
  row.name = "copies";
  row.layoutMode = "HORIZONTAL";
  row.layoutWrap = "WRAP";
  row.primaryAxisSizingMode = "FIXED";
  row.resize(REPORT_WIDTH, 10);
  row.counterAxisSizingMode = "AUTO";
  row.itemSpacing = 24;
  row.counterAxisSpacing = 24;
  row.fills = [];
  box.appendChild(row);
  const shown = [];
  for (const n of rest) {
    const item = stack(n.name, "VERTICAL", 6);
    row.appendChild(item);
    let copy = null;
    try {
      // A component is shown by an instance: cloning it would make a new main component.
      if (n.type === "COMPONENT") copy = n.createInstance();
      else if (n.type === "COMPONENT_SET") copy = (n.defaultVariant || n.children[0]).createInstance();
      else copy = n.clone();
      item.appendChild(copy);
      try { if ("devStatus" in copy && copy.devStatus) copy.devStatus = null; } catch (e) { /* not a screen to build */ }
      const f = Math.min(1, GALLERY_HEIGHT / copy.height, REPORT_WIDTH / copy.width);
      if (f < 1) copy.rescale(f);
    } catch (e) {
      if (copy && !copy.removed) copy.remove();
      item.appendChild(await text(w.unreadable(e.message), "body", th, null, SIZES.small));
    }
    await linkedName(item, n, th, w);
    shown.push({ id: n.id, name: n.name.trim() });
  }
  return { shown: [...[...placed.keys()].map((n) => ({ id: n.id, name: n.name.trim(), findings: placed.get(n).length })), ...shown], notPlaced };
}

const REPORT_LINE = { "pt-BR": "Relatório completo na página DA11Y — relatórios", en: "Full report on the page DA11Y — reports" };

function fileKeyOf(o) {
  try { if (figma.fileKey) return figma.fileKey; } catch (e) { /* not available to this plugin */ }
  const m = /figma\.com\/(?:design|file|proto)\/([A-Za-z0-9]+)/.exec(String(o.fileUrl || ""));
  return m ? m[1] : null;
}

function linkFrames(nodes, block, lang, key) {
  // The "full report" line of each evaluated screen's frame annotation becomes a link to the drawn report.
  if (!key) return { linked: 0, note: "no file key: pass fileUrl, the file's link, to link the frame annotations" };
  const url = "https://www.figma.com/design/" + key + "?node-id=" + block.id.replace(/:/g, "-");
  const line = REPORT_LINE[lang];
  const escaped = line.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp("\\[?" + escaped + "\\]?(?:\\([^)]*\\))?");
  let linked = 0;
  for (const s of nodes) {
    if (!("annotations" in s) || !s.annotations.length) continue;
    let touched = false;
    const next = s.annotations.map((a) => {
      const t = a.labelMarkdown || a.label || "";
      const rows = t.trim().split("\n").filter((l) => l.trim());
      const isFrame = /DA11Y\.md \S+ · A11Y\.md \S+$/.test(rows[rows.length - 1] || "");
      if (!isFrame || !pattern.test(t)) return a;
      touched = true;
      const b = { labelMarkdown: t.replace(pattern, "[" + line + "](" + url + ")") };
      if (a.categoryId) b.categoryId = a.categoryId;
      if (a.properties && a.properties.length) b.properties = a.properties;
      return b;
    });
    if (touched) { s.annotations = next; linked++; }
  }
  return { linked, url };
}

async function reportPage(markdown, options) {
  // The full report, drawn: see the header of this file.
  const o = options || {};
  const lang = REPORT_PAGES[o.lang] ? o.lang : "pt-BR";
  const body = String(markdown || "").trim();
  if (!body) throw new Error("handoff.js: pass the report's Markdown");
  if (!o.title) throw new Error("handoff.js: pass title, the evaluated set, such as \"Login\"");
  const started = Date.now();
  await figma.loadFontAsync(REGULAR);
  await figma.loadFontAsync(BOLD);
  let mono = null;
  try { await figma.loadFontAsync(MONO); mono = MONO; } catch (e) { /* code stays in the body font */ }
  let th = defaultTheme();
  const evaluated = [];
  const missing = [];
  for (const id of [...new Set([].concat(o.screens || [], o.screen ? [o.screen] : []).map(norm))]) {
    const n = await figma.getNodeByIdAsync(id);
    if (!n) { missing.push(id); continue; }
    if (n.type === "SECTION") evaluated.push(...n.children.filter((c) => SCREENS.includes(c.type)).slice(0, 12));
    else if (SCREENS.includes(n.type) || n.type === "COMPONENT_SET") evaluated.push(n);
    else missing.push(id + " (" + n.type + ")");
  }
  const first = evaluated.find((n) => SCREENS.includes(n.type));
  if (first) th = await themeOf(first);
  if (missing.length) th.notes.push("not drawn: " + missing.join(", "));
  let page = figma.root.children.find((p) => p.name === REPORT_PAGES[lang]);
  if (!page) { page = figma.createPage(); page.name = REPORT_PAGES[lang]; }
  if (typeof page.loadAsync === "function") await page.loadAsync();

  // Replace this set's report in place, the plain TEXT of annotate.js included.
  const old = page.children.find((c) => c.name === o.title);
  const decided = decidedFindings(old && old.type === "FRAME" ? old : null);
  const decidedBefore = [...decided.keys()];
  const kept = [];
  const bottom = page.children.reduce((m, c) => (c === old ? m : Math.max(m, c.y + c.height)), 0);
  const x = old ? old.x : 0;
  const y = old ? old.y : (page.children.length ? bottom + 200 : 0);
  if (old) old.remove();

  const doc = stack(o.title, "VERTICAL", 16);
  doc.paddingLeft = doc.paddingRight = doc.paddingTop = doc.paddingBottom = 48;
  doc.counterAxisSizingMode = "FIXED";
  doc.resize(REPORT_WIDTH + 96, 100);
  doc.primaryAxisSizingMode = "AUTO";
  doc.setSharedPluginData("da11y", "markdown", body);
  doc.setSharedPluginData("da11y", "report", o.title);
  doc.setSharedPluginData("da11y", "tool", TOOL);
  page.appendChild(doc);
  doc.x = x;
  doc.y = y;
  if (first) await matchModes(doc, first, th.notes);
  doc.fills = [paint(th.paper)];

  // The copies of what was evaluated go right under the header block, or under the title.
  const list = blocks(body);
  const quote = list.findIndex((b) => b.type === "quote");
  const after = quote > -1 && quote < 3 ? quote : list.findIndex((b) => b.type === "h1");
  let shown = { shown: [], notPlaced: [] };
  if (evaluated.length && after === -1) shown = await gallery(doc, evaluated, th, words(lang), o.findings, decided, kept);
  const counts = {};
  for (let k = 0; k < list.length; k++) {
    const b = list[k];
    counts[b.type] = (counts[b.type] || 0) + 1;
    if (b.type === "h1") await rich(doc, b.text, "title", th, { size: SIZES.title });
    else if (b.type === "h2") {
      // appendChild returns nothing, so the spacer is made first and sized after.
      const space = figma.createFrame();
      space.name = "space";
      space.fills = [];
      doc.appendChild(space);
      space.resize(1, 8);
      await rich(doc, b.text, "title", th, { size: SIZES.section });
    }
    else if (b.type === "h3") await rich(doc, b.text, "strong", th, { size: 16 });
    else if (b.type === "p") await rich(doc, b.text, "body", th, { mono });
    else if (b.type === "rule") {
      const r = figma.createRectangle();
      doc.appendChild(r);
      r.resize(REPORT_WIDTH, 1);
      r.fills = [{ type: "SOLID", color: th.ink.rgb, opacity: 0.25 }];
    } else if (b.type === "quote") {
      const q = stack("header", "VERTICAL", 6);
      doc.appendChild(q);
      q.layoutSizingHorizontal = "FILL";
      q.paddingLeft = 16; q.paddingTop = q.paddingBottom = 12; q.paddingRight = 16;
      q.cornerRadius = 8;
      q.fills = [{ type: "SOLID", color: th.ink.rgb, opacity: 0.06 }];
      for (const line of b.lines) await rich(q, line, "body", th, { mono });
    } else if (b.type === "list") {
      const list = stack("list", "VERTICAL", 6);
      doc.appendChild(list);
      list.layoutSizingHorizontal = "FILL";
      for (const it of b.items) {
        const row = stack("item", "HORIZONTAL", 8);
        list.appendChild(row);
        row.layoutSizingHorizontal = "FILL";
        const mark = await text(it.mark, "body", th);
        row.appendChild(mark);
        await rich(row, it.text, "body", th, { mono });
      }
    } else if (b.type === "table") await drawTable(doc, b.rows, th, mono);
    if (k === after && evaluated.length) shown = await gallery(doc, evaluated, th, words(lang), o.findings, decided, kept);
  }
  const frames = linkFrames(evaluated.filter((n) => SCREENS.includes(n.type)), doc, lang, fileKeyOf(o));
  return {
    page: page.id, pageName: page.name, block: doc.id, replaced: !!old, blocks: counts, evaluated: shown.shown, findingsNotPlaced: shown.notPlaced, keptDecided: kept.length,
    decidedLeftAnalysis: decidedBefore.filter((k) => !kept.includes(k)), frames, tool: TOOL,
    theme: { strong: th.strong.name || "Inter Bold", body: th.body.name || "Inter Regular", text: th.ink.name || "ink", background: th.paper.name || "paper", notes: th.notes },
    mono: !!mono, ms: Date.now() - started,
  };
}

if (typeof module !== "undefined") {
  module.exports = { reportPage, blocks, inline, columnWidths, linkFrames, nearestSide, layoutMarkers, ratio, WORDS };
}
