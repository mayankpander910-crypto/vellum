import type {
  TemplateCapabilities,
  TemplateCategory,
  TemplateDefinition,
  TemplatePalette,
} from "@/types/template";
import { CORE_SECTION_IDS, type CoreSectionId } from "@/types/resume";

/* ------------------------------------------------------------------ */
/* Palettes                                                            */
/* ------------------------------------------------------------------ */
const PALETTES = {
  indigo: p("#4c47e8"),
  navy: p("#1f3a68"),
  slate: p("#3d4a60"),
  teal: p("#0e7c86"),
  emerald: p("#16825d"),
  green: p("#2f6b3c"),
  violet: p("#6d4bd8"),
  purple: p("#7c3aed"),
  plum: p("#7b3f6b"),
  burgundy: p("#7a2f43"),
  coral: p("#d95d48"),
  orange: p("#c2611f"),
  amber: p("#a8700d"),
  rose: p("#a84a68"),
  pink: p("#c0427a"),
  steel: p("#3a6073"),
  cyan: p("#0f6f8c"),
  black: p("#22242b"),
  inkblack: p("#111318"),
  forest: p("#245044"),
  red: p("#b23b34"),
} satisfies Record<string, TemplatePalette>;

function p(accent: string): TemplatePalette {
  return {
    accent,
    ink: "#1d2030",
    muted: "#5d6478",
    line: "#dfe2ea",
    surface: "#ffffff",
    soft: "#f2f3f8",
  };
}

const FULL: TemplateCapabilities = {
  accentColor: true,
  fontFamily: true,
  fontSize: true,
  sectionSpacing: true,
  lineSpacing: true,
  margins: true,
  pageSize: true,
  columns: true,
  photo: true,
  skillBars: true,
  icons: true,
};

const ATS_CAPS: TemplateCapabilities = {
  accentColor: false,
  fontFamily: true,
  fontSize: true,
  sectionSpacing: true,
  lineSpacing: true,
  margins: true,
  pageSize: true,
  columns: false,
  photo: false,
  skillBars: false,
  icons: false,
};

type TemplateInput = Omit<TemplateDefinition, "capabilities" | "sectionOrder" | "palette"> & {
  palette?: keyof typeof PALETTES;
  sectionOrder?: CoreSectionId[];
  capabilities?: Partial<TemplateCapabilities>;
};

const DEFAULT_ORDER: CoreSectionId[] = CORE_SECTION_IDS.filter((s) => s !== "references");

export const TWO_COLUMN_LAYOUTS = [
  "sidebar-left", "sidebar-right", "dark-sidebar", "banner-sidebar", "columns", "serif-columns",
];

function make(t: TemplateInput): TemplateDefinition {
  const palette = PALETTES[t.palette ?? "indigo"] ?? PALETTES.indigo!;
  const derived: Partial<TemplateCapabilities> = {
    columns: TWO_COLUMN_LAYOUTS.includes(t.layout),
    photo: Boolean(t.showPhoto),
    skillBars: Boolean(t.showSkillBars),
  };
  return {
    ...t,
    palette: { ...palette, dark: t.sidebarDark || t.headerStyle === "band" || undefined },
    sectionOrder: t.sectionOrder ?? DEFAULT_ORDER,
    capabilities: { ...FULL, ...derived, ...(t.capabilities ?? {}) },
  };
}

const SKILLS_FIRST: CoreSectionId[] = [
  "summary", "skills", "experience", "projects", "education", "certifications",
  "languages", "awards", "volunteer", "publications", "courses", "activities", "interests",
];

const PROJECTS_FIRST: CoreSectionId[] = [
  "summary", "projects", "skills", "education", "experience", "certifications",
  "courses", "awards", "activities", "languages", "volunteer", "publications", "interests",
];

const ACADEMIC_ORDER: CoreSectionId[] = [
  "summary", "education", "publications", "experience", "skills", "projects",
  "awards", "courses", "certifications", "languages", "volunteer", "activities", "interests", "references",
];

const SIDEBAR_SECTIONS: CoreSectionId[] = ["skills", "languages", "certifications", "interests", "courses", "awards"];

/* ------------------------------------------------------------------ */
/* 50 distinct templates. Each entry changes layout, hierarchy,         */
/* typography, density and ornamentation — not just the accent colour.  */
/* ------------------------------------------------------------------ */
export const TEMPLATES: TemplateDefinition[] = [
  // A. Professional & corporate -------------------------------------
  make({
    id: "classic-professional", name: "Classic Professional", category: "professional",
    styles: ["Classic", "Professional", "ATS-Friendly"], audiences: ["Experienced"],
    description: "Timeless serif headings with a strong rule — the safest choice for any industry.",
    layout: "classic", headerStyle: "rule", headingStyle: "rule", bulletStyle: "dot",
    density: "normal", palette: "navy", font: "serif", uppercaseHeadings: true, showRuleDividers: true,
    featured: true,
  }),
  make({
    id: "executive", name: "Executive", category: "professional",
    styles: ["Executive", "Professional", "Two-Column"], audiences: ["Managers", "Experienced"],
    description: "A bold colour band and double-rule sections for senior leadership profiles.",
    layout: "band", headerStyle: "band", headingStyle: "double-rule", bulletStyle: "square",
    density: "relaxed", palette: "burgundy", font: "editorial", uppercaseHeadings: true,
    showPageNumbers: true, featured: true,
  }),
  make({
    id: "modern-corporate", name: "Modern Corporate", category: "professional",
    styles: ["Modern", "Professional"], audiences: ["Experienced", "Managers"],
    description: "Split name/contact header with crisp left-rule section markers.",
    layout: "split-header", headerStyle: "split", headingStyle: "left-rule", bulletStyle: "dot",
    density: "normal", palette: "indigo", font: "sans", showIcons: true,
  }),
  make({
    id: "clean-business", name: "Clean Business", category: "professional",
    styles: ["Minimal", "Professional"], audiences: ["Experienced"],
    description: "Centered contact block and widely tracked caps headings for a calm first impression.",
    layout: "centered", headerStyle: "centered", headingStyle: "caps", bulletStyle: "dash",
    density: "relaxed", palette: "teal", font: "humanist", uppercaseHeadings: true,
  }),
  make({
    id: "formal-minimal", name: "Formal Minimal", category: "professional",
    styles: ["Classic", "Minimal", "ATS-Friendly"], audiences: ["Experienced"],
    description: "Strict black-on-white formality with underlined headings and no ornament.",
    layout: "minimal-line", headerStyle: "plain", headingStyle: "underline", bulletStyle: "none",
    density: "normal", palette: "black", font: "serif",
    capabilities: ATS_CAPS,
  }),
  make({
    id: "two-column-professional", name: "Two-Column Professional", category: "professional",
    styles: ["Two-Column", "Professional"], audiences: ["Experienced", "Managers"],
    description: "A dedicated left rail for skills and languages, with boxed section titles.",
    layout: "sidebar-left", headerStyle: "rule", headingStyle: "boxed", bulletStyle: "dash",
    density: "normal", palette: "slate", font: "sans", sidebarSections: SIDEBAR_SECTIONS, sidebarWidth: 32,
  }),
  make({
    id: "senior-management", name: "Senior Management", category: "professional",
    styles: ["Executive", "Classic"], audiences: ["Managers", "Experienced"],
    description: "Tabular header and full-width banner headings that read like a board biography.",
    layout: "header-table", headerStyle: "grid", headingStyle: "banner", bulletStyle: "square",
    density: "normal", palette: "navy", font: "serif", uppercaseHeadings: true, showPageNumbers: true,
  }),
  make({
    id: "consulting-professional", name: "Consulting Professional", category: "professional",
    styles: ["Professional", "Compact", "Modern"], audiences: ["Experienced", "Managers"],
    description: "Numbered sections in a dense two-column body, modelled on consulting CVs.",
    layout: "columns", headerStyle: "two-tone", headingStyle: "numbered", bulletStyle: "dash",
    density: "compact", palette: "steel", font: "grotesk",
  }),

  // B. Modern & minimalist ------------------------------------------
  make({
    id: "modern-minimal", name: "Modern Minimal", category: "modern",
    styles: ["Minimal", "Modern", "ATS-Friendly"], audiences: ["Experienced", "Freshers"],
    description: "Generous whitespace, a fine hairline and quiet typography.",
    layout: "minimal-line", headerStyle: "minimal", headingStyle: "plain", bulletStyle: "dot",
    density: "relaxed", palette: "indigo", font: "sans", featured: true,
  }),
  make({
    id: "swiss-minimal", name: "Swiss Minimal", category: "modern",
    styles: ["Minimal", "Modern", "Creative"], audiences: ["Designers", "Experienced"],
    description: "Strict grid, numbered headings and a single red accent point.",
    layout: "grid", headerStyle: "overline", headingStyle: "numbered", bulletStyle: "none",
    density: "normal", palette: "red", font: "grotesk", uppercaseName: true, uppercaseHeadings: true,
  }),
  make({
    id: "clean-typography", name: "Clean Typography", category: "modern",
    styles: ["Minimal", "Classic"], audiences: ["Experienced", "Designers"],
    description: "Editorial type scale with bracketed section labels and no boxes.",
    layout: "stacked", headerStyle: "plain", headingStyle: "bracket", bulletStyle: "dot",
    density: "relaxed", palette: "inkblack", font: "editorial",
  }),
  make({
    id: "elegant-monochrome", name: "Elegant Monochrome", category: "modern",
    styles: ["Minimal", "Classic", "ATS-Friendly"], audiences: ["Experienced"],
    description: "A centered serif masthead with delicate dotted separators, entirely greyscale.",
    layout: "centered", headerStyle: "centered", headingStyle: "dotted", bulletStyle: "square",
    density: "normal", palette: "black", font: "serif", uppercaseName: true,
    capabilities: { ...ATS_CAPS },
  }),
  make({
    id: "compact-one-page", name: "Compact One-Page", category: "modern",
    styles: ["Compact", "Minimal", "ATS-Friendly"], audiences: ["Students", "Freshers", "Experienced"],
    description: "Tight vertical rhythm that fits a surprising amount of detail on one page.",
    layout: "compact", headerStyle: "minimal", headingStyle: "caps", bulletStyle: "dash",
    density: "compact", palette: "navy", font: "sans", uppercaseHeadings: true,
  }),
  make({
    id: "modern-sidebar", name: "Modern Sidebar", category: "modern",
    styles: ["Two-Column", "Modern"], audiences: ["Experienced", "Developers"],
    description: "Right-hand rail with a soft tint and pill-shaped section headings.",
    layout: "sidebar-right", headerStyle: "split", headingStyle: "pill", bulletStyle: "dot",
    density: "normal", palette: "violet", font: "sans", sidebarSections: SIDEBAR_SECTIONS, sidebarWidth: 30,
  }),
  make({
    id: "simple-ats-friendly", name: "Simple ATS-Friendly", category: "modern",
    styles: ["ATS-Friendly", "Minimal"], audiences: ["Freshers", "Experienced", "Career Changers"],
    description: "Single column, standard headings, zero graphics — built for applicant tracking systems.",
    layout: "classic", headerStyle: "plain", headingStyle: "underline", bulletStyle: "dot",
    density: "normal", palette: "inkblack", font: "sans",
    capabilities: ATS_CAPS, featured: true,
  }),
  make({
    id: "structured-professional", name: "Structured Professional", category: "modern",
    styles: ["Professional", "Modern", "Two-Column"], audiences: ["Experienced", "Managers"],
    description: "Framed content area with ruled dividers between every entry.",
    layout: "boxed", headerStyle: "boxed", headingStyle: "rule", bulletStyle: "square",
    density: "normal", palette: "teal", font: "humanist", showRuleDividers: true,
  }),

  // C. Students & freshers ------------------------------------------
  make({
    id: "student-starter", name: "Student Starter", category: "students",
    styles: ["Minimal", "ATS-Friendly"], audiences: ["Students", "Freshers"],
    description: "Friendly rounded type and an education-first order for first applications.",
    layout: "classic", headerStyle: "minimal", headingStyle: "dot", bulletStyle: "dot",
    density: "normal", palette: "indigo", font: "rounded",
    sectionOrder: ["summary", "education", "skills", "projects", "experience", "activities", "awards", "certifications", "courses", "languages", "volunteer", "publications", "interests"],
  }),
  make({
    id: "fresher-resume", name: "Fresher Resume", category: "students",
    styles: ["Modern", "ATS-Friendly"], audiences: ["Freshers", "Students"],
    description: "Balanced layout that puts projects and internships ahead of work history.",
    layout: "split-header", headerStyle: "split", headingStyle: "pill", bulletStyle: "dash",
    density: "normal", palette: "emerald", font: "sans", sectionOrder: PROJECTS_FIRST,
  }),
  make({
    id: "graduate-professional", name: "Graduate Professional", category: "students",
    styles: ["Classic", "Professional"], audiences: ["Students", "Freshers"],
    description: "Traditional serif structure with a prominent degree and coursework block.",
    layout: "academic", headerStyle: "rule", headingStyle: "rule", bulletStyle: "dot",
    density: "normal", palette: "navy", font: "serif", uppercaseHeadings: true,
  }),
  make({
    id: "internship-resume", name: "Internship Resume", category: "students",
    styles: ["Modern", "Creative"], audiences: ["Students", "Freshers"],
    description: "A vertical timeline that turns a handful of internships into a clear story.",
    layout: "timeline", headerStyle: "overline", headingStyle: "underline", bulletStyle: "arrow",
    density: "normal", palette: "orange", font: "humanist", itemStyle: "timeline",
  }),
  make({
    id: "campus-placement", name: "Campus Placement", category: "students",
    styles: ["ATS-Friendly", "Compact"], audiences: ["Students", "Freshers"],
    description: "Tabulated header and caps headings designed for placement-cell shortlisting.",
    layout: "header-table", headerStyle: "grid", headingStyle: "caps", bulletStyle: "square",
    density: "compact", palette: "indigo", font: "sans", uppercaseHeadings: true,
  }),
  make({
    id: "academic-starter", name: "Academic Starter", category: "students",
    styles: ["Academic", "Classic"], audiences: ["Students", "Researchers"],
    description: "Research-friendly hierarchy with publications and references close to the top.",
    layout: "academic", headerStyle: "centered", headingStyle: "plain", bulletStyle: "none",
    density: "normal", palette: "black", font: "serif", sectionOrder: ACADEMIC_ORDER, showPageNumbers: true,
  }),
  make({
    id: "project-focused-resume", name: "Project-Focused Resume", category: "students",
    styles: ["Modern", "Technical"], audiences: ["Students", "Freshers", "Developers"],
    description: "Card-style project blocks lead the page when work experience is thin.",
    layout: "grid", headerStyle: "minimal", headingStyle: "boxed", bulletStyle: "dot",
    density: "normal", palette: "purple", font: "sans", sectionOrder: PROJECTS_FIRST, itemStyle: "card",
  }),
  make({
    id: "entry-level-technical", name: "Entry-Level Technical", category: "students",
    styles: ["Technical", "Modern"], audiences: ["Developers", "Freshers", "Students"],
    description: "Monogram badge and bracketed labels give a clean engineering feel.",
    layout: "monogram", headerStyle: "initials", headingStyle: "bracket", bulletStyle: "dash",
    density: "compact", palette: "cyan", font: "grotesk", sectionOrder: PROJECTS_FIRST,
  }),

  // D. Technology & engineering -------------------------------------
  make({
    id: "software-developer", name: "Software Developer", category: "technology",
    styles: ["Technical", "Modern", "ATS-Friendly"], audiences: ["Developers", "Experienced"],
    description: "Accent rail down the margin with compact left-rule headings and dense bullets.",
    layout: "rail", headerStyle: "minimal", headingStyle: "left-rule", bulletStyle: "dash",
    density: "compact", palette: "indigo", font: "grotesk", featured: true,
  }),
  make({
    id: "frontend-developer", name: "Frontend Developer", category: "technology",
    styles: ["Technical", "Creative", "Modern"], audiences: ["Developers", "Designers"],
    description: "Two-column skill tags and pill headings with a bright technical accent.",
    layout: "columns", headerStyle: "two-tone", headingStyle: "pill", bulletStyle: "dot",
    density: "normal", palette: "pink", font: "sans",
  }),
  make({
    id: "backend-developer", name: "Backend Developer", category: "technology",
    styles: ["Technical", "Two-Column"], audiences: ["Developers", "Experienced"],
    description: "Dark left rail for tooling stacks, monospace details in the main column.",
    layout: "dark-sidebar", headerStyle: "split", headingStyle: "bracket", bulletStyle: "square",
    density: "compact", palette: "green", font: "mono", sidebarSections: ["skills", "certifications", "languages", "courses"],
    sidebarWidth: 31, sidebarDark: true,
  }),
  make({
    id: "full-stack-developer", name: "Full-Stack Developer", category: "technology",
    styles: ["Technical", "Two-Column", "Modern"], audiences: ["Developers", "Experienced"],
    description: "A tinted banner sidebar keeps a broad stack readable at a glance.",
    layout: "banner-sidebar", headerStyle: "band", headingStyle: "dot", bulletStyle: "dot",
    density: "normal", palette: "steel", font: "sans", sidebarSections: ["skills", "languages", "certifications", "interests"],
    sidebarWidth: 30,
  }),
  make({
    id: "data-analyst", name: "Data Analyst", category: "technology",
    styles: ["Technical", "Professional", "Compact"], audiences: ["Developers", "Experienced"],
    description: "Tabular header and numbered sections emphasise metrics and impact.",
    layout: "header-table", headerStyle: "grid", headingStyle: "numbered", bulletStyle: "arrow",
    density: "compact", palette: "teal", font: "humanist",
  }),
  make({
    id: "ai-ml-engineer", name: "AI/ML Engineer", category: "technology",
    styles: ["Technical", "Modern", "Academic"], audiences: ["Developers", "Researchers"],
    description: "Clean split header with publication-ready structure for research-heavy profiles.",
    layout: "split-header", headerStyle: "split", headingStyle: "dot", bulletStyle: "dash",
    density: "normal", palette: "violet", font: "grotesk",
    sectionOrder: ["summary", "skills", "experience", "projects", "publications", "education", "certifications", "awards", "courses", "languages", "volunteer", "activities", "interests"],
  }),
  make({
    id: "ui-ux-designer", name: "UI/UX Designer", category: "technology",
    styles: ["Creative", "Modern", "Photo"], audiences: ["Designers", "Developers"],
    description: "Portfolio-like project grid with soft type and a coral accent.",
    layout: "portfolio", headerStyle: "photo", headingStyle: "plain", bulletStyle: "none",
    density: "relaxed", palette: "coral", font: "rounded", showPhoto: true, itemStyle: "card",
    sectionOrder: ["summary", "projects", "experience", "skills", "education", "certifications", "awards", "courses", "languages", "volunteer", "publications", "activities", "interests"],
  }),
  make({
    id: "it-professional", name: "IT Professional", category: "technology",
    styles: ["Technical", "Professional", "Photo"], audiences: ["Developers", "Experienced"],
    description: "Framed document with banner headings and optional photo, popular for IT roles.",
    layout: "boxed", headerStyle: "photo", headingStyle: "banner", bulletStyle: "square",
    density: "normal", palette: "navy", font: "sans", showPhoto: true,
  }),

  // E. Creative & design --------------------------------------------
  make({
    id: "creative-portfolio", name: "Creative Portfolio", category: "creative",
    styles: ["Creative", "Modern"], audiences: ["Designers", "Career Changers"],
    description: "Editorial portfolio layout with bracket labels and an oversized name.",
    layout: "portfolio", headerStyle: "overline", headingStyle: "bracket", bulletStyle: "arrow",
    density: "relaxed", palette: "orange", font: "editorial", uppercaseName: true, featured: true,
  }),
  make({
    id: "graphic-designer", name: "Graphic Designer", category: "creative",
    styles: ["Creative", "Two-Column", "Minimal"], audiences: ["Designers"],
    description: "High-contrast grid with pill tags for tools and a bold mustard accent.",
    layout: "grid", headerStyle: "grid", headingStyle: "pill", bulletStyle: "none",
    density: "normal", palette: "amber", font: "rounded", uppercaseName: true,
  }),
  make({
    id: "visual-designer", name: "Visual Designer", category: "creative",
    styles: ["Creative", "Modern", "Photo"], audiences: ["Designers"],
    description: "Full-width colour band behind the name with a circular portrait option.",
    layout: "band", headerStyle: "band", headingStyle: "plain", bulletStyle: "dot",
    density: "relaxed", palette: "plum", font: "humanist", showPhoto: true,
  }),
  make({
    id: "modern-creative", name: "Modern Creative", category: "creative",
    styles: ["Creative", "Two-Column", "Modern"], audiences: ["Designers", "Freshers"],
    description: "Right rail with circular skill meters and rounded section headings.",
    layout: "sidebar-right", headerStyle: "minimal", headingStyle: "pill", bulletStyle: "arrow",
    density: "normal", palette: "coral", font: "humanist", sidebarSections: SIDEBAR_SECTIONS,
    sidebarWidth: 33, showSkillBars: true,
  }),
  make({
    id: "editorial-resume", name: "Editorial Resume", category: "creative",
    styles: ["Creative", "Classic"], audiences: ["Designers", "Experienced"],
    description: "Newspaper-inspired double rules, drop-cap initials and literary spacing.",
    layout: "editorial", headerStyle: "centered", headingStyle: "double-rule", bulletStyle: "dash",
    density: "relaxed", palette: "inkblack", font: "editorial", uppercaseHeadings: true,
  }),
  make({
    id: "elegant-creative", name: "Elegant Creative", category: "creative",
    styles: ["Creative", "Minimal", "Photo"], audiences: ["Designers", "Experienced"],
    description: "Centered rose-tinted masthead with dotted rules and optional portrait.",
    layout: "centered", headerStyle: "centered", headingStyle: "dotted", bulletStyle: "none",
    density: "relaxed", palette: "rose", font: "editorial", showPhoto: true,
  }),

  // F. Specialized layouts ------------------------------------------
  make({
    id: "academic-cv", name: "Academic CV", category: "specialized",
    styles: ["Academic", "Classic", "ATS-Friendly"], audiences: ["Researchers", "Experienced"],
    description: "Long-form CV structure with publications, references and page numbers.",
    layout: "academic", headerStyle: "centered", headingStyle: "plain", bulletStyle: "none",
    density: "normal", palette: "black", font: "serif", sectionOrder: ACADEMIC_ORDER,
    showPageNumbers: true,
  }),
  make({
    id: "research-resume", name: "Research Resume", category: "specialized",
    styles: ["Academic", "Two-Column", "Classic"], audiences: ["Researchers"],
    description: "Serif two-column body with numbered sections for grants and papers.",
    layout: "serif-columns", headerStyle: "rule", headingStyle: "numbered", bulletStyle: "square",
    density: "normal", palette: "navy", font: "serif", sectionOrder: ACADEMIC_ORDER,
  }),
  make({
    id: "product-manager", name: "Product Manager", category: "specialized",
    styles: ["Modern", "Professional"], audiences: ["Managers", "Experienced"],
    description: "Outcome-first split header with left-rule sections for product impact.",
    layout: "split-header", headerStyle: "split", headingStyle: "left-rule", bulletStyle: "arrow",
    density: "normal", palette: "purple", font: "sans",
  }),
  make({
    id: "marketing-professional", name: "Marketing Professional", category: "specialized",
    styles: ["Creative", "Professional"], audiences: ["Experienced", "Career Changers"],
    description: "Warm colour band with boxed headings that frame campaign results.",
    layout: "band", headerStyle: "band", headingStyle: "boxed", bulletStyle: "arrow",
    density: "normal", palette: "orange", font: "humanist",
  }),
  make({
    id: "sales-professional", name: "Sales Professional", category: "specialized",
    styles: ["Professional", "Compact"], audiences: ["Experienced", "Career Changers"],
    description: "Metrics-forward table header and strong rules for quota achievements.",
    layout: "header-table", headerStyle: "grid", headingStyle: "rule", bulletStyle: "square",
    density: "compact", palette: "emerald", font: "sans", uppercaseHeadings: true,
  }),
  make({
    id: "project-manager", name: "Project Manager", category: "specialized",
    styles: ["Professional", "Modern", "Two-Column"], audiences: ["Managers", "Experienced"],
    description: "Dense numbered columns with clear phase and delivery chronology.",
    layout: "columns", headerStyle: "two-tone", headingStyle: "numbered", bulletStyle: "dash",
    density: "compact", palette: "steel", font: "sans",
  }),
  make({
    id: "finance-professional", name: "Finance Professional", category: "specialized",
    styles: ["Classic", "Professional", "ATS-Friendly"], audiences: ["Experienced"],
    description: "Conservative serif document with double-rule headings and dense figures.",
    layout: "classic", headerStyle: "rule", headingStyle: "double-rule", bulletStyle: "square",
    density: "compact", palette: "navy", font: "serif", uppercaseHeadings: true,
  }),
  make({
    id: "healthcare-professional", name: "Healthcare Professional", category: "specialized",
    styles: ["Professional", "Two-Column", "Photo"], audiences: ["Experienced", "Career Changers"],
    description: "Calm teal sidebar for licences and languages, with an optional photo.",
    layout: "sidebar-left", headerStyle: "photo", headingStyle: "pill", bulletStyle: "dot",
    density: "normal", palette: "teal", font: "humanist", sidebarSections: ["certifications", "skills", "languages", "courses", "volunteer"],
    sidebarWidth: 31, showPhoto: true,
  }),
  make({
    id: "career-change-resume", name: "Career Change Resume", category: "specialized",
    styles: ["Modern", "ATS-Friendly", "Creative"], audiences: ["Career Changers", "Experienced"],
    description: "Functional, skills-first hierarchy that reframes transferable experience.",
    layout: "monogram", headerStyle: "initials", headingStyle: "bracket", bulletStyle: "arrow",
    density: "normal", palette: "amber", font: "humanist", sectionOrder: SKILLS_FIRST,
  }),
  make({
    id: "experienced-professional", name: "Experienced Professional", category: "specialized",
    styles: ["Professional", "Executive", "Classic"], audiences: ["Experienced", "Managers"],
    description: "Two-page friendly executive layout with a strong band and banner headings.",
    layout: "band", headerStyle: "band", headingStyle: "banner", bulletStyle: "dash",
    density: "normal", palette: "slate", font: "editorial", showPageNumbers: true,
  }),
  make({
    id: "international-resume", name: "International Resume", category: "specialized",
    styles: ["Professional", "Photo", "Classic"], audiences: ["Experienced", "Freshers"],
    description: "Photo-ready header with location and language emphasis for global applications.",
    layout: "split-header", headerStyle: "photo", headingStyle: "rule", bulletStyle: "dot",
    density: "normal", palette: "navy", font: "serif", showPhoto: true,
    sectionOrder: ["summary", "experience", "education", "languages", "skills", "projects", "certifications", "awards", "courses", "volunteer", "publications", "activities", "interests", "references"],
  }),
  make({
    id: "simple-black-and-white", name: "Simple Black and White", category: "specialized",
    styles: ["ATS-Friendly", "Minimal", "Classic"], audiences: ["Freshers", "Experienced", "Career Changers"],
    description: "Pure text, no colour, standard headings — prints perfectly on any printer.",
    layout: "minimal-line", headerStyle: "plain", headingStyle: "plain", bulletStyle: "square",
    density: "normal", palette: "inkblack", font: "sans", capabilities: ATS_CAPS, featured: true,
  }),
];

if (TEMPLATES.length < 40) {
  throw new Error("Template registry must contain at least 40 templates");
}

export const DEFAULT_TEMPLATE_ID = "modern-minimal";

export function getTemplate(id: string | null | undefined): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES.find((t) => t.id === DEFAULT_TEMPLATE_ID)!;
}

export const STYLE_TAGS = [
  "Minimal", "Professional", "Creative", "ATS-Friendly", "Modern", "Classic",
  "Academic", "Technical", "Compact", "Two-Column", "Photo", "Executive",
] as const;

export const AUDIENCE_TAGS = [
  "Students", "Freshers", "Experienced", "Developers", "Designers", "Managers",
  "Researchers", "Career Changers",
] as const;

export const TEMPLATE_CATEGORIES: { id: TemplateCategory | "all"; label: string }[] = [
  { id: "all", label: "All templates" },
  { id: "professional", label: "Professional" },
  { id: "modern", label: "Modern" },
  { id: "students", label: "Students" },
  { id: "technology", label: "Technology" },
  { id: "creative", label: "Creative" },
  { id: "specialized", label: "Specialized" },
];

export function templateHref(id: string) {
  return `/builder/?template=${encodeURIComponent(id)}`;
}
