import { describe, expect, it } from "vitest";
import {
  cerebroplacentalRatio,
  meanUterineArteryPi,
} from "@/lib/clinical/arithmetic";

describe("meanUterineArteryPi", () => {
  it("averages both sides", () => {
    expect(meanUterineArteryPi(1.0, 1.4)).toBeCloseTo(1.2);
  });

  it("returns null when either side is missing", () => {
    expect(meanUterineArteryPi(1.0, null)).toBeNull();
    expect(meanUterineArteryPi(undefined, 1.4)).toBeNull();
  });

  it("handles decimals", () => {
    expect(meanUterineArteryPi(0.85, 1.15)).toBeCloseTo(1.0);
  });
});

describe("cerebroplacentalRatio", () => {
  it("divides MCA by umbilical", () => {
    expect(cerebroplacentalRatio(1.5, 1.0)).toBeCloseTo(1.5);
  });

  it("returns null on missing inputs or zero umbilical", () => {
    expect(cerebroplacentalRatio(null, 1)).toBeNull();
    expect(cerebroplacentalRatio(1.2, 0)).toBeNull();
  });
});
