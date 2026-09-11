import "dotenv/config";
import { Client } from "pg";

if (process.env.DATABASE_ENV?.trim().toLowerCase() !== "development") {
  console.log(JSON.stringify({ error: "DATABASE_ENV_NOT_DEVELOPMENT" }));
  process.exit(1);
}

const emails = process.argv.slice(2).map((value) => value.trim().toLowerCase());
if (emails.length === 0 || emails.some((email) => !email.endsWith(".test"))) {
  console.log(JSON.stringify({ error: "SYNTHETIC_TEST_EMAILS_REQUIRED" }));
  process.exit(1);
}

const connectionString =
  process.env.DATABASE_URL?.trim() ||
  process.env.POSTGRES_URL?.trim() ||
  process.env.DIRECT_URL?.trim();

if (!connectionString) {
  console.log(JSON.stringify({ error: "DATABASE_URL_MISSING" }));
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
const users = await client.query(`DELETE FROM "user" WHERE email = ANY($1::text[]) RETURNING email`, [
  emails,
]);
const verifications = await client.query(
  `DELETE FROM verification WHERE identifier = ANY($1::text[]) RETURNING identifier`,
  [emails],
);
await client.end();

console.log(
  JSON.stringify({
    deletedUsers: users.rowCount,
    deletedVerifications: verifications.rowCount,
  }),
);
