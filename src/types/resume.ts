/**
 * The structured resume data model. Everything the renderer draws comes from
 * this shape — templates are pure presentation definitions (see template.ts).
 */

export type ID = string;

export interface PersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
  photo: string; // data URL, stored only in browser memory
  summary: string;
}

export interface ExperienceEntry {
  id: ID;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface EducationEntry {
  id: ID;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  details: string;
}

export interface SkillGroup {
  id: ID;
  category: string;
  items: string[]; // "Skill" or "Skill~level(0-100)" for skill bars
}

export interface ProjectEntry {
  id: ID;
  name: string;
  description: string;
  technologies: string;
  url: string;
  achievements: string[];
}

export interface CertificationEntry {
  id: ID;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface LanguageEntry {
  id: ID;
  name: string;
  proficiency: string;
}

export interface AwardEntry {
  id: ID;
  name: string;
  issuer: string;
  date: string;
  details: string;
}

export interface VolunteerEntry {
  id: ID;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface PublicationEntry {
  id: ID;
  title: string;
  publisher: string;
  date: string;
  url: string;
  details: string;
}

export interface CourseEntry {
  id: ID;
  name: string;
  provider: string;
  date: string;
  details: string;
}

export interface ActivityEntry {
  id: ID;
  name: string;
  role: string;
  details: string;
}

export interface ReferenceEntry {
  id: ID;
  name: string;
  title: string;
  contact: string;
  availableOnRequest?: boolean;
}

export interface CustomSection {
  id: ID;
  title: string;
  entries: { id: ID; heading: string; subheading: string; date: string; details: string; bullets: string[] }[];
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  awards: AwardEntry[];
  volunteer: VolunteerEntry[];
  publications: PublicationEntry[];
  courses: CourseEntry[];
  activities: ActivityEntry[];
  interests: string[];
  references: ReferenceEntry[];
  customSections: CustomSection[];
}

export type CoreSectionId =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "awards"
  | "volunteer"
  | "publications"
  | "courses"
  | "activities"
  | "interests"
  | "references";

export type SectionId = CoreSectionId | `custom:${string}`;

export const CORE_SECTION_IDS: CoreSectionId[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "volunteer",
  "publications",
  "courses",
  "activities",
  "interests",
  "references",
];

export const SECTION_LABELS: Record<CoreSectionId, string> = {
  summary: "Professional Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards & Honors",
  volunteer: "Volunteer Experience",
  publications: "Publications",
  courses: "Courses",
  activities: "Activities",
  interests: "Interests",
  references: "References",
};

export type FontFamilyId =
  | "sans"
  | "serif"
  | "humanist"
  | "grotesk"
  | "mono"
  | "slab"
  | "editorial"
  | "rounded";

export type PageSize = "a4" | "letter";
export type PresetId = "professional" | "minimal" | "modern" | "classic" | "creative";

export interface ContactVisibility {
  email: boolean;
  phone: boolean;
  location: boolean;
  linkedin: boolean;
  github: boolean;
  portfolio: boolean;
  website: boolean;
}

export interface Customization {
  preset: PresetId;
  accentColor: string;
  fontFamily: FontFamilyId;
  fontSize: number; // pt
  sectionSpacing: number; // px
  lineSpacing: number; // multiplier
  margins: number; // px
  pageSize: PageSize;
  columns: 1 | 2;
  showPhoto: boolean;
  showSkillBars: boolean;
  showIcons: boolean;
  showPageNumbers: boolean;
  contactVisibility: ContactVisibility;
  sectionOrder: SectionId[];
  hiddenSections: SectionId[];
}

export interface ResumeState {
  version: 1;
  templateId: string;
  data: ResumeData;
  customize: Customization;
}

export const FONT_STACKS: Record<FontFamilyId, { css: string; pdf: "helvetica" | "times" | "courier"; serif: boolean }> = {
  sans: { css: 'Arial, "Helvetica Neue", Helvetica, sans-serif', pdf: "helvetica", serif: false },
  serif: { css: 'Georgia, "Times New Roman", Times, serif', pdf: "times", serif: true },
  humanist: { css: '"Trebuchet MS", "Segoe UI", Tahoma, sans-serif', pdf: "helvetica", serif: false },
  grotesk: { css: '"Helvetica Neue", Helvetica, Arial, sans-serif', pdf: "helvetica", serif: false },
  mono: { css: '"Courier New", Courier, monospace', pdf: "courier", serif: false },
  slab: { css: '"Rockwell", "Courier New", Georgia, serif', pdf: "times", serif: true },
  editorial: { css: '"Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif', pdf: "times", serif: true },
  rounded: { css: '"Verdana", Geneva, "Segoe UI", sans-serif', pdf: "helvetica", serif: false },
};

export const FONT_LABELS: Record<FontFamilyId, string> = {
  sans: "Modern Sans",
  serif: "Classic Serif",
  humanist: "Humanist",
  grotesk: "Grotesk",
  mono: "Monospace",
  slab: "Slab Serif",
  editorial: "Editorial",
  rounded: "Friendly Sans",
};

/** Physical page sizes at 96 CSS px/inch. */
export const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string; pdf: [number, number] }> = {
  a4: { width: 794, height: 1123, label: "A4", pdf: [210, 297] },
  letter: { width: 816, height: 1056, label: "US Letter", pdf: [216, 279] }, // 279.4mm
};
