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

  return {
    referenceSetId: BIOMETRY_GROWTH_HADLOCK_V1.id,
    gestationalAge,
    efw,
    efwPercentile: efwPercentile({
      rawWeightGrams: efw.status === "OK" ? efw.rawWeightGrams : null,
      weeks,
      days,
    }),
    acPercentile: acPercentile({
      abdominalCircumferenceMm: input.abdominalCircumferenceMm,
      weeks,
      days,
    }),
  };
}

export function parseOptionalMeasurement(raw: string): number | null {
  if (raw.trim() === "") {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}
