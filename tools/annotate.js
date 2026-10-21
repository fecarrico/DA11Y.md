// DA11Y.md — annotate.js
//
// Writes and reads back the annotations of DA11Y.md Section 5 through the
// Figma Plugin API, so the part that has broken in the field is code and not
// memory: writing `annotations` replaces the whole list, a missing category
// has to be created, and the frame's counts have to match what is on it.
//
// Where it runs: the Figma agent's code execution, a plugin, the console. It
// writes annotations, and the report on its own page. It never changes the
// design, and it never touches an annotation a person wrote or decided.
//
//   return await annotate(items, { screens: ["123:456"], status: "CONDICIONAL",
//     mode: "evaluation", profile: "Standard (AA)", platform: "app",
//     versions: "DA11Y.md 0.1.0 · A11Y.md 2.4.0+", lang: "pt-BR" });
//   // in a separate execution:
//   return await reread(["123:456"], { lang: "pt-BR" });
//   // the full report, on the page "DA11Y — relatórios" / "DA11Y — reports":
//   return await report(markdown, { title: "Login", lang: "pt-BR" });
//
// items: [{ id, text, pin }]. `text` is in the short format of Section 5, and
// its first line says which category it goes to:
//   "4 · card", "2–3 · abas", "❓ …"                  → Proposta / Proposal
//   "🟠 HIGH · Aqui: …" / "🟠 HIGH · Here: …"         → Corrigir aqui / Fix here
//   "🔴 CRITICAL · Biblioteca: …" / "… · Library: …"  → Erro do design system / Design system error
// A reading annotation with more than one stop takes a range and numbers each
// 🔊 line, one stop per line: "4–8 · status", then "4) 🔊 …" to "8) 🔊 …".
// A 🔊 line is `🔊 "what is read"` for plain text, or `🔊 <role> "what is
// read"` with the role from the closed list in LANG (on the web, a heading may
// carry its level: `🔊 heading H2 "Orders"`). Any other role word is refused.
// Repeated stops that follow one mold fit on one line: `🔊 cada linha: "…"`,
// `🔊 in each row, button "Edit"`.
// The canvas shows only what is read: a 🔊 list is closed, and what sits inside
// the element without a 🔊 line is not read. 🔇 lines are refused. What is not
// read goes to the report, and options.notRead (a number, or one per screen id)
// puts its count in the frame annotation.
// The reading goes to the handoff page, drawn by handoff.js (DA11Y.md Sections 4
// and 5). Here it goes to the canvas only for a tool that cannot draw that page,
// and only when the request asks for it, and `mode` says which request it was: "evaluation" refuses a
// reading annotation (the reading goes to the report as a draft) and the frame
// says "Leituras — não anotadas"; "reading" annotates it and the frame counts
// "Leituras a confirmar". "Perguntas abertas" counts the annotations with a ❓
// still open, in both modes. A Proposta annotation is the agent's proposal
// until the person adds "✓ <name>".
// An error annotation is one finding: its second line, when there is one,
// continues the first and never starts another severity.
// Only visible nodes are annotated: a hidden node, or one under a hidden
// ancestor, is refused.
// The severity is never color alone: the circle comes with its name from
// Section 1 (🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM, 🔵 LOW), and the two must agree.
// `pin` lists properties whose live value the annotation shows, such as
// ["fills"]. The frame annotation is written here, from the counts, so the
// two can never disagree. Its last line carries the profile, the platform and
// the versions. Before 2026-10-17 the category was named "Decisão sua" / "Your
// decision"; that category stays in the file, empty, and the person may delete it.
//
// A new evaluation replaces the agent's own annotations on the evaluated
// screens: the short format without a "✓ <name>" line, the frame annotation,
// and the long format used before 2026-10-16. Anything else belongs to people.
// report() writes the full report as a TEXT on the page named in LANG, one
// per evaluated set, named by the set: a new evaluation of the same set
// updates that TEXT instead of adding another.
// The findings are numbered once, here, and drawn on the report page by
// reportPage() in report.js. The canvas keeps only the frame annotation and the
// "Corrigir aqui" / "Fix here" annotations, each with its number ("· achado 3"),
// since those are what the person fixes in this file. Design system errors and
// open questions go to the report page only; the frame still counts them, and
// the screen keeps their count (shared plugin data "da11y" / "page") so
// reread() can check the frame. The order: fixes by severity, then design
// system errors by component and severity, then questions. The result's
// `findings` is the numbered list to pass to reportPage. onPage: false keeps
// every annotation on the canvas, as before the report page.
// Standard library only; no dependencies.

"use strict";

const LANG = {
  "pt-BR": {
    categories: { frame: "Accessibility", proposal: "Proposta", fix: "Corrigir aqui", library: "Erro do design system" },
    fix: "Aqui", library: "Biblioteca",
    counts: { questions: "Perguntas abertas", reading: "Leituras a confirmar", fix: "Corrigir aqui", library: "Erros do design system", notRead: "Não lidos" },
    notAnnotated: "Leituras — não anotadas",
    nothing: "Nada a fazer nesta tela",
    report: "Relatório completo na página DA11Y — relatórios",
    page: "DA11Y — relatórios",
    roles: ["botão", "link", "título", "campo", "combobox", "caixa de seleção", "opção", "interruptor", "controle deslizante", "aba", "menu", "diálogo", "diálogo modal", "lista", "tabela", "árvore", "grupo", "navegação", "imagem", "mapa"],
    mold: "cada|em cada",
    finding: (n) => "achado " + n,
  },
  en: {
    categories: { frame: "Accessibility", proposal: "Proposal", fix: "Fix here", library: "Design system error" },
    fix: "Here", library: "Library",
    counts: { questions: "Open questions", reading: "Readings to confirm", fix: "Fix here", library: "Design system errors", notRead: "Not read" },
    notAnnotated: "Readings — not annotated",
    nothing: "Nothing to do on this screen",
    report: "Full report on the page DA11Y — reports",
    page: "DA11Y — reports",
    roles: ["button", "link", "heading", "field", "combobox", "checkbox", "radio", "switch", "slider", "tab", "menu", "dialog", "modal dialog", "list", "table", "tree", "group", "navigation", "image", "map"],
    mold: "each|in each",
    finding: (n) => "finding " + n,
  },
};
const COLORS = { frame: "pink", proposal: "blue", fix: "orange", library: "violet" };
const MODES = ["evaluation", "reading"];
const SEVERITY = "(?:🔴|🟠|🟡|🔵)";
const LEVELS = { "🔴": "CRITICAL", "🟠": "HIGH", "🟡": "MEDIUM", "🔵": "LOW" };
const LABELED = "(?:🔴|🟠|🟡|🔵)\\s*(?:CRITICAL|HIGH|MEDIUM|LOW)\\s*·\\s*";
// The short format before the severity label (2026-10-16): still the agent's, so it gets replaced.
const UNLABELED = new RegExp("^" + SEVERITY + "\\s*(Aqui|Here|Biblioteca|Library):", "u");
const MAX_FINDING_LINES = 2;
const MAX_LINE = 160;
const LEGACY = /^\**(Decisão sua · proposta do agente|Corrigir aqui|Erro do design system|Your decision · agent proposal|Fix here|Design system error)\**\s*$/;
const READ = /^(\d+\)\s*)?🔊/u;
const ORDER = /^(\d+)(?:\s*[–-]\s*(\d+))?\s*·/;
const REPORT_WIDTH = 720;
const REPORT_FONT = { family: "Inter", style: "Regular" };

// ---------- pure functions ----------

function lines(text) {
  return String(text || "").trim().split("\n").map((l) => l.trim()).filter((l) => l.length);
}

function words(lang) {
  const w = LANG[lang || "pt-BR"];
  if (!w) throw new Error("annotate.js: lang must be pt-BR or en");
  return w;
}

function kind(text) {
  // "proposal", "fix", "library", or null for anything outside the format
  const first = lines(text)[0] || "";
  if (new RegExp("^" + LABELED + "(Aqui|Here):", "u").test(first)) return "fix";
  if (new RegExp("^" + LABELED + "(Biblioteca|Library):", "u").test(first)) return "library";
  if (/^\d+(\s*[–-]\s*\d+)?\s*·\s*\S/.test(first) || /^❓/u.test(first)) return "proposal";
  return null;
}

function marks(text) {
  // A reading annotation starts with its order; a question is any ❓ line.
  const all = lines(text);
  return { reading: ORDER.test(all[0] || ""), question: all.some((l) => /^❓/u.test(l)) };
}

function decided(text) {
  return lines(text).some((l) => /^✓\s*\S/u.test(l));
}

function isFrame(text) {
  const all = lines(text);
  return all.length > 1 && /DA11Y\.md \S+ · A11Y\.md \S+$/.test(all[all.length - 1]);
}

function isAgents(text) {
  // What a new evaluation may replace. A decided annotation never is.
  if (decided(text)) return false;
  const first = lines(text)[0] || "";
  return kind(text) !== null || isFrame(text) || LEGACY.test(first) || UNLABELED.test(first);
}

function severityMismatch(text) {
  // "🟠 CRITICAL · …" names one level and colors another.
  const m = new RegExp("^(" + SEVERITY + ")\\s*(CRITICAL|HIGH|MEDIUM|LOW)", "u").exec(lines(text)[0] || "");
  return m && LEVELS[m[1]] !== m[2] ? m[1] + " is " + LEVELS[m[1]] + ", not " + m[2] : null;
}

function orderProblem(text) {
  // A reading annotation: "4 · card" with one 🔊 line at most, or "4–8 · x"
  // with one 🔊 line per stop, numbered 4) to 8) in order. A 🔊 line is one
  // stop, or one mold of repeated stops ("each row").
  const all = lines(text);
  const m = ORDER.exec(all[0] || "");
  if (!m) return null;
  const a = Number(m[1]), b = m[2] ? Number(m[2]) : a;
  if (b < a) return "the order range runs backwards";
  const reads = all.slice(1).filter((l) => READ.test(l));
  if (a === b) {
    if (reads.length > 1) {
      return "one order number and " + reads.length + " 🔊 lines: one stop per 🔊 line, so the first line needs a range, " + a + "–" + (a + reads.length - 1);
    }
    const n = reads.length ? /^(\d+)\)/.exec(reads[0]) : null;
    return n && Number(n[1]) !== a ? "the 🔊 line's number differs from the first line's" : null;
  }
  if (reads.length !== b - a + 1) {
    return "the range " + a + "–" + b + " has " + (b - a + 1) + " stops and there are " + reads.length + " 🔊 lines: one stop per 🔊 line";
  }
  for (let i = 0; i < reads.length; i++) {
    const n = /^(\d+)\)\s*🔊/u.exec(reads[i]);
    if (!n || Number(n[1]) !== a + i) return "with more than one stop, each 🔊 line starts with its number, " + a + ") to " + b + "), in order";
  }
  return null;
}

function roleProblem(text, w) {
  // `🔊 "what is read"`, or `🔊 <role> "what is read"` with the role from the
  // closed list, and on the web a heading may carry its level (H1 to H6). A
  // mold of repeated stops starts with `cada …:` / `each …:` or `em cada …,` /
  // `in each …,` before the role.
  const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const roles = w.roles.slice().sort((x, y) => y.length - x.length).map(escape).join("|");
  const mold = "(?:(?:" + w.mold + ")\\s+[^:,\"“]+[:,]\\s+)?";
  const ok = new RegExp("^(?:\\d+\\)\\s*)?🔊\\s+" + mold + "(?:(?:" + roles + ")(?:\\s+H[1-6])?\\s+)?[\"“]", "u");
  for (const l of lines(text)) {
    if (READ.test(l) && !ok.test(l)) {
      return "a 🔊 line is 🔊 \"what is read\", or 🔊 <role> \"what is read\" with the role from the list: " + w.roles.join(", ");
    }
  }
  return null;
}

function severityRank(text) {
  const m = new RegExp("^" + SEVERITY + "\\s*(CRITICAL|HIGH|MEDIUM|LOW)", "u").exec(lines(text)[0] || "");
  return m ? ["CRITICAL", "HIGH", "MEDIUM", "LOW"].indexOf(m[1]) : 9;
}

function numberFindings(plan) {
  // Fixes by severity, then design system errors by component and severity, then
  // questions, each group in the order given when the rest ties. Numbered from 1.
  const at = (p) => plan.indexOf(p);
  const fix = plan.filter((p) => p.kind === "fix").sort((a, b) => severityRank(a.text) - severityRank(b.text) || at(a) - at(b));
  const lib = plan.filter((p) => p.kind === "library").sort((a, b) =>
    String(a.component || "").localeCompare(String(b.component || "")) || severityRank(a.text) - severityRank(b.text) || at(a) - at(b));
  const ask = plan.filter((p) => p.kind === "proposal" && marks(p.text).question && !marks(p.text).reading);
  return [...fix, ...lib, ...ask].map((p, i) => Object.assign(p, { n: i + 1 }));
}

function hidden(node) {
  // Only what is visible is evaluated: the node and every ancestor.
  for (let n = node; n && n.type !== "PAGE"; n = n.parent) if (n.visible === false) return true;
  return false;
}

function check(item, lang) {
  // Returns the reason an item is refused, or null.
  const w = words(lang || item.lang);
  const k = kind(item.text);
  if (!k && UNLABELED.test(lines(item.text)[0] || "")) {
    return "the severity needs its name, not only its color: 🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM or 🔵 LOW, then ·";
  }
  if (!k) return "first line outside the Section 5 format";
  const mismatch = severityMismatch(item.text);
  if (mismatch) return "the severity's color and name disagree: " + mismatch;
  const order = orderProblem(item.text);
  if (order) return order;
  const role = roleProblem(item.text, w);
  if (role) return role;
  const all = lines(item.text);
  if (k === "fix" || k === "library") {
    if (all.length > MAX_FINDING_LINES) return "more than " + MAX_FINDING_LINES + " lines: the measurement and the caveats go to the report";
    if (all.slice(1).some((l) => new RegExp("^" + SEVERITY, "u").test(l))) {
      return "one finding per annotation: the second line continues the first and never starts another severity";
    }
  }
  const long = all.find((l) => l.length > MAX_LINE);
  if (long) return "line over " + MAX_LINE + " characters: the measurement and the caveats go to the report";
  if (decided(item.text)) return "a ✓ line is written by a person, never by the agent";
  if (all.some((l) => /^(\d+\)\s*)?🔇/u.test(l))) {
    return "no 🔇 lines: the canvas shows only what is read, and what is not read goes to the report (DA11Y.md Section 5)";
  }
  return null;
}

function frameText(status, counts, footer, w, mode) {
  // In evaluation mode the reading was not annotated, and the frame says so
  // instead of counting zero readings to confirm.
  const notRead = counts.notRead || 0;
  const reading = counts.reading || 0;
  const readingLine = mode === "evaluation" ? w.notAnnotated : w.counts.reading + " — " + reading;
  const body = counts.questions + reading + counts.fix + counts.library + notRead === 0
    ? (mode === "evaluation" ? w.nothing + "\n" + readingLine : w.nothing)
    : [w.counts.questions + " — " + counts.questions,
       readingLine,
       w.counts.fix + " — " + counts.fix,
       w.counts.library + " — " + counts.library,
       w.counts.notRead + " — " + notRead].join("\n");
  return ["**" + status + "**", body, w.report, footer].join("\n\n");
}

function count(texts) {
  // Pending only: a decided annotation counts nowhere. One annotation can be a
  // reading and carry a ❓ at once, and then it counts in both.
  const c = { questions: 0, reading: 0, fix: 0, library: 0 };
  for (const t of texts) {
    const k = kind(t);
    if (!k || decided(t)) continue;
    if (k !== "proposal") { c[k] += 1; continue; }
    const m = marks(t);
    if (m.question) c.questions += 1;
    if (m.reading) c.reading += 1;
  }
  return c;
}

function frameCounts(text, w) {
  // `reading` is null when the frame says the reading was not annotated.
  if (!text) return null;
  const read = (label) => {
    const m = new RegExp(label + "\\s*—\\s*(\\d+)").exec(text);
    return m ? Number(m[1]) : null;
  };
  const notAnnotated = text.includes(w.notAnnotated);
  if (text.includes(w.nothing)) return { questions: 0, reading: notAnnotated ? null : 0, fix: 0, library: 0, notRead: 0 };
  return { questions: read(w.counts.questions), reading: notAnnotated ? null : read(w.counts.reading), fix: read(w.counts.fix), library: read(w.counts.library), notRead: read(w.counts.notRead) || 0 };
}

// ---------- Figma reads and writes ----------

const textOf = (a) => a.labelMarkdown || a.label || "";

async function nodeOf(id) {
  return figma.getNodeByIdAsync(String(id).trim().replace(/-/g, ":"));
}

function annotatable(node) {
  // The node itself, or the nearest ancestor that accepts annotations.
  let n = node;
  while (n && n.type !== "PAGE" && !("annotations" in n)) n = n.parent;
  return n && n.type !== "PAGE" ? n : null;
}

function screenOf(node, screenIds) {
  for (let n = node; n && n.type !== "PAGE"; n = n.parent) if (screenIds.has(n.id)) return n.id;
  return null;
}

async function componentName(node) {
  // The component a library finding belongs to: the instance's set, or the nearest instance around the node.
  for (let n = node; n && n.type !== "PAGE"; n = n.parent) {
    if (n.type !== "INSTANCE") continue;
    try {
      const main = await n.getMainComponentAsync();
      if (main) return (main.parent && main.parent.type === "COMPONENT_SET" ? main.parent.name : main.name).trim();
    } catch (e) { /* read below by the instance's name */ }
    return n.name.trim();
  }
  return node.name.trim();
}

function withAnnotations(screen) {
  return [screen, ...screen.findAll((x) => "annotations" in x && x.annotations.length > 0)];
}

async function categories(w) {
  const existing = await figma.annotations.getAnnotationCategoriesAsync();
  const ids = {}, missing = [];
  for (const key of Object.keys(COLORS)) {
    const label = w.categories[key];
    const found = existing.find((c) => c.label === label);
    if (found) { ids[key] = found.id; continue; }
    try { ids[key] = (await figma.annotations.addAnnotationCategoryAsync({ label, color: COLORS[key] })).id; }
    catch (e) { missing.push(label); }
  }
  if (!ids.frame) throw new Error("annotate.js: the Accessibility category is missing and could not be created");
  for (const key of ["proposal", "fix", "library"]) if (!ids[key]) ids[key] = ids.frame;
  return { ids, missing };
}

async function annotate(items, options) {
  const o = options || {};
  const w = words(o.lang);
  if (!o.versions) throw new Error("annotate.js: pass versions, such as \"DA11Y.md 0.1.0 · A11Y.md 2.4.0+\"");
  if (!o.profile) throw new Error("annotate.js: pass profile, such as \"Standard (AA)\" (DA11Y.md Section 0.1)");
  if (!o.platform) throw new Error("annotate.js: pass platform: web, app, iOS or Android (DA11Y.md Section 0.1)");
  if (!MODES.includes(o.mode)) throw new Error("annotate.js: pass mode: \"evaluation\" when the request is to evaluate, analyze or review, \"reading\" when it is to annotate the reading or to deliver a designed screen (DA11Y.md Section 4)");
  const footer = [o.profile, o.platform, o.versions].join(" · ");
  const onPage = o.onPage !== false;
  const screens = [];
  for (const id of o.screens || []) {
    const s = await nodeOf(id);
    if (!s) throw new Error("annotate.js: screen not found: " + id);
    if (!("annotations" in s)) throw new Error("annotate.js: " + s.name + " is a " + s.type + " and takes no annotation. Evaluate the frames inside it");
    screens.push(s);
  }
  if (!screens.length) throw new Error("annotate.js: pass the evaluated screens by id");
  const screenIds = new Set(screens.map((s) => s.id));
  const statusOf = (id) => (typeof o.status === "object" && o.status ? o.status[id] : o.status) || "CONDICIONAL";
  // What the reading leaves out is listed in the report; the frame only counts it.
  const notReadOf = (id) => Number((typeof o.notRead === "object" && o.notRead ? o.notRead[id] : o.notRead) || 0);

  // Check everything before writing anything.
  const plan = [], refused = [], moved = [];
  for (const item of items || []) {
    const reason = check(item, o.lang);
    if (reason) { refused.push({ id: item.id, reason }); continue; }
    if (o.mode === "evaluation" && marks(item.text).reading) {
      refused.push({ id: item.id, reason: "evaluation mode: the reading goes to the report as a draft, not to the canvas; run with mode \"reading\" when the request is to annotate the reading (DA11Y.md Section 4)" });
      continue;
    }
    const node = await nodeOf(item.id);
    if (!node) { refused.push({ id: item.id, reason: "node not found, or hidden inside an instance" }); continue; }
    if (hidden(node)) { refused.push({ id: item.id, reason: "hidden layer: only what is visible is evaluated (DA11Y.md Section 2.1)" }); continue; }
    const target = annotatable(node);
    if (!target) { refused.push({ id: item.id, reason: "no layer here accepts annotations" }); continue; }
    if (target !== node) moved.push({ id: item.id, to: target.id, toName: target.name });
    const screen = screenOf(target, screenIds);
    if (!screen) { refused.push({ id: item.id, reason: "outside the evaluated screens" }); continue; }
    const k = kind(item.text);
    plan.push({ id: item.id, node: target, screen, text: item.text.trim(), pin: item.pin, kind: k, component: onPage && k === "library" ? await componentName(node) : null });
  }
  if (refused.length) return { written: 0, refused, moved, note: "Nothing was written. Fix the refused items and run again." };

  const { ids, missing } = await categories(w);

  // Remove the agent's own annotations, keep everyone else's.
  for (const s of screens) {
    for (const n of withAnnotations(s)) {
      const kept = n.annotations.filter((a) => !isAgents(textOf(a)));
      if (kept.length !== n.annotations.length) n.annotations = kept;
    }
  }

  // Everything is numbered, and only the fixes are written, with their number.
  const findings = onPage ? numberFindings(plan) : [];
  const written = onPage ? plan.filter((p) => p.kind === "fix" || marks(p.text).reading) : plan;
  const onPageOnly = onPage ? plan.filter((p) => !written.includes(p)) : [];

  // Write the new ones at the end of each node's list.
  for (const p of written) {
    const all = lines(p.text);
    if (onPage && p.kind === "fix") all[0] = all[0] + " · " + w.finding(p.n);
    const a = { labelMarkdown: all.join("\n"), categoryId: ids[p.kind] };
    if (Array.isArray(p.pin) && p.pin.length) a.properties = p.pin.map((type) => ({ type }));
    p.node.annotations = [...p.node.annotations, a];
  }

  // The frame annotation, from the counts.
  const result = [];
  for (const s of screens) {
    const counts = count(plan.filter((p) => p.screen === s.id).map((p) => p.text));
    counts.notRead = notReadOf(s.id);
    if (onPage) {
      const page = count(onPageOnly.filter((p) => p.screen === s.id).map((p) => p.text));
      s.setSharedPluginData("da11y", "page", JSON.stringify({ questions: page.questions, library: page.library }));
    } else {
      s.setSharedPluginData("da11y", "page", "");
    }
    const text = frameText(statusOf(s.id), counts, footer, w, o.mode);
    s.annotations = [...s.annotations, { labelMarkdown: text, categoryId: ids.frame }];
    result.push({ id: s.id, name: s.name, counts });
  }
  return {
    written: written.length, screens: result, moved, missingCategories: missing,
    findings: findings.map((p) => ({ n: p.n, id: p.id, kind: p.kind, component: p.component || undefined, text: p.text })),
  };
}

async function reread(screenIdList, options) {
  const w = words(options && options.lang);
  const out = [];
  for (const id of screenIdList || []) {
    const s = await nodeOf(id);
    if (!s) { out.push({ id, error: "not found" }); continue; }
    const texts = [];
    let frame = null;
    for (const n of withAnnotations(s)) {
      for (const a of n.annotations) {
        const t = textOf(a);
        if (n === s && isFrame(t)) frame = t; else texts.push(t);
      }
    }
    const counts = count(texts);
    // What onPage sent to the report page counts too: the frame states it, the canvas does not hold it.
    let page = {};
    try { page = JSON.parse(s.getSharedPluginData("da11y", "page") || "{}"); } catch (e) { page = {}; }
    counts.questions += page.questions || 0;
    counts.library += page.library || 0;
    const stated = frameCounts(frame, w);
    // A frame that says the reading was not annotated matches when no reading annotation is on the screen.
    const match = !!stated && ["questions", "fix", "library"].every((k) => stated[k] === counts[k])
      && (stated.reading === null ? counts.reading === 0 : stated.reading === counts.reading);
    out.push({ id: s.id, name: s.name, counts, frame: stated, match });
  }
  return out;
}

async function report(text, options) {
  // The full report, as a TEXT on the report page, one per evaluated set.
  const o = options || {};
  const w = words(o.lang);
  const body = String(text || "").trim();
  if (!body) throw new Error("annotate.js: pass the report text");
  if (!o.title) throw new Error("annotate.js: pass title, the evaluated set, such as \"Login\"");
  let page = figma.root.children.find((p) => p.name === w.page);
  if (!page) { page = figma.createPage(); page.name = w.page; }
  if (typeof page.loadAsync === "function") await page.loadAsync();
  await figma.loadFontAsync(REPORT_FONT);
  let node = page.children.find((c) => c.type === "TEXT" && c.name === o.title);
  const updated = !!node;
  if (!node) {
    node = figma.createText();
    node.name = o.title;
    node.fontName = REPORT_FONT;
    node.textAutoResize = "HEIGHT";
    const bottom = page.children.reduce((m, c) => Math.max(m, c.y + c.height), 0);
    node.x = 0;
    node.y = page.children.length ? bottom + 80 : 0;
    page.appendChild(node);
    node.resize(REPORT_WIDTH, node.height);
  }
  node.characters = body;
  return { page: page.id, node: node.id, title: o.title, updated };
}

if (typeof module !== "undefined") {
  module.exports = { annotate, reread, report, kind, marks, decided, isAgents, isFrame, check, orderProblem, roleProblem, hidden, frameText, count, frameCounts, numberFindings, severityRank, LANG, LEVELS };
}
