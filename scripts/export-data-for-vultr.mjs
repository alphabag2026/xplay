/**
 * Export data from Manus DB to SQL INSERT statements for Vultr migration.
 * 
 * Usage:
 *   node scripts/export-data-for-vultr.mjs
 * 
 * This script:
 * 1. Connects to the current DATABASE_URL (Manus DB)
 * 2. Exports FAQ, tutorials, resources, announcements, newsLinks, urgentNotices, liveFeedConfig
 * 3. Generates a .sql file with INSERT ... ON DUPLICATE KEY UPDATE statements
 * 4. The generated SQL can be run on the Vultr DB to sync data
 */
import { createConnection } from "mysql2/promise";
import { writeFileSync } from "fs";
import { resolve } from "path";

// Tables to export with their column definitions
const TABLES_TO_EXPORT = [
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

function escapeValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "1" : "0";
  if (typeof val === "number") return String(val);
  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
  // String: escape single quotes and backslashes
  const escaped = String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
  return `'${escaped}'`;
}

async function main() {
  let dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("[ExportData] DATABASE_URL not set. Run with DATABASE_URL=... node scripts/export-data-for-vultr.mjs");
    process.exit(1);
  }

  console.log("[ExportData] Connecting to source database...");
  const conn = await createConnection(dbUrl);

  const sqlLines = [];
  sqlLines.push("-- ============================================");
  sqlLines.push("-- XPLAY Data Migration: Manus DB → Vultr DB");
  sqlLines.push(`-- Generated: ${new Date().toISOString()}`);
  sqlLines.push("-- ============================================");
  sqlLines.push("");
  sqlLines.push("SET NAMES utf8mb4;");
  sqlLines.push("SET CHARACTER SET utf8mb4;");
  sqlLines.push("");

  let totalRows = 0;

  for (const table of TABLES_TO_EXPORT) {
    console.log(`[ExportData] Exporting ${table.name}...`);
    
    try {
      const [rows] = await conn.execute(`SELECT * FROM ${table.name} ORDER BY id`);
      
      if (!rows || rows.length === 0) {
        sqlLines.push(`-- ${table.name}: No data`);
        sqlLines.push("");
        console.log(`  → ${table.name}: 0 rows`);
        continue;
      }

      sqlLines.push(`-- ===== ${table.name} (${rows.length} rows) =====`);

      for (const row of rows) {
        const values = table.columns.map((col) => escapeValue(row[col]));
        const updateParts = table.updateColumns.map((col) => `${col} = VALUES(${col})`);

        sqlLines.push(
          `INSERT INTO ${table.name} (${table.columns.join(", ")}) VALUES (${values.join(", ")}) ON DUPLICATE KEY UPDATE ${updateParts.join(", ")};`
        );
      }

      sqlLines.push("");
      totalRows += rows.length;
      console.log(`  → ${table.name}: ${rows.length} rows`);
    } catch (err) {
      sqlLines.push(`-- ${table.name}: ERROR - ${err.message}`);
      sqlLines.push("");
      console.warn(`  → ${table.name}: ERROR - ${err.message}`);
    }
  }

  sqlLines.push(`-- Total: ${totalRows} rows exported`);

  const outputPath = resolve(process.cwd(), "scripts/vultr-data-migration.sql");
  writeFileSync(outputPath, sqlLines.join("\n") + "\n", "utf-8");

  console.log(`\n[ExportData] ✅ Exported ${totalRows} rows to ${outputPath}`);
  console.log("[ExportData] To apply on Vultr:");
  console.log("  1. Copy vultr-data-migration.sql to Vultr server");
  console.log("  2. Run: docker compose exec -T mysql mysql -u root -p<password> xplay_db < vultr-data-migration.sql");

  await conn.end();
}

main().catch((err) => {
  console.error("[ExportData] Fatal error:", err.message);
  process.exit(1);
});
