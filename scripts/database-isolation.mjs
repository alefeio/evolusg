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

export function shortResourceFingerprint(resourceId) {
  const hash = createHash("sha256").update(resourceId.trim()).digest("hex");
  return `${hash.slice(0, 8)}...`;
}

export function auditDatabaseIsolation(input) {
  const strict = input.strict === true;
  const productionRuntime = resolveRuntimeDatabaseTarget(input.production);
  const productionMigration = resolveMigrationDatabaseTarget(input.production);
  const previewRuntime = resolveRuntimeDatabaseTarget(input.preview);
  const previewMigration = resolveMigrationDatabaseTarget(input.preview);
  const resolved = [productionRuntime, productionMigration, previewRuntime, previewMigration];

  if (resolved.some((value) => !value)) {
    return { ok: false, status: "MISSING_TARGET" };
  }

  const fingerprints = {
    productionRuntime: shortDatabaseTargetFingerprint(productionRuntime),
    productionMigration: shortDatabaseTargetFingerprint(productionMigration),
    previewRuntime: shortDatabaseTargetFingerprint(previewRuntime),
    previewMigration: shortDatabaseTargetFingerprint(previewMigration),
  };
  const full = resolved.map((value) => fingerprintDatabaseTarget(value));
  const [productionRuntimeFingerprint, productionMigrationFingerprint, previewRuntimeFingerprint, previewMigrationFingerprint] =
    full;
  const shared = [
    [productionRuntimeFingerprint, previewRuntimeFingerprint],
    [productionRuntimeFingerprint, previewMigrationFingerprint],
    [productionMigrationFingerprint, previewRuntimeFingerprint],
    [productionMigrationFingerprint, previewMigrationFingerprint],
  ].some(([left, right]) => left === right);

  if (shared) {
    return { ok: false, status: "FAILED_SHARED_TARGET", fingerprints };
  }

  const productionResourceId = input.productionResourceId?.trim() || "";
  const previewResourceId = input.previewResourceId?.trim() || "";
  if (!productionResourceId || !previewResourceId) {
    return {
      ok: !strict,
      status: "DATABASE_RESOURCE_ID_REQUIRED",
      fingerprints,
    };
  }

  const resourceFingerprints = {
    production: shortResourceFingerprint(productionResourceId),
    preview: shortResourceFingerprint(previewResourceId),
  };
  if (productionResourceId === previewResourceId) {
    return {
      ok: false,
      status: "FAILED_SHARED_DATABASE_RESOURCE",
      fingerprints,
      resourceFingerprints,
    };
  }

  return { ok: true, status: "PASSED", fingerprints, resourceFingerprints };
}
