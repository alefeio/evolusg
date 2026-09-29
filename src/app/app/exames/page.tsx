import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { listDraftExamsForOwner } from "@/lib/clinical/exam-service";
import { Card, PageHeader } from "@/components/ui";

export default async function ExamsPage() {
  const session = await requireSession();
  const exams = await listDraftExamsForOwner(session.user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Rascunhos de Obstétrica com Doppler. Sem emissão de laudo nesta Sprint."
        title="Exames"
      />

      <div className="space-y-3">
        {exams.length === 0 ? (
          <Card>
            <p className="text-sm text-text-secondary">
              Nenhum rascunho. Abra uma paciente e crie um exame.
            </p>
            <Link
              className="mt-4 inline-block text-sm font-semibold text-brand-blue-700"
              href="/app/pacientes"
            >
              Ir para pacientes
            </Link>
          </Card>
        ) : (
          exams.map((exam) => (
            <Link
              className="block rounded-[var(--radius-card)] border border-border bg-surface px-4 py-4 hover:bg-surface-soft"
              href={`/app/exames/${exam.id}`}
              key={exam.id}
            >
              <p className="font-semibold text-text-primary">
                {exam.patient.fullName}
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                Obstétrica com Doppler · rascunho
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
      </div>
    </div>
  );
}
