import { describe, expect, it } from "vitest";
import {
  createMemoryAuth,
  extractTokenFromEmail,
  signInWithCookies,
} from "@/lib/auth/test-auth";
import { AUTH_MESSAGES, mapAuthError } from "@/lib/auth/messages";

const allowed = "piloto@example.com";
const password = "password-ok-1";

async function signUpAllowed(auth: ReturnType<typeof createMemoryAuth>["auth"]) {
  return auth.api.signUpEmail({
    body: {
      name: "Médica Piloto",
      email: "  PILOTO@example.com ",
      password,
    },
  });
}

async function verifyLatest(inbox: ReturnType<typeof createMemoryAuth>["inbox"], auth: ReturnType<typeof createMemoryAuth>["auth"]) {
  const verifyMail = inbox.find((item) => item.subject.includes("Confirme"));
  const token = verifyMail ? extractTokenFromEmail(verifyMail) : null;
  expect(token).toBeTruthy();
  await auth.api.verifyEmail({
    query: { token: token! },
  });
}

describe("authentication flows", () => {
  it("lets an allowlisted email start signup and normalizes the address", async () => {
    const { auth, inbox, store } = createMemoryAuth();
    await signUpAllowed(auth);

    expect(store.user).toHaveLength(1);
    expect(store.user[0]).toMatchObject({ email: allowed, emailVerified: false });
    expect(inbox.some((item) => item.subject.includes("Confirme"))).toBe(true);
  });

  it("rejects an email outside the allowlist before persistence", async () => {
    const { auth, store } = createMemoryAuth();

    await expect(
      auth.api.signUpEmail({
        body: {
          name: "Fora",
          email: "outsider@example.com",
          password,
        },
      }),
    ).rejects.toMatchObject({ message: "REGISTRATION_NOT_ALLOWED" });

    expect(store.user).toHaveLength(0);
  });

  it("fails closed when the pilot allowlist is empty", async () => {
    const { auth, store } = createMemoryAuth({ allowedEmails: "" });

    await expect(
      auth.api.signUpEmail({
        body: {
          name: "Fora",
          email: allowed,
          password,
        },
      }),
    ).rejects.toMatchObject({ message: "REGISTRATION_NOT_ALLOWED" });

    expect(store.user).toHaveLength(0);
  });

  it("does not reveal a useful distinction for a duplicate authorized signup", async () => {
    const { auth } = createMemoryAuth();
    await signUpAllowed(auth);

    const second = await auth.api.signUpEmail({
      body: {
        name: "Médica Piloto",
        email: allowed,
        password,
      },
    });

    expect(second).toBeTruthy();
  });

  it("refuses login before verification and accepts it after a valid token", async () => {
    const { auth, inbox } = createMemoryAuth();
    await signUpAllowed(auth);

    await expect(
      auth.api.signInEmail({
        body: { email: allowed, password },
      }),
    ).rejects.toThrow();

    await verifyLatest(inbox, auth);

    const signedIn = await auth.api.signInEmail({
      body: { email: allowed, password },
    });

    expect(signedIn.user.email).toBe(allowed);
    expect(signedIn.token).toBeTruthy();
  });

  it("rejects an invalid verification token", async () => {
    const { auth } = createMemoryAuth();
    await signUpAllowed(auth);

    await expect(
      auth.api.verifyEmail({
        query: { token: "invalid-token" },
      }),
    ).rejects.toThrow();
  });

  it("rejects an expired verification token", async () => {
    const { auth, inbox } = createMemoryAuth({ verificationExpiresIn: 1 });
    await signUpAllowed(auth);
    const token = extractTokenFromEmail(inbox.find((item) => item.subject.includes("Confirme"))!);
    expect(token).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 1100));

    await expect(
      auth.api.verifyEmail({
        query: { token: token! },
      }),
    ).rejects.toThrow();
  });

  it("consumes the verification token so reuse cannot re-verify or sign anyone in", async () => {
    const { auth, inbox, store } = createMemoryAuth();
    await signUpAllowed(auth);
    const token = extractTokenFromEmail(inbox.find((item) => item.subject.includes("Confirme"))!);
    expect(token).toBeTruthy();

    await auth.api.verifyEmail({ query: { token: token! } });
    expect(store.user[0]).toMatchObject({ emailVerified: true });
    expect(store.verification).toHaveLength(0);

    await auth.api.verifyEmail({ query: { token: token! } });
    expect(store.verification).toHaveLength(0);
    expect(store.session).toHaveLength(0);
  });

  it("rejects a reset token reused after the password was changed", async () => {
    const { auth, inbox } = createMemoryAuth();
    await signUpAllowed(auth);
    await verifyLatest(inbox, auth);

    await auth.api.requestPasswordReset({
      body: { email: allowed, redirectTo: "/redefinir-senha" },
    });
    const resetToken = extractTokenFromEmail(
      inbox.find((item) => item.subject.includes("Redefinir"))!,
    );
    expect(resetToken).toBeTruthy();

    await auth.api.resetPassword({
      body: { newPassword: "password-ok-4", token: resetToken! },
    });

    await expect(
      auth.api.resetPassword({
        body: { newPassword: "password-ok-5", token: resetToken! },
      }),
    ).rejects.toThrow();

    const stillWorks = await auth.api.signInEmail({
      body: { email: allowed, password: "password-ok-4" },
    });
    expect(stillWorks.token).toBeTruthy();
  });

  it("rejects the wrong password without a session", async () => {
    const { auth, inbox } = createMemoryAuth();
    await signUpAllowed(auth);
    await verifyLatest(inbox, auth);

    await expect(
      auth.api.signInEmail({
        body: { email: allowed, password: "wrong-password" },
      }),
    ).rejects.toThrow();
  });

  it("logs out and makes the previous session unusable", async () => {
    const { auth, inbox } = createMemoryAuth();
    await signUpAllowed(auth);
    await verifyLatest(inbox, auth);

    const { headers } = await signInWithCookies(auth, allowed, password);
    await auth.api.signOut({ headers });

    const after = await auth.api.getSession({ headers });
    expect(after).toBeNull();
  });

  it("resets the password, revokes other sessions and rejects the old password", async () => {
    const { auth, inbox } = createMemoryAuth();
    await signUpAllowed(auth);
    await verifyLatest(inbox, auth);

    const first = await signInWithCookies(auth, allowed, password);

    await auth.api.requestPasswordReset({
      body: { email: allowed, redirectTo: "/redefinir-senha" },
    });

    const resetMail = inbox.find((item) => item.subject.includes("Redefinir"));
    const resetToken = resetMail ? extractTokenFromEmail(resetMail) : null;
    expect(resetToken).toBeTruthy();

    await expect(
      auth.api.resetPassword({
        body: { newPassword: "password-ok-2", token: "invalid-token" },
      }),
    ).rejects.toThrow();

    await auth.api.resetPassword({
      body: { newPassword: "password-ok-2", token: resetToken! },
    });

    const oldSession = await auth.api.getSession({ headers: first.headers });
    expect(oldSession).toBeNull();

    await expect(
      auth.api.signInEmail({
        body: { email: allowed, password },
      }),
    ).rejects.toThrow();

    const next = await auth.api.signInEmail({
      body: { email: allowed, password: "password-ok-2" },
    });
    expect(next.token).toBeTruthy();
  });

  it("updates the name, starts a verified email change and revokes other sessions on password change", async () => {
    const { auth, inbox } = createMemoryAuth();
    await signUpAllowed(auth);
    await verifyLatest(inbox, auth);

    const current = await signInWithCookies(auth, allowed, password);

    await auth.api.updateUser({
      body: { name: "Nome Atualizado" },
      headers: current.headers,
    });

    const afterName = await auth.api.getSession({ headers: current.headers });
    expect(afterName?.user.name).toBe("Nome Atualizado");

    await auth.api.changeEmail({
      body: { newEmail: "novo@example.com", callbackURL: "/app/conta" },
      headers: current.headers,
    });
    expect(inbox.some((item) => item.subject.includes("troca de e-mail"))).toBe(true);
    expect(afterName?.user.email).toBe(allowed);

    const other = await signInWithCookies(auth, allowed, password);

    await auth.api.changePassword({
      body: {
        currentPassword: password,
        newPassword: "password-ok-3",
        revokeOtherSessions: true,
      },
      headers: current.headers,
    });

    const revoked = await auth.api.getSession({ headers: other.headers });
    expect(revoked).toBeNull();

    const afterPassword = await signInWithCookies(auth, allowed, "password-ok-3");
    await auth.api.revokeOtherSessions({ headers: afterPassword.headers });
    const listed = await auth.api.listSessions({ headers: afterPassword.headers });
    expect(listed.length).toBeGreaterThanOrEqual(1);
  });

  it("maps unknown credential failures to a generic login message", () => {
    expect(mapAuthError({ message: "Invalid email or password" })).toBe(
      AUTH_MESSAGES.credentials,
    );
  });
});
