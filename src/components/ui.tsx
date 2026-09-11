import type { ReactNode } from "react";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const styles = {
    primary:
      "bg-[linear-gradient(135deg,#0a2a6e,#0072ef_48%,#00b4ff)] text-white shadow-sm hover:brightness-110 disabled:bg-none disabled:bg-brand-line disabled:text-white/80",
    secondary:
      "border border-brand-line bg-white text-brand-ink hover:bg-brand-ice disabled:text-brand-muted",
    ghost: "text-brand-muted hover:bg-white/10 hover:text-white disabled:text-brand-muted/60",
  } as const;

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-brand-line bg-white px-3 py-2.5 text-sm text-brand-ink outline-none ring-brand-cyan placeholder:text-brand-muted focus:border-brand-blue focus:ring-2",
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
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-brand-ink">{label}</span>
      {children}
      {error ? <span className="block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

export function Alert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success" | "info";
}) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-brand-line bg-brand-ice text-brand-ink",
  } as const;

  return (
    <div className={cn("rounded-lg border px-3 py-2 text-sm", styles[tone])} role="status">
      {children}
    </div>
  );
}
