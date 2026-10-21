import { acPercentile } from "@/lib/clinical/growth/hadlock-1984-ac-percentile";
import { estimatedFetalWeight } from "@/lib/clinical/growth/hadlock-1985-efw";
import { efwPercentile } from "@/lib/clinical/growth/hadlock-1991-efw-percentile";
import { correctedGestationalAge } from "@/lib/clinical/growth/corrected-gestational-age";
import { BIOMETRY_GROWTH_HADLOCK_V1 } from "@/lib/clinical/growth/reference-set";

export type BiometryGrowthInput = {
  biparietalDiameterMm: number | null;
  headCircumferenceMm: number | null;
  abdominalCircumferenceMm: number | null;
  femurLengthMm: number | null;
  datingUltrasoundDate: string | null;
  datingUltrasoundGaWeeks: number | null;
  datingUltrasoundGaDays: number | null;
  examDate: string | null;
};

export function deriveBiometryGrowth(input: BiometryGrowthInput) {
  const gestationalAge = correctedGestationalAge({
    datingUltrasoundDate: input.datingUltrasoundDate,
    datingUltrasoundGaWeeks: input.datingUltrasoundGaWeeks,
    datingUltrasoundGaDays: input.datingUltrasoundGaDays,
    examDate: input.examDate,
  });
  const efw = estimatedFetalWeight(input);
  const weeks = gestationalAge.status === "OK" ? gestationalAge.weeks : null;
  const days = gestationalAge.status === "OK" ? gestationalAge.days : null;
  const efwPercentileResult = efwPercentile({
    rawWeightGrams: efw.status === "OK" ? efw.rawWeightGrams : null,
    weeks,
    days,
  });
  const acPercentileResult = acPercentile({
    abdominalCircumferenceMm: input.abdominalCircumferenceMm,
    weeks,
    days,
  });

  if (gestationalAge.status === "UNAVAILABLE_MISSING_EXAM_DATE") {
    efwPercentileResult.status = "UNAVAILABLE_MISSING_EXAM_DATE";
    efwPercentileResult.percentile = null;
    efwPercentileResult.display = "—";
    efwPercentileResult.kind = "UNAVAILABLE";
    acPercentileResult.status = "UNAVAILABLE_MISSING_EXAM_DATE";
    acPercentileResult.percentile = null;
    acPercentileResult.display = "—";
  }

  if (gestationalAge.status === "INCONSISTENT_EXAM_DATE") {
    efwPercentileResult.status = "INCONSISTENT_EXAM_DATE";
    efwPercentileResult.percentile = null;
    efwPercentileResult.display = "—";
    efwPercentileResult.kind = "UNAVAILABLE";
    acPercentileResult.status = "INCONSISTENT_EXAM_DATE";
    acPercentileResult.percentile = null;
    acPercentileResult.display = "—";
  }

  return {
    referenceSetId: BIOMETRY_GROWTH_HADLOCK_V1.id,
    gestationalAge,
    efw,
    efwPercentile: efwPercentileResult,
    acPercentile: acPercentileResult,
  };
}

export function parseOptionalMeasurement(raw: string): number | null {
  if (raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
