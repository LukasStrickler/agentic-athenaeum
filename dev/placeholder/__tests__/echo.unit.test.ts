import { describe, it, expect } from "vitest";
import { normalizeInputText } from "@agentic-athenaeum/contracts";

/**
 * Placeholder skill unit tests: assert behavior the echo script relies on.
 */
describe("placeholder echo (unit)", () => {
  it("normalized input is used in output format", () => {
    const input = "  demo  ";
    const normalized = normalizeInputText(input);
    expect(normalized).toBe("demo");
    expect(`Input: ${normalized}`).toBe("Input: demo");
  });

  it("empty input yields default message", () => {
    const normalized = normalizeInputText("");
    expect(normalized).toBe("No source content provided.");
  });
});
