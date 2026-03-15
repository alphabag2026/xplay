import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

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
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createSubAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "subadmin-user",
    email: "subadmin@example.com",
    name: "Sub Admin User",
    loginMethod: "manus",
    role: "sub_admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

// Mock the db module
vi.mock("./db", () => ({
  createLeaderReferral: vi.fn().mockResolvedValue(1),
  getLeaderReferrals: vi.fn().mockResolvedValue({ referrals: [], total: 0 }),
  getLeaderReferralById: vi.fn().mockResolvedValue(null),
  updateLeaderReferralStatus: vi.fn().mockResolvedValue(undefined),
  getLeaderReferralStats: vi.fn().mockResolvedValue({ pending: 0, reviewing: 0, approved: 0, rejected: 0, total: 0 }),
  registerContactPublic: vi.fn().mockResolvedValue({ id: 1, isNew: true }),
  // Stub out other db functions used by the router
  getAnnouncements: vi.fn().mockResolvedValue({ announcements: [], total: 0 }),
  getAnnouncementById: vi.fn(),
  getPinnedAnnouncement: vi.fn(),
  searchAnnouncements: vi.fn().mockResolvedValue({ announcements: [], total: 0 }),
  getPopularAnnouncements: vi.fn().mockResolvedValue([]),
  toggleLike: vi.fn(),
  getLikedIds: vi.fn().mockResolvedValue([]),
  createComment: vi.fn(),
  getComments: vi.fn().mockResolvedValue([]),
  getCommentCount: vi.fn().mockResolvedValue(0),
  deleteComment: vi.fn(),
  getNewsLinks: vi.fn().mockResolvedValue({ links: [], total: 0 }),
  getNewsLinkById: vi.fn(),
  updateNewsLinkTranslation: vi.fn(),
  getPartners: vi.fn().mockResolvedValue([]),
  createAnnouncement: vi.fn(),
  updateAnnouncement: vi.fn(),
  deleteAnnouncement: vi.fn(),
  togglePinAnnouncement: vi.fn(),
  createNewsLink: vi.fn(),
  updateNewsLink: vi.fn(),
  deleteNewsLink: vi.fn(),
  createPartner: vi.fn(),
  updatePartner: vi.fn(),
  deletePartner: vi.fn(),
  hardDeletePartner: vi.fn(),
  getAllPartners: vi.fn().mockResolvedValue([]),
  getDashboardStats: vi.fn().mockResolvedValue({}),
  getAllUsers: vi.fn().mockResolvedValue([]),
  updateUserRole: vi.fn(),
  getUserById: vi.fn(),
  createAuditLog: vi.fn(),
  getAuditLogs: vi.fn().mockResolvedValue({ logs: [], total: 0 }),
  getScheduledAnnouncements: vi.fn().mockResolvedValue([]),
  publishScheduledAnnouncement: vi.fn(),
  getAnnouncementsByStatus: vi.fn().mockResolvedValue({ announcements: [], total: 0 }),
  generateTicketNo: vi.fn().mockResolvedValue("CS-001"),
  createCsTicket: vi.fn().mockResolvedValue(1),
  getCsTickets: vi.fn().mockResolvedValue({ tickets: [], total: 0 }),
  getCsTicketById: vi.fn(),
  getCsTicketByNo: vi.fn(),
  replyCsTicket: vi.fn(),
  updateCsTicketStatus: vi.fn(),
  getCsTicketStats: vi.fn().mockResolvedValue({ open: 0, inProgress: 0, resolved: 0, closed: 0, total: 0 }),
  getPartnerByOpenId: vi.fn(),
  upsertMyContact: vi.fn(),
}));

// Mock r2Storage
vi.mock("./r2Storage", () => ({
  r2Upload: vi.fn(),
  r2Delete: vi.fn(),
  r2List: vi.fn().mockResolvedValue({ files: [], total: 0 }),
  r2HealthCheck: vi.fn().mockResolvedValue({ healthy: true }),
  generateFileKey: vi.fn(),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("leaderReferral.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a self-referral without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderReferral.submit({
      referralType: "self",
      referrerName: "홍길동",
      referrerContact: "010-1234-5678",
      referrerEmail: "hong@example.com",
      previousExperience: "5년 경력",
      teamSize: "50명",
      region: "한국",
      expertise: "crypto",
      introduction: "테스트 소개글입니다.",
    });

    expect(result).toEqual({ success: true, id: 1 });
  });

  it("submits an acquaintance referral", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leaderReferral.submit({
      referralType: "acquaintance",
      referrerName: "김철수",
      referrerContact: "010-9999-8888",
      leaderName: "이영희",
      leaderContact: "010-7777-6666",
      region: "동남아시아",
      expertise: "mlm",
    });

    expect(result).toEqual({ success: true, id: 1 });
  });

  it("rejects empty referrer name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leaderReferral.submit({
        referralType: "self",
        referrerName: "",
        referrerContact: "010-1234-5678",
      })
    ).rejects.toThrow();
  });

  it("rejects empty referrer contact", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leaderReferral.submit({
        referralType: "self",
        referrerName: "홍길동",
        referrerContact: "",
      })
    ).rejects.toThrow();
  });
});

describe("myContact.register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a contact without authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.myContact.register({
      name: "박지성",
      phone: "010-1111-2222",
      description: "테스트 소개",
    });

    expect(result).toEqual({ success: true, id: 1, isNew: true });
  });

  it("registers without description", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.myContact.register({
      name: "손흥민",
      phone: "010-3333-4444",
    });

    expect(result).toEqual({ success: true, id: 1, isNew: true });
  });

  it("rejects empty name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.myContact.register({
        name: "",
        phone: "010-1111-2222",
      })
    ).rejects.toThrow();
  });

  it("rejects empty phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.myContact.register({
        name: "홍길동",
        phone: "",
      })
    ).rejects.toThrow();
  });
});

describe("admin.leaderReferrals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin can list leader referrals", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.leaderReferrals.list();
    expect(result).toEqual({ referrals: [], total: 0 });
  });

  it("sub_admin can list leader referrals", async () => {
    const ctx = createSubAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.leaderReferrals.list();
    expect(result).toEqual({ referrals: [], total: 0 });
  });

  it("admin can get stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.leaderReferrals.stats();
    expect(result).toEqual({ pending: 0, reviewing: 0, approved: 0, rejected: 0, total: 0 });
  });

  it("admin can update status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.leaderReferrals.updateStatus({
      id: 1,
      status: "approved",
      adminNote: "승인합니다",
    });

    expect(result).toEqual({ success: true });
  });

  it("unauthenticated user cannot access admin leader referrals", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.leaderReferrals.list()).rejects.toThrow();
  });
});
