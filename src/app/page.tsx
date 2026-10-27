import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Check, ChevronRight, Download, Eye, FileText,
  GraduationCap, Layers3, Lock, MousePointerClick, Palette, PenLine,
  ShieldCheck, Sparkles, WandSparkles, BriefcaseBusiness, Code2, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from "@/components/ui/misc";
import { FadeIn } from "@/components/shared/fade-in";
import { MiniResume } from "@/components/resume-renderer/mini-resume";
import { TemplateCard } from "@/components/templates/template-card";
import { getTemplate } from "@/data/templates";

const FEATURED = [
  "modern-minimal", "classic-professional", "creative-portfolio", "software-developer",
  "simple-ats-friendly", "modern-sidebar", "student-starter", "executive",
];

const STEPS = [
  { n: "01", title: "Choose your template", text: "Browse 50 real resume designs and pick the one that fits your target role.", icon: Layers3 },
  { n: "02", title: "Add your information", text: "Fill in simple forms for experience, education, skills, projects and more.", icon: PenLine },
  { n: "03", title: "Customize your resume", text: "Fine-tune colours, type, spacing, page size and section order as you go.", icon: Palette },
  { n: "04", title: "Download your PDF", text: "Export a clean, print-ready PDF in A4 or US Letter. No paywall, ever.", icon: Download },
];

const BENEFITS = [
  { icon: BadgeCheck, title: "Completely free", text: "Every template, every feature and every download is free. No subscriptions, no trials." },
  { icon: Lock, title: "No account required", text: "Open the builder and start typing. We never ask for an email address or password." },
  { icon: Eye, title: "Live preview", text: "See every change on a real A4 page instantly, including multi-page layouts." },
  { icon: ShieldCheck, title: "Private by design", text: "Your resume stays in your browser. Editing, previews and PDF export all happen locally." },
  { icon: Download, title: "Real PDF export", text: "Selectable text, embedded fonts, proper page breaks and your choice of page size." },
  { icon: MousePointerClick, title: "Easy on mobile", text: "A dedicated mobile editor with tabs, expandable sections and a full-width preview." },
  { icon: WandSparkles, title: "Writing help built in", text: "Example summaries, action verbs, bullet templates and a completeness checklist." },
  { icon: FileText, title: "ATS-friendly options", text: "Single-column, standard-heading templates plus a local readability checklist." },
];

const TIPS = [
  { title: "Lead with outcomes", text: "“Cut page load time by 60%” says more than “responsible for performance”." },
  { title: "Keep bullets short", text: "One or two lines each. Start with a verb, add context, then a result." },
  { title: "Mirror the job posting", text: "Reuse the skills and phrases the employer uses — where they honestly apply." },
  { title: "Order by relevance", text: "Put your strongest section near the top, especially if you are a fresher." },
  { title: "Proofread out loud", text: "Reading your resume aloud catches typos and awkward phrasing quickly." },
];

const FAQ = [
  { q: "Is Vellum really free?", a: "Yes. All 50 templates, all editing features, customisation, JSON export and PDF downloads are free. There is no paid tier, no trial, no watermarks and no download limit." },
  { q: "Do I need to create an account?", a: "No. There is no sign-up, no login and no email collection. You can open the builder, create a resume and download it without identifying yourself." },
  { q: "Where is my resume data stored?", a: "By default your resume exists only in the memory of the open browser tab. Nothing is uploaded. If you enable the optional local autosave, a copy is kept in your browser's local storage on your device, and you can delete it at any time." },
  { q: "Will my resume pass an ATS?", a: "No tool can guarantee that. Vellum offers single-column, standard-heading templates and a local readability checklist that help you avoid common parsing problems. Always read the employer's instructions before applying." },
  { q: "Can I switch templates after writing my resume?", a: "Yes. Your content is stored separately from the template design, so switching templates keeps everything you entered. You can also switch page size between A4 and US Letter." },
  { q: "Can I edit my resume later?", a: "Turn on local autosave to keep a draft on this device, or download your resume as a JSON file and import it the next time you visit. JSON import is handled entirely in your browser." },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-32 h-[380px] w-[380px] rounded-full bg-amber-300/10 blur-3xl" />
        <div className="container relative grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_1fr] lg:py-20">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> 50 free templates · No account needed
            </span>
            <h1 className="mt-6 text-balance text-[2.6rem] font-extrabold leading-[1.06] tracking-[-.045em] sm:text-[3.4rem] lg:text-[3.75rem]">
              Build a Resume<br className="hidden sm:block" /> That <span className="text-primary">Opens Doors.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Create a professional, job-ready resume in minutes. Choose a template, add your details, and download it for free — no sign-up, no hidden fees.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 px-6 text-[15px] shadow-md shadow-primary/20">
                <Link href="/builder">Build My Resume — Free <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-[15px]">
                <Link href="/templates">Explore Templates</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 text-[13px] font-medium text-muted-foreground">
              {["No credit card", "Live preview", "Instant PDF", "Private by default"].map((item) => (
                <li key={item} className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600" /> {item}</li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.12} className="relative">
            <div className="relative mx-auto h-[430px] w-full max-w-[520px] sm:h-[480px]">
              <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 bg-primary/[.035]" />
              <div className="absolute left-[3%] top-[9%] w-[47%] -rotate-[9deg] overflow-hidden rounded-lg border border-border bg-white shadow-lift transition-transform hover:-translate-y-1">
                <MiniResume template={getTemplate("classic-professional")} width={244} />
              </div>
              <div className="absolute right-[3%] top-[2%] w-[47%] rotate-[8deg] overflow-hidden rounded-lg border border-border bg-white shadow-lift transition-transform hover:-translate-y-1">
                <MiniResume template={getTemplate("modern-sidebar")} width={244} />
              </div>
              <div className="absolute bottom-[1%] left-1/2 z-10 w-[53%] -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-white shadow-[0_20px_60px_-18px_rgba(20,20,50,.45)] transition-transform hover:-translate-y-1">
                <MiniResume template={getTemplate("creative-portfolio")} width={276} />
              </div>
              <div className="absolute -left-2 bottom-16 z-20 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold shadow-lift sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40"><Eye className="h-4 w-4" /></span>
                Live preview
              </div>
              <div className="absolute -right-2 top-1/3 z-20 hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold shadow-lift sm:flex">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary"><Download className="h-4 w-4" /></span>
                PDF ready
              </div>
            </div>
          </FadeIn>
        </div>
        <div className="border-t border-border bg-card/60">
          <div className="container flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4 text-[13px] font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-primary" /> 50 distinct templates</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 100% browser-based</span>
            <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> A4 &amp; US Letter</span>
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-primary" /> Free forever</span>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURED TEMPLATES ---------------- */}
      <section id="templates" className="container py-20">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <Badge>Template library</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em] sm:text-4xl">Find a design that fits your story</h2>
          <p className="mt-3 text-muted-foreground">Every template is a real, editable resume layout — not a colour swap. Pick one and make it yours.</p>
        </FadeIn>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((id, i) => (
            <FadeIn key={id} delay={(i % 4) * 0.06}><TemplateCard template={getTemplate(id)} /></FadeIn>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg"><Link href="/templates">View all 50 templates <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="border-y border-border bg-card/60 py-20">
        <div className="container">
          <FadeIn className="mx-auto max-w-2xl text-center">
            <Badge variant="outline">How it works</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em] sm:text-4xl">From blank page to PDF in four steps</h2>
            <p className="mt-3 text-muted-foreground">No tutorials needed. The builder guides you through each section.</p>
          </FadeIn>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.07}>
                <Card className="relative h-full p-6">
                  <span className="absolute right-5 top-4 text-4xl font-black text-primary/10">{step.n}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><step.icon className="h-5 w-5" /></span>
                  <h3 className="mt-5 text-base font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BENEFITS ---------------- */}
      <section className="container py-20">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <Badge>Why Vellum</Badge>
          <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em] sm:text-4xl">Everything you need, nothing you don&apos;t</h2>
          <p className="mt-3 text-muted-foreground">A focused tool that respects your time, your data and your wallet.</p>
        </FadeIn>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <FadeIn key={b.title} delay={(i % 4) * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <b.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 text-sm font-bold">{b.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------------- CATEGORIES + AUDIENCES ---------------- */}
      <section className="border-y border-border bg-card/60 py-20">
        <div className="container grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <Badge variant="outline">By category</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em]">Templates for every kind of work</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                { name: "Professional & Corporate", slug: "professional", count: 8, icon: BriefcaseBusiness },
                { name: "Modern & Minimalist", slug: "modern", count: 8, icon: Layers3 },
                { name: "Students & Freshers", slug: "students", count: 8, icon: GraduationCap },
                { name: "Technology & Engineering", slug: "technology", count: 8, icon: Code2 },
                { name: "Creative & Design", slug: "creative", count: 6, icon: Palette },
                { name: "Specialized Layouts", slug: "specialized", count: 12, icon: FileText },
              ].map((cat) => (
                <Link key={cat.slug} href={`/templates?category=${cat.slug}`} className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-all hover:border-primary/40 hover:shadow-soft">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-primary"><cat.icon className="h-4 w-4" /></span>
                  <span className="flex-1"><span className="block text-sm font-semibold">{cat.name}</span><span className="text-xs text-muted-foreground">{cat.count} templates</span></span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Badge variant="outline">By career stage</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em]">Written for where you are now</h2>
            <div className="mt-7 space-y-4">
              {[
                { title: "Students & freshers", text: "Education-first layouts, project-focused sections and example summaries that help when you have little or no work experience.", icon: GraduationCap, href: "/examples#fresher" },
                { title: "Experienced professionals", text: "Executive and corporate templates with room for a decade of impact, plus sections for awards, publications and leadership.", icon: Users, href: "/examples#experienced-professional" },
                { title: "Career changers", text: "Skills-first structures and functional layouts that translate your past experience into a new industry's language.", icon: Sparkles, href: "/templates?audience=Career%20Changers" },
              ].map((item) => (
                <Link key={item.title} href={item.href} className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-soft">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><item.icon className="h-5 w-5" /></span>
                  <span><span className="flex items-center gap-1 text-sm font-bold group-hover:text-primary">{item.title} <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" /></span><span className="mt-1 block text-[13px] leading-relaxed text-muted-foreground">{item.text}</span></span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ---------------- EXAMPLES + TIPS ---------------- */}
      <section className="container py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <FadeIn>
            <Badge>Resume examples</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em]">See how a strong resume reads</h2>
            <p className="mt-3 max-w-lg text-muted-foreground">Ten fictional, fully editable examples across popular roles. Open any example in the builder and replace the details with your own.</p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {["Computer science student", "Fresher resume", "Frontend developer", "Backend developer", "Full-stack developer", "Data analyst", "AI/ML engineer", "UI/UX designer", "Marketing professional", "Experienced professional"].map((x) => (
                <Link key={x} href="/examples" className="flex items-center justify-between rounded-lg border border-border bg-card px-3.5 py-2.5 text-[13px] font-medium transition-colors hover:border-primary/40 hover:text-primary">
                  {x}<ChevronRight className="h-3.5 w-3.5 opacity-50" />
                </Link>
              ))}
            </div>
            <Button asChild variant="link" className="mt-4 px-0"><Link href="/examples">Browse all examples <ArrowRight className="h-4 w-4" /></Link></Button>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Badge variant="outline">Writing tips</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em]">Small edits, big difference</h2>
            <div className="mt-7 space-y-3">
              {TIPS.map((tip, i) => (
                <div key={tip.title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">{i + 1}</span>
                  <div><p className="text-sm font-bold">{tip.title}</p><p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{tip.text}</p></div>
                </div>
              ))}
            </div>
            <Button asChild variant="link" className="mt-4 px-0"><Link href="/guides">Read the career guides <ArrowRight className="h-4 w-4" /></Link></Button>
          </FadeIn>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="border-t border-border bg-card/60 py-20">
        <div className="container max-w-3xl">
          <FadeIn className="text-center">
            <Badge variant="outline">FAQ</Badge>
            <h2 className="mt-4 text-3xl font-extrabold tracking-[-.035em]">Questions, answered</h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-5">
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
          <p className="mt-5 text-center text-sm text-muted-foreground">More detail on the <Link href="/faq" className="font-semibold text-primary hover:underline">full FAQ page</Link>.</p>
        </div>
      </section>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="container py-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-[linear-gradient(115deg,hsl(var(--primary)/.09),hsl(var(--background))_60%)] px-6 py-14 text-center sm:px-14">
            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
            <h2 className="text-balance text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Your next opportunity starts with a great resume.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">It takes a few minutes, costs nothing, and everything you type stays on your device.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-7"><Link href="/builder">Create My Resume — Free <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-7"><Link href="/templates">Browse templates</Link></Button>
            </div>
            <p className="mt-5 text-xs font-medium text-muted-foreground">No sign-up · No credit card · No watermarks</p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
