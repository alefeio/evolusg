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
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Identidade</p>
        <h1 className="mt-2 font-serif text-4xl text-stone-900">Conta</h1>
        <p className="mt-3 text-stone-600">
          Dados de acesso à plataforma. Dados profissionais não fazem parte desta etapa.
        </p>
      </div>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-medium text-stone-900">Nome</h2>
        <p className="mb-4 mt-1 text-sm text-stone-600">Nome básico da conta, não o perfil médico.</p>
        <UpdateNameForm currentName={session.user.name} />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-medium text-stone-900">E-mail</h2>
        <p className="mb-4 mt-1 text-sm text-stone-600">
          Atual: {session.user.email}. A troca exige confirmação e não substitui o endereço sem verificação.
        </p>
        <UpdateEmailForm currentEmail={session.user.email} />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-medium text-stone-900">Senha</h2>
        <p className="mb-4 mt-1 text-sm text-stone-600">
          Ao alterar a senha, as demais sessões são encerradas.
        </p>
        <UpdatePasswordForm />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-medium text-stone-900">Sessões</h2>
        <p className="mb-4 mt-1 text-sm text-stone-600">
          Sessão atual e opção de encerrar outros dispositivos.
        </p>
        <SessionsPanel currentToken={session.session.token} sessions={sessions} />
      </section>
    </div>
  );
}
