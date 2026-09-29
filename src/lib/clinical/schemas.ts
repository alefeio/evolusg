import { z } from "zod";
import { normalizePosition } from "@/lib/clinical/position-rules";
import { presenceFromCheckbox } from "@/lib/clinical/presence";

const emptyToNull = (value: unknown) => {
  if (value === "" || value === undefined) {
    return null;
  }
  return value;
};

const optionalTrimmed = z.preprocess(
  emptyToNull,
  z.string().trim().max(2000).nullable(),
);

const optionalDate = z.preprocess(emptyToNull, z.coerce.date().nullable());

const optionalNonNegInt = z.preprocess(
  emptyToNull,
  z.coerce.number().int().min(0).max(40).nullable(),
);

const optionalGaDays = z.preprocess(
  emptyToNull,
  z.coerce.number().int().min(0).max(6).nullable(),
);

const optionalFloat = z.preprocess(
  emptyToNull,
  z.coerce.number().finite().nullable(),
);

const optionalBpm = z.preprocess(
  emptyToNull,
  z.coerce.number().int().min(1).max(300).nullable(),
);

const fetalLie = z.enum(["LONGITUDINAL", "TRANSVERSE"]).nullable();
const fetalPresentation = z.enum(["CEPHALIC", "PELVIC", "CORMIC"]).nullable();
const laterality = z.enum(["RIGHT", "LEFT"]).nullable();
const placentaLocation = z
  .enum(["ANTERIOR", "POSTERIOR", "FUNDAL", "LATERAL"])
  .nullable();
const placentaGrade = z.enum(["I", "II", "III"]).nullable();
const amnioticMethod = z.enum(["MBV", "ILA"]).nullable();

function checkboxPresence(value: unknown): true | null {
  if (value === true || value === "true" || value === "on" || value === "1") {
    return presenceFromCheckbox(true);
  }
  return presenceFromCheckbox(false);
}

export const createPatientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Informe o nome da paciente.")
    .max(120, "O nome é longo demais."),
  birthDate: optionalDate,
  notes: optionalTrimmed,
});

export const createPregnancyEpisodeSchema = z.object({
  patientId: z.string().min(1),
  lmp: optionalDate,
  gravidity: optionalNonNegInt,
  parity: optionalNonNegInt,
  abortions: optionalNonNegInt,
  datingUltrasoundDate: optionalDate,
  datingUltrasoundGaWeeks: optionalNonNegInt,
  datingUltrasoundGaDays: optionalGaDays,
});

export const createExamSchema = z.object({
  patientId: z.string().min(1),
  pregnancyEpisodeId: z.string().min(1),
});

export const updateExamDraftSchema = z
  .object({
    examId: z.string().min(1),
    comorbidities: optionalTrimmed,
    continuousMedications: optionalTrimmed,
    lie: z.preprocess(emptyToNull, fetalLie),
    presentation: z.preprocess(emptyToNull, fetalPresentation),
    spineSide: z.preprocess(emptyToNull, laterality),
    cephalicPoleSide: z.preprocess(emptyToNull, laterality),
    heartRateBpm: optionalBpm,
    bodyMovementsPresent: z.preprocess(checkboxPresence, z.literal(true).nullable()),
    swallowingPresent: z.preprocess(checkboxPresence, z.literal(true).nullable()),
    biparietalDiameterMm: optionalFloat,
    headCircumferenceMm: optionalFloat,
    abdominalCircumferenceMm: optionalFloat,
    femurLengthMm: optionalFloat,
    umbilicalArteryPi: optionalFloat,
    middleCerebralArteryPi: optionalFloat,
    ductusVenosusPi: optionalFloat,
    uterineArteryRightPi: optionalFloat,
    uterineArteryLeftPi: optionalFloat,
    uterineArteryRightNotch: z.preprocess(
      checkboxPresence,
      z.literal(true).nullable(),
    ),
    uterineArteryLeftNotch: z.preprocess(
      checkboxPresence,
      z.literal(true).nullable(),
    ),
    placentaLocation: z.preprocess(emptyToNull, placentaLocation),
    placentaGrade: z.preprocess(emptyToNull, placentaGrade),
    amnioticMethod: z.preprocess(emptyToNull, amnioticMethod),
    amnioticValue: optionalFloat,
  })
  .transform((data) => {
    const position = normalizePosition({
      lie: data.lie,
      presentation: data.presentation,
      spineSide: data.spineSide,
      cephalicPoleSide: data.cephalicPoleSide,
    });

    let amnioticValue = data.amnioticValue;
    if (!data.amnioticMethod) {
      amnioticValue = null;
    }

    return {
      ...data,
      ...position,
      amnioticValue,
    };
  });

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type CreatePregnancyEpisodeInput = z.infer<
  typeof createPregnancyEpisodeSchema
>;
export type UpdateExamDraftInput = z.infer<typeof updateExamDraftSchema>;
