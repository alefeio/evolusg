import "dotenv/config";

if (process.env.DATABASE_ENV?.trim().toLowerCase() !== "development") {
  console.log(JSON.stringify({ error: "DATABASE_ENV_NOT_DEVELOPMENT" }));
  process.exit(1);
}

const base = process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000";
const allowed = "sprint1.local@example.test";
const outsider = "not-allowed@example.test";
const password = "LocalTest.1a";

async function request(path, { method = "GET", body, cookies } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    redirect: "manual",
    headers: {
      origin: base,
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookies ? { cookie: cookies } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = response.headers.getSetCookie?.() ?? [];
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
    setCookieCount: setCookie.length,
    setCookie,
    json,
    textLength: text.length,
  };
}

const results = [];

const home = await request("/");
results.push({ step: "home_renders", passed: home.status === 200 });

const signupPage = await request("/cadastro");
results.push({ step: "signup_page_renders", passed: signupPage.status === 200 });

const blocked = await request("/api/auth/sign-up/email", {
  method: "POST",
  body: { name: "Teste Fora", email: outsider, password },
});
results.push({
  step: "allowlist_blocks_outsider",
  passed:
    blocked.status >= 400 &&
    String(blocked.json?.message ?? "").includes("REGISTRATION_NOT_ALLOWED"),
  status: blocked.status,
});

const created = await request("/api/auth/sign-up/email", {
  method: "POST",
  body: { name: "Sprint Local", email: allowed, password, callbackURL: "/verificar-email" },
});
results.push({
  step: "allowlist_allows_synthetic",
  passed: created.status < 400,
  status: created.status,
});

const loginPage = await request("/entrar");
results.push({ step: "login_page_renders", passed: loginPage.status === 200 });

const invalid = await request("/api/auth/sign-in/email", {
  method: "POST",
  body: { email: allowed, password: "wrong-password-9" },
});
results.push({
  step: "invalid_credentials",
  passed: invalid.status >= 400,
  status: invalid.status,
});

const unverified = await request("/api/auth/sign-in/email", {
  method: "POST",
  body: { email: allowed, password },
});
results.push({
  step: "unverified_login_blocked",
  passed: unverified.status >= 400,
  status: unverified.status,
  code: unverified.json?.code ?? unverified.json?.message ?? null,
});

const appNoSession = await request("/app");
results.push({
  step: "app_without_session",
  passed: appNoSession.status >= 300 && String(appNoSession.location ?? "").includes("/entrar"),
  status: appNoSession.status,
});

const forged = await request("/app", {
  cookies: "better-auth.session_token=forged-token-not-a-session",
});
results.push({
  step: "forged_cookie_does_not_authorize",
  passed:
    forged.status >= 300 &&
    (String(forged.location ?? "").includes("/entrar") || forged.status === 307 || forged.status === 302),
  status: forged.status,
});

console.log(JSON.stringify({ phase: "before-verify", results }, null, 2));
