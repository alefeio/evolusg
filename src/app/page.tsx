import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();

  if (session) {
    redirect("/app");
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-brand-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,_rgba(0,180,255,0.32),_transparent_36%),radial-gradient(circle_at_88%_88%,_rgba(10,42,110,0.7),_transparent_42%)]"
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col justify-center px-6 py-16">
        <BrandLogo priority size="lg" />
        <p className="mt-8 text-xs font-medium uppercase tracking-[0.28em] text-brand-cyan">
          Plataforma de laudos
        </p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight tracking-tight">
          Identidade da plataforma
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/75">
          Esta sprint constrói apenas o acesso à conta: cadastro controlado, verificação de e-mail,
          sessão e configurações básicas. Os módulos clínicos serão disponibilizados posteriormente.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/entrar">
            <Button type="button">Entrar</Button>
          </Link>
          <Link href="/cadastro">
            <Button className="border-white/25 bg-white text-brand-navy hover:bg-brand-ice" type="button" variant="secondary">
              Criar conta
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
