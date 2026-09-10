import "dotenv/config";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthOptions } from "@/lib/auth/options";
import { extractTokenFromEmail, signInWithCookies } from "@/lib/auth/test-auth";
import { isSafeMigrationTarget } from "@/lib/db/urls";
import type { SendEmailInput } from "@/lib/email/types";

const enabled = isSafeMigrationTarget() && Boolean(process.env.DATABASE_URL);
const suffix = randomUUID();
const allowedEmail = `gate.${suffix}@sprint1-gate.test`;
const outsiderEmail = `out.${suffix}@sprint1-gate.test`;
const password = "password-ok-1";

describe.skipIf(!enabled)("Better Auth + Prisma + PostgreSQL", () => {
  let prisma: typeof import("@/lib/db/prisma").prisma;
  let auth: ReturnType<typeof betterAuth>;
  const inbox: SendEmailInput[] = [];

  beforeAll(async () => {
    process.env.PILOT_REGISTRATION_ENABLED = "true";
    process.env.PILOT_ALLOWED_EMAILS = allowedEmail;
    process.env.BETTER_AUTH_SECRET ??= "test-secret-test-secret-test-secret-32";

    ({ prisma } = await import("@/lib/db/prisma"));
    auth = betterAuth(
      createAuthOptions({
        database: prismaAdapter(prisma, { provider: "postgresql" }),
        emailSender: {
          async send(message) {
            inbox.push(message);
          },
        },
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: "http://localhost:3000",
        rateLimitEnabled: false,
      }),
    );
  });

  afterAll(async () => {
    if (!prisma) {
      return;
    }

    await prisma.user.deleteMany({
      where: {
        email: { endsWith: "@sprint1-gate.test" },
      },
    });
  });

  it("blocks an email outside the allowlist before persistence", async () => {
    const before = await prisma.user.count({
      where: { email: outsiderEmail },
    });

    await expect(
      auth.api.signUpEmail({
        body: {
          name: "Fora",
          email: outsiderEmail,
          password,
        },
      }),
    ).rejects.toMatchObject({ message: "REGISTRATION_NOT_ALLOWED" });

    const after = await prisma.user.count({
      where: { email: outsiderEmail },
    });
    expect(after).toBe(before);
  });

  it("persists a normalized allowlisted user, verifies, authenticates and resets", async () => {
    await auth.api.signUpEmail({
      body: {
        name: "Gate User",
        email: `  ${allowedEmail.toUpperCase()} `,
        password,
      },
    });

    const created = await prisma.user.findUnique({ where: { email: allowedEmail } });
    expect(created?.email).toBe(allowedEmail);
    expect(created?.emailVerified).toBe(false);

    await expect(
      auth.api.signInEmail({
        body: { email: allowedEmail, password },
      }),
    ).rejects.toThrow();

    const token = extractTokenFromEmail(inbox.find((item) => item.subject.includes("Confirme"))!);
    await auth.api.verifyEmail({ query: { token: token! } });

    const verified = await prisma.user.findUnique({ where: { email: allowedEmail } });
    expect(verified?.emailVerified).toBe(true);

    const session = await signInWithCookies(auth, allowedEmail, password);
    const current = await auth.api.getSession({ headers: session.headers });
    expect(current?.user.email).toBe(allowedEmail);

    await auth.api.requestPasswordReset({
      body: { email: allowedEmail, redirectTo: "/redefinir-senha" },
    });
    const resetToken = extractTokenFromEmail(inbox.find((item) => item.subject.includes("Redefinir"))!);
    await auth.api.resetPassword({
      body: { newPassword: "password-ok-2", token: resetToken! },
    });

    await expect(
      auth.api.signInEmail({
        body: { email: allowedEmail, password },
      }),
    ).rejects.toThrow();

    const next = await auth.api.signInEmail({
      body: { email: allowedEmail, password: "password-ok-2" },
    });
    expect(next.token).toBeTruthy();
  });
});
