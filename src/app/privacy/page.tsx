import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, HardDrive, ServerOff, ShieldCheck } from "lucide-react";
import { Card, Badge } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Vellum handles your data: no account, no uploads, no tracking. Your resume stays in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Badge>Privacy</Badge>
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Privacy policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 27 October 2026</p>

      <Card className="mt-7 border-primary/25 bg-primary/5 p-5">
        <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h2 className="text-sm font-bold">The short version</h2><p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">Vellum has no accounts, no database for resumes and no server that receives your resume content. Editing, template previews, PDF generation, printing and JSON import/export all happen inside your browser. Nothing you type is uploaded.</p></div></div>
      </Card>

      <PolicySection title="1. Information you provide">
        <p>The resume content you type — name, contact details, employment history, education, projects, and any photo you choose to add — is held in the memory of your open browser tab while you edit. Vellum does not transmit this content to a server, an AI service, or any third party.</p>
        <p>Because there is no account system, we do not collect your name, email address, password, payment details or any other registration information.</p>
      </PolicySection>

      <PolicySection title="2. Local storage on your device">
        <p>Vellum stores a small number of preferences in your browser&apos;s local storage:</p>
        <ul>
          <li>Your light/dark theme choice.</li>
          <li>Whether you have enabled optional local autosave.</li>
          <li>If autosave is enabled, one working copy of your resume document.</li>
          <li>Any named draft copies you explicitly create with “Duplicate resume”.</li>
        </ul>
        <p>All of that data stays on the device and browser you used. You can delete saved drafts at any time from the Resume data dialog, or clear your browser&apos;s site data. Autosave is off by default. If you do not enable it and you close the tab, your in-memory work cannot be recovered — download a JSON backup first.</p>
      </PolicySection>

      <PolicySection title="3. PDF export and printing">
        <p>PDF files are generated locally in your browser using jsPDF. Font files used by the PDF are static assets served from the Vellum website itself; they contain no information about you. No resume content is included in those font requests.</p>
        <p>The Print option uses your browser&apos;s built-in print dialog. Whether you save to PDF or print on paper, the content is handled by your browser and your operating system, not by a Vellum server.</p>
      </PolicySection>

      <PolicySection title="4. Files you import">
        <p>If you import a JSON resume file, it is read locally by your browser using the File API. The file is not uploaded. Vellum does not attempt to extract content from imported PDF or DOCX files; if you need to reuse an existing resume, copy its content into the builder manually or export it to Vellum&apos;s JSON format first.</p>
      </PolicySection>

      <PolicySection title="5. Cookies, analytics and third parties">
        <p>Vellum does not use advertising trackers, third-party analytics, session cookies or fingerprinting scripts. We do not embed external fonts, stylesheets, images or scripts from other domains in the resume editor. The site is designed to work without setting any non-essential cookies.</p>
        <p>Like any website, the server that hosts Vellum may receive standard technical information with each page request — for example an IP address, browser user agent and the URL requested — as part of ordinary HTTP operation. Resume content is never part of those requests.</p>
      </PolicySection>

      <PolicySection title="6. Data sharing and retention">
        <p>We have no resume database to share, sell or retain. We do not run a mailing list, and we do not send your data to an external AI provider. Any locally saved data remains under your control until you delete it or clear your browser storage.</p>
      </PolicySection>

      <PolicySection title="7. Your responsibilities">
        <p>Because Vellum cannot recover work from a closed tab unless autosave is on, please download your PDF and, if useful, a JSON backup before closing the builder. Avoid using a shared or public computer for sensitive personal information, or clear the site data when you finish.</p>
      </PolicySection>

      <PolicySection title="8. Changes to this policy">
        <p>If the way Vellum handles data changes, this page will be updated and the “last updated” date will change. Material changes will be described plainly rather than hidden in legal language.</p>
      </PolicySection>

      <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-5 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <p className="flex-1 text-muted-foreground">Questions about privacy? Read the <Link href="/faq" className="font-semibold text-primary hover:underline">FAQ</Link> or the <Link href="/terms" className="font-semibold text-primary hover:underline">terms of use</Link> for more detail on how the application behaves.</p>
      </div>
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-extrabold tracking-[-.02em]">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_li]:space-y-1">{children}</div>
    </section>
  );
}
