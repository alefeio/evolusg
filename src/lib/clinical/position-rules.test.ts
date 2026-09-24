import { describe, expect, it } from "vitest";
import {
  isPositionConsistent,
  normalizePosition,
  showCephalicPoleField,
  showSpineField,
} from "@/lib/clinical/position-rules";

describe("normalizePosition", () => {
  it("forces cormic presentation when lie is transverse", () => {
    const result = normalizePosition({
      lie: "TRANSVERSE",
      presentation: "CEPHALIC",
      spineSide: "RIGHT",
      cephalicPoleSide: "LEFT",
    });
    expect(result.presentation).toBe("CORMIC");
    expect(result.spineSide).toBeNull();
    expect(result.cephalicPoleSide).toBe("LEFT");
  });

  it("forces transverse lie when presentation is cormic", () => {
    const result = normalizePosition({
      lie: "LONGITUDINAL",
      presentation: "CORMIC",
      spineSide: "RIGHT",
      cephalicPoleSide: null,
    });
    expect(result.lie).toBe("TRANSVERSE");
    expect(result.spineSide).toBeNull();
  });

  it("hides cephalic pole on longitudinal", () => {
    const result = normalizePosition({
      lie: "LONGITUDINAL",
      presentation: "CEPHALIC",
      spineSide: "LEFT",
      cephalicPoleSide: "RIGHT",
    });
    expect(result.cephalicPoleSide).toBeNull();
    expect(result.spineSide).toBe("LEFT");
  });

  it("marks consistent states", () => {
    expect(
      isPositionConsistent({
        lie: "TRANSVERSE",
        presentation: "CORMIC",
        spineSide: null,
        cephalicPoleSide: "RIGHT",
      }),
    ).toBe(true);
  });

  it("exposes the right laterality fields", () => {
    expect(showSpineField("LONGITUDINAL")).toBe(true);
    expect(showCephalicPoleField("LONGITUDINAL")).toBe(false);
    expect(showSpineField("TRANSVERSE")).toBe(false);
    expect(showCephalicPoleField("TRANSVERSE")).toBe(true);
  });
});
