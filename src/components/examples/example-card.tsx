"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Sparkles } from "lucide-react";
import { MiniResume } from "@/components/resume-renderer/mini-resume";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getTemplate } from "@/data/templates";
import { exampleHref, exampleToState, type ResumeExample } from "@/data/resume-examples";

export function ExampleCard({ example }: { example: ResumeExample }) {
  const [open, setOpen] = useState(false);
  const template = getTemplate(example.templateId);
  const state = exampleToState(example);

  return (
    <>
      <div id={example.slug} className="group flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
        <button type="button" onClick={() => setOpen(true)} aria-label={`Preview ${example.title} example resume`}
          className="relative flex justify-center overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/.07),transparent_70%)] px-6 pt-6">
          <div className="w-full max-w-[220px] overflow-hidden rounded-t-lg border border-b-0 border-border bg-white shadow-sheet transition-transform duration-500 group-hover:scale-[1.02]">
            <MiniResume template={template} state={state} width={220} />
          </div>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/10 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow"><Eye className="h-3.5 w-3.5" /> Preview example</span>
          </span>
        </button>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-bold tracking-tight">{example.title}</h3>
            <Badge variant="secondary" className="shrink-0">{example.level}</Badge>
          </div>
          <p className="mt-1 text-xs font-semibold text-primary">{example.role}</p>
          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">{example.intro}</p>
          <ul className="mt-3 space-y-1">
            {example.highlights.slice(0, 2).map((h) => <li key={h} className="flex gap-1.5 text-[11px] text-muted-foreground"><Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {h}</li>)}
          </ul>
          <div className="mt-5 flex gap-2">
            <Button asChild size="sm" className="h-8 flex-1 text-xs"><Link href={exampleHref(example)}>Use this example <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setOpen(true)}>Preview</Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{example.title} — example resume</DialogTitle>
            <DialogDescription>Fictional sample content for demonstration. Every person, company and metric below is invented.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="flex justify-center overflow-hidden rounded-xl border border-border bg-muted/40 p-4"><MiniResume template={template} state={state} width={300} /></div>
            <div className="flex flex-col gap-4">
              <div><p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Why it works</p><ul className="mt-2 space-y-2">{example.highlights.map((h) => <li key={h} className="flex gap-2 text-[12px] leading-relaxed text-muted-foreground"><Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />{h}</li>)}</ul></div>
              <div><p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Template used</p><p className="mt-1 text-sm font-semibold">{template.name}</p><Link href={`/templates?category=${template.category}`} className="text-xs font-semibold text-primary hover:underline">Browse similar templates →</Link></div>
              <Button asChild className="mt-auto w-full"><Link href={exampleHref(example)}>Open in the builder <ArrowRight className="h-4 w-4" /></Link></Button>
              <p className="text-[11px] leading-relaxed text-muted-foreground">Replace all fictional details with your own before applying anywhere.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
