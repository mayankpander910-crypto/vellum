"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RotateCcw, Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form-controls";
import { Badge } from "@/components/ui/misc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/misc";
import { TemplateCard } from "./template-card";
import {
  TEMPLATES, TEMPLATE_CATEGORIES, STYLE_TAGS, AUDIENCE_TAGS,
} from "@/data/templates";
import { CATEGORY_LABELS, type TemplateCategory } from "@/types/template";
import { cn } from "@/lib/utils";

type Sort = "popular" | "az" | "za" | "category" | "ats";

export function TemplateGallery() {
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TemplateCategory | "all">(() => {
    const v = params.get("category");
    return TEMPLATE_CATEGORIES.some((c) => c.id === v) ? (v as TemplateCategory | "all") : "all";
  });
  const [styles, setStyles] = useState<string[]>(() => {
    const v = params.get("style");
    return v && STYLE_TAGS.includes(v as never) ? [v] : [];
  });
  const [audiences, setAudiences] = useState<string[]>(() => {
    const v = params.get("audience");
    return v && AUDIENCE_TAGS.includes(v as never) ? [v] : [];
  });
  const [sort, setSort] = useState<Sort>("popular");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = TEMPLATES.filter((t) => {
      if (q && !`${t.name} ${t.description} ${t.styles.join(" ")} ${t.audiences.join(" ")} ${CATEGORY_LABELS[t.category]}`.toLowerCase().includes(q)) return false;
      if (category !== "all" && t.category !== category) return false;
      if (styles.length && !styles.every((s) => t.styles.includes(s as never))) return false;
      if (audiences.length && !audiences.every((a) => t.audiences.includes(a as never))) return false;
      return true;
    });
    const categoryOrder = TEMPLATE_CATEGORIES.map((c) => c.id);
    return [...filtered].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      if (sort === "category") return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || a.name.localeCompare(b.name);
      if (sort === "ats") return Number(b.styles.includes("ATS-Friendly")) - Number(a.styles.includes("ATS-Friendly")) || a.name.localeCompare(b.name);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name);
    });
  }, [query, category, styles, audiences, sort]);

  const toggle = (value: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };
  const activeCount = (category !== "all" ? 1 : 0) + styles.length + audiences.length + (query ? 1 : 0);
  const reset = () => { setQuery(""); setCategory("all"); setStyles([]); setAudiences([]); setSort("popular"); };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-1">
        <Badge className="w-fit">Template library</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">50 free resume templates</h1>
        <p className="max-w-2xl text-muted-foreground">Real layouts, real typography, real results. Filter by style or career stage, preview any design, then start editing — no account needed.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        {/* Filters */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold"><SlidersHorizontal className="h-4 w-4 text-primary" /> Filters</h2>
              {activeCount > 0 && <button onClick={reset} className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"><RotateCcw className="h-3 w-3" /> Reset</button>}
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates…" className="pl-9" aria-label="Search templates by name" />
            </div>

            <FilterGroup title="Category">
              <div className="flex flex-col gap-0.5">
                {TEMPLATE_CATEGORIES.map((c) => (
                  <button key={c.id} onClick={() => setCategory(c.id)} className={cn("flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors", category === c.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                    <span>{c.label}</span>
                    <span className="text-[11px] opacity-70">{c.id === "all" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === c.id).length}</span>
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Style">
              <div className="flex flex-wrap gap-1.5">
                {STYLE_TAGS.map((tag) => <Chip key={tag} label={tag} active={styles.includes(tag)} onClick={() => toggle(tag, styles, setStyles)} />)}
              </div>
            </FilterGroup>

            <FilterGroup title="Best for">
              <div className="flex flex-wrap gap-1.5">
                {AUDIENCE_TAGS.map((tag) => <Chip key={tag} label={tag} active={audiences.includes(tag)} onClick={() => toggle(tag, audiences, setAudiences)} />)}
              </div>
            </FilterGroup>
          </div>
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-bold">Not sure which one?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Start with Modern Minimal or Simple ATS-Friendly. You can switch templates at any time without losing your content.</p>
            <Button asChild size="sm" variant="outline" className="mt-3 w-full"><Link href="/builder">Open the builder <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{results.length}</span> template{results.length === 1 ? "" : "s"} found{activeCount > 0 ? ` with ${activeCount} filter${activeCount === 1 ? "" : "s"}` : ""}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">Sort by</span>
              <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
                <SelectTrigger className="h-8 w-[168px] text-xs" aria-label="Sort templates"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most popular</SelectItem>
                  <SelectItem value="az">Name A–Z</SelectItem>
                  <SelectItem value="za">Name Z–A</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="ats">Most ATS-friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {query && <ActiveChip label={`Search: ${query}`} onRemove={() => setQuery("")} />}
              {category !== "all" && <ActiveChip label={CATEGORY_LABELS[category]} onRemove={() => setCategory("all")} />}
              {styles.map((s) => <ActiveChip key={s} label={s} onRemove={() => toggle(s, styles, setStyles)} />)}
              {audiences.map((a) => <ActiveChip key={a} label={a} onRemove={() => toggle(a, audiences, setAudiences)} />)}
            </div>
          )}

          {results.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary"><Search className="h-6 w-6 text-muted-foreground" /></span>
              <h3 className="mt-5 text-lg font-bold">No templates match those filters</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">Try removing a filter or searching for a broader term like “minimal” or “developer”.</p>
              <Button variant="outline" className="mt-5" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset all filters</Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((t) => <TemplateCard key={t.id} template={t} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="mt-5 border-t border-border pt-4"><h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-[.12em] text-muted-foreground">{title}</h3>{children}</div>;
}
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} aria-pressed={active} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground")}>{label}</button>;
}
function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">{label}<button onClick={onRemove} aria-label={`Remove ${label} filter`} className="rounded-full hover:bg-primary/20"><X className="h-3 w-3" /></button></span>;
}
