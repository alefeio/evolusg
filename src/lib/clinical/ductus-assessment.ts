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
