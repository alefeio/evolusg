import { prisma } from "@/lib/db/prisma";
import { createId, now } from "@/lib/clinical/ids";
import type { CreatePatientInput } from "@/lib/clinical/schemas";
import { requireOwnedPatient } from "@/lib/clinical/ownership";

export async function listPatientsForOwner(ownerUserId: string, query?: string) {
  const q = query?.trim();
  return prisma.patient.findMany({
    where: {
      ownerUserId,
      ...(q
        ? { fullName: { contains: q, mode: "insensitive" as const } }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createPatient(ownerUserId: string, input: CreatePatientInput) {
  const timestamp = now();
  return prisma.patient.create({
    data: {
      id: createId(),
      ownerUserId,
      fullName: input.fullName,
      birthDate: input.birthDate,
      notes: input.notes,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
}

export async function getPatientForOwner(patientId: string, ownerUserId: string) {
  return requireOwnedPatient(patientId, ownerUserId);
}

export async function getPatientDetail(patientId: string, ownerUserId: string) {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, ownerUserId },
    include: {
      pregnancyEpisodes: { orderBy: { updatedAt: "desc" } },
      exams: {
        orderBy: { updatedAt: "desc" },
        include: { pregnancyEpisode: true },
      },
    },
  });
  if (!patient) {
    return null;
  }
  return patient;
}
