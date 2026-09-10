import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { convertSetCookieToCookie } from "better-auth/test";
import { createAuthOptions } from "@/lib/auth/options";
import type { SendEmailInput } from "@/lib/email/types";

export function extractTokenFromUrl(url: string): string | null {
  const normalized = url.replaceAll("&amp;", "&");
  try {
    return new URL(normalized).searchParams.get("token");
  } catch {
    const match = normalized.match(/[?&]token=([^&]+)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }
}

export function extractTokenFromEmail(email: SendEmailInput): string | null {
  const blob = `${email.text}\n${email.html}`.replaceAll("&amp;", "&");
  const fromQuery = blob.match(/[?&]token=([^&\s"'<>]+)/);
  if (fromQuery?.[1]) {
    return decodeURIComponent(fromQuery[1]);
  }

  const fromPath = blob.match(/reset-password\/([^?\s"'<>]+)/);
  if (fromPath?.[1]) {
    return decodeURIComponent(fromPath[1]);
  }

  const url = blob.match(/https?:\/\/[^\s"'<>]+/);
  return url ? extractTokenFromUrl(url[0]) : null;
}

export async function cookieHeadersFromResponse(response: Response) {
  return convertSetCookieToCookie(response.headers);
}

export function createMemoryAuth(input?: {
  pilotEnabled?: boolean;
  allowedEmails?: string;
  verificationExpiresIn?: number;
  resetPasswordExpiresIn?: number;
}) {
  process.env.PILOT_REGISTRATION_ENABLED = input?.pilotEnabled === false ? "false" : "true";
  process.env.PILOT_ALLOWED_EMAILS = input?.allowedEmails ?? "piloto@example.com";

  const inbox: SendEmailInput[] = [];
  const store: Record<string, unknown[]> = {
    user: [],
    session: [],
    account: [],
    verification: [],
  };

  const auth = betterAuth(
    createAuthOptions({
      database: memoryAdapter(store),
      emailSender: {
        async send(message) {
          inbox.push(message);
        },
      },
      secret: "test-secret-test-secret-test-secret-32",
      baseURL: "http://localhost:3000",
      rateLimitEnabled: false,
      verificationExpiresIn: input?.verificationExpiresIn,
      resetPasswordExpiresIn: input?.resetPasswordExpiresIn,
    }),
  );

  return { auth, inbox, store };
}

export async function signInWithCookies(
  auth: ReturnType<typeof createMemoryAuth>["auth"],
  email: string,
  password: string,
) {
  const response = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  if (!response.ok) {
    throw new Error("SIGN_IN_FAILED");
  }

  return {
    headers: await cookieHeadersFromResponse(response),
    body: (await response.clone().json()) as {
      token?: string;
      user?: { email?: string; name?: string };
    },
  };
}
