/**
 * CDF da normal padrão.
 * erf via Abramowitz & Stegun 7.1.26 (erro máximo publicado ~1.5e-7).
 * Sem dependência externa.
 */

const ERF_P = 0.3275911;
const ERF_A1 = 0.254829592;
const ERF_A2 = -0.284496736;
const ERF_A3 = 1.421413741;
const ERF_A4 = -1.453152027;
const ERF_A5 = 1.061405429;

export function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const abs = Math.abs(x);
  const t = 1 / (1 + ERF_P * abs);
  const polynomial =
    t *
    (ERF_A1 +
      t * (ERF_A2 + t * (ERF_A3 + t * (ERF_A4 + t * ERF_A5))));
  return sign * (1 - polynomial * Math.exp(-abs * abs));
}

export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) {
    return z > 0 ? 1 : 0;
  }
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
