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
import { ductusBlockIncluded, DuctusAssessmentError } from "@/lib/clinical/ductus-assessment";
import type { UpdateExamDraftInput } from "@/lib/clinical/schemas";

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
        ductusVenosusAssessed: false,
        ductusVenosusPi: null,
        uterineArteryRightPi: 1.0,
        uterineArteryLeftPi: 1.2,
        uterineArteryRightNotch: true,
        uterineArteryLeftNotch: null,
        placentaLocation: "ANTERIOR",
        placentaGrade: "II",
        amnioticMethod: "MBV",
        amnioticValue: 5,
        transducersUsed: [],
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
      expect(reopened.transducersUsed).toEqual([]);

      const refined = await updateExamDraft(ownerA, {
        examId: exam.id,
        comorbidities: "HAS fictícia",
        continuousMedications: "Ácido fólico",
        lie: "LONGITUDINAL",
        presentation: "CEPHALIC",
        spineSide: "VARIABLE",
        cephalicPoleSide: null,
        heartRateBpm: 140,
        bodyMovementsPresent: null,
        swallowingPresent: true,
        biparietalDiameterMm: 50,
        headCircumferenceMm: null,
        abdominalCircumferenceMm: null,
        femurLengthMm: null,
        umbilicalArteryPi: 1.1,
        middleCerebralArteryPi: 1.4,
        ductusVenosusAssessed: false,
        ductusVenosusPi: null,
        uterineArteryRightPi: 1.0,
        uterineArteryLeftPi: 1.2,
        uterineArteryRightNotch: true,
        uterineArteryLeftNotch: null,
        placentaLocation: "ANTERIOR",
        placentaGrade: "GRADE_0",
        amnioticMethod: "MBV",
        amnioticValue: 5,
        transducersUsed: ["CONVEX_MULTIFREQUENCY", "ENDOCAVITARY"],
      });

      expect(refined.transducersUsed).toEqual([
        "CONVEX_MULTIFREQUENCY",
        "ENDOCAVITARY",
      ]);
      expect(refined.placentaGrade).toBe("GRADE_0");
      expect(refined.fetuses[0]?.lie).toBe("LONGITUDINAL");
      expect(refined.fetuses[0]?.spineSide).toBe("VARIABLE");

      const edited = await updateExamDraft(ownerA, {
        ...{
          examId: exam.id,
          comorbidities: "HAS fictícia",
          continuousMedications: "Ácido fólico",
          lie: "LONGITUDINAL" as const,
          presentation: "CEPHALIC" as const,
          spineSide: "LEFT" as const,
          cephalicPoleSide: null,
          heartRateBpm: 140,
          bodyMovementsPresent: null,
          swallowingPresent: true,
          biparietalDiameterMm: 50,
          headCircumferenceMm: null,
          abdominalCircumferenceMm: null,
          femurLengthMm: null,
          umbilicalArteryPi: 1.1,
          middleCerebralArteryPi: 1.4,
          ductusVenosusAssessed: false,
        ductusVenosusPi: null,
          uterineArteryRightPi: 1.0,
          uterineArteryLeftPi: 1.2,
          uterineArteryRightNotch: true,
          uterineArteryLeftNotch: null,
          placentaLocation: "ANTERIOR" as const,
          placentaGrade: "GRADE_0" as const,
          amnioticMethod: "MBV" as const,
          amnioticValue: 5,
          transducersUsed: ["ENDOCAVITARY"] as const,
        },
      });
      const reopenedAgain = await getExamDraft(exam.id, ownerA);
      expect(edited.transducersUsed).toEqual(["ENDOCAVITARY"]);
      expect(reopenedAgain.transducersUsed).toEqual(["ENDOCAVITARY"]);
      expect(reopenedAgain.placentaGrade).toBe("GRADE_0");
      expect(reopenedAgain.fetuses[0]?.spineSide).toBe("LEFT");

      await expect(getExamDraft(exam.id, ownerB)).rejects.toBeInstanceOf(
        ClinicalAccessError,
      );
    },
  );

  it(
    "keeps ductus inclusion separate from the stored IP",
    { timeout: 90_000 },
    async () => {
      const patient = await createPatient(ownerA, {
        fullName: `DV Fictícia ${suffix}`,
        birthDate: null,
        notes: null,
      });
      const episode = await createPregnancyEpisode(ownerA, {
        patientId: patient.id,
        lmp: null,
        gravidity: null,
        parity: null,
        abortions: null,
        datingUltrasoundDate: null,
        datingUltrasoundGaWeeks: null,
        datingUltrasoundGaDays: null,
      });
      const exam = await createObstetricDopplerDraft(ownerA, patient.id, episode.id);

      const excluded = await updateExamDraft(ownerA, {
        examId: exam.id,
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
      });
      expect(excluded.fetuses[0]?.ductusVenosusAssessed).toBe(false);
      expect(
        ductusBlockIncluded(
          excluded.fetuses[0]?.ductusVenosusAssessed,
          excluded.fetuses[0]?.ductusVenosusPi,
        ),
      ).toBe(false);

      await expect(
        updateExamDraft(ownerA, {
          ...excludedFields(exam.id),
          ductusVenosusAssessed: true,
          ductusVenosusPi: null,
        }),
      ).rejects.toBeInstanceOf(DuctusAssessmentError);

      const included = await updateExamDraft(ownerA, {
        ...excludedFields(exam.id),
        ductusVenosusAssessed: true,
        ductusVenosusPi: 0.41,
      });
      expect(included.fetuses[0]?.ductusVenosusPi).toBeCloseTo(0.41);

      const unchecked = await updateExamDraft(ownerA, {
        ...excludedFields(exam.id),
        ductusVenosusAssessed: false,
        ductusVenosusPi: 0.41,
      });
      expect(unchecked.fetuses[0]?.ductusVenosusAssessed).toBe(false);
      expect(unchecked.fetuses[0]?.ductusVenosusPi).toBeCloseTo(0.41);
      expect(
        ductusBlockIncluded(false, unchecked.fetuses[0]?.ductusVenosusPi),
      ).toBe(false);

      await prisma.fetus.update({
        where: { id: unchecked.fetuses[0]!.id },
        data: { ductusVenosusAssessed: null, ductusVenosusPi: 0.55 },
      });
      const legacy = await getExamDraft(exam.id, ownerA);
      expect(legacy.fetuses[0]?.ductusVenosusAssessed).toBeNull();
      expect(
        ductusBlockIncluded(null, legacy.fetuses[0]?.ductusVenosusPi),
      ).toBe(true);

      await prisma.fetus.update({
        where: { id: unchecked.fetuses[0]!.id },
        data: { ductusVenosusAssessed: null, ductusVenosusPi: null },
      });
      const emptyLegacy = await getExamDraft(exam.id, ownerA);
      expect(
        ductusBlockIncluded(
          emptyLegacy.fetuses[0]?.ductusVenosusAssessed,
          emptyLegacy.fetuses[0]?.ductusVenosusPi,
        ),
      ).toBe(false);

      await prisma.fetus.update({
        where: { id: unchecked.fetuses[0]!.id },
        data: { ductusVenosusAssessed: true, ductusVenosusPi: null },
      });
      const openedLegacy = await getExamDraft(exam.id, ownerA);
      expect(openedLegacy.fetuses[0]?.ductusVenosusAssessed).toBe(true);
      expect(openedLegacy.fetuses[0]?.ductusVenosusPi).toBeNull();
      await expect(
        updateExamDraft(ownerA, {
          ...excludedFields(exam.id),
          ductusVenosusAssessed: true,
          ductusVenosusPi: null,
        }),
      ).rejects.toBeInstanceOf(DuctusAssessmentError);

      const repaired = await updateExamDraft(ownerA, {
        ...excludedFields(exam.id),
        ductusVenosusAssessed: true,
        ductusVenosusPi: 0.33,
      });
      expect(repaired.fetuses[0]?.ductusVenosusPi).toBeCloseTo(0.33);

      await prisma.fetus.update({
        where: { id: unchecked.fetuses[0]!.id },
        data: { ductusVenosusAssessed: true, ductusVenosusPi: null },
      });
      const cleared = await updateExamDraft(ownerA, {
        ...excludedFields(exam.id),
        ductusVenosusAssessed: false,
        ductusVenosusPi: null,
      });
      expect(cleared.fetuses[0]?.ductusVenosusAssessed).toBe(false);
    },
  );
});

function excludedFields(examId: string): UpdateExamDraftInput {
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
