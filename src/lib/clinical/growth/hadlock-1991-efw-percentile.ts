import {
  HADLOCK_1991_CHART_V1,
  HADLOCK_1991_CHART_VERSION,
  type Hadlock1991Row,
} from "@/lib/clinical/growth/hadlock-1991-chart-v1";
import { normalCdf } from "@/lib/clinical/growth/normal-cdf";
import { BIOMETRY_GROWTH_HADLOCK_V1 } from "@/lib/clinical/growth/reference-set";

const reference = BIOMETRY_GROWTH_HADLOCK_V1.efwPercentile;

/** Z-scores canônicos. Não recalcular a partir do rótulo do percentil. */
export const HADLOCK_1991_ANCHOR_Z = {
  p3: -1.8807936081512509,
  p10: -1.2815515655446004,
  p50: 0,
  p90: 1.2815515655446004,
  p97: 1.8807936081512509,
} as const;

const EXACT_TOLERANCE_GRAMS = 1e-6;

const ANCHORS = [
  { percentile: 3, key: "p3", z: HADLOCK_1991_ANCHOR_Z.p3 },
  { percentile: 10, key: "p10", z: HADLOCK_1991_ANCHOR_Z.p10 },
  { percentile: 50, key: "p50", z: HADLOCK_1991_ANCHOR_Z.p50 },
  { percentile: 90, key: "p90", z: HADLOCK_1991_ANCHOR_Z.p90 },
  { percentile: 97, key: "p97", z: HADLOCK_1991_ANCHOR_Z.p97 },
] as const;

export type EfwPercentileResult = {
  referenceId: typeof reference.referenceId;
  version: typeof reference.version;
  chartVersion: typeof HADLOCK_1991_CHART_VERSION;
  percentile: number | null;
  display: string;
  status:
    | "OK"
    | "BELOW_P3"
    | "ABOVE_P97"
    | "OUTSIDE_REFERENCE_RANGE"
    | "UNAVAILABLE_GA"
    | "UNAVAILABLE_WEIGHT"
    | "UNAVAILABLE_MISSING_EXAM_DATE"
    | "INCONSISTENT_EXAM_DATE";
  kind: "EXACT_ANCHOR" | "Z_INTERPOLATED" | "BELOW_P3" | "ABOVE_P97" | "UNAVAILABLE";
};

function unavailable(
  status: "UNAVAILABLE_GA" | "UNAVAILABLE_WEIGHT" | "OUTSIDE_REFERENCE_RANGE",
  display: string,
): EfwPercentileResult {
  return {
    referenceId: reference.referenceId,
    version: reference.version,
    chartVersion: HADLOCK_1991_CHART_VERSION,
    percentile: null,
    display,
    status,
    kind: "UNAVAILABLE",
  };
}

export function interpolateHadlock1991Row(
  weeks: number,
  days: number,
): Hadlock1991Row | "OUTSIDE_REFERENCE_RANGE" {
  if (!Number.isInteger(weeks) || !Number.isInteger(days) || days < 0 || days > 6) {
    return "OUTSIDE_REFERENCE_RANGE";
  }
  if (weeks === 40 && days === 0) {
    return HADLOCK_1991_CHART_V1[40];
  }
  if (weeks < 10 || weeks > 39) {
    return "OUTSIDE_REFERENCE_RANGE";
  }

  const current = HADLOCK_1991_CHART_V1[weeks];
  const next = HADLOCK_1991_CHART_V1[weeks + 1];
  if (!current || !next) {
    return "OUTSIDE_REFERENCE_RANGE";
  }

  const fraction = days / 7;
  return {
    p3: current.p3 + fraction * (next.p3 - current.p3),
    p10: current.p10 + fraction * (next.p10 - current.p10),
    p50: current.p50 + fraction * (next.p50 - current.p50),
    p90: current.p90 + fraction * (next.p90 - current.p90),
    p97: current.p97 + fraction * (next.p97 - current.p97),
  };
}

function formatPercentile(percentile: number): string {
  const rounded = Math.round(percentile * 10) / 10;
  return `P${rounded.toFixed(1).replace(".", ",")}`;
}

/**
 * Política evolUSG V1. Não é a fórmula original de percentil exato do Hadlock.
 * METHOD = HADLOCK 1991 CHART ANCHORS + DAY INTERPOLATION + Z INTERPOLATION.
 * Recebe o peso cru, não o peso já arredondado para tela.
 */
export function efwPercentile(input: {
  rawWeightGrams: number | null;
  weeks: number | null;
  days: number | null;
}): EfwPercentileResult {
  if (input.weeks == null || input.days == null) {
    return unavailable("UNAVAILABLE_GA", "Indisponível");
  }
  if (input.rawWeightGrams == null || !Number.isFinite(input.rawWeightGrams)) {
    return unavailable("UNAVAILABLE_WEIGHT", "Indisponível");
  }

  const row = interpolateHadlock1991Row(input.weeks, input.days);
  if (row === "OUTSIDE_REFERENCE_RANGE") {
    return unavailable("OUTSIDE_REFERENCE_RANGE", "Fora da faixa");
  }

  const points = ANCHORS.map((anchor) => ({
    percentile: anchor.percentile,
    weight: row[anchor.key],
    z: anchor.z,
  }));

  for (const point of points) {
    if (Math.abs(input.rawWeightGrams - point.weight) <= EXACT_TOLERANCE_GRAMS) {
      return {
        referenceId: reference.referenceId,
        version: reference.version,
        chartVersion: HADLOCK_1991_CHART_VERSION,
        percentile: point.percentile,
        display: formatPercentile(point.percentile),
        status: "OK",
        kind: "EXACT_ANCHOR",
      };
    }
  }

  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) {
    return unavailable("OUTSIDE_REFERENCE_RANGE", "Fora da faixa");
  }
  if (input.rawWeightGrams < first.weight) {
    return {
      referenceId: reference.referenceId,
      version: reference.version,
      chartVersion: HADLOCK_1991_CHART_VERSION,
      percentile: null,
      display: "<P3",
      status: "BELOW_P3",
      kind: "BELOW_P3",
    };
  }
  if (input.rawWeightGrams > last.weight) {
    return {
      referenceId: reference.referenceId,
      version: reference.version,
      chartVersion: HADLOCK_1991_CHART_VERSION,
      percentile: null,
      display: ">P97",
      status: "ABOVE_P97",
      kind: "ABOVE_P97",
    };
  }

  let lower = first;
  let upper = points[1] ?? first;
  for (let index = 0; index < points.length - 1; index += 1) {
    const start = points[index];
    const end = points[index + 1];
    if (
      start &&
      end &&
      input.rawWeightGrams > start.weight &&
      input.rawWeightGrams < end.weight
    ) {
      lower = start;
      upper = end;
      break;
    }
  }

  const span = upper.weight - lower.weight;
  if (span === 0) {
    return unavailable("OUTSIDE_REFERENCE_RANGE", "Fora da faixa");
  }
  const fraction = (input.rawWeightGrams - lower.weight) / span;
  const z = lower.z + fraction * (upper.z - lower.z);
  const percentile = normalCdf(z) * 100;

  return {
    referenceId: reference.referenceId,
    version: reference.version,
    chartVersion: HADLOCK_1991_CHART_VERSION,
    percentile,
    display: formatPercentile(percentile),
    status: "OK",
    kind: "Z_INTERPOLATED",
  };
}
