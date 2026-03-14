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
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CommunicationPartner = typeof communicationPartners.$inferSelect;
export type InsertCommunicationPartner = typeof communicationPartners.$inferInsert;
