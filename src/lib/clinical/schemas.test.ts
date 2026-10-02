import { describe, expect, it } from "vitest";
import { DUCTUS_PI_REQUIRED_MESSAGE } from "@/lib/clinical/ductus-assessment";
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

  it("allows empty, single and combined transducers without a phrase", () => {
    const empty = updateExamDraftSchema.parse({
      examId: "exam-1",
      transducersUsed: [],
      bodyMovementsPresent: false,
      swallowingPresent: false,
      uterineArteryRightNotch: false,
      uterineArteryLeftNotch: false,
    });
    expect(empty.transducersUsed).toEqual([]);

    const both = updateExamDraftSchema.parse({
      examId: "exam-1",
      transducersUsed: ["ENDOCAVITARY", "CONVEX_MULTIFREQUENCY", "ENDOCAVITARY"],
      lie: "LONGITUDINAL",
      spineSide: "VARIABLE",
      placentaGrade: "GRADE_0",
      bodyMovementsPresent: false,
      swallowingPresent: false,
      uterineArteryRightNotch: false,
      uterineArteryLeftNotch: false,
    });
    expect(both.transducersUsed).toEqual([
      "ENDOCAVITARY",
      "CONVEX_MULTIFREQUENCY",
    ]);
    expect(both.spineSide).toBe("VARIABLE");
    expect(both.placentaGrade).toBe("GRADE_0");
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

  it("rejects a selected ductus venosus without an IP", () => {
    const rejected = updateExamDraftSchema.safeParse({
      examId: "exam-1",
      ductusVenosusAssessed: true,
      ductusVenosusPi: "",
      bodyMovementsPresent: false,
      swallowingPresent: false,
      uterineArteryRightNotch: false,
      uterineArteryLeftNotch: false,
    });
    expect(rejected.success).toBe(false);
    if (!rejected.success) {
      expect(rejected.error.issues[0]?.message).toBe(DUCTUS_PI_REQUIRED_MESSAGE);
    }

    const accepted = updateExamDraftSchema.parse({
      examId: "exam-1",
      ductusVenosusAssessed: false,
      ductusVenosusPi: "",
      bodyMovementsPresent: false,
      swallowingPresent: false,
      uterineArteryRightNotch: false,
      uterineArteryLeftNotch: false,
    });
    expect(accepted.ductusVenosusAssessed).toBe(false);
    expect(accepted.ductusVenosusPi).toBeNull();
  });
});
