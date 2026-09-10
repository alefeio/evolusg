import type { BetterAuthOptions } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import type { EmailSender } from "@/lib/email/types";
import {
  changeEmailConfirmHtml,
  changeEmailConfirmText,
  resetPasswordEmailHtml,
  resetPasswordEmailText,
  verificationEmailHtml,
  verificationEmailText,
} from "@/lib/email/templates";
import { normalizeEmail } from "@/lib/email-normalize";
import {
  evaluatePilotRegistration,
  readPilotRegistrationEnv,
} from "@/lib/pilot-registration";
import { nameSchema } from "@/lib/validation/identity";

const REGISTRATION_ERROR = "REGISTRATION_NOT_ALLOWED";

function assertPilotEmail(email: string): string {
  const { enabled, allowedEmails } = readPilotRegistrationEnv();
  const decision = evaluatePilotRegistration({ email, enabled, allowedEmails });

  if (!decision.ok) {
    throw new APIError("FORBIDDEN", { message: REGISTRATION_ERROR });
  }

  return decision.email;
}

export function createAuthOptions(input: {
  database: BetterAuthOptions["database"];
  emailSender: EmailSender;
  secret: string;
  baseURL: string;
  plugins?: BetterAuthOptions["plugins"];
  rateLimitEnabled?: boolean;
  verificationExpiresIn?: number;
  resetPasswordExpiresIn?: number;
}): BetterAuthOptions {
  const send = input.emailSender.send;

  return {
    database: input.database,
    secret: input.secret,
    baseURL: input.baseURL,
    trustedOrigins: [input.baseURL],
    rateLimit: {
      enabled: input.rateLimitEnabled ?? process.env.NODE_ENV === "production",
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      ...(input.resetPasswordExpiresIn != null
        ? { resetPasswordTokenExpiresIn: input.resetPasswordExpiresIn }
        : {}),
      sendResetPassword: async ({ user, token }) => {
        const resetUrl = `${input.baseURL}/redefinir-senha?token=${encodeURIComponent(token)}`;
        await send({
          to: user.email,
          subject: "Redefinir senha — evolUSG",
          html: resetPasswordEmailHtml(resetUrl),
          text: resetPasswordEmailText(resetUrl),
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      ...(input.verificationExpiresIn != null ? { expiresIn: input.verificationExpiresIn } : {}),
      sendVerificationEmail: async ({ user, url }) => {
        await send({
          to: user.email,
          subject: "Confirme seu e-mail — evolUSG",
          html: verificationEmailHtml(url),
          text: verificationEmailText(url),
        });
      },
    },
    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
          await send({
            to: user.email,
            subject: "Confirmar troca de e-mail — evolUSG",
            html: changeEmailConfirmHtml(newEmail, url),
            text: changeEmailConfirmText(newEmail, url),
          });
        },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") {
          return;
        }

        const email = normalizeEmail(String(ctx.body?.email ?? ""));
        const parsedName = nameSchema.safeParse(String(ctx.body?.name ?? ""));

        if (!parsedName.success) {
          throw new APIError("BAD_REQUEST", {
            message: parsedName.error.issues[0]?.message ?? "Nome inválido.",
          });
        }

        const allowedEmail = assertPilotEmail(email);

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              email: allowedEmail,
              name: parsedName.data,
            },
          },
        };
      }),
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            const email = assertPilotEmail(user.email);
            return { data: { ...user, email } };
          },
        },
      },
    },
    plugins: input.plugins ?? [],
  };
}
