export function getRuntimeDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const url = env.RUNTIME_DATABASE_URL?.trim() || env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("RUNTIME_DATABASE_URL or DATABASE_URL is not set");
  }

  return url;
}

export function getDirectDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  const url =
    env.DIRECT_URL?.trim() || env.POSTGRES_URL?.trim() || env.DATABASE_URL?.trim();

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
