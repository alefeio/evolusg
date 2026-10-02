import { describe, expect, it } from "vitest";
import {
  DUCTUS_PI_REQUIRED_MESSAGE,
  ductusBlockIncluded,
  ductusSaveError,
} from "@/lib/clinical/ductus-assessment";

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

describe("ductusSaveError", () => {
  it("allows exclusion and a selected value, and rejects a selected empty IP", () => {
    expect(ductusSaveError(false, null)).toBeNull();
    expect(ductusSaveError(true, 0.4)).toBeNull();
    expect(ductusSaveError(true, null)).toBe(DUCTUS_PI_REQUIRED_MESSAGE);
  });
});
