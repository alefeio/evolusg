import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");
const TEST_ALLOWLIST = "sprint1.local@example.test,sprint1.integration@example.test";

if (!fs.existsSync(envPath)) {
  console.log("No local .env file found; skipped.");
  process.exit(0);
}

let current = fs.readFileSync(envPath, "utf8");
if (!current.endsWith("\n")) {
  current += "\n";
}

function readValue(key) {
  const match = current.match(new RegExp(`^${key}=(.*)`, "m"));
  if (!match) {
    return null;
  }
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function upsert(key, value) {
  const line = `${key}=${value}`;
  if (new RegExp(`^${key}=`, "m").test(current)) {
    current = current.replace(new RegExp(`^${key}=.*$`, "m"), line);
    return "updated";
  }
  current += `${line}\n`;
  return "appended";
}

const actions = [];

const secret = readValue("BETTER_AUTH_SECRET");
if (!secret) {
  actions.push(`BETTER_AUTH_SECRET:${upsert("BETTER_AUTH_SECRET", crypto.randomBytes(32).toString("base64url"))}`);
} else {
  actions.push("BETTER_AUTH_SECRET:preserved");
}

if (!readValue("BETTER_AUTH_URL")) {
  actions.push(`BETTER_AUTH_URL:${upsert("BETTER_AUTH_URL", "http://localhost:3000")}`);
} else {
  actions.push("BETTER_AUTH_URL:preserved");
}

if (!readValue("PILOT_REGISTRATION_ENABLED")) {
  actions.push(`PILOT_REGISTRATION_ENABLED:${upsert("PILOT_REGISTRATION_ENABLED", "true")}`);
} else {
  actions.push("PILOT_REGISTRATION_ENABLED:preserved");
}

const allowlist = readValue("PILOT_ALLOWED_EMAILS");
if (!allowlist) {
  actions.push(`PILOT_ALLOWED_EMAILS:${upsert("PILOT_ALLOWED_EMAILS", TEST_ALLOWLIST)}`);
} else {
  actions.push("PILOT_ALLOWED_EMAILS:preserved");
}

if (!readValue("AUTH_EMAIL_CAPTURE_FILE")) {
  actions.push(`AUTH_EMAIL_CAPTURE_FILE:${upsert("AUTH_EMAIL_CAPTURE_FILE", ".local-email-capture.json")}`);
} else {
  actions.push("AUTH_EMAIL_CAPTURE_FILE:preserved");
}

fs.writeFileSync(envPath, current);
console.log(JSON.stringify({ envFile: "ignored", actions }));
