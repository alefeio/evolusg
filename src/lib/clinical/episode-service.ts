import { prisma } from "@/lib/db/prisma";
import { createId, now } from "@/lib/clinical/ids";
import { requireOwnedPatient } from "@/lib/clinical/ownership";
import type { CreatePregnancyEpisodeInput } from "@/lib/clinical/schemas";

export async function createPregnancyEpisode(
  ownerUserId: string,
  input: CreatePregnancyEpisodeInput,
) {
  await requireOwnedPatient(input.patientId, ownerUserId);
  const timestamp = now();

  return prisma.pregnancyEpisode.create({
    data: {
      id: createId(),
      ownerUserId,
      patientId: input.patientId,
      lmp: input.lmp,
      gravidity: input.gravidity,
      parity: input.parity,
      abortions: input.abortions,
      datingUltrasoundDate: input.datingUltrasoundDate,
      datingUltrasoundGaWeeks: input.datingUltrasoundGaWeeks,
      datingUltrasoundGaDays: input.datingUltrasoundGaDays,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });
}

export async function listEpisodesForPatient(
  patientId: string,
  ownerUserId: string,
) {
  await requireOwnedPatient(patientId, ownerUserId);
  return prisma.pregnancyEpisode.findMany({
    where: { patientId, ownerUserId },
    orderBy: { updatedAt: "desc" },
  });
}
