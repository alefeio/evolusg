import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { requireSession } from "@/lib/auth/session";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-brand-paper">
      <header className="border-b border-white/10 bg-brand-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <BrandLogo href="/app" size="sm" />
            <p className="text-sm text-white/80">{session.user.name}</p>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white" href="/app">
              Início
            </Link>
            <Link className="rounded-lg px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white" href="/app/conta">
              Conta
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
