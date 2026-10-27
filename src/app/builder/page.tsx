import { Suspense } from "react";
import type { Metadata } from "next";
import { BuilderWorkspace } from "@/components/builder/builder-workspace";

export const metadata: Metadata = {
  title: "Free Resume Builder — Live Preview",
  description: "Create your resume with an instant live preview. 50 templates, full customisation, free PDF download and no account required.",
};

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex h-[70vh] items-center justify-center text-sm text-muted-foreground">Preparing your resume workspace…</div>}>
      <BuilderWorkspace />
    </Suspense>
  );
}
