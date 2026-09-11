import { requireSession } from "@/lib/auth/session";

export default async function AppHomePage() {
  const session = await requireSession();

  return (
    <section className="max-w-2xl space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-blue">Área autenticada</p>
      <h1 className="text-4xl font-semibold tracking-tight text-brand-ink">Olá, {session.user.name}</h1>
      <p className="text-brand-muted">
        Conta: <strong className="text-brand-ink">{session.user.email}</strong>
        {session.user.emailVerified ? "" : " (e-mail ainda não verificado)"}
      </p>
      <p className="leading-7 text-brand-muted">
        Os módulos clínicos — pacientes, exames, laudos e protocolos — serão disponibilizados
        posteriormente. Esta área existe apenas para identidade e acesso.
      </p>
    </section>
  );
}
