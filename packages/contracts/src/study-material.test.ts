import { describe, it, expect } from "vitest";
import { normalizeInputText, toMarkdownHeader } from "./study-material";

describe("normalizeInputText", () => {
  it("returns trimmed non-empty string as-is", () => {
    expect(normalizeInputText("  hello  ")).toBe("hello");
    expect(normalizeInputText("content")).toBe("content");
  });

  it("returns default message for empty or whitespace-only input", () => {
    expect(normalizeInputText("")).toBe("No source content provided.");
    expect(normalizeInputText("   ")).toBe("No source content provided.");
    expect(normalizeInputText("\t\n")).toBe("No source content provided.");
  });
});

describe("toMarkdownHeader", () => {
  it("prefixes title with # ", () => {
    expect(toMarkdownHeader("Title")).toBe("# Title");
    expect(toMarkdownHeader("Chapter 1")).toBe("# Chapter 1");
  });
});
