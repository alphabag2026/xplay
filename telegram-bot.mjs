#!/usr/bin/env node
/**
 * XPLAY Announcement Telegram Bot (Extended)
 * 
 * Commands:
 *   /공지 <제목>     — 새 공지 등록 (다음 메시지로 내용+사진)
 *   /pin <제목>      — 고정 공지 등록
 *   /뉴스 <URL>      — 뉴스 URL 공유 (OG 메타데이터 자동 추출)
 *   /삭제 <ID>       — 공지 삭제
 *   /뉴스삭제 <ID>   — 뉴스 삭제
 *   /파트너 <이름>   — 소통 파트너 등록 (다음 메시지로 연락처 정보)
 *   /파트너삭제 <ID> — 소통 파트너 삭제
 *   /help            — 도움말
 */

import "dotenv/config";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_SECRET = process.env.TELEGRAM_BOT_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://xplay.infoweb4.vip";

if (!BOT_TOKEN) { console.error("❌ TELEGRAM_BOT_TOKEN is not set"); process.exit(1); }
if (!BOT_SECRET) { console.error("❌ TELEGRAM_BOT_SECRET is not set"); process.exit(1); }

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Store pending states
const pendingAnnouncements = new Map(); // chatId -> { title, isPinned }
const pendingPartners = new Map();      // chatId -> { name }

async function tgApi(method, body = {}) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendMessage(chatId, text, parseMode = "HTML") {
  return tgApi("sendMessage", { chat_id: chatId, text, parse_mode: parseMode });
}

async function getFileUrl(fileId) {
  const result = await tgApi("getFile", { file_id: fileId });
  if (result.ok) return `https://api.telegram.org/file/bot${BOT_TOKEN}/${result.result.file_path}`;
  return null;
}

async function uploadImageToServer(fileUrl) {
  try {
    const imageRes = await fetch(fileUrl);
    const imageBuffer = await imageRes.arrayBuffer();
    const uploadRes = await fetch(`${WEBHOOK_URL}/api/telegram/upload-image`, {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream", "X-Bot-Secret": BOT_SECRET },
      body: Buffer.from(imageBuffer),
    });
    const data = await uploadRes.json();
    return data.success ? data.url : null;
  } catch (error) {
    console.error("Image upload error:", error);
    return null;
  }
}

async function apiCall(endpoint, body) {
  try {
    const res = await fetch(`${WEBHOOK_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, botSecret: BOT_SECRET }),
    });
    return await res.json();
  } catch (error) {
    console.error(`API call error (${endpoint}):`, error);
    return { success: false, error: error.message };
  }
}

// Extract OG metadata from URL
async function extractUrlMeta(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; XPLAYBot/1.0)" },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    const html = await res.text();

    const getOg = (prop) => {
      const m = html.match(new RegExp(`<meta[^>]*property=["']og:${prop}["'][^>]*content=["']([^"']*)["']`, "i"))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:${prop}["']`, "i"));
      return m ? m[1] : null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);

    return {
      title: getOg("title") || (titleMatch ? titleMatch[1].trim() : url),
      description: getOg("description") || (descMatch ? descMatch[1] : null),
      imageUrl: getOg("image") || null,
      siteName: getOg("site_name") || new URL(url).hostname,
    };
  } catch (error) {
    console.error("URL meta extraction error:", error);
    return { title: url, description: null, imageUrl: null, siteName: new URL(url).hostname };
  }
}

async function processUpdate(update) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || message.caption || "";

  // ===== /help or /start =====
  if (text.startsWith("/help") || text.startsWith("/start")) {
    await sendMessage(chatId,
      `📢 <b>XPLAY 공지방 봇 (확장판)</b>\n\n` +
      `<b>📌 공지 관리:</b>\n` +
      `• <code>/공지 제목</code> — 새 공지 등록\n` +
      `• <code>/pin 제목</code> — 고정 공지 등록\n` +
      `• <code>/삭제 ID</code> — 공지 삭제\n\n` +
      `<b>📰 뉴스 관리:</b>\n` +
      `• <code>/뉴스 URL</code> — 뉴스 URL 공유\n` +
      `• <code>/뉴스삭제 ID</code> — 뉴스 삭제\n\n` +
      `<b>🤝 소통 파트너:</b>\n` +
      `• <code>/파트너 이름</code> — 파트너 등록\n` +
      `• <code>/파트너삭제 ID</code> — 파트너 삭제\n\n` +
      `<b>사용 예시:</b>\n` +
      `1. <code>/공지 XPLAY 2.0 업데이트</code>\n` +
      `2. 내용 텍스트 전송 (사진 첨부 가능)\n\n` +
      `<b>서버:</b> ${WEBHOOK_URL}`
    );
    return;
  }

  // ===== /공지 or /pin =====
  if (text.startsWith("/공지") || text.startsWith("/pin")) {
    const isPinned = text.startsWith("/pin");
    const title = text.replace(/^\/(공지|pin)\s*/, "").trim();
    if (!title) {
      await sendMessage(chatId, `⚠️ 제목을 입력해주세요.\n예시: <code>/${isPinned ? "pin" : "공지"} XPLAY 2.0 업데이트 안내</code>`);
      return;
    }
    pendingAnnouncements.set(chatId, { title, isPinned });
    await sendMessage(chatId,
      `📝 <b>공지 제목:</b> ${title}\n${isPinned ? "📌 <i>고정 공지로 등록됩니다</i>\n" : ""}\n` +
      `이제 <b>공지 내용</b>을 입력해주세요.\n사진을 첨부하면 이미지도 함께 등록됩니다.`
    );
    return;
  }

  // ===== /삭제 =====
  if (text.startsWith("/삭제")) {
    const idStr = text.replace(/^\/삭제\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `⚠️ 삭제할 공지 ID를 입력해주세요.\n예시: <code>/삭제 5</code>`);
      return;
    }
    const result = await apiCall("/api/telegram/delete", { type: "announcement", id });
    if (result.success) {
      await sendMessage(chatId, `✅ 공지 #${id}가 삭제되었습니다.`);
    } else {
      await sendMessage(chatId, `❌ 삭제 실패: ${result.error || "알 수 없는 오류"}`);
    }
    return;
  }

  // ===== /뉴스 =====
  if (text.startsWith("/뉴스삭제")) {
    const idStr = text.replace(/^\/뉴스삭제\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `⚠️ 삭제할 뉴스 ID를 입력해주세요.\n예시: <code>/뉴스삭제 3</code>`);
      return;
    }
    const result = await apiCall("/api/telegram/delete", { type: "news", id });
    if (result.success) {
      await sendMessage(chatId, `✅ 뉴스 #${id}가 삭제되었습니다.`);
    } else {
      await sendMessage(chatId, `❌ 삭제 실패: ${result.error || "알 수 없는 오류"}`);
    }
    return;
  }

  if (text.startsWith("/뉴스")) {
    const url = text.replace(/^\/뉴스\s*/, "").trim();
    if (!url || !url.startsWith("http")) {
      await sendMessage(chatId, `⚠️ URL을 입력해주세요.\n예시: <code>/뉴스 https://example.com/article</code>`);
      return;
    }
    await sendMessage(chatId, "🔍 URL 메타데이터 추출 중...");
    const meta = await extractUrlMeta(url);
    const result = await apiCall("/api/telegram/news", {
      url,
      title: meta.title,
      description: meta.description,
      imageUrl: meta.imageUrl,
      siteName: meta.siteName,
    });
    if (result.success) {
      await sendMessage(chatId,
        `✅ <b>뉴스가 등록되었습니다!</b>\n\n` +
        `📰 <b>제목:</b> ${meta.title}\n` +
        `🌐 <b>출처:</b> ${meta.siteName}\n` +
        `${meta.description ? `📝 ${meta.description.substring(0, 100)}...\n` : ""}` +
        `\n🔗 <a href="${WEBHOOK_URL}/#announcements">웹사이트에서 확인</a>`
      );
    } else {
      await sendMessage(chatId, `❌ 뉴스 등록 실패: ${result.error || "알 수 없는 오류"}`);
    }
    return;
  }

  // ===== /파트너 =====
  if (text.startsWith("/파트너삭제")) {
    const idStr = text.replace(/^\/파트너삭제\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `⚠️ 삭제할 파트너 ID를 입력해주세요.\n예시: <code>/파트너삭제 2</code>`);
      return;
    }
    const result = await apiCall("/api/telegram/partner/delete", { id });
    if (result.success) {
      await sendMessage(chatId, `✅ 파트너 #${id}가 삭제되었습니다.`);
    } else {
      await sendMessage(chatId, `❌ 삭제 실패: ${result.error || "알 수 없는 오류"}`);
    }
    return;
  }

  if (text.startsWith("/파트너")) {
    const name = text.replace(/^\/파트너\s*/, "").trim();
    if (!name) {
      await sendMessage(chatId, `⚠️ 파트너 이름을 입력해주세요.\n예시: <code>/파트너 홍길동</code>`);
      return;
    }
    pendingPartners.set(chatId, { name });
    await sendMessage(chatId,
      `🤝 <b>파트너 이름:</b> ${name}\n\n` +
      `이제 연락처 정보를 아래 형식으로 입력해주세요:\n\n` +
      `<code>설명: XPLAY 한국 파트너\n` +
      `전화: +82-10-1234-5678\n` +
      `텔레그램: @username\n` +
      `카카오: kakao_id\n` +
      `왓츠앱: +82-10-1234-5678\n` +
      `위챗: wechat_id</code>\n\n` +
      `필요한 항목만 입력하면 됩니다.`
    );
    return;
  }

  // ===== Pending Announcement Content =====
  if (pendingAnnouncements.has(chatId)) {
    const pending = pendingAnnouncements.get(chatId);
    pendingAnnouncements.delete(chatId);

    const content = text || "(이미지 공지)";
    let imageUrl = null;

    if (message.photo && message.photo.length > 0) {
      const largestPhoto = message.photo[message.photo.length - 1];
      await sendMessage(chatId, "📷 이미지 업로드 중...");
      const fileUrl = await getFileUrl(largestPhoto.file_id);
      if (fileUrl) imageUrl = await uploadImageToServer(fileUrl);
    }

    await sendMessage(chatId, "⏳ 공지 등록 중...");
    const result = await apiCall("/api/telegram/webhook", {
      title: pending.title,
      content,
      imageUrl,
      isPinned: pending.isPinned,
      authorName: "XPLAY Admin",
    });

    if (result.success) {
      await sendMessage(chatId,
        `✅ <b>공지가 등록되었습니다!</b> (ID: ${result.id})\n\n` +
        `📌 <b>제목:</b> ${pending.title}\n` +
        `${pending.isPinned ? "📍 고정 공지로 설정됨\n" : ""}` +
        `${imageUrl ? "🖼 이미지 포함\n" : ""}` +
        `\n🌐 <a href="${WEBHOOK_URL}/#announcements">웹사이트에서 확인</a>\n` +
        `\n삭제하려면: <code>/삭제 ${result.id}</code>`
      );
    } else {
      await sendMessage(chatId, `❌ 공지 등록 실패: ${result.error || "알 수 없는 오류"}\n다시 시도해주세요.`);
    }
    return;
  }

  // ===== Pending Partner Info =====
  if (pendingPartners.has(chatId)) {
    const pending = pendingPartners.get(chatId);
    pendingPartners.delete(chatId);

    // Parse contact info
    const lines = text.split("\n");
    const info = { name: pending.name };
    for (const line of lines) {
      const [key, ...vals] = line.split(":");
      const value = vals.join(":").trim();
      if (!value) continue;
      const k = key.trim().toLowerCase();
      if (k.includes("설명") || k.includes("desc")) info.description = value;
      else if (k.includes("전화") || k.includes("phone")) info.phone = value;
      else if (k.includes("텔레그램") || k.includes("telegram")) info.telegram = value;
      else if (k.includes("카카오") || k.includes("kakao")) info.kakao = value;
      else if (k.includes("왓츠앱") || k.includes("whatsapp")) info.whatsapp = value;
      else if (k.includes("위챗") || k.includes("wechat")) info.wechat = value;
    }

    const result = await apiCall("/api/telegram/partner", info);
    if (result.success) {
      await sendMessage(chatId,
        `✅ <b>소통 파트너가 등록되었습니다!</b> (ID: ${result.id})\n\n` +
        `🤝 <b>이름:</b> ${pending.name}\n` +
        `${info.telegram ? `📱 텔레그램: ${info.telegram}\n` : ""}` +
        `${info.kakao ? `💬 카카오: ${info.kakao}\n` : ""}` +
        `${info.whatsapp ? `📞 왓츠앱: ${info.whatsapp}\n` : ""}` +
        `${info.wechat ? `💚 위챗: ${info.wechat}\n` : ""}` +
        `\n삭제하려면: <code>/파트너삭제 ${result.id}</code>`
      );
    } else {
      await sendMessage(chatId, `❌ 파트너 등록 실패: ${result.error || "알 수 없는 오류"}`);
    }
    return;
  }
}

// Long polling
async function startPolling() {
  console.log("🤖 XPLAY Announcement Bot (Extended) started");
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);
  console.log("📋 Commands: /공지, /pin, /뉴스, /삭제, /뉴스삭제, /파트너, /파트너삭제, /help");

  let offset = 0;
  while (true) {
    try {
      const result = await tgApi("getUpdates", { offset, timeout: 30, allowed_updates: ["message"] });
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
