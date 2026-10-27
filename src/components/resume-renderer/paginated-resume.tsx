"use client";

import React, { useMemo, useRef, useState, type CSSProperties } from "react";
import { useIsomorphicLayoutEffect } from "@/lib/use-isomorphic-layout-effect";
import type { ResumeState } from "@/types/resume";
import { PAGE_SIZES } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { buildResumeIR } from "@/lib/resume-ir";
import { paginateBlocks, type MeasuredBlock } from "@/lib/pagination";
import { docContext, docStyle, mix, type DocContext } from "./doc-style";
import { buildRenderBlocks, type RenderBlock } from "./flow-block";
import { ResumeHeader } from "./header";

interface Props {
  state: ResumeState;
  template: TemplateDefinition;
  highlightSection?: string | null;
  onPageCount?: (count: number) => void;
  className?: string;
  /** Renders at natural size without any extra wrapper (for the print portal). */
  bare?: boolean;
}

interface Layout {
  ctx: DocContext;
  ir: ReturnType<typeof buildResumeIR>;
  mainBlocks: RenderBlock[];
  asideBlocks: RenderBlock[];
  page: { width: number; height: number };
  innerWidth: number;
  innerHeight: number;
  margins: number;
  asideWidth: number;
  mainWidth: number;
  twoColumn: boolean;
}

function PageChrome({ layout, pageIndex, headerHeight, total }: {
  layout: Layout; pageIndex: number; headerHeight: number; total: number;
}) {
  const { ctx, page, margins, asideWidth, twoColumn } = layout;
  const { template, accent, soft, dark } = ctx;
  const leftSide = template.layout === "sidebar-left" || template.layout === "dark-sidebar" || template.layout === "banner-sidebar" || template.layout === "serif-columns";
  const stripeWidth = asideWidth + margins * 2;
  const top = pageIndex === 0 ? margins + headerHeight : 0;
  const decorations: React.ReactNode[] = [];

  if (twoColumn) {
    decorations.push(
      <div key="stripe" style={{
        position: "absolute", top, bottom: 0,
        left: leftSide ? 0 : undefined, right: leftSide ? undefined : 0,
        width: stripeWidth,
        background: dark ? accent : template.layout === "banner-sidebar" ? soft : mix(accent, [255, 255, 255], 0.94),
        zIndex: 0,
      }} />,
    );
  }
  if (template.layout === "rail") {
    decorations.push(<div key="rail" style={{ position: "absolute", top: 0, bottom: 0, left: margins - 14, width: 5, background: accent, zIndex: 0 }} />);
  }
  if (template.layout === "boxed") {
    decorations.push(<div key="frame" style={{ position: "absolute", inset: 13, border: `1px solid ${mix(accent, [255, 255, 255], 0.55)}`, borderRadius: 3, zIndex: 0 }} />);
  }
  if (template.layout === "editorial") {
    decorations.push(<div key="ed" style={{ position: "absolute", top: margins - 13, left: margins, right: margins, height: 4, borderTop: `3px double ${accent}`, zIndex: 0 }} />);
  }
  if (template.layout === "grid") {
    decorations.push(<div key="grid" style={{ position: "absolute", top: 0, bottom: 0, left: margins + layout.innerWidth / 2, width: 1, background: mix(accent, [255, 255, 255], 0.85), zIndex: 0 }} />);
  }
  if (template.layout === "portfolio") {
    decorations.push(<div key="pf" style={{ position: "absolute", top: 0, left: 0, width: 10, height: margins * 2, background: accent, zIndex: 0 }} />);
  }
  if (template.headerStyle === "band") {
    decorations.push(<div key="bandline" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: accent, zIndex: 0 }} />);
  }
  if (template.capabilities.icons && template.layout === "minimal-line") {
    decorations.push(<div key="ml" style={{ position: "absolute", top: margins, bottom: margins, left: margins - 10, width: 1, background: "var(--vr-line)", zIndex: 0 }} />);
  }
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {decorations}
      {ctx.state.customize.showPageNumbers && total > 1 && (
        <span className="vr-page-number" style={{ left: 0, right: 0, textAlign: "center", zIndex: 2 }}>
          {pageIndex + 1} / {total}
        </span>
      )}
      <span style={{ display: "none" }}>{page.width}</span>
    </div>
  );
}

export function PaginatedResume({ state, template, highlightSection, onPageCount, className, bare }: Props) {
  const c = state.customize;
  const layout = useMemo<Layout>(() => {
    const ctx = docContext(state, template, highlightSection);
    const ir = buildResumeIR(state, template);
    const page = PAGE_SIZES[c.pageSize];
    const margins = c.margins;
    const innerWidth = page.width - margins * 2;
    const innerHeight = page.height - margins * 2;
    const twoColumn = ir.twoColumn;
    const asideWidth = twoColumn ? Math.round(innerWidth * ((template.sidebarWidth ?? 30) / 100)) - 12 : 0;
    const mainWidth = twoColumn ? innerWidth - asideWidth - 24 : innerWidth;
    return {
      ctx, ir, page, margins, innerWidth, innerHeight, twoColumn, asideWidth, mainWidth,
      mainBlocks: buildRenderBlocks(ir.main, ctx),
      asideBlocks: buildRenderBlocks(ir.aside, ctx),
    };
  }, [state, template, highlightSection, c.pageSize, c.margins]);

  const contentKey = useMemo(() => JSON.stringify({
    d: state.data, c: state.customize, t: template.id, h: highlightSection,
  }), [state.data, state.customize, template.id, highlightSection]);

  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<{ main: string[][]; aside: string[][]; headerHeight: number } | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = measureRef.current;
    if (!root) return;
    let cancelled = false;
    const run = () => {
      if (cancelled || !measureRef.current) return;
      const el = measureRef.current;
      const heights = new Map<string, number>();
      el.querySelectorAll<HTMLElement>("[data-measure-block]").forEach((node) => {
        const id = node.dataset.measureBlock!;
        heights.set(id, node.getBoundingClientRect().height);
      });
      const headerHeight = (heights.get("__header") ?? 0) + 10;
      const measured = (blocks: RenderBlock[]): MeasuredBlock<string>[] => blocks.map((b) => ({
        id: b.id,
        height: Math.max(0, heights.get(b.id) ?? 14) + 0.5,
        keepWithNext: b.keepWithNext,
      }));
      const firstHeight = Math.max(80, layout.innerHeight - headerHeight);
      const main = paginateBlocks(measured(layout.mainBlocks), (i) => (i === 0 ? firstHeight : layout.innerHeight));
      const aside = layout.twoColumn
        ? paginateBlocks(measured(layout.asideBlocks), (i) => (i === 0 ? firstHeight : layout.innerHeight))
        : [[]];
      setPages({ main, aside, headerHeight });
    };
    const raf = requestAnimationFrame(run);
    // Re-measure once web-safe font metrics have settled.
    const fonts = typeof document !== "undefined" && document.fonts ? document.fonts.ready.then(() => requestAnimationFrame(run)) : Promise.resolve();
    return () => { cancelled = true; cancelAnimationFrame(raf); void fonts; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey, layout]);

  const pageCount = pages ? Math.max(pages.main.length, pages.aside.length) : 1;
  useIsomorphicLayoutEffect(() => { onPageCount?.(pageCount); }, [pageCount, onPageCount]);

  const style: CSSProperties = docStyle(layout.ctx);
  const header = <ResumeHeader header={layout.ir.header} ctx={layout.ctx} margins={layout.margins} fullBleed={!bare} />;

  const asideVarOverride: CSSProperties = layout.twoColumn && (layout.ctx.dark || template.layout === "dark-sidebar")
    ? ({
      "--vr-accent": "#ffffff", "--vr-ink": "#ffffff", "--vr-muted": "rgba(255,255,255,.78)",
      "--vr-line": "rgba(255,255,255,.3)", "--vr-soft": "rgba(255,255,255,.14)",
      color: "#fff",
    } as CSSProperties)
    : { "--vr-soft": mix(layout.ctx.accent, [255, 255, 255], 0.9) } as CSSProperties;

  const renderColumn = (blocks: RenderBlock[], ids: string[] | undefined) => {
    const set = new Set(ids ?? []);
    return blocks.filter((b) => set.has(b.id)).map((b) => <React.Fragment key={b.id}>{b.node}</React.Fragment>);
  };

  const pagesToRender = pages ? Array.from({ length: pageCount }, (_, i) => ({
    main: pages.main[i] ?? [], aside: pages.aside[i] ?? [],
  })) : [{ main: layout.mainBlocks.map((b) => b.id), aside: layout.asideBlocks.map((b) => b.id) }];

  return (
    <div className={`vr-doc ${className ?? ""}`} style={style} data-template={template.id}>
      {/* Hidden measurement pass: same CSS, exact page widths. */}
      <div ref={measureRef} data-measure-ref="true" aria-hidden="true" style={{
        position: "absolute", left: -20000, top: 0, width: layout.page.width,
        visibility: "hidden", pointerEvents: "none", zIndex: -1,
      }}>
        <div style={{ padding: layout.margins }} className="vr-doc" >
          <div style={{ ...style } as CSSProperties} className="vr-doc">
            <div data-measure-block="__header" style={{ width: layout.innerWidth, display: "flow-root" }}>{header}</div>
            <div style={{ width: layout.mainWidth, display: "flow-root", marginTop: 10 }}>
              {layout.mainBlocks.map((b) => <div key={b.id} data-measure-block={b.id} style={{ display: "flow-root", width: "100%" }}>{b.node}</div>)}
            </div>
            {layout.twoColumn && (
              <div style={{ width: layout.asideWidth, display: "flow-root", marginTop: 10 }}>
                {layout.asideBlocks.map((b) => <div key={b.id} data-measure-block={b.id} style={{ display: "flow-root", width: "100%" }}>{b.node}</div>)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
        {pagesToRender.map((ids, i) => (
          <div key={i} data-page-index={i} className="vr-page" style={{ width: layout.page.width, height: layout.page.height, flex: "none" }}>
            <PageChrome layout={layout} pageIndex={i} headerHeight={pages?.headerHeight ?? 0} total={pageCount} />
            <div className="vr-page-inner" style={{ padding: layout.margins, position: "relative", zIndex: 1 }}>
              {i === 0 && <div style={{ width: "100%", flex: "none" }}>{header}</div>}
              <div style={{
                display: "grid",
                gridTemplateColumns: layout.twoColumn ? `${layout.asideWidth}px minmax(0, 1fr)` : "minmax(0, 1fr)",
                columnGap: layout.twoColumn ? 24 : 0,
                alignItems: "start",
                flex: 1, minHeight: 0,
                marginTop: i === 0 ? 10 : 0,
                direction: template.layout === "sidebar-right" ? "rtl" : "ltr",
              }}>
                {layout.twoColumn && (
                  <aside className="vr-sidebar" style={{ ...asideVarOverride, width: layout.asideWidth, direction: "ltr", minWidth: 0 }}>
                    {renderColumn(layout.asideBlocks, ids.aside)}
                  </aside>
                )}
                <div style={{ width: layout.mainWidth, direction: "ltr", minWidth: 0 }}>
                  {renderColumn(layout.mainBlocks, ids.main)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
