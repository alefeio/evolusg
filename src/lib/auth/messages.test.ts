import { describe, expect, it } from "vitest";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";

describe("mapAuthError", () => {
  it("does not leak account existence on invalid credentials", () => {
    expect(mapAuthError({ message: "Invalid email or password", status: 401 })).toBe(
      AUTH_MESSAGES.credentials,
    );
  });

  it("maps unauthorized pilot registration without extra detail", () => {
    expect(mapAuthError({ message: "REGISTRATION_NOT_ALLOWED", status: 403 })).toBe(
      AUTH_MESSAGES.registrationBlocked,
    );
  });

  it("maps invalid and expired tokens", () => {
    expect(mapAuthError({ message: "invalid_token" })).toBe(AUTH_MESSAGES.invalidToken);
    expect(mapAuthError({ message: "token expired" })).toBe(AUTH_MESSAGES.expiredToken);
  });

  it("maps rate limiting", () => {
    expect(mapAuthError({ status: 429, message: "Too many requests" })).toBe(
      AUTH_MESSAGES.rateLimited,
    );
  });
});
