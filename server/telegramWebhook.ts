/**
 * Telegram Bot Webhook Handler
 * Extended: news URL sharing, delete, partner registration
 */

import { Router } from "express";
import {
  createAnnouncement, togglePinAnnouncement, deleteAnnouncement, getAnnouncementById,
  createNewsLink, deleteNewsLink,
  createPartner, deletePartner,
  getCsTickets, getCsTicketById, replyCsTicket,
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

// ========== CS Ticket Notification ==========
telegramRouter.post("/api/telegram/notify-cs", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { ticketNo, name, category, subject, message, chatId } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || !chatId) return res.status(400).json({ error: "Bot token or chatId missing" });

    const text = `\u{1F3AB} <b>CS 문의 접수</b>\n\n` +
      `\u{1F4CB} <b>접수번호:</b> ${ticketNo}\n` +
      `\u{1F464} <b>이름:</b> ${name}\n` +
      `\u{1F4C1} <b>카테고리:</b> ${category}\n` +
      `\u{1F4CC} <b>제목:</b> ${subject}\n` +
      `\u{1F4DD} <b>내용:</b> ${message?.substring(0, 300)}\n\n` +
      `\u{1F517} 백오피스에서 확인하세요.`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram CS Notify] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== CS Reply Notification ==========
telegramRouter.post("/api/telegram/notify-cs-reply", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { ticketNo, subject, reply, chatId } = req.body;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken || !chatId) return res.status(400).json({ error: "Bot token or chatId missing" });

    const text = `\u{2705} <b>CS 답변 완료</b>\n\n` +
      `\u{1F4CB} <b>접수번호:</b> ${ticketNo}\n` +
      `\u{1F4CC} <b>제목:</b> ${subject}\n` +
      `\u{1F4AC} <b>답변:</b> ${reply?.substring(0, 300)}`;
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram CS Reply Notify] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== CS List (for bot) ==========
telegramRouter.post("/api/telegram/cs-list", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { tickets } = await getCsTickets({ status: "open", limit: 20 });
    return res.json({ success: true, tickets });
  } catch (error) {
    console.error("[Telegram CS List] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== CS Reply (from bot) ==========
telegramRouter.post("/api/telegram/cs-reply", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { id, reply } = req.body;
    if (!id || !reply) return res.status(400).json({ error: "ID and reply are required" });

    const ticket = await getCsTicketById(id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await replyCsTicket(id, reply, "XPLAY Admin (Telegram)");
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram CS Reply] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Urgent Notice (Red Banner) ==========
telegramRouter.post("/api/telegram/urgent", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { message, meetingType, meetingLink, meetingTime } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const { createUrgentNotice } = await import("./db");
    const id = await createUrgentNotice({
      message,
      meetingType: meetingType || "general",
      meetingLink: meetingLink || null,
      meetingTime: meetingTime || null,
    });
    return res.json({ success: true, id });
  } catch (error) {
    console.error("[Telegram Urgent] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========== Deactivate All Urgent Notices ==========
telegramRouter.post("/api/telegram/urgent/off", async (req, res) => {
  try {
    if (!verifySecret(req, res)) return;
    const { deactivateAllUrgentNotices } = await import("./db");
    await deactivateAllUrgentNotices();
    return res.json({ success: true });
  } catch (error) {
    console.error("[Telegram Urgent Off] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { telegramRouter };
