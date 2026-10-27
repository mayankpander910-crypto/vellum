import type { CSSProperties } from "react";
import type { ResumeState } from "@/types/resume";
import type { TemplateDefinition } from "@/types/template";
import { FONT_STACKS } from "@/types/resume";

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return [76, 71, 232];
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function mix(hex: string, target: [number, number, number], amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r + (target[0] - r) * amount)}, ${Math.round(g + (target[1] - g) * amount)}, ${Math.round(b + (target[2] - b) * amount)})`;
}

export interface DocContext {
  state: ResumeState;
  template: TemplateDefinition;
  accent: string;
  soft: string;
  dark: boolean;
  highlightSection?: string | null;
}

export function docContext(state: ResumeState, template: TemplateDefinition, highlightSection?: string | null): DocContext {
  const accent = template.capabilities.accentColor ? state.customize.accentColor : template.palette.accent;
  return {
    state, template, accent,
    soft: mix(accent, [255, 255, 255], 0.9),
    dark: Boolean(template.sidebarDark),
    highlightSection,
  };
}

export function docStyle(ctx: DocContext): CSSProperties {
  const { state, template, accent, soft } = ctx;
  const c = state.customize;
  return {
    "--vr-accent": accent,
    "--vr-ink": template.palette.ink,
    "--vr-muted": template.palette.muted,
    "--vr-line": template.palette.line,
    "--vr-surface": template.palette.surface,
    "--vr-soft": template.layout.includes("sidebar") ? soft : template.palette.soft,
    "--vr-font": FONT_STACKS[c.fontFamily].css,
    "--vr-heading-font": FONT_STACKS[template.headingFont ?? c.fontFamily].css,
    "--vr-fs": `${c.fontSize}pt`,
    "--vr-lh": c.lineSpacing,
    "--vr-gap": `${c.sectionSpacing}px`,
    "--vr-margin": `${c.margins}px`,
    "--vr-density": template.density === "compact" ? 0.8 : template.density === "relaxed" ? 1.15 : 1,
  } as CSSProperties;
}
