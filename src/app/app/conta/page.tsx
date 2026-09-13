import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import {
  UpdateEmailForm,
  UpdateNameForm,
  UpdatePasswordForm,
} from "@/components/forms/account-forms";
import { SessionsPanel } from "@/components/forms/sessions-panel";
import { Card, PageHeader } from "@/components/ui";

export default async function AccountPage() {
  const session = await requireSession();
  const requestHeaders = await headers();
  const sessions = await auth.api.listSessions({
    headers: requestHeaders,
  });
  const verified = Boolean(session.user.emailVerified);

  return (
    <div className="space-y-8">
      <PageHeader
        description="Dados de acesso à plataforma. Dados profissionais não fazem parte desta etapa."
        eyebrow="Identidade"
        title="Conta"
      />

      <section aria-labelledby="identity-heading" className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary" id="identity-heading">
          Identidade
        </h2>
        <Card>
          <h3 className="text-base font-semibold text-text-primary">Nome</h3>
          <p className="mb-4 mt-1 text-sm text-text-secondary">
            Nome básico da conta, não o perfil médico.
          </p>
          <UpdateNameForm currentName={session.user.name} />
        </Card>
        <Card>
          <h3 className="text-base font-semibold text-text-primary">E-mail</h3>
          <p className="mb-2 mt-1 text-sm text-text-secondary">
            Atual: <span className="break-all font-medium text-text-primary">{session.user.email}</span>
          </p>
          <p className="mb-4 text-sm text-text-secondary">
            Status: {verified ? "verificado" : "não verificado"}. A troca exige confirmação e não
            substitui o endereço sem verificação.
          </p>
          <UpdateEmailForm currentEmail={session.user.email} />
        </Card>
      </section>

      <section aria-labelledby="security-heading" className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary" id="security-heading">
          Segurança
        </h2>
        <Card>
          <h3 className="text-base font-semibold text-text-primary">Senha</h3>
          <p className="mb-4 mt-1 text-sm text-text-secondary">
            Ao alterar a senha, as demais sessões são encerradas.
          </p>
          <UpdatePasswordForm />
        </Card>
      </section>

      <section aria-labelledby="sessions-heading" className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary" id="sessions-heading">
          Sessões
        </h2>
        <Card>
          <h3 className="text-base font-semibold text-text-primary">Dispositivos</h3>
          <p className="mb-4 mt-1 text-sm text-text-secondary">
            Sessão atual e opção de encerrar outros dispositivos.
          </p>
          <SessionsPanel currentToken={session.session.token} sessions={sessions} />
        </Card>
      </section>
    </div>
  );
}
