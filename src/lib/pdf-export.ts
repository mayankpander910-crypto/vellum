import type { jsPDF } from "jspdf";
import type { ResumeState } from "@/types/resume";
import { PAGE_SIZES, FONT_STACKS } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { buildResumeIR, type FlowBlock, type HeaderIR } from "./resume-ir";
import { downloadBlob, resumeFileName } from "./resume-utils";
import { docContext } from "@/components/resume-renderer/doc-style";

/* ------------------------------------------------------------------ */
/* Fonts                                                              */
/* ------------------------------------------------------------------ */
const FONT_FILES = [
  "DejaVuSans.ttf", "DejaVuSans-Bold.ttf", "DejaVuSerif.ttf",
  "DejaVuSerif-Bold.ttf", "DejaVuSansMono.ttf",
] as const;

export type PdfFontData = Record<string, string>;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Fonts are static assets served by the app itself — no request leaves the site. */
export async function loadPdfFonts(): Promise<PdfFontData> {
  if (typeof window === "undefined") return {};
  const out: PdfFontData = {};
  await Promise.all(FONT_FILES.map(async (file) => {
    try {
      const res = await fetch(`/fonts/${file}`);
      if (!res.ok) return;
      out[file] = bytesToBase64(new Uint8Array(await res.arrayBuffer()));
    } catch { /* fall back to standard PDF fonts */ }
  }));
  return out;
}

interface Families { normal: string; bold: string; serif: string; serifBold: string; mono: string; embedded: boolean }

function registerFonts(doc: jsPDF, fonts: PdfFontData): Families {
  const has = (f: string) => Boolean(fonts[f]);
  if (has("DejaVuSans.ttf")) {
    doc.addFileToVFS("DejaVuSans.ttf", fonts["DejaVuSans.ttf"]!);
    doc.addFont("DejaVuSans.ttf", "VellumSans", "normal");
    if (has("DejaVuSans-Bold.ttf")) {
      doc.addFileToVFS("DejaVuSans-Bold.ttf", fonts["DejaVuSans-Bold.ttf"]!);
      doc.addFont("DejaVuSans-Bold.ttf", "VellumSans", "bold");
    }
    if (has("DejaVuSerif.ttf")) {
      doc.addFileToVFS("DejaVuSerif.ttf", fonts["DejaVuSerif.ttf"]!);
      doc.addFont("DejaVuSerif.ttf", "VellumSerif", "normal");
      if (has("DejaVuSerif-Bold.ttf")) {
        doc.addFileToVFS("DejaVuSerif-Bold.ttf", fonts["DejaVuSerif-Bold.ttf"]!);
        doc.addFont("DejaVuSerif-Bold.ttf", "VellumSerif", "bold");
      }
    }
    if (has("DejaVuSansMono.ttf")) {
      doc.addFileToVFS("DejaVuSansMono.ttf", fonts["DejaVuSansMono.ttf"]!);
      doc.addFont("DejaVuSansMono.ttf", "VellumMono", "normal");
      doc.addFont("DejaVuSansMono.ttf", "VellumMono", "bold");
    }
    return {
      normal: "VellumSans", bold: "VellumSans", serif: has("DejaVuSerif.ttf") ? "VellumSerif" : "VellumSans",
      serifBold: has("DejaVuSerif-Bold.ttf") ? "VellumSerif" : "VellumSans",
      mono: has("DejaVuSansMono.ttf") ? "VellumMono" : "VellumSans", embedded: true,
    };
  }
  return { normal: "helvetica", bold: "helvetica", serif: "times", serifBold: "times", mono: "courier", embedded: false };
}

/** Standard PDF fonts only support WinAnsi; transliterate the rest. */
function asciiSafe(text: string): string {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...")
    .replace(/[•·]/g, "-").replace(/→/g, "->").replace(/[^\x20-\x7E\n]/g, "");
}

/* ------------------------------------------------------------------ */
/* Geometry                                                           */
/* ------------------------------------------------------------------ */
const PT = 25.4 / 72; // 1pt in mm
const PX = 25.4 / 96; // 1css px in mm

/** jsPDF understands hex colours, not CSS rgb() strings. */
function hex(color: string): string {
  if (!color) return "#ffffff";
  if (color.startsWith("#")) return color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : color.slice(0, 7);
  const m = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (m) return `#${[m[1], m[2], m[3]].map((v) => Math.max(0, Math.min(255, Number(v))).toString(16).padStart(2, "0")).join("")}`;
  return "#ffffff";
}

interface Env {
  doc: jsPDF;
  docFamily: Families;
  state: ResumeState;
  template: TemplateDefinition;
  accent: string; ink: string; muted: string; line: string; soft: string;
  pageW: number; pageH: number; margin: number;
  base: number; leading: number;
  twoColumn: boolean; asideW: number; mainW: number; gap: number;
  headerH: number;
  darkSide: boolean;
  headerStyle: string;
}

function setFont(doc: jsPDF, families: Families, kind: "sans" | "serif" | "mono", bold: boolean, size: number) {
  let family = kind === "serif" ? (bold ? families.serifBold : families.serif) : kind === "mono" ? families.mono : families.normal;
  let style: "normal" | "bold" = bold ? "bold" : "normal";
  if (family === "VellumMono") style = "normal";
  if (!families.embedded) {
    family = kind === "serif" ? "times" : kind === "mono" ? "courier" : "helvetica";
  }
  doc.setFont(family, style);
  doc.setFontSize(size);
}

function t(doc: jsPDF, families: Families, text: string): string {
  return families.embedded ? text : asciiSafe(text);
}

function wrap(doc: jsPDF, text: string, maxWidth: number): string[] {
  const words = (text || "").replace(/\s+/g, " ").trim().split(" ");
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const candidate = line ? `${line} ${w}` : w;
    if (doc.getTextWidth(candidate) <= maxWidth || !line) line = candidate;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

class Column {
  y = 0;
  page = 0;
  constructor(
    private env: Env,
    public x: number,
    public width: number,
    public aside: boolean,
    startY: number,
    private onPage: (pageIndex: number) => void,
  ) { this.y = startY; }

  private nextPage() {
    const { doc, pageW, pageH, margin } = this.env;
    this.page += 1;
    if (this.page < doc.getNumberOfPages()) doc.setPage(this.page + 1);
    else { doc.addPage([pageW, pageH], "portrait"); this.onPage(this.page); }
    this.y = margin;
  }

  ensure(height: number) {
    if (this.y + height > this.env.pageH - this.env.margin) this.nextPage();
  }

  setTextColor(color: string) { this.env.doc.setTextColor(hex(color)); }

  line(text: string, o: {
    size?: number; bold?: boolean; color?: string; kind?: "sans" | "serif" | "mono";
    indent?: number; gapBefore?: number; gapAfter?: number; align?: "left" | "center" | "right";
    right?: string; bullet?: string; italic?: boolean;
  } = {}) {
    const { doc, docFamily: f, base, leading, line: lineColor } = this.env;
    const size = o.size ?? base;
    const lh = size * PT * leading;
    this.y += o.gapBefore ?? 0;
    setFont(doc, f, o.kind ?? "sans", Boolean(o.bold), size);
    doc.setTextColor(hex(o.color ?? this.env.ink));
    const plain = t(doc, f, text);
    const indent = o.indent ?? 0;
    const hanging = o.bullet ? doc.getTextWidth(o.bullet + "  ") : 0;
    const lines = wrap(doc, plain, Math.max(8, this.width - indent - hanging));
    const rightLines = o.right ? wrap(doc, t(doc, f, o.right), Math.max(8, this.width * 0.4)) : [];
    const rightText = rightLines[0] ?? "";

    lines.forEach((ln, i) => {
      this.ensure(lh + 0.5);
      const baseline = this.y + size * PT * 0.98;
      const x = this.x + indent + (i === 0 ? 0 : hanging);
      if (i === 0 && o.bullet) doc.text(o.bullet, this.x + indent, baseline);
      if (o.align === "center") doc.text(ln, this.x + this.width / 2, baseline, { align: "center" });
      else if (o.align === "right") doc.text(ln, this.x + this.width, baseline, { align: "right" });
      else doc.text(ln, x, baseline);
      if (i === 0 && rightText) {
        setFont(doc, f, "sans", false, size * 0.86);
        doc.setTextColor(hex(this.env.muted));
        doc.text(rightText, this.x + this.width, baseline, { align: "right" });
        setFont(doc, f, o.kind ?? "sans", Boolean(o.bold), size);
        doc.setTextColor(hex(o.color ?? this.env.ink));
      }
      this.y += lh;
    });
    this.y += o.gapAfter ?? 0;
    void lineColor;
  }

  rule(color?: string, thickness = 0.25, gapBefore = 1, gapAfter = 3) {
    const { doc } = this.env;
    this.y += gapBefore;
    this.ensure(thickness + 1);
    doc.setDrawColor(hex(color ?? this.env.line));
    doc.setLineWidth(thickness);
    doc.line(this.x, this.y, this.x + this.width, this.y);
    this.y += gapAfter;
  }

  rect(x: number, y: number, w: number, h: number, color: string, style: "F" | "S" | "FD" = "F", radius?: number) {
    const { doc } = this.env;
    doc.setFillColor(hex(color));
    doc.setDrawColor(hex(color));
    if (radius) doc.roundedRect(x, y, w, h, radius, radius, style);
    else doc.rect(x, y, w, h, style);
  }

  tags(items: string[], label?: string, gapAfter = 4) {
    const { doc, docFamily: f, base } = this.env;
    const size = base * 0.9;
    setFont(doc, f, "sans", false, size);
    const lh = size * PT * 1.5;
    this.ensure(lh);
    let x = this.x;
    let y = this.y;
    if (label) {
      setFont(doc, f, "sans", true, size);
      const labelText = t(doc, f, `${label}: `);
      doc.setTextColor(hex(this.env.ink));
      doc.text(labelText, x, y + size * PT);
      x += doc.getTextWidth(labelText) + 1.5;
      setFont(doc, f, "sans", false, size);
    }
    for (const raw of items) {
      const text = t(doc, f, raw);
      const w = doc.getTextWidth(text) + 4;
      if (x + w > this.x + this.width && x > this.x) {
        x = this.x; y += lh; this.y = y; this.ensure(lh);
      }
      this.rect(x, y, w, lh * 0.86, this.env.soft, "F", 1);
      doc.setTextColor(hex(this.env.ink));
      doc.text(text, x + 2, y + lh * 0.62);
      x += w + 1.6;
    }
    this.y = y + lh + gapAfter;
  }

  skillBar(label: string, level: number) {
    const { doc, docFamily: f, base } = this.env;
    const size = base * 0.92;
    setFont(doc, f, "sans", false, size);
    const lh = size * PT * 1.6;
    this.ensure(lh + 2);
    doc.setTextColor(hex(this.env.ink));
    doc.text(t(doc, f, label), this.x, this.y + size * PT);
    doc.text(`${level}%`, this.x + this.width, this.y + size * PT, { align: "right" });
    const barY = this.y + lh * 0.82;
    this.rect(this.x, barY, this.width, 1.2, this.env.line);
    this.rect(this.x, barY, (this.width * level) / 100, 1.2, this.aside && this.env.darkSide ? "#ffffff" : this.env.accent);
    this.y += lh + 3;
  }
}

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */
function drawHeader(env: Env, header: HeaderIR, col: Column) {
  const { doc, docFamily: f, template, accent, margin, pageW } = env;
  const style = template.headerStyle;
  const band = style === "band";
  const centered = style === "centered";
  const textColor = band ? "#ffffff" : env.ink;
  const mutedColor = band ? "#ffffff" : env.muted;
  const nameSize = env.base * (style === "minimal" ? 1.9 : 2.5);
  const startY = margin;
  const nameText = t(doc, f, template.uppercaseName ? header.name.toUpperCase() : header.name);
  const contactText = t(doc, f, header.contacts.map((c) => c.value).join("  ·  "));

  let y = startY;
  if (style === "overline") {
    col.line("RESUME", { size: env.base * 0.72, color: accent, bold: true, gapAfter: 2 });
    y = col.y;
  }
  if (style === "monogram") {
    col.line(`${header.initials}.`, { size: env.base * 2.1, color: accent, bold: true, kind: "sans", gapAfter: 1 });
    y = col.y;
  }
  if (band) {
    doc.setFillColor(hex(accent));
    doc.rect(0, 0, pageW, env.headerH + margin, "F");
  }
  if (style === "boxed") {
    doc.setDrawColor(hex(accent)); doc.setLineWidth(0.6);
    doc.roundedRect(margin - 5, margin - 5, env.pageW - 2 * margin + 10, env.headerH + 8, 2, 2, "S");
  }

  const photoRight = (header.showPhoto && style === "photo") || (centered && header.showPhoto);
  const nameWidth = env.mainW - (photoRight ? 22 : 0);
  setFont(doc, f, template.headingFont ? "serif" : "sans", true, nameSize);
  const nameLines = wrap(doc, nameText, nameWidth);
  nameLines.forEach((ln) => {
    doc.setTextColor(hex(style === "two-tone" ? accent : textColor));
    const x = centered ? env.pageW / 2 : margin;
    doc.text(ln, x, y + nameSize * PT, { align: centered ? "center" : "left" });
    y += nameSize * PT * 1.12;
  });

  if (header.headline) {
    setFont(doc, f, "sans", false, env.base * 1.08);
    doc.setTextColor(hex(band ? "#ffffff" : accent));
    const x = centered ? env.pageW / 2 : margin;
    doc.text(t(doc, f, header.headline), x, y + env.base * PT, { align: centered ? "center" : "left" });
    y += env.base * PT * 1.7;
  }

  if (header.showPhoto && header.photo && /^data:image\/(png|jpeg|jpg);base64,/.test(header.photo)) {
    try {
      const format = header.photo.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(header.photo, format, env.pageW - margin - 20, startY, 20, 20);
    } catch { /* ignore unsupported image data */ }
  } else if (header.showPhoto) {
    doc.setFillColor(hex(band ? "#ffffff" : accent));
    doc.circle(env.pageW - margin - 10, startY + 10, 10, "F");
    setFont(doc, f, "sans", true, env.base * 1.25);
    doc.setTextColor(hex(band ? accent : "#ffffff"));
    doc.text(header.initials, env.pageW - margin - 10, startY + 11.4, { align: "center" });
  }

  if (contactText) {
    setFont(doc, f, "sans", false, env.base * 0.86);
    doc.setTextColor(hex(mutedColor));
    const contactWidth = photoRight ? env.pageW - 2 * margin - 24 : env.pageW - 2 * margin;
    const lines = wrap(doc, contactText, contactWidth);
    lines.forEach((ln) => {
      const x = centered ? env.pageW / 2 : margin;
      doc.text(ln, x, y + env.base * PT * 0.9, { align: centered ? "center" : "left" });
      y += env.base * PT * 1.35;
    });
  }

  if (style === "rule" || style === "grid") {
    doc.setDrawColor(hex(accent)); doc.setLineWidth(style === "rule" ? 0.7 : 0.3);
    doc.line(margin, env.headerH + margin - 2, env.pageW - margin, env.headerH + margin - 2);
  } else if (centered) {
    doc.setDrawColor(hex(env.line)); doc.setLineWidth(0.25);
    doc.line(margin, env.headerH + margin - 2, env.pageW - margin, env.headerH + margin - 2);
  }
}

/* ------------------------------------------------------------------ */
/* Blocks                                                             */
/* ------------------------------------------------------------------ */
function drawHeading(col: Column, block: Extract<FlowBlock, { kind: "heading" }>, env: Env) {
  const { doc, docFamily: f, template, accent, base } = env;
  const style = template.headingStyle;
  const size = base * 1.02;
  const lh = size * PT * 1.45;
  col.y += block.gapBefore ? block.gapBefore * PX : 0;
  col.ensure(lh * 5); // keep the heading with at least three lines of content
  const text = t(doc, f, template.uppercaseHeadings ? block.text.toUpperCase() : block.text);
  setFont(doc, f, template.headingFont ? "serif" : "sans", true, size);
  const y = col.y;
  const label = style === "numbered" ? `${String(block.index).padStart(2, "0")}  ${text}`
    : style === "bracket" ? `[ ${text} ]` : text;
  const color = style === "plain" || style === "caps" || style === "numbered" || style === "bracket" ? env.ink : accent;

  if (style === "banner") {
    col.rect(col.x, y, col.width, lh, accent, "F", 1);
    doc.setTextColor("#ffffff");
    doc.text(label, col.x + 3, y + lh * 0.7);
  } else if (style === "boxed" || style === "pill") {
    const w = Math.min(col.width, doc.getTextWidth(label) + 8);
    col.rect(col.x, y, w, lh, style === "pill" ? env.soft : "#ffffff", style === "pill" ? "F" : "S", style === "pill" ? lh / 2 : 1);
    if (style === "boxed") { doc.setDrawColor(hex(accent)); doc.setLineWidth(0.4); doc.rect(col.x, y, w, lh, "S"); }
    doc.setTextColor(hex(accent));
    doc.text(label, col.x + 4, y + lh * 0.7);
  } else if (style === "left-rule") {
    col.rect(col.x, y + 1, 1.2, lh - 2, accent);
    doc.setTextColor(hex(color));
    doc.text(label, col.x + 4, y + lh * 0.7);
  } else if (style === "dot") {
    doc.setFillColor(hex(accent)); doc.circle(col.x + 1.4, y + lh * 0.45, 1.1, "F");
    doc.setTextColor(hex(env.ink)); doc.text(label, col.x + 5, y + lh * 0.7);
  } else {
    doc.setTextColor(hex(color));
    doc.text(label, col.x, y + lh * 0.7);
    if (["rule", "double-rule", "dotted", "numbered", "underline"].includes(style)) {
      doc.setDrawColor(hex(style === "underline" ? accent : env.line));
      doc.setLineWidth(style === "double-rule" ? 0.8 : 0.25);
      const lineY = y + lh + 0.6;
      const w = style === "underline" ? Math.min(col.width, doc.getTextWidth(label) + 2) : col.width;
      doc.line(col.x, lineY, col.x + w, lineY);
      if (style === "double-rule") doc.line(col.x, lineY + 1, col.x + col.width, lineY + 1);
    }
  }
  col.y = y + lh + (block.gapAfter ? block.gapAfter * PX : 0) + 1.5;
}

function drawBlock(col: Column, block: FlowBlock, env: Env) {
  const { template, accent, base } = env;
  const bullet = template.bulletStyle === "arrow" ? "→" : template.bulletStyle === "dash" ? "–" : template.bulletStyle === "square" ? "▪" : "•";
  const gapAfter = (block.gapAfter ?? 0) * PX;
  switch (block.kind) {
    case "heading": drawHeading(col, block, env); break;
    case "item": {
      col.ensure(base * PT * 2.5);
      col.line(block.title || "", {
        bold: true, size: base * 1.02,
        color: template.headerStyle === "two-tone" ? accent : env.ink,
        right: block.date, gapBefore: (block.gapBefore ?? 0) * PX, gapAfter: 0.6,
      });
      if (block.subtitle || block.meta) {
        col.line(block.subtitle || "", { size: base * 0.95, color: accent, right: block.meta, gapAfter: 0.6 });
      }
      col.y += gapAfter;
      break;
    }
    case "paragraph":
      col.line(block.text, {
        size: block.tone === "small" ? base * 0.87 : base,
        bold: block.tone === "small",
        color: block.tone === "small" ? accent : block.tone === "muted" ? env.muted : env.ink,
        kind: template.font === "serif" ? "serif" : "sans",
        gapBefore: (block.gapBefore ?? 0) * PX, gapAfter: 0,
      });
      col.y += gapAfter;
      break;
    case "bullets":
      for (const item of block.items) {
        col.line(item, {
          size: base * 0.98,
          bullet: template.bulletStyle === "none" ? undefined : bullet,
          color: env.ink,
          gapBefore: (block.gapBefore ?? 0) * PX, gapAfter: 0.4,
        });
      }
      col.y += gapAfter;
      break;
    case "tags": col.tags(block.items, block.label, gapAfter); break;
    case "skillRow": col.skillBar(block.label, block.level ?? 70); break;
    case "rule": col.rule(env.line, 0.25, (block.gapBefore ?? 0) * PX, gapAfter); break;
    case "spacer": col.y += block.size * PX; break;
  }
}

/* ------------------------------------------------------------------ */
/* Document                                                           */
/* ------------------------------------------------------------------ */
export function renderResumePdf(doc: jsPDF, state: ResumeState, template: TemplateDefinition, fonts: PdfFontData = {}): jsPDF {
  const families = registerFonts(doc, fonts);
  const ctx = docContext(state, template);
  const c = state.customize;
  const ir = buildResumeIR(state, template);
  const dims = PAGE_SIZES[c.pageSize];
  const [pageW, pageH] = dims.pdf;
  const margin = c.margins * PX;
  const gap = 8;
  const contentW = pageW - margin * 2;
  const asideW = ir.twoColumn ? contentW * ((template.sidebarWidth ?? 30) / 100) - gap / 2 : 0;
  const mainW = ir.twoColumn ? contentW - asideW - gap : contentW;
  const fontKind = FONT_STACKS[c.fontFamily].pdf;

  const headerH = (() => {
    const base = c.fontSize;
    const nameLines = Math.max(1, Math.ceil((ir.header.name.length * base * 0.55 * PT) / (contentW * 0.9)));
    const headline = ir.header.headline ? base * PT * 1.7 : 0;
    const contacts = ir.header.contacts.length ? base * PT * 1.35 * Math.max(1, Math.ceil(ir.header.contacts.map((x) => x.value.length + 3).reduce((a, b) => a + b, 0) / 100)) : 0;
    const overline = ["overline", "monogram"].includes(template.headerStyle) ? base * PT * 1.8 : 0;
    return Math.max(20, nameLines * base * 2.5 * PT * 1.12 + headline + contacts + overline + 4);
  })();

  const env: Env = {
    doc, docFamily: families, state, template,
    accent: template.capabilities.accentColor ? c.accentColor : template.palette.accent,
    ink: template.palette.ink, muted: template.palette.muted, line: template.palette.line,
    soft: hex(ctx.soft), pageW, pageH, margin, base: c.fontSize, leading: c.lineSpacing,
    twoColumn: ir.twoColumn, asideW, mainW, gap, headerH,
    darkSide: template.layout === "dark-sidebar", headerStyle: template.headerStyle,
  };
  void fontKind;

  const drawChrome = (pageIndex: number) => {
    const top = pageIndex === 0 ? margin + headerH : 0;
    if (ir.twoColumn) {
      const leftSide = template.layout !== "sidebar-right";
      const x = leftSide ? 0 : pageW - asideW - margin * 2;
      doc.setFillColor(hex(env.darkSide ? env.accent : ctx.soft));
      doc.rect(x, top, asideW + margin * 2, pageH - top, "F");
    }
    if (template.layout === "rail") {
      doc.setFillColor(hex(env.accent)); doc.rect(margin - 5, 0, 2, pageH, "F");
    }
    if (template.headerStyle === "band") {
      doc.setFillColor(hex(env.accent)); doc.rect(0, pageH - 1.8, pageW, 1.8, "F");
    }
    if (template.layout === "boxed") {
      doc.setDrawColor(hex(ctx.soft)); doc.setLineWidth(0.3); doc.rect(5, 5, pageW - 10, pageH - 10, "S");
    }
  };

  doc.setPage(1);
  drawChrome(0);

  const headerCol = new Column(env, margin, contentW, false, margin, drawChrome);
  drawHeader(env, ir.header, headerCol);

  const bodyTop = margin + headerH + 4 * PX;

  const mainCol = new Column(env, margin, mainW, false, bodyTop, drawChrome);
  for (const block of ir.main) drawBlock(mainCol, block, env);

  if (ir.twoColumn && ir.aside.length) {
    const asideX = template.layout === "sidebar-right" ? margin + mainW + gap : margin;
    const asideCol = new Column(env, asideX, asideW, true, bodyTop, drawChrome);
    doc.setPage(1);
    const asideEnv: Env = env.darkSide
      ? { ...env, ink: "#ffffff", muted: "#f2f2f2", line: "#d8d8e8", soft: hex(ctx.soft), accent: "#ffffff" }
      : env;
    for (const block of ir.aside) drawBlock(asideCol, block, asideEnv);
  }

  if (c.showPageNumbers || template.showPageNumbers) {
    const total = doc.getNumberOfPages();
    for (let i = 0; i < total; i++) {
      doc.setPage(i + 1);
      setFont(doc, families, "sans", false, c.fontSize * 0.8);
      doc.setTextColor(hex(env.muted));
      if (total > 1) doc.text(`${i + 1} / ${total}`, pageW / 2, pageH - margin / 2, { align: "center" });
    }
  }
  doc.setProperties({
    title: `${ir.header.name} — Resume`,
    subject: "Resume created with Vellum",
    author: ir.header.name,
    creator: "Vellum Resume Builder",
  });
  return doc;
}

export async function createResumePdf(state: ResumeState, template: TemplateDefinition, fonts?: PdfFontData): Promise<jsPDF> {
  const { jsPDF } = await import("jspdf");
  const [pageW, pageH] = PAGE_SIZES[state.customize.pageSize].pdf;
  const doc = new jsPDF({ unit: "mm", format: [pageW, pageH], orientation: "portrait", compress: true });
  return renderResumePdf(doc, state, template, fonts ?? (await loadPdfFonts()));
}

export async function generateResumePdfBlob(state: ResumeState, template: TemplateDefinition): Promise<Blob> {
  const doc = await createResumePdf(state, template);
  return doc.output("blob");
}

export async function downloadResumePdf(state: ResumeState, template: TemplateDefinition): Promise<void> {
  const blob = await generateResumePdfBlob(state, template);
  downloadBlob(blob, resumeFileName(state.data.personal.fullName || "my", "pdf"));
}
