import { describe, expect, it } from "vitest";
import {
  applySavedSnapshot,
  snapshotFromExam,
  type DraftFieldSnapshot,
} from "@/lib/clinical/draft-baseline";

const loaded = {
  comorbidities: null,
  continuousMedications: null,
  transducersUsed: ["CONVEX_MULTIFREQUENCY"],
  placentaLocation: null,
  placentaGrade: "I",
  amnioticMethod: null,
  amnioticValue: null,
  uterineArteryRightPi: null,
  uterineArteryLeftPi: null,
  uterineArteryRightNotch: null,
  uterineArteryLeftNotch: null,
  fetus: {
    lie: "LONGITUDINAL",
    presentation: "CEPHALIC",
    spineSide: "RIGHT",
    cephalicPoleSide: null,
    heartRateBpm: 140,
    bodyMovementsPresent: null,
    swallowingPresent: null,
    biparietalDiameterMm: null,
    headCircumferenceMm: null,
    abdominalCircumferenceMm: null,
    femurLengthMm: null,
    umbilicalArteryPi: null,
    middleCerebralArteryPi: null,
    ductusVenosusPi: null,
  },
};

function saved(overrides: Partial<DraftFieldSnapshot>): DraftFieldSnapshot {
  return {
    revision: "saved-1",
    comorbidities: null,
    continuousMedications: null,
    transducersUsed: [],
    placentaLocation: null,
    placentaGrade: null,
    amnioticMethod: null,
    amnioticValue: null,
    uterineArteryRightPi: null,
    uterineArteryLeftPi: null,
    uterineArteryRightNotch: null,
    uterineArteryLeftNotch: null,
    lie: "LONGITUDINAL",
    presentation: "CEPHALIC",
    spineSide: null,
    cephalicPoleSide: null,
    heartRateBpm: null,
    bodyMovementsPresent: null,
    swallowingPresent: null,
    biparietalDiameterMm: null,
    headCircumferenceMm: null,
    abdominalCircumferenceMm: null,
    femurLengthMm: null,
    umbilicalArteryPi: null,
    middleCerebralArteryPi: null,
    ductusVenosusPi: null,
    ...overrides,
  };
}

describe("applySavedSnapshot", () => {
  it("keeps the loaded snapshot until a save returns", () => {
    expect(applySavedSnapshot(loaded, undefined).transducersUsed).toEqual([
      "CONVEX_MULTIFREQUENCY",
    ]);
  });

  it("replaces transducer selection with the persisted array, including empty", () => {
    const both = applySavedSnapshot(
      loaded,
      saved({
        transducersUsed: ["CONVEX_MULTIFREQUENCY", "ENDOCAVITARY"],
      }),
    );
    expect(both.transducersUsed).toEqual([
      "CONVEX_MULTIFREQUENCY",
      "ENDOCAVITARY",
    ]);

    const none = applySavedSnapshot(loaded, saved({ transducersUsed: [] }));
    expect(none.transducersUsed).toEqual([]);
  });

  it("replaces spine and placenta with the persisted values and keeps nulls", () => {
    const next = applySavedSnapshot(
      loaded,
      saved({
        spineSide: "VARIABLE",
        placentaGrade: "GRADE_0",
        bodyMovementsPresent: null,
        uterineArteryRightNotch: null,
      }),
    );
    expect(next.fetus.spineSide).toBe("VARIABLE");
    expect(next.placentaGrade).toBe("GRADE_0");
    expect(next.fetus.bodyMovementsPresent).toBeNull();
    expect(next.uterineArteryRightNotch).toBeNull();
  });
});

describe("snapshotFromExam", () => {
  it("copies the persisted fetus and transducer array", () => {
    const snapshot = snapshotFromExam({
      updatedAt: new Date("2026-09-30T12:00:00.000Z"),
      comorbidities: null,
      continuousMedications: null,
      transducersUsed: ["ENDOCAVITARY"],
      placentaLocation: "ANTERIOR",
      placentaGrade: "GRADE_0",
      amnioticMethod: null,
      amnioticValue: null,
      uterineArteryRightPi: 1.1,
      uterineArteryLeftPi: null,
      uterineArteryRightNotch: true,
      uterineArteryLeftNotch: null,
      fetuses: [
        {
          lie: "LONGITUDINAL",
          presentation: "CEPHALIC",
          spineSide: "VARIABLE",
          cephalicPoleSide: null,
          heartRateBpm: 150,
          bodyMovementsPresent: null,
          swallowingPresent: true,
          biparietalDiameterMm: 40,
          headCircumferenceMm: null,
          abdominalCircumferenceMm: null,
          femurLengthMm: null,
          umbilicalArteryPi: null,
          middleCerebralArteryPi: null,
          ductusVenosusPi: null,
        },
      ],
    });

    expect(snapshot.transducersUsed).toEqual(["ENDOCAVITARY"]);
    expect(snapshot.spineSide).toBe("VARIABLE");
    expect(snapshot.placentaGrade).toBe("GRADE_0");
    expect(snapshot.bodyMovementsPresent).toBeNull();
    expect(snapshot.heartRateBpm).toBe(150);
  });
});
