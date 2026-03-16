/**
 * Ensure admin users have a password hash set.
 * Runs on server startup — if any admin/sub_admin user has a null passwordHash,
 * it sets a default password hash.
 * This handles the case where the DB was created before the self-hosted auth module.
 */
import { hashSync } from "bcryptjs";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq, isNull, inArray, and } from "drizzle-orm";

const DEFAULT_PASSWORD = "admin123";

export async function ensureAdminPassword() {
  try {
    const db = await getDb();
    if (!db) {
      console.log("[EnsureAdminPW] Database not available, skipping");
      return;
    }

    // Find admin/sub_admin users with null passwordHash
    const adminsWithoutPw = await db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(
        and(
          inArray(users.role, ["admin", "sub_admin"]),
          isNull(users.passwordHash)
        )
      );

    if (adminsWithoutPw.length === 0) {
      return; // All admins have passwords, nothing to do
    }

    const hash = hashSync(DEFAULT_PASSWORD, 10);

    for (const admin of adminsWithoutPw) {
      await db
        .update(users)
        .set({ passwordHash: hash })
        .where(eq(users.id, admin.id));
      console.log(
        `[EnsureAdminPW] Set default password for ${admin.email} (role: ${admin.role})`
      );
    }

    console.log(
      `[EnsureAdminPW] Updated ${adminsWithoutPw.length} admin(s) with default password`
    );
  } catch (error) {
    console.error("[EnsureAdminPW] Failed:", error);
  }
}
