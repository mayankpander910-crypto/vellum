import { describe, expect, it } from "vitest";
import { paginateBlocks, wrapText, clamp, type MeasuredBlock } from "@/lib/pagination";

const b = (id: string, height: number, keepWithNext = false): MeasuredBlock<string> => ({ id, height, keepWithNext });

describe("pagination engine", () => {
  it("places blocks on a single page when they fit", () => {
    expect(paginateBlocks([b("a", 100), b("b", 200)], 500)).toEqual([["a", "b"]]);
  });

  it("starts a new page when a block would overflow", () => {
    expect(paginateBlocks([b("a", 300), b("b", 300)], 500)).toEqual([["a"], ["b"]]);
  });

  it("preserves order across three pages", () => {
    const result = paginateBlocks([b("a", 200), b("b", 200), b("c", 200), b("d", 200)], 500);
    expect(result.flat()).toEqual(["a", "b", "c", "d"]);
    expect(result).toHaveLength(2);
  });

  it("keeps a heading with the following block", () => {
    const blocks = [b("text", 300, false), b("heading", 100, true), b("first-item", 200, false), b("tail", 250, false)];
    const result = paginateBlocks(blocks, 500);
    expect(result[1]).toEqual(["heading", "first-item"]);
    expect(result[2]).toEqual(["tail"]);
  });

  it("allows a taller-than-page block to overflow instead of looping", () => {
    const result = paginateBlocks([b("a", 100), b("huge", 900), b("c", 100)], 500);
    expect(result.flat()).toEqual(["a", "huge", "c"]);
    expect(result[1]).toEqual(["huge"]);
  });

  it("supports a shorter first page (used for the header)", () => {
    const result = paginateBlocks([b("a", 150), b("b", 150), b("c", 400)], (i) => (i === 0 ? 300 : 500));
    expect(result[0]).toEqual(["a", "b"]);
    expect(result[1]).toEqual(["c"]);
  });

  it("always returns at least one page", () => {
    expect(paginateBlocks([], 500)).toEqual([[]]);
  });
});

describe("text helpers", () => {
  it("wraps text at word boundaries", () => {
    expect(wrapText("alpha beta gamma delta", 11)).toEqual(["alpha beta", "gamma delta"]);
  });

  it("never drops an overlong word", () => {
    expect(wrapText("supercalifragilistic", 5)).toEqual(["supercalifragilistic"]);
  });

  it("clamps values", () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
  });
});
