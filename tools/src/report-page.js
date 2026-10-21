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

