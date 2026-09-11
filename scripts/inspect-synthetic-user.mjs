import "dotenv/config";
import { Client } from "pg";

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.endsWith(".test")) {
  console.log(JSON.stringify({ error: "SYNTHETIC_TEST_EMAIL_REQUIRED" }));
  process.exit(1);
}

if (process.env.DATABASE_ENV?.trim().toLowerCase() !== "development") {
  console.log(JSON.stringify({ error: "DATABASE_ENV_NOT_DEVELOPMENT" }));
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

const user = await client.query(
  `SELECT id, name, "emailVerified" AS verified FROM "user" WHERE email = $1`,
  [email],
);

if (user.rowCount === 0) {
  await client.end();
  console.log(JSON.stringify({ found: false, emailVerified: null, accounts: 0, sessions: 0 }));
  process.exit(0);
}

const id = user.rows[0].id;
const accounts = await client.query(`SELECT COUNT(*)::int AS n FROM account WHERE "userId" = $1`, [id]);
const sessions = await client.query(`SELECT COUNT(*)::int AS n FROM session WHERE "userId" = $1`, [id]);
await client.end();

console.log(
  JSON.stringify({
    found: true,
    emailVerified: user.rows[0].verified,
    namePresent: Boolean(user.rows[0].name),
    accounts: accounts.rows[0].n,
    sessions: sessions.rows[0].n,
  }),
);
