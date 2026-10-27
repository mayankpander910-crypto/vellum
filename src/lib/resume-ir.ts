import type { CoreSectionId, ResumeState, SectionId } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { TWO_COLUMN_LAYOUTS } from "@/data/templates";
import { allSectionIds, sectionHasContent, sectionLabel } from "./resume-utils";

export type FlowColumn = "main" | "aside";
export type IconKey = "mail" | "phone" | "map" | "linkedin" | "github" | "globe" | "link";

export interface ContactItem {
  key: string;
  icon: IconKey;
  label: string;
  value: string;
}

export interface HeaderIR {
  name: string;
  headline: string;
  contacts: ContactItem[];
  photo: string;
  showPhoto: boolean;
  initials: string;
}

interface FlowBase {
  id: string;
  column: FlowColumn;
  sectionId?: string;
  keepWithNext?: boolean;
  gapBefore?: number;
  gapAfter?: number;
}

export type FlowBlock = FlowBase & (
  | { kind: "heading"; text: string; index: number }
  | { kind: "item"; title: string; subtitle?: string; meta?: string; date?: string }
  | { kind: "paragraph"; text: string; tone?: "body" | "muted" | "small" }
  | { kind: "bullets"; items: string[] }
  | { kind: "tags"; items: string[]; label?: string }
  | { kind: "skillRow"; label: string; value: string; level?: number }
  | { kind: "rule" }
  | { kind: "spacer"; size: number }
);

type WithoutColumn<T> = T extends unknown ? Omit<T, "column" | "sectionId" | "id"> & { id?: string } : never;
type BlockInput = WithoutColumn<FlowBlock>;

export interface ResumeIR {
  header: HeaderIR;
  main: FlowBlock[];
  aside: FlowBlock[];
  sectionIds: SectionId[];
  twoColumn: boolean;
  asideSections: SectionId[];
}

export function dateRange(start: string, end: string, current?: boolean): string {
  const right = current ? "Present" : end.trim();
  return [start.trim(), right].filter(Boolean).join(" — ");
}

function clean(value: string | undefined | null): string {
  return (value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}

export function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "CV";
}

const DEFAULT_SIDEBAR_SECTIONS: CoreSectionId[] = ["skills", "languages", "certifications", "courses"];

export function isTwoColumn(state: ResumeState, template: TemplateDefinition): boolean {
  return state.customize.columns === 2 && template.capabilities.columns && TWO_COLUMN_LAYOUTS.includes(template.layout);
}

/** Build the framework-agnostic rendering instructions shared by HTML + PDF. */
export function buildResumeIR(state: ResumeState, template: TemplateDefinition): ResumeIR {
  const { data: d, customize: c } = state;
  const p = d.personal;
  const twoColumn = isTwoColumn(state, template);
  const sidebarSections = new Set<string>(template.sidebarSections ?? DEFAULT_SIDEBAR_SECTIONS);
  const shown = allSectionIds(state).filter(
    (id) => !c.hiddenSections.includes(id) && sectionHasContent(id, state),
  );

  const contacts: ContactItem[] = [];
  const v = c.contactVisibility;
  if (v.email && clean(p.email)) contacts.push({ key: "email", icon: "mail", label: "Email", value: clean(p.email) });
  if (v.phone && clean(p.phone)) contacts.push({ key: "phone", icon: "phone", label: "Phone", value: clean(p.phone) });
  const location = [clean(p.city), clean(p.country)].filter(Boolean).join(", ");
  if (v.location && location) contacts.push({ key: "location", icon: "map", label: "Location", value: location });
  if (v.linkedin && clean(p.linkedin)) contacts.push({ key: "linkedin", icon: "linkedin", label: "LinkedIn", value: clean(p.linkedin) });
  if (v.github && clean(p.github)) contacts.push({ key: "github", icon: "github", label: "GitHub", value: clean(p.github) });
  if (v.portfolio && clean(p.portfolio)) contacts.push({ key: "portfolio", icon: "globe", label: "Portfolio", value: clean(p.portfolio) });
  if (v.website && clean(p.website)) contacts.push({ key: "website", icon: "link", label: "Website", value: clean(p.website) });

  const header: HeaderIR = {
    name: clean(p.fullName) || "Your Name",
    headline: clean(p.headline),
    contacts,
    photo: c.showPhoto && template.capabilities.photo ? p.photo || "" : "",
    showPhoto: Boolean(c.showPhoto && template.capabilities.photo),
    initials: initialsOf(clean(p.fullName) || "Your Name"),
  };

  const main: FlowBlock[] = [];
  const aside: FlowBlock[] = [];
  const itemGap = c.sectionSpacing * 0.62;
  const headingGap = 6;
  const sectionGap = c.sectionSpacing;
  let index = 0;

  for (const id of shown) {
    index += 1;
    const column: FlowColumn = twoColumn && sidebarSections.has(id) ? "aside" : "main";
    const target = column === "aside" ? aside : main;
    const sectionId = id;
    const headingText = sectionLabel(id, state);
    const push = (block: BlockInput) => {
      const { id: blockId, ...rest } = block;
      target.push({
        ...rest,
        id: blockId ?? `${sectionId}-${target.length}`,
        column,
        sectionId,
      } as FlowBlock);
    };

    push({
      kind: "heading", text: headingText, index,
      keepWithNext: true, gapBefore: target.length === 0 ? 0 : sectionGap, gapAfter: headingGap,
    });

    const item = (args: { title: string; subtitle?: string; meta?: string; date?: string; desc?: string; bullets?: string[]; url?: string }, key: string) => {
      if ([args.title, args.subtitle, args.meta, args.date, args.desc, args.url].some(Boolean)) {
        push({
          id: `${key}-head`, kind: "item", title: clean(args.title), subtitle: clean(args.subtitle),
          meta: clean(args.meta), date: clean(args.date),
          keepWithNext: Boolean(args.desc || (args.bullets && args.bullets.filter(Boolean).length)),
          gapAfter: 2,
        });
      }
      if (clean(args.url)) push({ id: `${key}-url`, kind: "paragraph", text: clean(args.url), tone: "small", gapAfter: 2 });
      if (clean(args.desc)) push({ id: `${key}-desc`, kind: "paragraph", text: clean(args.desc), tone: "body", gapAfter: 2 });
      const bullets = (args.bullets ?? []).map(clean).filter(Boolean);
      if (bullets.length) push({ id: `${key}-bullets`, kind: "bullets", items: bullets, gapAfter: itemGap });
      else push({ id: `${key}-sp`, kind: "spacer", size: itemGap });
    };

    switch (id) {
      case "summary":
        push({ kind: "paragraph", text: clean(p.summary), tone: "body", gapAfter: sectionGap });
        break;
      case "experience":
        d.experience.filter((e) => [e.jobTitle, e.company, e.description, ...e.bullets].some(Boolean)).forEach((e, n) => item({
          title: e.jobTitle, subtitle: [e.company, e.location].filter(Boolean).join(" · "),
          date: dateRange(e.startDate, e.endDate, e.current), desc: e.description, bullets: e.bullets,
        }, `exp-${n}`));
        break;
      case "education":
        d.education.filter((e) => [e.institution, e.degree, e.details].some(Boolean)).forEach((e, n) => item({
          title: [e.degree, e.field].filter(Boolean).join(" — ") || e.institution,
          subtitle: [e.degree, e.field].filter(Boolean).join("").length ? e.institution : "",
          meta: e.grade, date: dateRange(e.startDate, e.endDate), desc: e.details,
        }, `edu-${n}`));
        break;
      case "skills":
        d.skills.filter((s) => s.items.some(Boolean)).forEach((s, n) => {
          if (c.showSkillBars && template.capabilities.skillBars) {
            if (clean(s.category)) push({ id: `sk-${n}-label`, kind: "paragraph", text: clean(s.category), tone: "small", keepWithNext: true, gapAfter: 3 });
            s.items.filter(Boolean).forEach((raw, m) => {
              const [name, levelRaw] = raw.split("~");
              const level = Number(levelRaw);
              push({ id: `sk-${n}-${m}`, kind: "skillRow", label: clean(name), value: "", level: Number.isFinite(level) ? Math.min(100, Math.max(0, level)) : 72 });
            });
            push({ id: `sk-${n}-sp`, kind: "spacer", size: itemGap });
          } else {
            push({ id: `sk-${n}`, kind: "tags", label: clean(s.category), items: s.items.map(clean).filter(Boolean), gapAfter: itemGap });
          }
        });
        break;
      case "projects":
        d.projects.filter((x) => [x.name, x.description, ...x.achievements].some(Boolean)).forEach((x, n) => item({
          title: x.name, subtitle: x.technologies, date: "", url: x.url,
          desc: x.description, bullets: x.achievements,
        }, `proj-${n}`));
        break;
      case "certifications":
        d.certifications.filter((x) => x.name).forEach((x, n) => item({
          title: x.name, subtitle: x.issuer, date: x.date, url: x.url,
        }, `cert-${n}`));
        break;
      case "languages":
        d.languages.filter((x) => x.name).forEach((x, n) => item({
          title: x.name, subtitle: x.proficiency,
        }, `lang-${n}`));
        break;
      case "awards":
        d.awards.filter((x) => x.name).forEach((x, n) => item({
          title: x.name, subtitle: x.issuer, date: x.date, desc: x.details,
        }, `aw-${n}`));
        break;
      case "volunteer":
        d.volunteer.filter((x) => x.role || x.organization).forEach((x, n) => item({
          title: x.role, subtitle: x.organization, date: dateRange(x.startDate, x.endDate), desc: x.details,
        }, `vol-${n}`));
        break;
      case "publications":
        d.publications.filter((x) => x.title).forEach((x, n) => item({
          title: x.title, subtitle: x.publisher, date: x.date, url: x.url, desc: x.details,
        }, `pub-${n}`));
        break;
      case "courses":
        d.courses.filter((x) => x.name).forEach((x, n) => item({
          title: x.name, subtitle: x.provider, date: x.date, desc: x.details,
        }, `course-${n}`));
        break;
      case "activities":
        d.activities.filter((x) => x.name).forEach((x, n) => item({
          title: x.name, subtitle: x.role, desc: x.details,
        }, `act-${n}`));
        break;
      case "interests":
        push({ kind: "tags", items: d.interests.map(clean).filter(Boolean), gapAfter: sectionGap });
        break;
      case "references":
        d.references.filter((x) => x.name || x.availableOnRequest).forEach((x, n) => item({
          title: x.availableOnRequest ? "References available on request" : x.name,
          subtitle: [x.title, x.contact].filter(Boolean).join(" · "),
        }, `ref-${n}`));
        break;
      default: {
        if (id.startsWith("custom:")) {
          const section = d.customSections.find((s) => `custom:${s.id}` === id);
          section?.entries.filter((e) => [e.heading, e.details, ...e.bullets].some(Boolean)).forEach((e, n) => item({
            title: e.heading, subtitle: e.subheading, date: e.date, desc: e.details, bullets: e.bullets,
          }, `cust-${n}`));
        }
      }
    }
  }

  return {
    header,
    main,
    aside: twoColumn ? aside : [],
    sectionIds: shown,
    twoColumn,
    asideSections: shown.filter((id) => sidebarSections.has(id)),
  };
}
