import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/components/ui";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <aside
        aria-hidden={false}
        className="relative hidden overflow-hidden bg-brand-navy-950 text-text-on-dark lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ background: "var(--brand-gradient)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-24 size-72 rounded-full bg-brand-cyan-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 bottom-10 size-64 rounded-full bg-brand-blue-600/35 blur-3xl"
        />

        <div className="relative z-10 space-y-8">
          <BrandLogo href="/" priority size="md" />
          <div className="max-w-sm space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan-300">
              evolUSG
            </p>
            <p className="text-2xl font-semibold leading-snug tracking-tight text-text-on-dark">
              Tecnologia para uma prática ultrassonográfica mais inteligente.
            </p>
            <p className="text-sm leading-6 text-white/75">
              Acesso seguro à conta. Os módulos clínicos serão disponibilizados em etapas
              posteriores.
            </p>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/55">Identidade e acesso · Fundação</p>
      </aside>

      <main className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-[28rem]">
          <div className="mb-8 lg:hidden">
            <BrandLogo href="/" priority size="sm" />
          </div>

          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
            <h1 className="text-[1.875rem] font-semibold tracking-tight text-text-primary md:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
            ) : null}
            <div className="mt-6">{children}</div>
            {footer ? (
              <div className="mt-6 border-t border-border pt-5 text-sm text-text-secondary">
                {footer}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      className={cn(
        "font-semibold text-brand-blue-700 underline-offset-4 transition-colors duration-[var(--duration-fast)]",
        "hover:text-brand-navy-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan-500",
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
