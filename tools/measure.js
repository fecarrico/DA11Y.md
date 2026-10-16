// DA11Y.md — measure.js
//
// Reads the current selection through the Figma Plugin API and returns, as
// data, what DA11Y.md Sections 2.1 and 3 ask the agent to measure instead of
// estimate: contrast pairs on the resolved token value, target boxes and the
// spacing between them, text that cannot grow, and font sizes. Ratios are
// truncated to two decimals, never rounded (4.499 is 4.49, and fails 4.5).
//
// Where it runs: anywhere Plugin API code runs — the Figma agent's code
// execution, a plugin, the console. It only reads. It never writes.
//
//   const report = await measure(figma.currentPage.selection, { profile: "Standard" });
//   console.log(JSON.stringify(report, null, 2));
//
// What it cannot measure, it lists under `notMeasured` with the reason: a
// gradient or image fill, a video frame, several visible fills, a node whose
// background no ancestor paints. Those go to the report's "Not measured" table
// for a person to check. Modes: the values are resolved in the mode the
// selection is in. Switching the evaluated frame's mode changes the design, so
// to measure another mode run this on a duplicate of the frame with that mode
// set, then delete the duplicate. figma-visual-perception.md, Section 2, has
// the read-only route through the variable's values by mode.
//
// Pure functions (luminance, ratio, blend) are exported for tests when the
// file runs under Node. Standard library only; no dependencies.

"use strict";

const PROFILES = {
  Shield:    { text: 7,   largeText: 4.5, ui: 3, font: 14, target: 44, advised: 48 },
  Standard:  { text: 4.5, largeText: 3,   ui: 3, font: 12, target: 24, advised: 44 },
  Launchpad: { text: 3,   largeText: 3,   ui: 3, font: 10, target: 24, advised: 44 },
};
const HOUSE_GAP = 8; // px between neighboring targets (House Rule†)

// ---------- pure functions (WCAG 2.x) ----------

function channel(c) {
  // c in 0..1 (Figma's RGB), sRGB to linear
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb) {
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

function ratio(fg, bg) {
  const a = luminance(fg), b = luminance(bg);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function truncate2(x) {
  return Math.floor(x * 100) / 100;
}

function blend(fg, alpha, bg) {
  // composite a translucent foreground over an opaque background
  return {
    r: fg.r * alpha + bg.r * (1 - alpha),
    g: fg.g * alpha + bg.g * (1 - alpha),
    b: fg.b * alpha + bg.b * (1 - alpha),
  };
}

function hex(rgb) {
  const h = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return ("#" + h(rgb.r) + h(rgb.g) + h(rgb.b)).toUpperCase();
}

function parseHex(s) {
  const m = /^#?([0-9a-f]{6})$/i.exec(s.trim());
  if (!m) throw new Error("expected #RRGGBB, got " + s);
  const n = parseInt(m[1], 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

function isLargeText(fontSize, fontWeight) {
  // WCAG: 18pt (24px) regular, or 14pt (18.66px) bold
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
}

// ---------- Figma reads ----------

async function resolvePaint(node, paint, field, index) {
  // Returns { rgb, alpha, token } or { reason }
  if (paint.type !== "SOLID") return { reason: paint.type.toLowerCase() + " fill" };
  if (paint.visible === false) return { reason: "hidden paint" };
  let rgb = paint.color, token = null;
  const bound = node.boundVariables && node.boundVariables[field] && node.boundVariables[field][index];
  if (bound && bound.id) {
    const variable = await figma.variables.getVariableByIdAsync(bound.id);
    if (variable) {
      token = variable.name;
      const resolved = variable.resolveForConsumer(node);
      if (resolved && resolved.resolvedType === "COLOR") rgb = { r: resolved.value.r, g: resolved.value.g, b: resolved.value.b };
    }
  }
  const alpha = (paint.opacity == null ? 1 : paint.opacity) * (node.opacity == null ? 1 : node.opacity);
  return { rgb, alpha, token };
}

function visiblePaints(paints) {
  return Array.isArray(paints) ? paints.filter((p) => p.visible !== false) : [];
}

async function backgroundOf(node) {
  // The nearest ancestor that paints one opaque solid fill. Page background last.
  let n = node.parent;
  while (n && n.type !== "PAGE") {
    const fills = visiblePaints(n.fills);
    if (fills.length === 1) {
      const p = await resolvePaint(n, fills[0], "fills", 0);
      if (p.reason) return { reason: p.reason + " on " + n.name };
      if (p.alpha < 1) return { reason: "translucent background on " + n.name };
      return { rgb: p.rgb, token: p.token, name: n.name };
    }
    if (fills.length > 1) return { reason: "several fills on " + n.name };
    n = n.parent;
  }
  if (n && n.type === "PAGE") {
    const bgs = visiblePaints(n.backgrounds);
    if (bgs.length === 1 && bgs[0].type === "SOLID") return { rgb: bgs[0].color, token: null, name: "page" };
  }
  return { reason: "no ancestor paints a background" };
}

function box(node) {
  const b = node.absoluteBoundingBox || { width: node.width, height: node.height };
  return { w: Math.round(b.width * 100) / 100, h: Math.round(b.height * 100) / 100, minW: node.minWidth || null, minH: node.minHeight || null };
}

function looksInteractive(node) {
  if (Array.isArray(node.reactions) && node.reactions.length > 0) return "reaction";
  const name = (node.type === "INSTANCE" && node.mainComponent ? node.mainComponent.name : node.name) || "";
  if (/\b(button|btn|cta|link|input|field|checkbox|radio|switch|toggle|tab|chip|icon-?button|menu ?item|option|close)\b/i.test(name)) return "name";
  return null;
}

function gapToNeighbors(node) {
  const parent = node.parent;
  if (!parent) return null;
  if (parent.layoutMode && parent.layoutMode !== "NONE" && node.layoutPositioning !== "ABSOLUTE") {
    return { gap: parent.itemSpacing, from: "itemSpacing of " + parent.name };
  }
  // geometry: smallest edge-to-edge distance to a sibling
  const a = node.absoluteBoundingBox;
  if (!a || !parent.children) return null;
  let best = null;
  for (const s of parent.children) {
    if (s === node || !s.absoluteBoundingBox || s.visible === false) continue;
    const b = s.absoluteBoundingBox;
    const dx = Math.max(0, Math.max(a.x, b.x) - Math.min(a.x + a.width, b.x + b.width));
    const dy = Math.max(0, Math.max(a.y, b.y) - Math.min(a.y + a.height, b.y + b.height));
    const d = Math.max(dx, dy);
    if (best === null || d < best.gap) best = { gap: Math.round(d * 100) / 100, from: "distance to " + s.name };
  }
  return best;
}

async function measureText(node, floors, out) {
  const segments = node.getStyledTextSegments(["fills", "fontSize", "fontWeight", "fontName"]);
  const bg = await backgroundOf(node);
  for (const seg of segments) {
    const fills = visiblePaints(seg.fills);
    const entry = { node: node.name, id: node.id, text: seg.characters.slice(0, 40), fontSize: seg.fontSize, fontWeight: seg.fontWeight };
    if (seg.fontSize < floors.font) out.text.push({ ...entry, check: "font size", floor: floors.font, result: "fail" });
    if (fills.length !== 1) { out.notMeasured.push({ ...entry, reason: fills.length === 0 ? "no fill" : "several fills" }); continue; }
    if (bg.reason) { out.notMeasured.push({ ...entry, reason: bg.reason }); continue; }
    const fg = await resolvePaint(node, fills[0], "fills", 0);
    if (fg.reason) { out.notMeasured.push({ ...entry, reason: fg.reason }); continue; }
    const fgRgb = fg.alpha < 1 ? blend(fg.rgb, fg.alpha, bg.rgb) : fg.rgb;
    const r = truncate2(ratio(fgRgb, bg.rgb));
    const floor = isLargeText(seg.fontSize, seg.fontWeight) ? floors.largeText : floors.text;
    out.pairs.push({ ...entry, kind: "text", foreground: hex(fgRgb), background: hex(bg.rgb), tokens: [fg.token, bg.token], against: bg.name, ratio: r, floor, result: r >= floor ? "pass" : "fail" });
  }
  const grows = node.textAutoResize === "HEIGHT" || node.textAutoResize === "WIDTH_AND_HEIGHT";
  const parentHugs = !node.parent || node.parent.layoutSizingVertical !== "FIXED";
  if (!grows || node.maxLines || node.textTruncation === "ENDING" || !parentHugs) {
    out.text.push({ node: node.name, id: node.id, check: "text that grows", textAutoResize: node.textAutoResize, maxLines: node.maxLines || null, truncation: node.textTruncation, parentSizing: node.parent ? node.parent.layoutSizingVertical : null, result: "warn" });
  }
}

async function measureStroke(node, floors, out) {
  const strokes = visiblePaints(node.strokes);
  if (strokes.length !== 1 || !node.strokeWeight) return;
  const bg = await backgroundOf(node);
  if (bg.reason) { out.notMeasured.push({ node: node.name, id: node.id, kind: "stroke", reason: bg.reason }); return; }
  const st = await resolvePaint(node, strokes[0], "strokes", 0);
  if (st.reason) { out.notMeasured.push({ node: node.name, id: node.id, kind: "stroke", reason: st.reason }); return; }
  const rgb = st.alpha < 1 ? blend(st.rgb, st.alpha, bg.rgb) : st.rgb;
  const r = truncate2(ratio(rgb, bg.rgb));
  out.pairs.push({ node: node.name, id: node.id, kind: "stroke", weight: node.strokeWeight, foreground: hex(rgb), background: hex(bg.rgb), tokens: [st.token, bg.token], against: bg.name, ratio: r, floor: floors.ui, result: r >= floors.ui ? "pass" : "fail" });
}

async function measureTarget(node, floors, out, why) {
  const b = box(node);
  const gap = gapToNeighbors(node);
  const meets = b.w >= floors.target && b.h >= floors.target;
  const house = b.w >= floors.advised && b.h >= floors.advised;
  out.targets.push({
    node: node.name, id: node.id, type: node.type, interactive: why, box: b,
    gap: gap ? gap.gap : null, gapFrom: gap ? gap.from : null,
    floor: floors.target, advised: floors.advised, houseGap: HOUSE_GAP,
    result: meets ? "pass" : "fail (check the criterion's exceptions)",
    houseRule: house && (gap === null || gap.gap >= HOUSE_GAP) ? "meets" : "below (finding, never a WCAG failure)",
  });
  if (node.type === "GROUP") out.findings.push({ node: node.name, id: node.id, finding: "interactive GROUP: no box of its own and no annotation" });
}

async function walk(node, floors, out) {
  if (node.visible === false) return;
  if (node.type === "TEXT") await measureText(node, floors, out);
  const why = looksInteractive(node);
  if (why) await measureTarget(node, floors, out, why);
  if ((node.type === "FRAME" || node.type === "INSTANCE" || node.type === "COMPONENT" || node.type === "RECTANGLE") && node.strokes) await measureStroke(node, floors, out);
  if (Array.isArray(node.reactions)) {
    for (const r of node.reactions) {
      const t = r.trigger && r.trigger.type;
      if (t === "ON_HOVER" || t === "MOUSE_ENTER") out.findings.push({ node: node.name, id: node.id, finding: "hover trigger: needs a tap or click path too" });
      if (t === "ON_DRAG") out.findings.push({ node: node.name, id: node.id, finding: "drag trigger: needs a single-pointer alternative" });
      if (t === "AFTER_TIMEOUT") out.findings.push({ node: node.name, id: node.id, finding: "timeout trigger: automatic motion or disappearing content", timeout: r.trigger.timeout });
    }
  }
  if ("children" in node) for (const c of node.children) await walk(c, floors, out);
}

async function measure(selection, options) {
  const profile = (options && options.profile) || "Standard";
  const floors = PROFILES[profile];
  if (!floors) throw new Error("profile must be Shield, Standard or Launchpad");
  const out = { tool: "DA11Y.md measure.js", profile, floors, modes: {}, pairs: [], targets: [], text: [], findings: [], notMeasured: [] };
  for (const node of selection) {
    if (node.resolvedVariableModes) out.modes[node.name] = node.resolvedVariableModes;
    await walk(node, floors, out);
  }
  out.summary = {
    pairs: out.pairs.length, pairsFailing: out.pairs.filter((p) => p.result === "fail").length,
    targets: out.targets.length, targetsBelowFloor: out.targets.filter((t) => t.result !== "pass").length,
    textWarnings: out.text.length, findings: out.findings.length, notMeasured: out.notMeasured.length,
    note: "Ratios truncated. Modes resolved as the selection is set. Nothing here is a verification of the built product.",
  };
  return out;
}

if (typeof module !== "undefined") {
  module.exports = { luminance, ratio, truncate2, blend, hex, parseHex, isLargeText, PROFILES, HOUSE_GAP };
}
if (typeof figma !== "undefined" && typeof module === "undefined") {
  measure(figma.currentPage.selection, { profile: (typeof DA11Y_PROFILE !== "undefined" && DA11Y_PROFILE) || "Standard" })
    .then((r) => console.log(JSON.stringify(r, null, 2)))
    .catch((e) => console.error("measure.js: " + e.message));
}
