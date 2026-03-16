/**
 * Sync data from Manus DB to Vultr DB.
 * 
 * This script connects to both databases and syncs content tables.
 * Run manually or integrate into deployment workflow.
 * 
 * Usage:
 *   SOURCE_DB_URL=mysql://... TARGET_DB_URL=mysql://... node scripts/sync-data-to-vultr.mjs
 * 
 * Or with .env files:
 *   node scripts/sync-data-to-vultr.mjs --source-env .env --target-env .env.production
 */
import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { resolve } from "path";

const TABLES_TO_SYNC = [
  {
    name: "faqItems",
    columns: ["id", "question", "answer", "sortOrder", "isActive", "createdAt", "updatedAt"],
    updateColumns: ["question", "answer", "sortOrder", "isActive", "updatedAt"],
  },
  {
    name: "tutorials",
    columns: ["id", "youtubeId", "videoUrl", "iconName", "iconColor", "title", "description", "tooltip", "category", "steps", "sortOrder", "isActive", "createdAt", "updatedAt"],
    updateColumns: ["youtubeId", "videoUrl", "iconName", "iconColor", "title", "description", "tooltip", "category", "steps", "sortOrder", "isActive", "updatedAt"],
  },
  {
    name: "resources",
    columns: ["id", "type", "lang", "title", "description", "thumbnailUrl", "url", "fileType", "platform", "youtubeId", "sortOrder", "isActive", "createdAt", "updatedAt"],
    updateColumns: ["type", "lang", "title", "description", "thumbnailUrl", "url", "fileType", "platform", "youtubeId", "sortOrder", "isActive", "updatedAt"],
  },
  {
    name: "announcements",
    columns: ["id", "title", "content", "imageUrl", "isPinned", "authorName", "likeCount", "status", "scheduledAt", "createdAt", "updatedAt"],
    updateColumns: ["title", "content", "imageUrl", "isPinned", "authorName", "status", "scheduledAt", "updatedAt"],
  },
  {
    name: "newsLinks",
    columns: ["id", "url", "title", "description", "imageUrl", "siteName", "originalContent", "translatedContent", "authorName", "createdAt", "updatedAt"],
    updateColumns: ["url", "title", "description", "imageUrl", "siteName", "originalContent", "translatedContent", "authorName", "updatedAt"],
  },
  {
    name: "urgentNotices",
    columns: ["id", "message", "meetingType", "meetingLink", "meetingTime", "isActive", "authorName", "createdAt", "updatedAt"],
    updateColumns: ["message", "meetingType", "meetingLink", "meetingTime", "isActive", "authorName", "updatedAt"],
  },
  {
    name: "liveFeedConfig",
    columns: ["id", "configKey", "configValue", "updatedAt"],
    updateColumns: ["configValue", "updatedAt"],
  },
];

function readDbUrlFromEnv(envPath) {
  try {
    const content = readFileSync(resolve(process.cwd(), envPath), "utf-8");
    const match = content.match(/^DATABASE_URL=(.+)$/m);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

async function main() {
  let sourceUrl = process.env.SOURCE_DB_URL || process.env.DATABASE_URL;
  let targetUrl = process.env.TARGET_DB_URL;

  // Fallback: read from env files
  if (!sourceUrl) sourceUrl = readDbUrlFromEnv(".env");
  if (!targetUrl) targetUrl = readDbUrlFromEnv(".env.production");

  if (!sourceUrl) {
    console.error("[Sync] Source DATABASE_URL not found. Set SOURCE_DB_URL or DATABASE_URL.");
    process.exit(1);
  }
  if (!targetUrl) {
    console.error("[Sync] Target DATABASE_URL not found. Set TARGET_DB_URL or create .env.production.");
    process.exit(1);
  }

  console.log("[Sync] Connecting to source (Manus) DB...");
  const source = await createConnection(sourceUrl);

  console.log("[Sync] Connecting to target (Vultr) DB...");
  const target = await createConnection(targetUrl);

  let totalSynced = 0;

  for (const table of TABLES_TO_SYNC) {
    console.log(`[Sync] Syncing ${table.name}...`);

    try {
      const [rows] = await source.execute(`SELECT * FROM ${table.name} ORDER BY id`);

      if (!rows || rows.length === 0) {
        console.log(`  → ${table.name}: 0 rows (skip)`);
        continue;
      }

      for (const row of rows) {
        const placeholders = table.columns.map(() => "?").join(", ");
        const values = table.columns.map((col) => row[col] ?? null);
        const updateParts = table.updateColumns.map((col) => `${col} = VALUES(${col})`).join(", ");

        const sql = `INSERT INTO ${table.name} (${table.columns.join(", ")}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateParts}`;

        await target.execute(sql, values);
      }

      totalSynced += rows.length;
      console.log(`  → ${table.name}: ${rows.length} rows synced`);
    } catch (err) {
      console.warn(`  → ${table.name}: ERROR - ${err.message}`);
    }
  }

  console.log(`\n[Sync] ✅ Total ${totalSynced} rows synced to Vultr DB`);

  await source.end();
  await target.end();
}

main().catch((err) => {
  console.error("[Sync] Fatal error:", err.message);
  process.exit(1);
});
