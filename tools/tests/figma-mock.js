// A Figma document in memory, with the part of the Plugin API the tools use.
// It checks what Figma checks where a tool has broken before: a resize below
// zero, a font set before it loads, a range past the end of a text, a clone
// left beside the original. It is not Figma: it lays nothing out, and an
// absolute position is the sum of the relative ones.

"use strict";

function setup() {
  let next = 1000;
  const loaded = new Set();
  const styles = {}, variables = {}, librarySets = {}, categories = [];

  class Node {
    constructor(type, props) {
      this.type = type;
      this.id = (props && props.id) || `${next++}:0`;
      this.children = []; this.parent = null; this.visible = true; this.name = "";
      this.x = 0; this.y = 0; this.width = 100; this.height = 100;
      this.annotations = []; this.fills = []; this._pd = {}; this._removed = false;
      Object.assign(this, props || {});
    }
    get removed() { return this._removed; }
    get absoluteBoundingBox() {
      let x = this.x, y = this.y, p = this.parent;
      while (p && p.type !== "PAGE") { x += p.x; y += p.y; p = p.parent; }
      return { x, y, width: this.width, height: this.height };
    }
    set relativeTransform(m) { this._rt = m; this.x = m[0][2]; this.y = m[1][2]; }
    get relativeTransform() { return this._rt; }
    get defaultVariant() { return this.type === "COMPONENT_SET" ? this.children[0] : undefined; }
    set characters(v) {
      if (this.type === "TEXT" && this.fontName && !loaded.has(this.fontName.family + "|" + this.fontName.style)) throw new Error("font not loaded: " + this.fontName.family);
      this._chars = v;
    }
    get characters() { return this._chars || ""; }
    appendChild(c) {
      if (c.parent) c.parent.children = c.parent.children.filter((x) => x !== c);
      c.parent = this; this.children.push(c);
    }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter((x) => x !== this); this.parent = null; this._removed = true; }
    resize(w, h) {
      if (!(w > 0) || !(h >= 0) || (h === 0 && this.type !== "LINE")) throw new Error("resize " + w + "x" + h + " on " + this.type);
      this.width = w; this.height = h;
    }
    rescale(f) { this.width *= f; this.height *= f; this._scaled = f; }
    clone() {
      if (this._noClone) throw new Error("clone refused");
      const c = new Node(this.type, { name: this.name, width: this.width, height: this.height, _main: this._main });
      this.parent.appendChild(c);
      return c;
    }
    createInstance() {
      if (this.type !== "COMPONENT") throw new Error("createInstance on " + this.type);
      const c = new Node("INSTANCE", { name: this.name, width: this.width, height: this.height, _main: this });
      api.currentPage.appendChild(c);
      return c;
    }
    swapComponent(c) { if (c.type !== "COMPONENT") throw new Error("swapComponent needs a COMPONENT"); this._main = c; }
    async getMainComponentAsync() { return this._main || null; }
    async setTextStyleIdAsync(id) {
      const s = styles[id];
      if (!loaded.has(s.fontName.family + "|" + s.fontName.style)) throw new Error("font not loaded");
      this.textStyleId = id; this.fontSize = s.fontSize;
    }
    setRangeFontName(a, b, f) {
      if (!loaded.has(f.family + "|" + f.style)) throw new Error("font not loaded: " + f.family);
      if (b > this.characters.length) throw new Error("range past the end");
      (this._ranges = this._ranges || []).push(["font", a, b, f.family + " " + f.style]);
    }
    setRangeHyperlink(a, b, h) { (this._ranges = this._ranges || []).push(["link", a, b, h.value]); }
    setRangeTextDecoration(a, b, d) { (this._ranges = this._ranges || []).push(["deco", a, b, d]); }
    setExplicitVariableModeForCollection(col, mode) { this._modes = Object.assign(this._modes || {}, { [col.id]: mode }); }
    setSharedPluginData(ns, k, v) { this._pd[ns + "/" + k] = v; }
    getSharedPluginData(ns, k) { return this._pd[ns + "/" + k] || ""; }
    findAll(fn) {
      const out = [];
      const walk = (n) => { for (const c of n.children) { if (fn(c)) out.push(c); walk(c); } };
      walk(this);
      return out;
    }
  }

  const root = new Node("DOCUMENT", { id: "0:0" });
  const page = new Node("PAGE", { id: "0:1", name: "Screens" });
  root.appendChild(page);
  page.loadAsync = async () => {};

  const api = {
    root, currentPage: page,
    createPage() { const p = new Node("PAGE"); root.appendChild(p); p.loadAsync = async () => {}; return p; },
    createFrame() { const n = new Node("FRAME"); this.currentPage.appendChild(n); return n; },
    createRectangle() { const n = new Node("RECTANGLE"); this.currentPage.appendChild(n); return n; },
    createLine() { const n = new Node("LINE", { height: 0 }); this.currentPage.appendChild(n); return n; },
    createText() { const n = new Node("TEXT"); this.currentPage.appendChild(n); return n; },
    loadFontAsync: async (f) => { if (f.family === "Missing") throw new Error("no such font"); loaded.add(f.family + "|" + f.style); },
    getStyleByIdAsync: async (id) => styles[id] || null,
    importComponentSetByKeyAsync: async (key) => { if (!librarySets[key]) throw new Error("library unavailable"); return librarySets[key]; },
    getNodeByIdAsync: async (id) => [root, ...root.findAll(() => true)].find((n) => n.id === id) || null,
    variables: {
      getVariableByIdAsync: async (id) => variables[id] || null,
      setBoundVariableForPaint: (p, field, v) => Object.assign({}, p, { boundVariables: { color: { type: "VARIABLE_ALIAS", id: v.id } } }),
      getVariableCollectionByIdAsync: async (id) => ({ id }),
    },
    annotations: {
      getAnnotationCategoriesAsync: async () => categories,
      addAnnotationCategoryAsync: async ({ label, color }) => { const c = { id: "cat:" + label, label, color }; categories.push(c); return c; },
    },
  };
  global.figma = api;
  const add = (parent, props) => { const n = new Node(props.type || "FRAME", props); parent.appendChild(n); return n; };
  return { figma: api, Node, add, root, page, styles, variables, librarySets, loaded };
}

module.exports = { setup };
