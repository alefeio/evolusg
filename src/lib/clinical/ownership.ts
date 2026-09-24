import { prisma } from "@/lib/db/prisma";

export class ClinicalAccessError extends Error {
  constructor(message = "Acesso não autorizado a este registro clínico.") {
    super(message);
    this.name = "ClinicalAccessError";
  }
}

export async function requireOwnedPatient(patientId: string, ownerUserId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, ownerUserId },
  });
  if (!patient) {
    throw new ClinicalAccessError();
  }
  return patient;
}

export async function requireOwnedEpisode(episodeId: string, ownerUserId: string) {
  const episode = await prisma.pregnancyEpisode.findFirst({
    where: { id: episodeId, ownerUserId },
  });
  if (!episode) {
    throw new ClinicalAccessError();
  }
  return episode;
}

export async function requireOwnedExam(examId: string, ownerUserId: string) {
  const exam = await prisma.exam.findFirst({
    where: { id: examId, ownerUserId },
    include: {
      patient: true,
      pregnancyEpisode: true,
      fetuses: { orderBy: { ordinal: "asc" } },
    },
  });
  if (!exam) {
    throw new ClinicalAccessError();
  }
  return exam;
}
