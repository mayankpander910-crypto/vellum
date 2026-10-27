"use client";

import { useState, type ComponentType } from "react";
import { useFieldArray, useFormContext, type FieldArrayPath, type Path } from "react-hook-form";
import {
  Award, BookOpen, BriefcaseBusiness, CircleUserRound, FolderGit2,
  GraduationCap, Heart, Languages, Medal, Newspaper,
  Plus, Quote, ScrollText, Sparkles, Trash2, Upload, User, Users, Wrench, X,
} from "lucide-react";
import type { CoreSectionId } from "@/types/resume";
import type { ResumeFormValues } from "@/lib/resume-validation";
import { uid } from "@/lib/resume-utils";
import { EXAMPLE_SUMMARIES } from "@/data/writing-help";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/form-controls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/misc";
import { CheckboxField, RepeatableSection, StringArrayField, TextAreaField, TextField } from "./form-primitives";

const p = (s: string) => s as Path<ResumeFormValues>;
const ap = (s: string) => s as FieldArrayPath<ResumeFormValues>;

/* ------------------------- Personal details ------------------------- */
export function PersonalForm() {
  const { setValue, watch } = useFormContext<ResumeFormValues>();
  const photo = watch("data.personal.photo");
  const [uploadError, setUploadError] = useState("");

  const onPhoto = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { setUploadError("Please choose an image under 2 MB."); return; }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = () => setValue("data.personal.photo", String(reader.result ?? ""), { shouldDirty: true });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField name={p("data.personal.fullName")} label="Full name" placeholder="Aarav Mehta" autoComplete="name" />
        <TextField name={p("data.personal.headline")} label="Professional title" placeholder="Senior Frontend Engineer" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField name={p("data.personal.email")} label="Email" placeholder="you@example.com" type="email" autoComplete="email" />
        <TextField name={p("data.personal.phone")} label="Phone" placeholder="+91 98250 12345" type="tel" autoComplete="tel" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField name={p("data.personal.city")} label="City" placeholder="Ahmedabad" />
        <TextField name={p("data.personal.country")} label="Country" placeholder="India" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField name={p("data.personal.linkedin")} label="LinkedIn" placeholder="linkedin.com/in/you" />
        <TextField name={p("data.personal.github")} label="GitHub" placeholder="github.com/you" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField name={p("data.personal.portfolio")} label="Portfolio" placeholder="yourportfolio.dev" />
        <TextField name={p("data.personal.website")} label="Personal website" placeholder="yoursite.com" />
      </div>
      <div className="rounded-xl border border-dashed border-border p-3">
        <Label>Profile photo (optional)</Label>
        <p className="mt-1 text-[11px] text-muted-foreground">Only shown when the selected template supports photos. The image stays in your browser and is never uploaded.</p>
        {photo ? (
          <div className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo as string} alt="Profile preview" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20" />
            <Button type="button" variant="outline" size="sm" onClick={() => setValue("data.personal.photo", "", { shouldDirty: true })}><X className="h-3.5 w-3.5" /> Remove</Button>
          </div>
        ) : (
          <label className="mt-2 flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary">
            <Upload className="h-3.5 w-3.5" /> Choose an image
            <input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} />
          </label>
        )}
        {uploadError && <p className="mt-2 text-[11px] font-medium text-destructive">{uploadError}</p>}
      </div>
      <p className="text-[11px] text-muted-foreground">Leave any field blank to hide it from your resume.</p>
    </div>
  );
}

/* ------------------------- Summary ------------------------- */
export function SummaryForm() {
  const { setValue, watch } = useFormContext<ResumeFormValues>();
  const summary = watch("data.personal.summary") ?? "";
  return (
    <div className="space-y-3">
      <TextAreaField name={p("data.personal.summary")} label="Professional summary" rows={5}
        placeholder="A short paragraph describing your experience, strengths and the value you bring…"
        hint="Aim for 2–4 lines. Mention your role, key strengths and one measurable result if you have one." />
      <div>
        <Label>Need a starting point?</Label>
        <p className="mt-1 text-[11px] text-muted-foreground">These are editable examples — pick one and rewrite it in your own words.</p>
        <Select onValueChange={(v) => {
          const example = EXAMPLE_SUMMARIES[Number(v)]?.text;
          if (example) setValue("data.personal.summary", example, { shouldDirty: true });
        }}>
          <SelectTrigger className="mt-2" aria-label="Insert an example summary"><SelectValue placeholder="Insert an example summary…" /></SelectTrigger>
          <SelectContent>{EXAMPLE_SUMMARIES.map((e, i) => <SelectItem key={e.role} value={String(i)}>{e.role}</SelectItem>)}</SelectContent>
        </Select>
        <Button type="button" variant="ghost" size="sm" className="mt-1 h-7 px-2 text-[11px]" onClick={() => setValue("data.personal.summary", "", { shouldDirty: true })}>Clear summary</Button>
      </div>
      <p className="text-[11px] text-muted-foreground">Current length: {summary.trim().split(/\s+/).filter(Boolean).length} words.</p>
    </div>
  );
}

/* ------------------------- Experience ------------------------- */
export function ExperienceForm() {
  return (
    <RepeatableSection
      name={ap("data.experience")}
      addLabel="Add experience"
      emptyText="No work experience yet. Add a role, internship or freelance project."
      hint="List your most recent role first. Use the bullet lines for achievements — one per line."
      makeItem={() => ({ id: uid("exp"), jobTitle: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "", bullets: [""] })}
      summary={(x) => [x.jobTitle, x.company].filter(Boolean).join(" at ") as string}
      render={(i) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField name={p(`data.experience.${i}.jobTitle`)} label="Job title" placeholder="Frontend Developer" />
            <TextField name={p(`data.experience.${i}.company`)} label="Company" placeholder="Northstar Labs" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField name={p(`data.experience.${i}.location`)} label="Location" placeholder="Remote" />
            <TextField name={p(`data.experience.${i}.startDate`)} label="Start date" placeholder="Apr 2022" />
            <TextField name={p(`data.experience.${i}.endDate`)} label="End date" placeholder="Mar 2024" />
          </div>
          <CheckboxField name={p(`data.experience.${i}.current`)} label="I currently work here" />
          <TextAreaField name={p(`data.experience.${i}.description`)} label="Short description (optional)" rows={2} placeholder="One line about the team or product." />
          <StringArrayField name={p(`data.experience.${i}.bullets`)} label="Achievement bullets" rows={4}
            placeholder={"Improved page load time by 45% across the customer dashboard\nMentored three junior engineers"}
            hint="One bullet per line. Start with an action verb and add a result where you can." />
        </>
      )}
    />
  );
}

/* ------------------------- Education ------------------------- */
export function EducationForm() {
  return (
    <RepeatableSection
      name={ap("data.education")} addLabel="Add education"
      emptyText="No education added yet."
      hint="Include your most recent qualification first. Add coursework if it is relevant to the role."
      makeItem={() => ({ id: uid("edu"), institution: "", degree: "", field: "", startDate: "", endDate: "", grade: "", details: "" })}
      summary={(x) => [x.degree, x.institution].filter(Boolean).join(" — ") as string}
      render={(i) => (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField name={p(`data.education.${i}.degree`)} label="Degree / qualification" placeholder="B.Tech" />
            <TextField name={p(`data.education.${i}.field`)} label="Field of study" placeholder="Computer Science" />
          </div>
          <TextField name={p(`data.education.${i}.institution`)} label="Institution" placeholder="Nirma University" />
          <div className="grid gap-3 sm:grid-cols-3">
            <TextField name={p(`data.education.${i}.startDate`)} label="Start" placeholder="2015" />
            <TextField name={p(`data.education.${i}.endDate`)} label="End" placeholder="2019" />
            <TextField name={p(`data.education.${i}.grade`)} label="Grade / GPA" placeholder="8.7 / 10" />
          </div>
          <TextAreaField name={p(`data.education.${i}.details`)} label="Coursework or achievements" rows={2} placeholder="Relevant coursework: Data Structures, HCI…" />
        </>
      )}
    />
  );
}

/* ------------------------- Skills ------------------------- */
export function SkillsForm() {
  return (
    <RepeatableSection
      name={ap("data.skills")} addLabel="Add skill group"
      emptyText="No skills yet. Add a category like “Technical skills”."
      hint="One skill per line. For templates with skill bars, you can write “JavaScript~85” to set a level."
      makeItem={() => ({ id: uid("sk"), category: "", items: [""] })}
      summary={(x) => String(x.category || "Skill group")}
      render={(i) => (
        <>
          <TextField name={p(`data.skills.${i}.category`)} label="Category" placeholder="Technical skills" />
          <StringArrayField name={p(`data.skills.${i}.items`)} label="Skills" rows={5} placeholder={"TypeScript\nReact\nNext.js\nSQL"} />
        </>
      )}
    />
  );
}

/* ------------------------- Projects ------------------------- */
export function ProjectsForm() {
  return (
    <RepeatableSection
      name={ap("data.projects")} addLabel="Add project"
      emptyText="No projects yet — great for students and career changers."
      hint="Show what you built, which tools you used, and what happened as a result."
      makeItem={() => ({ id: uid("pr"), name: "", description: "", technologies: "", url: "", achievements: [""] })}
      summary={(x) => String(x.name || "New project")}
      render={(i) => (
        <>
          <TextField name={p(`data.projects.${i}.name`)} label="Project name" placeholder="OpenSheet — collaborative spreadsheets" />
          <TextAreaField name={p(`data.projects.${i}.description`)} label="Description" rows={2} placeholder="What does it do and who uses it?" />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField name={p(`data.projects.${i}.technologies`)} label="Technologies" placeholder="React, TypeScript, IndexedDB" />
            <TextField name={p(`data.projects.${i}.url`)} label="Link" placeholder="github.com/you/project" />
          </div>
          <StringArrayField name={p(`data.projects.${i}.achievements`)} label="Highlights" rows={3} placeholder="Supported 12 simultaneous editors\nReached 1,200 GitHub stars" />
        </>
      )}
    />
  );
}

/* ------------------------- Generic simple sections ------------------------- */
interface SimpleField { key: string; label: string; placeholder?: string; multiline?: boolean }
interface SimpleConfig {
  name: string; addLabel: string; emptyText: string;
  fields: SimpleField[]; make: () => Record<string, unknown>;
}

const SIMPLE: Record<string, SimpleConfig> = {
  certifications: {
    name: "data.certifications", addLabel: "Add certification", emptyText: "No certifications added.",
    fields: [{ key: "name", label: "Certification", placeholder: "AWS Certified Cloud Practitioner" }, { key: "issuer", label: "Issuer", placeholder: "Amazon Web Services" }, { key: "date", label: "Date", placeholder: "2023" }, { key: "url", label: "Credential URL", placeholder: "Optional" }],
    make: () => ({ id: uid("ce"), name: "", issuer: "", date: "", url: "" }),
  },
  languages: {
    name: "data.languages", addLabel: "Add language", emptyText: "No languages added.",
    fields: [{ key: "name", label: "Language", placeholder: "English" }, { key: "proficiency", label: "Proficiency", placeholder: "Professional working proficiency" }],
    make: () => ({ id: uid("la"), name: "", proficiency: "" }),
  },
  awards: {
    name: "data.awards", addLabel: "Add award", emptyText: "No awards added.",
    fields: [{ key: "name", label: "Award", placeholder: "Engineering Excellence Award" }, { key: "issuer", label: "Issuer", placeholder: "Northstar Labs" }, { key: "date", label: "Date", placeholder: "2023" }, { key: "details", label: "Details", placeholder: "Optional context", multiline: true }],
    make: () => ({ id: uid("aw"), name: "", issuer: "", date: "", details: "" }),
  },
  volunteer: {
    name: "data.volunteer", addLabel: "Add volunteer role", emptyText: "No volunteer experience added.",
    fields: [{ key: "role", label: "Role", placeholder: "Volunteer Mentor" }, { key: "organization", label: "Organisation", placeholder: "CodeBridge Foundation" }, { key: "startDate", label: "Start", placeholder: "2021" }, { key: "endDate", label: "End", placeholder: "Present" }, { key: "details", label: "Details", placeholder: "What you did", multiline: true }],
    make: () => ({ id: uid("vo"), role: "", organization: "", startDate: "", endDate: "", details: "" }),
  },
  publications: {
    name: "data.publications", addLabel: "Add publication", emptyText: "No publications added.",
    fields: [{ key: "title", label: "Title", placeholder: "Paper or article title" }, { key: "publisher", label: "Publisher", placeholder: "Journal / conference" }, { key: "date", label: "Date", placeholder: "2023" }, { key: "url", label: "URL", placeholder: "Optional" }, { key: "details", label: "Details", placeholder: "Optional", multiline: true }],
    make: () => ({ id: uid("pu"), title: "", publisher: "", date: "", url: "", details: "" }),
  },
  courses: {
    name: "data.courses", addLabel: "Add course", emptyText: "No courses added.",
    fields: [{ key: "name", label: "Course", placeholder: "Machine Learning Specialisation" }, { key: "provider", label: "Provider", placeholder: "Coursera" }, { key: "date", label: "Date", placeholder: "2023" }, { key: "details", label: "Details", placeholder: "Optional", multiline: true }],
    make: () => ({ id: uid("co"), name: "", provider: "", date: "", details: "" }),
  },
  activities: {
    name: "data.activities", addLabel: "Add activity", emptyText: "No activities added.",
    fields: [{ key: "name", label: "Activity", placeholder: "Frontend Ahmedabad" }, { key: "role", label: "Role", placeholder: "Community organiser" }, { key: "details", label: "Details", placeholder: "Optional", multiline: true }],
    make: () => ({ id: uid("ac"), name: "", role: "", details: "" }),
  },
  references: {
    name: "data.references", addLabel: "Add reference", emptyText: "No references added. You can also simply write “Available on request”.",
    fields: [{ key: "name", label: "Name", placeholder: "Priya Shah" }, { key: "title", label: "Title / relation", placeholder: "Former manager" }, { key: "contact", label: "Contact", placeholder: "priya@example.com" }, { key: "availableOnRequest", label: "Available on request", checkbox: true } as SimpleField],
    make: () => ({ id: uid("rf"), name: "", title: "", contact: "", availableOnRequest: false }),
  },
};

function SimpleForm({ section }: { section: string }) {
  const config = SIMPLE[section];
  if (!config) return null;
  return (
    <RepeatableSection
      name={ap(config.name)} addLabel={config.addLabel} emptyText={config.emptyText}
      makeItem={config.make}
      summary={(x) => String(x.name || x.title || x.role || x.language || "Entry")}
      render={(i) => (
        <div className="grid gap-3 sm:grid-cols-2">
          {config.fields.map((f) => (
            <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
              {(f as SimpleField & { checkbox?: boolean }).checkbox
                ? <CheckboxField name={p(`${config.name}.${i}.${f.key}`)} label={f.label} />
                : f.multiline
                  ? <TextAreaField name={p(`${config.name}.${i}.${f.key}`)} label={f.label} placeholder={f.placeholder} rows={2} />
                  : <TextField name={p(`${config.name}.${i}.${f.key}`)} label={f.label} placeholder={f.placeholder} />}
            </div>
          ))}
        </div>
      )}
    />
  );
}

export function InterestsForm() {
  return <StringArrayField name={p("data.interests")} label="Interests" rows={4} placeholder={"Open-source software\nUrban sketching\nCycling"} hint="One per line. Keep it short; two to four interests is plenty." />;
}

/* ------------------------- Custom sections ------------------------- */
export function CustomSectionsForm({ onIdsChange }: { onIdsChange?: () => void }) {
  const { setValue, watch } = useFormContext<ResumeFormValues>();
  const sections = watch("data.customSections") ?? [];
  const add = () => {
    const next = [...sections, { id: uid("cs"), title: "", entries: [] }];
    setValue("data.customSections", next, { shouldDirty: true });
    onIdsChange?.();
  };
  const remove = (index: number) => {
    setValue("data.customSections", sections.filter((_, i) => i !== index), { shouldDirty: true });
    onIdsChange?.();
  };
  return (
    <div className="space-y-3">
      <p className="text-[11px] text-muted-foreground">Create your own heading for anything that does not fit — speak at conferences, open-source work, licenses, and so on.</p>
      {sections.map((section, i) => (
        <div key={section.id ?? i} className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2">
            <TextField name={p(`data.customSections.${i}.title`)} label="Section title" placeholder="Speaking engagements" />
            <button type="button" aria-label="Delete custom section" onClick={() => remove(i)} className="mt-5 grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="mt-3">
            <CustomEntries sectionIndex={i} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full border-dashed"><Plus className="h-3.5 w-3.5" /> Add custom section</Button>
    </div>
  );
}

function CustomEntries({ sectionIndex }: { sectionIndex: number }) {
  const { control } = useFormContext<ResumeFormValues>();
  const name = ap(`data.customSections.${sectionIndex}.entries`);
  const array = useFieldArray({ control, name, keyName: "fieldId" });
  return (
    <div className="space-y-2">
      {array.fields.map((entry, j) => (
        <div key={entry.fieldId} className="rounded-lg border border-border bg-background/60 p-2.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground">Entry {j + 1}</span>
            <button type="button" aria-label="Delete entry" onClick={() => array.remove(j)} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <TextField name={p(`data.customSections.${sectionIndex}.entries.${j}.heading`)} label="Heading" placeholder="Conference talk" />
            <TextField name={p(`data.customSections.${sectionIndex}.entries.${j}.subheading`)} label="Subheading" placeholder="Organisation" />
            <TextField name={p(`data.customSections.${sectionIndex}.entries.${j}.date`)} label="Date" placeholder="2024" />
          </div>
          <div className="mt-2.5"><TextAreaField name={p(`data.customSections.${sectionIndex}.entries.${j}.details`)} label="Details" rows={2} /></div>
          <div className="mt-2.5"><StringArrayField name={p(`data.customSections.${sectionIndex}.entries.${j}.bullets`)} label="Bullets" rows={2} /></div>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => array.append({ id: uid("cse"), heading: "", subheading: "", date: "", details: "", bullets: [] } as never)} className="w-full border-dashed"><Plus className="h-3.5 w-3.5" /> Add entry</Button>
    </div>
  );
}

/* ------------------------- Registry ------------------------- */
export interface SectionMeta { label: string; icon: typeof User; group: "core" | "optional" | "extra"; description: string }

export const SECTION_META: Record<CoreSectionId | "personal", SectionMeta> = {
  personal: { label: "Personal details", icon: CircleUserRound, group: "core", description: "Name, contact details and links" },
  summary: { label: "Professional summary", icon: Quote, group: "core", description: "A short introduction at the top" },
  experience: { label: "Work experience", icon: BriefcaseBusiness, group: "core", description: "Roles, internships and achievements" },
  education: { label: "Education", icon: GraduationCap, group: "core", description: "Degrees, schools and coursework" },
  skills: { label: "Skills", icon: Wrench, group: "core", description: "Grouped technical and soft skills" },
  projects: { label: "Projects", icon: FolderGit2, group: "core", description: "Personal, academic or open-source work" },
  certifications: { label: "Certifications", icon: Award, group: "optional", description: "Licenses and credentials" },
  languages: { label: "Languages", icon: Languages, group: "optional", description: "Languages you speak" },
  awards: { label: "Awards & honors", icon: Medal, group: "optional", description: "Recognition and prizes" },
  volunteer: { label: "Volunteer experience", icon: Heart, group: "optional", description: "Community and pro-bono work" },
  publications: { label: "Publications", icon: Newspaper, group: "extra", description: "Papers, articles and talks" },
  courses: { label: "Courses", icon: BookOpen, group: "extra", description: "Professional development" },
  activities: { label: "Activities", icon: Users, group: "extra", description: "Clubs, societies and communities" },
  interests: { label: "Interests", icon: Sparkles, group: "extra", description: "A short personal touch" },
  references: { label: "References", icon: ScrollText, group: "extra", description: "Optional, often “on request”" },
};

export const SECTION_COMPONENTS: Record<CoreSectionId, ComponentType> = {
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: () => <SimpleForm section="certifications" />,
  languages: () => <SimpleForm section="languages" />,
  awards: () => <SimpleForm section="awards" />,
  volunteer: () => <SimpleForm section="volunteer" />,
  publications: () => <SimpleForm section="publications" />,
  courses: () => <SimpleForm section="courses" />,
  activities: () => <SimpleForm section="activities" />,
  interests: InterestsForm,
  references: () => <SimpleForm section="references" />,
};

