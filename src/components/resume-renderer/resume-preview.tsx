"use client";

import { useEffect, useRef, useState } from "react";
import { PAGE_SIZES, type ResumeState } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { PaginatedResume } from "./paginated-resume";

interface Props {
  state: ResumeState;
  template: TemplateDefinition;
  zoom?: number; // multiplier over fit-to-width
  highlightSection?: string | null;
  onPageCount?: (n: number) => void;
  className?: string;
  minScale?: number;
  maxScale?: number;
}

/** Fit-to-width live preview with zoom. Page geometry is always physical px. */
export function ResumePreview({
  state, template, zoom = 1, highlightSection, onPageCount, className, minScale = 0.2, maxScale = 2,
}: Props) {
  const outer = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(700);
  const [pageCount, setPageCount] = useState(1);
  const page = PAGE_SIZES[state.customize.pageSize];

  useEffect(() => {
    const node = outer.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setAvailable(entry.contentRect.width);
    });
    ro.observe(node);
    setAvailable(node.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { onPageCount?.(pageCount); }, [pageCount, onPageCount]);

  const fit = Math.max(minScale, Math.min(maxScale, (available - 20) / page.width));
  const scale = Math.max(minScale, Math.min(maxScale, fit * zoom));
  const height = (page.height * pageCount + 18 * (pageCount - 1)) * scale;

  return (
    <div ref={outer} className={`w-full overflow-auto scrollbar-slim ${className ?? ""}`}>
      <div style={{ width: page.width * scale, height, margin: "0 auto", position: "relative" }} className="vr-print-scale">
        <div style={{ width: page.width, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <PaginatedResume
            state={state}
            template={template}
            highlightSection={highlightSection}
            onPageCount={setPageCount}
          />
        </div>
      </div>
    </div>
  );
}
