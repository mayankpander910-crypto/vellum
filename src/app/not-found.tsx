import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <LogoMark size={56} />
      <span className="mt-6 grid h-12 w-12 place-items-center rounded-2xl bg-secondary"><FileQuestion className="h-6 w-6 text-muted-foreground" /></span>
      <h1 className="mt-5 text-3xl font-extrabold tracking-[-.04em]">Page not found</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">That page does not exist (or moved). Your resume data is safe — nothing is stored on a server.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild><Link href="/"><ArrowLeft className="h-4 w-4" /> Back to home</Link></Button>
        <Button asChild variant="outline"><Link href="/templates">Browse templates</Link></Button>
        <Button asChild variant="outline"><Link href="/builder">Open the builder</Link></Button>
      </div>
    </div>
  );
}
