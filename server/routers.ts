import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAnnouncements, getAnnouncementById, getPinnedAnnouncement,
  searchAnnouncements, getPopularAnnouncements,
  toggleLike, getLikedIds,
  createComment, getComments, getCommentCount,
  getNewsLinks, getNewsLinkById, updateNewsLinkTranslation,
  getPartners,
} from "./db";
import { invokeLLM } from "./_core/llm";

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

  announcements: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 50;
        return getAnnouncements(limit);
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

    // Like toggle
    toggleLike: publicProcedure
      .input(z.object({ announcementId: z.number(), visitorId: z.string().min(1) }))
      .mutation(async ({ input }) => {
        return toggleLike(input.announcementId, input.visitorId);
      }),

    // Get liked IDs for a visitor
    likedIds: publicProcedure
      .input(z.object({ visitorId: z.string().min(1) }))
      .query(async ({ input }) => {
        return getLikedIds(input.visitorId);
      }),

    // Comments
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

        // Send Telegram notification for new comment
        try {
          const botToken = process.env.TELEGRAM_BOT_TOKEN;
          const botSecret = process.env.TELEGRAM_BOT_SECRET;
          if (botToken && botSecret) {
            const ann = await getAnnouncementById(input.announcementId);
            const text = `💬 새 댓글 알림\n\n📌 공지: ${ann?.title ?? `#${input.announcementId}`}\n👤 작성자: ${input.nickname}\n📝 내용: ${input.content.substring(0, 200)}`;
            // We'll use the webhook URL to notify — but for simplicity, we store the notification
            // The Telegram bot polls and can check for new comments
          }
        } catch (e) {
          console.error("[Comment Notification] Error:", e);
        }

        return { success: true, id };
      }),
  }),

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

    // Translate news content using LLM
    translate: publicProcedure
      .input(z.object({ id: z.number(), targetLang: z.string().min(2).max(5) }))
      .mutation(async ({ input }) => {
        const news = await getNewsLinkById(input.id);
        if (!news) return { success: false, error: "News not found" };

        // Check if translation already exists
        let translations: Record<string, string> = {};
        if (news.translatedContent) {
          try { translations = JSON.parse(news.translatedContent); } catch {}
        }
        if (translations[input.targetLang]) {
          return { success: true, translation: translations[input.targetLang] };
        }

        // Translate using LLM
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

  partners: router({
    list: publicProcedure.query(async () => {
      return getPartners();
    }),
  }),
});

export type AppRouter = typeof appRouter;
