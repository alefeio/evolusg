export function getRuntimeDatabaseUrl(): string {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  return url;
}

export function getDirectDatabaseUrl(): string {
  const url =
    process.env.DIRECT_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DIRECT_URL, POSTGRES_URL or DATABASE_URL is not set");
  }

  return url;
}

export function readDatabaseEnvLabel(
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  const explicit =
    env.DATABASE_ENV?.trim().toLowerCase() ||
    env.PRISMA_ENV?.trim().toLowerCase() ||
    env.APP_DB_ENV?.trim().toLowerCase();

  if (explicit) {
    return explicit;
  }

  const vercel = env.VERCEL_ENV?.trim().toLowerCase();
  if (vercel === "preview" || vercel === "development" || vercel === "production") {
    return vercel;
  }

  return undefined;
}

export function isSafeMigrationTarget(
  env: Record<string, string | undefined> = process.env,
): boolean {
  const label = readDatabaseEnvLabel(env);
  return label === "development" || label === "preview" || label === "test";
}
