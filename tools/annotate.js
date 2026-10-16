// DA11Y.md — annotate.js
//
// Writes and reads back the annotations of DA11Y.md Section 5 through the
// Figma Plugin API, so the part that has broken in the field is code and not
// memory: writing `annotations` replaces the whole list, a missing category
// has to be created, and the frame's counts have to match what is on it.
//
// Where it runs: the Figma agent's code execution, a plugin, the console. It
// writes annotations only. It never changes the design, and it never touches
// an annotation a person wrote or decided.
//
//   return await annotate(items, { screens: ["7378:11896"], status: "CONDICIONAL",
//     versions: "DA11Y.md 0.1.0 · A11Y.md 2.3.0", lang: "pt-BR" });
//   // in a separate execution:
//   return await reread(["7378:11896"], { lang: "pt-BR" });
//
// items: [{ id, text, pin }]. `text` is in the short format of Section 5, and
// its first line says which category it goes to:
//   "4 · card", "2–3 · abas", "❓ …"                  → Decisão sua / Your decision
//   "🟠 HIGH · Aqui: …" / "🟠 HIGH · Here: …"         → Corrigir aqui / Fix here
//   "🔴 CRITICAL · Biblioteca: …" / "… · Library: …"  → Erro do design system / Design system error
// The severity is never color alone: the circle comes with its name from
// Section 1 (🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM, 🔵 LOW), and the two must agree.
// `pin` lists properties whose live value the annotation shows, such as
// ["fills"]. The frame annotation is written here, from the counts, so the
// two can never disagree.
//
// A new evaluation replaces the agent's own annotations on the evaluated
// screens: the short format without a "✓ <name>" line, the frame annotation,
// and the long format used before 2026-10-16. Anything else belongs to people.
// Standard library only; no dependencies.

"use strict";

const LANG = {
  "pt-BR": {
    categories: { frame: "Accessibility", decision: "Decisão sua", fix: "Corrigir aqui", library: "Erro do design system" },
    fix: "Aqui", library: "Biblioteca",
    counts: { decision: "Decisões suas", fix: "Corrigir aqui", library: "Erros do design system" },
    nothing: "Nada a fazer nesta tela",
    report: "Relatório completo no chat da avaliação",
  },
  en: {
    categories: { frame: "Accessibility", decision: "Your decision", fix: "Fix here", library: "Design system error" },
    fix: "Here", library: "Library",
    counts: { decision: "Your decisions", fix: "Fix here", library: "Design system errors" },
    nothing: "Nothing to do on this screen",
    report: "Full report in the evaluation chat",
  },
};
const COLORS = { frame: "pink", decision: "blue", fix: "orange", library: "violet" };
const SEVERITY = "(?:🔴|🟠|🟡|🔵)";
const LEVELS = { "🔴": "CRITICAL", "🟠": "HIGH", "🟡": "MEDIUM", "🔵": "LOW" };
const LABELED = "(?:🔴|🟠|🟡|🔵)\\s*(?:CRITICAL|HIGH|MEDIUM|LOW)\\s*·\\s*";
// The short format before the severity label (2026-10-16): still the agent's, so it gets replaced.
const UNLABELED = new RegExp("^" + SEVERITY + "\\s*(Aqui|Here|Biblioteca|Library):", "u");
const MAX_FINDING_LINES = 2;
const MAX_LINE = 160;
const LEGACY = /^\**(Decisão sua · proposta do agente|Corrigir aqui|Erro do design system|Your decision · agent proposal|Fix here|Design system error)\**\s*$/;

// ---------- pure functions ----------

function lines(text) {
  return String(text || "").trim().split("\n").map((l) => l.trim()).filter((l) => l.length);
}

function kind(text) {
  // "decision", "fix", "library", or null for anything outside the format
  const first = lines(text)[0] || "";
  if (new RegExp("^" + LABELED + "(Aqui|Here):", "u").test(first)) return "fix";
  if (new RegExp("^" + LABELED + "(Biblioteca|Library):", "u").test(first)) return "library";
  if (/^\d+(\s*[–-]\s*\d+)?\s*·\s*\S/.test(first) || /^❓/u.test(first)) return "decision";
  return null;
}

function decided(text) {
  return lines(text).some((l) => /^✓\s*\S/u.test(l));
}

function isFrame(text) {
  const all = lines(text);
  return all.length > 1 && /^DA11Y\.md /.test(all[all.length - 1]);
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

function check(item) {
  // Returns the reason an item is refused, or null.
  const k = kind(item.text);
  if (!k && UNLABELED.test(lines(item.text)[0] || "")) {
    return "the severity needs its name, not only its color: 🔴 CRITICAL, 🟠 HIGH, 🟡 MEDIUM or 🔵 LOW, then ·";
  }
  if (!k) return "first line outside the Section 5 format";
  const mismatch = severityMismatch(item.text);
  if (mismatch) return "the severity's color and name disagree: " + mismatch;
  const all = lines(item.text);
  if ((k === "fix" || k === "library") && all.length > MAX_FINDING_LINES) {
    return "more than " + MAX_FINDING_LINES + " lines: the measurement and the caveats go to the report";
  }
  const long = all.find((l) => l.length > MAX_LINE);
  if (long) return "line over " + MAX_LINE + " characters: the measurement and the caveats go to the report";
  if (decided(item.text)) return "a ✓ line is written by a person, never by the agent";
  return null;
}

function frameText(status, counts, versions, words) {
  const body = counts.decision + counts.fix + counts.library === 0
    ? words.nothing
    : [words.counts.decision + " — " + counts.decision,
       words.counts.fix + " — " + counts.fix,
       words.counts.library + " — " + counts.library].join("\n");
  return ["**" + status + "**", body, words.report, versions].join("\n\n");
}

function count(texts) {
  const c = { decision: 0, fix: 0, library: 0 };
  for (const t of texts) {
    const k = kind(t);
    if (k && !decided(t)) c[k] += 1;
  }
  return c;
}

function frameCounts(text, words) {
  if (!text) return null;
  if (text.includes(words.nothing)) return { decision: 0, fix: 0, library: 0 };
  const read = (label) => {
    const m = new RegExp(label + "\\s*—\\s*(\\d+)").exec(text);
    return m ? Number(m[1]) : null;
  };
  return { decision: read(words.counts.decision), fix: read(words.counts.fix), library: read(words.counts.library) };
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

function withAnnotations(screen) {
  return [screen, ...screen.findAll((x) => "annotations" in x && x.annotations.length > 0)];
}

async function categories(words) {
  const existing = await figma.annotations.getAnnotationCategoriesAsync();
  const ids = {}, missing = [];
  for (const key of Object.keys(COLORS)) {
    const label = words.categories[key];
    const found = existing.find((c) => c.label === label);
    if (found) { ids[key] = found.id; continue; }
    try { ids[key] = (await figma.annotations.addAnnotationCategoryAsync({ label, color: COLORS[key] })).id; }
    catch (e) { missing.push(label); }
  }
  if (!ids.frame) throw new Error("annotate.js: the Accessibility category is missing and could not be created");
  for (const key of ["decision", "fix", "library"]) if (!ids[key]) ids[key] = ids.frame;
  return { ids, missing };
}

async function annotate(items, options) {
  const o = options || {};
  const words = LANG[o.lang || "pt-BR"];
  if (!words) throw new Error("annotate.js: lang must be pt-BR or en");
  if (!o.versions) throw new Error("annotate.js: pass versions, such as \"DA11Y.md 0.1.0 · A11Y.md 2.3.0\"");
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

  // Check everything before writing anything.
  const plan = [], refused = [], moved = [];
  for (const item of items || []) {
    const reason = check(item);
    if (reason) { refused.push({ id: item.id, reason }); continue; }
    const node = await nodeOf(item.id);
    if (!node) { refused.push({ id: item.id, reason: "node not found" }); continue; }
    const target = annotatable(node);
    if (!target) { refused.push({ id: item.id, reason: "no layer here accepts annotations" }); continue; }
    if (target !== node) moved.push({ id: item.id, to: target.id, toName: target.name });
    const screen = screenOf(target, screenIds);
    if (!screen) { refused.push({ id: item.id, reason: "outside the evaluated screens" }); continue; }
    plan.push({ node: target, screen, text: item.text.trim(), pin: item.pin, kind: kind(item.text) });
  }
  if (refused.length) return { written: 0, refused, moved, note: "Nothing was written. Fix the refused items and run again." };

  const { ids, missing } = await categories(words);

  // Remove the agent's own annotations, keep everyone else's.
  for (const s of screens) {
    for (const n of withAnnotations(s)) {
      const kept = n.annotations.filter((a) => !isAgents(textOf(a)));
      if (kept.length !== n.annotations.length) n.annotations = kept;
    }
  }

  // Write the new ones at the end of each node's list.
  for (const p of plan) {
    const a = { labelMarkdown: p.text, categoryId: ids[p.kind] };
    if (Array.isArray(p.pin) && p.pin.length) a.properties = p.pin.map((type) => ({ type }));
    p.node.annotations = [...p.node.annotations, a];
  }

  // The frame annotation, from the counts.
  const result = [];
  for (const s of screens) {
    const counts = count(plan.filter((p) => p.screen === s.id).map((p) => p.text));
    const text = frameText(statusOf(s.id), counts, o.versions, words);
    s.annotations = [...s.annotations, { labelMarkdown: text, categoryId: ids.frame }];
    result.push({ id: s.id, name: s.name, counts });
  }
  return { written: plan.length, screens: result, moved, missingCategories: missing };
}

async function reread(screenIdList, options) {
  const words = LANG[(options && options.lang) || "pt-BR"];
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
    const stated = frameCounts(frame, words);
    const match = !!stated && stated.decision === counts.decision && stated.fix === counts.fix && stated.library === counts.library;
    out.push({ id: s.id, name: s.name, counts, frame: stated, match });
  }
  return out;
}

if (typeof module !== "undefined") {
  module.exports = { annotate, reread, kind, decided, isAgents, check, frameText, count, frameCounts, LANG, LEVELS };
}
