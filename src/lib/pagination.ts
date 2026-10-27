/**
 * Pure, framework-agnostic pagination used by the on-screen preview and the
 * PDF text-flow engine. Kept separate so it can be unit-tested.
 */
export interface MeasuredBlock<T = string> {
  id: T;
  height: number;
  /** Keep this block on the same page as the following block (e.g. headings). */
  keepWithNext?: boolean;
}

export function paginateBlocks<T>(
  blocks: MeasuredBlock<T>[],
  pageHeight: number | ((pageIndex: number) => number),
): T[][] {
  const heightAt = (pageIndex: number) => Math.max(1, typeof pageHeight === "function" ? pageHeight(pageIndex) : pageHeight);
  const pages: T[][] = [];
  let current: T[] = [];
  let used = 0;
  let i = 0;

  while (i < blocks.length) {
    // Build a group: a run of keepWithNext blocks + the first non-keep block.
    const group: MeasuredBlock<T>[] = [];
    let j = i;
    while (j < blocks.length) {
      const block = blocks[j]!;
      group.push(block);
      if (!block.keepWithNext) { j += 1; break; }
      j += 1;
    }
    const groupHeight = group.reduce((sum, b) => sum + Math.max(0, b.height), 0);

    if (current.length > 0 && used + groupHeight > heightAt(pages.length)) {
      pages.push(current);
      current = [];
      used = 0;
    }
    // A group taller than a whole page starts on a fresh page and is allowed
    // to overflow — the renderer splits oversized items into smaller blocks.
    for (const block of group) current.push(block.id);
    used += groupHeight;
    i = j;
  }
  if (current.length > 0) pages.push(current);
  if (pages.length === 0) pages.push([]);
  return pages;
}

/** Split a long text line into wrapped lines given an approximate char width. */
export function wrapText(text: string, maxChars: number, measure?: (s: string) => number): string[] {
  const words = (text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length === 0) return [""];
  const width = measure ?? ((s: string) => s.length);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (width(candidate) <= maxChars || !line) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
