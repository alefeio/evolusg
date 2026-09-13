import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const buttonBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 py-2.5 text-sm font-semibold transition-[background-color,color,box-shadow,border-color,opacity] duration-[var(--duration-fast)] ease-[var(--ease-brand)] disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const buttonStyles = {
  primary:
    "bg-brand-blue-700 text-text-on-dark hover:bg-brand-navy-800 active:bg-brand-navy-950 focus-visible:outline-brand-cyan-500 disabled:bg-border disabled:text-text-secondary/80",
  secondary:
    "border border-border bg-surface text-brand-navy-800 hover:bg-surface-soft focus-visible:outline-brand-blue-600 disabled:text-text-secondary/70",
  ghost:
    "bg-transparent text-text-secondary hover:bg-white/10 hover:text-text-on-dark focus-visible:outline-brand-cyan-300 disabled:text-text-secondary/50",
  danger:
    "bg-danger text-text-on-dark hover:bg-[#991b1b] focus-visible:outline-danger disabled:bg-border disabled:text-text-secondary/80",
} as const;

export function Button({
  children,
  className,
  variant = "primary",
  pending = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles;
  pending?: boolean;
}) {
  return (
    <button
      aria-busy={pending || undefined}
      className={cn(buttonBase, buttonStyles[variant], className)}
      disabled={props.disabled || pending}
      {...props}
    >
      {pending ? (
        <span
          aria-hidden
          className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-11 w-full rounded-[var(--radius-control)] border bg-surface px-3.5 py-2.5 text-sm text-text-primary outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)] placeholder:text-text-secondary/80 focus:border-brand-blue-600 focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-brand-cyan-500)_35%,transparent)] disabled:cursor-not-allowed disabled:bg-surface-soft",
        invalid
          ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-danger)_25%,transparent)]"
          : "border-border",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className="block space-y-1.5">
      <label className="text-sm font-semibold text-text-primary" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="text-sm text-text-secondary" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="flex items-start gap-1.5 text-sm text-danger" id={errorId} role="alert">
          <span aria-hidden className="mt-0.5 font-semibold">
            !
          </span>
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export function Alert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success" | "info" | "warning";
}) {
  const styles = {
    error: "border-danger-border bg-danger-soft text-danger",
    success: "border-success-border bg-success-soft text-success",
    warning: "border-warning-border bg-warning-soft text-warning",
    info: "border-info-border bg-info-soft text-info",
  } as const;

  const icons = {
    error: "!",
    success: "✓",
    warning: "!",
    info: "i",
  } as const;

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-[var(--radius-control)] border px-3.5 py-3 text-sm leading-5",
        styles[tone],
      )}
      role="status"
    >
      <span
        aria-hidden
        className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/70 text-xs font-bold"
      >
        {icons[tone]}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function Card({
  children,
  className,
  elevated = false,
}: {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-card)] border border-border bg-surface p-6",
        elevated ? "shadow-[var(--shadow-elevated)]" : "shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="max-w-2xl space-y-2">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue-700">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[1.875rem] font-semibold tracking-tight text-text-primary md:text-4xl">
        {title}
      </h1>
      {description ? <p className="text-base leading-7 text-text-secondary">{description}</p> : null}
    </header>
  );
}
