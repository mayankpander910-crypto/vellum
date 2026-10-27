import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { GUIDES } from "@/data/guides";
import { Badge, Card } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Career Guides & Resume Writing Tips",
  description: "Practical, free guides on resume writing, achievement bullets, professional summaries, ATS readability and choosing a template.",
};

export default function GuidesPage() {
  const categories = Array.from(new Set(GUIDES.map((g) => g.category)));
  return (
    <>
      <section className="border-b border-border bg-card/50">
        <div className="container py-12">
          <Badge>Career guides</Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Write a resume that gets read</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">Short, practical articles with no fluff and no sign-up. Every guide links to templates you can use immediately.</p>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><span className="h-5 w-1 rounded-full bg-primary" /> {cat}</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {GUIDES.filter((g) => g.category === cat).map((g) => (
                    <Link key={g.slug} href={`/guides/${g.slug}`} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-4 w-4" /></span>
                      <h3 className="mt-4 text-base font-bold leading-snug group-hover:text-primary">{g.title}</h3>
                      <p className="mt-2 flex-1 text-[13px] leading-relaxed text-muted-foreground">{g.description}</p>
                      <span className="mt-4 flex items-center justify-between text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {g.readMinutes} min read</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <Card className="p-5">
              <h3 className="text-sm font-bold">Prefer to learn by doing?</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">The builder includes editable example summaries, achievement bullet templates, action verbs and a live completeness checklist.</p>
              <Link href="/builder" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline">Open the builder <ArrowRight className="h-3.5 w-3.5" /></Link>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-bold">Popular templates</h3>
              <ul className="mt-3 space-y-2 text-[13px]">
                {[["Simple ATS-Friendly", "simple-ats-friendly"], ["Modern Minimal", "modern-minimal"], ["Student Starter", "student-starter"], ["Executive", "executive"]].map(([label, id]) => (
                  <li key={id}><Link href={`/builder/?template=${id}`} className="text-muted-foreground hover:text-primary">{label} →</Link></li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-bold">A note on guarantees</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">No resume tool can guarantee an interview or a specific ATS score. These guides focus on factors you control: clarity, evidence and following instructions.</p>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
