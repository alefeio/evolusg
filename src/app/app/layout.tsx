import type { ReactNode } from "react";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <Link className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500" href="/app">
              evolUSG
            </Link>
            <p className="text-sm text-stone-700">{session.user.name}</p>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link className="rounded-lg px-3 py-2 text-stone-700 hover:bg-stone-100" href="/app">
              Início
            </Link>
            <Link className="rounded-lg px-3 py-2 text-stone-700 hover:bg-stone-100" href="/app/conta">
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
