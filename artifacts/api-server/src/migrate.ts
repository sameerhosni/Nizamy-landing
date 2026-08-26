import { readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getPool } from "@workspace/db";

const migrationsDir =
  process.env["MIGRATIONS_DIR"] ??
  resolve(dirname(fileURLToPath(import.meta.url)), "..", "migrations");
const pool = getPool();
const client = await pool.connect();

try {
  await client.query("BEGIN");
  await client.query(
    "SELECT pg_advisory_xact_lock(hashtext($1))",
    ["nizamy-schema-migrations"],
  );
  await client.query(`
    CREATE TABLE IF NOT EXISTS "nizamy_schema_migrations" (
      "id" text PRIMARY KEY NOT NULL,
      "applied_at" timestamp with time zone DEFAULT now() NOT NULL
    )
  `);

  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const migrationFile of migrationFiles) {
    const alreadyApplied = await client.query(
      'SELECT 1 FROM "nizamy_schema_migrations" WHERE "id" = $1',
      [migrationFile],
    );

    if (alreadyApplied.rowCount) {
      console.info(`Migration already applied: ${migrationFile}`);
      continue;
    }

    const sql = await readFile(resolve(migrationsDir, migrationFile), "utf8");
    await client.query(sql);
    await client.query(
      'INSERT INTO "nizamy_schema_migrations" ("id") VALUES ($1)',
      [migrationFile],
    );
    console.info(`Migration applied: ${migrationFile}`);
  }

  await client.query("COMMIT");
  console.info("Database migrations completed");
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Database migration failed", error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}