import { describe, expect, it } from "vitest";
import { TEMPLATES, getTemplate, DEFAULT_TEMPLATE_ID, TEMPLATE_CATEGORIES, TWO_COLUMN_LAYOUTS } from "@/data/templates";
import { CATEGORY_LABELS } from "@/types/template";
import { CORE_SECTION_IDS, type CoreSectionId } from "@/types/resume";

describe("template registry", () => {
  it("registers at least 40 (in fact 50) distinct templates", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(40);
    expect(TEMPLATES.length).toBe(50);
  });

  it("has unique ids and names", () => {
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(TEMPLATES.length);
    expect(new Set(TEMPLATES.map((t) => t.name)).size).toBe(TEMPLATES.length);
  });

  it("is genuinely varied across layouts, headers, headings and typography", () => {
    expect(new Set(TEMPLATES.map((t) => t.layout)).size).toBeGreaterThanOrEqual(15);
    expect(new Set(TEMPLATES.map((t) => t.headerStyle)).size).toBeGreaterThanOrEqual(9);
    expect(new Set(TEMPLATES.map((t) => t.headingStyle)).size).toBeGreaterThanOrEqual(10);
    expect(new Set(TEMPLATES.map((t) => t.font)).size).toBeGreaterThanOrEqual(5);
  });

  it("does not reach the count by only changing colours", () => {
    const signatures = TEMPLATES.map((t) => [t.layout, t.headerStyle, t.headingStyle, t.bulletStyle, t.density, t.font].join("|"));
    // At most a handful of templates may share an identical structural signature.
    const counts = new Map<string, number>();
    for (const s of signatures) counts.set(s, (counts.get(s) ?? 0) + 1);
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(4);
  });

  it("has valid metadata for categorised browsing", () => {
    for (const t of TEMPLATES) {
      expect(t.name.length).toBeGreaterThan(2);
      expect(t.description.length).toBeGreaterThan(20);
      expect(t.styles.length).toBeGreaterThan(0);
      expect(t.audiences.length).toBeGreaterThan(0);
      expect(CATEGORY_LABELS[t.category]).toBeTruthy();
      expect(TEMPLATE_CATEGORIES.some((c) => c.id === t.category)).toBe(true);
    }
  });

  it("covers all six required categories", () => {
    const categories = new Set(TEMPLATES.map((t) => t.category));
    expect(categories.size).toBe(6);
  });

  it("keeps section orders complete and unique", () => {
    for (const t of TEMPLATES) {
      expect(new Set(t.sectionOrder).size).toBe(t.sectionOrder.length);
      for (const id of CORE_SECTION_IDS.filter((s) => s !== "references")) {
        expect(t.sectionOrder).toContain(id);
      }
      expect(t.sectionOrder.every((s) => CORE_SECTION_IDS.includes(s as CoreSectionId))).toBe(true);
    }
  });

  it("only claims two-column support for layouts that implement it", () => {
    for (const t of TEMPLATES) {
      if (t.capabilities.columns) expect(TWO_COLUMN_LAYOUTS.includes(t.layout)).toBe(true);
      if (t.capabilities.photo) expect(t.showPhoto).toBe(true);
      if (t.capabilities.skillBars) expect(t.showSkillBars).toBe(true);
    }
  });

  it("falls back to the default template for unknown ids", () => {
    expect(getTemplate("does-not-exist").id).toBe(DEFAULT_TEMPLATE_ID);
    expect(getTemplate(null).id).toBe(DEFAULT_TEMPLATE_ID);
    expect(getTemplate("executive").id).toBe("executive");
  });
});
