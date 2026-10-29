import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { getDirectDatabaseUrl, getRuntimeDatabaseUrl } from "@/lib/db/urls";
import {
  auditDatabaseIsolation,
  fingerprintDatabaseTarget,
  resolveMigrationDatabaseTarget,
  resolveRuntimeDatabaseTarget,
} from "../../../scripts/database-isolation.mjs";

const secret = "unit-test-db-password";

describe("database target fingerprint", () => {
  it("ignores user, password, and query while keeping host, port, and database", () => {
    const left = fingerprintDatabaseTarget(
      `postgres://app:${secret}@db.example:5432/evolusg?sslmode=require`,
    );
    const right = fingerprintDatabaseTarget("postgresql://other:different@db.example:5432/evolusg");

    expect(left).toBe(right);
    expect(left).not.toContain(secret);
  });

  it("changes when the database name or host changes", () => {
    const base = fingerprintDatabaseTarget("postgres://db.example:5432/evolusg");

    expect(fingerprintDatabaseTarget("postgres://db.example:5432/other")).not.toBe(base);
    expect(fingerprintDatabaseTarget("postgres://other.example:5432/evolusg")).not.toBe(base);
  });

  it("normalizes prisma postgres URLs without leaking the password", () => {
    expect(() => fingerprintDatabaseTarget("not a url")).toThrow("DATABASE_TARGET_UNPARSEABLE");
    expect(
      fingerprintDatabaseTarget(`prisma+postgres://app:${secret}@db.example:5432/evolusg`),
    ).toBe(fingerprintDatabaseTarget("postgres://db.example:5432/evolusg"));
  });

  it("uses the same runtime and migration precedence as the application", () => {
    const env = {
      RUNTIME_DATABASE_URL: "postgres://runtime.example/app",
      DIRECT_URL: "postgres://direct.example/app",
      POSTGRES_URL: "postgres://postgres.example/app",
      DATABASE_URL: "postgres://fallback.example/app",
    };

    expect(resolveRuntimeDatabaseTarget(env)).toBe(getRuntimeDatabaseUrl(env));
    expect(resolveMigrationDatabaseTarget(env)).toBe(getDirectDatabaseUrl(env));
    expect(resolveMigrationDatabaseTarget({ POSTGRES_URL: "postgres://postgres.example/app" })).toBe(
      "postgres://postgres.example/app",
    );
  });
});

describe("database isolation audit", () => {
  it("fails when production and preview resolve to the same target", () => {
    const shared = {
      RUNTIME_DATABASE_URL: `postgres://app:${secret}@db.example:5432/evolusg`,
      POSTGRES_URL: `postgres://migrator:${secret}@db.example:5432/evolusg`,
    };
    const result = auditDatabaseIsolation({ production: shared, preview: shared });

    expect(result.ok).toBe(false);
    expect(result.status).toBe("FAILED_SHARED_TARGET");
    expect(JSON.stringify(result)).not.toContain(secret);
    expect(result.fingerprints?.productionRuntime).toBe(result.fingerprints?.previewRuntime);
  });

  it("passes when each environment has its own matching runtime and migration target", () => {
    const result = auditDatabaseIsolation({
      production: {
        RUNTIME_DATABASE_URL: "postgres://prod.example:5432/evolusg",
        POSTGRES_URL: "postgres://prod.example:5432/evolusg",
      },
      preview: {
        RUNTIME_DATABASE_URL: "postgres://preview.example:5432/evolusg",
        POSTGRES_URL: "postgres://preview.example:5432/evolusg",
      },
    });

    expect(result).toMatchObject({ ok: true, status: "PASSED" });
    expect(result.fingerprints?.productionRuntime).not.toBe(result.fingerprints?.previewRuntime);
  });

  it("fails when one environment splits runtime and migration targets", () => {
    const result = auditDatabaseIsolation({
      production: {
        RUNTIME_DATABASE_URL: "postgres://prod-runtime.example:5432/evolusg",
        POSTGRES_URL: "postgres://prod-migration.example:5432/evolusg",
      },
      preview: {
        RUNTIME_DATABASE_URL: "postgres://preview.example:5432/evolusg",
        POSTGRES_URL: "postgres://preview.example:5432/evolusg",
      },
    });

    expect(result.status).toBe("FAILED_WITHIN_ENVIRONMENT");
  });

  it("fails closed when a required target is missing", () => {
    expect(
      auditDatabaseIsolation({
        production: { RUNTIME_DATABASE_URL: "postgres://prod.example/evolusg" },
        preview: { RUNTIME_DATABASE_URL: "postgres://preview.example/evolusg" },
      }).status,
    ).toBe("MISSING_TARGET");
  });
});

describe("isolation audit command", () => {
  it("stays optional when no targets are configured", () => {
    const result = runAudit();

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("DATABASE_ISOLATION_AUDIT=NOT_CONFIGURED");
  });

  it("fails the strict gate when no targets are configured", () => {
    const byFlag = runAudit(["--strict"]);
    const byEnv = runAudit([], { ISOLATION_AUDIT_REQUIRED: "true" });

    expect(byFlag.status).toBe(1);
    expect(byFlag.stdout).toContain("DATABASE_ISOLATION_AUDIT=NOT_CONFIGURED");
    expect(byEnv.status).toBe(1);
    expect(byEnv.stdout).toContain("DATABASE_ISOLATION_AUDIT=NOT_CONFIGURED");
  });

  it("accepts only a passed strict audit", () => {
    const passed = runAudit(["--strict"], isolatedTargets());
    const shared = runAudit(["--strict"], isolatedTargets({ shared: true }));
    const missing = runAudit(["--strict"], {
      ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL: "postgres://prod.example/evolusg",
      ISOLATION_PREVIEW_RUNTIME_DATABASE_URL: "postgres://preview.example/evolusg",
    });
    const unparseable = runAudit(["--strict"], {
      ...isolatedTargets(),
      ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL: "not a url",
    });
    const split = runAudit(["--strict"], {
      ...isolatedTargets(),
      ISOLATION_PRODUCTION_POSTGRES_URL: "postgres://prod-migration.example/evolusg",
    });

    expect(passed.status).toBe(0);
    expect(passed.stdout).toContain("DATABASE_ENVIRONMENT_ISOLATION=PASSED");
    expect(shared.status).toBe(1);
    expect(shared.stdout).toContain("FAILED_SHARED_TARGET");
    expect(missing.status).toBe(1);
    expect(missing.stdout).toContain("MISSING_TARGET");
    expect(unparseable.status).toBe(1);
    expect(unparseable.stdout).toContain("DATABASE_TARGET_UNPARSEABLE");
    expect(split.status).toBe(1);
    expect(split.stdout).toContain("FAILED_WITHIN_ENVIRONMENT");
  });
});

function runAudit(args: string[] = [], extra: Record<string, string> = {}) {
  const env = { ...process.env, ...extra };
  for (const key of Object.keys(env)) {
    if (key.startsWith("ISOLATION_") && !(key in extra)) {
      delete env[key];
    }
  }

  return spawnSync(process.execPath, ["scripts/audit-database-isolation.mjs", ...args], {
    cwd: process.cwd(),
    env,
    encoding: "utf8",
  });
}

function isolatedTargets(options?: { shared?: boolean }) {
  const previewHost = options?.shared ? "prod.example" : "preview.example";
  return {
    ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL: "postgres://prod.example/evolusg",
    ISOLATION_PRODUCTION_POSTGRES_URL: "postgres://prod.example/evolusg",
    ISOLATION_PREVIEW_RUNTIME_DATABASE_URL: `postgres://${previewHost}/evolusg`,
    ISOLATION_PREVIEW_POSTGRES_URL: `postgres://${previewHost}/evolusg`,
  };
}
