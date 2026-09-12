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
    <main className="relative min-h-screen overflow-hidden bg-brand-navy-950 text-text-on-dark">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{ background: "var(--brand-gradient)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 size-80 rounded-full bg-brand-cyan-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-10 size-72 rounded-full bg-brand-navy-800/50 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16">
        <BrandLogo priority size="lg" />
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.22em] text-brand-cyan-300">
          Plataforma de laudos
        </p>
        <h1 className="mt-4 max-w-2xl text-[1.875rem] font-semibold leading-tight tracking-tight md:text-4xl">
          Identidade e acesso à plataforma
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
          Cadastro controlado, verificação de e-mail, sessão e configurações básicas da conta. Os
          módulos clínicos serão disponibilizados posteriormente.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/entrar">
            <Button type="button">Entrar</Button>
          </Link>
          <Link href="/cadastro">
            <Button
              className="border-white/25 bg-white text-brand-navy-950 hover:bg-surface-soft"
              type="button"
              variant="secondary"
            >
              Criar conta
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
