import { describe, expect, it } from "vitest";
import { isSafeMigrationTarget, readDatabaseEnvLabel } from "@/lib/db/urls";

describe("database environment labels", () => {
  it("requires an explicit safe label before migrate/integration", () => {
    expect(readDatabaseEnvLabel({})).toBeUndefined();
    expect(isSafeMigrationTarget({})).toBe(false);
    expect(isSafeMigrationTarget({ DATABASE_ENV: "production" })).toBe(false);
    expect(isSafeMigrationTarget({ DATABASE_ENV: "development" })).toBe(true);
    expect(isSafeMigrationTarget({ VERCEL_ENV: "preview" })).toBe(true);
  });
});
