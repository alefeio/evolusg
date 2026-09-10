import { describe, expect, it } from "vitest";
import {
  evaluatePilotRegistration,
  parsePilotAllowedEmails,
  readPilotRegistrationEnv,
} from "@/lib/pilot-registration";

describe("pilot registration allowlist", () => {
  it("allows an authorized email after normalization", () => {
    const decision = evaluatePilotRegistration({
      email: "  Pilot@Clinic.COM ",
      enabled: true,
      allowedEmails: parsePilotAllowedEmails("other@clinic.com, pilot@clinic.com"),
    });

    expect(decision).toEqual({ ok: true, email: "pilot@clinic.com" });
  });

  it("rejects an email outside the allowlist", () => {
    const decision = evaluatePilotRegistration({
      email: "outsider@clinic.com",
      enabled: true,
      allowedEmails: ["pilot@clinic.com"],
    });

    expect(decision).toEqual({ ok: false, code: "NOT_ALLOWED" });
  });

  it("fails closed when pilot mode is on and the allowlist is empty", () => {
    const decision = evaluatePilotRegistration({
      email: "anyone@clinic.com",
      enabled: true,
      allowedEmails: [],
    });

    expect(decision).toEqual({ ok: false, code: "ALLOWLIST_EMPTY" });
  });

  it("does not use the allowlist when pilot mode is disabled", () => {
    const decision = evaluatePilotRegistration({
      email: "anyone@clinic.com",
      enabled: false,
      allowedEmails: [],
    });

    expect(decision).toEqual({ ok: true, email: "anyone@clinic.com" });
  });

  it("defaults hosted preview/production to pilot mode when the flag is absent", () => {
    expect(
      readPilotRegistrationEnv({
        VERCEL_ENV: "production",
        PILOT_ALLOWED_EMAILS: "",
      }).enabled,
    ).toBe(true);

    expect(
      readPilotRegistrationEnv({
        VERCEL_ENV: "preview",
      }).enabled,
    ).toBe(true);
  });

  it("defaults local development to open registration only when the flag is absent", () => {
    expect(readPilotRegistrationEnv({ NODE_ENV: "development" }).enabled).toBe(false);
  });

  it("honors an explicit disable flag even in production", () => {
    expect(
      readPilotRegistrationEnv({
        VERCEL_ENV: "production",
        PILOT_REGISTRATION_ENABLED: "false",
      }).enabled,
    ).toBe(false);
  });
});
