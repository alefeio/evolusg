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
