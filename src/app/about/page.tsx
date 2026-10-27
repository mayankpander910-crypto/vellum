import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, HeartHandshake, Layers3, LockKeyhole, PenLine, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Card, Badge } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "About Vellum",
  description: "Why we built a free, private resume builder and the principles behind it.",
};

const PRINCIPLES = [
  { icon: LockKeyhole, title: "Private by default", text: "Your resume lives in your browser. No account, no database, no server-side copy of your personal information." },
  { icon: HeartHandshake, title: "Free for real", text: "Every template and every export is free. There is no premium tier, no watermark, no trial and no download limit." },
  { icon: Eye, title: "Honest guidance", text: "We offer practical writing help and local checklists. We do not promise ATS scores, interviews or job offers." },
  { icon: PenLine, title: "Craft over clutter", text: "Good typography, sensible spacing and a clear hierarchy beat decorative dashboards every time." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-border bg-card/50">
        <div className="container max-w-4xl py-14">
          <Logo size={42} />
          <h1 className="mt-6 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">A better way to make a resume</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Vellum is a free, browser-based resume builder. We built it because creating a professional resume should not require an account, a subscription, or handing your personal details to yet another website.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Everything essential — fifty templates, the editor, the live preview, PDF export, JSON backup and the writing helpers — runs locally in your browser. There is no backend for resume data and no third-party AI processing.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild><Link href="/builder">Try the builder <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild variant="outline"><Link href="/privacy">Read the privacy policy</Link></Button>
          </div>
        </div>
      </section>

      <section className="container max-w-4xl py-14">
        <Badge variant="outline">Our principles</Badge>
        <h2 className="mt-4 text-2xl font-extrabold tracking-[-.035em]">What we care about</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <Card key={p.title} className="p-5"><p.icon className="h-5 w-5 text-primary" /><h3 className="mt-4 text-base font-bold">{p.title}</h3><p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{p.text}</p></Card>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-xl font-extrabold tracking-[-.03em]">How Vellum works</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Your content is a structured document: personal details, experience, education, skills, projects and optional sections. Each template is a set of design rules — layout, typography, colours and spacing — that renders that same document.</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Because content and design are separate, you can switch templates, change page size or reorder sections without retyping anything. The same structured document drives the on-screen preview, the print layout and the downloadable PDF.</p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-[-.03em]">What we deliberately left out</h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Accounts, passwords and email collection</li>
              <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Payment screens, paywalls and download quotas</li>
              <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> External AI APIs that would receive your resume text</li>
              <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Made-up testimonials, user counts and awards</li>
              <li className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Third-party analytics and advertising trackers</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-muted/30 p-6">
          <h2 className="text-lg font-extrabold">Built with open tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Vellum is built with Next.js, TypeScript, Tailwind CSS, Radix-based accessible UI components, React Hook Form, Zod, jsPDF and the DejaVu font family. The fonts used in PDF export are included as static assets served by the app itself, so no font request leaves the site.</p>
        </div>
      </section>
    </>
  );
}
