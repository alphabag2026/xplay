import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  announcements, InsertAnnouncement,
  newsLinks, InsertNewsLink,
  announcementLikes, InsertAnnouncementLike,
  announcementComments, InsertAnnouncementComment,
  communicationPartners, InsertCommunicationPartner,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ========== User queries ==========

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) { values.lastSignedIn = new Date(); }
    if (Object.keys(updateSet).length === 0) { updateSet.lastSignedIn = new Date(); }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== Announcement queries ==========

export async function createAnnouncement(data: InsertAnnouncement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(announcements).values(data);
  return result[0].insertId;
}

export async function getAnnouncements(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(announcements).orderBy(desc(announcements.createdAt)).limit(limit);
}

export async function getAnnouncementById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(announcements).where(eq(announcements.id, id));
}

export async function togglePinAnnouncement(id: number, isPinned: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(announcements).set({ isPinned }).where(eq(announcements.id, id));
}

export async function getPinnedAnnouncement() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(announcements)
    .where(eq(announcements.isPinned, true))
    .orderBy(desc(announcements.createdAt)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchAnnouncements(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const pattern = `%${query}%`;
  return db.select().from(announcements)
    .where(or(like(announcements.title, pattern), like(announcements.content, pattern)))
    .orderBy(desc(announcements.createdAt)).limit(limit);
}

export async function getPopularAnnouncements(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(announcements)
    .orderBy(desc(announcements.likeCount), desc(announcements.createdAt)).limit(limit);
}

// ========== Likes queries ==========

export async function toggleLike(announcementId: number, visitorId: string): Promise<{ liked: boolean; likeCount: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db.select().from(announcementLikes)
    .where(and(eq(announcementLikes.announcementId, announcementId), eq(announcementLikes.visitorId, visitorId)))
    .limit(1);

  if (existing.length > 0) {
    // Unlike
    await db.delete(announcementLikes).where(eq(announcementLikes.id, existing[0].id));
    await db.update(announcements).set({ likeCount: sql`GREATEST(${announcements.likeCount} - 1, 0)` }).where(eq(announcements.id, announcementId));
  } else {
    // Like
    await db.insert(announcementLikes).values({ announcementId, visitorId });
    await db.update(announcements).set({ likeCount: sql`${announcements.likeCount} + 1` }).where(eq(announcements.id, announcementId));
  }

  const ann = await db.select({ likeCount: announcements.likeCount }).from(announcements).where(eq(announcements.id, announcementId)).limit(1);
  return { liked: existing.length === 0, likeCount: ann[0]?.likeCount ?? 0 };
}

export async function getLikedIds(visitorId: string): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select({ announcementId: announcementLikes.announcementId })
    .from(announcementLikes).where(eq(announcementLikes.visitorId, visitorId));
  return rows.map(r => r.announcementId);
}

// ========== Comments queries ==========

export async function createComment(data: InsertAnnouncementComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(announcementComments).values(data);
  return result[0].insertId;
}

export async function getComments(announcementId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(announcementComments)
    .where(eq(announcementComments.announcementId, announcementId))
    .orderBy(desc(announcementComments.createdAt)).limit(limit);
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(announcementComments).where(eq(announcementComments.id, id));
}

export async function getCommentCount(announcementId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(announcementComments)
    .where(eq(announcementComments.announcementId, announcementId));
  return result[0]?.count ?? 0;
}

// ========== News Links queries ==========

export async function createNewsLink(data: InsertNewsLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsLinks).values(data);
  return result[0].insertId;
}

export async function getNewsLinks(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsLinks).orderBy(desc(newsLinks.createdAt)).limit(limit);
}

export async function getNewsLinkById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(newsLinks).where(eq(newsLinks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteNewsLink(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(newsLinks).where(eq(newsLinks.id, id));
}

export async function updateNewsLinkTranslation(id: number, translatedContent: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(newsLinks).set({ translatedContent }).where(eq(newsLinks.id, id));
}

// ========== Communication Partners queries ==========

export async function createPartner(data: InsertCommunicationPartner) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(communicationPartners).values(data);
  return result[0].insertId;
}

export async function getPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communicationPartners)
    .where(eq(communicationPartners.isActive, true))
    .orderBy(communicationPartners.sortOrder);
}

export async function deletePartner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communicationPartners).set({ isActive: false }).where(eq(communicationPartners.id, id));
}

export async function updatePartner(id: number, data: Partial<InsertCommunicationPartner>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communicationPartners).set(data).where(eq(communicationPartners.id, id));
}
