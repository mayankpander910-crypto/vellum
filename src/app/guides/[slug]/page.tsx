import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3, Lightbulb, Sparkles } from "lucide-react";
import { GUIDES, getGuideBySlug } from "@/data/guides";
import { getTemplate, templateHref } from "@/data/templates";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/misc";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  return { title: guide.title, description: guide.description };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();
  const others = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-border bg-card/50">
        <div className="container max-w-4xl py-10">
          <Link href="/guides" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="h-3.5 w-3.5" /> All guides</Link>
          <div className="mt-5 flex flex-wrap items-center gap-2"><Badge>{guide.category}</Badge><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" /> {guide.readMinutes} min read</span><span className="text-xs text-muted-foreground">· Updated {new Date(guide.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span></div>
          <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-[-.04em] sm:text-[2.6rem]">{guide.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{guide.intro}</p>
        </div>
      </div>

      <div className="container max-w-4xl py-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <article>
            <div className="space-y-10">
              {guide.sections.map((section, i) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-extrabold tracking-[-.03em]"><span className="mr-2 text-primary">{String(i + 1).padStart(2, "0")}</span>{section.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map((para) => <p key={para.slice(0, 40)} className="text-[15px] leading-[1.8] text-foreground/80">{para}</p>)}
                    {section.bullets && (
                      <ul className="space-y-2 rounded-xl border border-border bg-card p-4">
                        {section.bullets.map((b) => <li key={b} className="flex gap-2 text-sm leading-relaxed text-muted-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{b}</li>)}
                      </ul>
                    )}
                    {section.tip && (
                      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <p className="text-sm leading-relaxed text-foreground/80"><strong>Tip:</strong> {section.tip}</p>
                      </div>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl border border-primary/15 bg-primary/5 p-6">
              <h2 className="text-lg font-extrabold">Put the advice into practice</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Open a template, add your details and watch the live preview update as you write. Everything stays in your browser.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild><Link href="/builder">Open the resume builder <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button asChild variant="outline"><Link href="/templates">Browse 50 templates</Link></Button>
              </div>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <Card className="p-4">
              <h3 className="flex items-center gap-1.5 text-sm font-bold"><Sparkles className="h-4 w-4 text-primary" /> Templates for this guide</h3>
              <ul className="mt-3 space-y-2">
                {guide.relatedTemplates.map((id) => (
                  <li key={id}><Link href={templateHref(id)} className="flex items-center justify-between text-[13px] text-muted-foreground hover:text-primary">{getTemplate(id).name}<ArrowRight className="h-3 w-3" /></Link></li>
                ))}
              </ul>
            </Card>
            {guide.relatedExamples && (
              <Card className="p-4">
                <h3 className="text-sm font-bold">Related examples</h3>
                <ul className="mt-3 space-y-2">
                  {guide.relatedExamples.map((slug) => <li key={slug}><Link href={`/examples#${slug}`} className="text-[13px] capitalize text-muted-foreground hover:text-primary">{slug.replace(/-/g, " ")} →</Link></li>)}
                </ul>
              </Card>
            )}
            <Card className="p-4">
              <h3 className="text-sm font-bold">More guides</h3>
              <ul className="mt-3 space-y-3">{others.map((g) => <li key={g.slug}><Link href={`/guides/${g.slug}`} className="text-[13px] font-medium leading-snug text-muted-foreground hover:text-primary">{g.title}</Link></li>)}</ul>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
