export function createId(): string {
  return crypto.randomUUID();
}

export function now(): Date {
  return new Date();
}
