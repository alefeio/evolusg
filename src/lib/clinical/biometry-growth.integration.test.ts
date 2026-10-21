import "dotenv/config";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { isSafeMigrationTarget } from "@/lib/db/urls";
import { createPatient } from "@/lib/clinical/patient-service";
import { createPregnancyEpisode } from "@/lib/clinical/episode-service";
import {
  createObstetricDopplerDraft,
  getExamDraft,
  updateExamDraft,
} from "@/lib/clinical/exam-service";
import { ClinicalAccessError } from "@/lib/clinical/ownership";
import { createId, now } from "@/lib/clinical/ids";
import { deriveBiometryGrowth } from "@/lib/clinical/growth/derive-biometry-growth";
import { utcCivilDate } from "@/lib/clinical/growth/civil-date";
import type { UpdateExamDraftInput } from "@/lib/clinical/schemas";

const enabled = isSafeMigrationTarget() && Boolean(process.env.DATABASE_URL);
const suffix = randomUUID();

describe.skipIf(!enabled)("Biometry growth derivation on draft", () => {
  let prisma: typeof import("@/lib/db/prisma").prisma;
  let ownerA: string;
  let ownerB: string;

  beforeAll(async () => {
    ({ prisma } = await import("@/lib/db/prisma"));
    await prisma.$connect();
    const timestamp = now();
    ownerA = createId();
    ownerB = createId();
    await prisma.user.createMany({
      data: [
        {
          id: ownerA,
          name: `Owner A ${suffix}`,
          email: `owner-a.${suffix}@biometry-growth.test`,
          emailVerified: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: ownerB,
          name: `Owner B ${suffix}`,
          email: `owner-b.${suffix}@biometry-growth.test`,
          emailVerified: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    });
  }, 90_000);

  afterAll(async () => {
    if (!prisma) {
      return;
    }
    await prisma.exam.deleteMany({
      where: { ownerUserId: { in: [ownerA, ownerB] } },
    });
    await prisma.pregnancyEpisode.deleteMany({
      where: { ownerUserId: { in: [ownerA, ownerB] } },
    });
    await prisma.patient.deleteMany({
      where: { ownerUserId: { in: [ownerA, ownerB] } },
    });
    await prisma.user.deleteMany({
      where: { email: { endsWith: "@biometry-growth.test" } },
    });
    await prisma.$disconnect();
  }, 90_000);

  it(
    "derives growth from saved inputs, keeps partial drafts, and preserves ownership",
    { timeout: 90_000 },
    async () => {
      const patient = await createPatient(ownerA, {
        fullName: `Paciente Fictícia ${suffix}`,
        birthDate: null,
        notes: null,
      });
      const episode = await createPregnancyEpisode(ownerA, {
        patientId: patient.id,
        lmp: new Date("2026-01-01T00:00:00.000Z"),
        gravidity: 1,
        parity: 0,
        abortions: 0,
        datingUltrasoundDate: null,
        datingUltrasoundGaWeeks: null,
        datingUltrasoundGaDays: null,
      });
      const clinicalExamDate = new Date("2026-03-20T00:00:00.000Z");
      const created = await createObstetricDopplerDraft(
        ownerA,
        patient.id,
        episode.id,
        clinicalExamDate,
      );
      await prisma.exam.update({
        where: { id: created.id },
        data: { createdAt: new Date("2026-04-02T15:00:00.000Z") },
      });

      const incomplete = await updateExamDraft(ownerA, {
        ...blankDraft(created.id),
        biparietalDiameterMm: 80,
        examDate: clinicalExamDate,
      });
      expect(incomplete.fetuses[0]?.femurLengthMm).toBeNull();
      const incompleteView = deriveFromExam(incomplete);
      expect(incompleteView.efw.status).toBe("UNAVAILABLE_INCOMPLETE_INPUT");

      const complete = await updateExamDraft(ownerA, {
        ...blankDraft(created.id),
        biparietalDiameterMm: 80,
        headCircumferenceMm: 280,
        abdominalCircumferenceMm: 260,
        femurLengthMm: 60,
        examDate: clinicalExamDate,
      });
      const withoutGa = deriveFromExam(complete);
      expect(complete.examDate).toEqual(clinicalExamDate);
      expect(utcCivilDate(complete.createdAt)).toBe("2026-04-02");
      expect(utcCivilDate(complete.examDate as Date)).toBe("2026-03-20");
      expect(withoutGa.efw.status).toBe("OK");
      expect(withoutGa.efwPercentile.status).toBe("UNAVAILABLE_GA");
      expect(withoutGa.acPercentile.status).toBe("UNAVAILABLE_GA");
      expect(complete.fetuses[0]).not.toHaveProperty("estimatedFetalWeightGrams");

      await prisma.pregnancyEpisode.update({
        where: { id: episode.id },
        data: {
          datingUltrasoundDate: new Date("2026-03-01T00:00:00.000Z"),
          datingUltrasoundGaWeeks: 20,
          datingUltrasoundGaDays: 3,
        },
      });
      const dated = await getExamDraft(created.id, ownerA);
      const withGa = deriveFromExam(dated);
      expect(utcCivilDate(dated.examDate as Date)).toBe("2026-03-20");
      expect(utcCivilDate(dated.createdAt)).not.toBe(utcCivilDate(dated.examDate as Date));
      expect(withGa.gestationalAge).toEqual({
        status: "OK",
        totalDays: 162,
        weeks: 23,
        days: 1,
      });
      expect(withGa.efw.status).toBe("OK");
      expect(withGa.efwPercentile.status).not.toBe("UNAVAILABLE_GA");
      expect(withGa.acPercentile.status).toBe("OK");

      const edited = await updateExamDraft(ownerA, {
        ...blankDraft(created.id),
        biparietalDiameterMm: 85,
        headCircumferenceMm: 280,
        abdominalCircumferenceMm: 260,
        femurLengthMm: 60,
        examDate: clinicalExamDate,
      });
      const editedView = deriveFromExam(edited);
      expect(editedView.efw.status).toBe("OK");
      expect(withGa.efw.status).toBe("OK");
      if (editedView.efw.status === "OK" && withGa.efw.status === "OK") {
        expect(editedView.efw.rawWeightGrams).not.toBe(withGa.efw.rawWeightGrams);
      }

      const reopened = await getExamDraft(created.id, ownerA);
      const reopenedView = deriveFromExam(reopened);
      expect(utcCivilDate(reopened.examDate as Date)).toBe("2026-03-20");
      expect(reopenedView.gestationalAge).toEqual(withGa.gestationalAge);
      expect(reopenedView.efw).toEqual(editedView.efw);
      expect(reopenedView.efwPercentile).toEqual(editedView.efwPercentile);

      const cleared = await updateExamDraft(ownerA, {
        ...blankDraft(created.id),
        biparietalDiameterMm: 85,
        headCircumferenceMm: 280,
        abdominalCircumferenceMm: 260,
        femurLengthMm: null,
        examDate: clinicalExamDate,
      });
      expect(deriveFromExam(cleared).efw.status).toBe("UNAVAILABLE_INCOMPLETE_INPUT");

      const legacy = await createObstetricDopplerDraft(ownerA, patient.id, episode.id);
      const openedLegacy = await getExamDraft(legacy.id, ownerA);
      expect(openedLegacy.examDate).toBeNull();
      const legacyBiometry = await updateExamDraft(ownerA, {
        ...blankDraft(legacy.id),
        biparietalDiameterMm: 80,
        headCircumferenceMm: 280,
        abdominalCircumferenceMm: 260,
        femurLengthMm: 60,
        examDate: null,
      });
      const legacyView = deriveFromExam(legacyBiometry);
      expect(legacyView.efw.status).toBe("OK");
      expect(legacyView.efwPercentile.status).toBe("UNAVAILABLE_MISSING_EXAM_DATE");
      expect(legacyView.acPercentile.status).toBe("UNAVAILABLE_MISSING_EXAM_DATE");

      const legacyDated = await updateExamDraft(ownerA, {
        ...blankDraft(legacy.id),
        biparietalDiameterMm: 80,
        headCircumferenceMm: 280,
        abdominalCircumferenceMm: 260,
        femurLengthMm: 60,
        examDate: clinicalExamDate,
      });
      const legacyDatedView = deriveFromExam(legacyDated);
      expect(utcCivilDate(legacyDated.examDate as Date)).toBe("2026-03-20");
      expect(utcCivilDate(legacyDated.createdAt)).not.toBe("2026-03-20");
      expect(legacyDatedView.gestationalAge).toEqual(withGa.gestationalAge);
      expect(legacyDatedView.efwPercentile.status).toBe("ABOVE_P97");
      expect(legacyDatedView.efwPercentile.display).toBe(">P97");
      expect(legacyDatedView.acPercentile.status).toBe("OK");

      await expect(getExamDraft(created.id, ownerB)).rejects.toBeInstanceOf(
        ClinicalAccessError,
      );
    },
  );
});

function deriveFromExam(
  exam: Awaited<ReturnType<typeof getExamDraft>>,
) {
  const fetus = exam.fetuses[0];
  return deriveBiometryGrowth({
    biparietalDiameterMm: fetus?.biparietalDiameterMm ?? null,
    headCircumferenceMm: fetus?.headCircumferenceMm ?? null,
    abdominalCircumferenceMm: fetus?.abdominalCircumferenceMm ?? null,
    femurLengthMm: fetus?.femurLengthMm ?? null,
    datingUltrasoundDate: exam.pregnancyEpisode.datingUltrasoundDate
      ? utcCivilDate(exam.pregnancyEpisode.datingUltrasoundDate)
      : null,
    datingUltrasoundGaWeeks: exam.pregnancyEpisode.datingUltrasoundGaWeeks,
    datingUltrasoundGaDays: exam.pregnancyEpisode.datingUltrasoundGaDays,
    examDate: exam.examDate ? utcCivilDate(exam.examDate) : null,
  });
}

function blankDraft(examId: string): UpdateExamDraftInput {
  return {
    examId,
    comorbidities: null,
    continuousMedications: null,
    lie: null,
    presentation: null,
    spineSide: null,
    cephalicPoleSide: null,
    heartRateBpm: null,
    bodyMovementsPresent: null,
    swallowingPresent: null,
    biparietalDiameterMm: null,
    headCircumferenceMm: null,
    abdominalCircumferenceMm: null,
    femurLengthMm: null,
    umbilicalArteryPi: null,
    middleCerebralArteryPi: null,
    ductusVenosusAssessed: false,
    ductusVenosusPi: null,
    uterineArteryRightPi: null,
    uterineArteryLeftPi: null,
    uterineArteryRightNotch: null,
    uterineArteryLeftNotch: null,
    placentaLocation: null,
    placentaGrade: null,
    amnioticMethod: null,
    amnioticValue: null,
    transducersUsed: [],
    examDate: null,
  };
}
