import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { Button, Card, PageHeader } from "@/components/ui";

export default async function AppHomePage() {
  const session = await requireSession();
  const verified = Boolean(session.user.emailVerified);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Bem-vindo ao evolUSG."
        title={`Olá, ${session.user.name}`}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-text-primary">Sua conta</h2>
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
          <h2 className="text-lg font-semibold text-text-primary">Minha conta</h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Atualize seus dados de acesso, senha e sessões quando precisar.
          </p>
          <div className="mt-5">
            <Link href="/app/conta">
              <Button type="button" variant="secondary">
                Minha conta
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
