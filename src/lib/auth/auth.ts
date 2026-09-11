import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthOptions } from "@/lib/auth/options";
import { getEmailSender } from "@/lib/email";
import { prisma } from "@/lib/db/prisma";

function getBaseURL() {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function getAuthSecret() {
  const secret = process.env.BETTER_AUTH_SECRET?.trim();

  if (secret) {
    return secret;
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-only-placeholder-not-for-runtime-use";
  }

  throw new Error("BETTER_AUTH_SECRET is not set");
}

export const auth = betterAuth(
  createAuthOptions({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    emailSender: getEmailSender(),
    secret: getAuthSecret(),
    baseURL: getBaseURL(),
    plugins: [nextCookies()],
  }),
);
