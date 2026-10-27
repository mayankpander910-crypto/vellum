"use client";

import React, { type CSSProperties, type ReactNode } from "react";
import { Github, Globe, Link2, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import type { FlowBlock, IconKey } from "@/lib/resume-ir";
import type { DocContext } from "./doc-style";

export interface RenderBlock {
  id: string;
  column: "main" | "aside";
  node: ReactNode;
  keepWithNext?: boolean;
  sectionId?: string;
}

const ICONS: Record<IconKey, typeof Mail> = {
  mail: Mail, phone: Phone, map: MapPin, linkedin: Linkedin,
  github: Github, globe: Globe, link: Link2,
};

export function ContactIcon({ icon }: { icon: IconKey }) {
  const Cmp = ICONS[icon] ?? Link2;
  return <Cmp style={{ width: "1em", height: "1em", flex: "none", opacity: 0.7 }} aria-hidden="true" />;
}

function headingView(block: Extract<FlowBlock, { kind: "heading" }>, ctx: DocContext): ReactNode {
  const { template, accent } = ctx;
  const style = template.headingStyle;
  const align = template.headingAlign ?? "left";
  const base: CSSProperties = {
    fontFamily: "var(--vr-heading-font)",
    fontSize: style === "banner" || style === "boxed" ? ".98em" : "1em",
    fontWeight: 700,
    letterSpacing: template.uppercaseHeadings ? ".11em" : ".01em",
    textTransform: template.uppercaseHeadings ? "uppercase" : undefined,
    color: accent,
    display: "flex",
    alignItems: "center",
    justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start",
    gap: 8,
    lineHeight: 1.3,
  };
  const label = <>{String(block.index).padStart(2, "0")}<span style={{ opacity: 0.5, margin: "0 6px" }}>/</span>{block.text}</>;

  switch (style) {
    case "rule":
      return <h3 style={{ ...base, borderBottom: `1px solid var(--vr-line)` }} className="vr-heading"><span>{block.text}</span><span style={{ flex: 1 }} /></h3>;
    case "double-rule":
      return <h3 style={{ ...base, borderBottom: `3px double ${accent}`, paddingBottom: 3 }} className="vr-heading"><span>{block.text}</span><span style={{ flex: 1 }} /></h3>;
    case "underline":
      return <h3 style={base} className="vr-heading"><span style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 2 }}>{block.text}</span></h3>;
    case "caps":
      return <h3 style={{ ...base, color: "var(--vr-ink)" }} className="vr-heading"><span>{block.text}</span></h3>;
    case "boxed":
      return <h3 style={base} className="vr-heading"><span style={{ border: `1px solid ${accent}`, padding: "3px 9px", borderRadius: 3 }}>{block.text}</span></h3>;
    case "pill":
      return <h3 style={base} className="vr-heading"><span style={{ background: ctx.soft, color: accent, padding: "3px 12px", borderRadius: 99 }}>{block.text}</span></h3>;
    case "numbered":
      return <h3 style={{ ...base, color: "var(--vr-ink)" }} className="vr-heading"><span style={{ color: accent }}>{String(block.index).padStart(2, "0")}</span><span style={{ height: 1, flex: 1, background: "var(--vr-line)" }} /><span>{block.text}</span></h3>;
    case "left-rule":
      return <h3 style={{ ...base, borderLeft: `3px solid ${accent}`, paddingLeft: 9, borderRadius: 1 }} className="vr-heading"><span>{block.text}</span></h3>;
    case "plain":
      return <h3 style={{ ...base, color: "var(--vr-ink)" }} className="vr-heading"><span>{block.text}</span></h3>;
    case "dot":
      return <h3 style={{ ...base, color: "var(--vr-ink)" }} className="vr-heading"><span style={{ width: 7, height: 7, borderRadius: 99, background: accent, display: "inline-block" }} /><span>{block.text}</span></h3>;
    case "banner":
      return <h3 style={{ ...base, background: accent, color: "#fff", padding: "4px 9px", borderRadius: 2 }} className="vr-heading"><span>{block.text}</span></h3>;
    case "bracket":
      return <h3 style={{ ...base, color: "var(--vr-ink)" }} className="vr-heading"><span style={{ color: accent }}>[</span><span style={{ margin: "0 5px" }}>{block.text}</span><span style={{ color: accent }}>]</span></h3>;
    case "dotted":
      return <h3 style={{ ...base, borderBottom: `1px dotted var(--vr-line)` }} className="vr-heading"><span>{block.text}</span><span style={{ flex: 1 }} /></h3>;
    default:
      return <h3 style={base} className="vr-heading"><span>{label}</span></h3>;
  }
}

function itemView(block: Extract<FlowBlock, { kind: "item" }>, ctx: DocContext): ReactNode {
  const { template, accent } = ctx;
  const itemStyle = template.itemStyle ?? "standard";
  const titleColor = template.headerStyle === "two-tone" ? accent : "var(--vr-ink)";
  const inner = (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
        <span className="vr-item-title" style={{ color: titleColor }}>{block.title}</span>
        {block.date && <span className="vr-item-meta" style={{ whiteSpace: "nowrap", flex: "none" }}>{block.date}</span>}
      </div>
      {(block.subtitle || block.meta) && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
          <span className="vr-item-sub" style={{ color: accent, fontSize: ".95em" }}>{block.subtitle}</span>
          {block.meta && <span className="vr-item-meta">{block.meta}</span>}
        </div>
      )}
    </>
  );
  if (itemStyle === "card") {
    return <div style={{ background: "var(--vr-soft)", borderLeft: `3px solid ${accent}`, borderRadius: 3, padding: "6px 9px" }}>{inner}</div>;
  }
  if (itemStyle === "timeline") {
    return (
      <div style={{ position: "relative", paddingLeft: 16, borderLeft: `1.5px solid var(--vr-line)` }}>
        <span style={{ position: "absolute", left: -4.5, top: 5, width: 7, height: 7, borderRadius: 99, background: accent }} />
        {inner}
      </div>
    );
  }
  if (itemStyle === "table") {
    return <div style={{ borderBottom: "1px solid var(--vr-line)", paddingBottom: 4 }}>{inner}</div>;
  }
  if (itemStyle === "inline") {
    return <div>{block.title}{block.subtitle && <span style={{ fontWeight: 400 }}> — {block.subtitle}</span>}{block.date && <span className="vr-item-meta"> · {block.date}</span>}</div>;
  }
  return <div>{inner}</div>;
}

function singleBlockView(block: FlowBlock, ctx: DocContext, bulletOverride?: string): ReactNode {
  const { accent, template } = ctx;
  switch (block.kind) {
    case "heading": return headingView(block, ctx);
    case "item": return itemView(block, ctx);
    case "paragraph":
      return (
        <p style={{
          color: block.tone === "muted" ? "var(--vr-muted)" : block.tone === "small" ? accent : "var(--vr-ink)",
          fontSize: block.tone === "small" ? ".88em" : undefined,
          fontWeight: block.tone === "small" ? 600 : 400,
          lineHeight: "var(--vr-lh)",
        }}>{block.text}</p>
      );
    case "bullets": {
      const items = bulletOverride !== undefined ? [bulletOverride] : block.items;
      const useDot = template.bulletStyle === "dot" || template.bulletStyle === "square" || template.bulletStyle === "dash";
      const cls = `vr-bullet ${template.bulletStyle === "square" ? "vr-bullet-square" : template.bulletStyle === "dash" ? "vr-bullet-dash" : ""}`;
      return (
        <ul>
          {items.map((b, i) => (
            <li key={i} className={useDot ? cls : undefined}
              style={{ lineHeight: "var(--vr-lh)" }}>
              {template.bulletStyle === "arrow" && <span style={{ color: accent, marginRight: 6 }}>→</span>}
              {b}
            </li>
          ))}
        </ul>
      );
    }
    case "tags":
      return (
        <div style={{ lineHeight: 1.5 }}>
          {block.label && <span style={{ fontWeight: 700, color: "var(--vr-ink)", marginRight: 7 }}>{block.label}:</span>}
          {block.items.map((t, i) => <span key={i} className="vr-tag" style={{ background: "var(--vr-soft)", color: "var(--vr-ink)" }}>{t}</span>)}
        </div>
      );
    case "skillRow":
      return (
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".93em" }}>
            <span>{block.label}</span><span style={{ color: accent }}>{block.level}%</span>
          </div>
          <div className="vr-skillbar"><i style={{ width: `${block.level ?? 70}%` }} /></div>
        </div>
      );
    case "rule": return <hr className="vr-rule" />;
    case "spacer": return <div style={{ height: block.size }} />;
    default: return null;
  }
}

/** Expand IR blocks into measured DOM blocks. Bullet lists are split so a long
 *  list can flow across pages without stranding a heading. */
export function buildRenderBlocks(blocks: FlowBlock[], ctx: DocContext): RenderBlock[] {
  const out: RenderBlock[] = [];
  for (const block of blocks) {
    const common = {
      column: block.column,
      sectionId: block.sectionId,
    };
    const wrapper = (node: ReactNode, key: string, keepWithNext?: boolean, gapAfter?: number, gapBefore?: number) => ({
      id: key,
      ...common,
      keepWithNext,
      node: (
        <div
          key={key}
          data-flow-block={key}
          className={`vr-block ${ctx.highlightSection && ctx.highlightSection === block.sectionId ? "vr-highlight" : ""}`}
          style={{
            marginTop: gapBefore ?? block.gapBefore ?? 0,
            marginBottom: gapAfter ?? block.gapAfter ?? 0,
            outline: ctx.highlightSection && ctx.highlightSection === block.sectionId ? `1px dashed ${ctx.accent}` : undefined,
            outlineOffset: 2,
            borderRadius: 2,
          }}
        >{node}</div>
      ),
    });
    if (block.kind === "bullets" && block.items.length > 1) {
      block.items.forEach((bullet, i) => {
        const isLast = i === block.items.length - 1;
        out.push(wrapper(
          singleBlockView(block, ctx, bullet),
          `${block.id}-b${i}`,
          i === 0 && block.items.length > 2 ? true : undefined,
          isLast ? (block.gapAfter ?? 0) : 1,
          i === 0 ? (block.gapBefore ?? 0) : 0,
        ));
      });
    } else {
      out.push(wrapper(singleBlockView(block, ctx), block.id, block.keepWithNext));
    }
  }
  return out;
}
