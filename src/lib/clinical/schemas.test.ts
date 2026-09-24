import { describe, expect, it } from "vitest";
import { updateExamDraftSchema } from "@/lib/clinical/schemas";

describe("updateExamDraftSchema", () => {
  it("normalizes transverse + cephalic into cormic", () => {
    const parsed = updateExamDraftSchema.parse({
      examId: "exam-1",
      lie: "TRANSVERSE",
      presentation: "CEPHALIC",
      spineSide: "RIGHT",
      cephalicPoleSide: "LEFT",
      bodyMovementsPresent: false,
      swallowingPresent: "on",
    });
    expect(parsed.presentation).toBe("CORMIC");
    expect(parsed.spineSide).toBeNull();
    expect(parsed.bodyMovementsPresent).toBeNull();
    expect(parsed.swallowingPresent).toBe(true);
  });

  it("clears amniotic value when method is empty", () => {
    const parsed = updateExamDraftSchema.parse({
      examId: "exam-1",
      amnioticMethod: "",
      amnioticValue: "5.5",
      bodyMovementsPresent: false,
      swallowingPresent: false,
      uterineArteryRightNotch: false,
      uterineArteryLeftNotch: false,
    });
    expect(parsed.amnioticMethod).toBeNull();
    expect(parsed.amnioticValue).toBeNull();
  });
});
