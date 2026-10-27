"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ResumeState } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { PaginatedResume } from "./paginated-resume";

/**
 * Renders an unscaled, natural-size copy of the resume directly under <body>.
 * It is invisible on screen and becomes the only visible element when printing,
 * so the browser's "Save as PDF" produces a pixel-faithful, selectable-text PDF.
 */
export function PrintPortal({ state, template }: { state: ResumeState; template: TemplateDefinition }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || typeof document === "undefined") return null;
  const size = state.customize.pageSize === "a4" ? "A4" : "Letter";
  return createPortal(
    <div className="vr-print-portal" data-print-portal="true">
      <style>{`@page { size: ${size}; margin: 0; }`}</style>
      <div className="vr-print-root">
        <PaginatedResume state={state} template={template} />
      </div>
    </div>,
    document.body,
  );
}
