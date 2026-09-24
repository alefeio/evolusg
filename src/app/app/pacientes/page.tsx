import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { listPatientsForOwner } from "@/lib/clinical/patient-service";
import { Button, Card, PageHeader } from "@/components/ui";

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await requireSession();
  const { q } = await searchParams;
  const patients = await listPatientsForOwner(session.user.id, q);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          description="Cadastro mínimo para iniciar exames fictícios."
          title="Pacientes"
        />
        <Link href="/app/pacientes/novo">
          <Button type="button">Nova paciente</Button>
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          className="min-h-11 flex-1 rounded-[var(--radius-control)] border border-border bg-surface px-3.5 text-sm"
          defaultValue={q ?? ""}
          name="q"
          placeholder="Buscar por nome"
        />
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      <div className="space-y-3">
        {patients.length === 0 ? (
          <Card>
            <p className="text-sm text-text-secondary">
              Nenhuma paciente encontrada. Crie uma com dados fictícios.
            </p>
          </Card>
        ) : (
          patients.map((patient) => (
            <Link
              className="block rounded-[var(--radius-card)] border border-border bg-surface px-4 py-4 transition-colors hover:bg-surface-soft"
              href={`/app/pacientes/${patient.id}`}
              key={patient.id}
            >
              <p className="font-semibold text-text-primary">{patient.fullName}</p>
              <p className="mt-1 text-xs text-text-secondary">
                Atualizada em{" "}
                {patient.updatedAt.toLocaleString("pt-BR", {
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
