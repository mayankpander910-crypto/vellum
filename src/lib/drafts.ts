import type { ResumeState } from "@/types/resume";
import { parseImportedResume } from "./resume-validation";

const DRAFTS_KEY = "vellum-drafts";
const AUTOSAVE_KEY = "vellum-autosave";
const MAIN_DRAFT_KEY = "vellum-draft";

export interface SavedDraft { id: string; name: string; updatedAt: number; state: ResumeState }

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function getDrafts(): SavedDraft[] {
  if (typeof window === "undefined") return [];
  return safeParse<SavedDraft[]>(localStorage.getItem(DRAFTS_KEY), []);
}

export function saveDraft(name: string, state: ResumeState): SavedDraft {
  const draft: SavedDraft = { id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, name, updatedAt: Date.now(), state };
  const drafts = [draft, ...getDrafts().filter((d) => d.name !== name)].slice(0, 20);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return draft;
}

export function deleteDraft(id: string): void {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(getDrafts().filter((d) => d.id !== id)));
}

export function clearAllDrafts(): void {
  localStorage.removeItem(DRAFTS_KEY);
  localStorage.removeItem(MAIN_DRAFT_KEY);
}

export function isAutosaveEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTOSAVE_KEY) === "on";
}

export function setAutosaveEnabled(on: boolean): void {
  localStorage.setItem(AUTOSAVE_KEY, on ? "on" : "off");
  if (!on) localStorage.removeItem(MAIN_DRAFT_KEY);
}

export function writeMainDraft(state: ResumeState): void {
  if (!isAutosaveEnabled()) return;
  localStorage.setItem(MAIN_DRAFT_KEY, JSON.stringify(state));
}

export function readMainDraft(): ResumeState | null {
  if (typeof window === "undefined" || !isAutosaveEnabled()) return null;
  const raw = localStorage.getItem(MAIN_DRAFT_KEY);
  if (!raw) return null;
  const parsed = parseImportedResume(raw);
  return parsed.ok ? parsed.state : null;
}
