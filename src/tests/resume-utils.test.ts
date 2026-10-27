import { describe, expect, it } from "vitest";
import { TEMPLATES, getTemplate } from "@/data/templates";
import { sampleState } from "@/data/sample-resume";
import {
  allSectionIds, completenessChecklist, atsChecklist, createEmptyState, customizationForTemplate,
  emptyData, moveItem, resumeFileName, resumeMetrics, sanitizeFileName, sectionHasContent,
  switchTemplate, PRESETS,
} from "@/lib/resume-utils";
import { parseImportedResume } from "@/lib/resume-validation";

describe("resume utilities", () => {
  it("creates an empty but structurally complete document", () => {
    const state = createEmptyState("executive");
    expect(state.version).toBe(1);
    expect(state.data.personal.fullName).toBe("");
    expect(state.data.experience).toEqual([]);
    expect(state.customize.sectionOrder.length).toBeGreaterThan(10);
    expect(state.customize.accentColor).toBe(getTemplate("executive").palette.accent);
  });

  it("moves items without mutating the source", () => {
    const list = ["a", "b", "c", "d"];
    expect(moveItem(list, 0, 2)).toEqual(["b", "c", "a", "d"]);
    expect(list).toEqual(["a", "b", "c", "d"]);
    expect(moveItem(list, 3, 0)).toEqual(["d", "a", "b", "c"]);
    expect(moveItem(list, 1, 1)).toEqual(list);
  });

  it("switches templates while preserving every content field", () => {
    const original = sampleState("classic-professional");
    for (const t of TEMPLATES.slice(0, 12)) {
      const next = switchTemplate(original, t.id);
      expect(next.templateId).toBe(t.id);
      expect(next.data).toEqual(original.data);
      expect(next.customize.sectionOrder.length).toBeGreaterThan(10);
    }
  });

  it("adopts a new template's defaults for untouched choices", () => {
    const a = createEmptyState("classic-professional");
    const b = switchTemplate(a, "creative-portfolio");
    expect(b.customize.accentColor).toBe(getTemplate("creative-portfolio").palette.accent);
    expect(b.customize.fontFamily).toBe(getTemplate("creative-portfolio").font);
    const custom = { ...a, customize: { ...a.customize, accentColor: "#123456", fontFamily: "mono" as const } };
    const c = switchTemplate(custom, "creative-portfolio");
    expect(c.customize.accentColor).toBe("#123456");
    expect(c.customize.fontFamily).toBe("mono");
  });

  it("clamps unsupported capabilities when switching", () => {
    const from = createEmptyState("modern-sidebar");
    from.customize.columns = 2;
    from.customize.showPhoto = true;
    const to = switchTemplate(from, "simple-ats-friendly");
    expect(to.customize.columns).toBe(1);
    expect(to.customize.showPhoto).toBe(false);
  });

  it("produces safe download filenames", () => {
    expect(sanitizeFileName("  Aarav Méhta / 2026 ")).toBe("aarav-mehta-2026");
    expect(sanitizeFileName("")).toBe("my");
    expect(resumeFileName("Aarav Mehta", "pdf")).toBe("aarav-mehta-resume.pdf");
  });

  it("reports completeness and ATS checks for sample and blank documents", () => {
    const sample = sampleState();
    const blank = createEmptyState();
    expect(completenessChecklist(sample).every((x) => x.done)).toBe(true);
    expect(completenessChecklist(blank).filter((x) => x.done).length).toBeLessThanOrEqual(1);
    expect(atsChecklist(blank).length).toBeGreaterThanOrEqual(6);
    expect(resumeMetrics(sample).words).toBeGreaterThan(150);
    expect(resumeMetrics(blank).words).toBe(0);
  });

  it("detects content in optional sections and respects hidden sections", () => {
    const state = sampleState();
    expect(sectionHasContent("experience", state)).toBe(true);
    expect(sectionHasContent("publications", state)).toBe(false);
    expect(allSectionIds(state)).toContain("experience");
    state.customize.hiddenSections.push("experience");
    expect(allSectionIds(state)).toContain("experience"); // order still known, renderer filters it
  });

  it("provides five usable presets", () => {
    expect(Object.keys(PRESETS)).toEqual(["professional", "minimal", "modern", "classic", "creative"]);
    for (const preset of Object.values(PRESETS)) {
      expect(preset.fontSize).toBeGreaterThan(7);
      expect(preset.accentColor).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it("round-trips a full document through JSON import", () => {
    const state = sampleState("full-stack-developer");
    state.data.customSections.push({ id: "cs1", title: "Speaking", entries: [{ id: "cse1", heading: "JSConf", subheading: "Online", date: "2025", details: "Talk on rendering", bullets: ["200 attendees"] }] });
    state.customize.sectionOrder.push("custom:cs1");
    const result = parseImportedResume(JSON.stringify(state));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.data.personal.fullName).toBe("Aarav Mehta");
      expect(result.state.data.experience[0]?.bullets.length).toBeGreaterThan(0);
      expect(result.state.customize.sectionOrder).toContain("custom:cs1");
      expect(result.state.templateId).toBe("full-stack-developer");
    }
  });

  it("rejects junk and repairs partial documents", () => {
    expect(parseImportedResume("not json").ok).toBe(false);
    expect(parseImportedResume("[]").ok).toBe(false);
    const partial = parseImportedResume(JSON.stringify({ templateId: "executive", data: { personal: { fullName: "Test Person" } } }));
    expect(partial.ok).toBe(true);
    if (partial.ok) {
      expect(partial.state.data.personal.fullName).toBe("Test Person");
      expect(partial.state.data.experience).toEqual([]);
      expect(partial.state.customize.pageSize).toBe("a4");
      expect(partial.state.customize.sectionOrder.length).toBeGreaterThan(10);
    }
  });

  it("flags an invalid email but never blocks an import because of it", () => {
    const state = createEmptyState();
    state.data.personal.email = "not-an-email";
    const result = parseImportedResume(JSON.stringify(state));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.data.personal.email).toBe("not-an-email");
  });

  it("has defaults for all 50 templates", () => {
    for (const t of TEMPLATES) {
      const c = customizationForTemplate(t);
      expect(c.accentColor).toMatch(/^#/);
      expect(c.fontSize).toBeGreaterThanOrEqual(8);
      expect(c.margins).toBeGreaterThan(20);
      expect(c.pageSize).toBe("a4");
      expect(c.sectionOrder.length).toBeGreaterThan(10);
    }
  });

  it("keeps emptyData free of sample content", () => {
    expect(emptyData().personal.summary).toBe("");
    expect(emptyData().customSections).toEqual([]);
  });
});
