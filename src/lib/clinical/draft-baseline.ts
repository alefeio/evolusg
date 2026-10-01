export type DraftFieldSnapshot = {
  revision: string;
  comorbidities: string | null;
  continuousMedications: string | null;
  transducersUsed: string[];
  placentaLocation: string | null;
  placentaGrade: string | null;
  amnioticMethod: string | null;
  amnioticValue: number | null;
  uterineArteryRightPi: number | null;
  uterineArteryLeftPi: number | null;
  uterineArteryRightNotch: boolean | null;
  uterineArteryLeftNotch: boolean | null;
  lie: string | null;
  presentation: string | null;
  spineSide: string | null;
  cephalicPoleSide: string | null;
  heartRateBpm: number | null;
  bodyMovementsPresent: boolean | null;
  swallowingPresent: boolean | null;
  biparietalDiameterMm: number | null;
  headCircumferenceMm: number | null;
  abdominalCircumferenceMm: number | null;
  femurLengthMm: number | null;
  umbilicalArteryPi: number | null;
  middleCerebralArteryPi: number | null;
  ductusVenosusAssessed: boolean | null;
  ductusVenosusPi: number | null;
};

type ExamLike = {
  updatedAt: Date;
  comorbidities: string | null;
  continuousMedications: string | null;
  transducersUsed: string[];
  placentaLocation: string | null;
  placentaGrade: string | null;
  amnioticMethod: string | null;
  amnioticValue: number | null;
  uterineArteryRightPi: number | null;
  uterineArteryLeftPi: number | null;
  uterineArteryRightNotch: boolean | null;
  uterineArteryLeftNotch: boolean | null;
  fetuses: Array<{
    lie: string | null;
    presentation: string | null;
    spineSide: string | null;
    cephalicPoleSide: string | null;
    heartRateBpm: number | null;
    bodyMovementsPresent: boolean | null;
    swallowingPresent: boolean | null;
    biparietalDiameterMm: number | null;
    headCircumferenceMm: number | null;
    abdominalCircumferenceMm: number | null;
    femurLengthMm: number | null;
    umbilicalArteryPi: number | null;
    middleCerebralArteryPi: number | null;
    ductusVenosusAssessed: boolean | null;
    ductusVenosusPi: number | null;
  }>;
};

export function snapshotFromExam(exam: ExamLike): DraftFieldSnapshot {
  const fetus = exam.fetuses[0];
  return {
    revision: exam.updatedAt.toISOString(),
    comorbidities: exam.comorbidities,
    continuousMedications: exam.continuousMedications,
    transducersUsed: [...exam.transducersUsed],
    placentaLocation: exam.placentaLocation,
    placentaGrade: exam.placentaGrade,
    amnioticMethod: exam.amnioticMethod,
    amnioticValue: exam.amnioticValue,
    uterineArteryRightPi: exam.uterineArteryRightPi,
    uterineArteryLeftPi: exam.uterineArteryLeftPi,
    uterineArteryRightNotch: exam.uterineArteryRightNotch,
    uterineArteryLeftNotch: exam.uterineArteryLeftNotch,
    lie: fetus?.lie ?? null,
    presentation: fetus?.presentation ?? null,
    spineSide: fetus?.spineSide ?? null,
    cephalicPoleSide: fetus?.cephalicPoleSide ?? null,
    heartRateBpm: fetus?.heartRateBpm ?? null,
    bodyMovementsPresent: fetus?.bodyMovementsPresent ?? null,
    swallowingPresent: fetus?.swallowingPresent ?? null,
    biparietalDiameterMm: fetus?.biparietalDiameterMm ?? null,
    headCircumferenceMm: fetus?.headCircumferenceMm ?? null,
    abdominalCircumferenceMm: fetus?.abdominalCircumferenceMm ?? null,
    femurLengthMm: fetus?.femurLengthMm ?? null,
    umbilicalArteryPi: fetus?.umbilicalArteryPi ?? null,
    middleCerebralArteryPi: fetus?.middleCerebralArteryPi ?? null,
    ductusVenosusAssessed: fetus?.ductusVenosusAssessed ?? null,
    ductusVenosusPi: fetus?.ductusVenosusPi ?? null,
  };
}

export function applySavedSnapshot<T extends { fetus: Record<string, unknown> }>(
  loaded: T,
  saved: DraftFieldSnapshot | undefined,
): T & { revision: string } {
  if (!saved) {
    return { ...loaded, revision: "loaded" };
  }

  return {
    ...loaded,
    revision: saved.revision,
    comorbidities: saved.comorbidities,
    continuousMedications: saved.continuousMedications,
    transducersUsed: saved.transducersUsed,
    placentaLocation: saved.placentaLocation,
    placentaGrade: saved.placentaGrade,
    amnioticMethod: saved.amnioticMethod,
    amnioticValue: saved.amnioticValue,
    uterineArteryRightPi: saved.uterineArteryRightPi,
    uterineArteryLeftPi: saved.uterineArteryLeftPi,
    uterineArteryRightNotch: saved.uterineArteryRightNotch,
    uterineArteryLeftNotch: saved.uterineArteryLeftNotch,
    fetus: {
      ...loaded.fetus,
      lie: saved.lie,
      presentation: saved.presentation,
      spineSide: saved.spineSide,
      cephalicPoleSide: saved.cephalicPoleSide,
      heartRateBpm: saved.heartRateBpm,
      bodyMovementsPresent: saved.bodyMovementsPresent,
      swallowingPresent: saved.swallowingPresent,
      biparietalDiameterMm: saved.biparietalDiameterMm,
      headCircumferenceMm: saved.headCircumferenceMm,
      abdominalCircumferenceMm: saved.abdominalCircumferenceMm,
      femurLengthMm: saved.femurLengthMm,
      umbilicalArteryPi: saved.umbilicalArteryPi,
      middleCerebralArteryPi: saved.middleCerebralArteryPi,
      ductusVenosusAssessed: saved.ductusVenosusAssessed,
      ductusVenosusPi: saved.ductusVenosusPi,
    },
  };
}
