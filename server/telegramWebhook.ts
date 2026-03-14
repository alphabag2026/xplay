/**
 * Telegram Bot Webhook Handler
 * 
 * Receives messages from Telegram bot and creates announcements.
 * The bot sends POST requests to /api/telegram/webhook with:
 * - title: announcement title
 * - content: announcement content
 * - imageUrl: optional image URL (already uploaded to S3)
 * - botSecret: secret key for authentication
 */

import { Router } from "express";
import { createAnnouncement, togglePinAnnouncement } from "./db";
import { storagePut } from "./storage";

const telegramRouter = Router();

// Webhook endpoint for Telegram bot to create announcements
telegramRouter.post("/api/telegram/webhook", async (req, res) => {
  try {
    const { title, content, imageUrl, botSecret, isPinned, authorName } = req.body;

    // Verify bot secret
    const expectedSecret = process.env.TELEGRAM_BOT_SECRET;
    if (!expectedSecret || botSecret !== expectedSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const id = await createAnnouncement({
      title,
      content,
      imageUrl: imageUrl || null,
      isPinned: isPinned ?? false,
      authorName: authorName || "XPLAY Admin",
    });

    // If isPinned, this is the new pinned announcement
    if (isPinned && id) {
      await togglePinAnnouncement(id, true);
    }

    return res.json({ success: true, id });
  } catch (error) {
    console.error("[Telegram Webhook] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Image upload endpoint for Telegram bot
telegramRouter.post("/api/telegram/upload-image", async (req, res) => {
  try {
    const { botSecret } = req.body || {};
    const expectedSecret = process.env.TELEGRAM_BOT_SECRET;

    // Check authorization from body or header
    const headerSecret = req.headers["x-bot-secret"] as string;
    const secret = botSecret || headerSecret;

    if (!expectedSecret || secret !== expectedSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Expect raw image data in the request
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", async () => {
      try {
        const imageBuffer = Buffer.concat(chunks);
        if (imageBuffer.length === 0) {
          return res.status(400).json({ error: "No image data received" });
        }

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

export { telegramRouter };
