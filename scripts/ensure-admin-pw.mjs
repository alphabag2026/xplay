/**
 * Force-reset admin password in the database.
 * Run after deployment: node scripts/ensure-admin-pw.mjs
 * Reads DATABASE_URL from environment or .env.production
 */
import { createConnection } from "mysql2/promise";
import bcryptjs from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

const DEFAULT_PASSWORD = "admin123";
const ADMIN_EMAIL = "bro202411@gmail.com";

async function main() {
  // Read DATABASE_URL from env or .env.production
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    try {
      const envFile = readFileSync(resolve(process.cwd(), ".env.production"), "utf-8");
      const match = envFile.match(/^DATABASE_URL=(.+)$/m);
      if (match) dbUrl = match[1].trim();
    } catch (_) {}
  }

  if (!dbUrl) {
    console.log("[EnsureAdminPW] No DATABASE_URL found, skipping");
    process.exit(0);
  }

  console.log("[EnsureAdminPW] Connecting to database...");
  const conn = await createConnection(dbUrl);

  try {
    // Check if admin exists
    const [rows] = await conn.execute(
      "SELECT id, email, passwordHash FROM users WHERE email = ? LIMIT 1",
      [ADMIN_EMAIL]
    );

    if (!rows || rows.length === 0) {
      console.log(`[EnsureAdminPW] No user found with email ${ADMIN_EMAIL}`);
      return;
    }

    const user = rows[0];
    
    // Always force-reset the password to ensure it works
    const hash = bcryptjs.hashSync(DEFAULT_PASSWORD, 10);
    
    // Verify the hash works before saving
    const verifyOk = bcryptjs.compareSync(DEFAULT_PASSWORD, hash);
    console.log(`[EnsureAdminPW] Hash verification: ${verifyOk}`);
    
    await conn.execute(
      "UPDATE users SET passwordHash = ? WHERE id = ?",
      [hash, user.id]
    );

    // Double-check: read back and verify
    const [updated] = await conn.execute(
      "SELECT passwordHash FROM users WHERE id = ? LIMIT 1",
      [user.id]
    );
    if (updated && updated.length > 0) {
      const savedHash = updated[0].passwordHash;
      const finalCheck = bcryptjs.compareSync(DEFAULT_PASSWORD, savedHash);
      console.log(`[EnsureAdminPW] Final DB verification: ${finalCheck} (hash length: ${savedHash?.length})`);
    }

    console.log(`[EnsureAdminPW] Password force-reset for ${ADMIN_EMAIL}`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("[EnsureAdminPW] Error:", err.message);
  process.exit(0); // Don't fail deployment
});
