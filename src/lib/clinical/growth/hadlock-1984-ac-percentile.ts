import { normalCdf } from "@/lib/clinical/growth/normal-cdf";
import { BIOMETRY_GROWTH_HADLOCK_V1 } from "@/lib/clinical/growth/reference-set";

const reference = BIOMETRY_GROWTH_HADLOCK_V1.acPercentile;
const SD_CM = 1.34;

export type AcPercentileResult = {
  referenceId: typeof reference.referenceId;
  version: typeof reference.version;
  percentile: number | null;
  display: string;
  status:
    | "OK"
    | "OUTSIDE_REFERENCE_RANGE"
    | "UNAVAILABLE_GA"
    | "UNAVAILABLE_MEASUREMENT"
    | "UNAVAILABLE_MISSING_EXAM_DATE"
    | "INCONSISTENT_EXAM_DATE";
};

function unavailable(
  status: Exclude<AcPercentileResult["status"], "OK">,
  display: string,
): AcPercentileResult {
  return {
    referenceId: reference.referenceId,
    version: reference.version,
    percentile: null,
    display,
    status,
  };
}

export function formatAcPercentile(percentile: number): string {
  const rounded = Math.round(percentile * 10) / 10;
  if (rounded <= 0) {
    return "<P0,1";
  }
  if (rounded >= 100) {
    return ">P99,9";
  }
  return `P${rounded.toFixed(1).replace(".", ",")}`;
}

/**
 * Hadlock 1984. CA em mm na interface, cm na equação.
 * mean = -13.3 + 1.61*ga - 0.00998*ga^2, SD = 1.34 cm.
 * gaDecimal = weeks + days/7. Faixa inclusiva 12w0d–40w0d. Sem extrapolação.
 */
export function acPercentile(input: {
  abdominalCircumferenceMm: number | null;
  weeks: number | null;
  days: number | null;
}): AcPercentileResult {
  if (input.weeks == null || input.days == null) {
    return unavailable("UNAVAILABLE_GA", "Indisponível");
  }
  if (
    !Number.isInteger(input.weeks) ||
    !Number.isInteger(input.days) ||
    input.days < 0 ||
    input.days > 6
  ) {
    return unavailable("OUTSIDE_REFERENCE_RANGE", "Fora da faixa");
  }
  if (
    input.abdominalCircumferenceMm == null ||
    !Number.isFinite(input.abdominalCircumferenceMm)
  ) {
    return unavailable("UNAVAILABLE_MEASUREMENT", "Indisponível");
  }

  const gaDecimal = input.weeks + input.days / 7;
  if (gaDecimal < 12 || gaDecimal > 40) {
    return unavailable("OUTSIDE_REFERENCE_RANGE", "Fora da faixa");
  }

  const acCm = input.abdominalCircumferenceMm / 10;
  const meanAcCm = -13.3 + 1.61 * gaDecimal - 0.00998 * gaDecimal ** 2;
  const z = (acCm - meanAcCm) / SD_CM;
  const percentile = normalCdf(z) * 100;

  return {
    referenceId: reference.referenceId,
    version: reference.version,
    percentile,
    display: formatAcPercentile(percentile),
    status: "OK",
  };
}
