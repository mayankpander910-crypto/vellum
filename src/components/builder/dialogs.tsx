"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle, CheckCircle2, CircleDot, Copy, FileJson, HardDriveDownload,
  RotateCcw, Sparkles, Trash2, Upload, WandSparkles, X,
} from "lucide-react";
import type { ResumeState } from "@/types/resume";
import {
  atsChecklist, completenessChecklist, exportJson, plainText, resumeMetrics,
} from "@/lib/resume-utils";
import { BULLET_EXAMPLES, ACTION_VERBS, EXAMPLE_SUMMARIES, WRITING_TIPS, localSpellingHints } from "@/data/writing-help";
import { parseImportedResume } from "@/lib/resume-validation";
import { clearAllDrafts, deleteDraft, getDrafts, isAutosaveEnabled, saveDraft, setAutosaveEnabled, type SavedDraft } from "@/lib/drafts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/form-controls";
import { Badge, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TEMPLATES } from "@/data/templates";
import { CATEGORY_LABELS } from "@/types/template";
import { MiniResume } from "@/components/resume-renderer/mini-resume";

/* ------------------------- Writing assistance ------------------------- */
export function WritingAssistantDialog({ open, onOpenChange, state, onUseSummary, onCopyText }: {
  open: boolean; onOpenChange: (v: boolean) => void; state: ResumeState;
  onUseSummary: (text: string) => void; onCopyText: (text: string) => void;
}) {
  const complete = completenessChecklist(state);
  const ats = atsChecklist(state);
  const metrics = resumeMetrics(state);
  const hints = localSpellingHints(plainText(state));
  const doneCount = complete.filter((x) => x.done).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><WandSparkles className="h-4 w-4 text-primary" /> Writing assistant</DialogTitle>
          <DialogDescription>Local, editable suggestions. Nothing is sent to an AI service or a server.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="checklist">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="ats">ATS check</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="checklist" className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex-1"><p className="text-xs font-bold">Resume completeness</p><p className="text-[11px] text-muted-foreground">{doneCount} of {complete.length} items complete</p></div>
              <div className="h-2 w-28 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(doneCount / complete.length) * 100}%` }} /></div>
              <Badge>{metrics.words} words · {metrics.bullets} bullets</Badge>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {complete.map((item) => (
                <div key={item.id} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
                  {item.done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                  <div><p className="text-xs font-semibold">{item.label}</p>{!item.done && <p className="text-[11px] text-muted-foreground">{item.hint}</p>}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border p-3">
              <p className="text-xs font-bold">Length indicator</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                {metrics.length === "short" && "Your resume is quite short. Consider adding more detail to your experience, projects or skills."}
                {metrics.length === "good" && "Good length. Most one-page resumes sit between 250 and 600 words."}
                {metrics.length === "long" && "This is on the longer side. It may span two or more pages — consider trimming older roles."}
              </p>
            </div>
            {hints.length > 0 && (
              <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-3 dark:bg-amber-950/20">
                <p className="text-xs font-bold">Possible spelling issues</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{hints.map((h) => <Badge key={h.word} variant="outline">{h.word} → {h.suggestion}</Badge>)}</div>
                <p className="mt-2 text-[11px] text-muted-foreground">This is a small built-in list of common typos, not a full spell checker.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ats" className="mt-4 space-y-3">
            <p className="text-xs leading-relaxed text-muted-foreground">A quick local readability check. <strong>No tool can guarantee a particular ATS score or outcome</strong> — always follow the employer&apos;s instructions.</p>
            {ats.map((item) => (
              <div key={item.id} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
                {item.done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                <div><p className="text-xs font-semibold">{item.label}</p><p className="text-[11px] text-muted-foreground">{item.hint}</p></div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="examples" className="mt-4 space-y-5">
            <div>
              <p className="text-xs font-bold">Example summaries</p>
              <div className="mt-2 space-y-2">
                {EXAMPLE_SUMMARIES.map((s) => (
                  <div key={s.role} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-2"><p className="text-xs font-bold">{s.role}</p><Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => { onUseSummary(s.text); toast.success("Example summary inserted — edit it in your own words."); }}>Use</Button></div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold">Achievement bullet examples</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {BULLET_EXAMPLES.map((b) => (
                  <button key={b.label} onClick={() => { onCopyText(b.text); toast.success("Example copied to your clipboard."); }} className="rounded-xl border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5">
                    <p className="flex items-center gap-1 text-[11px] font-bold text-primary"><Copy className="h-3 w-3" /> {b.label}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{b.text}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold">Strong action verbs</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{ACTION_VERBS.map((v) => <Badge key={v} variant="secondary">{v}</Badge>)}</div>
            </div>
          </TabsContent>

          <TabsContent value="tips" className="mt-4">
            <div className="space-y-2">
              {WRITING_TIPS.map((tip, i) => (
                <div key={tip} className="flex gap-2.5 rounded-xl border border-border p-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{i + 1}</span>
                  <p className="text-xs leading-relaxed text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------- Data & drafts ------------------------- */
export function DataDialog({ open, onOpenChange, state, onReplace, onSample, onClear, onAutosaveChange }: {
  open: boolean; onOpenChange: (v: boolean) => void; state: ResumeState;
  onReplace: (s: ResumeState) => void; onSample: () => void; onClear: () => void;
  onAutosaveChange?: (v: boolean) => void;
}) {
  const [autosave, setAutosave] = useState(() => typeof window !== "undefined" && isAutosaveEnabled());
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => typeof window !== "undefined" ? getDrafts() : []);
  const [confirmAction, setConfirmAction] = useState<null | "clear" | "wipe">(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const importJson = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const result = parseImportedResume(text);
    if (!result.ok) { toast.error(result.error); return; }
    onReplace(result.state);
    toast.success("Resume imported. Review every field before downloading.");
    onOpenChange(false);
  };

  const duplicate = () => {
    const name = `${state.data.personal.fullName || "Untitled"} (copy)`;
    saveDraft(name, state);
    setDrafts(getDrafts());
    toast.success("A duplicate was saved to local drafts on this device.");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><HardDriveDownload className="h-4 w-4 text-primary" /> Resume data</DialogTitle>
            <DialogDescription>Manage your resume file. Everything stays in this browser — no server is involved.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="outline" onClick={() => { exportJson(state); toast.success("JSON file downloaded."); }}><FileJson className="h-4 w-4" /> Export JSON</Button>
              <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import JSON</Button>
              <Button variant="outline" onClick={duplicate}><Copy className="h-4 w-4" /> Duplicate resume</Button>
              <Button variant="outline" onClick={() => { onSample(); toast.success("Sample data loaded."); onOpenChange(false); }}><Sparkles className="h-4 w-4" /> Load sample data</Button>
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void importJson(e.target.files?.[0])} />

            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div><p className="text-xs font-bold">Local autosave</p><p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">Optionally keep one working draft in this browser&apos;s local storage so you can return to it. Nothing is sent anywhere.</p></div>
                <Switch checked={autosave} onCheckedChange={(v) => { setAutosave(v); setAutosaveEnabled(v); onAutosaveChange?.(v); toast.success(v ? "Autosave is on — data is stored only on this device." : "Autosave is off."); }} aria-label="Toggle local autosave" />
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between"><p className="text-xs font-bold">Saved drafts ({drafts.length})</p><Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={() => { clearAllDrafts(); setDrafts([]); toast.success("All locally saved data deleted."); }}><Trash2 className="h-3 w-3" /> Delete all</Button></div>
              {drafts.length === 0 ? <p className="mt-2 text-[11px] text-muted-foreground">No saved drafts. Use “Duplicate resume” to create one.</p> : (
                <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto scrollbar-slim">
                  {drafts.map((d) => (
                    <div key={d.id} className="flex items-center gap-2 rounded-lg bg-secondary/60 px-2.5 py-2">
                      <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold">{d.name}</p><p className="text-[10px] text-muted-foreground">{new Date(d.updatedAt).toLocaleString()}</p></div>
                      <Button size="sm" variant="outline" className="h-6 px-2 text-[10px]" onClick={() => { onReplace(d.state); toast.success("Draft loaded."); onOpenChange(false); }}>Load</Button>
                      <button aria-label={`Delete ${d.name}`} onClick={() => { deleteDraft(d.id); setDrafts(getDrafts()); }} className="text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-destructive/25 bg-destructive/5 p-3">
              <div><p className="text-xs font-bold">Start over</p><p className="text-[11px] text-muted-foreground">Clear all content and start with a blank resume.</p></div>
              <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => setConfirmAction("clear")}><RotateCcw className="h-3.5 w-3.5" /> Clear all</Button>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">Tip: download a JSON backup before closing the tab. Vellum cannot recover work from a closed tab unless autosave is enabled.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmAction === "clear"} onOpenChange={(v) => !v && setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Clear all resume content?</DialogTitle><DialogDescription>This removes everything you typed from this resume. Saved drafts and exported files are not affected. You can undo this action with the undo button.</DialogDescription></DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onClear(); setConfirmAction(null); onOpenChange(false); toast.success("Resume cleared."); }}>Clear everything</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ------------------------- Template picker ------------------------- */
export function TemplatePickerDialog({ open, onOpenChange, currentId, onPick }: {
  open: boolean; onOpenChange: (v: boolean) => void; currentId: string; onPick: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const results = TEMPLATES.filter((t) => !query || `${t.name} ${CATEGORY_LABELS[t.category]} ${t.styles.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>Choose a template</DialogTitle><DialogDescription>Your content is kept. Only the design changes — {TEMPLATES.length} layouts available.</DialogDescription></DialogHeader>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates…" className="mb-3 h-9 w-full rounded-lg border border-input bg-card px-3 text-sm" aria-label="Search templates" />
        <div className="grid max-h-[60vh] grid-cols-2 gap-2 overflow-y-auto scrollbar-slim sm:grid-cols-3 md:grid-cols-4">
          {results.map((t) => (
            <button key={t.id} onClick={() => { onPick(t.id); onOpenChange(false); }} className={cn("rounded-xl border p-2 text-left transition-all hover:border-primary hover:shadow-soft", currentId === t.id ? "border-primary bg-primary/5" : "border-border")}>
              <div className="mb-2 h-20 overflow-hidden rounded border border-border" style={{ background: "#fff" }}>
                <div className="h-full w-full overflow-hidden" style={{ transform: "scale(.28)", transformOrigin: "top left", width: "357%" }}>
                  <MiniResume template={t} width={260} />
                </div>
              </div>
              <p className="truncate text-[11px] font-bold">{t.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{CATEGORY_LABELS[t.category]}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

