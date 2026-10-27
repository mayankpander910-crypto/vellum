"use client";

import { useFormContext, type Path } from "react-hook-form";
import {
  AlignLeft, ChevronDown, ChevronUp, Eye, EyeOff, FileType, LayoutTemplate,
  MoveVertical, Palette, RotateCcw, SlidersHorizontal, Type,
} from "lucide-react";
import type { ResumeFormValues } from "@/lib/resume-validation";
import type { ResumeState, PresetId, FontFamilyId, PageSize } from "@/types/resume";
import { FONT_LABELS } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { PRESETS, allSectionIds, customizationForTemplate, moveItem, sectionLabel } from "@/lib/resume-utils";
import { Button } from "@/components/ui/button";
import { Input, Label, RangeValue, Separator, Slider, Switch } from "@/components/ui/form-controls";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from "@/components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

const SWATCHES = ["#4c47e8", "#1f3a68", "#0e7c86", "#16825d", "#7a2f43", "#c2611f", "#d95d48", "#22242b"];

export function CustomizationPanel({ state, template }: { state: ResumeState; template: TemplateDefinition }) {
  const { setValue, watch } = useFormContext<ResumeFormValues>();
  const c = state.customize;
  const caps = template.capabilities;
  const set = <K extends Path<ResumeFormValues>>(path: K, value: unknown) => setValue(path, value as never, { shouldDirty: true });

  const applyPreset = (id: PresetId) => {
    const preset = PRESETS[id];
    (Object.keys(preset) as (keyof typeof preset)[]).forEach((key) => {
      if (key === "accentColor" && !caps.accentColor) return;
      if (key === "fontFamily" && !caps.fontFamily) return;
      set(`customize.${key}` as Path<ResumeFormValues>, preset[key]);
    });
    set("customize.preset", id);
  };

  const toggleHidden = (id: string) => {
    const hidden = watch("customize.hiddenSections") ?? [];
    set("customize.hiddenSections", hidden.includes(id as never) ? hidden.filter((x) => x !== id) : [...hidden, id]);
  };
  const moveSection = (from: number, to: number) => {
    set("customize.sectionOrder", moveItem(c.sectionOrder, from, to));
  };

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold">Customize</h2>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => setValue("customize", customizationForTemplate(template), { shouldDirty: true })}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">Changes appear in the preview instantly.</p>
      </div>

      <div>
        <Label className="mb-2 block">Style presets</Label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(PRESETS) as PresetId[]).map((id) => (
            <button key={id} onClick={() => applyPreset(id)} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors", c.preset === id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground")}>{id}</button>
          ))}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["color", "type", "layout", "sections"]} className="rounded-xl border border-border bg-card px-3">
        {/* Colours */}
        <AccordionItem value="color">
          <AccordionTrigger className="py-3 text-xs"><Palette className="h-3.5 w-3.5 text-primary" /> Colour</AccordionTrigger>
          <AccordionContent className="pb-3">
            {caps.accentColor ? (
              <>
                <div className="flex items-center gap-2">
                  <input type="color" aria-label="Accent colour picker" value={c.accentColor} onChange={(e) => set("customize.accentColor", e.target.value)} className="h-9 w-10 cursor-pointer rounded-lg border border-border bg-card p-0.5" />
                  <Input value={c.accentColor} onChange={(e) => set("customize.accentColor", e.target.value)} className="h-9 font-mono text-xs" aria-label="Accent colour hex value" />
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {SWATCHES.map((s) => <button key={s} aria-label={`Use ${s}`} onClick={() => set("customize.accentColor", s)} className={cn("h-6 w-6 rounded-full border-2 transition-transform hover:scale-110", c.accentColor === s ? "border-foreground" : "border-transparent")} style={{ background: s }} />)}
                </div>
              </>
            ) : <Unavailable text="This template keeps its original monochrome palette for maximum ATS compatibility." />}
          </AccordionContent>
        </AccordionItem>

        {/* Typography */}
        <AccordionItem value="type">
          <AccordionTrigger className="py-3 text-xs"><Type className="h-3.5 w-3.5 text-primary" /> Typography</AccordionTrigger>
          <AccordionContent className="space-y-4 pb-3">
            <ControlRow label="Font family" icon={FileType} disabled={!caps.fontFamily}>
              <Select value={c.fontFamily} onValueChange={(v) => set("customize.fontFamily", v)}>
                <SelectTrigger className="h-8 text-xs" aria-label="Font family"><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(FONT_LABELS) as FontFamilyId[]).map((f) => <SelectItem key={f} value={f}>{FONT_LABELS[f]}</SelectItem>)}</SelectContent>
              </Select>
            </ControlRow>
            <SliderRow label="Font size" value={c.fontSize} min={8} max={13} step={0.1} suffix="pt" disabled={!caps.fontSize} onChange={(v) => set("customize.fontSize", v)} />
            <SliderRow label="Line spacing" value={c.lineSpacing} min={1.15} max={1.8} step={0.05} suffix="×" disabled={!caps.lineSpacing} onChange={(v) => set("customize.lineSpacing", v)} />
            <SliderRow label="Section spacing" value={c.sectionSpacing} min={4} max={28} step={1} suffix="px" disabled={!caps.sectionSpacing} onChange={(v) => set("customize.sectionSpacing", v)} />
          </AccordionContent>
        </AccordionItem>

        {/* Layout */}
        <AccordionItem value="layout">
          <AccordionTrigger className="py-3 text-xs"><LayoutTemplate className="h-3.5 w-3.5 text-primary" /> Layout & page</AccordionTrigger>
          <AccordionContent className="space-y-3 pb-3">
            <div>
              <Label className="mb-1.5 block">Page size</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["a4", "letter"] as PageSize[]).map((size) => (
                  <button key={size} disabled={!caps.pageSize} onClick={() => set("customize.pageSize", size)} className={cn("rounded-lg border px-2 py-2 text-[11px] font-semibold transition-colors", c.pageSize === size ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground", !caps.pageSize && "opacity-50")}>{size === "a4" ? "A4 (210 × 297 mm)" : "US Letter (8.5 × 11 in)"}</button>
                ))}
              </div>
            </div>
            <SliderRow label="Page margins" value={c.margins} min={22} max={64} step={1} suffix="px" disabled={!caps.margins} onChange={(v) => set("customize.margins", v)} />
            <ToggleRow label="Two-column layout" description="Move supporting sections into a side rail." checked={c.columns === 2} disabled={!caps.columns} onChange={(v) => set("customize.columns", v ? 2 : 1)} />
            {!caps.columns && <p className="text-[11px] text-muted-foreground">This template is intentionally single-column.</p>}
            <ToggleRow label="Profile photo" checked={c.showPhoto} disabled={!caps.photo} onChange={(v) => set("customize.showPhoto", v)} />
            <ToggleRow label="Skill level bars" checked={c.showSkillBars} disabled={!caps.skillBars} onChange={(v) => set("customize.showSkillBars", v)} />
            <ToggleRow label="Contact icons" checked={c.showIcons} disabled={!caps.icons} onChange={(v) => set("customize.showIcons", v)} />
            <ToggleRow label="Page numbers" checked={c.showPageNumbers} onChange={(v) => set("customize.showPageNumbers", v)} />
          </AccordionContent>
        </AccordionItem>

        {/* Visibility */}
        <AccordionItem value="visibility">
          <AccordionTrigger className="py-3 text-xs"><Eye className="h-3.5 w-3.5 text-primary" /> Contact details</AccordionTrigger>
          <AccordionContent className="space-y-2.5 pb-3">
            <p className="text-[11px] text-muted-foreground">Choose which contact items appear in the header.</p>
            {(Object.keys(c.contactVisibility) as (keyof typeof c.contactVisibility)[]).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="capitalize">{key}</Label>
                <Switch checked={c.contactVisibility[key]} onCheckedChange={(v) => set(`customize.contactVisibility.${key}` as Path<ResumeFormValues>, v)} aria-label={`Show ${key}`} />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Sections */}
        <AccordionItem value="sections" className="border-b-0">
          <AccordionTrigger className="py-3 text-xs"><MoveVertical className="h-3.5 w-3.5 text-primary" /> Sections & order</AccordionTrigger>
          <AccordionContent className="pb-3">
            <p className="mb-2 text-[11px] text-muted-foreground">Empty sections are hidden automatically. Reorder or explicitly hide a section here.</p>
            <div className="space-y-1">
              {allSectionIds(state).map((id, i) => {
                const hidden = c.hiddenSections.includes(id);
                return (
                  <div key={id} className={cn("flex items-center gap-1 rounded-lg border border-border px-2 py-1.5", hidden && "opacity-55")}>
                    <AlignLeft className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold">{sectionLabel(id, state)}</span>
                    <button aria-label={`Hide ${sectionLabel(id, state)}`} title={hidden ? "Show section" : "Hide section"} onClick={() => toggleHidden(id)} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground">{hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}</button>
                    <button aria-label="Move section up" disabled={i === 0} onClick={() => moveSection(i, i - 1)} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-secondary disabled:opacity-25"><ChevronUp className="h-3 w-3" /></button>
                    <button aria-label="Move section down" disabled={i === allSectionIds(state).length - 1} onClick={() => moveSection(i, i + 1)} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-secondary disabled:opacity-25"><ChevronDown className="h-3 w-3" /></button>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="rounded-xl border border-border bg-muted/30 p-3">
        <p className="flex items-center gap-1.5 text-[11px] font-bold"><SlidersHorizontal className="h-3 w-3 text-primary" /> Template capability</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.entries(caps).filter(([, v]) => v).map(([k]) => <Badge key={k} variant="secondary" className="text-[10px]">{k.replace(/([A-Z])/g, " $1").toLowerCase()}</Badge>)}
        </div>
      </div>
      <Separator />
    </div>
  );
}

function Unavailable({ text }: { text: string }) {
  return <p className="rounded-lg bg-muted/60 p-2.5 text-[11px] leading-relaxed text-muted-foreground">{text}</p>;
}
function ControlRow({ label, icon: Icon, disabled, children }: { label: string; icon: typeof Type; disabled?: boolean; children: React.ReactNode }) {
  return <div className={cn(disabled && "pointer-events-none opacity-50")}><Label className="mb-1.5 flex items-center gap-1.5"><Icon className="h-3 w-3 text-primary" /> {label}</Label>{children}</div>;
}
function SliderRow({ label, value, min, max, step, suffix, disabled, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; disabled?: boolean; onChange: (v: number) => void }) {
  return (
    <div className={cn(disabled && "pointer-events-none opacity-50")}>
      <div className="mb-1.5 flex items-center justify-between"><Label>{label}</Label><RangeValue>{Number(value).toFixed(step < 1 ? 2 : 0)} {suffix}</RangeValue></div>
      <Slider value={value} min={min} max={max} step={step} onChange={onChange} aria-label={label} />
    </div>
  );
}
function ToggleRow({ label, description, checked, disabled, onChange }: { label: string; description?: string; checked: boolean; disabled?: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={cn("flex items-center justify-between gap-2", disabled && "opacity-45")}>
      <div><p className="text-xs font-semibold">{label}</p>{description && <p className="text-[10px] text-muted-foreground">{description}</p>}</div>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
