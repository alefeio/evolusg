import { requireSession } from "@/lib/auth/session";

export default async function AppHomePage() {
  const session = await requireSession();

  return (
    <section className="max-w-2xl space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Área autenticada</p>
      <h1 className="font-serif text-4xl text-stone-900">Olá, {session.user.name}</h1>
      <p className="text-stone-600">
        Conta: <strong>{session.user.email}</strong>
        {session.user.emailVerified ? "" : " (e-mail ainda não verificado)"}
      </p>
      <p className="leading-7 text-stone-600">
        Os módulos clínicos — pacientes, exames, laudos e protocolos — serão disponibilizados
        posteriormente. Esta área existe apenas para identidade e acesso.
      </p>
    </section>
  );
}
