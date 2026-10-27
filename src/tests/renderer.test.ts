import { describe, expect, it } from "vitest";
import { TEMPLATES, getTemplate } from "@/data/templates";
import { buildResumeIR } from "@/lib/resume-ir";
import { createEmptyState, allSectionIds } from "@/lib/resume-utils";
import { sampleState } from "@/data/sample-resume";
import { docContext, docStyle } from "@/components/resume-renderer/doc-style";
import { buildRenderBlocks } from "@/components/resume-renderer/flow-block";
import type { ResumeState } from "@/types/resume";

describe("shared resume rendering system", () => {
  it("renders an IR and measured blocks for every one of the 50 templates", () => {
    for (const template of TEMPLATES) {
      const state = sampleState(template.id);
      const ir = buildResumeIR(state, template);
      const ctx = docContext(state, template);
      const main = buildRenderBlocks(ir.main, ctx);
      const aside = buildRenderBlocks(ir.aside, ctx);

      expect(ir.header.name, template.id).toBe("Aarav Mehta");
      expect(ir.header.contacts.length, template.id).toBeGreaterThanOrEqual(4);
      expect(ir.main.length, template.id).toBeGreaterThan(10);
      expect(main.length, template.id).toBeGreaterThan(10);
      expect(new Set(main.map((b) => b.id)).size, template.id).toBe(main.length);
      for (const block of main) expect(block.node, `${template.id}/${block.id}`).toBeTruthy();
      if (ir.twoColumn) expect(aside.length, template.id).toBeGreaterThan(0);
      expect(ir.sectionIds, template.id).toContain("experience");
      expect(ir.sectionIds, template.id).toContain("education");
    }
  });

  it("splits long bullet lists into individually pageable blocks", () => {
    const state = sampleState("simple-ats-friendly");
    state.data.experience[0]!.bullets = Array.from({ length: 12 }, (_, i) => `Bullet number ${i + 1} with some detail`);
    const ir = buildResumeIR(state, getTemplate(state.templateId));
    const ctx = docContext(state, getTemplate(state.templateId));
    const blocks = buildRenderBlocks(ir.main, ctx);
    expect(blocks.filter((b) => b.id.includes("-b")).length).toBeGreaterThanOrEqual(12);
  });

  it("hides empty sections automatically and honours hiddenSections", () => {
    const state = createEmptyState("modern-minimal");
    state.data.personal.summary = "Hello world";
    const empty = buildResumeIR(state, getTemplate(state.templateId));
    expect(empty.sectionIds).toEqual(["summary"]);

    const sample = sampleState("modern-minimal");
    sample.customize.hiddenSections.push("experience", "skills");
    const filtered = buildResumeIR(sample, getTemplate(sample.templateId));
    expect(filtered.sectionIds).not.toContain("experience");
    expect(filtered.sectionIds).not.toContain("skills");
    expect(filtered.sectionIds).toContain("education");
  });

  it("routes supporting sections to the sidebar for two-column templates", () => {
    const state = sampleState("modern-sidebar");
    state.customize.columns = 2;
    const template = getTemplate(state.templateId);
    const ir = buildResumeIR(state, template);
    expect(ir.twoColumn).toBe(true);
    expect(ir.aside.length).toBeGreaterThan(0);
    expect(ir.aside.every((b) => b.column === "aside")).toBe(true);
    expect(ir.main.every((b) => b.column === "main")).toBe(true);
    expect(ir.asideSections).toContain("skills");
  });

  it("supports user-created custom sections", () => {
    const state = createEmptyState();
    state.data.customSections.push({
      id: "cs_test", title: "Speaking",
      entries: [{ id: "e1", heading: "JSConf Talk", subheading: "Remote", date: "2025", details: "Rendering at scale", bullets: ["200 attendees"] }],
    });
    state.customize.sectionOrder.push("custom:cs_test" as never);
    const ir = buildResumeIR(state, getTemplate(state.templateId));
    expect(ir.sectionIds).toContain("custom:cs_test");
    expect(ir.main.some((b) => b.kind === "heading" && b.text === "Speaking")).toBe(true);
    expect(ir.main.some((b) => b.kind === "item" && b.title === "JSConf Talk")).toBe(true);
  });

  it("omits contact items the user chose to hide", () => {
    const state = sampleState();
    state.customize.contactVisibility.email = false;
    state.customize.contactVisibility.github = false;
    const ir = buildResumeIR(state, getTemplate(state.templateId));
    expect(ir.header.contacts.map((c) => c.key)).not.toContain("email");
    expect(ir.header.contacts.map((c) => c.key)).not.toContain("github");
    expect(ir.header.contacts.map((c) => c.key)).toContain("phone");
  });

  it("derives CSS variables from customization state", () => {
    const state: ResumeState = { ...sampleState(), customize: { ...sampleState().customize, accentColor: "#ff0000", fontSize: 12, margins: 30 } };
    const style = docStyle(docContext(state, getTemplate(state.templateId))) as unknown as Record<string, string>;
    expect(style["--vr-accent"]).toBe("#ff0000");
    expect(style["--vr-fs"]).toBe("12pt");
    expect(style["--vr-margin"]).toBe("30px");
  });

  it("respects custom section ordering", () => {
    const state = sampleState("simple-ats-friendly");
    state.customize.sectionOrder = ["skills", "summary", "experience", "education", "projects", "certifications", "languages", "awards", "volunteer", "publications", "courses", "activities", "interests", "references"];
    const ir = buildResumeIR(state, getTemplate(state.templateId));
    const headings = ir.main.filter((b) => b.kind === "heading").map((b) => (b as { text: string }).text);
    expect(headings[0]).toBe("Skills");
    expect(headings.indexOf("Work Experience")).toBeLessThan(headings.indexOf("Education"));
  });

  it("keeps section ids stable for custom sections", () => {
    const state = sampleState();
    const ids = allSectionIds(state);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain("summary");
    expect(ids).toContain("references");
  });
});
