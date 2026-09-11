import "dotenv/config";

const names = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "PRISMA_DATABASE_URL",
  "DIRECT_URL",
  "DATABASE_ENV",
  "VERCEL_ENV",
  "PRISMA_ENV",
  "APP_DB_ENV",
];

function summarize(raw) {
  if (!raw) {
    return { present: false };
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname;
    const maskedHost =
      host.length <= 6 ? "***" : `${host.slice(0, 3)}***${host.slice(-6)}`;

    return {
      present: true,
      protocol: parsed.protocol.replace(":", ""),
      maskedHost,
      port: parsed.port || null,
      path: parsed.pathname,
      hasUserinfo: Boolean(parsed.username || parsed.password),
      queryKeys: [...parsed.searchParams.keys()].sort(),
      looksPooled:
        host.includes("pooled") ||
        parsed.searchParams.has("pgbouncer") ||
        parsed.protocol.startsWith("prisma+"),
      sslmode: parsed.searchParams.get("sslmode"),
    };
  } catch {
    const looksPrismaNative = raw.startsWith("prisma+");
    return {
      present: true,
      protocol: looksPrismaNative ? "prisma+" : "unparsed",
      looksPooled: looksPrismaNative,
      hasUserinfo: raw.includes("@"),
    };
  }
}

const knownLabels = new Set(["development", "preview", "production", "test"]);
const report = Object.fromEntries(names.map((name) => [name, summarize(process.env[name])]));
const labelKeys = ["DATABASE_ENV", "VERCEL_ENV", "PRISMA_ENV", "APP_DB_ENV"].map((name) => {
  const raw = process.env[name]?.trim().toLowerCase() || null;
  return {
    name,
    present: Boolean(raw),
    value: raw && knownLabels.has(raw) ? raw : raw ? "set-unrecognized" : null,
  };
});

console.log(
  JSON.stringify(
    {
      connections: report,
      labels: labelKeys,
    },
    null,
    2,
  ),
);
