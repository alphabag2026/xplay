import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(role: "admin" | "sub_admin" | "user"): TrpcContext {
  return {
    user: {
      id: role === "admin" ? 1 : role === "sub_admin" ? 2 : 3,
      openId: `test-${role}`,
      email: `${role}@test.com`,
      name: `Test ${role}`,
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("Sub-admin role-based access control", () => {
  it("admin can access admin.stats", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    // Should not throw - admin has access
    await expect(caller.admin.stats()).resolves.toBeDefined();
  });

  it("sub_admin can access admin.stats", async () => {
    const caller = appRouter.createCaller(createContext("sub_admin"));
    // Should not throw - sub_admin has access to dashboard stats
    await expect(caller.admin.stats()).resolves.toBeDefined();
  });

  it("regular user cannot access admin.stats", async () => {
    const caller = appRouter.createCaller(createContext("user"));
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("sub_admin cannot access admin.users.list (admin only)", async () => {
    const caller = appRouter.createCaller(createContext("sub_admin"));
    await expect(caller.admin.users.list()).rejects.toThrow();
  });

  it("sub_admin cannot access admin.media.list (admin only)", async () => {
    const caller = appRouter.createCaller(createContext("sub_admin"));
    await expect(caller.admin.media.list()).rejects.toThrow();
  });

  it("sub_admin cannot access admin.r2Health (admin only)", async () => {
    const caller = appRouter.createCaller(createContext("sub_admin"));
    await expect(caller.admin.r2Health()).rejects.toThrow();
  });

  it("admin can update user role but not self", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    // Self-update should return error
    const result = await caller.admin.users.updateRole({ userId: 1, role: "user" });
    expect(result.success).toBe(false);
    expect(result.error).toContain("자신의 역할");
  });
});
