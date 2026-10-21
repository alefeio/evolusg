/**
 * Chart canônico Hadlock 1991 usado por HADLOCK_1991_CHART_COMPAT_V1.
 * Pesos em gramas. Semanas inteiras de 10 a 40.
 *
 * KNOWN_SOURCE_ANOMALY_CORRECTION:
 * week=30, centile=P97, published=1649, v1Canonical=1949,
 * rationale=monotonic compatibility correction.
 * O artigo publicou 1649 g, abaixo do P90 (1824 g). O evolUSG V1 adota 1949 g.
 * Mudança futura exige nova versão do chart.
 */
export const HADLOCK_1991_P97_WEEK_30_CORRECTION = {
  week: 30,
  centile: "P97",
  published: 1649,
  v1Canonical: 1949,
  rationale: "monotonic compatibility correction",
} as const;

export type Hadlock1991Row = {
  p3: number;
  p10: number;
  p50: number;
  p90: number;
  p97: number;
};

export const HADLOCK_1991_CHART_VERSION = "HADLOCK_1991_CHART_COMPAT_V1" as const;

export const HADLOCK_1991_CHART_V1: Record<number, Hadlock1991Row> = {
  10: { p3: 26, p10: 29, p50: 35, p90: 41, p97: 44 },
  11: { p3: 34, p10: 37, p50: 45, p90: 53, p97: 56 },
  12: { p3: 43, p10: 48, p50: 58, p90: 68, p97: 73 },
  13: { p3: 55, p10: 61, p50: 73, p90: 85, p97: 91 },
  14: { p3: 70, p10: 77, p50: 93, p90: 109, p97: 116 },
  15: { p3: 88, p10: 97, p50: 117, p90: 137, p97: 146 },
  16: { p3: 110, p10: 121, p50: 146, p90: 171, p97: 183 },
  17: { p3: 136, p10: 150, p50: 181, p90: 212, p97: 226 },
  18: { p3: 167, p10: 185, p50: 223, p90: 261, p97: 279 },
  19: { p3: 205, p10: 227, p50: 273, p90: 319, p97: 341 },
  20: { p3: 248, p10: 275, p50: 331, p90: 387, p97: 414 },
  21: { p3: 299, p10: 331, p50: 399, p90: 467, p97: 499 },
  22: { p3: 359, p10: 398, p50: 478, p90: 559, p97: 598 },
  23: { p3: 426, p10: 471, p50: 568, p90: 665, p97: 710 },
  24: { p3: 503, p10: 556, p50: 670, p90: 784, p97: 838 },
  25: { p3: 589, p10: 652, p50: 785, p90: 918, p97: 981 },
  26: { p3: 685, p10: 758, p50: 913, p90: 1068, p97: 1141 },
  27: { p3: 791, p10: 876, p50: 1055, p90: 1234, p97: 1319 },
  28: { p3: 908, p10: 1004, p50: 1210, p90: 1416, p97: 1513 },
  29: { p3: 1034, p10: 1145, p50: 1379, p90: 1613, p97: 1724 },
  30: { p3: 1169, p10: 1294, p50: 1559, p90: 1824, p97: 1949 },
  31: { p3: 1313, p10: 1453, p50: 1751, p90: 2049, p97: 2189 },
  32: { p3: 1465, p10: 1621, p50: 1953, p90: 2285, p97: 2441 },
  33: { p3: 1622, p10: 1794, p50: 2162, p90: 2530, p97: 2703 },
  34: { p3: 1783, p10: 1973, p50: 2377, p90: 2781, p97: 2971 },
  35: { p3: 1946, p10: 2154, p50: 2595, p90: 3036, p97: 3244 },
  36: { p3: 2110, p10: 2335, p50: 2813, p90: 3291, p97: 3516 },
  37: { p3: 2271, p10: 2513, p50: 3028, p90: 3543, p97: 3785 },
  38: { p3: 2427, p10: 2686, p50: 3236, p90: 3786, p97: 4045 },
  39: { p3: 2576, p10: 2851, p50: 3435, p90: 4019, p97: 4294 },
  40: { p3: 2714, p10: 3004, p50: 3619, p90: 4234, p97: 4524 },
};

export const HADLOCK_1991_CHART_WEEKS = Object.keys(HADLOCK_1991_CHART_V1)
  .map(Number)
  .sort((a, b) => a - b);
