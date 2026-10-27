import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { TEMPLATES, getTemplate } from "@/data/templates";
import { sampleState } from "@/data/sample-resume";
import { createResumePdf, loadPdfFonts, type PdfFontData } from "@/lib/pdf-export";
import type { ResumeState } from "@/types/resume";

const fontFiles = ["DejaVuSans.ttf", "DejaVuSans-Bold.ttf", "DejaVuSerif.ttf", "DejaVuSerif-Bold.ttf", "DejaVuSansMono.ttf"];
function loadFonts(): PdfFontData {
  const out: PdfFontData = {};
  for (const f of fontFiles) out[f] = fs.readFileSync(path.join(process.cwd(), "public/fonts", f)).toString("base64");
  return out;
}
const fonts = loadFonts();

async function pdfBytes(state: ResumeState) {
  const doc = await createResumePdf(state, getTemplate(state.templateId), fonts);
  return { doc, bytes: Buffer.from(doc.output("arraybuffer")) };
}

describe("PDF export", () => {
  it("produces a real, multi-section PDF with selectable text", async () => {
    const { doc, bytes } = await pdfBytes(sampleState("modern-minimal"));
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(15000);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    // Embedded font objects prove text (not a screenshot) is written.
    const raw = bytes.toString("latin1");
    expect(raw).toContain("/FontFile2");
    expect(raw).toContain("/Type /Page");
  });

  it("exports every one of the 50 templates without errors", async () => {
    for (const t of TEMPLATES) {
      const state = sampleState(t.id);
      const { doc, bytes } = await pdfBytes(state);
      expect(bytes.subarray(0, 5).toString(), t.id).toBe("%PDF-");
      expect(doc.getNumberOfPages(), t.id).toBeGreaterThanOrEqual(1);
      expect(bytes.length, t.id).toBeGreaterThan(8000);
    }
  });

  it("supports A4 and US Letter page geometry", async () => {
    const a4 = sampleState("classic-professional");
    a4.customize.pageSize = "a4";
    const letter = sampleState("classic-professional");
    letter.customize.pageSize = "letter";
    const a = await pdfBytes(a4);
    const b = await pdfBytes(letter);
    expect(a.doc.internal.pageSize.getWidth()).toBeCloseTo(210, 0);
    expect(a.doc.internal.pageSize.getHeight()).toBeCloseTo(297, 0);
    expect(b.doc.internal.pageSize.getWidth()).toBeCloseTo(216, 0);
    expect(b.doc.internal.pageSize.getHeight()).toBeCloseTo(279, 0);
  });

  it("creates additional pages for long content instead of truncating it", async () => {
    const state = sampleState("simple-ats-friendly");
    state.data.experience = Array.from({ length: 8 }, (_, n) => ({
      id: `x${n}`, jobTitle: `Role number ${n}`, company: "Example Corp", location: "Remote",
      startDate: "Jan 2020", endDate: "Dec 2023", current: false, description: "",
      bullets: Array.from({ length: 6 }, (_, i) => `Achievement ${i} for role ${n} with a meaningful outcome and a metric.`),
    }));
    const { doc } = await pdfBytes(state);
    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it("omits sections the user hides", async () => {
    const state = sampleState("modern-minimal");
    state.customize.hiddenSections.push("experience");
    const { bytes: hidden } = await pdfBytes(state);
    const { bytes: shown } = await pdfBytes(sampleState("modern-minimal"));
    expect(hidden.length).toBeLessThan(shown.length);
  });

  it("falls back to standard PDF fonts when no font files are available", async () => {
    const doc = await createResumePdf(sampleState("formal-minimal"), getTemplate("formal-minimal"), {});
    const bytes = Buffer.from(doc.output("arraybuffer"));
    expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("does not attempt network font loads in a non-browser environment", async () => {
    expect(await loadPdfFonts()).toEqual({});
  });
});
