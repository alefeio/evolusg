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

  it("allows pooled and direct hosts that belong to different database resources", () => {
    const result = auditDatabaseIsolation({
      production: {
        RUNTIME_DATABASE_URL: "postgres://pool-a.example:5432/evolusg",
        DIRECT_URL: "postgres://direct-b.example:5432/evolusg",
      },
      preview: {
        RUNTIME_DATABASE_URL: "postgres://pool-c.example:5432/evolusg",
        DIRECT_URL: "postgres://direct-d.example:5432/evolusg",
      },
      productionResourceId: "prod-resource",
      previewResourceId: "preview-resource",
    });

    expect(result).toMatchObject({ ok: true, status: "PASSED" });
    expect(result.fingerprints?.productionRuntime).not.toBe(result.fingerprints?.productionMigration);
    expect(result.fingerprints?.previewRuntime).not.toBe(result.fingerprints?.previewMigration);
  });

  it("rejects the same database resource id", () => {
    const result = auditDatabaseIsolation({
      ...separatedEndpoints(),
      productionResourceId: "same-resource",
      previewResourceId: "same-resource",
    });

    expect(result.status).toBe("FAILED_SHARED_DATABASE_RESOURCE");
    expect(JSON.stringify(result)).not.toContain("same-resource");
  });

  it("rejects a production runtime endpoint reused by preview", () => {
    const endpoints = separatedEndpoints();
    const result = auditDatabaseIsolation({
      ...endpoints,
      preview: {
        ...endpoints.preview,
        RUNTIME_DATABASE_URL: endpoints.production.RUNTIME_DATABASE_URL,
      },
      productionResourceId: "prod-resource",
      previewResourceId: "preview-resource",
    });

    expect(result.status).toBe("FAILED_SHARED_TARGET");
  });

  it("rejects a production migration endpoint reused as the preview runtime", () => {
    const endpoints = separatedEndpoints();
    const result = auditDatabaseIsolation({
      ...endpoints,
      preview: {
        ...endpoints.preview,
        RUNTIME_DATABASE_URL: endpoints.production.DIRECT_URL,
      },
      productionResourceId: "prod-resource",
      previewResourceId: "preview-resource",
    });

    expect(result.status).toBe("FAILED_SHARED_TARGET");
  });

  it("requires resource ids before calling the result passed", () => {
    expect(auditDatabaseIsolation(separatedEndpoints()).status).toBe("DATABASE_RESOURCE_ID_REQUIRED");
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

  it("accepts a strict audit when resources and endpoints are distinct", () => {
    const passed = runAudit(["--strict"], isolatedTargets());

    expect(passed.status).toBe(0);
    expect(passed.stdout).toContain("DATABASE_ENVIRONMENT_ISOLATION=PASSED");
    expect(passed.stdout).not.toContain(secret);
    expect(passed.stdout).not.toContain("prod-resource");
  });

  it("rejects a shared runtime endpoint in strict mode", () => {
    const sharedRuntime = runAudit(["--strict"], {
      ...isolatedTargets(),
      ISOLATION_PREVIEW_RUNTIME_DATABASE_URL: "postgres://pool-a.example/evolusg",
    });

    expect(sharedRuntime.status).toBe(1);
    expect(sharedRuntime.stdout).toContain("FAILED_SHARED_TARGET");
  });

  it("rejects a migration endpoint reused as another environment runtime", () => {
    const sharedMigration = runAudit(["--strict"], {
      ...isolatedTargets(),
      ISOLATION_PREVIEW_RUNTIME_DATABASE_URL: "postgres://direct-b.example/evolusg",
    });

    expect(sharedMigration.status).toBe(1);
    expect(sharedMigration.stdout).toContain("FAILED_SHARED_TARGET");
  });

  it("rejects the same database resource in strict mode", () => {
    const sharedResource = runAudit(["--strict"], {
      ...isolatedTargets(),
      ISOLATION_PREVIEW_DATABASE_ID: "prod-resource",
    });

    expect(sharedResource.status).toBe(1);
    expect(sharedResource.stdout).toContain("FAILED_SHARED_DATABASE_RESOURCE");
    expect(sharedResource.stdout).not.toContain("prod-resource");
  });

  it("requires database resource ids in strict mode", () => {
    const missingIds = runAudit(["--strict"], isolatedTargets({ resourceIds: false }));

    expect(missingIds.status).toBe(1);
    expect(missingIds.stdout).toContain("DATABASE_RESOURCE_ID_REQUIRED");
  });

  it("rejects incomplete targets and unparseable URLs in strict mode", () => {
    const missing = runAudit(["--strict"], {
      ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL: "postgres://pool-a.example/evolusg",
      ISOLATION_PREVIEW_RUNTIME_DATABASE_URL: "postgres://pool-c.example/evolusg",
      ISOLATION_PRODUCTION_DATABASE_ID: "prod-resource",
      ISOLATION_PREVIEW_DATABASE_ID: "preview-resource",
    });
    const unparseable = runAudit(["--strict"], {
      ...isolatedTargets(),
      ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL: "not a url",
    });

    expect(missing.status).toBe(1);
    expect(missing.stdout).toContain("MISSING_TARGET");
    expect(unparseable.status).toBe(1);
    expect(unparseable.stdout).toContain("DATABASE_TARGET_UNPARSEABLE");
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

function separatedEndpoints() {
  return {
    production: {
      RUNTIME_DATABASE_URL: "postgres://pool-a.example:5432/evolusg",
      DIRECT_URL: "postgres://direct-b.example:5432/evolusg",
    },
    preview: {
      RUNTIME_DATABASE_URL: "postgres://pool-c.example:5432/evolusg",
      DIRECT_URL: "postgres://direct-d.example:5432/evolusg",
    },
  };
}

function isolatedTargets(options?: { resourceIds?: boolean }) {
  const targets = {
    ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL: `postgres://app:${secret}@pool-a.example/evolusg`,
    ISOLATION_PRODUCTION_DIRECT_URL: "postgres://direct-b.example/evolusg",
    ISOLATION_PREVIEW_RUNTIME_DATABASE_URL: "postgres://pool-c.example/evolusg",
    ISOLATION_PREVIEW_DIRECT_URL: "postgres://direct-d.example/evolusg",
  };
  if (options?.resourceIds === false) return targets;
  return {
    ...targets,
    ISOLATION_PRODUCTION_DATABASE_ID: "prod-resource",
    ISOLATION_PREVIEW_DATABASE_ID: "preview-resource",
  };
}
