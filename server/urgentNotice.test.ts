import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("urgentNotice", () => {
  describe("public API", () => {
    it("urgentNotice.active returns an array (public, no auth)", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.urgentNotice.active();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("admin API", () => {
    it("admin.urgentNotices.list returns notices and total", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.urgentNotices.list({});
      expect(result).toHaveProperty("notices");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.notices)).toBe(true);
      expect(typeof result.total).toBe("number");
    });

    it("admin.urgentNotices.create creates a general urgent notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.urgentNotices.create({
        message: "테스트 긴급 공지입니다.",
        meetingType: "general",
      });
      expect(result.success).toBe(true);
      expect(typeof result.id).toBe("number");
    });

    it("admin.urgentNotices.create creates a zoom meeting notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.urgentNotices.create({
        message: "오늘 저녁 8시 Zoom 회의",
        meetingType: "zoom",
        meetingLink: "https://zoom.us/j/123456789",
        meetingTime: "2026-03-15 20:00 KST",
      });
      expect(result.success).toBe(true);
      expect(typeof result.id).toBe("number");
    });

    it("admin.urgentNotices.create creates a tencent meeting notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.urgentNotices.create({
        message: "텐센트 회의 안내",
        meetingType: "tencent",
        meetingLink: "https://meeting.tencent.com/dm/xxx",
        meetingTime: "2026-03-16 14:00 KST",
      });
      expect(result.success).toBe(true);
    });

    it("admin.urgentNotices.create creates a debox meeting notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.urgentNotices.create({
        message: "DeBox 회의 안내",
        meetingType: "debox",
      });
      expect(result.success).toBe(true);
    });

    it("admin.urgentNotices.create creates a google meeting notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);
      const result = await caller.admin.urgentNotices.create({
        message: "구글 미팅 안내",
        meetingType: "google",
        meetingLink: "https://meet.google.com/abc-defg-hij",
      });
      expect(result.success).toBe(true);
    });

    it("active notices appear in public query after creation", async () => {
      const adminCtx = createAdminContext();
      const publicCtx = createPublicContext();
      const adminCaller = appRouter.createCaller(adminCtx);
      const publicCaller = appRouter.createCaller(publicCtx);

      // Create a new notice
      const { id } = await adminCaller.admin.urgentNotices.create({
        message: "활성 테스트 공지 " + Date.now(),
        meetingType: "general",
      });

      // Check it appears in active list
      const active = await publicCaller.urgentNotice.active();
      const found = active.find((n: any) => n.id === id);
      expect(found).toBeDefined();
      expect(found?.isActive).toBe(true);
    });

    it("admin.urgentNotices.toggleActive deactivates a notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create first
      const { id } = await caller.admin.urgentNotices.create({
        message: "비활성화 테스트 " + Date.now(),
        meetingType: "general",
      });

      // Toggle off
      const result = await caller.admin.urgentNotices.toggleActive({ id, isActive: false });
      expect(result.success).toBe(true);

      // Verify it's not in active list
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);
      const active = await publicCaller.urgentNotice.active();
      const found = active.find((n: any) => n.id === id);
      expect(found).toBeUndefined();
    });

    it("admin.urgentNotices.deactivateAll deactivates all notices", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.urgentNotices.deactivateAll();
      expect(result.success).toBe(true);

      // Verify no active notices
      const publicCtx = createPublicContext();
      const publicCaller = appRouter.createCaller(publicCtx);
      const active = await publicCaller.urgentNotice.active();
      expect(active.length).toBe(0);
    });

    it("admin.urgentNotices.delete removes a notice", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Create first
      const { id } = await caller.admin.urgentNotices.create({
        message: "삭제 테스트 " + Date.now(),
        meetingType: "general",
      });

      // Delete
      const result = await caller.admin.urgentNotices.delete({ id });
      expect(result.success).toBe(true);
    });
  });
});
