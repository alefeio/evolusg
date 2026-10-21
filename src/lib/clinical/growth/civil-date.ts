const MS_PER_DAY = 86_400_000;

/** YYYY-MM-DD válido, contado em dias civis UTC. Não usa horário local nem DST. */
export function civilDayIndex(isoDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = Date.UTC(year, month - 1, day);
  const date = new Date(utc);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return Math.round(utc / MS_PER_DAY);
}

export function elapsedCivilDays(fromIso: string, toIso: string): number | null {
  const from = civilDayIndex(fromIso);
  const to = civilDayIndex(toIso);
  if (from == null || to == null) {
    return null;
  }
  return to - from;
}

/** Mesma convenção já usada para datas clínicas date-only: calendário UTC do instante. */
export function utcCivilDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function addCivilDays(isoDate: string, days: number): string | null {
  const index = civilDayIndex(isoDate);
  if (index == null || !Number.isInteger(days)) {
    return null;
  }
  return new Date((index + days) * MS_PER_DAY).toISOString().slice(0, 10);
}
