import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { RESUME_EXAMPLES } from "@/data/resume-examples";
import { ExampleCard } from "@/components/examples/example-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Resume Examples for Every Career Stage",
  description: "Ten fictional, fully editable resume examples for students, freshers, developers, analysts, designers, marketers and experienced professionals.",
};

export default function ExamplesPage() {
  return (
    <>
      <section className="border-b border-border bg-card/50">
        <div className="container py-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"><Sparkles className="h-3 w-3" /> Fictional, fully editable examples</span>
          <h1 className="mt-5 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Resume examples that show you what works</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            Ten complete sample resumes across popular roles. Each uses fictional people, companies and numbers. Open any example in the builder and replace the content with your own — nothing here should be submitted as-is.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild><Link href="/builder">Start from scratch <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link href="/guides">Read the writing guides</Link></Button>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: FileText, title: "Real resume layouts", text: "Each example is rendered by the same engine as your own resume." },
            { icon: ShieldCheck, title: "Clearly fictional", text: "No invented testimonials or statistics — just illustrative sample people." },
            { icon: BadgeCheck, title: "One click to edit", text: "Open in the builder, swap in your details and download a fresh PDF." },
          ].map((x) => (
            <Card key={x.title} className="flex gap-3 p-4"><x.icon className="h-5 w-5 shrink-0 text-primary" /><div><p className="text-sm font-bold">{x.title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{x.text}</p></div></Card>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESUME_EXAMPLES.map((e) => <ExampleCard key={e.slug} example={e} />)}
        </div>
      </section>

      <section className="border-t border-border bg-card/60 py-14">
        <div className="container flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div><h2 className="text-xl font-extrabold tracking-[-.03em]">Ready to write your own?</h2><p className="mt-1.5 text-sm text-muted-foreground">Pick a template, add your details and download a free PDF — no account needed.</p></div>
          <Button asChild size="lg"><Link href="/builder">Open the resume builder <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </>
  );
}
