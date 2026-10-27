"use client";

import { useMemo, type CSSProperties } from "react";
import { PAGE_SIZES, type ResumeState } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { buildResumeIR } from "@/lib/resume-ir";
import { createEmptyState } from "@/lib/resume-utils";
import { sampleData } from "@/data/sample-resume";
import { docContext, docStyle, mix } from "./doc-style";
import { buildRenderBlocks } from "./flow-block";
import { ResumeHeader } from "./header";

/** A small but real resume rendering — used for gallery cards and hero art. */
export function MiniResume({ template, width = 240, className, state: externalState }: {
  template: TemplateDefinition; width?: number; className?: string; state?: ResumeState;
}) {
  const state = useMemo<ResumeState>(() => {
    if (externalState) return { ...externalState, templateId: template.id };
    const base = createEmptyState(template.id);
    const sample = sampleData();
    return {
      ...base,
      data: {
        ...sample,
        personal: { ...sample.personal, fullName: "Aarav Mehta", headline: "Senior Frontend Engineer" },
        experience: sample.experience.slice(0, 2).map((e) => ({ ...e, bullets: e.bullets.slice(0, 2) })),
        projects: sample.projects.slice(0, 1).map((p) => ({ ...p, achievements: p.achievements.slice(0, 1) })),
        skills: sample.skills.slice(0, 2),
        education: sample.education.slice(0, 1),
        awards: [], volunteer: [], activities: [], certifications: sample.certifications.slice(0, 1),
      },
    };
  }, [template, externalState]);

  const ctx = useMemo(() => docContext(state, template), [state, template]);
  const ir = useMemo(() => buildResumeIR(state, template), [state, template]);
  const main = useMemo(() => buildRenderBlocks(ir.main.slice(0, 22), ctx), [ir.main, ctx]);
  const aside = useMemo(() => buildRenderBlocks(ir.aside.slice(0, 16), ctx), [ir.aside, ctx]);
  const page = PAGE_SIZES.a4;
  const margins = state.customize.margins;
  const innerWidth = page.width - margins * 2;
  const twoColumn = ir.twoColumn;
  const asideWidth = twoColumn ? Math.round(innerWidth * ((template.sidebarWidth ?? 30) / 100)) - 12 : 0;
  const leftSide = !["sidebar-right"].includes(template.layout);
  const scale = width / page.width;
  const dark = template.layout === "dark-sidebar";
  const asideStyle: CSSProperties = dark ? ({
    "--vr-accent": "#fff", "--vr-ink": "#fff", "--vr-muted": "rgba(255,255,255,.8)",
    "--vr-line": "rgba(255,255,255,.3)", "--vr-soft": "rgba(255,255,255,.14)", color: "#fff",
  } as CSSProperties) : { "--vr-soft": mix(ctx.accent, [255, 255, 255], 0.9) } as CSSProperties;

  return (
    <div className={className} style={{ width, height: page.height * scale, overflow: "hidden", position: "relative", background: "#fff" }}>
      <div
        className="vr-doc"
        style={{ ...docStyle(ctx), width: page.width, height: page.height, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative", overflow: "hidden" }}
      >
        {twoColumn && (
          <div style={{
            position: "absolute", top: margins * 2.1, bottom: 0, width: asideWidth + margins * 2,
            left: leftSide ? 0 : undefined, right: leftSide ? undefined : 0,
            background: dark ? ctx.accent : mix(ctx.accent, [255, 255, 255], 0.93),
          }} />
        )}
        {template.layout === "rail" && <div style={{ position: "absolute", top: 0, bottom: 0, left: margins - 14, width: 5, background: ctx.accent }} />}
        {template.headerStyle === "band" && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 5, background: ctx.accent }} />}
        <div style={{ padding: margins, position: "relative", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ width: innerWidth }}><ResumeHeader header={ir.header} ctx={ctx} margins={margins} /></div>
          <div style={{
            display: "grid", gridTemplateColumns: twoColumn ? `${asideWidth}px minmax(0,1fr)` : "minmax(0,1fr)",
            gap: twoColumn ? 24 : 0, marginTop: 12, flex: 1, minHeight: 0, overflow: "hidden",
          }}>
            {twoColumn && <aside className="vr-sidebar" style={{ ...asideStyle, width: asideWidth, overflow: "hidden" }}>{aside.map((b) => <div key={b.id}>{b.node}</div>)}</aside>}
            <div style={{ width: twoColumn ? innerWidth - asideWidth - 24 : innerWidth, overflow: "hidden" }}>
              {main.map((b) => <div key={b.id}>{b.node}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
