import { describe, expect, it } from "vitest";
import { isValidEmailShape, normalizeEmail } from "@/lib/email-normalize";

describe("normalizeEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeEmail("  Dra.Karen@Example.COM ")).toBe("dra.karen@example.com");
  });

  it("rejects invalid shapes", () => {
    expect(isValidEmailShape("not-an-email")).toBe(false);
    expect(isValidEmailShape("ok@site.com")).toBe(true);
  });
});
