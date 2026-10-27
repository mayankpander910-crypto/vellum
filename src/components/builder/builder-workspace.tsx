"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  AlertCircle, ArrowLeft, Check, ChevronLeft, ChevronRight, Download, FileCog,
  FileText, GripVertical, HardDriveDownload, Layers3, Maximize2, Minus, Plus,
  Printer, Redo2, Settings2, Sparkles, Undo2, WandSparkles, X,
} from "lucide-react";
import { toast } from "sonner";
import type { ResumeState, SectionId } from "@/types/resume";
import { SECTION_LABELS } from "@/types/resume";
import { getTemplate } from "@/data/templates";
import { resumeFormSchema, type ResumeFormValues } from "@/lib/resume-validation";
import {
  allSectionIds, emptyData, sectionHasContent, sectionLabel, switchTemplate,
} from "@/lib/resume-utils";
import { sampleData, sampleState } from "@/data/sample-resume";
import { getExampleBySlug, exampleToState } from "@/data/resume-examples";
import { isAutosaveEnabled, readMainDraft, writeMainDraft } from "@/lib/drafts";
import { useHistory } from "@/lib/use-history";
import { downloadResumePdf } from "@/lib/pdf-export";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge, Accordion, AccordionContent, AccordionItem, AccordionTrigger, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/misc";
import { ResumePreview } from "@/components/resume-renderer/resume-preview";
import { PrintPortal } from "@/components/resume-renderer/print-portal";
import { PersonalForm, SECTION_COMPONENTS, SECTION_META, CustomSectionsForm } from "./section-forms";
import { CustomizationPanel } from "./customization-panel";
import { DataDialog, TemplatePickerDialog, WritingAssistantDialog } from "./dialogs";

type MobileTab = "edit" | "preview" | "customize";

export function BuilderWorkspace() {
  const params = useSearchParams();
  const initialTemplate = params.get("template") ?? undefined;
  const [initialState] = useState<ResumeState>(() => sampleState(initialTemplate));

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: initialState as unknown as ResumeFormValues,
    mode: "onChange",
    shouldUnregister: false,
  });
  const watched = useWatch({ control: form.control });
  const state = (watched ?? initialState) as unknown as ResumeState;
  const template = getTemplate(state.templateId);

  const [activeSection, setActiveSection] = useState<string | null>("personal");
  const [mobileTab, setMobileTab] = useState<MobileTab>("preview");
  const [zoom, setZoom] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [autosave, setAutosave] = useState(false);
  const [sampleBanner, setSampleBanner] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const applySnapshot = useCallback((snapshot: ResumeState) => {
    form.reset(snapshot as unknown as ResumeFormValues, { keepErrors: false });
  }, [form]);
  const history = useHistory(state, applySnapshot);

  /* ------- initial load: examples, local draft, template query ------- */
  useEffect(() => {
    setAutosave(isAutosaveEnabled());
    const exampleSlug = params.get("example");
    const requestedTemplate = params.get("template");
    if (exampleSlug) {
      const example = getExampleBySlug(exampleSlug);
      if (example) {
        form.reset(exampleToState(example, requestedTemplate ?? undefined) as unknown as ResumeFormValues);
        setSampleBanner(false);
        toast.success(`“${example.title}” example loaded — it is fictional, so replace every detail.`);
        return;
      }
    }
    const draft = readMainDraft();
    if (draft) {
      form.reset((requestedTemplate ? switchTemplate(draft, requestedTemplate) : draft) as unknown as ResumeFormValues);
      setSampleBanner(false);
      toast.success("Your locally saved draft was restored.");
    }
    // With no draft or example, `initialState` already uses the requested template
    // and its own defaults (including two-column / photo / skill-bar settings).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------- optional local autosave ------- */
  useEffect(() => {
    if (!autosave) return;
    const t = setTimeout(() => writeMainDraft(state), 900);
    return () => clearTimeout(t);
  }, [state, autosave]);

  /* ------- actions ------- */
  const replaceState = useCallback((next: ResumeState) => { history.reset(next); setSampleBanner(false); }, [history]);
  const onSample = useCallback(() => history.reset({ ...state, data: sampleData() }), [history, state]);
  const onClear = useCallback(() => history.reset({ ...state, data: emptyData() }), [history, state]);
  const onPickTemplate = useCallback((id: string) => {
    history.reset(switchTemplate(state, id));
    toast.success(`Switched to ${getTemplate(id).name}. All your content was kept.`);
  }, [history, state]);

  const syncCustomSections = useCallback(() => {
    setTimeout(() => {
      const current = form.getValues() as unknown as ResumeState;
      const custom = current.data.customSections.map((s) => `custom:${s.id}` as SectionId);
      const order = current.customize.sectionOrder.filter((s) => !String(s).startsWith("custom:"));
      form.setValue("customize.sectionOrder", [...order, ...custom] as never, { shouldDirty: true });
    }, 0);
  }, [form]);

  const onDownload = async () => {
    setDownloading(true);
    try {
      await downloadResumePdf(state, template);
      toast.success("Your PDF is ready. Check your downloads folder.");
    } catch (error) {
      console.error("PDF export failed", error);
      toast.error("Could not create the PDF. Please try the Print option instead.");
    } finally { setDownloading(false); }
  };

  const onPrint = () => { setTimeout(() => window.print(), 120); };
  const goToPage = (n: number) => {
    const target = Math.max(0, Math.min(pageCount - 1, n));
    setCurrentPage(target);
    previewRef.current?.querySelector(`[data-page-index="${target}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sectionIds = useMemo(() => allSectionIds(state), [state]);
  const completeCount = useMemo(() => [
    state.data.personal.fullName, state.data.personal.headline, state.data.personal.summary,
    state.data.experience.length + state.data.projects.length, state.data.education.length,
    state.data.skills.length,
  ].filter(Boolean).length, [state]);
  const highlightId = highlight && activeSection && activeSection !== "personal" && activeSection !== "custom"
    ? activeSection : null;

  /* --------------------------- Top toolbar --------------------------- */
  const topBar = (
    <div className="vr-no-print flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2.5 lg:px-4">
      <Link href="/" className="hidden items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary xl:flex"><ArrowLeft className="h-3.5 w-3.5" /> Home</Link>
      <div className="hidden h-5 w-px bg-border xl:block" />
      <button onClick={() => setPickerOpen(true)} className="group flex min-w-0 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-left transition-colors hover:border-primary/50">
        <Layers3 className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="min-w-0"><span className="block truncate text-[11px] font-bold leading-tight">{template.name}</span><span className="block text-[10px] leading-tight text-muted-foreground">Change template</span></span>
      </button>
      <div className="ml-auto flex items-center gap-1">
        <div className="hidden items-center gap-0.5 sm:flex">
          <ToolbarButton label="Undo" onClick={history.undo} disabled={!history.canUndo}><Undo2 className="h-4 w-4" /></ToolbarButton>
          <ToolbarButton label="Redo" onClick={history.redo} disabled={!history.canRedo}><Redo2 className="h-4 w-4" /></ToolbarButton>
        </div>
        <span className="hidden items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold text-muted-foreground md:inline-flex">
          <span className={cn("h-1.5 w-1.5 rounded-full", autosave ? "bg-emerald-500" : "bg-amber-500")} />
          {autosave ? "Saved locally" : "Not saved"}
        </span>
        <ToolbarButton label="Writing assistant" onClick={() => setAssistantOpen(true)} className="hidden sm:inline-flex"><WandSparkles className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Print resume" onClick={onPrint}><Printer className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton label="Resume data" onClick={() => setDataOpen(true)}><Settings2 className="h-4 w-4" /></ToolbarButton>
        <Button size="sm" onClick={() => void onDownload()} disabled={downloading} className="h-9 px-3 text-xs sm:px-4">
          <Download className="h-4 w-4" /><span className="hidden sm:inline">{downloading ? "Preparing…" : "Download PDF"}</span><span className="sm:hidden">PDF</span>
        </Button>
      </div>
    </div>
  );

  /* --------------------------- Editor panel --------------------------- */
  const editor = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Your content</h2><Badge variant="secondary">{completeCount}/6 basics</Badge></div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(completeCount / 6) * 100}%` }} /></div>
      </div>
      <div className="scrollbar-slim flex-1 overflow-y-auto px-3 py-3">
        {sampleBanner && (
          <div className="mb-3 flex gap-2 rounded-xl border border-primary/25 bg-primary/5 p-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0"><p className="text-[11px] font-bold">You are viewing fictional sample data</p><p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">Replace it with your own details, or start from a blank resume.</p>
              <div className="mt-2 flex gap-1.5"><Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => { onClear(); setSampleBanner(false); }}>Start blank</Button><button className="text-[10px] font-semibold text-muted-foreground hover:text-foreground" onClick={() => setSampleBanner(false)}>Dismiss</button></div>
            </div>
            <button aria-label="Dismiss sample notice" onClick={() => setSampleBanner(false)} className="ml-auto text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
          </div>
        )}
        <Accordion type="single" collapsible value={activeSection ?? ""} onValueChange={(v) => setActiveSection(v || null)} className="rounded-xl border border-border bg-card px-3">
          <AccordionItem value="personal">
            <AccordionTrigger><SectionTrigger icon={SECTION_META.personal.icon} label={SECTION_META.personal.label} filled={Boolean(state.data.personal.fullName)} /></AccordionTrigger>
            <AccordionContent><PersonalForm /></AccordionContent>
          </AccordionItem>
          {sectionIds.map((id) => {
            const isCustom = String(id).startsWith("custom:");
            const coreId = isCustom ? null : (id as keyof typeof SECTION_META);
            const meta = coreId ? SECTION_META[coreId] : undefined;
            const Comp = !isCustom ? SECTION_COMPONENTS[id as keyof typeof SECTION_COMPONENTS] : undefined;
            const filled = sectionHasContent(id, state);
            return (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger><SectionTrigger icon={meta?.icon ?? FileText} label={sectionLabel(id, state)} filled={filled} /></AccordionTrigger>
                <AccordionContent>{Comp ? <Comp /> : <p className="text-xs text-muted-foreground">Use the section controls in Customize to reorder or hide this section.</p>}</AccordionContent>
              </AccordionItem>
            );
          })}
          <AccordionItem value="custom" className="border-b-0">
            <AccordionTrigger><SectionTrigger icon={Plus} label="Custom sections" filled={state.data.customSections.length > 0} /></AccordionTrigger>
            <AccordionContent><CustomSectionsForm onIdsChange={syncCustomSections} /></AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="mt-3 px-1 text-[11px] leading-relaxed text-muted-foreground">Everything you type stays in this browser tab. Learn more on the <Link href="/privacy" className="font-semibold text-primary hover:underline">privacy page</Link>.</p>
      </div>
    </div>
  );

  /* --------------------------- Preview panel --------------------------- */
  const preview = (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="vr-no-print flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2">
        <span className="hidden text-xs font-bold sm:inline">Live preview</span>
        <Badge variant="outline" className="hidden sm:inline-flex">{state.customize.pageSize === "a4" ? "A4" : "US Letter"}</Badge>
        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton label="Zoom out" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}><Minus className="h-3.5 w-3.5" /></ToolbarButton>
          <span className="w-10 text-center text-[11px] font-semibold tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <ToolbarButton label="Zoom in" onClick={() => setZoom((z) => Math.min(2, +(z + 0.15).toFixed(2)))}><Plus className="h-3.5 w-3.5" /></ToolbarButton>
          <ToolbarButton label="Reset zoom" onClick={() => setZoom(1)}><Maximize2 className="h-3.5 w-3.5" /></ToolbarButton>
          <div className="mx-1 h-5 w-px bg-border" />
          <ToolbarButton label="Previous page" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}><ChevronLeft className="h-4 w-4" /></ToolbarButton>
          <span className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-muted-foreground">{currentPage + 1} / {pageCount}</span>
          <ToolbarButton label="Next page" onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= pageCount - 1}><ChevronRight className="h-4 w-4" /></ToolbarButton>
          <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
          <button onClick={() => setHighlight((v) => !v)} aria-pressed={highlight} title="Highlight the section being edited"
            className={cn("hidden items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors sm:inline-flex", highlight ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary")}>
            <GripVertical className="h-3.5 w-3.5" /> Highlight
          </button>
        </div>
      </div>
      <div ref={previewRef} className="scrollbar-slim flex-1 overflow-auto p-4 sm:p-6">
        <ResumePreview state={state} template={template} zoom={zoom} highlightSection={highlightId} onPageCount={setPageCount} className="h-full" />
      </div>
    </div>
  );

  /* --------------------------- Customize panel --------------------------- */
  const customize = (
    <div className="scrollbar-slim h-full overflow-y-auto border-l border-border bg-card px-3 py-3">
      <CustomizationPanel state={state} template={template} />
    </div>
  );

  return (
    <FormProvider {...form}>
      <div className="vr-no-print flex h-[calc(100vh-4rem)] min-h-[620px] flex-col">
        {topBar}

        {/* Mobile tabs */}
        <div className="flex items-center gap-1 border-b border-border bg-card px-3 py-2 lg:hidden">
          {(["edit", "preview", "customize"] as MobileTab[]).map((tab) => (
            <button key={tab} onClick={() => setMobileTab(tab)} aria-pressed={mobileTab === tab}
              className={cn("flex-1 rounded-lg px-2 py-2 text-xs font-bold capitalize transition-colors", mobileTab === tab ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[340px_minmax(0,1fr)_300px] xl:grid-cols-[360px_minmax(0,1fr)_320px]">
          <div className={cn("min-h-0 border-r border-border bg-card", mobileTab === "edit" ? "block" : "hidden lg:block")}>{editor}</div>
          <div className={cn("min-h-0", mobileTab === "preview" ? "block" : "hidden lg:block")}>{preview}</div>
          <div className={cn("min-h-0", mobileTab === "customize" ? "block" : "hidden lg:block")}>{customize}</div>
        </div>
      </div>

      <PrintPortal state={state} template={template} />

      <TemplatePickerDialog open={pickerOpen} onOpenChange={setPickerOpen} currentId={template.id} onPick={onPickTemplate} />
      <DataDialog open={dataOpen} onOpenChange={setDataOpen} state={state} onReplace={replaceState} onSample={onSample} onClear={onClear} onAutosaveChange={setAutosave} />
      <WritingAssistantDialog
        open={assistantOpen} onOpenChange={setAssistantOpen} state={state}
        onUseSummary={(text) => form.setValue("data.personal.summary", text, { shouldDirty: true })}
        onCopyText={(text) => void navigator.clipboard?.writeText(text)}
      />
    </FormProvider>
  );
}

function ToolbarButton({ label, onClick, disabled, className, children }: {
  label: string; onClick: () => void; disabled?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label}
          className={cn("inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30", className)}>{children}</button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionTrigger({ icon: Icon, label, filled }: { icon: typeof FileText; label: string; filled: boolean }) {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
      {filled ? <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-600" /> : <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />}
    </span>
  );
}
