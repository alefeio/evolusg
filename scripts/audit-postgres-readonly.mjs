import "dotenv/config";
import { Client } from "pg";

function getDirectUrl() {
  return (
    process.env.DIRECT_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim()
  );
}

function summarizeUrl(raw) {
  if (!raw) {
    return { present: false };
  }

  const parsed = new URL(raw);
  const host = parsed.hostname;
  const maskedHost = host.length <= 6 ? "***" : `${host.slice(0, 3)}***${host.slice(-6)}`;

  return {
    present: true,
    protocol: parsed.protocol.replace(":", ""),
    maskedHost,
    port: parsed.port || null,
    path: parsed.pathname,
    looksPooled:
      host.includes("pooled") ||
      parsed.searchParams.has("pgbouncer") ||
      parsed.protocol.startsWith("prisma+"),
  };
}

const connectionString = getDirectUrl();

if (!connectionString) {
  console.log(JSON.stringify({ error: "NO_DIRECT_DATABASE_URL" }));
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

await client.connect();

const identity = await client.query(`
  SELECT
    current_database() AS database,
    current_schema() AS schema,
    split_part(version(), ',', 1) AS engine
`);

const tables = await client.query(`
  SELECT tablename
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename
`);

const migrationTable = await client.query(`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = '_prisma_migrations'
  ) AS exists
`);

let migrations = [];
if (migrationTable.rows[0]?.exists) {
  const rows = await client.query(`
    SELECT migration_name, finished_at IS NOT NULL AS finished, rolled_back_at IS NOT NULL AS rolled_back
    FROM _prisma_migrations
    ORDER BY started_at
  `);
  migrations = rows.rows;
}

const authTables = ["user", "session", "account", "verification"];
const counts = {};
for (const table of authTables) {
  const present = tables.rows.some((row) => row.tablename === table);
  if (!present) {
    counts[table] = { present: false, rows: 0 };
    continue;
  }
  const result = await client.query(`SELECT COUNT(*)::int AS n FROM "${table}"`);
  counts[table] = { present: true, rows: result.rows[0].n };
}

const otherTables = tables.rows
  .map((row) => row.tablename)
  .filter((name) => !authTables.includes(name) && name !== "_prisma_migrations");

await client.end();

console.log(
  JSON.stringify(
    {
      connection: summarizeUrl(connectionString),
      identity: identity.rows[0],
      publicTables: tables.rows.map((row) => row.tablename),
      prismaMigrationsTable: Boolean(migrationTable.rows[0]?.exists),
      migrations,
      authTableCounts: counts,
      otherPublicTables: otherTables,
    },
    null,
    2,
  ),
);
