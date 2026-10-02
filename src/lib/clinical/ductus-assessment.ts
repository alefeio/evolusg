export const DUCTUS_PI_REQUIRED_MESSAGE =
  "Informe o IP do ducto venoso ou desmarque a avaliação do ducto venoso.";

export class DuctusAssessmentError extends Error {
  constructor(message = DUCTUS_PI_REQUIRED_MESSAGE) {
    super(message);
    this.name = "DuctusAssessmentError";
  }
}

/** Selected assessment cannot be saved without an IP. Exclusion and legacy reads stay allowed. */
export function ductusSaveError(
  assessed: boolean,
  pi: number | null | undefined,
): string | null {
  if (assessed && (pi == null || !Number.isFinite(pi))) {
    return DUCTUS_PI_REQUIRED_MESSAGE;
  }
  return null;
}

/**
 * Ductus venosus inclusion is a clinician decision, not a finding.
 * `false` means the block is not part of this exam. It is not normal, absent, or abnormal.
 * `null` is legacy or undecided: a stored IP means the block stays visible.
 */
export function ductusBlockIncluded(
  assessed: boolean | null | undefined,
  pi: number | null | undefined,
): boolean {
  if (assessed === true) {
    return true;
  }
  if (assessed === false) {
    return false;
  }
  return pi != null;
}
