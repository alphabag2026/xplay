import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getAnnouncements, getAnnouncementById, getPinnedAnnouncement,
  searchAnnouncements, getPopularAnnouncements,
  toggleLike, getLikedIds,
  createComment, getComments, getCommentCount, deleteComment,
  getNewsLinks, getNewsLinkById, updateNewsLinkTranslation,
  getPartners,
  // Admin queries
  createAnnouncement, updateAnnouncement, deleteAnnouncement, togglePinAnnouncement,
  createNewsLink, updateNewsLink, deleteNewsLink,
  createPartner, updatePartner, deletePartner, hardDeletePartner, getAllPartners,
  getDashboardStats,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { r2Upload, r2Delete, r2List, r2HealthCheck, generateFileKey } from "./r2Storage";

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

  // ========== Admin Back-Office ==========
  admin: router({
    // Dashboard stats
    stats: adminProcedure.query(async () => {
      return getDashboardStats();
    }),

    // R2 health check
    r2Health: adminProcedure.query(async () => {
      return r2HealthCheck();
    }),

    // ===== Announcement CRUD =====
    announcements: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().min(1).max(200).optional() }).optional())
        .query(async ({ input }) => {
          return getAnnouncements(input?.limit ?? 100);
        }),

      create: adminProcedure
        .input(z.object({
          title: z.string().min(1).max(500),
          content: z.string().min(1),
          imageUrl: z.string().nullable().optional(),
          isPinned: z.boolean().optional(),
          authorName: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const id = await createAnnouncement({
            title: input.title,
            content: input.content,
            imageUrl: input.imageUrl ?? null,
            isPinned: input.isPinned ?? false,
            authorName: input.authorName ?? "XPLAY Admin",
          });
          return { success: true, id };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          title: z.string().min(1).max(500).optional(),
          content: z.string().min(1).optional(),
          imageUrl: z.string().nullable().optional(),
          authorName: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateAnnouncement(id, data);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteAnnouncement(input.id);
          return { success: true };
        }),

      togglePin: adminProcedure
        .input(z.object({ id: z.number(), isPinned: z.boolean() }))
        .mutation(async ({ input }) => {
          await togglePinAnnouncement(input.id, input.isPinned);
          return { success: true };
        }),

      deleteComment: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteComment(input.id);
          return { success: true };
        }),
    }),

    // ===== News CRUD =====
    news: router({
      list: adminProcedure
        .input(z.object({ limit: z.number().min(1).max(200).optional() }).optional())
        .query(async ({ input }) => {
          return getNewsLinks(input?.limit ?? 100);
        }),

      create: adminProcedure
        .input(z.object({
          url: z.string().min(1),
          title: z.string().min(1).max(500),
          description: z.string().nullable().optional(),
          imageUrl: z.string().nullable().optional(),
          siteName: z.string().nullable().optional(),
          originalContent: z.string().nullable().optional(),
          authorName: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
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
          return { success: true, id };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.number(),
          url: z.string().optional(),
          title: z.string().max(500).optional(),
          description: z.string().nullable().optional(),
          imageUrl: z.string().nullable().optional(),
          siteName: z.string().nullable().optional(),
        }))
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updateNewsLink(id, data);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await deleteNewsLink(input.id);
          return { success: true };
        }),
    }),

    // ===== Partners CRUD =====
    partners: router({
      list: adminProcedure.query(async () => {
        return getAllPartners();
      }),

      create: adminProcedure
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
        .mutation(async ({ input }) => {
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
          return { success: true, id };
        }),

      update: adminProcedure
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
        .mutation(async ({ input }) => {
          const { id, ...data } = input;
          await updatePartner(id, data);
          return { success: true };
        }),

      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          await hardDeletePartner(input.id);
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
        .mutation(async ({ input }) => {
          const buffer = Buffer.from(input.base64Data, "base64");
          const key = generateFileKey(input.folder, input.fileName);
          const result = await r2Upload(key, buffer, input.contentType);
          return { success: true, ...result };
        }),

      delete: adminProcedure
        .input(z.object({ key: z.string().min(1) }))
        .mutation(async ({ input }) => {
          await r2Delete(input.key);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
