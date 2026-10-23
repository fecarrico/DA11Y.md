// Tests for the Figma tools, on the document in memory of figma-mock.js.
// Each test starts a new document. Run: node tools/tests/run.js

"use strict";

const assert = require("assert");
const path = require("path");
const fs = require("fs");
const { setup } = require("./figma-mock");
const tools = path.join(__dirname, "..");
const annotateJs = require(path.join(tools, "annotate.js"));
const handoffJs = require(path.join(tools, "handoff.js"));
const reportJs = require(path.join(tools, "report.js"));
const measureJs = require(path.join(tools, "measure.js"));
const TEMPLATE = fs.readFileSync(path.join(tools, "..", "docs", "pt-BR", "templates", "REPORT.md"), "utf8");

// A login screen on a library: a card component whose set has a focus variant
// only in the library, a button with none, a header with an icon, two list rows
// touching and two small targets touching inside a bar.
function screen() {
  const doc = setup();
  const { add, page, styles, variables, librarySets } = doc;
  Object.assign(styles, {
    "S:title": { id: "S:title", type: "TEXT", name: "Title", fontName: { family: "Brand Sans", style: "Bold" }, fontSize: 24 },
    "S:strong": { id: "S:strong", type: "TEXT", name: "Body/Strong", fontName: { family: "Brand Sans", style: "SemiBold" }, fontSize: 15 },
    "S:body": { id: "S:body", type: "TEXT", name: "Body", fontName: { family: "Brand Sans", style: "Regular" }, fontSize: 15 },
    "S:tag": { id: "S:tag", type: "TEXT", name: "Tag", fontName: { family: "Brand Sans", style: "Bold" }, fontSize: 11 },
  });
  const v = (id, name, c) => ({ id, name, resolveForConsumer: () => ({ value: { r: c, g: c, b: c, a: 1 } }) });
  Object.assign(variables, { "V:text": v("V:text", "text/primary", 0.1), "V:gray": v("V:gray", "text/secondary", 0.45), "V:bg": v("V:bg", "surface", 0.97) });
  const lib = add(page.parent, { type: "PAGE", id: "0:2", name: "Library" });
  const cardSet = add(lib, { id: "50:1", type: "COMPONENT_SET", name: "Card", remote: true, key: "k-card", description: "Área de toque: o card inteiro." });
  const cardDefault = add(cardSet, { id: "50:2", type: "COMPONENT", name: "State=Default", variantProperties: { State: "Default" } });
  const fullCard = new doc.Node("COMPONENT_SET", { id: "60:1", name: "Card" });
  add(fullCard, { id: "60:2", type: "COMPONENT", name: "State=Default", variantProperties: { State: "Default" } });
  add(fullCard, { id: "60:3", type: "COMPONENT", name: "State=Focused", variantProperties: { State: "Focused" } });
  librarySets["k-card"] = fullCard;
  const btnSet = add(lib, { id: "51:1", type: "COMPONENT_SET", name: "Button", remote: true, key: "k-btn" });
  const btnDefault = add(btnSet, { id: "51:2", type: "COMPONENT", name: "State=Default", variantProperties: { State: "Default" }, description: "Botão secundário." });
  const iconMain = add(lib, { id: "52:1", type: "COMPONENT", name: "Icon/Back" });
  const fill = (id) => [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 }, boundVariables: { color: { type: "VARIABLE_ALIAS", id } } }];
  const s = add(page, { id: "10:1", name: "Login", x: 500, y: 300, width: 375, height: 812, fills: fill("V:bg"), resolvedVariableModes: { "C:color": "m:light" } });
  const header = add(s, { id: "10:2", type: "INSTANCE", name: "Header", x: 0, y: 40, width: 375, height: 56 });
  add(header, { id: "I10:2;1:1", type: "INSTANCE", name: "Back", x: 16, y: 16, width: 24, height: 24, _main: iconMain });
  add(header, { id: "I10:2;1:2", type: "TEXT", x: 120, y: 18, width: 135, height: 20, textStyleId: "S:title", fills: fill("V:text") });
  const card = add(s, { id: "10:3", type: "INSTANCE", name: "Card", x: 16, y: 120, width: 343, height: 76, _main: cardDefault });
  add(card, { id: "I10:3;2:1", type: "TEXT", x: 16, y: 16, width: 200, height: 20, textStyleId: "S:strong", fills: fill("V:text") });
  add(card, { id: "I10:3;2:2", type: "TEXT", x: 16, y: 40, width: 200, height: 20, textStyleId: "S:body", fills: fill("V:gray") });
  add(card, { id: "I10:3;2:3", type: "INSTANCE", name: "Edit", x: 270, y: 21, width: 60, height: 34, _main: btnDefault, _noClone: true });
  for (let i = 0; i < 6; i++) add(s, { id: "10:7" + i, type: "TEXT", x: 16, y: 300 + i * 12, width: 30, height: 10, textStyleId: "S:tag", fills: fill("V:gray") });
  [0, 1].forEach((i) => add(s, { id: "10:8" + i, x: 16, y: 560 + i * 56, width: 343, height: 56 }));
  const bar = add(s, { id: "10:9", type: "INSTANCE", name: "Tab bar", x: 0, y: 740, width: 375, height: 60, _main: cardDefault });
  add(bar, { id: "I10:9;1:1", x: 20, y: 20, width: 20, height: 20 });
  add(bar, { id: "I10:9;1:2", x: 40, y: 20, width: 20, height: 20 });
  add(s, { id: "10:99", x: 0, y: 0, width: 10, height: 10, visible: false });
  return Object.assign(doc, { s, card });
}

const reading = [
  { id: "I10:2;1:1", text: "1 · voltar\n🔊 botão \"Voltar\"" },
  { id: "I10:2;1:2", text: "2 · título\n🔊 título \"Entrar\"" },
  { id: "10:3", text: "3–4 · cartão\n3) 🔊 \"Cartão final 1234\"\n4) 🔊 botão \"Editar cartão\"" },
];
const focus = [
  { id: "I10:2;1:1", text: "botão \"Voltar\"" },
  { id: "10:3", text: "cartão" },
  { id: "I10:3;2:3", text: "botão \"Editar cartão\"", n: 4 },
  { id: "10:80", text: "botão \"Linha A\"" }, { id: "10:81", text: "botão \"Linha B\"" },
  { id: "I10:9;1:1", text: "aba \"A\"", n: 9 }, { id: "I10:9;1:2", text: "aba \"B\"", n: 9 },
];
const findingsIn = [
  { id: "I10:3;2:3", text: "🟡 MEDIUM · Aqui: o botão Editar está na variante errada" },
  { id: "10:3", text: "🟠 HIGH · Aqui: borda do cartão com a cor trocada" },
  { id: "I10:2;1:2", text: "🟠 HIGH · Biblioteca: o título do Header fica numa caixa fixa" },
  { id: "I10:3;2:2", text: "🟡 MEDIUM · Biblioteca: a descrição do Card fica numa caixa fixa" },
  { id: "10:3", text: "❓ O cartão inteiro é tocável, ou só o Editar? Proposta: só o Editar." },
];
const evaluation = { screens: ["10:1"], mode: "evaluation", profile: "Standard (AA)", platform: "app", versions: "DA11Y.md 0.2.0 · A11Y.md 2.5.0", lang: "pt-BR" };
const canvasOf = (s) => [s, ...s.findAll(() => true)].flatMap((n) => (n.annotations || []).map((a) => (a.labelMarkdown || "").split("\n")[0]));

const tests = {
  async "annotate numbers the findings and leaves only the fixes on the canvas"() {
    const d = screen();
    d.card.annotations = [{ labelMarkdown: "🟡 MEDIUM · Biblioteca: uma anotação antiga do agente" }];
    const r = await annotateJs.annotate(findingsIn, evaluation);
    assert.deepStrictEqual(r.findings.map((f) => f.n + " " + f.kind), ["1 fix", "2 fix", "3 library", "4 library", "5 proposal"]);
    assert.ok(r.findings[0].text.startsWith("🟠 HIGH · Aqui"), "fixes come by severity");
    assert.deepStrictEqual(r.findings.slice(2, 4).map((f) => f.component), ["Card", "Header"], "design system errors come by component");
    const canvas = canvasOf(d.s);
    assert.strictEqual(canvas.length, 3, "the frame and the two fixes: " + JSON.stringify(canvas));
    assert.ok(canvas.some((t) => t.endsWith("· achado 1")) && canvas.some((t) => t.endsWith("· achado 2")));
    const rr = await annotateJs.reread(["10:1"], { lang: "pt-BR" });
    assert.ok(rr[0].match, "reread counts what went to the page: " + JSON.stringify(rr[0]));
  },
  async "annotate with onPage false keeps every annotation on the canvas"() {
    const d = screen();
    const r = await annotateJs.annotate(findingsIn, Object.assign({}, evaluation, { onPage: false }));
    assert.strictEqual(r.written, 5);
    assert.strictEqual(canvasOf(d.s).length, 6);
  },
  async "handoff draws the reading, the touch areas and the focus states"() {
    const d = screen();
    const r = await handoffJs.handoff([{ screen: "10:1", title: "Login", reading, focus, notRead: [{ id: "10:7", text: "x" }] }], { lang: "pt-BR", profile: "Standard", platform: "app" });
    const out = r.screens[0];
    assert.strictEqual(out.stops, 3);
    assert.deepStrictEqual(out.touch.map((t) => t.label), ["1", "3–4", "4", "?", "?", "9", "9"], "labels come from the reading, or from n; a control outside both gets ?");
    assert.strictEqual(out.outsideReading.length, 2);
    const spacing = Object.fromEntries(out.touch.map((t) => [t.id, t.spacing]));
    assert.strictEqual(spacing["10:80"], "meets", "list rows of the A11Y.md rule's size may touch");
    assert.strictEqual(spacing["I10:9;1:1"], "below", "two small targets touching are a finding");
    const card = out.states.find((x) => x.component === "Card");
    assert.strictEqual(card.from, "library"); assert.strictEqual(card.focus, "State=Focused");
    assert.strictEqual(out.states.find((x) => x.component === "Button").focus, null);
    assert.strictEqual(out.theme.text, "text/primary", "the primary text, not the most used gray");
    assert.strictEqual(out.theme.strong, "Body/Strong", "a heavy style at least as large as the body, not the small tag");
    assert.ok(out.ignored, "what is not read is not drawn");
    assert.strictEqual(d.s.findAll(() => true).length, 19, "nothing left on the screen");
  },
  async "handoff keeps a card a person decided"() {
    const d = screen();
    const args = [{ screen: "10:1", reading, focus }];
    await handoffJs.handoff(args, { lang: "pt-BR", platform: "app" });
    const page = d.root.children.find((p) => p.name === "DA11Y — handoff");
    const c = page.findAll((n) => n.getSharedPluginData("da11y", "stop") === "10:3")[0];
    const t = new d.Node("TEXT", { fontName: { family: "Inter", style: "Regular" } }); t.characters = "✓ Ana"; c.appendChild(t);
    const changed = [reading[0], reading[1], { id: "10:3", text: "3–4 · cartão\n3) 🔊 \"Outro texto\"\n4) 🔊 botão \"Editar\"" }];
    const r = await handoffJs.handoff([{ screen: "10:1", reading: changed, focus }], { lang: "pt-BR", platform: "app" });
    assert.strictEqual(r.screens[0].keptDecided, 1);
    const again = page.findAll((n) => n.getSharedPluginData("da11y", "stop") === "10:3")[0];
    assert.ok(again.children.some((x) => x.type === "TEXT" && x.characters.includes("✓ Ana")));
    assert.strictEqual(page.children.length, 1, "the block is replaced, not stacked");
  },
  async "handoff suggests descriptions and never writes them"() {
    const d = screen();
    const before = d.root.findAll((n) => n.type === "COMPONENT" || n.type === "COMPONENT_SET").map((n) => n.id + "=" + (n.description || ""));
    const descriptions = [
      { id: "10:3", where: "set", text: "Área de toque: o card inteiro, mesmo com o botão Editar, que é a ação do card." },
      { id: "I10:3;2:3", where: "component", text: "Dentro de um card, o Editar é lido como parte do card." },
      { where: "guidelines", text: "Card com ação dentro é uma parada só." },
      { id: "10:80", where: "set", text: "Linha da lista." },
      { id: "I10:2;1:1", where: "set", text: "Ícone de voltar." },
    ];
    const r = await handoffJs.handoff([{ screen: "10:1", reading, descriptions }], { lang: "pt-BR", platform: "app" });
    const out = r.screens[0].descriptions;
    assert.deepStrictEqual(out.suggested.map((x) => x.where + " " + x.target), ["set Card", "component State=Default", "guidelines null"]);
    assert.ok(out.suggested[0].remote, "a library set is edited in the library's file");
    assert.deepStrictEqual(r.screens[0].refused.map((x) => x.id), ["10:80", "I10:2;1:1"], "a frame has no description, and a component without a set has no set description");
    const after = d.root.findAll((n) => n.type === "COMPONENT" || n.type === "COMPONENT_SET").map((n) => n.id + "=" + (n.description || ""));
    assert.deepStrictEqual(after, before, "the design system is never written");
    const page = d.root.children.find((p) => p.name === "DA11Y — handoff");
    const c = page.findAll((n) => n.getSharedPluginData("da11y", "stop") === "desc:set|50:1")[0];
    const t = new d.Node("TEXT", { fontName: { family: "Inter", style: "Regular" } }); t.characters = "✓ Ana, inserido"; c.appendChild(t);
    const again = await handoffJs.handoff([{ screen: "10:1", reading, descriptions: descriptions.slice(1, 3) }], { lang: "pt-BR", platform: "app" });
    assert.deepStrictEqual(again.screens[0].descriptions.left, ["desc:set|50:1"], "a decided card whose suggestion left is listed apart");
    assert.strictEqual(again.screens[0].decidedLeftReading.length, 0, "description cards never count as reading");
    assert.ok(page.findAll((n) => n.type === "TEXT").some((x) => x.characters === "✓ Ana, inserido"));
  },
  async "the report draws the template, the numbered findings and links the frame"() {
    const d = screen();
    const a = await annotateJs.annotate(findingsIn, evaluation);
    const r = await reportJs.reportPage(TEMPLATE, { title: "Login", lang: "pt-BR", screens: ["10:1"], findings: a.findings, fileUrl: "https://www.figma.com/design/ABC123/x" });
    assert.strictEqual(r.blocks.table, 8);
    assert.deepStrictEqual(r.findingsNotPlaced, []);
    assert.strictEqual(r.evaluated[0].findings, 5);
    assert.strictEqual(r.frames.linked, 1);
    const frame = d.s.annotations.map((x) => x.labelMarkdown).find((t) => t.includes("**"));
    assert.ok(frame.includes("](https://www.figma.com/design/ABC123?node-id="), frame);
    const doc = d.root.findAll((n) => n.getSharedPluginData("da11y", "report") === "Login")[0];
    const texts = doc.findAll((n) => n.type === "TEXT").map((t) => t.characters);
    assert.ok(!texts.some((t) => /\*\*|^#+\s|^\|/m.test(t)), "no Markdown marks left");
    assert.strictEqual(d.page.children.length, 1, "no copy left on the screens page");
  },
  async "the report keeps an answered question and lists one whose finding left"() {
    const d = screen();
    const a = await annotateJs.annotate(findingsIn, evaluation);
    const opts = { title: "Login", lang: "pt-BR", screens: ["10:1"], findings: a.findings };
    await reportJs.reportPage(TEMPLATE, opts);
    const cards = d.root.findAll((n) => n.getSharedPluginData("da11y", "finding") !== "");
    const answer = (c, txt) => { const t = new d.Node("TEXT", { fontName: { family: "Inter", style: "Regular" } }); t.characters = txt; c.appendChild(t); };
    answer(cards.find((c) => c.getSharedPluginData("da11y", "finding").includes("❓")), "✓ Ana: só o Editar");
    answer(cards.find((c) => c.getSharedPluginData("da11y", "finding").includes("cor trocada")), "✓ Ana: corrigido");
    const second = a.findings.filter((f) => !f.text.includes("cor trocada"));
    const r = await reportJs.reportPage(TEMPLATE, Object.assign({}, opts, { findings: second }));
    assert.strictEqual(r.keptDecided, 1);
    assert.strictEqual(r.decidedLeftAnalysis.length, 1);
    const all = d.root.findAll((n) => n.type === "TEXT").map((t) => t.characters);
    assert.ok(all.includes("✓ Ana: só o Editar") && all.includes("✓ Ana: corrigido"), "no decision is lost");
  },
  async "measure never takes a text for a target"() {
    const d = screen();
    const text = d.add(d.s, { type: "TEXT", name: "Button text" });
    assert.strictEqual(await measureJs.looksInteractive(text), null);
    assert.strictEqual(await measureJs.looksInteractive(d.card.children[2]), "name");
  },
  async "Markdown: blocks, inline marks and columns no narrower than their words"() {
    const b = reportJs.blocks(TEMPLATE);
    assert.strictEqual(b.filter((x) => x.type === "table").length, 8);
    const i = reportJs.inline("**A** · `b` e [c](https://x.y/z) e Card \\| X");
    assert.strictEqual(i.plain, "A · b e c e Card | X");
    for (const t of b.filter((x) => x.type === "table")) {
      const w = reportJs.columnWidths(t.rows, 960);
      assert.strictEqual(w.reduce((a, c) => a + c, 0), 960);
      t.rows[0].forEach((cell, c) => { const word = Math.max(...cell.split(/\s+/).map((x) => x.length)); assert.ok(w[c] >= word * 8.2 || w.reduce((a, x) => a + x, 0) === 960); });
    }
  },
};

(async () => {
  let failed = 0;
  for (const [name, fn] of Object.entries(tests)) {
    try { await fn(); console.log("ok   " + name); } catch (e) { failed++; console.log("FAIL " + name + "\n     " + (e && e.stack ? e.stack.split("\n").slice(0, 3).join("\n     ") : e)); }
  }
  console.log(failed ? failed + " failed" : "all " + Object.keys(tests).length + " passed");
  process.exit(failed ? 1 : 0);
})();
