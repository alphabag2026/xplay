import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router, adminProcedure, subAdminProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getAnnouncements, getAnnouncementById, getPinnedAnnouncement,
  searchAnnouncements, getPopularAnnouncements,
  toggleLike, getLikedIds,
  createComment, getComments, getCommentCount, deleteComment,
  getNewsLinks, getNewsLinkById, updateNewsLinkTranslation,
  getPartners,
  createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePinAnnouncement,
  createNewsLink, updateNewsLink, deleteNewsLink,
  createPartner, updatePartner, deletePartner, hardDeletePartner, getAllPartners,
  getDashboardStats,
  getAllUsers, updateUserRole, getUserById,
  createAuditLog, getAuditLogs,
  getScheduledAnnouncements, publishScheduledAnnouncement, getAnnouncementsByStatus,
  generateTicketNo, createCsTicket, getCsTickets, getCsTicketById, getCsTicketByNo,
  replyCsTicket, updateCsTicketStatus, getCsTicketStats,
  getPartnerByOpenId, upsertMyContact,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { r2Upload, r2Delete, r2List, r2HealthCheck, generateFileKey } from "./r2Storage";

// ========== Audit log helper ==========
async function logAction(ctx: { user: { id: number; name: string | null; role: string }; req: { ip?: string; headers: Record<string, any> } }, action: string, targetType: string, targetId?: number, details?: string) {
  const ip = ctx.req.headers["x-forwarded-for"] as string || ctx.req.ip || "unknown";
  await createAuditLog({
    userId: ctx.user.id,
    userName: ctx.user.name ?? "Unknown",
    userRole: ctx.user.role,
    action,
    targetType,
    targetId: targetId ?? null,
    details: details ?? null,
    ipAddress: typeof ip === "string" ? ip.split(",")[0].trim() : "unknown",
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ========== Public Announcements ==========
  announcements: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
      .query(async ({ input }) => {
        return getAnnouncements(input?.limit ?? 50);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await getAnnouncementById(input.id);
        return result ?? null;
      }),

    pinned: publicProcedure.query(async () => {
      const result = await getPinnedAnnouncement();
      return result ?? null;
    }),

    search: publicProcedure
      .input(z.object({ query: z.string().min(1).max(200), limit: z.number().min(1).max(50).optional() }))
      .query(async ({ input }) => {
        return searchAnnouncements(input.query, input.limit ?? 20);
      }),

    popular: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
      .query(async ({ input }) => {
        return getPopularAnnouncements(input?.limit ?? 10);
      }),

    toggleLike: publicProcedure
      .input(z.object({ announcementId: z.number(), visitorId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        return toggleLike(input.announcementId, input.visitorId);
      }),

    likedIds: publicProcedure
      .input(z.object({ visitorId: z.string().min(1) }))
      .query(async ({ input }) => {
        return getLikedIds(input.visitorId);
      }),

    comments: publicProcedure
      .input(z.object({ announcementId: z.number(), limit: z.number().min(1).max(100).optional() }))
      .query(async ({ input }) => {
        return getComments(input.announcementId, input.limit ?? 50);
      }),

    commentCount: publicProcedure
      .input(z.object({ announcementId: z.number() }))
      .query(async ({ input }) => {
        return getCommentCount(input.announcementId);
      }),

    addComment: publicProcedure
      .input(z.object({
        announcementId: z.number(),
        nickname: z.string().min(1).max(100),
        content: z.string().min(1).max(2000),
      }))
      .mutation(async ({ input }) => {
        const id = await createComment({
          announcementId: input.announcementId,
          nickname: input.nickname,
          content: input.content,
        });
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          if (botToken) {
            const ann = await getAnnouncementById(input.announcementId);
            const text = `💬 새 댓글 알림\n\n📌 공지: ${ann?.title ?? `#${input.announcementId}`}\n👤 작성자: ${input.nickname}\n📝 내용: ${input.content.substring(0, 200)}`;
            // TODO: send to telegram
          }
        } catch (e) {
          console.error("[Comment Notification] Error:", e);
        }
        return { success: true, id };
      }),
  }),

  // ========== Public News ==========
  news: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
      .query(async ({ input }) => {
        return getNewsLinks(input?.limit ?? 20);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await getNewsLinkById(input.id);
        return result ?? null;
      }),

    translate: publicProcedure
      .input(z.object({ id: z.number(), targetLang: z.string().min(2).max(5) }))
      .mutation(async ({ input }) => {
        const news = await getNewsLinkById(input.id);
        if (!news) return { success: false, error: "News not found" };
        let translations: Record<string, string> = {};
        if (news.translatedContent) {
          try { translations = JSON.parse(news.translatedContent); } catch {}
        }
        if (translations[input.targetLang]) {
          return { success: true, translation: translations[input.targetLang] };
        }
        const langNames: Record<string, string> = {
          ko: "Korean", en: "English", zh: "Chinese", ja: "Japanese", vi: "Vietnamese", th: "Thai",
        };
        const targetName = langNames[input.targetLang] || input.targetLang;
        const contentToTranslate = news.description || news.title;
        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: `You are a professional translator. Translate the following text to ${targetName}. Return ONLY the translated text, nothing else.` },
              { role: "user", content: contentToTranslate },
            ],
          });
          const rawContent = response.choices?.[0]?.message?.content;
          const translated = (typeof rawContent === 'string' ? rawContent.trim() : contentToTranslate);
          translations[input.targetLang] = translated;
          await updateNewsLinkTranslation(input.id, JSON.stringify(translations));
          return { success: true, translation: translated };
        } catch (e) {
          console.error("[Translation] Error:", e);
          return { success: false, error: "Translation failed" };
        }
      }),
  }),

  // ========== Public Partners ==========
  partners: router({
    list: publicProcedure.query(async () => {
      return getPartners();
    }),
  }),

  // ========== My Contact (User-registered Partner) ==========
  myContact: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const result = await getPartnerByOpenId(ctx.user.openId);
      return result ?? null;
    }),

    upsert: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        description: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        telegram: z.string().nullable().optional(),
        kakao: z.string().nullable().optional(),
        whatsapp: z.string().nullable().optional(),
        wechat: z.string().nullable().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await upsertMyContact(ctx.user.openId, {
          name: input.name,
          description: input.description ?? null,
          phone: input.phone ?? null,
          telegram: input.telegram ?? null,
          kakao: input.kakao ?? null,
          whatsapp: input.whatsapp ?? null,
          wechat: input.wechat ?? null,
        });
        return { success: true, id };
      }),
  }),

  // ========== CS Support Tickets ==========
  cs: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        contact: z.string().max(300).optional(),
        category: z.enum(["general", "technical", "billing", "partnership", "other"]).optional(),
        subject: z.string().min(1).max(500),
        message: z.string().min(1).max(5000),
      }))
      .mutation(async ({ input }) => {
        const ticketNo = await generateTicketNo();
        const id = await createCsTicket({
          ticketNo,
          name: input.name,
          contact: input.contact ?? null,
          category: input.category ?? "general",
          subject: input.subject,
          message: input.message,
        });

        // Send Telegram notification
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          const botSecret = process.env.TELEGRAM_BOT_SECRET;
          if (botToken) {
            const categoryLabels: Record<string, string> = {
              general: "일반 문의", technical: "기술 지원", billing: "결제/수익",
              partnership: "파트너십", other: "기타",
            };
            const text = [
              `🎧 새 CS 문의 접수 [${ticketNo}]`,
              ``,
              `📌 카테고리: ${categoryLabels[input.category ?? "general"] ?? input.category}`,
              `👤 이름: ${input.name}`,
              input.contact ? `📞 연락처: ${input.contact}` : "",
              `📋 제목: ${input.subject}`,
              ``,
              `📝 내용:`,
              input.message.substring(0, 500),
              ``,
              `💡 답변: /답변 ${ticketNo} [답변내용]`,
            ].filter(Boolean).join("\n");

            // We'll use the webhook URL approach - notify via internal API
            const webhookUrl = process.env.SITE_URL || "";
            if (webhookUrl) {
              // Use fetch to call telegram API directly
              const chatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(",") ?? [];
              for (const chatId of chatIds) {
                try {
                  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ chat_id: chatId.trim(), text, parse_mode: "HTML" }),
                  });
                } catch (e) {
                  console.error(`[CS] Failed to notify chat ${chatId}:`, e);
                }
              }
            }
          }
        } catch (e) {
          console.error("[CS Notification] Error:", e);
        }

        return { success: true, ticketNo, id };
      }),

    myTickets: publicProcedure
      .input(z.object({ name: z.string().min(1), contact: z.string().optional() }))
      .query(async ({ input }) => {
        // Simple lookup by name (since no auth required for CS)
        const { tickets } = await getCsTickets({ limit: 50 });
        return tickets.filter(t => t.name === input.name || (input.contact && t.contact === input.contact));
      }),

    getByNo: publicProcedure
      .input(z.object({ ticketNo: z.string().min(1) }))
      .query(async ({ input }) => {
        const result = await getCsTicketByNo(input.ticketNo);
        return result ?? null;
      }),
  }),

  // ========== Admin Back-Office ==========
  admin: router({
    // Dashboard stats (sub_admin accessible)
    stats: subAdminProcedure.query(async () => {
      return getDashboardStats();
    }),

    // R2 health check
    r2Health: adminProcedure.query(async () => {
      return r2HealthCheck();
    }),

    // ===== Audit Logs =====
    auditLogs: router({
      list: adminProcedure
        .input(z.object({
          limit: z.number().min(1).max(200).optional(),
          offset: z.number().min(0).optional(),
          action: z.string().optional(),
          targetType: z.string().optional(),
          userId: z.number().optional(),
        }).optional())
        .query(async ({ input }) => {
          return getAuditLogs({
            limit: input?.limit ?? 50,
            offset: input?.offset ?? 0,
            action: input?.action,
            targetType: input?.targetType,
            userId: input?.userId,
          });
        }),
    }),

    // ===== Announcement CRUD =====
    announcements: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().min(1).max(200).optional(), status: z.string().optional() }).optional())
        .query(async ({ input }) => {
          if (input?.status) {
            return getAnnouncementsByStatus(input.status, input?.limit ?? 100);
          }
          return getAnnouncements(input?.limit ?? 100);
        }),

      create: adminProcedure
        .input(z.object({
          title: z.string().min(1).max(500),
          content: z.string().min(1),
          imageUrl: z.string().nullable().optional(),
          isPinned: z.boolean().optional(),
          authorName: z.string().optional(),
          status: z.enum(["published", "scheduled", "draft"]).optional(),
          scheduledAt: z.string().nullable().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const id = await createAnnouncement({
            title: input.title,
            content: input.content,
            imageUrl: input.imageUrl ?? null,
            isPinned: input.isPinned ?? false,
            authorName: input.authorName ?? "XPLAY Admin",
            status: input.status ?? "published",
            scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
          });
          await logAction(ctx, "create", "announcement", id, `제목: ${input.title}${input.status === "scheduled" ? ` (예약: ${input.scheduledAt})` : ""}`);
          return { success: true, id };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          title: z.string().min(1).max(500).optional(),
          content: z.string().min(1).optional(),
          imageUrl: z.string().nullable().optional(),
          authorName: z.string().optional(),
          status: z.enum(["published", "scheduled", "draft"]).optional(),
          scheduledAt: z.string().nullable().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { id, scheduledAt, ...rest } = input;
          const data: Record<string, any> = { ...rest };
          if (scheduledAt !== undefined) {
            data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
          }
          await updateAnnouncement(id, data);
          await logAction(ctx, "update", "announcement", id, `수정: ${Object.keys(rest).join(", ")}`);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          const ann = await getAnnouncementById(input.id);
          await deleteAnnouncement(input.id);
          await logAction(ctx, "delete", "announcement", input.id, `삭제: ${ann?.title ?? "unknown"}`);
          return { success: true };
        }),

      togglePin: adminProcedure
        .input(z.object({ id: z.number(), isPinned: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
          await togglePinAnnouncement(input.id, input.isPinned);
          await logAction(ctx, input.isPinned ? "pin" : "unpin", "announcement", input.id);
          return { success: true };
        }),

      deleteComment: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await deleteComment(input.id);
          await logAction(ctx, "delete", "comment", input.id);
          return { success: true };
        }),
    }),

    // ===== User Management (admin only) =====
    users: router({
      list: adminProcedure.query(async () => {
        return getAllUsers();
      }),

      updateRole: adminProcedure
        .input(z.object({
          userId: z.number(),
          role: z.enum(["user", "admin", "sub_admin"]),
        }))
        .mutation(async ({ input, ctx }) => {
          if (ctx.user.id === input.userId) {
            return { success: false, error: "자신의 역할은 변경할 수 없습니다." };
          }
          const targetUser = await getUserById(input.userId);
          if (!targetUser) return { success: false, error: "사용자를 찾을 수 없습니다." };
          await updateUserRole(input.userId, input.role);
          await logAction(ctx, "updateRole", "user", input.userId, `${targetUser.name}: ${targetUser.role} → ${input.role}`);
          return { success: true };
        }),
    }),

    // ===== News CRUD (sub_admin accessible) =====
    news: router({
      list: subAdminProcedure
        .input(z.object({ limit: z.number().min(1).max(200).optional() }).optional())
        .query(async ({ input }) => {
          return getNewsLinks(input?.limit ?? 100);
        }),

      create: subAdminProcedure
        .input(z.object({
          url: z.string().min(1),
          title: z.string().min(1).max(500),
          description: z.string().nullable().optional(),
          imageUrl: z.string().nullable().optional(),
          siteName: z.string().nullable().optional(),
          originalContent: z.string().nullable().optional(),
          authorName: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const id = await createNewsLink({
            url: input.url,
            title: input.title,
            description: input.description ?? null,
            imageUrl: input.imageUrl ?? null,
            siteName: input.siteName ?? null,
            originalContent: input.originalContent ?? null,
            translatedContent: null,
            authorName: input.authorName ?? "XPLAY Admin",
          });
          await logAction(ctx, "create", "news", id, `뉴스: ${input.title}`);
          return { success: true, id };
        }),

      update: subAdminProcedure
        .input(z.object({
          id: z.number(),
          url: z.string().optional(),
          title: z.string().max(500).optional(),
          description: z.string().nullable().optional(),
          imageUrl: z.string().nullable().optional(),
          siteName: z.string().nullable().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { id, ...data } = input;
          await updateNewsLink(id, data);
          await logAction(ctx, "update", "news", id);
          return { success: true };
        }),

      delete: subAdminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await deleteNewsLink(input.id);
          await logAction(ctx, "delete", "news", input.id);
          return { success: true };
        }),
    }),

    // ===== Partners CRUD (sub_admin accessible) =====
    partners: router({
      list: subAdminProcedure.query(async () => {
        return getAllPartners();
      }),

      create: subAdminProcedure
        .input(z.object({
          name: z.string().min(1).max(200),
          description: z.string().nullable().optional(),
          phone: z.string().nullable().optional(),
          telegram: z.string().nullable().optional(),
          kakao: z.string().nullable().optional(),
          whatsapp: z.string().nullable().optional(),
          wechat: z.string().nullable().optional(),
          avatarUrl: z.string().nullable().optional(),
          sortOrder: z.number().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const id = await createPartner({
            name: input.name,
            description: input.description ?? null,
            phone: input.phone ?? null,
            telegram: input.telegram ?? null,
            kakao: input.kakao ?? null,
            whatsapp: input.whatsapp ?? null,
            wechat: input.wechat ?? null,
            avatarUrl: input.avatarUrl ?? null,
            sortOrder: input.sortOrder ?? 0,
          });
          await logAction(ctx, "create", "partner", id, `파트너: ${input.name}`);
          return { success: true, id };
        }),

      update: subAdminProcedure
        .input(z.object({
          id: z.number(),
          name: z.string().max(200).optional(),
          description: z.string().nullable().optional(),
          phone: z.string().nullable().optional(),
          telegram: z.string().nullable().optional(),
          kakao: z.string().nullable().optional(),
          whatsapp: z.string().nullable().optional(),
          wechat: z.string().nullable().optional(),
          avatarUrl: z.string().nullable().optional(),
          isActive: z.boolean().optional(),
          sortOrder: z.number().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { id, ...data } = input;
          await updatePartner(id, data);
          await logAction(ctx, "update", "partner", id);
          return { success: true };
        }),

      delete: subAdminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await hardDeletePartner(input.id);
          await logAction(ctx, "delete", "partner", input.id);
          return { success: true };
        }),
    }),

    // ===== CS Ticket Management =====
    csTickets: router({
      list: subAdminProcedure
        .input(z.object({
          status: z.string().optional(),
          limit: z.number().min(1).max(200).optional(),
          offset: z.number().min(0).optional(),
        }).optional())
        .query(async ({ input }) => {
          return getCsTickets({
            status: input?.status,
            limit: input?.limit ?? 50,
            offset: input?.offset ?? 0,
          });
        }),

      stats: subAdminProcedure.query(async () => {
        return getCsTicketStats();
      }),

      getById: subAdminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const result = await getCsTicketById(input.id);
          return result ?? null;
        }),

      reply: subAdminProcedure
        .input(z.object({
          id: z.number(),
          reply: z.string().min(1).max(5000),
        }))
        .mutation(async ({ input, ctx }) => {
          await replyCsTicket(input.id, input.reply, ctx.user.name ?? "Admin");
          await logAction(ctx, "reply", "csTicket", input.id, `답변: ${input.reply.substring(0, 100)}`);
          return { success: true };
        }),

      updateStatus: subAdminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["open", "in_progress", "resolved", "closed"]),
        }))
        .mutation(async ({ input, ctx }) => {
          await updateCsTicketStatus(input.id, input.status);
          await logAction(ctx, "updateStatus", "csTicket", input.id, `상태: ${input.status}`);
          return { success: true };
        }),
    }),

    // ===== Media / R2 Storage =====
    media: router({
      list: adminProcedure
        .input(z.object({ prefix: z.string().optional(), maxKeys: z.number().min(1).max(500).optional() }).optional())
        .query(async ({ input }) => {
          return r2List(input?.prefix, input?.maxKeys ?? 100);
        }),

      upload: adminProcedure
        .input(z.object({
          fileName: z.string().min(1),
          folder: z.string().default("media"),
          contentType: z.string().default("application/octet-stream"),
          base64Data: z.string().min(1),
        }))
        .mutation(async ({ input, ctx }) => {
          const buffer = Buffer.from(input.base64Data, "base64");
          const key = generateFileKey(input.folder, input.fileName);
          const result = await r2Upload(key, buffer, input.contentType);
          await logAction(ctx, "upload", "media", undefined, `파일: ${input.fileName} (${input.contentType})`);
          return { success: true, ...result };
        }),

      delete: adminProcedure
        .input(z.object({ key: z.string().min(1) }))
        .mutation(async ({ input, ctx }) => {
          await r2Delete(input.key);
          await logAction(ctx, "delete", "media", undefined, `키: ${input.key}`);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
