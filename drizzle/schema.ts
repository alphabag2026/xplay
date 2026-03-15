import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "sub_admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Announcements table for the notice board.
 * Supports title, content, optional image, and pinning.
 * Created via Telegram bot or admin API.
 */
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  isPinned: boolean("isPinned").default(false).notNull(),
  authorName: varchar("authorName", { length: 100 }).default("XPLAY Admin").notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  /** 'published' | 'scheduled' | 'draft' */
  status: varchar("status", { length: 20 }).default("published").notNull(),
  /** When status='scheduled', publish at this time (UTC ms) */
  scheduledAt: timestamp("scheduledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = typeof announcements.$inferInsert;

/**
 * News links shared via Telegram bot.
 * Stores URL, extracted metadata (OG tags), and translated content.
 */
export const newsLinks = mysqlTable("newsLinks", {
  id: int("id").autoincrement().primaryKey(),
  url: text("url").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  siteName: varchar("siteName", { length: 200 }),
  /** Original page content (extracted) */
  originalContent: text("originalContent"),
  /** JSON object: { ko: "...", en: "...", zh: "...", ja: "...", vi: "...", th: "..." } */
  translatedContent: text("translatedContent"),
  authorName: varchar("authorName", { length: 100 }).default("XPLAY Admin").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NewsLink = typeof newsLinks.$inferSelect;
export type InsertNewsLink = typeof newsLinks.$inferInsert;

/**
 * Announcement likes — tracks which visitor liked which announcement.
 * Uses visitorId (fingerprint or session) since auth is optional.
 */
export const announcementLikes = mysqlTable("announcementLikes", {
  id: int("id").autoincrement().primaryKey(),
  announcementId: int("announcementId").notNull(),
  visitorId: varchar("visitorId", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnnouncementLike = typeof announcementLikes.$inferSelect;
export type InsertAnnouncementLike = typeof announcementLikes.$inferInsert;

/**
 * Announcement comments — visitors can leave comments on announcements.
 */
export const announcementComments = mysqlTable("announcementComments", {
  id: int("id").autoincrement().primaryKey(),
  announcementId: int("announcementId").notNull(),
  nickname: varchar("nickname", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnnouncementComment = typeof announcementComments.$inferSelect;
export type InsertAnnouncementComment = typeof announcementComments.$inferInsert;

/**
 * Communication partners — referral contacts with various messaging platforms.
 */
export const communicationPartners = mysqlTable("communicationPartners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  phone: varchar("phone", { length: 50 }),
  telegram: varchar("telegram", { length: 100 }),
  kakao: varchar("kakao", { length: 100 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  wechat: varchar("wechat", { length: 100 }),
  avatarUrl: text("avatarUrl"),
  /** Whether this was registered by a user (vs admin/telegram) */
  isUserRegistered: boolean("isUserRegistered").default(false).notNull(),
  /** User's openId if registered by a logged-in user */
  registeredByOpenId: varchar("registeredByOpenId", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunicationPartner = typeof communicationPartners.$inferSelect;
export type InsertCommunicationPartner = typeof communicationPartners.$inferInsert;

/**
 * Audit logs — tracks all admin/sub_admin actions in the back-office.
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 200 }),
  userRole: varchar("userRole", { length: 20 }),
  action: varchar("action", { length: 50 }).notNull(),
  targetType: varchar("targetType", { length: 50 }).notNull(),
  targetId: int("targetId"),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * CS Support Tickets — customer inquiries sent to company via Telegram.
 * Users can submit questions, and admins respond via back-office or Telegram bot.
 */
export const csTickets = mysqlTable("csTickets", {
  id: int("id").autoincrement().primaryKey(),
  /** Ticket number for display (e.g., CS-00001) */
  ticketNo: varchar("ticketNo", { length: 20 }).notNull().unique(),
  /** Submitter name (nickname or registered name) */
  name: varchar("name", { length: 200 }).notNull(),
  /** Submitter contact (email, phone, telegram, etc.) */
  contact: varchar("contact", { length: 300 }),
  /** Category: general, technical, billing, partnership, etc. */
  category: varchar("category", { length: 50 }).default("general").notNull(),
  /** Subject line */
  subject: varchar("subject", { length: 500 }).notNull(),
  /** Detailed message */
  message: text("message").notNull(),
  /** Status: open, in_progress, resolved, closed */
  status: varchar("status", { length: 20 }).default("open").notNull(),
  /** Priority: low, normal, high, urgent */
  priority: varchar("priority", { length: 20 }).default("normal").notNull(),
  /** Admin reply */
  reply: text("reply"),
  /** Admin who replied */
  repliedBy: varchar("repliedBy", { length: 200 }),
  repliedAt: timestamp("repliedAt"),
  /** Telegram message ID for notification tracking */
  telegramMsgId: int("telegramMsgId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CsTicket = typeof csTickets.$inferSelect;
export type InsertCsTicket = typeof csTickets.$inferInsert;

/**
 * Leader Referrals — recommend leaders for business partnership.
 * Collects detailed info: referrer, contact, type (self/acquaintance),
 * previous experience, team size, organization structure, introduction.
 */
export const leaderReferrals = mysqlTable("leaderReferrals", {
  id: int("id").autoincrement().primaryKey(),
  /** 추천 유형: self (본인 추천), acquaintance (지인 추천) */
  referralType: mysqlEnum("referralType", ["self", "acquaintance"]).notNull(),
  /** 추천자 이름 (본인 or 지인 추천 시 추천하는 사람) */
  referrerName: varchar("referrerName", { length: 200 }).notNull(),
  /** 추천자 연락처 */
  referrerContact: varchar("referrerContact", { length: 300 }).notNull(),
  /** 추천자 이메일 */
  referrerEmail: varchar("referrerEmail", { length: 320 }),
  /** 리더 이름 (추천 대상 - 지인 추천 시) */
  leaderName: varchar("leaderName", { length: 200 }),
  /** 리더 연락처 (추천 대상 - 지인 추천 시) */
  leaderContact: varchar("leaderContact", { length: 300 }),
  /** 이전 이력 / 경력 */
  previousExperience: text("previousExperience"),
  /** 팀 규모 (몇 명) */
  teamSize: varchar("teamSize", { length: 100 }),
  /** 조직 구성 설명 */
  organizationStructure: text("organizationStructure"),
  /** 활동 지역 / 국가 */
  region: varchar("region", { length: 200 }),
  /** 주요 활동 분야 (crypto, forex, MLM, etc.) */
  expertise: varchar("expertise", { length: 300 }),
  /** 소개글 / 자기소개 */
  introduction: text("introduction"),
  /** 추가 메모 */
  additionalNotes: text("additionalNotes"),
  /** 상태: pending, reviewing, approved, rejected */
  status: varchar("status", { length: 20 }).default("pending").notNull(),
  /** 관리자 메모 */
  adminNote: text("adminNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeaderReferral = typeof leaderReferrals.$inferSelect;
export type InsertLeaderReferral = typeof leaderReferrals.$inferInsert;

/**
 * Push subscriptions — stores browser push notification subscriptions.
 */
export const pushSubscriptions = mysqlTable("pushSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  /** Browser push subscription endpoint */
  endpoint: text("endpoint").notNull(),
  /** p256dh key */
  p256dh: text("p256dh").notNull(),
  /** auth key */
  auth: text("auth").notNull(),
  /** Optional user agent for debugging */
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;
