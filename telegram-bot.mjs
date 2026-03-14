#!/usr/bin/env node
/**
 * XPLAY Announcement Telegram Bot
 * 
 * Usage:
 *   1. Set environment variables:
 *      - TELEGRAM_BOT_TOKEN: Bot token from @BotFather
 *      - TELEGRAM_BOT_SECRET: Secret key for webhook authentication
 *      - WEBHOOK_URL: Your server URL (e.g., https://xplay.infoweb4.vip)
 * 
 *   2. Run: node telegram-bot.mjs
 * 
 * Commands:
 *   /공지 <제목>
 *   Then send the content as the next message.
 *   Optionally attach a photo with the content message.
 * 
 *   /pin <제목>
 *   Same as /공지 but the announcement will be pinned.
 * 
 *   /help - Show help message
 * 
 * Flow:
 *   1. User sends /공지 제목텍스트
 *   2. Bot asks for content (text + optional photo)
 *   3. User sends content (with or without photo)
 *   4. Bot uploads to server via webhook API
 *   5. Bot confirms success
 */

import "dotenv/config";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_SECRET = process.env.TELEGRAM_BOT_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://xplay.infoweb4.vip";

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is not set");
  process.exit(1);
}

if (!BOT_SECRET) {
  console.error("❌ TELEGRAM_BOT_SECRET is not set");
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Store pending announcements (chatId -> { title, isPinned })
const pendingAnnouncements = new Map();

// Telegram API helper
async function tgApi(method, body = {}) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

// Send message
async function sendMessage(chatId, text, parseMode = "HTML") {
  return tgApi("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: parseMode,
  });
}

// Get file URL from Telegram
async function getFileUrl(fileId) {
  const result = await tgApi("getFile", { file_id: fileId });
  if (result.ok) {
    return `https://api.telegram.org/file/bot${BOT_TOKEN}/${result.result.file_path}`;
  }
  return null;
}

// Download file from Telegram and upload to our server
async function uploadImageToServer(fileUrl) {
  try {
    // Download from Telegram
    const imageRes = await fetch(fileUrl);
    const imageBuffer = await imageRes.arrayBuffer();

    // Upload to our server
    const uploadRes = await fetch(`${WEBHOOK_URL}/api/telegram/upload-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Bot-Secret": BOT_SECRET,
      },
      body: Buffer.from(imageBuffer),
    });

    const data = await uploadRes.json();
    if (data.success) {
      return data.url;
    }
    console.error("Upload failed:", data);
    return null;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
}

// Create announcement on server
async function createAnnouncement(title, content, imageUrl, isPinned) {
  try {
    const res = await fetch(`${WEBHOOK_URL}/api/telegram/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        imageUrl: imageUrl || null,
        isPinned: isPinned || false,
        botSecret: BOT_SECRET,
        authorName: "XPLAY Admin",
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Create announcement error:", error);
    return { success: false, error: error.message };
  }
}

// Process incoming update
async function processUpdate(update) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || message.caption || "";

  // /help command
  if (text.startsWith("/help") || text.startsWith("/start")) {
    await sendMessage(
      chatId,
      `📢 <b>XPLAY 공지방 봇</b>\n\n` +
        `<b>명령어:</b>\n` +
        `• <code>/공지 제목</code> — 새 공지 등록\n` +
        `• <code>/pin 제목</code> — 고정 공지 등록\n` +
        `• <code>/help</code> — 도움말\n\n` +
        `<b>사용법:</b>\n` +
        `1. <code>/공지 XPLAY 2.0 업데이트</code> 전송\n` +
        `2. 봇이 내용 입력을 요청합니다\n` +
        `3. 내용을 텍스트로 전송 (사진 첨부 가능)\n` +
        `4. 공지가 웹사이트에 자동 등록됩니다\n\n` +
        `<b>서버:</b> ${WEBHOOK_URL}`
    );
    return;
  }

  // /공지 or /pin command
  if (text.startsWith("/공지") || text.startsWith("/pin")) {
    const isPinned = text.startsWith("/pin");
    const title = text.replace(/^\/(공지|pin)\s*/, "").trim();

    if (!title) {
      await sendMessage(
        chatId,
        `⚠️ 제목을 입력해주세요.\n\n예시: <code>/${isPinned ? "pin" : "공지"} XPLAY 2.0 업데이트 안내</code>`
      );
      return;
    }

    // Store pending announcement
    pendingAnnouncements.set(chatId, { title, isPinned });

    await sendMessage(
      chatId,
      `📝 <b>공지 제목:</b> ${title}\n${isPinned ? "📌 <i>고정 공지로 등록됩니다</i>\n" : ""}\n` +
        `이제 <b>공지 내용</b>을 입력해주세요.\n` +
        `사진을 첨부하면 이미지도 함께 등록됩니다.`
    );
    return;
  }

  // Check if there's a pending announcement for this chat
  if (pendingAnnouncements.has(chatId)) {
    const pending = pendingAnnouncements.get(chatId);
    pendingAnnouncements.delete(chatId);

    const content = text || "(이미지 공지)";
    let imageUrl = null;

    // Check for photo
    if (message.photo && message.photo.length > 0) {
      // Get the largest photo
      const largestPhoto = message.photo[message.photo.length - 1];
      await sendMessage(chatId, "📷 이미지 업로드 중...");

      const fileUrl = await getFileUrl(largestPhoto.file_id);
      if (fileUrl) {
        imageUrl = await uploadImageToServer(fileUrl);
      }
    }

    // Create the announcement
    await sendMessage(chatId, "⏳ 공지 등록 중...");

    const result = await createAnnouncement(
      pending.title,
      content,
      imageUrl,
      pending.isPinned
    );

    if (result.success) {
      await sendMessage(
        chatId,
        `✅ <b>공지가 등록되었습니다!</b>\n\n` +
          `📌 <b>제목:</b> ${pending.title}\n` +
          `${pending.isPinned ? "📍 고정 공지로 설정됨\n" : ""}` +
          `${imageUrl ? "🖼 이미지 포함\n" : ""}` +
          `\n🌐 <a href="${WEBHOOK_URL}/#announcements">웹사이트에서 확인</a>`
      );
    } else {
      await sendMessage(
        chatId,
        `❌ 공지 등록 실패: ${result.error || "알 수 없는 오류"}\n\n다시 시도해주세요.`
      );
    }
    return;
  }
}

// Long polling
async function startPolling() {
  console.log("🤖 XPLAY Announcement Bot started");
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);

  let offset = 0;

  while (true) {
    try {
      const result = await tgApi("getUpdates", {
        offset,
        timeout: 30,
        allowed_updates: ["message"],
      });

      if (result.ok && result.result.length > 0) {
        for (const update of result.result) {
          offset = update.update_id + 1;
          await processUpdate(update);
        }
      }
    } catch (error) {
      console.error("Polling error:", error.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

startPolling();
