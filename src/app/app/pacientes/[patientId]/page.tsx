import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getPatientDetail } from "@/lib/clinical/patient-service";
import { EpisodeCreateForm } from "@/components/clinical/episode-create-form";
import { ExamCreateForm } from "@/components/clinical/exam-create-form";
import { Card, PageHeader } from "@/components/ui";

function episodeLabel(episode: {
  id: string;
  lmp: Date | null;
  datingUltrasoundDate: Date | null;
  createdAt: Date;
}) {
  if (episode.lmp) {
    return `Gestação · DUM ${episode.lmp.toLocaleDateString("pt-BR")}`;
  }
  if (episode.datingUltrasoundDate) {
    return `Gestação · 1ª USG ${episode.datingUltrasoundDate.toLocaleDateString("pt-BR")}`;
  }
  return `Gestação · ${episode.createdAt.toLocaleDateString("pt-BR")}`;
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const session = await requireSession();
  const { patientId } = await params;
  const patient = await getPatientDetail(patientId, session.user.id);

  if (!patient) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader description="Contexto gestacional e exames em rascunho." title={patient.fullName} />

      <Card>
        <h2 className="text-lg font-semibold text-text-primary">
          Novo contexto gestacional
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          PregnancyEpisode mínimo: DUM, G/P/A e datação pela 1ª USG.
        </p>
        <div className="mt-5">
          <EpisodeCreateForm patientId={patient.id} />
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-text-primary">
          Novo exame — Obstétrica com Doppler
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Gestação única (singleton). Abre um rascunho editável.
        </p>
        <div className="mt-5">
          <ExamCreateForm
            episodes={patient.pregnancyEpisodes.map((episode) => ({
              id: episode.id,
              label: episodeLabel(episode),
            }))}
            patientId={patient.id}
          />
        </div>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-primary">Rascunhos</h2>
        {patient.exams.length === 0 ? (
          <p className="text-sm text-text-secondary">Nenhum exame ainda.</p>
        ) : (
          patient.exams.map((exam) => (
            <Link
              className="block rounded-[var(--radius-card)] border border-border bg-surface px-4 py-4 hover:bg-surface-soft"
              href={`/app/exames/${exam.id}`}
              key={exam.id}
            >
              <p className="font-semibold text-text-primary">
                Obstétrica com Doppler · {exam.status}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                Atualizado em{" "}
                {exam.updatedAt.toLocaleString("pt-BR", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
            </Link>
          ))
        )}
      </section>

      <Link className="text-sm font-semibold text-brand-blue-700" href="/app/pacientes">
        Voltar para pacientes
      </Link>
    </div>
  );
}
