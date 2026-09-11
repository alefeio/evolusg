import fs from "node:fs";
import path from "node:path";
import type { EmailSender, SendEmailInput } from "@/lib/email/types";

export function isLocalEmailCaptureEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (env.NODE_ENV === "production") {
    return false;
  }

  if (env.VERCEL_ENV) {
    return false;
  }

  if (env.DATABASE_ENV?.trim().toLowerCase() !== "development") {
    return false;
  }

  return Boolean(env.AUTH_EMAIL_CAPTURE_FILE?.trim());
}

export function createLocalCaptureSender(filePath: string): EmailSender {
  const resolved = path.resolve(filePath);

  return {
    async send(message: SendEmailInput) {
      const dir = path.dirname(resolved);
      fs.mkdirSync(dir, { recursive: true });

      let existing: SendEmailInput[] = [];
      if (fs.existsSync(resolved)) {
        const raw = fs.readFileSync(resolved, "utf8").trim();
        if (raw) {
          existing = JSON.parse(raw) as SendEmailInput[];
        }
      }

      existing.push(message);
      fs.writeFileSync(resolved, `${JSON.stringify(existing)}\n`);
    },
  };
}
