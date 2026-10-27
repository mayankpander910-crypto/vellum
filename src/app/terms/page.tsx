import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/misc";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using Vellum's free resume builder.",
};

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-12">
      <Badge variant="outline">Legal</Badge>
      <h1 className="mt-4 text-3xl font-extrabold tracking-[-.04em] sm:text-4xl">Terms of use</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: 27 October 2026</p>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">Vellum is a free tool. By using it you agree to the terms below. They are written to be readable rather than intimidating.</p>

      <Term title="1. The service">
        <p>Vellum provides browser-based resume templates, editing tools, a live preview and PDF export. The core application requires no account and no payment. We may improve or change features over time, but we will not introduce a paywall for PDF downloads of resumes created with the builder.</p>
      </Term>
      <Term title="2. Your content">
        <p>You own everything you write. Vellum does not claim ownership of your resume content, does not store it on a server, and does not use it to train AI models. You are responsible for the accuracy and legality of the information you put in your resume, including any photo you add.</p>
      </Term>
      <Term title="3. Templates and software">
        <p>The template designs, brand identity and application code are provided for you to use in creating your own resumes. You may use the PDFs you generate for any lawful purpose, including commercial job applications. You may not resell the template designs as a competing template library.</p>
        <p>Vellum uses open-source software including DejaVu fonts. Those components remain under their own licenses; a copy of the font license is included in the project&apos;s font directory.</p>
      </Term>
      <Term title="4. No guarantees">
        <p>Vellum is provided “as is”, without warranties of any kind. We cannot guarantee that a particular employer, recruiter or applicant tracking system will read your resume correctly, that a PDF will look identical in every viewer, or that using the tool will lead to interviews or employment. Always review your exported PDF before sending it.</p>
        <p>The writing assistant provides general suggestions and local checklists, not professional career, legal or immigration advice.</p>
      </Term>
      <Term title="5. Your device and data">
        <p>Because Vellum runs locally, you are responsible for keeping your device secure and for saving your own backups. If you use optional local autosave, the data remains on your device; deleting browser data removes it. See the <Link href="/privacy" className="font-semibold text-primary hover:underline">privacy policy</Link> for details.</p>
      </Term>
      <Term title="6. Acceptable use">
        <p>Do not use Vellum to create false credentials, impersonate another person, or produce fraudulent documents. Do not attempt to disrupt the site or circumvent its normal operation.</p>
      </Term>
      <Term title="7. Liability">
        <p>To the extent permitted by law, Vellum is not liable for indirect or consequential losses arising from use of the tool, including lost data, missed application deadlines or unsuccessful job applications.</p>
      </Term>
      <Term title="8. Changes">
        <p>We may update these terms as the product evolves. The date at the top will change when we do. Continuing to use Vellum after an update means you accept the revised terms.</p>
      </Term>
    </div>
  );
}

function Term({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-extrabold tracking-[-.02em]">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}
