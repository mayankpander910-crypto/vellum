import { z } from "zod";
import {
  CORE_SECTION_IDS,
  type CoreSectionId,
  type Customization,
  type FontFamilyId,
  type PageSize,
  type PresetId,
  type ResumeState,
  type SectionId,
} from "@/types/resume";
import { createEmptyState, uid } from "./resume-utils";
import { getTemplate } from "@/data/templates";

const str = z.string().catch("");
const strArray = z.array(z.string()).catch([]);
const bool = z.boolean().catch(false);
const num = z.number().catch(10);
const idField = str.transform((v) => v || uid("imp"));
const sectionId = z.custom<SectionId>((v) => typeof v === "string");
const fontId = z.custom<FontFamilyId>((v) => typeof v === "string");
const pageSize = z.custom<PageSize>((v) => v === "a4" || v === "letter");
const presetId = z.custom<PresetId>((v) => typeof v === "string");

const personalSchema = z.object({
  fullName: str, headline: str, email: str, phone: str, city: str, country: str,
  linkedin: str, github: str, portfolio: str, website: str, photo: str, summary: str,
}).catch({
  fullName: "", headline: "", email: "", phone: "", city: "", country: "",
  linkedin: "", github: "", portfolio: "", website: "", photo: "", summary: "",
});

const experienceSchema = z.object({
  id: idField, jobTitle: str, company: str, location: str, startDate: str,
  endDate: str, current: bool, description: str, bullets: strArray,
});
const educationSchema = z.object({
  id: idField, institution: str, degree: str, field: str, startDate: str,
  endDate: str, grade: str, details: str,
});
const skillGroupSchema = z.object({ id: idField, category: str, items: strArray });
const projectSchema = z.object({
  id: idField, name: str, description: str, technologies: str, url: str, achievements: strArray,
});
const certificationSchema = z.object({ id: idField, name: str, issuer: str, date: str, url: str });
const languageSchema = z.object({ id: idField, name: str, proficiency: str });
const awardSchema = z.object({ id: idField, name: str, issuer: str, date: str, details: str });
const volunteerSchema = z.object({ id: idField, role: str, organization: str, startDate: str, endDate: str, details: str });
const publicationSchema = z.object({ id: idField, title: str, publisher: str, date: str, url: str, details: str });
const courseSchema = z.object({ id: idField, name: str, provider: str, date: str, details: str });
const activitySchema = z.object({ id: idField, name: str, role: str, details: str });
const referenceSchema = z.object({ id: idField, name: str, title: str, contact: str, availableOnRequest: bool });
const customSectionSchema = z.object({
  id: idField, title: str,
  entries: z.array(z.object({
    id: idField, heading: str, subheading: str, date: str, details: str, bullets: strArray,
  })).catch([]),
});

const dataSchema = z.object({
  personal: personalSchema,
  experience: z.array(experienceSchema).catch([]),
  education: z.array(educationSchema).catch([]),
  skills: z.array(skillGroupSchema).catch([]),
  projects: z.array(projectSchema).catch([]),
  certifications: z.array(certificationSchema).catch([]),
  languages: z.array(languageSchema).catch([]),
  awards: z.array(awardSchema).catch([]),
  volunteer: z.array(volunteerSchema).catch([]),
  publications: z.array(publicationSchema).catch([]),
  courses: z.array(courseSchema).catch([]),
  activities: z.array(activitySchema).catch([]),
  interests: strArray,
  references: z.array(referenceSchema).catch([]),
  customSections: z.array(customSectionSchema).catch([]),
});

const contactVisibilitySchema = z.object({
  email: bool, phone: bool, location: bool, linkedin: bool,
  github: bool, portfolio: bool, website: bool,
}).catch({ email: true, phone: true, location: true, linkedin: true, github: true, portfolio: true, website: true });

const customizeSchema = z.object({
  preset: presetId.catch("professional"),
  accentColor: str.catch("#4c47e8"),
  fontFamily: fontId.catch("sans"),
  fontSize: num.catch(10.2),
  sectionSpacing: num.catch(13),
  lineSpacing: num.catch(1.42),
  margins: num.catch(46),
  pageSize: pageSize.catch("a4"),
  columns: z.union([z.literal(1), z.literal(2)]).catch(1),
  showPhoto: bool, showSkillBars: bool, showIcons: bool, showPageNumbers: bool,
  contactVisibility: contactVisibilitySchema,
  sectionOrder: z.array(sectionId).catch([...CORE_SECTION_IDS] as CoreSectionId[]),
  hiddenSections: z.array(sectionId).catch([]),
});

/** Used by React Hook Form (permissive, with helpful inline messages). */
export const resumeFormSchema = z.object({
  version: z.literal(1).catch(1),
  templateId: str.catch("modern-minimal"),
  data: dataSchema,
  customize: customizeSchema,
}).superRefine((state, ctx) => {
  const p = state.data.personal;
  const email = p.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["data", "personal", "email"], message: "Enter a valid email address." });
  }
  const urlFields = ["linkedin", "github", "portfolio", "website"] as const;
  for (const key of urlFields) {
    const value = p[key].trim();
    if (value && /[\s]/.test(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["data", "personal", key], message: "Remove spaces from the link." });
    }
  }
  if (state.customize.fontSize < 7 || state.customize.fontSize > 16) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["customize", "fontSize"], message: "Choose a size between 7 and 16 pt." });
  }
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

/** Lenient parser for user-supplied JSON files. Never throws. */
export function parseImportedResume(raw: string): { ok: true; state: ResumeState } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ok: false, error: "That file does not contain a Vellum resume." };
  const obj = parsed as Record<string, unknown>;
  if (!("data" in obj) && !("customize" in obj) && !("templateId" in obj)) return { ok: false, error: "That file does not contain a Vellum resume." };
  const templateId = typeof obj.templateId === "string" ? obj.templateId : "modern-minimal";
  const fallback = createEmptyState(getTemplate(templateId).id);
  const merged = {
    version: 1,
    templateId: fallback.templateId,
    data: { ...fallback.data, ...(isObject(obj.data) ? obj.data : {}) },
    customize: { ...fallback.customize, ...(isObject(obj.customize) ? obj.customize : {}) },
  };
  const result = resumeFormSchema.safeParse(merged);
  if (!result.success) {
    // superRefine issues are content warnings, not structural failures — retry
    // with the structural schema so a typo in an email never blocks an import.
    const structural = z.object({
      version: z.literal(1).catch(1), templateId: str.catch(fallback.templateId),
      data: dataSchema, customize: customizeSchema,
    }).safeParse(merged);
    if (!structural.success) return { ok: false, error: "The file could not be read as a Vellum resume." };
    return { ok: true, state: structural.data as ResumeState };
  }
  const state = result.data as ResumeState;
  // Guarantee every known section appears exactly once in the order.
  const customIds = state.data.customSections.map((s) => `custom:${s.id}` as SectionId);
  const known = new Set<SectionId>([...CORE_SECTION_IDS, ...customIds]);
  const order = state.customize.sectionOrder.filter((s) => known.has(s));
  for (const s of known) if (!order.includes(s)) order.push(s);
  return { ok: true, state: { ...state, customize: { ...state.customize, sectionOrder: order } } };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === "object" && !Array.isArray(v);
}

export function validateCustomizationPatch(patch: unknown): Partial<Customization> {
  const parsed = customizeSchema.partial().safeParse(patch);
  return (parsed.success ? parsed.data : {}) as Partial<Customization>;
}
