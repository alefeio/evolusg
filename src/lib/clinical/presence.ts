/**
 * Presence / absence semantics for Sprint 2 clinical draft.
 *
 * Documented rule: "não marcado ≠ ausente".
 * Representation: `true` = presente; `null` / `undefined` = não informado.
 * We never persist `false` for movements/swallowing/notch — that would imply absent.
 */

export type PresenceFlag = true | null;

export function presenceFromCheckbox(checked: boolean): PresenceFlag {
  return checked ? true : null;
}

export function presenceToCheckbox(value: boolean | null | undefined): boolean {
  return value === true;
}

export function isPresent(value: boolean | null | undefined): boolean {
  return value === true;
}

export function isNotInformed(value: boolean | null | undefined): boolean {
  return value !== true;
}
