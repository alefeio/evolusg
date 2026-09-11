import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,180,255,0.28),_transparent_42%),radial-gradient(circle_at_bottom,_rgba(10,42,110,0.55),_transparent_48%)]"
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <BrandLogo className="mb-5" href="/" priority size="md" />
        <h1 className="text-3xl font-semibold tracking-tight text-brand-ink">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-brand-muted">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 text-sm text-brand-muted">{footer}</div> : null}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="font-medium text-brand-blue underline-offset-4 hover:text-brand-cyan hover:underline" href={href}>
      {children}
    </Link>
  );
}
