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

const enabled = isSafeMigrationTarget() && Boolean(process.env.DATABASE_URL);
const suffix = randomUUID();

describe.skipIf(!enabled)("Clinical draft ownership + persistence", () => {
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
          email: `owner-a.${suffix}@sprint2-clinical.test`,
          emailVerified: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: ownerB,
          name: `Owner B ${suffix}`,
          email: `owner-b.${suffix}@sprint2-clinical.test`,
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
      where: { email: { endsWith: "@sprint2-clinical.test" } },
    });
    await prisma.$disconnect();
  }, 90_000);

  it(
    "allows owner to create, save and reopen draft; blocks other user",
    { timeout: 90_000 },
    async () => {
      const patient = await createPatient(ownerA, {
        fullName: `Paciente Fictícia ${suffix}`,
        birthDate: null,
        notes: null,
      });

      const episode = await createPregnancyEpisode(ownerA, {
        patientId: patient.id,
        lmp: new Date("2026-01-01"),
        gravidity: 2,
        parity: 1,
        abortions: 0,
        datingUltrasoundDate: new Date("2026-02-01"),
        datingUltrasoundGaWeeks: 8,
        datingUltrasoundGaDays: 2,
      });

      const exam = await createObstetricDopplerDraft(
        ownerA,
        patient.id,
        episode.id,
      );

      expect(exam.status).toBe("DRAFT");
      expect(exam.fetuses).toHaveLength(1);

      const saved = await updateExamDraft(ownerA, {
        examId: exam.id,
        comorbidities: "HAS fictícia",
        continuousMedications: "Ácido fólico",
        lie: "TRANSVERSE",
        presentation: "CEPHALIC",
        spineSide: "RIGHT",
        cephalicPoleSide: "LEFT",
        heartRateBpm: 140,
        bodyMovementsPresent: null,
        swallowingPresent: true,
        biparietalDiameterMm: 50,
        headCircumferenceMm: null,
        abdominalCircumferenceMm: null,
        femurLengthMm: null,
        umbilicalArteryPi: 1.1,
        middleCerebralArteryPi: 1.4,
        ductusVenosusPi: null,
        uterineArteryRightPi: 1.0,
        uterineArteryLeftPi: 1.2,
        uterineArteryRightNotch: true,
        uterineArteryLeftNotch: null,
        placentaLocation: "ANTERIOR",
        placentaGrade: "II",
        amnioticMethod: "MBV",
        amnioticValue: 5,
      });

      expect(saved.comorbidities).toBe("HAS fictícia");
      expect(saved.fetuses[0]?.lie).toBe("TRANSVERSE");
      expect(saved.fetuses[0]?.presentation).toBe("CORMIC");
      expect(saved.fetuses[0]?.spineSide).toBeNull();
      expect(saved.fetuses[0]?.bodyMovementsPresent).toBeNull();
      expect(saved.fetuses[0]?.swallowingPresent).toBe(true);

      const reopened = await getExamDraft(exam.id, ownerA);
      expect(reopened.continuousMedications).toBe("Ácido fólico");
      expect(reopened.uterineArteryRightNotch).toBe(true);

      await expect(getExamDraft(exam.id, ownerB)).rejects.toBeInstanceOf(
        ClinicalAccessError,
      );
    },
  );
});
