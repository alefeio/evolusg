import { describe, expect, it } from "vitest";
import { ductusBlockIncluded } from "@/lib/clinical/ductus-assessment";

describe("ductusBlockIncluded", () => {
  it("does not infer assessment when nothing was stored", () => {
    expect(ductusBlockIncluded(null, null)).toBe(false);
    expect(ductusBlockIncluded(undefined, null)).toBe(false);
  });

  it("keeps a legacy value visible", () => {
    expect(ductusBlockIncluded(null, 0.42)).toBe(true);
  });

  it("follows an explicit inclusion even without a value", () => {
    expect(ductusBlockIncluded(true, null)).toBe(true);
  });

  it("hides the block when explicitly excluded and keeps the decision separate from the IP", () => {
    expect(ductusBlockIncluded(false, 0.42)).toBe(false);
  });
});
