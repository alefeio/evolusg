"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { createPatient } from "@/lib/clinical/patient-service";
import { createPregnancyEpisode } from "@/lib/clinical/episode-service";
import {
  createObstetricDopplerDraft,
  updateExamDraft,
} from "@/lib/clinical/exam-service";
import { ClinicalAccessError } from "@/lib/clinical/ownership";
import {
  createExamSchema,
  createPatientSchema,
  createPregnancyEpisodeSchema,
  updateExamDraftSchema,
} from "@/lib/clinical/schemas";

export type ActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function formDataToObject(formData: FormData): Record<string, unknown> {
  const entries: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      entries[key] = value;
    }
  }
  // Explicit checkboxes: absent means unchecked
  for (const name of [
    "bodyMovementsPresent",
    "swallowingPresent",
    "uterineArteryRightNotch",
    "uterineArteryLeftNotch",
  ]) {
    if (!(name in entries)) {
      entries[name] = false;
    }
  }
  return entries;
}

export async function createPatientAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = createPatientSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revise os campos da paciente.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const patient = await createPatient(session.user.id, parsed.data);
  redirect(`/app/pacientes/${patient.id}`);
}

export async function createEpisodeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = createPregnancyEpisodeSchema.safeParse(
    formDataToObject(formData),
  );
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revise o contexto gestacional.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await createPregnancyEpisode(session.user.id, parsed.data);
  } catch (error) {
    if (error instanceof ClinicalAccessError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }

  redirect(`/app/pacientes/${parsed.data.patientId}`);
}

export async function createExamAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = createExamSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { ok: false, error: "Selecione paciente e gestação." };
  }

  try {
    const exam = await createObstetricDopplerDraft(
      session.user.id,
      parsed.data.patientId,
      parsed.data.pregnancyEpisodeId,
    );
    redirect(`/app/exames/${exam.id}`);
  } catch (error) {
    if (error instanceof ClinicalAccessError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}

export async function saveExamDraftAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const parsed = updateExamDraftSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Não foi possível salvar. Revise os campos.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await updateExamDraft(session.user.id, parsed.data);
    return { ok: true };
  } catch (error) {
    if (error instanceof ClinicalAccessError) {
      return { ok: false, error: error.message };
    }
    throw error;
  }
}
