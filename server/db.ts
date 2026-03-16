import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  announcements, InsertAnnouncement,
  newsLinks, InsertNewsLink,
  announcementLikes, InsertAnnouncementLike,
  announcementComments, InsertAnnouncementComment,
  communicationPartners, InsertCommunicationPartner,
  auditLogs, InsertAuditLog,
  csTickets, InsertCsTicket,
  leaderReferrals, InsertLeaderReferral,
  urgentNotices, InsertUrgentNotice,
  pushSubscriptions, InsertPushSubscription,
  resources, InsertResource,
  liveFeedConfig, InsertLiveFeedConfig,
  tutorials, InsertTutorial,
  faqItems, InsertFaqItem,
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
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.passwordHash !== undefined) { values.passwordHash = user.passwordHash; updateSet.passwordHash = user.passwordHash; }
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

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

export async function updateUserTotp(userId: number, totpSecret: string | null, totpEnabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ totpSecret, totpEnabled }).where(eq(users.id, userId));
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

export async function updateAnnouncement(id: number, data: Partial<InsertAnnouncement>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(announcements).set(data).where(eq(announcements.id, id));
}

export async function deleteAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Also delete related likes and comments
  await db.delete(announcementLikes).where(eq(announcementLikes.announcementId, id));
  await db.delete(announcementComments).where(eq(announcementComments.announcementId, id));
  await db.delete(announcements).where(eq(announcements.id, id));
}

export async function togglePinAnnouncement(id: number, isPinned: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Unpin all others first if pinning
  if (isPinned) {
    await db.update(announcements).set({ isPinned: false }).where(eq(announcements.isPinned, true));
  }
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
    await db.delete(announcementLikes).where(eq(announcementLikes.id, existing[0].id));
    await db.update(announcements).set({ likeCount: sql`GREATEST(${announcements.likeCount} - 1, 0)` }).where(eq(announcements.id, announcementId));
  } else {
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

export async function updateNewsLink(id: number, data: Partial<InsertNewsLink>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(newsLinks).set(data).where(eq(newsLinks.id, id));
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

export async function getAllPartners() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(communicationPartners)
    .orderBy(desc(communicationPartners.createdAt));
}

export async function deletePartner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communicationPartners).set({ isActive: false }).where(eq(communicationPartners.id, id));
}

export async function hardDeletePartner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(communicationPartners).where(eq(communicationPartners.id, id));
}

export async function updatePartner(id: number, data: Partial<InsertCommunicationPartner>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(communicationPartners).set(data).where(eq(communicationPartners.id, id));
}

// ========== Dashboard Stats ==========

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { announcements: 0, news: 0, partners: 0, comments: 0, totalLikes: 0 };

  const [annCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(announcements);
  const [newsCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(newsLinks);
  const [partnerCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(communicationPartners).where(eq(communicationPartners.isActive, true));
  const [commentCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(announcementComments);
  const [likeSum] = await db.select({ total: sql<number>`COALESCE(SUM(likeCount), 0)` }).from(announcements);

  return {
    announcements: annCount?.count ?? 0,
    news: newsCount?.count ?? 0,
    partners: partnerCount?.count ?? 0,
    comments: commentCount?.count ?? 0,
    totalLikes: likeSum?.total ?? 0,
  };
}

// ========== User Management (Admin) ==========

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, role: "user" | "admin" | "sub_admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function getUserById(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ========== Audit Log queries ==========

export async function createAuditLog(data: InsertAuditLog) {
  const db = await getDb();
  if (!db) { console.warn("[AuditLog] Database not available"); return; }
  try {
    await db.insert(auditLogs).values(data);
  } catch (e) {
    console.error("[AuditLog] Failed to create:", e);
  }
}

export async function getAuditLogs(opts: { limit?: number; offset?: number; action?: string; targetType?: string; userId?: number }) {
  const db = await getDb();
  if (!db) return { logs: [], total: 0 };
  const conditions = [];
  if (opts.action) conditions.push(eq(auditLogs.action, opts.action));
  if (opts.targetType) conditions.push(eq(auditLogs.targetType, opts.targetType));
  if (opts.userId) conditions.push(eq(auditLogs.userId, opts.userId));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [totalResult] = await db.select({ count: sql<number>`COUNT(*)` }).from(auditLogs).where(where);
  const logs = await db.select().from(auditLogs)
    .where(where)
    .orderBy(desc(auditLogs.createdAt))
    .limit(opts.limit ?? 50)
    .offset(opts.offset ?? 0);
  return { logs, total: totalResult?.count ?? 0 };
}

// ========== Scheduled Announcement queries ==========

export async function getScheduledAnnouncements() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return db.select().from(announcements)
    .where(and(
      eq(announcements.status, "scheduled"),
      sql`${announcements.scheduledAt} <= ${now}`
    ));
}

export async function publishScheduledAnnouncement(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(announcements).set({ status: "published" }).where(eq(announcements.id, id));
}

export async function getAnnouncementsByStatus(status: string, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(announcements)
    .where(eq(announcements.status, status))
    .orderBy(desc(announcements.createdAt))
    .limit(limit);
}

// ========== CS Ticket queries ==========

export async function generateTicketNo(): Promise<string> {
  const db = await getDb();
  if (!db) return `CS-${Date.now()}`;
  const [result] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets);
  const num = (result?.count ?? 0) + 1;
  return `CS-${String(num).padStart(5, "0")}`;
}

export async function createCsTicket(data: InsertCsTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(csTickets).values(data);
  return result[0].insertId;
}

export async function getCsTickets(opts: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { tickets: [], total: 0 };
  const conditions = [];
  if (opts.status) conditions.push(eq(csTickets.status, opts.status));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [totalResult] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets).where(where);
  const tickets = await db.select().from(csTickets)
    .where(where)
    .orderBy(desc(csTickets.createdAt))
    .limit(opts.limit ?? 50)
    .offset(opts.offset ?? 0);
  return { tickets, total: totalResult?.count ?? 0 };
}

export async function getCsTicketById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(csTickets).where(eq(csTickets.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCsTicketByNo(ticketNo: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(csTickets).where(eq(csTickets.ticketNo, ticketNo)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function replyCsTicket(id: number, reply: string, repliedBy: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(csTickets).set({
    reply,
    repliedBy,
    repliedAt: new Date(),
    status: "resolved",
  }).where(eq(csTickets.id, id));
}

export async function updateCsTicketStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(csTickets).set({ status }).where(eq(csTickets.id, id));
}

export async function updateCsTicketTelegramMsgId(id: number, telegramMsgId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(csTickets).set({ telegramMsgId }).where(eq(csTickets.id, id));
}

// ========== My Contact (User-registered Partner) ==========

export async function getPartnerByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(communicationPartners)
    .where(eq(communicationPartners.registeredByOpenId, openId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertMyContact(openId: string, data: Partial<InsertCommunicationPartner>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getPartnerByOpenId(openId);
  if (existing) {
    await db.update(communicationPartners).set(data).where(eq(communicationPartners.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(communicationPartners).values({
      name: data.name ?? "Unknown",
      ...data,
      isUserRegistered: true,
      registeredByOpenId: openId,
      isActive: true,
    });
    return result[0].insertId;
  }
}

export async function getCsTicketStats() {
  const db = await getDb();
  if (!db) return { open: 0, inProgress: 0, resolved: 0, closed: 0, total: 0 };
  const [total] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets);
  const [open] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets).where(eq(csTickets.status, "open"));
  const [inProgress] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets).where(eq(csTickets.status, "in_progress"));
  const [resolved] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets).where(eq(csTickets.status, "resolved"));
  const [closed] = await db.select({ count: sql<number>`COUNT(*)` }).from(csTickets).where(eq(csTickets.status, "closed"));
  return {
    open: open?.count ?? 0,
    inProgress: inProgress?.count ?? 0,
    resolved: resolved?.count ?? 0,
    closed: closed?.count ?? 0,
    total: total?.count ?? 0,
  };
}

// ========== Leader Referral queries ==========

export async function createLeaderReferral(data: InsertLeaderReferral) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leaderReferrals).values(data);
  return result[0].insertId;
}

export async function getLeaderReferrals(opts?: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { referrals: [], total: 0 };
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const conditions = [];
  if (opts?.status) conditions.push(eq(leaderReferrals.status, opts.status));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const [totalResult] = await db.select({ count: sql<number>`COUNT(*)` }).from(leaderReferrals).where(whereClause);
  const referrals = await db.select().from(leaderReferrals)
    .where(whereClause)
    .orderBy(desc(leaderReferrals.createdAt))
    .limit(limit)
    .offset(offset);
  return { referrals, total: totalResult?.count ?? 0 };
}

export async function getLeaderReferralById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leaderReferrals).where(eq(leaderReferrals.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateLeaderReferralStatus(id: number, status: string, adminNote?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const data: Record<string, any> = { status };
  if (adminNote !== undefined) data.adminNote = adminNote;
  await db.update(leaderReferrals).set(data).where(eq(leaderReferrals.id, id));
}

export async function getLeaderReferralStats() {
  const db = await getDb();
  if (!db) return { pending: 0, reviewing: 0, approved: 0, rejected: 0, total: 0 };
  const [total] = await db.select({ count: sql<number>`COUNT(*)` }).from(leaderReferrals);
  const [pending] = await db.select({ count: sql<number>`COUNT(*)` }).from(leaderReferrals).where(eq(leaderReferrals.status, "pending"));
  const [reviewing] = await db.select({ count: sql<number>`COUNT(*)` }).from(leaderReferrals).where(eq(leaderReferrals.status, "reviewing"));
  const [approved] = await db.select({ count: sql<number>`COUNT(*)` }).from(leaderReferrals).where(eq(leaderReferrals.status, "approved"));
  const [rejected] = await db.select({ count: sql<number>`COUNT(*)` }).from(leaderReferrals).where(eq(leaderReferrals.status, "rejected"));
  return {
    pending: pending?.count ?? 0,
    reviewing: reviewing?.count ?? 0,
    approved: approved?.count ?? 0,
    rejected: rejected?.count ?? 0,
    total: total?.count ?? 0,
  };
}

// ========== Non-auth Contact Registration (by phone) ==========

export async function registerContactPublic(data: {
  name: string;
  phone?: string | null;
  description?: string | null;
  telegram?: string | null;
  kakao?: string | null;
  openKakaoChat?: string | null;
  whatsapp?: string | null;
  wechat?: string | null;
  personalCommunity?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Look up by name for upsert (since phone is now optional)
  const lookupField = data.phone ? eq(communicationPartners.phone, data.phone) : eq(communicationPartners.name, data.name);
  const existing = await db.select().from(communicationPartners)
    .where(lookupField)
    .limit(1);
  const updateData = {
    name: data.name,
    description: data.description ?? null,
    phone: data.phone ?? null,
    telegram: data.telegram ?? null,
    kakao: data.kakao ?? null,
    openKakaoChat: data.openKakaoChat ?? null,
    whatsapp: data.whatsapp ?? null,
    wechat: data.wechat ?? null,
    personalCommunity: data.personalCommunity ?? null,
  };
  if (existing.length > 0) {
    await db.update(communicationPartners).set(updateData).where(eq(communicationPartners.id, existing[0].id));
    return { id: existing[0].id, isNew: false };
  } else {
    const result = await db.insert(communicationPartners).values({
      ...updateData,
      isUserRegistered: true,
      isActive: true,
    });
    return { id: result[0].insertId, isNew: true };
  }
}

// ========== Urgent Notices queries ==========

export async function createUrgentNotice(data: InsertUrgentNotice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(urgentNotices).values(data);
  return result[0].insertId;
}

export async function getActiveUrgentNotices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(urgentNotices)
    .where(eq(urgentNotices.isActive, true))
    .orderBy(desc(urgentNotices.createdAt))
    .limit(10);
}

export async function getAllUrgentNotices(opts?: { limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { notices: [], total: 0 };
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  const [totalResult] = await db.select({ count: sql<number>`COUNT(*)` }).from(urgentNotices);
  const notices = await db.select().from(urgentNotices)
    .orderBy(desc(urgentNotices.createdAt))
    .limit(limit)
    .offset(offset);
  return { notices, total: totalResult?.count ?? 0 };
}

export async function updateUrgentNoticeActive(id: number, isActive: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(urgentNotices).set({ isActive }).where(eq(urgentNotices.id, id));
}

export async function deleteUrgentNotice(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(urgentNotices).where(eq(urgentNotices.id, id));
}

/** Deactivate all active urgent notices */
export async function deactivateAllUrgentNotices() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(urgentNotices).set({ isActive: false }).where(eq(urgentNotices.isActive, true));
}


// ========== Resources ==========

/** Get resources filtered by language and type. lang='all' resources always included. */
export async function getResources(opts?: { lang?: string; type?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(resources.isActive, true)];
  if (opts?.type) {
    conditions.push(eq(resources.type, opts.type as any));
  }
  if (opts?.lang && opts.lang !== "all") {
    conditions.push(
      sql`(${resources.lang} = ${opts.lang} OR ${resources.lang} = 'all')`
    );
  }
  return db.select().from(resources)
    .where(and(...conditions))
    .orderBy(asc(resources.sortOrder), desc(resources.createdAt));
}

/** Get all resources for admin (no active filter) */
export async function getAllResources(opts?: { type?: string; lang?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [];
  if (opts?.type) conditions.push(eq(resources.type, opts.type as any));
  if (opts?.lang) conditions.push(eq(resources.lang, opts.lang));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  return db.select().from(resources)
    .where(where)
    .orderBy(asc(resources.sortOrder), desc(resources.createdAt));
}

export async function getResourceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createResource(data: Omit<InsertResource, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(resources).values(data as any);
  return { id: Number(result[0].insertId) };
}

export async function updateResource(id: number, data: Partial<InsertResource>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(resources).set(data as any).where(eq(resources.id, id));
}

export async function deleteResource(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(resources).where(eq(resources.id, id));
}

// ========== Live Feed Config ==========

export async function getLiveFeedConfig(key: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(liveFeedConfig).where(eq(liveFeedConfig.configKey, key)).limit(1);
  return rows[0] ?? null;
}

export async function getAllLiveFeedConfigs() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(liveFeedConfig);
}

export async function upsertLiveFeedConfig(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await getLiveFeedConfig(key);
  if (existing) {
    await db.update(liveFeedConfig).set({ configValue: value }).where(eq(liveFeedConfig.configKey, key));
  } else {
    await db.insert(liveFeedConfig).values({ configKey: key, configValue: value });
  }
}

// ========== OG Image Fetcher ==========

/** Fetch Open Graph image from a URL */
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; XPLAYBot/1.0)",
        "Accept": "text/html",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    // Try og:image first
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogMatch?.[1]) return ogMatch[1];
    // Try twitter:image
    const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    if (twMatch?.[1]) return twMatch[1];
    return null;
  } catch (e) {
    console.log("[OG Image] Fetch error:", e);
    return null;
  }
}

// ========== Tutorials ==========

/** Get active tutorials for frontend */
export async function getTutorials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tutorials)
    .where(eq(tutorials.isActive, true))
    .orderBy(asc(tutorials.sortOrder), desc(tutorials.createdAt));
}

/** Get all tutorials for admin */
export async function getAllTutorials() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tutorials)
    .orderBy(asc(tutorials.sortOrder), desc(tutorials.createdAt));
}

export async function getTutorialById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(tutorials).where(eq(tutorials.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createTutorial(data: Omit<InsertTutorial, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tutorials).values(data as any);
  return { id: Number(result[0].insertId) };
}

export async function updateTutorial(id: number, data: Partial<InsertTutorial>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(tutorials).set(data as any).where(eq(tutorials.id, id));
}

export async function deleteTutorial(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(tutorials).where(eq(tutorials.id, id));
}

// ========== FAQ Items ==========

/** Get active FAQ items for frontend */
export async function getFaqItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqItems)
    .where(eq(faqItems.isActive, true))
    .orderBy(asc(faqItems.sortOrder), desc(faqItems.createdAt));
}

/** Get all FAQ items for admin */
export async function getAllFaqItems() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(faqItems)
    .orderBy(asc(faqItems.sortOrder), desc(faqItems.createdAt));
}

export async function getFaqItemById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(faqItems).where(eq(faqItems.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createFaqItem(data: Omit<InsertFaqItem, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(faqItems).values(data as any);
  return { id: Number(result[0].insertId) };
}

export async function updateFaqItem(id: number, data: Partial<InsertFaqItem>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(faqItems).set(data as any).where(eq(faqItems.id, id));
}

export async function deleteFaqItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(faqItems).where(eq(faqItems.id, id));
}


// ========== Push Subscriptions ==========

export async function savePushSubscription(data: { endpoint: string; p256dh: string; auth: string; userAgent?: string | null }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Upsert: if endpoint already exists, update keys
  const existing = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.endpoint, data.endpoint)).limit(1);
  if (existing.length > 0) {
    await db.update(pushSubscriptions).set({ p256dh: data.p256dh, auth: data.auth, userAgent: data.userAgent ?? null }).where(eq(pushSubscriptions.endpoint, data.endpoint));
    return { id: existing[0].id, isNew: false };
  }
  const result = await db.insert(pushSubscriptions).values({
    endpoint: data.endpoint,
    p256dh: data.p256dh,
    auth: data.auth,
    userAgent: data.userAgent ?? null,
  });
  return { id: Number(result[0].insertId), isNew: true };
}

export async function getAllPushSubscriptions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(pushSubscriptions).orderBy(pushSubscriptions.id);
}

export async function deletePushSubscription(endpoint: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
}

export async function getPushSubscriptionCount() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select({ id: pushSubscriptions.id }).from(pushSubscriptions);
  return result.length;
}
