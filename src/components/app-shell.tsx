"use client";

import type { ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { Button, cn } from "@/components/ui";
import { SignOutButton } from "@/components/sign-out-button";

const navItems = [
  { href: "/app", label: "Início" },
  { href: "/app/conta", label: "Conta" },
] as const;

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className={cn("flex flex-col gap-1", className)}>
      {navItems.map((item) => {
        const active =
          item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            className={cn(
              "rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-semibold transition-colors duration-[var(--duration-fast)]",
              active
                ? "bg-brand-blue-700/35 text-text-on-dark"
                : "text-white/75 hover:bg-white/10 hover:text-text-on-dark",
            )}
            href={item.href}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  userName,
  userEmail,
  children,
}: {
  userName: string;
  userEmail: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const pathname = usePathname();
  const pageTitle = pathname.startsWith("/app/conta") ? "Conta" : "Início";

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden flex-col bg-brand-navy-950 text-text-on-dark lg:flex">
        <div className="border-b border-white/10 px-5 py-5">
          <BrandLogo href="/app" size="sm" />
        </div>
        <div className="flex flex-1 flex-col px-3 py-4">
          <NavLinks />
          <div className="mt-auto space-y-3 border-t border-white/10 px-2 pt-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-on-dark">{userName}</p>
              <p className="truncate text-xs text-white/60">{userEmail}</p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                aria-controls={titleId}
                aria-expanded={open}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
                className="lg:hidden"
                onClick={() => setOpen((value) => !value)}
                type="button"
                variant="secondary"
              >
                Menu
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">{pageTitle}</p>
                <p className="truncate text-xs text-text-secondary lg:hidden">{userName}</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <p className="max-w-[14rem] truncate text-sm text-text-secondary">{userEmail}</p>
              <div className="lg:hidden">
                <SignOutButton tone="light" />
              </div>
            </div>
          </div>
        </header>

        {open ? (
          <div className="fixed inset-0 z-30 lg:hidden" id={titleId}>
            <button
              aria-label="Fechar menu"
              className="absolute inset-0 bg-brand-navy-950/45"
              onClick={closeMenu}
              type="button"
            />
            <div className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col bg-brand-navy-950 text-text-on-dark shadow-[var(--shadow-elevated)]">
              <div className="border-b border-white/10 px-5 py-5">
                <BrandLogo href="/app" size="sm" />
              </div>
              <div className="flex flex-1 flex-col px-3 py-4">
                <NavLinks onNavigate={closeMenu} />
                <div className="mt-auto space-y-3 border-t border-white/10 px-2 pt-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{userName}</p>
                    <p className="truncate text-xs text-white/60">{userEmail}</p>
                  </div>
                  <SignOutButton />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
