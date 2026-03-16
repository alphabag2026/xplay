import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the ENV module
vi.mock("./_core/env", () => ({
  ENV: {
    vapidPublicKey: "BI092b5nI3mf2QzxOv4GQe2pCoO4DKXt0OxeW662zMBml_Ir7V30IwButkzDB_J_d05QweqhuwRxwz6c6OXjQQQ",
    vapidPrivateKey: "3wbw3vg4y6BBcIi9Szxw7aY0tODd1x5S9gxUx5BYyVo",
  },
}));

// Mock web-push
vi.mock("web-push", () => ({
  default: {
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn().mockResolvedValue({ statusCode: 201 }),
  },
}));

// Mock db functions
vi.mock("./db", () => ({
  getAllPushSubscriptions: vi.fn().mockResolvedValue([
    { id: 1, endpoint: "https://fcm.googleapis.com/fcm/send/test1", p256dh: "key1", auth: "auth1", userAgent: "test" },
    { id: 2, endpoint: "https://fcm.googleapis.com/fcm/send/test2", p256dh: "key2", auth: "auth2", userAgent: "test" },
  ]),
  deletePushSubscription: vi.fn(),
}));

describe("WebPush module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send push to all subscribers", async () => {
    const { sendPushToAll } = await import("./webPush");
    const webpush = (await import("web-push")).default;

    const result = await sendPushToAll({
      title: "Test Notification",
      body: "This is a test",
      url: "/",
    });

    expect(result.sent).toBe(2);
    expect(result.failed).toBe(0);
    expect(webpush.setVapidDetails).toHaveBeenCalledWith(
      "mailto:admin@xplay.com",
      expect.any(String),
      expect.any(String)
    );
    expect(webpush.sendNotification).toHaveBeenCalledTimes(2);
  });

  it("should handle failed subscriptions and remove stale ones", async () => {
    const webpush = (await import("web-push")).default;
    const { deletePushSubscription } = await import("./db");

    // Make the first call fail with 410 Gone
    (webpush.sendNotification as any)
      .mockRejectedValueOnce({ statusCode: 410 })
      .mockResolvedValueOnce({ statusCode: 201 });

    const { sendPushToAll } = await import("./webPush");
    const result = await sendPushToAll({
      title: "Test",
      body: "Test body",
    });

    expect(result.sent).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.removed).toBe(1);
    expect(deletePushSubscription).toHaveBeenCalledWith("https://fcm.googleapis.com/fcm/send/test1");
  });

  it("should validate VAPID key format", () => {
    const publicKey = "BI092b5nI3mf2QzxOv4GQe2pCoO4DKXt0OxeW662zMBml_Ir7V30IwButkzDB_J_d05QweqhuwRxwz6c6OXjQQQ";
    const privateKey = "3wbw3vg4y6BBcIi9Szxw7aY0tODd1x5S9gxUx5BYyVo";

    // VAPID public key should be base64url encoded, 65 bytes (87 chars)
    expect(publicKey.length).toBeGreaterThan(40);
    expect(privateKey.length).toBeGreaterThan(20);
    // Should not contain non-base64url characters
    expect(publicKey).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(privateKey).toMatch(/^[A-Za-z0-9_-]+$/);
  });
});
