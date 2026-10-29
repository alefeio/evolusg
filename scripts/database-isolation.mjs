import { createHash } from "node:crypto";

export function fingerprintDatabaseTarget(connectionString) {
  const identity = normalizeDatabaseTarget(connectionString);
  return createHash("sha256").update(identity).digest("hex");
}

export function shortDatabaseTargetFingerprint(connectionString) {
  return `${fingerprintDatabaseTarget(connectionString).slice(0, 8)}...`;
}

export function normalizeDatabaseTarget(connectionString) {
  const raw = connectionString.trim();
  const separator = raw.indexOf(":");
  const scheme = separator > 0 ? raw.slice(0, separator).toLowerCase() : "";
  const parsable = scheme === "prisma+postgres" ? `postgres:${raw.slice("prisma+postgres:".length)}` : raw;

  let url;
  try {
    url = new URL(parsable);
  } catch {
    throw new Error("DATABASE_TARGET_UNPARSEABLE");
  }

  if (!url.hostname) {
    throw new Error("DATABASE_TARGET_UNPARSEABLE");
  }

  const port = url.port || (scheme.includes("postgres") ? "5432" : "");
  const database = decodeURIComponent(url.pathname.replace(/^\/+/, "")).toLowerCase();
  return [url.hostname.toLowerCase(), port, database].join("\n");
}

export function resolveRuntimeDatabaseTarget(env) {
  return env.RUNTIME_DATABASE_URL?.trim() || env.DATABASE_URL?.trim() || "";
}

export function resolveMigrationDatabaseTarget(env) {
  return env.DIRECT_URL?.trim() || env.POSTGRES_URL?.trim() || env.DATABASE_URL?.trim() || "";
}

export function auditDatabaseIsolation(input) {
  const productionRuntime = resolveRuntimeDatabaseTarget(input.production);
  const productionMigration = resolveMigrationDatabaseTarget(input.production);
  const previewRuntime = resolveRuntimeDatabaseTarget(input.preview);
  const previewMigration = resolveMigrationDatabaseTarget(input.preview);
  const resolved = {
    productionRuntime,
    productionMigration,
    previewRuntime,
    previewMigration,
  };

  if (Object.values(resolved).some((value) => !value)) {
    return { ok: false, status: "MISSING_TARGET" };
  }

  const fingerprints = {
    productionRuntime: shortDatabaseTargetFingerprint(productionRuntime),
    productionMigration: shortDatabaseTargetFingerprint(productionMigration),
    previewRuntime: shortDatabaseTargetFingerprint(previewRuntime),
    previewMigration: shortDatabaseTargetFingerprint(previewMigration),
  };
  const full = {
    productionRuntime: fingerprintDatabaseTarget(productionRuntime),
    productionMigration: fingerprintDatabaseTarget(productionMigration),
    previewRuntime: fingerprintDatabaseTarget(previewRuntime),
    previewMigration: fingerprintDatabaseTarget(previewMigration),
  };
  const shared =
    full.productionRuntime === full.previewRuntime ||
    full.productionMigration === full.previewMigration;
  const splitWithinEnvironment =
    full.productionRuntime !== full.productionMigration ||
    full.previewRuntime !== full.previewMigration;

  if (shared) {
    return { ok: false, status: "FAILED_SHARED_TARGET", fingerprints };
  }

  if (splitWithinEnvironment) {
    return { ok: false, status: "FAILED_WITHIN_ENVIRONMENT", fingerprints };
  }

  return { ok: true, status: "PASSED", fingerprints };
}
