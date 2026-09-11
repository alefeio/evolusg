import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  createLocalCaptureSender,
  isLocalEmailCaptureEnabled,
} from "@/lib/email/local-capture-sender";

describe("local email capture", () => {
  it("never enables capture in production, Vercel or unlabeled databases", () => {
    expect(
      isLocalEmailCaptureEnabled({
        NODE_ENV: "production",
        DATABASE_ENV: "development",
        AUTH_EMAIL_CAPTURE_FILE: ".local-email-capture.json",
      }),
    ).toBe(false);

    expect(
      isLocalEmailCaptureEnabled({
        NODE_ENV: "development",
        VERCEL_ENV: "preview",
        DATABASE_ENV: "development",
        AUTH_EMAIL_CAPTURE_FILE: ".local-email-capture.json",
      }),
    ).toBe(false);

    expect(
      isLocalEmailCaptureEnabled({
        NODE_ENV: "development",
        AUTH_EMAIL_CAPTURE_FILE: ".local-email-capture.json",
      }),
    ).toBe(false);
  });

  it("enables capture only for local development with an explicit file", () => {
    expect(
      isLocalEmailCaptureEnabled({
        NODE_ENV: "development",
        DATABASE_ENV: "development",
        AUTH_EMAIL_CAPTURE_FILE: ".local-email-capture.json",
      }),
    ).toBe(true);
  });

  it("writes captured messages to the configured file without throwing", async () => {
    const dir = mkdtempSync(path.join(tmpdir(), "evolusg-capture-"));
    const file = path.join(dir, "inbox.json");
    const sender = createLocalCaptureSender(file);

    await sender.send({
      to: "sprint1.local@example.test",
      subject: "Confirme seu e-mail — evolUSG",
      html: "<p>ok</p>",
      text: "ok",
    });

    const stored = JSON.parse(readFileSync(file, "utf8")) as Array<{ to: string }>;
    expect(stored).toHaveLength(1);
    expect(stored[0]?.to).toBe("sprint1.local@example.test");
  });
});
