import { describe, it, expect } from "vitest";
import { normalizeInputText } from "@agentic-athenaeum/contracts";

describe("placeholder-two echo (unit)", () => {
  it("normalized input fits output format", () => {
    expect(normalizeInputText("  skill-two  ")).toBe("skill-two");
  });
});
