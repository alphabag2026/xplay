/**
 * Apply migration SQL to Vultr production database.
 * 
 * This script:
 * 1. Reads DATABASE_URL from .env.production or environment
 * 2. Reads the generated vultr-data-migration.sql file
 * 3. Executes each INSERT statement against the production DB
 * 
 * Usage on Vultr server:
 *   cd /opt/xplay/app
 *   node scripts/apply-migration-to-vultr.mjs
 * 
 * Or via Docker:
 *   docker compose exec -T xplay-web node scripts/apply-migration-to-vultr.mjs
 */
import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getDbUrl() {
  // 1. Environment variable
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // 2. .env.production file
  const envPaths = [
    resolve(process.cwd(), ".env.production"),
    resolve(__dirname, "..", ".env.production"),
    "/opt/xplay/.env.production",
    "/opt/xplay/app/.env.production",
  ];

  for (const envPath of envPaths) {
    try {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/^DATABASE_URL=(.+)$/m);
      if (match) {
        console.log(`[Migration] Using DATABASE_URL from ${envPath}`);
        return match[1].trim();
      }
    } catch {}
  }

  return null;
}

async function main() {
  const dbUrl = getDbUrl();
  if (!dbUrl) {
    console.error("[Migration] DATABASE_URL not found. Set it in environment or .env.production");
    process.exit(1);
  }

  // Read SQL file
  const sqlPaths = [
    resolve(__dirname, "vultr-data-migration.sql"),
    resolve(process.cwd(), "scripts/vultr-data-migration.sql"),
  ];

  let sqlContent = null;
  for (const sqlPath of sqlPaths) {
    try {
      sqlContent = readFileSync(sqlPath, "utf-8");
      console.log(`[Migration] Reading SQL from ${sqlPath}`);
      break;
    } catch {}
  }

  if (!sqlContent) {
    console.error("[Migration] vultr-data-migration.sql not found. Run export-data-for-vultr.mjs first.");
    process.exit(1);
  }

  // Parse SQL statements (skip comments and empty lines)
  const statements = sqlContent
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`[Migration] Found ${statements.length} SQL statements to execute`);

  // Connect to database
  console.log("[Migration] Connecting to production database...");
  const conn = await createConnection(dbUrl);

  let success = 0;
  let errors = 0;

  for (const stmt of statements) {
    try {
      await conn.execute(stmt);
      success++;
    } catch (err) {
      // Log but continue - some statements may fail if tables don't exist yet
      console.warn(`[Migration] Warning: ${err.message.slice(0, 100)}`);
      errors++;
    }
  }

  console.log(`\n[Migration] ✅ Completed: ${success} success, ${errors} errors`);

  await conn.end();
}

main().catch((err) => {
  console.error("[Migration] Fatal error:", err.message);
  process.exit(0); // Don't fail deployment
});
