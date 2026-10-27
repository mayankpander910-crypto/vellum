"use client";

import React, { type CSSProperties, type ReactNode } from "react";
import type { HeaderIR } from "@/lib/resume-ir";
import type { DocContext } from "./doc-style";
import { ContactIcon } from "./flow-block";

interface Props {
  header: HeaderIR;
  ctx: DocContext;
  margins: number;
  fullBleed?: boolean;
}

export function ResumeHeader({ header, ctx, margins, fullBleed = true }: Props): ReactNode {
  const { template, accent } = ctx;
  const style = template.headerStyle;
  const isBand = style === "band";
  const centered = style === "centered";
  const split = style === "split" || style === "photo";
  const dark = isBand;

  const contactNodes = header.contacts.map((item, i) => (
    <span key={item.key} style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
      {ctx.state.customize.showIcons && <ContactIcon icon={item.icon} />}
      <span>{item.value}</span>
      {!split && i < header.contacts.length - 1 && <span className="vr-sep" style={{ marginLeft: 3 }}>·</span>}
    </span>
  ));

  const photo = header.showPhoto ? (
    header.photo
      ? <img src={header.photo} alt="" className="vr-photo" style={{ width: 68, height: 68, border: `3px solid ${dark ? "#fff" : accent}` }} />
      : <div className="vr-initials" style={{ width: 68, height: 68, fontSize: "1.6em", background: dark ? "rgba(255,255,255,.2)" : accent }}>{header.initials}</div>
  ) : null;

  const nameStyle: CSSProperties = {
    fontFamily: "var(--vr-heading-font)",
    textTransform: template.uppercaseName ? "uppercase" : undefined,
    letterSpacing: template.uppercaseName ? ".02em" : "-.025em",
    color: dark ? "#fff" : style === "two-tone" ? accent : "var(--vr-ink)",
    margin: 0,
  };
  const roleStyle: CSSProperties = {
    color: dark ? "rgba(255,255,255,.9)" : accent,
    fontWeight: 600,
    letterSpacing: ".02em",
    marginTop: 3,
  };

  const outer: CSSProperties = {
    padding: `${style === "boxed" ? 14 : 0}px 0 ${style === "centered" || style === "rule" || style === "grid" ? 12 : 8}px`,
    textAlign: centered ? "center" : "left",
    borderBottom: style === "rule" ? `2px solid ${accent}` : centered ? "1px solid var(--vr-line)" : style === "grid" ? `1px solid ${accent}` : undefined,
  };

  let content: ReactNode;
  if (style === "grid") {
    content = (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <h1 className="vr-name" style={nameStyle}>{header.name}</h1>
          <span className="vr-role" style={{ ...roleStyle, marginTop: 0 }}>{header.headline}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 18px", marginTop: 8, fontSize: ".82em", color: "var(--vr-muted)" }}>
          {header.contacts.map((c) => (
            <span key={c.key}><span style={{ textTransform: "uppercase", letterSpacing: ".08em", opacity: .65, marginRight: 5 }}>{c.label}</span>{c.value}</span>
          ))}
        </div>
      </>
    );
  } else if (style === "initials") {
    content = (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="vr-initials" style={{ width: 62, height: 62, fontSize: "1.5em", background: accent }}>{header.initials}</div>
        <div style={{ minWidth: 0 }}>
          <h1 className="vr-name" style={{ ...nameStyle, fontSize: "2.1em" }}>{header.name}</h1>
          <div className="vr-role" style={roleStyle}>{header.headline}</div>
          <div className="vr-contact" style={{ gap: "2px 10px", marginTop: 5 }}>{contactNodes}</div>
        </div>
      </div>
    );
  } else if (split) {
    content = (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          {style === "photo" && <div style={{ fontSize: ".7em", textTransform: "uppercase", letterSpacing: ".22em", color: dark ? "rgba(255,255,255,.8)" : accent, marginBottom: 4 }}>Curriculum Vitae</div>}
          <h1 className="vr-name" style={nameStyle}>{header.name}</h1>
          <div className="vr-role" style={roleStyle}>{header.headline}</div>
          <div className="vr-contact" style={{ gap: "2px 10px", marginTop: 7, color: dark ? "rgba(255,255,255,.9)" : "var(--vr-muted)" }}>{contactNodes}</div>
        </div>
        {(photo || style === "photo") && <div style={{ flex: "none" }}>{photo ?? <div className="vr-initials" style={{ width: 68, height: 68, fontSize: "1.6em", background: accent }}>{header.initials}</div>}</div>}
      </div>
    );
  } else {
    content = (
      <>
        {style === "overline" && <div style={{ fontSize: ".7em", textTransform: "uppercase", letterSpacing: ".3em", color: accent, marginBottom: 6 }}>Resume</div>}
        {style === "monogram" && <div style={{ fontSize: "2.4em", fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 2 }}>{header.initials}.</div>}
        <div style={{ display: centered ? "flex" : undefined, flexDirection: "column", alignItems: centered ? "center" : undefined }}>
          {centered && header.showPhoto && <div style={{ marginBottom: 8 }}>{photo}</div>}
          <h1 className="vr-name" style={nameStyle}>{header.name}</h1>
          {header.headline && <div className="vr-role" style={roleStyle}>{header.headline}</div>}
        </div>
        <div className="vr-contact" style={{
          gap: "2px 4px", marginTop: 9,
          justifyContent: centered ? "center" : "flex-start",
          color: dark ? "rgba(255,255,255,.92)" : "var(--vr-muted)",
        }}>{contactNodes}</div>
      </>
    );
  }

  const bandStyle: CSSProperties = isBand && fullBleed ? {
    background: accent,
    color: "#fff",
    marginLeft: -margins,
    marginRight: -margins,
    marginTop: -margins,
    padding: `${margins * 0.65}px ${margins}px ${margins * 0.55}px`,
    marginBottom: margins,
  } : isBand ? { background: accent, color: "#fff", padding: 16, borderRadius: 4 } : {};

  const boxedStyle: CSSProperties = style === "boxed" ? {
    border: `2px solid ${accent}`, borderRadius: 4, padding: "12px 16px",
    background: ctx.soft,
  } : {};

  return (
    <header className="vr-header" style={{ ...outer, ...bandStyle, ...boxedStyle }}>
      {content}
    </header>
  );
}
