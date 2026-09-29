import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getExamDraft } from "@/lib/clinical/exam-service";
import { ExamDraftForm } from "@/components/clinical/exam-draft-form";
import { Card, PageHeader } from "@/components/ui";

function dateOnly(value: Date | null) {
  return value ? value.toISOString().slice(0, 10) : null;
}

export default async function ExamDraftPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const session = await requireSession();
  const { examId } = await params;

  let exam;
  try {
    exam = await getExamDraft(examId, session.user.id);
  } catch {
    notFound();
  }

  const fetus = exam.fetuses[0];
  if (!fetus) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        description={`${exam.patient.fullName} · rascunho singleton · sem laudo final`}
        title="Obstétrica com Doppler"
      />

      <Card>
        <ExamDraftForm
          values={{
            examId: exam.id,
            comorbidities: exam.comorbidities,
            continuousMedications: exam.continuousMedications,
            placentaLocation: exam.placentaLocation,
            placentaGrade: exam.placentaGrade,
            amnioticMethod: exam.amnioticMethod,
            amnioticValue: exam.amnioticValue,
            uterineArteryRightPi: exam.uterineArteryRightPi,
            uterineArteryLeftPi: exam.uterineArteryLeftPi,
            uterineArteryRightNotch: exam.uterineArteryRightNotch,
            uterineArteryLeftNotch: exam.uterineArteryLeftNotch,
            fetus: {
              lie: fetus.lie,
              presentation: fetus.presentation,
              spineSide: fetus.spineSide,
              cephalicPoleSide: fetus.cephalicPoleSide,
              heartRateBpm: fetus.heartRateBpm,
              bodyMovementsPresent: fetus.bodyMovementsPresent,
              swallowingPresent: fetus.swallowingPresent,
              biparietalDiameterMm: fetus.biparietalDiameterMm,
              headCircumferenceMm: fetus.headCircumferenceMm,
              abdominalCircumferenceMm: fetus.abdominalCircumferenceMm,
              femurLengthMm: fetus.femurLengthMm,
              umbilicalArteryPi: fetus.umbilicalArteryPi,
              middleCerebralArteryPi: fetus.middleCerebralArteryPi,
              ductusVenosusPi: fetus.ductusVenosusPi,
            },
            episode: {
              lmp: dateOnly(exam.pregnancyEpisode.lmp),
              gravidity: exam.pregnancyEpisode.gravidity,
              parity: exam.pregnancyEpisode.parity,
              abortions: exam.pregnancyEpisode.abortions,
              datingUltrasoundDate: dateOnly(
                exam.pregnancyEpisode.datingUltrasoundDate,
              ),
              datingUltrasoundGaWeeks:
                exam.pregnancyEpisode.datingUltrasoundGaWeeks,
              datingUltrasoundGaDays:
                exam.pregnancyEpisode.datingUltrasoundGaDays,
            },
          }}
        />
      </Card>

      <Link
        className="text-sm font-semibold text-brand-blue-700"
        href={`/app/pacientes/${exam.patientId}`}
      >
        Voltar para a paciente
      </Link>
    </div>
  );
}
