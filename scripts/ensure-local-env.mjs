import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");

if (!fs.existsSync(envPath)) {
  console.log("No local .env file found; skipped secret append.");
  process.exit(0);
}

const current = fs.readFileSync(envPath, "utf8");
const additions = [];

function missing(key) {
  return !new RegExp(`^${key}=`, "m").test(current);
}

if (missing("BETTER_AUTH_SECRET")) {
  additions.push(`BETTER_AUTH_SECRET=${crypto.randomBytes(32).toString("base64url")}`);
}

if (missing("BETTER_AUTH_URL")) {
  additions.push("BETTER_AUTH_URL=http://localhost:3000");
}

if (missing("RESEND_API_KEY")) {
  additions.push("RESEND_API_KEY=");
}

if (missing("EMAIL_FROM")) {
  additions.push("EMAIL_FROM=");
}

if (missing("PILOT_REGISTRATION_ENABLED")) {
  additions.push("PILOT_REGISTRATION_ENABLED=true");
}

if (missing("PILOT_ALLOWED_EMAILS")) {
  additions.push("PILOT_ALLOWED_EMAILS=");
}

if (additions.length === 0) {
  console.log("Sprint 1 env keys already present (values not printed).");
  process.exit(0);
}

fs.appendFileSync(
  envPath,
  `\n# Sprint 1 local keys (do not commit)\n${additions.join("\n")}\n`,
);
console.log(`Appended ${additions.length} Sprint 1 env keys (values not printed).`);
