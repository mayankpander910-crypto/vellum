import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ArrowUpRight } from "lucide-react";

const COLUMNS = [
  {
    title: "Templates",
    links: [
      { label: "All templates", href: "/templates" },
      { label: "Professional & corporate", href: "/templates?category=professional" },
      { label: "Modern & minimalist", href: "/templates?category=modern" },
      { label: "Students & freshers", href: "/templates?category=students" },
      { label: "Technology & engineering", href: "/templates?category=technology" },
      { label: "Creative & design", href: "/templates?category=creative" },
      { label: "Specialized layouts", href: "/templates?category=specialized" },
    ],
  },
  {
    title: "Resume examples",
    links: [
      { label: "Browse all examples", href: "/examples" },
      { label: "Computer science student", href: "/examples#computer-science-student" },
      { label: "Frontend developer", href: "/examples#frontend-developer" },
      { label: "Data analyst", href: "/examples#data-analyst" },
      { label: "UI/UX designer", href: "/examples#ui-ux-designer" },
      { label: "Experienced professional", href: "/examples#experienced-professional" },
    ],
  },
  {
    title: "Career guides",
    links: [
      { label: "All guides", href: "/guides" },
      { label: "Resume for freshers", href: "/guides/fresher-resume-guide" },
      { label: "Professional summary", href: "/guides/professional-summary" },
      { label: "Achievement bullets", href: "/guides/achievement-focused-bullets" },
      { label: "ATS-readable resumes", href: "/guides/ats-readable-resume" },
      { label: "Choosing a template", href: "/guides/choosing-a-resume-template" },
    ],
  },
  {
    title: "Vellum",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
      { label: "FAQ", href: "/faq" },
      { label: "Resume builder", href: "/builder" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Link href="/" aria-label="Vellum home"><Logo /></Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A free, private resume builder. Choose a template, write your story, and download a polished PDF — all in your browser, with no account.
            </p>
            <Link href="/builder" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Start building <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[.14em] text-foreground/80">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href + l.label}><Link href={l.href} className="text-[13px] text-muted-foreground transition-colors hover:text-primary">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vellum. Built for job seekers everywhere.</p>
          <p className="flex items-center gap-2"><span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> Free forever · No sign-up · Your data stays on your device</p>
        </div>
      </div>
    </footer>
  );
}
