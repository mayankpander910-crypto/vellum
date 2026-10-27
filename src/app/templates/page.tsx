import { Suspense } from "react";
import type { Metadata } from "next";
import { TemplateGallery } from "@/components/templates/template-gallery";
import Link from "next/link";
import { ArrowRight, Check, FileQuestion, ShieldCheck, WandSparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Card } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "50 Free Resume Templates",
  description: "Browse 50 distinct, professional resume templates. Filter by category, style and career stage, preview each design and start editing for free.",
};

const FAQ = [
  { q: "Are all templates really free to download?", a: "Yes. Every one of the 50 templates can be edited, previewed and downloaded as a PDF at no cost. There are no premium templates and no watermarks." },
  { q: "Can I switch templates after I start?", a: "Absolutely. Your information is stored separately from the design, so changing templates keeps all your text. Your custom colours and spacing choices carry over where the new template supports them." },
  { q: "Which template is best for applicant tracking systems?", a: "Choose Simple ATS-Friendly, Simple Black and White, Simple ATS-Friendly variants or Formal Minimal. They use one column, standard section headings and no photos or graphics. The builder also includes a local ATS-readability checklist." },
  { q: "Do templates support both A4 and US Letter?", a: "Yes. You can switch the page size at any time in the Customize panel. The preview and PDF export both update to the correct dimensions." },
  { q: "Can I change colours and fonts?", a: "Most templates support accent colour, font family, font size, spacing, margins and more. A few deliberately strict black-and-white templates keep their original palette for ATS compatibility; the panel clearly marks which options are available." },
];

export default function TemplatesPage() {
  return (
    <>
      <Suspense fallback={<div className="container py-16 text-sm text-muted-foreground">Loading templates…</div>}>
        <TemplateGallery />
      </Suspense>

      <section className="border-t border-border bg-card/60 py-16">
        <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-extrabold tracking-[-.035em]">Choosing the right template</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">A good template gets out of the way of your content. Use these quick rules of thumb, and remember: you can switch at any time without retyping anything.</p>
            <div className="mt-6 space-y-3">
              {[
                { icon: ShieldCheck, title: "Applying through a job portal?", text: "Pick a single-column, ATS-friendly design with standard headings." },
                { icon: WandSparkles, title: "Applying to a design or creative role?", text: "A portfolio or editorial layout shows personality while keeping the content readable." },
                { icon: FileQuestion, title: "Short on experience?", text: "Student and project-focused layouts put education and projects above work history." },
              ].map((x) => (
                <div key={x.title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><x.icon className="h-4 w-4" /></span>
                  <div><p className="text-sm font-bold">{x.title}</p><p className="mt-0.5 text-[13px] text-muted-foreground">{x.text}</p></div>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-5">
            <h3 className="text-base font-bold">Template questions</h3>
            <Accordion type="single" collapsible className="mt-3">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`t-${i}`}>
                  <AccordionTrigger className="text-[13px]">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-[13px] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl bg-primary/5 p-4">
              <p className="flex-1 text-sm font-semibold">Ready to try one?</p>
              <Link href="/builder" className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">Open the builder <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <ul className="mt-4 grid gap-2 text-[13px] text-muted-foreground sm:grid-cols-2">
              {["50 layouts", "A4 & Letter", "Live preview", "Free PDF"].map((x) => <li key={x} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-600" /> {x}</li>)}
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
}
