/**
 * Pure arithmetic helpers — no clinical reference tables.
 */

export function meanUterineArteryPi(
  rightPi: number | null | undefined,
  leftPi: number | null | undefined,
): number | null {
  if (rightPi == null || leftPi == null) {
    return null;
  }
  if (!Number.isFinite(rightPi) || !Number.isFinite(leftPi)) {
    return null;
  }
  return (rightPi + leftPi) / 2;
}

/**
 * RCP = IP ACM / IP umbilical. No threshold. No classification.
 */
export function cerebroplacentalRatio(
  mcaPi: number | null | undefined,
  umbilicalPi: number | null | undefined,
): number | null {
  if (mcaPi == null || umbilicalPi == null) {
    return null;
  }
  if (!Number.isFinite(mcaPi) || !Number.isFinite(umbilicalPi)) {
    return null;
  }
  if (umbilicalPi === 0) {
    return null;
  }
  return mcaPi / umbilicalPi;
}
