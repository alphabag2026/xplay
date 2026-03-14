/**
 * Telegram Bot Webhook Handler
 * Extended: news URL sharing, delete, partner registration
 */

import { Router } from "express";
import {
  createAnnouncement, togglePinAnnouncement, deleteAnnouncement, getAnnouncementById,
  createNewsLink, deleteNewsLink,
  createPartner, deletePartner,
} from "./db";
import { storagePut } from "./storage";

const telegramRouter = Router();

function verifySecret(req: any, res: any): boolean {
  const expectedSecret = process.env.TELEGRAM_BOT_SECRET;
  const secret = req.body?.botSecret || req.headers["x-bot-secret"];
  if (!expectedSecret || secret !== expectedSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

// ========== Announcement Webhook ==========
telegramRouter.post("/api/telegram/webhook", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { title, content, imageUrl, isPinned, authorName } = req.body;
    if (!title || !content) return res.status(400).json({ error: "Title and content are required" });

    const id = await createAnnouncement({
      title, content,
      imageUrl: imageUrl || null,
      isPinned: isPinned ?? false,
      authorName: authorName || "XPLAY Admin",
    });
    if (isPinned && id) await togglePinAnnouncement(id, true);
    return res.json({ success: true, id });
  } catch (error) {
    console.error("[Telegram Webhook] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Delete Announcement/News ==========
telegramRouter.post("/api/telegram/delete", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { type, id } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });

    if (type === "news") {
      await deleteNewsLink(id);
    } else {
      await deleteAnnouncement(id);
    }
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram Delete] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== News URL Webhook ==========
telegramRouter.post("/api/telegram/news", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { url, title, description, imageUrl, siteName, originalContent, authorName } = req.body;
    if (!url || !title) return res.status(400).json({ error: "URL and title are required" });

    const id = await createNewsLink({
      url, title,
      description: description || null,
      imageUrl: imageUrl || null,
      siteName: siteName || null,
      originalContent: originalContent || null,
      translatedContent: null,
      authorName: authorName || "XPLAY Admin",
    });
    return res.json({ success: true, id });
  } catch (error) {
    console.error("[Telegram News] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Partner Registration ==========
telegramRouter.post("/api/telegram/partner", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { name, description, phone, telegram, kakao, whatsapp, wechat } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const id = await createPartner({
      name,
      description: description || null,
      phone: phone || null,
      telegram: telegram || null,
      kakao: kakao || null,
      whatsapp: whatsapp || null,
      wechat: wechat || null,
    });
    return res.json({ success: true, id });
  } catch (error) {
    console.error("[Telegram Partner] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Delete Partner ==========
telegramRouter.post("/api/telegram/partner/delete", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });
    await deletePartner(id);
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram Partner Delete] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Image Upload ==========
telegramRouter.post("/api/telegram/upload-image", async (req, res) => {
  try {
    const headerSecret = req.headers["x-bot-secret"] as string;
    const expectedSecret = process.env.TELEGRAM_BOT_SECRET;
    if (!expectedSecret || headerSecret !== expectedSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", async () => {
      try {
        const imageBuffer = Buffer.concat(chunks);
        if (imageBuffer.length === 0) return res.status(400).json({ error: "No image data received" });

        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const fileKey = `announcements/img-${timestamp}-${randomSuffix}.jpg`;
        const { url } = await storagePut(fileKey, imageBuffer, "image/jpeg");
        return res.json({ success: true, url });
      } catch (err) {
        console.error("[Telegram Upload] Error:", err);
        return res.status(500).json({ error: "Upload failed" });
      }
    });
  } catch (error) {
    console.error("[Telegram Upload] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Comment Notification Endpoint ==========
telegramRouter.post("/api/telegram/notify-comment", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { announcementTitle, nickname, content, chatId } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || !chatId) return res.status(400).json({ error: "Bot token or chatId missing" });

    const text = `💬 새 댓글 알림\n\n📌 공지: ${announcementTitle}\n👤 작성자: ${nickname}\n📝 내용: ${content?.substring(0, 200)}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram Notify] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { telegramRouter };
