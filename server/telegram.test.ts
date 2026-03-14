import { describe, expect, it } from "vitest";

describe("Telegram Bot Secrets", () => {
  it("TELEGRAM_BOT_TOKEN is set", () => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    expect(token).toBeDefined();
    expect(token!.length).toBeGreaterThan(10);
  });

  it("TELEGRAM_BOT_SECRET is set", () => {
    const secret = process.env.TELEGRAM_BOT_SECRET;
    expect(secret).toBeDefined();
    expect(secret!.length).toBeGreaterThan(0);
  });
});
