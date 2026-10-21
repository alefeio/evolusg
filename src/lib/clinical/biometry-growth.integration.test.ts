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
      const created = await createObstetricDopplerDraft(
        ownerA,
        patient.id,
        episode.id,
      );
      await prisma.exam.update({
        where: { id: created.id },
        data: { createdAt: new Date("2026-03-15T15:00:00.000Z") },
      });

      const incomplete = await updateExamDraft(ownerA, {
        ...blankDraft(created.id),
        biparietalDiameterMm: 80,
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
      });
      const withoutGa = deriveFromExam(complete);
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
      expect(withGa.gestationalAge).toEqual({
        status: "OK",
        totalDays: 157,
        weeks: 22,
        days: 3,
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
      });
      const editedView = deriveFromExam(edited);
      expect(editedView.efw.status).toBe("OK");
      expect(withGa.efw.status).toBe("OK");
      if (editedView.efw.status === "OK" && withGa.efw.status === "OK") {
        expect(editedView.efw.rawWeightGrams).not.toBe(withGa.efw.rawWeightGrams);
      }

      const cleared = await updateExamDraft(ownerA, {
        ...blankDraft(created.id),
        biparietalDiameterMm: 85,
        headCircumferenceMm: 280,
        abdominalCircumferenceMm: 260,
        femurLengthMm: null,
      });
      expect(deriveFromExam(cleared).efw.status).toBe("UNAVAILABLE_INCOMPLETE_INPUT");

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
    examDate: utcCivilDate(exam.createdAt),
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
  };
}
