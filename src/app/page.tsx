import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect("/app");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">evolUSG</p>
      <h1 className="mt-4 font-serif text-5xl leading-tight text-stone-900">Identidade da plataforma</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-stone-600">
        Esta sprint constrói apenas o acesso à conta: cadastro controlado, verificação de e-mail,
        sessão e configurações básicas. Os módulos clínicos serão disponibilizados posteriormente.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/entrar">
          <Button type="button">Entrar</Button>
        </Link>
        <Link href="/cadastro">
          <Button type="button" variant="secondary">
            Criar conta
          </Button>
        </Link>
      </div>
    </main>
  );
}
