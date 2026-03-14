import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@xplay.com",
    name: "XPLAY Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@xplay.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("Admin API Access Control", () => {
  it("admin user can access admin.stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    // This should not throw (may fail on DB but not on auth)
    try {
      await caller.admin.stats();
    } catch (e: any) {
      // DB connection errors are OK in test, but auth errors are not
      expect(e.code).not.toBe("FORBIDDEN");
      expect(e.code).not.toBe("UNAUTHORIZED");
    }
  });

  it("regular user cannot access admin.stats", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.admin.stats();
      // Should not reach here
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e.code).toBe("FORBIDDEN");
    }
  });

  it("unauthenticated user cannot access admin.stats", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    try {
      await caller.admin.stats();
      expect(true).toBe(false);
    } catch (e: any) {
      // Should be UNAUTHORIZED or FORBIDDEN
      expect(["UNAUTHORIZED", "FORBIDDEN"]).toContain(e.code);
    }
  });
});

describe("Public API Access", () => {
  it("public user can access announcements.list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.announcements.list();
      expect(Array.isArray(result)).toBe(true);
    } catch (e: any) {
      // DB errors are OK, auth errors are not
      expect(e.code).not.toBe("FORBIDDEN");
      expect(e.code).not.toBe("UNAUTHORIZED");
    }
  });

  it("public user can access announcements.pinned", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.announcements.pinned();
      // Should return null or an object, not undefined
      expect(result === null || typeof result === "object").toBe(true);
    } catch (e: any) {
      expect(e.code).not.toBe("FORBIDDEN");
    }
  });

  it("public user can access news.list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.news.list();
      expect(Array.isArray(result)).toBe(true);
    } catch (e: any) {
      expect(e.code).not.toBe("FORBIDDEN");
    }
  });

  it("public user can access partners.list", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    try {
      const result = await caller.partners.list();
      expect(Array.isArray(result)).toBe(true);
    } catch (e: any) {
      expect(e.code).not.toBe("FORBIDDEN");
    }
  });
});
