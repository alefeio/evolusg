import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { requireSession } from "@/lib/auth/session";
import {
  UpdateEmailForm,
  UpdateNameForm,
  UpdatePasswordForm,
} from "@/components/forms/account-forms";
import { SessionsPanel } from "@/components/forms/sessions-panel";

export default async function AccountPage() {
  const session = await requireSession();
  const requestHeaders = await headers();
  const sessions = await auth.api.listSessions({
    headers: requestHeaders,
  });

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-blue">Identidade</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-brand-ink">Conta</h1>
        <p className="mt-3 text-brand-muted">
          Dados de acesso à plataforma. Dados profissionais não fazem parte desta etapa.
        </p>
      </div>

      <section className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="text-lg font-medium text-brand-ink">Nome</h2>
        <p className="mb-4 mt-1 text-sm text-brand-muted">Nome básico da conta, não o perfil médico.</p>
        <UpdateNameForm currentName={session.user.name} />
      </section>

      <section className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="text-lg font-medium text-brand-ink">E-mail</h2>
        <p className="mb-4 mt-1 text-sm text-brand-muted">
          Atual: {session.user.email}. A troca exige confirmação e não substitui o endereço sem verificação.
        </p>
        <UpdateEmailForm currentEmail={session.user.email} />
      </section>

      <section className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="text-lg font-medium text-brand-ink">Senha</h2>
        <p className="mb-4 mt-1 text-sm text-brand-muted">
          Ao alterar a senha, as demais sessões são encerradas.
        </p>
        <UpdatePasswordForm />
      </section>

      <section className="rounded-2xl border border-brand-line bg-white p-6">
        <h2 className="text-lg font-medium text-brand-ink">Sessões</h2>
        <p className="mb-4 mt-1 text-sm text-brand-muted">
          Sessão atual e opção de encerrar outros dispositivos.
        </p>
        <SessionsPanel currentToken={session.session.token} sessions={sessions} />
      </section>
    </div>
  );
}
