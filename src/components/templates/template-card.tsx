"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, Sparkles } from "lucide-react";
import { MiniResume } from "@/components/resume-renderer/mini-resume";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORY_LABELS, type TemplateDefinition } from "@/types/template";
import { templateHref } from "@/data/templates";

export function ResponsiveMiniResume({ template, maxWidth = 320 }: { template: TemplateDefinition; maxWidth?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(maxWidth);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ro = new ResizeObserver(([e]) => { if (e) setWidth(Math.min(maxWidth, e.contentRect.width)); });
    ro.observe(node);
    setWidth(Math.min(maxWidth, node.clientWidth));
    return () => ro.disconnect();
  }, [maxWidth]);
  return <div ref={ref} className="w-full"><MiniResume template={template} width={Math.max(60, width)} /></div>;
}

export function TemplateCard({ template, showCategory = true }: { template: TemplateDefinition; showCategory?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Preview ${template.name} template`}
          className="relative block w-full overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/.07),transparent_65%)] px-6 pt-6"
        >
          <div className="mx-auto w-full max-w-[250px] overflow-hidden rounded-t-lg border border-b-0 border-border bg-white shadow-sheet transition-transform duration-500 group-hover:scale-[1.025]">
            <ResponsiveMiniResume template={template} maxWidth={250} />
          </div>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all duration-300 group-hover:bg-foreground/10 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold shadow-md"><Eye className="h-3.5 w-3.5" /> Quick preview</span>
          </span>
          {template.featured && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow"><Sparkles className="h-3 w-3" /> Popular</span>}
        </button>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold leading-tight tracking-tight">{template.name}</h3>
            {showCategory && <Badge variant="outline" className="shrink-0 text-[10px]">{CATEGORY_LABELS[template.category].split(" ")[0]}</Badge>}
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{template.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {template.styles.slice(0, 2).map((s) => <span key={s} className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground">{s}</span>)}
          </div>
          <div className="mt-4 flex items-center gap-2 pt-1">
            <Button asChild size="sm" className="h-8 flex-1 text-xs"><Link href={templateHref(template.id)}>Use Template</Link></Button>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setOpen(true)}>Preview</Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{template.name}</DialogTitle>
            <DialogDescription>{template.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_220px]">
            <div className="flex justify-center overflow-hidden rounded-xl border border-border bg-muted/40 p-4">
              <MiniResume template={template} width={300} />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Category</p>
                <p className="mt-1 text-sm font-semibold">{CATEGORY_LABELS[template.category]}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Style</p>
                <div className="mt-1.5 flex flex-wrap gap-1">{template.styles.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}</div>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Good for</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{template.audiences.join(" · ")}</p>
              </div>
              <div className="mt-auto space-y-2">
                <Button asChild className="w-full"><Link href={templateHref(template.id)}>Use This Template <ArrowRight className="h-4 w-4" /></Link></Button>
                <Link href="/templates" className="block text-center text-xs font-medium text-muted-foreground hover:text-primary">Browse all 50 templates</Link>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
