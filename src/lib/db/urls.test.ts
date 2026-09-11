import { describe, expect, it } from "vitest";
import {
  getDirectDatabaseUrl,
  getRuntimeDatabaseUrl,
  isSafeMigrationTarget,
  readDatabaseEnvLabel,
} from "@/lib/db/urls";

describe("database environment labels", () => {
  it("requires an explicit safe label before migrate/integration", () => {
    expect(readDatabaseEnvLabel({})).toBeUndefined();
    expect(isSafeMigrationTarget({})).toBe(false);
    expect(isSafeMigrationTarget({ DATABASE_ENV: "production" })).toBe(false);
    expect(isSafeMigrationTarget({ DATABASE_ENV: "development" })).toBe(true);
    expect(isSafeMigrationTarget({ VERCEL_ENV: "preview" })).toBe(true);
  });
});

describe("runtime and migration database URLs", () => {
  it("prefers RUNTIME_DATABASE_URL for the application runtime", () => {
    expect(
      getRuntimeDatabaseUrl({
        RUNTIME_DATABASE_URL: "postgres://pooled.example/app",
        DATABASE_URL: "postgres://direct.example/app",
      }),
    ).toBe("postgres://pooled.example/app");
  });

  it("falls back to DATABASE_URL when RUNTIME_DATABASE_URL is absent", () => {
    expect(
      getRuntimeDatabaseUrl({
        DATABASE_URL: "postgres://direct.example/app",
      }),
    ).toBe("postgres://direct.example/app");
  });

  it("fails closed when neither runtime nor fallback URL is set", () => {
    expect(() => getRuntimeDatabaseUrl({})).toThrow(
      "RUNTIME_DATABASE_URL or DATABASE_URL is not set",
    );
  });

  it("prefers DIRECT_URL then POSTGRES_URL then DATABASE_URL for migrations", () => {
    expect(
      getDirectDatabaseUrl({
        DIRECT_URL: "postgres://direct.example/cli",
        POSTGRES_URL: "postgres://postgres.example/cli",
        DATABASE_URL: "postgres://managed.example/app",
        RUNTIME_DATABASE_URL: "postgres://pooled.example/app",
      }),
    ).toBe("postgres://direct.example/cli");

    expect(
      getDirectDatabaseUrl({
        POSTGRES_URL: "postgres://postgres.example/cli",
        DATABASE_URL: "postgres://managed.example/app",
        RUNTIME_DATABASE_URL: "postgres://pooled.example/app",
      }),
    ).toBe("postgres://postgres.example/cli");
  });

  it("does not use RUNTIME_DATABASE_URL for migrations", () => {
    expect(
      getDirectDatabaseUrl({
        RUNTIME_DATABASE_URL: "postgres://pooled.example/app",
        POSTGRES_URL: "postgres://direct.example/app",
        DATABASE_URL: "postgres://managed.example/app",
      }),
    ).toBe("postgres://direct.example/app");

    expect(
      getDirectDatabaseUrl({
        RUNTIME_DATABASE_URL: "postgres://pooled.example/app",
        DATABASE_URL: "postgres://managed.example/app",
      }),
    ).toBe("postgres://managed.example/app");
  });

  it("fails closed when no migration URL is set", () => {
    expect(() =>
      getDirectDatabaseUrl({
        RUNTIME_DATABASE_URL: "postgres://pooled.example/app",
      }),
    ).toThrow("DIRECT_URL, POSTGRES_URL or DATABASE_URL is not set");
  });
});
