import type { CoreSectionId, FontFamilyId } from "./resume";

export type TemplateCategory =
  | "professional"
  | "modern"
  | "students"
  | "technology"
  | "creative"
  | "specialized";

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  professional: "Professional & Corporate",
  modern: "Modern & Minimalist",
  students: "Students & Freshers",
  technology: "Technology & Engineering",
  creative: "Creative & Design",
  specialized: "Specialized Layouts",
};

export type StyleTag =
  | "Minimal"
  | "Professional"
  | "Creative"
  | "ATS-Friendly"
  | "Modern"
  | "Classic"
  | "Academic"
  | "Technical"
  | "Compact"
  | "Two-Column"
  | "Photo"
  | "Executive";

export type AudienceTag =
  | "Students"
  | "Freshers"
  | "Experienced"
  | "Developers"
  | "Designers"
  | "Managers"
  | "Researchers"
  | "Career Changers";

/** Layout archetypes implemented by the shared renderer. */
export type LayoutId =
  | "classic"
  | "centered"
  | "split-header"
  | "band"
  | "sidebar-left"
  | "sidebar-right"
  | "dark-sidebar"
  | "timeline"
  | "editorial"
  | "compact"
  | "academic"
  | "grid"
  | "monogram"
  | "boxed"
  | "portfolio"
  | "rail"
  | "columns"
  | "stacked"
  | "minimal-line"
  | "header-table"
  | "banner-sidebar"
  | "serif-columns";

export type HeadingStyle =
  | "rule"
  | "double-rule"
  | "underline"
  | "caps"
  | "boxed"
  | "pill"
  | "numbered"
  | "left-rule"
  | "plain"
  | "dot"
  | "banner"
  | "bracket"
  | "dotted";

export type HeaderStyle =
  | "plain"
  | "centered"
  | "band"
  | "split"
  | "monogram"
  | "photo"
  | "boxed"
  | "two-tone"
  | "rule"
  | "grid"
  | "initials"
  | "minimal"
  | "overline";

export type BulletStyle = "dot" | "square" | "dash" | "arrow" | "none";
export type Density = "compact" | "normal" | "relaxed";
export type ItemStyle = "standard" | "timeline" | "table" | "card" | "inline";

export interface TemplatePalette {
  accent: string;
  ink: string;
  muted: string;
  line: string;
  surface: string;
  soft: string;
  dark?: boolean; // dark sidebar / band
}

export interface TemplateCapabilities {
  accentColor: boolean;
  fontFamily: boolean;
  fontSize: boolean;
  sectionSpacing: boolean;
  lineSpacing: boolean;
  margins: boolean;
  pageSize: boolean;
  columns: boolean;
  photo: boolean;
  skillBars: boolean;
  icons: boolean;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  styles: StyleTag[];
  audiences: AudienceTag[];
  description: string;
  layout: LayoutId;
  headerStyle: HeaderStyle;
  headingStyle: HeadingStyle;
  headingAlign?: "left" | "center" | "right";
  bulletStyle: BulletStyle;
  itemStyle?: ItemStyle;
  density: Density;
  palette: TemplatePalette;
  font: FontFamilyId;
  headingFont?: FontFamilyId;
  uppercaseName?: boolean;
  uppercaseHeadings?: boolean;
  sidebarSections?: CoreSectionId[];
  sidebarWidth?: number; // percent of page inner width
  sidebarDark?: boolean;
  showRuleDividers?: boolean;
  showPageNumbers?: boolean;
  showSkillBars?: boolean;
  showPhoto?: boolean;
  showIcons?: boolean;
  capabilities: TemplateCapabilities;
  /** Default section order for this template. */
  sectionOrder: CoreSectionId[];
  featured?: boolean;
}
