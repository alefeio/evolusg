const fs = require("fs");

function hostOf(u) {
  try {
    return new URL(u).host;
  } catch {
    return null;
  }
}

function classifyPg(u) {
  if (!u) return { present: false, hostClass: "ABSENT" };
  try {
    const x = new URL(u);
    const h = x.hostname;
    const pooled =
      /pooled|pooler|pgbouncer|-pool/i.test(h) || x.port === "6543";
    const direct = /db\.prisma\.io/i.test(h) && !pooled;
    return {
      present: true,
      hostClass: pooled ? "POOLED_LIKE" : direct ? "DIRECT_LIKE" : "OTHER",
      hostnameHint: h.replace(/[a-f0-9]{8,}/gi, "***"),
      hasUser: Boolean(x.username),
      hasPassword: Boolean(x.password),
      dbName: x.pathname.replace(/^\//, "") || "(none)",
      protocol: x.protocol.replace(":", ""),
      port: x.port || "(default)",
    };
  } catch {
    return { present: true, hostClass: "UNPARSEABLE" };
  }
}

function emailFromClass(v) {
  if (!v) return "ABSENT";
  const m = String(v).match(/@([^>\s]+)/);
  return m ? `domain:${m[1]}` : "NO_DOMAIN_PARSED";
}

function allowlistClass(v) {
  if (!v) return { count: 0, kinds: [] };
  const parts = String(v)
    .split(/[,\s]+/)
    .filter(Boolean);
  const kinds = parts.map((e) => {
    const lower = e.toLowerCase();
    if (
      lower.includes("smoke") ||
      lower.includes("+test") ||
      lower.includes("+smoke")
    ) {
      return "SMOKE_CANDIDATE";
    }
    if (lower.endsWith(".test") || lower.includes("example.com")) {
      return "SYNTHETIC";
    }
    if (lower.includes("+")) return "PLUS_TAG";
    return "CONSUMER_OR_PILOT";
  });
  return { count: parts.length, kinds };
}

function dbKey(c) {
  return c && c.present ? `${c.hostnameHint}/${c.dbName}` : null;
}

const authHost = hostOf(process.env.BETTER_AUTH_URL);
const out = {
  BETTER_AUTH_URL_host: authHost,
  BETTER_AUTH_URL_isLocalhost: /localhost|127\.0\.0\.1/i.test(
    process.env.BETTER_AUTH_URL || "",
  ),
  BETTER_AUTH_URL_isVercelApp: /\.vercel\.app$/i.test(authHost || ""),
  BETTER_AUTH_URL_isCustomDomain: Boolean(
    authHost &&
      !/\.vercel\.app$/i.test(authHost) &&
      !/localhost/i.test(authHost),
  ),
  DATABASE_ENV: process.env.DATABASE_ENV || null,
  VERCEL_ENV: process.env.VERCEL_ENV || null,
  PILOT_REGISTRATION_ENABLED: process.env.PILOT_REGISTRATION_ENABLED || null,
  EMAIL_FROM_class: emailFromClass(process.env.EMAIL_FROM),
  RESEND_API_KEY_present: Boolean(process.env.RESEND_API_KEY),
  BETTER_AUTH_SECRET_present: Boolean(process.env.BETTER_AUTH_SECRET),
  AUTH_EMAIL_CAPTURE_FILE: process.env.AUTH_EMAIL_CAPTURE_FILE || "ABSENT",
  allowlist: allowlistClass(process.env.PILOT_ALLOWED_EMAILS),
  RUNTIME: classifyPg(process.env.RUNTIME_DATABASE_URL),
  DATABASE_URL: classifyPg(process.env.DATABASE_URL),
  POSTGRES_URL: classifyPg(process.env.POSTGRES_URL),
  PRISMA_DATABASE_URL: classifyPg(process.env.PRISMA_DATABASE_URL),
  DIRECT_URL: classifyPg(process.env.DIRECT_URL),
};

out.topology = {
  runtimeVsDatabaseUrlSameHostDb:
    dbKey(out.RUNTIME) && dbKey(out.RUNTIME) === dbKey(out.DATABASE_URL),
  runtimeVsPostgresSameHostDb:
    dbKey(out.RUNTIME) && dbKey(out.RUNTIME) === dbKey(out.POSTGRES_URL),
  databaseUrlVsPostgresSameHostDb:
    dbKey(out.DATABASE_URL) &&
    dbKey(out.DATABASE_URL) === dbKey(out.POSTGRES_URL),
  runtimePooled: out.RUNTIME.hostClass === "POOLED_LIKE",
  postgresDirect:
    out.POSTGRES_URL.hostClass === "DIRECT_LIKE" ||
    out.DATABASE_URL.hostClass === "DIRECT_LIKE",
};

fs.writeFileSync(
  ".local-pilot-gate/preview-env-classify.json",
  JSON.stringify(out, null, 2),
);
console.log(JSON.stringify(out, null, 2));
