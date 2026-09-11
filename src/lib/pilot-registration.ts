import { isValidEmailShape, normalizeEmail } from "@/lib/email-normalize";

export type PilotRegistrationDecision =
  | { ok: true; email: string }
  | { ok: false; code: "DISABLED" | "ALLOWLIST_EMPTY" | "NOT_ALLOWED" | "INVALID_EMAIL" };

export function parsePilotAllowedEmails(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(/[,;\n]/)
    .map((item) => normalizeEmail(item))
    .filter(Boolean);
}

export function evaluatePilotRegistration(input: {
  email: string;
  enabled: boolean;
  allowedEmails: readonly string[];
}): PilotRegistrationDecision {
  const email = normalizeEmail(input.email);

  if (!isValidEmailShape(email)) {
    return { ok: false, code: "INVALID_EMAIL" };
  }

  if (!input.enabled) {
    return { ok: true, email };
  }

  if (input.allowedEmails.length === 0) {
    return { ok: false, code: "ALLOWLIST_EMPTY" };
  }

  if (!input.allowedEmails.includes(email)) {
    return { ok: false, code: "NOT_ALLOWED" };
  }

  return { ok: true, email };
}

export function readPilotRegistrationEnv(
  env: Record<string, string | undefined> = process.env,
): { enabled: boolean; allowedEmails: string[] } {
  const flag = env.PILOT_REGISTRATION_ENABLED?.trim().toLowerCase();
  const vercelEnv = env.VERCEL_ENV?.trim().toLowerCase();
  const hosted = vercelEnv === "preview" || vercelEnv === "production";

  const enabled =
    flag === "false" || flag === "0"
      ? false
      : flag === "true" || flag === "1"
        ? true
        : hosted;

  return {
    enabled,
    allowedEmails: parsePilotAllowedEmails(env.PILOT_ALLOWED_EMAILS),
  };
}
