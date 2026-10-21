import { BIOMETRY_GROWTH_HADLOCK_V1 } from "@/lib/clinical/growth/reference-set";

const reference = BIOMETRY_GROWTH_HADLOCK_V1.efw;

export type EfwResult =
  | {
      status: "OK";
      rawWeightGrams: number;
      displayWeightGrams: number;
      referenceId: typeof reference.referenceId;
      version: typeof reference.version;
    }
  | {
      status: "UNAVAILABLE_INCOMPLETE_INPUT";
      referenceId: typeof reference.referenceId;
      version: typeof reference.version;
    };

function finiteMeasurement(value: number | null | undefined): value is number {
  return value != null && Number.isFinite(value);
}

/**
 * Hadlock 1985, quatro parâmetros: BPD, HC, AC, FL.
 * Interface em mm. Equação em cm, sem arredondamento intermediário.
 * log10(EFW) = 1.3596 - 0.00386*AC*FL + 0.0064*HC + 0.00061*BPD*AC + 0.174*FL + 0.0424*AC
 * Sem fallback para fórmulas de menos parâmetros.
 */
export function estimatedFetalWeight(input: {
  biparietalDiameterMm: number | null;
  headCircumferenceMm: number | null;
  abdominalCircumferenceMm: number | null;
  femurLengthMm: number | null;
}): EfwResult {
  if (
    !finiteMeasurement(input.biparietalDiameterMm) ||
    !finiteMeasurement(input.headCircumferenceMm) ||
    !finiteMeasurement(input.abdominalCircumferenceMm) ||
    !finiteMeasurement(input.femurLengthMm)
  ) {
    return {
      status: "UNAVAILABLE_INCOMPLETE_INPUT",
      referenceId: reference.referenceId,
      version: reference.version,
    };
  }

  const bpdCm = input.biparietalDiameterMm / 10;
  const hcCm = input.headCircumferenceMm / 10;
  const acCm = input.abdominalCircumferenceMm / 10;
  const flCm = input.femurLengthMm / 10;
  const log10Weight =
    1.3596 -
    0.00386 * acCm * flCm +
    0.0064 * hcCm +
    0.00061 * bpdCm * acCm +
    0.174 * flCm +
    0.0424 * acCm;
  const rawWeightGrams = 10 ** log10Weight;

  if (!Number.isFinite(rawWeightGrams)) {
    return {
      status: "UNAVAILABLE_INCOMPLETE_INPUT",
      referenceId: reference.referenceId,
      version: reference.version,
    };
  }

  return {
    status: "OK",
    rawWeightGrams,
    displayWeightGrams: Math.round(rawWeightGrams),
    referenceId: reference.referenceId,
    version: reference.version,
  };
}
