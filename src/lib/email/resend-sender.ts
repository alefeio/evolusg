import { Resend } from "resend";
import type { EmailSender, SendEmailInput } from "@/lib/email/types";

export function createResendSender(input: {
  apiKey: string | undefined;
  from: string | undefined;
}): EmailSender {
  return {
    async send({ to, subject, html, text }: SendEmailInput) {
      if (!input.apiKey || !input.from) {
        throw new Error("EMAIL_NOT_CONFIGURED");
      }

      const resend = new Resend(input.apiKey);
      const result = await resend.emails.send({
        from: input.from,
        to,
        subject,
        html,
        text,
      });

      if (result.error) {
        throw new Error("EMAIL_SEND_FAILED");
      }
    },
  };
}
