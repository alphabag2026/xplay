import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAnnouncements,
  getAnnouncementById,
  getPinnedAnnouncement,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  announcements: router({
    // Get all announcements (public)
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(100).optional() }).optional())
      .query(async ({ input }) => {
        const limit = input?.limit ?? 50;
        return getAnnouncements(limit);
      }),

    // Get single announcement by ID (public)
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const result = await getAnnouncementById(input.id);
        return result ?? null;
      }),

    // Get the latest pinned announcement (public)
    pinned: publicProcedure.query(async () => {
      const result = await getPinnedAnnouncement();
      return result ?? null;
    }),
  }),
});

export type AppRouter = typeof appRouter;
