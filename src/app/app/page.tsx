import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { Button, Card, PageHeader } from "@/components/ui";

export default async function AppHomePage() {
  const session = await requireSession();
  const verified = Boolean(session.user.emailVerified);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Esta área existe para identidade e acesso. Os módulos clínicos serão disponibilizados posteriormente."
        eyebrow="Área autenticada"
        title={`Olá, ${session.user.name}`}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-text-primary">Estado da conta</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-text-secondary">E-mail</dt>
              <dd className="mt-0.5 break-all font-medium text-text-primary">{session.user.email}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Verificação</dt>
              <dd className="mt-0.5 font-medium text-text-primary">
                {verified ? "E-mail verificado" : "E-mail ainda não verificado"}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-text-primary">Ambiente em preparação</h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Pacientes, exames, laudos e protocolos ainda não fazem parte desta fundação. Enquanto
            isso, você pode revisar os dados de acesso na conta.
          </p>
          <div className="mt-5">
            <Link href="/app/conta">
              <Button type="button" variant="secondary">
                Abrir configurações da conta
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
