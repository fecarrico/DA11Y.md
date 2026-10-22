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
    descriptions: "Descrições sugeridas",
    descriptionsNote: "O agente sugere e não grava. Quem cuida do design system insere cada texto onde o card indica, e a próxima leitura passa a tratá-lo como decisão prévia.",
    whereLabel: { set: "Conjunto", component: "Componente", guidelines: "Guidelines" },
    where: { set: (n) => "Na descrição do conjunto " + n + ", porque vale para todas as variantes.", component: (n) => "Na descrição do componente " + n + ", porque vale só para esta variante.", guidelines: (n) => "Nas guidelines de acessibilidade da biblioteca" + (n ? ", a partir de " + n : "") + ", porque vale para mais de um componente." },
    fromLibrary: "Vem da biblioteca: a descrição é editada no arquivo dela, por quem cuida dele.",
    fromFile: "Componente deste arquivo.",
    orphanDescriptions: "Cards com ✓ que saíram das sugestões novas",
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
    descriptions: "Suggested descriptions",
    descriptionsNote: "The agent suggests and does not write. Whoever maintains the design system adds each text where the card says, and the next reading treats it as a prior decision.",
    whereLabel: { set: "Set", component: "Component", guidelines: "Guidelines" },
    where: { set: (n) => "In the description of the set " + n + ", because it holds for every variant.", component: (n) => "In the description of the component " + n + ", because it holds for this variant only.", guidelines: (n) => "In the library's accessibility guidelines" + (n ? ", starting from " + n : "") + ", because it holds for more than one component." },
    fromLibrary: "From the library: the description is edited in its file, by whoever maintains it.",
    fromFile: "A component of this file.",
    orphanDescriptions: "Cards with a ✓ that left the new suggestions",
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
const TOOL = "DA11Y.md 0.2.0";
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

