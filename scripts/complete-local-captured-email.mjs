import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

const email = process.argv[2]?.trim().toLowerCase();
const action = process.argv[3]?.trim() || "verify";

if (!email || !email.endsWith(".test")) {
  console.log(JSON.stringify({ error: "SYNTHETIC_TEST_EMAIL_REQUIRED" }));
  process.exit(1);
}

if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV) {
  console.log(JSON.stringify({ error: "LOCAL_DEVELOPMENT_ONLY" }));
  process.exit(1);
}

if (process.env.DATABASE_ENV?.trim().toLowerCase() !== "development") {
  console.log(JSON.stringify({ error: "DATABASE_ENV_NOT_DEVELOPMENT" }));
  process.exit(1);
}

const captureRel = process.env.AUTH_EMAIL_CAPTURE_FILE?.trim();
if (!captureRel) {
  console.log(JSON.stringify({ error: "AUTH_EMAIL_CAPTURE_FILE_MISSING" }));
  process.exit(1);
}

const capturePath = path.resolve(captureRel);
if (!fs.existsSync(capturePath)) {
  console.log(JSON.stringify({ error: "CAPTURE_FILE_MISSING", found: false }));
  process.exit(1);
}

const inbox = JSON.parse(fs.readFileSync(capturePath, "utf8"));
const subjectNeedle = action === "reset" ? "Redefinir" : "Confirme";
const messages = inbox.filter(
  (item) => String(item.to).toLowerCase() === email && String(item.subject).includes(subjectNeedle),
);
const latest = messages.at(-1);

if (!latest) {
  console.log(JSON.stringify({ error: "CAPTURE_MESSAGE_MISSING", action, found: false }));
  process.exit(1);
}

const blob = `${latest.text}\n${latest.html}`.replaceAll("&amp;", "&");
const tokenMatch = blob.match(/[?&]token=([^&\s"'<>]+)/);
const token = tokenMatch?.[1] ? decodeURIComponent(tokenMatch[1]) : null;

if (!token) {
  console.log(JSON.stringify({ error: "TOKEN_MISSING_IN_CAPTURE", action }));
  process.exit(1);
}

const baseURL = process.env.BETTER_AUTH_URL?.trim() || "http://localhost:3000";

let url;
if (action === "reset") {
  url = `${baseURL}/api/auth/reset-password`;
} else {
  url = `${baseURL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
}

let response;
if (action === "reset") {
  const newPassword = process.argv[4];
  if (!newPassword) {
    console.log(JSON.stringify({ error: "NEW_PASSWORD_REQUIRED" }));
    process.exit(1);
  }
  response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
    redirect: "manual",
  });
} else {
  response = await fetch(url, { redirect: "manual" });
}

console.log(
  JSON.stringify({
    action,
    ok: response.ok || response.status === 302,
    status: response.status,
  }),
);
