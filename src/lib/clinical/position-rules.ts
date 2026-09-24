export type FetalLie = "LONGITUDINAL" | "TRANSVERSE";
export type FetalPresentation = "CEPHALIC" | "PELVIC" | "CORMIC";
export type Laterality = "RIGHT" | "LEFT";

export type PositionState = {
  lie: FetalLie | null;
  presentation: FetalPresentation | null;
  spineSide: Laterality | null;
  cephalicPoleSide: Laterality | null;
};

/**
 * Structural rules for fetal lie / presentation (protocol v0.1).
 * RULE-OBD-001..005 — no clinical thresholds.
 */
export function normalizePosition(input: PositionState): PositionState {
  let { lie, presentation, spineSide, cephalicPoleSide } = input;

  if (lie === "TRANSVERSE") {
    presentation = "CORMIC";
    spineSide = null;
  } else if (presentation === "CORMIC") {
    lie = "TRANSVERSE";
    spineSide = null;
  }

  if (lie === "LONGITUDINAL") {
    cephalicPoleSide = null;
    if (presentation === "CORMIC") {
      presentation = null;
    }
  }

  if (lie === "TRANSVERSE") {
    spineSide = null;
  }

  if (lie !== "LONGITUDINAL" && lie !== "TRANSVERSE") {
    spineSide = null;
    cephalicPoleSide = null;
  }

  return { lie, presentation, spineSide, cephalicPoleSide };
}

export function isPositionConsistent(state: PositionState): boolean {
  const normalized = normalizePosition(state);
  if (normalized.lie === "TRANSVERSE") {
    return normalized.presentation === "CORMIC" && normalized.spineSide === null;
  }
  if (normalized.lie === "LONGITUDINAL") {
    return (
      normalized.presentation !== "CORMIC" &&
      normalized.cephalicPoleSide === null
    );
  }
  return true;
}

export function showSpineField(lie: FetalLie | null): boolean {
  return lie === "LONGITUDINAL";
}

export function showCephalicPoleField(lie: FetalLie | null): boolean {
  return lie === "TRANSVERSE";
}
