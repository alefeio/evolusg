import { describe, expect, it } from "vitest";
import { hasSessionCookie } from "@/lib/auth/session-cookie";
import { isProtectedPath } from "@/lib/auth/paths";

describe("optimistic proxy vs authorization", () => {
  it("treats a session_token cookie as an optimistic signal only", () => {
    expect(hasSessionCookie([{ name: "better-auth.session_token", value: "any" }])).toBe(true);
    expect(hasSessionCookie([{ name: "unrelated", value: "1" }])).toBe(false);
    expect(hasSessionCookie([{ name: "better-auth.session_token", value: "" }])).toBe(false);
  });

  it("does not treat cookie presence as proof of a valid session", () => {
    expect(isProtectedPath("/app")).toBe(true);
    expect(hasSessionCookie([{ name: "better-auth.session_token", value: "forged" }])).toBe(true);
  });
});
