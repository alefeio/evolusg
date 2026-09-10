import "dotenv/config";
import { defineConfig } from "prisma/config";

function getDirectDatabaseUrl() {
  const url =
    process.env.DIRECT_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.DATABASE_URL?.trim();

  if (!url) {
    throw new Error("DIRECT_URL, POSTGRES_URL or DATABASE_URL is not set");
  }

  return url;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDirectDatabaseUrl(),
  },
});
