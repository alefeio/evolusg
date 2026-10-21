/**
 * Conjunto mínimo das três referências de biometria/crescimento desta Sprint.
 * Não é um framework universal de ClinicalReference.
 */
export const BIOMETRY_GROWTH_HADLOCK_V1 = {
  id: "BIOMETRY_GROWTH_HADLOCK_V1",
  efw: {
    referenceId: "EFW_HADLOCK_1985_BPD_HC_AC_FL",
    version: 1,
  },
  efwPercentile: {
    referenceId: "EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP",
    version: 1,
    chartVersion: "HADLOCK_1991_CHART_COMPAT_V1",
    method: "HADLOCK 1991 CHART ANCHORS + DAY INTERPOLATION + Z INTERPOLATION",
  },
  acPercentile: {
    referenceId: "AC_GROWTH_HADLOCK_1984",
    version: 1,
  },
} as const;
