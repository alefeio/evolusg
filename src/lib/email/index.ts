import { createResendSender } from "@/lib/email/resend-sender";
import type { EmailSender, SendEmailInput } from "@/lib/email/types";

function createNoopSender(): EmailSender {
  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        throw new Error("EMAIL_NOT_CONFIGURED");
      }
    },
  };
}

export function getEmailSender(): EmailSender {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return createNoopSender();
  }

  return createResendSender({ apiKey, from });
}

export async function sendTransactionalEmail(input: SendEmailInput): Promise<void> {
  await getEmailSender().send(input);
}
