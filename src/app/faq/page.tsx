import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about pricing, privacy, templates, PDF export, ATS readability and saving your work in Vellum.",
};

const GROUPS = [
  {
    title: "Getting started",
    items: [
      { q: "Is Vellum free?", a: "Yes — completely. All 50 templates, every editing feature, customisation, JSON export and PDF download are free. There is no premium tier, no trial, no watermark and no limit on downloads." },
      { q: "Do I need to sign up or give my email?", a: "No. There is no registration, no login and no email collection anywhere in the application." },
      { q: "Do I need to install anything?", a: "No. Vellum runs in a modern browser on desktop, tablet and mobile. PDF generation happens in the browser; you only need a PDF viewer to open the result." },
      { q: "Which browsers are supported?", a: "Current versions of Chrome, Edge, Firefox and Safari. PDF export and printing rely on standard browser APIs, so very old browsers may behave differently." },
    ],
  },
  {
    title: "Privacy and data",
    items: [
      { q: "Where is my resume stored?", a: "By default only in the memory of the open tab. Nothing is uploaded. Optional local autosave keeps one copy in your browser's local storage so you can return to it; you can turn it off and delete saved data at any time." },
      { q: "Do you send my resume to an AI service?", a: "No. The writing assistant uses local examples, action verbs and checklists. There is no external AI API and no server-side processing of your content." },
      { q: "Do you use cookies or analytics?", a: "Vellum does not use advertising trackers, third-party analytics or non-essential cookies. Your theme preference and optional autosave are stored locally on your device." },
      { q: "Can I edit my resume later?", a: "Turn on local autosave, or download a JSON backup from the Resume data dialog and import it next time. JSON import is handled entirely in your browser." },
    ],
  },
  {
    title: "Templates and customisation",
    items: [
      { q: "How many templates are there?", a: "Fifty, organised into six categories: professional & corporate, modern & minimalist, students & freshers, technology & engineering, creative & design, and specialised layouts." },
      { q: "Can I change templates after writing my resume?", a: "Yes. Your content is separate from the design, so switching templates keeps everything you typed. Custom colours and spacing carry over where the new template supports them." },
      { q: "Can I change colours, fonts and spacing?", a: "Most templates support accent colour, font family, font size, section spacing, line spacing, margins, page size, section order and visibility controls. A few strict monochrome templates intentionally lock their palette for ATS compatibility — the Customize panel shows which options are available." },
      { q: "Do templates support A4 and US Letter?", a: "Yes. Switch page size in the Customize panel; the preview, print layout and PDF export all update." },
      { q: "Can I add my own section?", a: "Yes. Use “Custom sections” in the editor to create a heading with any number of entries, then reorder or hide it in the Customize panel." },
    ],
  },
  {
    title: "PDF export and printing",
    items: [
      { q: "Is the PDF text selectable?", a: "Yes. Vellum's direct PDF export writes real text with embedded DejaVu fonts, so you can search and copy text from the file. The Print → Save as PDF option also preserves selectable text from the browser." },
      { q: "Does it handle multiple pages?", a: "Yes. The preview shows separate pages with page-break indicators, and the PDF engine flows content across pages while trying to keep headings with the content that follows them." },
      { q: "Which export should I use?", a: "Use “Download PDF” for a lightweight, text-based PDF with your chosen page size. Use “Print” when you want a pixel-faithful copy of the on-screen layout — in the print dialog choose “Save as PDF” and enable background graphics for coloured templates." },
      { q: "Can Vellum export a Word (.docx) file?", a: "Not currently. You can export your content as JSON for backup, or use Print → Save as PDF. If an employer specifically requires .docx, recreate the resume in a word processor." },
      { q: "Can I import an existing PDF or DOCX resume?", a: "Not automatically. Reliable text extraction from arbitrary PDF and Word files is inconsistent, so Vellum does not pretend to do it. You can import a Vellum JSON export, or copy your existing content into the editor." },
    ],
  },
  {
    title: "ATS and job applications",
    items: [
      { q: "Will my resume pass an ATS?", a: "No tool can guarantee that. Choose a single-column, ATS-friendly template, use standard headings, keep contact details as text and follow the employer's instructions. Vellum includes a local readability checklist to help you spot common problems." },
      { q: "Does Vellum give an ATS score?", a: "No. A single score would be misleading. Instead, the writing assistant shows a transparent checklist of concrete, verifiable checks you can act on." },
      { q: "Should I include a photo?", a: "It depends on the country and role. Photos are common in some regions but are usually discouraged in the US, UK and Canada for equality reasons and are often stripped by ATS. Vellum makes photos optional on the templates that support them." },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Badge>FAQ</Badge>
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Frequently asked questions</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">Everything about pricing, privacy, templates, PDF export and getting the most out of your resume.</p>

      <div className="mt-10 space-y-9">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="text-lg font-extrabold tracking-[-.02em]">{group.title}</h2>
            <Accordion type="single" collapsible className="mt-3 rounded-2xl border border-border bg-card px-5">
              {group.items.map((item, i) => (
                <AccordionItem key={item.q} value={`f-${group.title.replace(/\s/g, "-")}-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center">
        <h2 className="text-lg font-extrabold">Still have a question?</h2>
        <p className="mt-2 text-sm text-muted-foreground">The best way to find out is to try it — no sign-up needed.</p>
        <Button asChild className="mt-4"><Link href="/builder">Open the resume builder <ArrowRight className="h-4 w-4" /></Link></Button>
      </div>
    </div>
  );
}
