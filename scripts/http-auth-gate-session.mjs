import "dotenv/config";

if (process.env.DATABASE_ENV?.trim().toLowerCase() !== "development") {
  console.log(JSON.stringify({ error: "DATABASE_ENV_NOT_DEVELOPMENT" }));
  process.exit(1);
}

const base = process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000";
const allowed = "sprint1.local@example.test";
const password = "LocalTest.1a";
const nextPassword = "LocalTest.2b";

function cookieJar() {
  const map = new Map();
  return {
    store(setCookieHeaders) {
      for (const header of setCookieHeaders) {
        const [pair] = header.split(";");
        const idx = pair.indexOf("=");
        if (idx === -1) continue;
        const name = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        if (!value || value.toLowerCase() === "deleted") {
          map.delete(name);
        } else {
          map.set(name, value);
        }
      }
    },
    header() {
      return [...map.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
    },
    count() {
      return map.size;
    },
  };
}

async function request(path, { method = "GET", body, jar } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    redirect: "manual",
    headers: {
      origin: base,
      ...(body ? { "content-type": "application/json" } : {}),
      ...(jar?.header() ? { cookie: jar.header() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = response.headers.getSetCookie?.() ?? [];
  if (jar) {
    jar.store(setCookie);
  }
  let json = null;
  const text = await response.text();
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return {
    status: response.status,
    location: response.headers.get("location"),
    json,
    hasSessionCookie: setCookie.some((item) => item.includes("session_token") && !item.includes("Max-Age=0")),
  };
}

const results = [];
const sessionA = cookieJar();
const sessionB = cookieJar();

const signedIn = await request("/api/auth/sign-in/email", {
  method: "POST",
  jar: sessionA,
  body: { email: allowed, password, callbackURL: "/app" },
});
results.push({
  step: "verified_login_creates_session",
  passed: signedIn.status < 400 && sessionA.count() > 0,
  status: signedIn.status,
  cookies: sessionA.count(),
});

const appWithSession = await request("/app", { jar: sessionA });
results.push({
  step: "app_with_valid_session",
  passed: appWithSession.status === 200,
  status: appWithSession.status,
});

const accountPage = await request("/app/conta", { jar: sessionA });
results.push({
  step: "account_page_with_session",
  passed: accountPage.status === 200,
  status: accountPage.status,
});

const renamed = await request("/api/auth/update-user", {
  method: "POST",
  jar: sessionA,
  body: { name: "Sprint Local Atualizado" },
});
results.push({
  step: "name_change",
  passed: renamed.status < 400,
  status: renamed.status,
});

const sessionCheck = await request("/api/auth/get-session", { jar: sessionA });
results.push({
  step: "name_persisted",
  passed: sessionCheck.json?.user?.name === "Sprint Local Atualizado",
  status: sessionCheck.status,
});

const secondLogin = await request("/api/auth/sign-in/email", {
  method: "POST",
  jar: sessionB,
  body: { email: allowed, password },
});
results.push({
  step: "second_session_created",
  passed: secondLogin.status < 400 && sessionB.count() > 0,
  status: secondLogin.status,
});

const passwordChanged = await request("/api/auth/change-password", {
  method: "POST",
  jar: sessionA,
  body: {
    currentPassword: password,
    newPassword: nextPassword,
    revokeOtherSessions: true,
  },
});
results.push({
  step: "password_change",
  passed: passwordChanged.status < 400,
  status: passwordChanged.status,
});

const revokedOther = await request("/api/auth/get-session", { jar: sessionB });
results.push({
  step: "other_sessions_revoked",
  passed: !revokedOther.json?.session,
  status: revokedOther.status,
});

const signedOut = await request("/api/auth/sign-out", {
  method: "POST",
  jar: sessionA,
  body: {},
});
results.push({
  step: "logout",
  passed: signedOut.status < 400,
  status: signedOut.status,
});

const appAfterLogout = await request("/app", { jar: sessionA });
results.push({
  step: "app_after_logout",
  passed: appAfterLogout.status >= 300 && String(appAfterLogout.location ?? "").includes("/entrar"),
  status: appAfterLogout.status,
});

const resetRequested = await request("/api/auth/request-password-reset", {
  method: "POST",
  body: { email: allowed, redirectTo: "/redefinir-senha" },
});
results.push({
  step: "reset_requested",
  passed: resetRequested.status < 400,
  status: resetRequested.status,
});

const forgotPage = await request("/esqueci-senha");
results.push({
  step: "forgot_password_page",
  passed: forgotPage.status === 200,
  status: forgotPage.status,
});

const resetPage = await request("/redefinir-senha");
results.push({
  step: "reset_password_page",
  passed: resetPage.status === 200,
  status: resetPage.status,
});

console.log(JSON.stringify({ phase: "session", results }, null, 2));
