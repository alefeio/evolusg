import { prisma } from "@/lib/db/prisma";
import { createId, now } from "@/lib/clinical/ids";
import {
  ClinicalAccessError,
  requireOwnedEpisode,
  requireOwnedExam,
  requireOwnedPatient,
} from "@/lib/clinical/ownership";
import { normalizePosition } from "@/lib/clinical/position-rules";
import type { UpdateExamDraftInput } from "@/lib/clinical/schemas";
import type { FetalLie, FetalPresentation, Laterality } from "@/lib/clinical/position-rules";

export async function listDraftExamsForOwner(ownerUserId: string) {
  return prisma.exam.findMany({
    where: { ownerUserId, status: "DRAFT" },
    orderBy: { updatedAt: "desc" },
    include: {
      patient: true,
      pregnancyEpisode: true,
    },
  });
}

export async function createObstetricDopplerDraft(
  ownerUserId: string,
  patientId: string,
  pregnancyEpisodeId: string,
) {
  const patient = await requireOwnedPatient(patientId, ownerUserId);
  const episode = await requireOwnedEpisode(pregnancyEpisodeId, ownerUserId);

  if (episode.patientId !== patient.id) {
    throw new ClinicalAccessError(
      "A gestação selecionada não pertence a esta paciente.",
    );
  }

  const timestamp = now();
  const examId = createId();

  return prisma.$transaction(async (tx) => {
    const exam = await tx.exam.create({
      data: {
        id: examId,
        ownerUserId,
        patientId,
        pregnancyEpisodeId,
        protocol: "OBSTETRIC_DOPPLER",
        status: "DRAFT",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    await tx.fetus.create({
      data: {
        id: createId(),
        examId: exam.id,
        ordinal: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    });

    return tx.exam.findUniqueOrThrow({
      where: { id: exam.id },
      include: {
        patient: true,
        pregnancyEpisode: true,
        fetuses: { orderBy: { ordinal: "asc" } },
      },
    });
  });
}

export async function getExamDraft(examId: string, ownerUserId: string) {
  return requireOwnedExam(examId, ownerUserId);
}

export async function updateExamDraft(
  ownerUserId: string,
  input: UpdateExamDraftInput,
) {
  const exam = await requireOwnedExam(input.examId, ownerUserId);
  const fetus = exam.fetuses[0];
  if (!fetus) {
    throw new Error("Exame singleton sem feto — estado inconsistente.");
  }

  const position = normalizePosition({
    lie: (input.lie as FetalLie | null) ?? null,
    presentation: (input.presentation as FetalPresentation | null) ?? null,
    spineSide: (input.spineSide as Laterality | null) ?? null,
    cephalicPoleSide: (input.cephalicPoleSide as Laterality | null) ?? null,
  });

  const amnioticValue = input.amnioticMethod ? input.amnioticValue : null;
  const timestamp = now();

  await prisma.$transaction([
    prisma.exam.update({
      where: { id: exam.id },
      data: {
        comorbidities: input.comorbidities,
        continuousMedications: input.continuousMedications,
        placentaLocation: input.placentaLocation,
        placentaGrade: input.placentaGrade,
        amnioticMethod: input.amnioticMethod,
        amnioticValue,
        uterineArteryRightPi: input.uterineArteryRightPi,
        uterineArteryLeftPi: input.uterineArteryLeftPi,
        uterineArteryRightNotch: input.uterineArteryRightNotch,
        uterineArteryLeftNotch: input.uterineArteryLeftNotch,
        updatedAt: timestamp,
      },
    }),
    prisma.fetus.update({
      where: { id: fetus.id },
      data: {
        lie: position.lie,
        presentation: position.presentation,
        spineSide: position.spineSide,
        cephalicPoleSide: position.cephalicPoleSide,
        heartRateBpm: input.heartRateBpm,
        bodyMovementsPresent: input.bodyMovementsPresent,
        swallowingPresent: input.swallowingPresent,
        biparietalDiameterMm: input.biparietalDiameterMm,
        headCircumferenceMm: input.headCircumferenceMm,
        abdominalCircumferenceMm: input.abdominalCircumferenceMm,
        femurLengthMm: input.femurLengthMm,
        umbilicalArteryPi: input.umbilicalArteryPi,
        middleCerebralArteryPi: input.middleCerebralArteryPi,
        ductusVenosusPi: input.ductusVenosusPi,
        updatedAt: timestamp,
      },
    }),
  ]);

  return requireOwnedExam(exam.id, ownerUserId);
}
