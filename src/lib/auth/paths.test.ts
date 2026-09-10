import { describe, expect, it } from "vitest";
import { isProtectedPath } from "@/lib/auth/paths";

describe("protected paths", () => {
  it("treats the authenticated area as protected", () => {
    expect(isProtectedPath("/app")).toBe(true);
    expect(isProtectedPath("/app/conta")).toBe(true);
  });

  it("leaves public auth pages unprotected", () => {
    expect(isProtectedPath("/entrar")).toBe(false);
    expect(isProtectedPath("/cadastro")).toBe(false);
    expect(isProtectedPath("/")).toBe(false);
  });
});
