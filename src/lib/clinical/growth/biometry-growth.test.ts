import { describe, expect, it } from "vitest";
import { updateExamDraftSchema } from "@/lib/clinical/schemas";
import { elapsedCivilDays, utcCivilDate } from "@/lib/clinical/growth/civil-date";
import { correctedGestationalAge } from "@/lib/clinical/growth/corrected-gestational-age";
import { deriveBiometryGrowth } from "@/lib/clinical/growth/derive-biometry-growth";
import {
  acPercentile,
  formatAcPercentile,
} from "@/lib/clinical/growth/hadlock-1984-ac-percentile";
import { estimatedFetalWeight } from "@/lib/clinical/growth/hadlock-1985-efw";
import {
  HADLOCK_1991_CHART_V1,
  HADLOCK_1991_CHART_WEEKS,
  HADLOCK_1991_P97_WEEK_30_CORRECTION,
} from "@/lib/clinical/growth/hadlock-1991-chart-v1";
import {
  efwPercentile,
  HADLOCK_1991_ANCHOR_Z,
  interpolateHadlock1991Row,
} from "@/lib/clinical/growth/hadlock-1991-efw-percentile";
import { normalCdf } from "@/lib/clinical/growth/normal-cdf";

const measurements = {
  biparietalDiameterMm: 80,
  headCircumferenceMm: 280,
  abdominalCircumferenceMm: 260,
  femurLengthMm: 60,
};

describe("normal CDF", () => {
  it("matches the canonical anchors within 1e-6", () => {
    expect(normalCdf(0)).toBeCloseTo(0.5, 6);
    expect(normalCdf(-1.2815515655)).toBeCloseTo(0.1, 6);
    expect(normalCdf(1.2815515655)).toBeCloseTo(0.9, 6);
    expect(normalCdf(-1.8807936082)).toBeCloseTo(0.03, 6);
    expect(normalCdf(1.8807936082)).toBeCloseTo(0.97, 6);
  });
});

describe("Hadlock 1985 EFW", () => {
  it("matches independently computed synthetic fixtures without intermediate rounding", () => {
    const typical = estimatedFetalWeight(measurements);
    expect(typical.status).toBe("OK");
    if (typical.status === "OK") {
      expect(typical.rawWeightGrams).toBeCloseTo(1621.511376412684, 9);
      expect(typical.displayWeightGrams).toBe(1622);
      expect(typical.rawWeightGrams).not.toBe(typical.displayWeightGrams);
      expect(typical.referenceId).toBe("EFW_HADLOCK_1985_BPD_HC_AC_FL");
      expect(typical.version).toBe(1);
    }

    const smaller = estimatedFetalWeight({
      biparietalDiameterMm: 50,
      headCircumferenceMm: 180,
      abdominalCircumferenceMm: 150,
      femurLengthMm: 30,
    });
    expect(smaller.status).toBe("OK");
    if (smaller.status === "OK") {
      expect(smaller.rawWeightGrams).toBeCloseTo(319.77904412428165, 9);
      expect(smaller.displayWeightGrams).toBe(320);
    }

    const larger = estimatedFetalWeight({
      biparietalDiameterMm: 95,
      headCircumferenceMm: 340,
      abdominalCircumferenceMm: 330,
      femurLengthMm: 75,
    });
    expect(larger.status).toBe("OK");
    if (larger.status === "OK") {
      expect(larger.rawWeightGrams).toBeCloseTo(3290.675062268778, 9);
      expect(larger.displayWeightGrams).toBe(3291);
    }

    const fractional = estimatedFetalWeight({
      biparietalDiameterMm: 80.5,
      headCircumferenceMm: 280.4,
      abdominalCircumferenceMm: 260.2,
      femurLengthMm: 60.1,
    });
    expect(fractional.status).toBe("OK");
    if (fractional.status === "OK") {
      expect(fractional.rawWeightGrams).toBeCloseTo(1630.0001260931294, 9);
      expect(fractional.displayWeightGrams).toBe(1630);
      expect(fractional.rawWeightGrams).not.toBeCloseTo(1621.511376412684, 3);
    }
  });

  it("stays unavailable when any of the four measurements is missing", () => {
    for (const key of [
      "biparietalDiameterMm",
      "headCircumferenceMm",
      "abdominalCircumferenceMm",
      "femurLengthMm",
    ] as const) {
      const result = estimatedFetalWeight({ ...measurements, [key]: null });
      expect(result.status).toBe("UNAVAILABLE_INCOMPLETE_INPUT");
    }
  });
});

describe("Hadlock 1991 chart", () => {
  it("keeps every row strictly ordered, integral and positive", () => {
    expect(HADLOCK_1991_CHART_WEEKS).toEqual(
      Array.from({ length: 31 }, (_, index) => index + 10),
    );
    for (const week of HADLOCK_1991_CHART_WEEKS) {
      const row = HADLOCK_1991_CHART_V1[week];
      expect(row).toBeDefined();
      if (!row) {
        continue;
      }
      const values = [row.p3, row.p10, row.p50, row.p90, row.p97];
      for (const value of values) {
        expect(Number.isInteger(value)).toBe(true);
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThan(0);
      }
      expect(row.p3).toBeLessThan(row.p10);
      expect(row.p10).toBeLessThan(row.p50);
      expect(row.p50).toBeLessThan(row.p90);
      expect(row.p90).toBeLessThan(row.p97);
    }
  });

  it("records the week 30 P97 correction instead of the published anomaly", () => {
    expect(HADLOCK_1991_P97_WEEK_30_CORRECTION).toEqual({
      week: 30,
      centile: "P97",
      published: 1649,
      v1Canonical: 1949,
      rationale: "monotonic compatibility correction",
    });
    expect(HADLOCK_1991_CHART_V1[27]).toEqual({
      p3: 791,
      p10: 876,
      p50: 1055,
      p90: 1234,
      p97: 1319,
    });
    expect(HADLOCK_1991_CHART_V1[29]).toEqual({
      p3: 1034,
      p10: 1145,
      p50: 1379,
      p90: 1613,
      p97: 1724,
    });
    expect(HADLOCK_1991_CHART_V1[30]?.p97).toBe(1949);
    expect(HADLOCK_1991_CHART_V1[30]?.p97).not.toBe(1649);
    expect(HADLOCK_1991_CHART_V1[30]?.p90).toBeLessThan(1949);
  });
});

describe("Hadlock 1991 EFW percentile policy", () => {
  const week = 24;

  it("returns the canonical anchors exactly", () => {
    const row = HADLOCK_1991_CHART_V1[week];
    expect(row).toBeDefined();
    if (!row) {
      return;
    }
    const cases = [
      [row.p3, 3],
      [row.p10, 10],
      [row.p50, 50],
      [row.p90, 90],
      [row.p97, 97],
    ] as const;
    for (const [weight, percentile] of cases) {
      const result = efwPercentile({ rawWeightGrams: weight, weeks: week, days: 0 });
      expect(result.kind).toBe("EXACT_ANCHOR");
      expect(result.percentile).toBe(percentile);
      expect(result.display).toBe(`P${percentile.toFixed(1).replace(".", ",")}`);
      expect(result.chartVersion).toBe("HADLOCK_1991_CHART_COMPAT_V1");
      expect(result.referenceId).toBe("EFW_GROWTH_HADLOCK_1991_CHART_Z_INTERP");
    }
  });

  it("interpolates in z-score between anchors and does not interpolate the labels", () => {
    const bands = [
      { weight: 530, low: 3, high: 10, zLow: HADLOCK_1991_ANCHOR_Z.p3, zHigh: HADLOCK_1991_ANCHOR_Z.p10, weightLow: 503, weightHigh: 556 },
      { weight: 600, low: 10, high: 50, zLow: HADLOCK_1991_ANCHOR_Z.p10, zHigh: HADLOCK_1991_ANCHOR_Z.p50, weightLow: 556, weightHigh: 670 },
      { weight: 700, low: 50, high: 90, zLow: HADLOCK_1991_ANCHOR_Z.p50, zHigh: HADLOCK_1991_ANCHOR_Z.p90, weightLow: 670, weightHigh: 784 },
      { weight: 800, low: 90, high: 97, zLow: HADLOCK_1991_ANCHOR_Z.p90, zHigh: HADLOCK_1991_ANCHOR_Z.p97, weightLow: 784, weightHigh: 838 },
    ];
    for (const band of bands) {
      const result = efwPercentile({
        rawWeightGrams: band.weight,
        weeks: week,
        days: 0,
      });
      const fraction = (band.weight - band.weightLow) / (band.weightHigh - band.weightLow);
      const z = band.zLow + fraction * (band.zHigh - band.zLow);
      const expected = normalCdf(z) * 100;
      const labelInterpolation = band.low + fraction * (band.high - band.low);
      expect(result.kind).toBe("Z_INTERPOLATED");
      expect(result.percentile).toBeCloseTo(expected, 8);
      expect(result.percentile).not.toBeCloseTo(labelInterpolation, 1);
      expect(result.percentile).toBeGreaterThan(band.low);
      expect(result.percentile).toBeLessThan(band.high);
      if (result.percentile != null) {
        const rounded = Math.round(result.percentile * 10) / 10;
        expect(result.display).toBe(`P${rounded.toFixed(1).replace(".", ",")}`);
      }
    }
  });

  it("does not extrapolate beyond P3 and P97", () => {
    expect(efwPercentile({ rawWeightGrams: 500, weeks: week, days: 0 })).toMatchObject({
      status: "BELOW_P3",
      kind: "BELOW_P3",
      percentile: null,
      display: "<P3",
    });
    expect(efwPercentile({ rawWeightGrams: 900, weeks: week, days: 0 })).toMatchObject({
      status: "ABOVE_P97",
      kind: "ABOVE_P97",
      percentile: null,
      display: ">P97",
    });
  });

  it("interpolates each anchor by gestational day and stops at the chart edges", () => {
    const row = interpolateHadlock1991Row(24, 3);
    expect(row).not.toBe("OUTSIDE_REFERENCE_RANGE");
    if (row === "OUTSIDE_REFERENCE_RANGE") {
      return;
    }
    expect(row.p10).toBeCloseTo(556 + (3 / 7) * (652 - 556), 10);
    const onAnchor = efwPercentile({ rawWeightGrams: row.p10, weeks: 24, days: 3 });
    expect(onAnchor.percentile).toBe(10);

    const late = interpolateHadlock1991Row(39, 6);
    expect(late).not.toBe("OUTSIDE_REFERENCE_RANGE");
    if (late !== "OUTSIDE_REFERENCE_RANGE") {
      expect(late.p50).toBeCloseTo(3435 + (6 / 7) * (3619 - 3435), 10);
      expect(
        efwPercentile({ rawWeightGrams: late.p50, weeks: 39, days: 6 }).percentile,
      ).toBe(50);
    }

    expect(efwPercentile({ rawWeightGrams: 3619, weeks: 40, days: 0 }).percentile).toBe(50);
    expect(efwPercentile({ rawWeightGrams: 3619, weeks: 40, days: 1 }).status).toBe(
      "OUTSIDE_REFERENCE_RANGE",
    );
    expect(efwPercentile({ rawWeightGrams: 35, weeks: 9, days: 6 }).status).toBe(
      "OUTSIDE_REFERENCE_RANGE",
    );
  });

  it("uses the raw weight, not the rounded display weight", () => {
    const raw = efwPercentile({ rawWeightGrams: 503.4, weeks: 24, days: 0 });
    const rounded = efwPercentile({ rawWeightGrams: 503, weeks: 24, days: 0 });
    expect(rounded.kind).toBe("EXACT_ANCHOR");
    expect(raw.kind).toBe("Z_INTERPOLATED");
    expect(raw.percentile).not.toBe(rounded.percentile);
  });
});

describe("Hadlock 1984 AC percentile", () => {
  it("is about P50 on the mean and moves to either side", () => {
    const atMean = acPercentile({
      abdominalCircumferenceMm: 149.08,
      weeks: 20,
      days: 0,
    });
    expect(atMean.status).toBe("OK");
    expect(atMean.percentile).toBeCloseTo(50, 4);
    expect(atMean.display).toBe("P50,0");
    expect(normalCdf(0) * 100).toBeCloseTo(50, 6);

    const below = acPercentile({
      abdominalCircumferenceMm: 120,
      weeks: 20,
      days: 0,
    });
    const above = acPercentile({
      abdominalCircumferenceMm: 180,
      weeks: 20,
      days: 0,
    });
    expect(below.percentile).toBeLessThan(50);
    expect(above.percentile).toBeGreaterThan(50);

    const withDays = acPercentile({
      abdominalCircumferenceMm: 149.08,
      weeks: 20,
      days: 3,
    });
    expect(withDays.status).toBe("OK");
    expect(withDays.percentile).not.toBeCloseTo(50, 1);
  });

  it("accepts the inclusive edges and refuses extrapolation", () => {
    expect(acPercentile({ abdominalCircumferenceMm: 50, weeks: 12, days: 0 }).status).toBe(
      "OK",
    );
    expect(acPercentile({ abdominalCircumferenceMm: 360, weeks: 40, days: 0 }).status).toBe(
      "OK",
    );
    expect(acPercentile({ abdominalCircumferenceMm: 50, weeks: 11, days: 6 }).status).toBe(
      "OUTSIDE_REFERENCE_RANGE",
    );
    expect(acPercentile({ abdominalCircumferenceMm: 360, weeks: 40, days: 1 }).status).toBe(
      "OUTSIDE_REFERENCE_RANGE",
    );
  });

  it("formats extremes without changing the numeric rule", () => {
    expect(formatAcPercentile(42.74)).toBe("P42,7");
    expect(formatAcPercentile(0.04)).toBe("<P0,1");
    expect(formatAcPercentile(99.96)).toBe(">P99,9");
  });
});

describe("corrected gestational age", () => {
  it("adds civil days to the first-ultrasound anchor and ignores clock time", () => {
    const age = correctedGestationalAge({
      datingUltrasoundDate: "2026-02-01",
      datingUltrasoundGaWeeks: 8,
      datingUltrasoundGaDays: 2,
      examDate: "2026-02-15",
    });
    expect(age).toEqual({ status: "OK", totalDays: 72, weeks: 10, days: 2 });
    expect(elapsedCivilDays("2026-10-31", "2026-11-01")).toBe(1);
    expect(utcCivilDate(new Date("2026-02-01T00:00:00.000Z"))).toBe("2026-02-01");
  });

  it("stays unavailable without a complete dating anchor and does not read LMP", () => {
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: null,
        datingUltrasoundGaWeeks: 8,
        datingUltrasoundGaDays: 0,
        examDate: "2026-02-15",
      }).status,
    ).toBe("UNAVAILABLE");
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2026-02-20",
        datingUltrasoundGaWeeks: 8,
        datingUltrasoundGaDays: 0,
        examDate: "2026-02-15",
      }).status,
    ).toBe("INCONSISTENT_EXAM_DATE");
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2026-02-01",
        datingUltrasoundGaWeeks: 8,
        datingUltrasoundGaDays: null,
        examDate: "2026-02-01",
      }),
    ).toEqual({ status: "OK", totalDays: 56, weeks: 8, days: 0 });
  });

  it("keeps the same age when the exam is on the first-ultrasound day", () => {
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2026-05-10",
        datingUltrasoundGaWeeks: 12,
        datingUltrasoundGaDays: 4,
        examDate: "2026-05-10",
      }),
    ).toEqual({ status: "OK", totalDays: 88, weeks: 12, days: 4 });
  });

  it("crosses a month boundary with civil days", () => {
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2026-01-31",
        datingUltrasoundGaWeeks: 10,
        datingUltrasoundGaDays: 0,
        examDate: "2026-02-02",
      }),
    ).toEqual({ status: "OK", totalDays: 72, weeks: 10, days: 2 });
    expect(elapsedCivilDays("2026-01-31", "2026-02-02")).toBe(2);
  });

  it("crosses a year boundary with civil days", () => {
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2025-12-30",
        datingUltrasoundGaWeeks: 18,
        datingUltrasoundGaDays: 6,
        examDate: "2026-01-02",
      }),
    ).toEqual({ status: "OK", totalDays: 135, weeks: 19, days: 2 });
    expect(elapsedCivilDays("2025-12-30", "2026-01-02")).toBe(3);
  });

  it("counts 29 February only in a leap year", () => {
    expect(elapsedCivilDays("2024-02-28", "2024-03-01")).toBe(2);
    expect(elapsedCivilDays("2023-02-28", "2023-03-01")).toBe(1);
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2024-02-28",
        datingUltrasoundGaWeeks: 20,
        datingUltrasoundGaDays: 0,
        examDate: "2024-03-01",
      }),
    ).toEqual({ status: "OK", totalDays: 142, weeks: 20, days: 2 });
  });

  it("withholds age when the clinical exam date is absent", () => {
    expect(
      correctedGestationalAge({
        datingUltrasoundDate: "2026-02-01",
        datingUltrasoundGaWeeks: 8,
        datingUltrasoundGaDays: 2,
        examDate: null,
      }).status,
    ).toBe("UNAVAILABLE_MISSING_EXAM_DATE");
  });

  it("derives corrected GA from examDate when record creation is another day", () => {
    const createdAt = "2026-04-10";
    const examDate = "2026-02-15";
    const fromExamDate = correctedGestationalAge({
      datingUltrasoundDate: "2026-02-01",
      datingUltrasoundGaWeeks: 8,
      datingUltrasoundGaDays: 2,
      examDate,
    });
    const ifCreatedAtWereUsed = correctedGestationalAge({
      datingUltrasoundDate: "2026-02-01",
      datingUltrasoundGaWeeks: 8,
      datingUltrasoundGaDays: 2,
      examDate: createdAt,
    });
    expect(fromExamDate).toEqual({ status: "OK", totalDays: 72, weeks: 10, days: 2 });
    expect(ifCreatedAtWereUsed).toEqual({
      status: "OK",
      totalDays: 126,
      weeks: 18,
      days: 0,
    });
    expect(fromExamDate).not.toEqual(ifCreatedAtWereUsed);
  });
});

describe("biometry growth derivation", () => {
  it("calculates EFW without gestational age and withholds percentiles", () => {
    const derived = deriveBiometryGrowth({
      ...measurements,
      datingUltrasoundDate: null,
      datingUltrasoundGaWeeks: null,
      datingUltrasoundGaDays: null,
      examDate: null,
    });
    expect(derived.efw.status).toBe("OK");
    expect(derived.gestationalAge.status).toBe("UNAVAILABLE_MISSING_EXAM_DATE");
    expect(derived.efwPercentile.status).toBe("UNAVAILABLE_MISSING_EXAM_DATE");
    expect(derived.efwPercentile.percentile).toBeNull();
    expect(derived.acPercentile.status).toBe("UNAVAILABLE_MISSING_EXAM_DATE");
    expect(derived.acPercentile.percentile).toBeNull();
  });

  it("withholds percentiles when the dating anchor is incomplete", () => {
    const derived = deriveBiometryGrowth({
      ...measurements,
      datingUltrasoundDate: "2026-02-01",
      datingUltrasoundGaWeeks: null,
      datingUltrasoundGaDays: null,
      examDate: "2026-02-15",
    });
    expect(derived.efw.status).toBe("OK");
    expect(derived.gestationalAge.status).toBe("UNAVAILABLE");
    expect(derived.efwPercentile.status).toBe("UNAVAILABLE_GA");
    expect(derived.acPercentile.status).toBe("UNAVAILABLE_GA");
  });

  it("does not calculate percentiles when the exam date precedes the first ultrasound", () => {
    const derived = deriveBiometryGrowth({
      ...measurements,
      datingUltrasoundDate: "2026-02-20",
      datingUltrasoundGaWeeks: 12,
      datingUltrasoundGaDays: 0,
      examDate: "2026-02-15",
    });
    expect(derived.efw.status).toBe("OK");
    expect(derived.gestationalAge.status).toBe("INCONSISTENT_EXAM_DATE");
    expect(derived.efwPercentile.percentile).toBeNull();
    expect(derived.acPercentile.percentile).toBeNull();
  });

  it("feeds the raw weight into the percentile", () => {
    const derived = deriveBiometryGrowth({
      biparietalDiameterMm: 61.2,
      headCircumferenceMm: 220,
      abdominalCircumferenceMm: 190,
      femurLengthMm: 40,
      datingUltrasoundDate: "2026-01-01",
      datingUltrasoundGaWeeks: 24,
      datingUltrasoundGaDays: 0,
      examDate: "2026-01-01",
    });
    expect(derived.efw.status).toBe("OK");
    if (derived.efw.status !== "OK") {
      return;
    }
    const fromRaw = efwPercentile({
      rawWeightGrams: derived.efw.rawWeightGrams,
      weeks: 24,
      days: 0,
    });
    const fromDisplay = efwPercentile({
      rawWeightGrams: derived.efw.displayWeightGrams,
      weeks: 24,
      days: 0,
    });
    expect(derived.efwPercentile).toEqual(fromRaw);
    expect(derived.efw.rawWeightGrams).not.toBe(derived.efw.displayWeightGrams);
    expect(fromRaw.percentile).not.toBe(fromDisplay.percentile);
  });

  it("does not accept a browser-supplied weight in the draft schema", () => {
    const parsed = updateExamDraftSchema.safeParse({
      examId: "exam-1",
      comorbidities: null,
      continuousMedications: null,
      lie: null,
      presentation: null,
      spineSide: null,
      cephalicPoleSide: null,
      heartRateBpm: null,
      bodyMovementsPresent: null,
      swallowingPresent: null,
      biparietalDiameterMm: 80,
      headCircumferenceMm: 280,
      abdominalCircumferenceMm: 260,
      femurLengthMm: 60,
      umbilicalArteryPi: null,
      middleCerebralArteryPi: null,
      ductusVenosusAssessed: false,
      ductusVenosusPi: null,
      uterineArteryRightPi: null,
      uterineArteryLeftPi: null,
      uterineArteryRightNotch: null,
      uterineArteryLeftNotch: null,
      transducersUsed: [],
      placentaLocation: null,
      placentaGrade: null,
      amnioticMethod: null,
      amnioticValue: null,
      efwGrams: 9999,
      efwPercentile: 50,
      createdAt: "2026-04-10",
      examDate: "2026-03-20",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).not.toHaveProperty("efwGrams");
      expect(parsed.data).not.toHaveProperty("efwPercentile");
      expect(parsed.data).not.toHaveProperty("createdAt");
      expect(parsed.data.examDate).toEqual(new Date("2026-03-20T00:00:00.000Z"));
      expect(parsed.data.biparietalDiameterMm).toBe(80);
    }

    const missingDate = updateExamDraftSchema.safeParse({
      examId: "exam-1",
      examDate: "",
      ductusVenosusAssessed: false,
    });
    expect(missingDate.success).toBe(true);
    if (missingDate.success) {
      expect(missingDate.data.examDate).toBeNull();
    }

    const invalidDate = updateExamDraftSchema.safeParse({
      examId: "exam-1",
      examDate: "2026-02-31",
      ductusVenosusAssessed: false,
    });
    expect(invalidDate.success).toBe(false);
  });
});
