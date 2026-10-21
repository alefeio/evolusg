import { elapsedCivilDays } from "@/lib/clinical/growth/civil-date";

export type CorrectedGestationalAge =
  | {
      status: "OK";
      totalDays: number;
      weeks: number;
      days: number;
    }
  | { status: "UNAVAILABLE" };

/**
 * IG corrigida pela 1ª ultrassonografia de datação.
 * Não usa DUM. Datas são YYYY-MM-DD civis.
 * Dias da âncora ausentes contam como 0 somente quando semanas e data existem,
 * igual à leitura já exibida na captura.
 */
export function correctedGestationalAge(input: {
  datingUltrasoundDate: string | null;
  datingUltrasoundGaWeeks: number | null;
  datingUltrasoundGaDays: number | null;
  examDate: string | null;
}): CorrectedGestationalAge {
  if (
    input.datingUltrasoundDate == null ||
    input.examDate == null ||
    input.datingUltrasoundGaWeeks == null
  ) {
    return { status: "UNAVAILABLE" };
  }

  const weeks = input.datingUltrasoundGaWeeks;
  const days = input.datingUltrasoundGaDays ?? 0;
  if (
    !Number.isInteger(weeks) ||
    weeks < 0 ||
    !Number.isInteger(days) ||
    days < 0 ||
    days > 6
  ) {
    return { status: "UNAVAILABLE" };
  }

  const elapsed = elapsedCivilDays(input.datingUltrasoundDate, input.examDate);
  if (elapsed == null || elapsed < 0) {
    return { status: "UNAVAILABLE" };
  }

  const totalDays = weeks * 7 + days + elapsed;
  return {
    status: "OK",
    totalDays,
    weeks: Math.floor(totalDays / 7),
    days: totalDays % 7,
  };
}
