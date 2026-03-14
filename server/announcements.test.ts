import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("announcements router", () => {
  it("announcements.list returns an array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.announcements.list({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("announcements.pinned returns null or an object", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.announcements.pinned();
    // Could be null (no pinned) or an object
    expect(result === undefined || result === null || typeof result === "object").toBe(true);
  });

  it("announcements.getById returns undefined for non-existent id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.announcements.getById({ id: 999999 });
    expect(result).toBeUndefined();
  });
});
