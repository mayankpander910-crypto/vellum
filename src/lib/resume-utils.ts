import {
  CORE_SECTION_IDS,
  FONT_STACKS,
  PAGE_SIZES,
  SECTION_LABELS,
  type Customization,
  type PageSize,
  type PresetId,
  type ResumeData,
  type ResumeState,
  type SectionId,
} from "@/types/resume";
import { getTemplate, DEFAULT_TEMPLATE_ID } from "@/data/templates";
import type { TemplateDefinition } from "@/types/template";

let counter = 0;
export function uid(prefix = "id"): string {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${counter.toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function emptyData(): ResumeData {
  return {
    personal: {
      fullName: "", headline: "", email: "", phone: "", city: "", country: "",
      linkedin: "", github: "", portfolio: "", website: "", photo: "", summary: "",
    },
    experience: [], education: [], skills: [], projects: [], certifications: [],
    languages: [], awards: [], volunteer: [], publications: [], courses: [],
    activities: [], interests: [], references: [], customSections: [],
  };
}

export const DEFAULT_CONTACT_VISIBILITY: Customization["contactVisibility"] = {
  email: true, phone: true, location: true, linkedin: true,
  github: true, portfolio: true, website: true,
};

export function customizationForTemplate(template: TemplateDefinition): Customization {
  return {
    preset: "professional",
    accentColor: template.palette.accent,
    fontFamily: template.font,
    fontSize: template.density === "compact" ? 9.5 : template.density === "relaxed" ? 10.8 : 10.2,
    sectionSpacing: template.density === "compact" ? 9 : template.density === "relaxed" ? 18 : 13,
    lineSpacing: template.density === "compact" ? 1.32 : template.density === "relaxed" ? 1.55 : 1.42,
    margins: template.layout.includes("sidebar") || template.layout === "rail" ? 38 : 46,
    pageSize: "a4",
    columns: template.layout.includes("sidebar") || template.layout === "columns" || template.layout === "serif-columns" ? 2 : 1,
    showPhoto: Boolean(template.showPhoto),
    showSkillBars: Boolean(template.showSkillBars),
    showIcons: Boolean(template.showIcons),
    showPageNumbers: Boolean(template.showPageNumbers),
    contactVisibility: { ...DEFAULT_CONTACT_VISIBILITY },
    sectionOrder: [...template.sectionOrder],
    hiddenSections: [],
  };
}

export const PRESETS: Record<PresetId, Partial<Customization>> = {
  professional: { accentColor: "#1f3a68", fontFamily: "sans", fontSize: 10.2, sectionSpacing: 13, lineSpacing: 1.42, margins: 46 },
  minimal: { accentColor: "#22242b", fontFamily: "grotesk", fontSize: 10.5, sectionSpacing: 18, lineSpacing: 1.55, margins: 52 },
  modern: { accentColor: "#4c47e8", fontFamily: "humanist", fontSize: 10.2, sectionSpacing: 14, lineSpacing: 1.45, margins: 42 },
  classic: { accentColor: "#7a2f43", fontFamily: "serif", fontSize: 10.3, sectionSpacing: 12, lineSpacing: 1.4, margins: 48 },
  creative: { accentColor: "#d95d48", fontFamily: "editorial", fontSize: 10.5, sectionSpacing: 16, lineSpacing: 1.5, margins: 40 },
};

export function createEmptyState(templateId = DEFAULT_TEMPLATE_ID): ResumeState {
  const template = getTemplate(templateId);
  return { version: 1, templateId: template.id, data: emptyData(), customize: customizationForTemplate(template) };
}

/** All section ids, including user-created ones, in a stable order. */
export function allSectionIds(state: ResumeState): SectionId[] {
  const custom = state.data.customSections.map((s) => `custom:${s.id}` as SectionId);
  const known = new Set<SectionId>([...CORE_SECTION_IDS, ...custom]);
  const ordered = state.customize.sectionOrder.filter((id) => known.has(id));
  for (const id of known) if (!ordered.includes(id)) ordered.push(id);
  return ordered;
}

export function sectionLabel(id: SectionId, state: ResumeState): string {
  if (id.startsWith("custom:")) {
    const found = state.data.customSections.find((s) => `custom:${s.id}` === id);
    return found?.title || "Custom Section";
  }
  return SECTION_LABELS[id as keyof typeof SECTION_LABELS] ?? id;
}

export function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item!);
  return next;
}

/** Switch templates without losing entered content; keep deliberate custom choices. */
export function switchTemplate(state: ResumeState, nextTemplateId: string): ResumeState {
  const previous = getTemplate(state.templateId);
  const next = getTemplate(nextTemplateId);
  const defaults = customizationForTemplate(next);
  const prevDefaults = customizationForTemplate(previous);
  const c = state.customize;
  const customIds = state.data.customSections.map((s) => `custom:${s.id}` as SectionId);
  const newOrder = c.sectionOrder.join(",") === prevDefaults.sectionOrder.join(",")
    ? [...next.sectionOrder, ...customIds]
    : [...c.sectionOrder.filter((id) => !id.startsWith("custom:")), ...customIds];

  return {
    ...state,
    templateId: next.id,
    customize: {
      ...c,
      accentColor: c.accentColor === prevDefaults.accentColor ? defaults.accentColor : c.accentColor,
      fontFamily: c.fontFamily === prevDefaults.fontFamily ? defaults.fontFamily : c.fontFamily,
      sectionOrder: newOrder,
      // Untouched template-specific options follow the new template's design;
      // deliberate user overrides are preserved.
      columns: next.capabilities.columns
        ? (c.columns === prevDefaults.columns ? defaults.columns : c.columns)
        : defaults.columns,
      showPhoto: next.capabilities.photo
        ? (c.showPhoto === prevDefaults.showPhoto ? defaults.showPhoto : c.showPhoto) : false,
      showSkillBars: next.capabilities.skillBars
        ? (c.showSkillBars === prevDefaults.showSkillBars ? defaults.showSkillBars : c.showSkillBars) : false,
      showIcons: next.capabilities.icons
        ? (c.showIcons === prevDefaults.showIcons ? defaults.showIcons : c.showIcons) : false,
      showPageNumbers: c.showPageNumbers === prevDefaults.showPageNumbers ? defaults.showPageNumbers : c.showPageNumbers,
    },
  };
}

export function sanitizeFileName(name: string): string {
  const cleaned = name.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
  return cleaned || "my";
}

export function resumeFileName(name: string, ext: string): string {
  return `${sanitizeFileName(name)}-resume.${ext}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function exportJson(state: ResumeState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, resumeFileName(state.data.personal.fullName, "json"));
}

/* ------------------------------------------------------------------ */
/* Writing assistance / quality checks (100% local, no AI APIs)         */
/* ------------------------------------------------------------------ */

export function plainText(state: ResumeState): string {
  const d = state.data;
  const chunks: string[] = [];
  chunks.push(d.personal.fullName, d.personal.headline, d.personal.summary);
  d.experience.forEach((e) => chunks.push(e.jobTitle, e.company, e.description, ...e.bullets));
  d.education.forEach((e) => chunks.push(e.institution, e.degree, e.field, e.details));
  d.skills.forEach((s) => chunks.push(s.category, ...s.items));
  d.projects.forEach((p) => chunks.push(p.name, p.description, p.technologies, ...p.achievements));
  d.certifications.forEach((x) => chunks.push(x.name, x.issuer));
  d.awards.forEach((x) => chunks.push(x.name, x.details));
  d.volunteer.forEach((x) => chunks.push(x.role, x.organization, x.details));
  d.publications.forEach((x) => chunks.push(x.title, x.details));
  d.courses.forEach((x) => chunks.push(x.name, x.details));
  d.activities.forEach((x) => chunks.push(x.name, x.details));
  chunks.push(...d.interests);
  d.customSections.forEach((s) => s.entries.forEach((e) => chunks.push(e.heading, e.details, ...e.bullets)));
  return chunks.filter(Boolean).join(" ");
}

export interface ChecklistItem { id: string; label: string; done: boolean; hint: string }

export function completenessChecklist(state: ResumeState): ChecklistItem[] {
  const d = state.data;
  return [
    { id: "name", label: "Your full name", done: d.personal.fullName.trim().length > 1, hint: "Add your name in Personal details." },
    { id: "headline", label: "Professional headline", done: d.personal.headline.trim().length > 2, hint: "One line describing your target role." },
    { id: "contact", label: "At least one contact method", done: Boolean(d.personal.email || d.personal.phone), hint: "Email or phone is enough." },
    { id: "summary", label: "Professional summary", done: d.personal.summary.trim().length > 40, hint: "2–3 lines about your strengths." },
    { id: "experience", label: "Experience or projects", done: d.experience.length + d.projects.length > 0, hint: "Add at least one role or project." },
    { id: "education", label: "Education", done: d.education.length > 0, hint: "Add your most recent qualification." },
    { id: "skills", label: "Skills", done: d.skills.some((s) => s.items.filter(Boolean).length > 0), hint: "Add 5–10 relevant skills." },
    { id: "bullets", label: "Achievement-focused bullets", done: d.experience.some((e) => e.bullets.filter(Boolean).length >= 2), hint: "Aim for 2–4 bullets per role." },
    { id: "links", label: "A professional link", done: Boolean(d.personal.linkedin || d.personal.github || d.personal.portfolio || d.personal.website), hint: "Optional, but helpful." },
  ];
}

export function atsChecklist(state: ResumeState): ChecklistItem[] {
  const d = state.data;
  const text = plainText(state).toLowerCase();
  const longBullets = d.experience.flatMap((e) => e.bullets).filter((b) => b.split(/\s+/).length > 35);
  return [
    { id: "single-column", label: "Single-column layout (or a simple sidebar)", done: state.customize.columns === 1 || !getTemplate(state.templateId).capabilities.columns, hint: "Complex columns can confuse older parsers." },
    { id: "standard-headings", label: "Standard section headings", done: allSectionIds(state).some((s) => s === "experience") && allSectionIds(state).some((s) => s === "education"), hint: "Keep “Experience” and “Education” headings." },
    { id: "no-photo", label: "No profile photo", done: !state.customize.showPhoto, hint: "Photos are usually stripped by ATS." },
    { id: "text-dates", label: "Dates are plain text", done: !/[\u2600-\u27BF]/.test(d.experience.map((e) => e.startDate + e.endDate).join("")), hint: "Use “Jan 2023” style dates." },
    { id: "keywords", label: "Relevant role keywords present", done: text.split(/\s+/).filter(Boolean).length > 120, hint: "Mirror keywords from the job description." },
    { id: "bullets-short", label: "Bullets are concise", done: longBullets.length === 0, hint: "Keep each bullet under ~30 words." },
    { id: "contact-text", label: "Contact details are real text", done: Boolean(d.personal.email && d.personal.phone), hint: "Avoid putting contact info in an image." },
  ];
}

export function resumeMetrics(state: ResumeState) {
  const words = plainText(state).trim().split(/\s+/).filter(Boolean).length;
  const bullets = state.data.experience.reduce((n, e) => n + e.bullets.filter(Boolean).length, 0)
    + state.data.projects.reduce((n, p) => n + p.achievements.filter(Boolean).length, 0);
  let length: "short" | "good" | "long" = "good";
  if (words < 150) length = "short";
  else if (words > 780) length = "long";
  return { words, bullets, length };
}

export function fontCss(id: Customization["fontFamily"]): string {
  return FONT_STACKS[id].css;
}

export function pageDimensions(size: PageSize, margins: number) {
  const page = PAGE_SIZES[size];
  return { page, innerWidth: page.width - margins * 2, innerHeight: page.height - margins * 2 };
}

/** True when a section has any displayable content. */
export function sectionHasContent(id: SectionId, state: ResumeState): boolean {
  const d = state.data;
  if (id.startsWith("custom:")) {
    const c = d.customSections.find((s) => `custom:${s.id}` === id);
    return Boolean(c && c.entries.some((e) => [e.heading, e.subheading, e.details, ...e.bullets].some(Boolean)));
  }
  switch (id) {
    case "summary": return Boolean(d.personal.summary.trim());
    case "experience": return d.experience.some((e) => [e.jobTitle, e.company, e.description, ...e.bullets].some(Boolean));
    case "education": return d.education.some((e) => [e.institution, e.degree, e.details].some(Boolean));
    case "skills": return d.skills.some((s) => s.items.some(Boolean));
    case "projects": return d.projects.some((p) => [p.name, p.description, ...p.achievements].some(Boolean));
    case "certifications": return d.certifications.some((x) => x.name);
    case "languages": return d.languages.some((x) => x.name);
    case "awards": return d.awards.some((x) => x.name);
    case "volunteer": return d.volunteer.some((x) => x.role || x.organization);
    case "publications": return d.publications.some((x) => x.title);
    case "courses": return d.courses.some((x) => x.name);
    case "activities": return d.activities.some((x) => x.name);
    case "interests": return d.interests.some(Boolean);
    case "references": return d.references.some((x) => x.name || x.availableOnRequest);
    default: return false;
  }
}
