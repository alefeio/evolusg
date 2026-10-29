import { auditDatabaseIsolation } from "./database-isolation.mjs";

const production = {
  RUNTIME_DATABASE_URL: process.env.ISOLATION_PRODUCTION_RUNTIME_DATABASE_URL,
  DATABASE_URL: process.env.ISOLATION_PRODUCTION_DATABASE_URL,
  DIRECT_URL: process.env.ISOLATION_PRODUCTION_DIRECT_URL,
  POSTGRES_URL: process.env.ISOLATION_PRODUCTION_POSTGRES_URL,
};
const preview = {
  RUNTIME_DATABASE_URL: process.env.ISOLATION_PREVIEW_RUNTIME_DATABASE_URL,
  DATABASE_URL: process.env.ISOLATION_PREVIEW_DATABASE_URL,
  DIRECT_URL: process.env.ISOLATION_PREVIEW_DIRECT_URL,
  POSTGRES_URL: process.env.ISOLATION_PREVIEW_POSTGRES_URL,
};
const productionResourceId = process.env.ISOLATION_PRODUCTION_DATABASE_ID;
const previewResourceId = process.env.ISOLATION_PREVIEW_DATABASE_ID;
const configured = [...Object.values(production), ...Object.values(preview), productionResourceId, previewResourceId].some(
  (value) => value?.trim(),
);
const strict =
  process.env.ISOLATION_AUDIT_REQUIRED === "true" || process.argv.includes("--strict");

if (!configured) {
  console.log("DATABASE_ISOLATION_AUDIT=NOT_CONFIGURED");
  process.exit(strict ? 1 : 0);
}

try {
  const result = auditDatabaseIsolation({
    production,
    preview,
    productionResourceId,
    previewResourceId,
    strict,
  });
  console.log(`DATABASE_ENVIRONMENT_ISOLATION=${result.status}`);
  if (result.fingerprints) {
    console.log(`PRODUCTION_RUNTIME=${result.fingerprints.productionRuntime}`);
    console.log(`PRODUCTION_MIGRATION=${result.fingerprints.productionMigration}`);
    console.log(`PREVIEW_RUNTIME=${result.fingerprints.previewRuntime}`);
    console.log(`PREVIEW_MIGRATION=${result.fingerprints.previewMigration}`);
  }
  if (result.resourceFingerprints) {
    console.log(`PRODUCTION_DATABASE_RESOURCE=${result.resourceFingerprints.production}`);
    console.log(`PREVIEW_DATABASE_RESOURCE=${result.resourceFingerprints.preview}`);
  }
  if (!result.ok) {
    process.exit(1);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "";
  console.log(message === "DATABASE_TARGET_UNPARSEABLE" ? message : "DATABASE_ISOLATION_AUDIT_FAILED");
  process.exit(1);
}
