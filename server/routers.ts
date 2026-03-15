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
  createLeaderReferral, getLeaderReferrals, getLeaderReferralById,
  updateLeaderReferralStatus, getLeaderReferralStats,
  registerContactPublic,
  createUrgentNotice, getActiveUrgentNotices, getAllUrgentNotices,
  updateUrgentNoticeActive, deleteUrgentNotice, deactivateAllUrgentNotices,
  getResources, getAllResources, getResourceById, createResource, updateResource, deleteResource,
  getAllLiveFeedConfigs, getLiveFeedConfig, upsertLiveFeedConfig,
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

  // ========== Public Live Feed Config ==========
  liveFeed: router({
    config: publicProcedure.query(async () => {
      const configs = await getAllLiveFeedConfigs();
      const result: Record<string, any> = {};
      for (const c of configs) {
        try { result[c.configKey] = JSON.parse(c.configValue); } catch { result[c.configKey] = c.configValue; }
      }
      return result;
    }),
  }),

  // ========== My Contact (Public - no login required) ==========
  myContact: router({
    register: publicProcedure
      .input(z.object({
        name: z.string().min(1).max(200),
        phone: z.string().max(50).nullable().optional(),
        description: z.string().max(500).nullable().optional(),
        telegram: z.string().max(100).nullable().optional(),
        kakao: z.string().max(100).nullable().optional(),
        openKakaoChat: z.string().max(500).nullable().optional(),
        whatsapp: z.string().max(50).nullable().optional(),
        wechat: z.string().max(100).nullable().optional(),
        personalCommunity: z.string().max(2000).nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await registerContactPublic({
          name: input.name.trim(),
          phone: input.phone?.trim() ?? null,
          description: input.description?.trim() ?? null,
          telegram: input.telegram?.trim() ?? null,
          kakao: input.kakao?.trim() ?? null,
          openKakaoChat: input.openKakaoChat?.trim() ?? null,
          whatsapp: input.whatsapp?.trim() ?? null,
          wechat: input.wechat?.trim() ?? null,
          personalCommunity: input.personalCommunity ?? null,
        });
        return { success: true, id: result.id, isNew: result.isNew };
      }),
  }),

  // ========== Leader Referral Program ==========
  leaderReferral: router({
    submit: publicProcedure
      .input(z.object({
        referralType: z.enum(["self", "acquaintance"]),
        referrerName: z.string().min(1).max(200),
        referrerContact: z.string().min(1).max(300),
        referrerEmail: z.string().max(320).nullable().optional(),
        leaderName: z.string().max(200).nullable().optional(),
        leaderContact: z.string().max(300).nullable().optional(),
        previousExperience: z.string().max(5000).nullable().optional(),
        teamSize: z.string().max(100).nullable().optional(),
        organizationStructure: z.string().max(5000).nullable().optional(),
        region: z.string().max(200).nullable().optional(),
        expertise: z.string().max(300).nullable().optional(),
        introduction: z.string().max(5000).nullable().optional(),
        additionalNotes: z.string().max(5000).nullable().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await createLeaderReferral({
          referralType: input.referralType,
          referrerName: input.referrerName.trim(),
          referrerContact: input.referrerContact.trim(),
          referrerEmail: input.referrerEmail?.trim() ?? null,
          leaderName: input.leaderName?.trim() ?? null,
          leaderContact: input.leaderContact?.trim() ?? null,
          previousExperience: input.previousExperience?.trim() ?? null,
          teamSize: input.teamSize?.trim() ?? null,
          organizationStructure: input.organizationStructure?.trim() ?? null,
          region: input.region?.trim() ?? null,
          expertise: input.expertise?.trim() ?? null,
          introduction: input.introduction?.trim() ?? null,
          additionalNotes: input.additionalNotes?.trim() ?? null,
        });

        // Send Telegram notification
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          if (botToken) {
            const typeLabel = input.referralType === "self" ? "본인 추천" : "지인 추천";
            const text = [
              `\u{1F451} 새 리더 추천 접수`,
              ``,
              `\u{1F4CB} 유형: ${typeLabel}`,
              `\u{1F464} 추천자: ${input.referrerName}`,
              `\u{1F4DE} 연락처: ${input.referrerContact}`,
              input.referrerEmail ? `\u{1F4E7} 이메일: ${input.referrerEmail}` : "",
              input.referralType === "acquaintance" && input.leaderName ? `\u{1F31F} 리더: ${input.leaderName}` : "",
              input.teamSize ? `\u{1F465} 팀 규모: ${input.teamSize}` : "",
              input.region ? `\u{1F30D} 지역: ${input.region}` : "",
              input.expertise ? `\u{1F3AF} 분야: ${input.expertise}` : "",
              input.introduction ? `\n\u{1F4DD} 소개:\n${input.introduction.substring(0, 300)}` : "",
            ].filter(Boolean).join("\n");

            const webhookUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const chatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS?.split(",") ?? [];
            for (const chatId of chatIds) {
              try {
                await fetch(webhookUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chat_id: chatId.trim(), text }),
                });
              } catch (e) {
                console.error(`[LeaderReferral] Failed to notify chat ${chatId}:`, e);
              }
            }
          }
        } catch (e) {
          console.error("[LeaderReferral Notification] Error:", e);
        }

        return { success: true, id };
      }),
  }),

  // ========== Urgent Notices (Red Banner) ==========
  urgentNotice: router({
    /** Get active urgent notices (public, no auth required) */
    active: publicProcedure.query(async () => {
      return getActiveUrgentNotices();
    }),
  }),

  // ========== Resources (Public) ==========
  resources: router({
    /** Get resources filtered by language and optional type */
    list: publicProcedure
      .input(z.object({
        lang: z.string().optional(),
        type: z.enum(["document", "blog", "video"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return getResources({ lang: input?.lang, type: input?.type });
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

      // AI polish content
      polishContent: adminProcedure
        .input(z.object({ content: z.string().min(1) }))
        .mutation(async ({ input }) => {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a professional content editor. Polish the following announcement content to make it more professional, clear, and engaging. Keep the same language and meaning. Return only the polished text without any explanation." },
              { role: "user", content: input.content },
            ],
          });
          const polished = response.choices?.[0]?.message?.content || input.content;
          return { polished: polished as string };
        }),

      // Auto-translate content to multiple languages
      autoTranslate: adminProcedure
        .input(z.object({ title: z.string(), content: z.string() }))
        .mutation(async ({ input }) => {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: `You are a professional translator. Translate the following announcement title and content into English, Chinese (Simplified), Japanese, Vietnamese, and Thai. Return a JSON object with this exact structure: {"en":{"title":"...","content":"..."},"zh":{"title":"...","content":"..."},"ja":{"title":"...","content":"..."},"vi":{"title":"...","content":"..."},"th":{"title":"...","content":"..."}}. Return ONLY the JSON, no explanation.` },
              { role: "user", content: `Title: ${input.title}\n\nContent: ${input.content}` },
            ],
            response_format: { type: "json_schema", json_schema: { name: "translations", strict: true, schema: { type: "object", properties: { en: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false }, zh: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false }, ja: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false }, vi: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false }, th: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false } }, required: ["en", "zh", "ja", "vi", "th"], additionalProperties: false } } },
          });
          const text = response.choices?.[0]?.message?.content || "{}";
          try {
            return { translations: JSON.parse(text as string) };
          } catch {
            return { translations: null };
          }
        }),

      // Upload image for announcement
      uploadImage: adminProcedure
        .input(z.object({ imageBase64: z.string(), fileName: z.string() }))
        .mutation(async ({ input }) => {
          const buffer = Buffer.from(input.imageBase64, "base64");
          const ext = input.fileName.split(".").pop() || "png";
          const mimeMap: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp" };
          const contentType = mimeMap[ext.toLowerCase()] || "image/png";
          const key = generateFileKey("announcements", input.fileName);
          const result = await r2Upload(key, buffer, contentType);
          return { url: result.url, key: result.key };
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

    // ===== Leader Referral Management =====
    leaderReferrals: router({
      list: subAdminProcedure
        .input(z.object({
          status: z.string().optional(),
          limit: z.number().min(1).max(200).optional(),
          offset: z.number().min(0).optional(),
        }).optional())
        .query(async ({ input }) => {
          return getLeaderReferrals({
            status: input?.status,
            limit: input?.limit ?? 50,
            offset: input?.offset ?? 0,
          });
        }),

      stats: subAdminProcedure.query(async () => {
        return getLeaderReferralStats();
      }),

      getById: subAdminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          const result = await getLeaderReferralById(input.id);
          return result ?? null;
        }),

      updateStatus: subAdminProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["pending", "reviewing", "approved", "rejected"]),
          adminNote: z.string().max(5000).optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          await updateLeaderReferralStatus(input.id, input.status, input.adminNote);
          await logAction(ctx, "updateStatus", "leaderReferral", input.id, `상태: ${input.status}`);
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

    // ===== Urgent Notices Management =====
    urgentNotices: router({
      list: subAdminProcedure
        .input(z.object({
          limit: z.number().min(1).max(200).optional(),
          offset: z.number().min(0).optional(),
        }).optional())
        .query(async ({ input }) => {
          return getAllUrgentNotices({
            limit: input?.limit ?? 50,
            offset: input?.offset ?? 0,
          });
        }),

      create: subAdminProcedure
        .input(z.object({
          message: z.string().min(1).max(2000),
          meetingType: z.enum(["zoom", "tencent", "debox", "google", "general"]).optional(),
          meetingLink: z.string().max(2000).nullable().optional(),
          meetingTime: z.string().max(200).nullable().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const id = await createUrgentNotice({
            message: input.message.trim(),
            meetingType: input.meetingType ?? "general",
            meetingLink: input.meetingLink?.trim() ?? null,
            meetingTime: input.meetingTime?.trim() ?? null,
          });
          await logAction(ctx, "create", "urgentNotice", id, `긴급: ${input.message.substring(0, 100)}`);
          return { success: true, id };
        }),

      toggleActive: subAdminProcedure
        .input(z.object({ id: z.number(), isActive: z.boolean() }))
        .mutation(async ({ input, ctx }) => {
          await updateUrgentNoticeActive(input.id, input.isActive);
          await logAction(ctx, "toggleActive", "urgentNotice", input.id, `활성: ${input.isActive}`);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await deleteUrgentNotice(input.id);
          await logAction(ctx, "delete", "urgentNotice", input.id);
          return { success: true };
        }),

      deactivateAll: subAdminProcedure
        .mutation(async ({ ctx }) => {
          await deactivateAllUrgentNotices();
          await logAction(ctx, "deactivateAll", "urgentNotice");
          return { success: true };
        }),
    }),

    // ===== Resources Management =====
    resources: router({
      list: subAdminProcedure
        .input(z.object({ type: z.string().optional(), lang: z.string().optional() }).optional())
        .query(async ({ input }) => {
          return getAllResources({ type: input?.type, lang: input?.lang });
        }),

      getById: subAdminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getResourceById(input.id);
        }),

      create: subAdminProcedure
        .input(z.object({
          type: z.enum(["document", "blog", "video"]),
          lang: z.string().default("all"),
          title: z.string().min(1).max(500),
          description: z.string().max(2000).optional(),
          thumbnailUrl: z.string().optional(),
          url: z.string().min(1),
          fileType: z.string().optional(),
          platform: z.string().optional(),
          youtubeId: z.string().optional(),
          sortOrder: z.number().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const result = await createResource(input);
          await logAction(ctx, "create", "resource", result.id, `${input.type}: ${input.title} [${input.lang}]`);
          return result;
        }),

      update: subAdminProcedure
        .input(z.object({
          id: z.number(),
          type: z.enum(["document", "blog", "video"]).optional(),
          lang: z.string().optional(),
          title: z.string().min(1).max(500).optional(),
          description: z.string().max(2000).optional(),
          thumbnailUrl: z.string().nullable().optional(),
          url: z.string().min(1).optional(),
          fileType: z.string().optional(),
          platform: z.string().optional(),
          youtubeId: z.string().optional(),
          sortOrder: z.number().optional(),
          isActive: z.boolean().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
          const { id, ...data } = input;
          await updateResource(id, data as any);
          await logAction(ctx, "update", "resource", id, JSON.stringify(data));
          return { success: true };
        }),

      delete: subAdminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input, ctx }) => {
          await deleteResource(input.id);
          await logAction(ctx, "delete", "resource", input.id);
          return { success: true };
        }),

      /** Upload thumbnail to R2 and return URL */
      uploadThumbnail: subAdminProcedure
        .input(z.object({
          fileName: z.string().min(1),
          contentType: z.string().default("image/jpeg"),
          base64Data: z.string().min(1),
        }))
        .mutation(async ({ input, ctx }) => {
          const buffer = Buffer.from(input.base64Data, "base64");
          const key = generateFileKey("resources/thumbnails", input.fileName);
          const result = await r2Upload(key, buffer, input.contentType);
          await logAction(ctx, "upload", "resourceThumbnail", undefined, `파일: ${input.fileName}`);
          return { success: true, ...result };
        }),
    }),

    // ===== Media / R2 Storage =====
    // ===== Live Feed Config =====
    liveFeedConfig: router({
      list: adminProcedure.query(async () => {
        const configs = await getAllLiveFeedConfigs();
        const result: Record<string, any> = {};
        for (const c of configs) {
          try { result[c.configKey] = JSON.parse(c.configValue); } catch { result[c.configKey] = c.configValue; }
        }
        return result;
      }),

      get: adminProcedure
        .input(z.object({ key: z.string() }))
        .query(async ({ input }) => {
          const config = await getLiveFeedConfig(input.key);
          if (!config) return null;
          try { return JSON.parse(config.configValue); } catch { return config.configValue; }
        }),

      upsert: adminProcedure
        .input(z.object({ key: z.string(), value: z.any() }))
        .mutation(async ({ input, ctx }) => {
          const val = typeof input.value === "string" ? input.value : JSON.stringify(input.value);
          await upsertLiveFeedConfig(input.key, val);
          await logAction(ctx, "update", "liveFeedConfig", undefined, `key=${input.key}`);
          return { success: true };
        }),
    }),

    // ===== AI Polish for Announcements =====
    aiPolish: adminProcedure
      .input(z.object({ content: z.string().min(1) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a professional content editor. Polish the following announcement text to be more professional, clear, and engaging. Keep the same language and meaning. Return only the polished text without any explanation." },
            { role: "user", content: input.content },
          ],
        });
        const rawContent = response.choices[0]?.message?.content;
        return { polished: (typeof rawContent === 'string' ? rawContent : input.content) };
      }),

    // ===== Auto-translate Announcement =====
    aiTranslate: adminProcedure
      .input(z.object({ title: z.string(), content: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `You are a professional translator. Translate the following announcement title and content into these languages: English (en), Chinese (zh), Japanese (ja), Vietnamese (vi), Thai (th). Return JSON format: { "en": { "title": "...", "content": "..." }, "zh": {...}, "ja": {...}, "vi": {...}, "th": {...} }. Keep the tone professional and accurate. Return ONLY valid JSON.` },
            { role: "user", content: `Title: ${input.title}\n\nContent: ${input.content}` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "translations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  en: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false },
                  zh: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false },
                  ja: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false },
                  vi: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false },
                  th: { type: "object", properties: { title: { type: "string" }, content: { type: "string" } }, required: ["title", "content"], additionalProperties: false },
                },
                required: ["en", "zh", "ja", "vi", "th"],
                additionalProperties: false,
              },
            },
          },
        });
        const rawText = response.choices[0]?.message?.content;
        const text = typeof rawText === 'string' ? rawText : "{}";
        try { return JSON.parse(text); } catch { return {}; }
      }),

    // ===== Announcement Image Upload =====
    uploadAnnouncementImage: adminProcedure
      .input(z.object({
        fileName: z.string().min(1),
        contentType: z.string().default("image/jpeg"),
        base64Data: z.string().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const buffer = Buffer.from(input.base64Data, "base64");
        const key = generateFileKey("announcements/images", input.fileName);
        const result = await r2Upload(key, buffer, input.contentType);
        await logAction(ctx, "upload", "announcementImage", undefined, `파일: ${input.fileName}`);
        return { success: true, ...result };
      }),

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
