import type { ReactNode } from "react";
import Link from "next/link";

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
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          evolUSG
        </p>
        <h1 className="font-serif text-3xl text-stone-900">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 text-sm text-stone-600">{footer}</div> : null}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="font-medium text-stone-900 underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
}
