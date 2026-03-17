#!/usr/bin/env node
/**
 * XPLAY Announcement Telegram Bot (Extended + Multi-language)
 * 
 * Features:
 *   - 25 languages with flag emoji selection
 *   - /start shows language picker (inline keyboard)
 *   - /lang  changes language anytime
 *   - All responses in selected language
 *
 * Commands:
 *   /공지 <제목>     — 새 공지 등록 (다음 메시지로 내용+사진)
 *   /pin <제목>      — 고정 공지 등록
 *   /뉴스 <URL>      — 뉴스 URL 공유 (OG 메타데이터 자동 추출)
 *   /삭제 <ID>       — 공지 삭제
 *   /뉴스삭제 <ID>   — 뉴스 삭제
 *   /파트너 <이름>   — 소통 파트너 등록 (다음 메시지로 연락처 정보)
 *   /파트너삭제 <ID> — 소통 파트너 삭제
 *   /cs              — CS 문의 목록 확인
 *   /cs답변 <ID>     — CS 문의에 답변
 *   /help            — 도움말
 *   /lang            — 언어 변경
 */

import "dotenv/config";
import net from "node:net";
import dns from "node:dns";

// Force IPv4 to avoid Docker IPv6 routing issues with Node.js 22 built-in fetch
net.setDefaultAutoSelectFamily(false);
dns.setDefaultResultOrder("ipv4first");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_SECRET = process.env.TELEGRAM_BOT_SECRET;
const WEBHOOK_URL = process.env.WEBHOOK_URL || "https://xplay.infoweb4.vip";

if (!BOT_TOKEN) { console.error("❌ TELEGRAM_BOT_TOKEN is not set"); process.exit(1); }
if (!BOT_SECRET) { console.error("❌ TELEGRAM_BOT_SECRET is not set"); process.exit(1); }

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// =====================================================================
// MULTI-LANGUAGE SUPPORT
// =====================================================================

const LANGUAGES = {
  ko: { flag: "🇰🇷", name: "한국어" },
  en: { flag: "🇺🇸", name: "English" },
  zh: { flag: "🇨🇳", name: "中文" },
  ja: { flag: "🇯🇵", name: "日本語" },
  vi: { flag: "🇻🇳", name: "Tiếng Việt" },
  th: { flag: "🇹🇭", name: "ภาษาไทย" },
  es: { flag: "🇪🇸", name: "Español" },
  pt: { flag: "🇧🇷", name: "Português" },
  fr: { flag: "🇫🇷", name: "Français" },
  de: { flag: "🇩🇪", name: "Deutsch" },
  ru: { flag: "🇷🇺", name: "Русский" },
  ar: { flag: "🇸🇦", name: "العربية" },
  hi: { flag: "🇮🇳", name: "हिन्दी" },
  id: { flag: "🇮🇩", name: "Bahasa Indonesia" },
  ms: { flag: "🇲🇾", name: "Bahasa Melayu" },
  tl: { flag: "🇵🇭", name: "Filipino" },
  tr: { flag: "🇹🇷", name: "Türkçe" },
  it: { flag: "🇮🇹", name: "Italiano" },
  nl: { flag: "🇳🇱", name: "Nederlands" },
  pl: { flag: "🇵🇱", name: "Polski" },
  sv: { flag: "🇸🇪", name: "Svenska" },
  uk: { flag: "🇺🇦", name: "Українська" },
  bn: { flag: "🇧🇩", name: "বাংলা" },
  my: { flag: "🇲🇲", name: "မြန်မာ" },
  km: { flag: "🇰🇭", name: "ខ្មែរ" },
};

// All UI strings per language
const I18N = {
  ko: {
    langSelected: "🇰🇷 한국어가 선택되었습니다.",
    selectLang: "🌐 사용할 언어를 선택해주세요:",
    helpTitle: "📢 <b>XPLAY 공지방 봇</b>",
    helpAnnounce: "<b>📌 공지 관리:</b>",
    helpAnnounceNew: "새 공지 등록",
    helpAnnouncePin: "고정 공지 등록",
    helpAnnounceDel: "공지 삭제",
    helpNews: "<b>📰 뉴스 관리:</b>",
    helpNewsAdd: "뉴스 URL 공유",
    helpNewsDel: "뉴스 삭제",
    helpPartner: "<b>🤝 소통 파트너:</b>",
    helpPartnerAdd: "파트너 등록",
    helpPartnerDel: "파트너 삭제",
    helpCs: "<b>🎧 CS 관리:</b>",
    helpCsList: "미답변 CS 문의 목록",
    helpCsReply: "CS 문의에 답변",
    helpLang: "<b>🌐 언어:</b>",
    helpLangChange: "언어 변경",
    helpExample: "<b>사용 예시:</b>",
    helpEx1: "1. <code>/공지 XPLAY 2.0 업데이트</code>",
    helpEx2: "2. 내용 텍스트 전송 (사진 첨부 가능)",
    server: "서버",
    enterTitle: "⚠️ 제목을 입력해주세요.",
    example: "예시",
    announceTitleSet: "📝 <b>공지 제목:</b>",
    pinnedNote: "📌 <i>고정 공지로 등록됩니다</i>",
    enterContent: "이제 <b>공지 내용</b>을 입력해주세요.\n사진을 첨부하면 이미지도 함께 등록됩니다.",
    uploadingImage: "📷 이미지 업로드 중...",
    registering: "⏳ 공지 등록 중...",
    announceSuccess: "✅ <b>공지가 등록되었습니다!</b>",
    title: "제목",
    pinnedSet: "📍 고정 공지로 설정됨",
    imageIncluded: "🖼 이미지 포함",
    checkWebsite: "웹사이트에서 확인",
    deleteWith: "삭제하려면",
    announceFail: "❌ 공지 등록 실패",
    tryAgain: "다시 시도해주세요.",
    enterId: "⚠️ ID를 입력해주세요.",
    deleteSuccess: "✅ 삭제되었습니다.",
    deleteFail: "❌ 삭제 실패",
    unknownError: "알 수 없는 오류",
    enterUrl: "⚠️ URL을 입력해주세요.",
    extractingMeta: "🔍 URL 메타데이터 추출 중...",
    newsSuccess: "✅ <b>뉴스가 등록되었습니다!</b>",
    newsTitle: "제목",
    newsSource: "출처",
    newsFail: "❌ 뉴스 등록 실패",
    enterPartnerName: "⚠️ 파트너 이름을 입력해주세요.",
    partnerNameSet: "🤝 <b>파트너 이름:</b>",
    enterContactInfo: "이제 연락처 정보를 아래 형식으로 입력해주세요:",
    contactFormat: "설명: XPLAY 한국 파트너\n전화: +82-10-1234-5678\n텔레그램: @username\n카카오: kakao_id\n왓츠앱: +82-10-1234-5678\n위챗: wechat_id",
    onlyNeeded: "필요한 항목만 입력하면 됩니다.",
    partnerSuccess: "✅ <b>소통 파트너가 등록되었습니다!</b>",
    partnerName: "이름",
    partnerFail: "❌ 파트너 등록 실패",
    csEnterReplyId: "⚠️ 답변할 CS 문의 ID를 입력해주세요.",
    csEnterReply: "🎧 CS 답변을 입력해주세요.",
    csNoTickets: "✅ 미답변 CS 문의가 없습니다.",
    csListTitle: "🎧 <b>미답변 CS 문의</b>",
    csReplyWith: "답변하려면",
    csReplySuccess: "✅ CS 답변이 전송되었습니다.",
    csReplyFail: "❌ 답변 실패",
    enterReplyContent: "⚠️ 답변 내용을 입력해주세요.",
    csListFail: "❌ CS 목록 조회 실패",
    imageAnnounce: "(이미지 공지)",
    descLabel: "설명",
    phoneLabel: "전화",
    telegramLabel: "텔레그램",
    kakaoLabel: "카카오",
    whatsappLabel: "왓츠앱",
    wechatLabel: "위챗",
  },
  en: {
    langSelected: "🇺🇸 English has been selected.",
    selectLang: "🌐 Please select your language:",
    helpTitle: "📢 <b>XPLAY Announcement Bot</b>",
    helpAnnounce: "<b>📌 Announcements:</b>",
    helpAnnounceNew: "New announcement",
    helpAnnouncePin: "Pinned announcement",
    helpAnnounceDel: "Delete announcement",
    helpNews: "<b>📰 News:</b>",
    helpNewsAdd: "Share news URL",
    helpNewsDel: "Delete news",
    helpPartner: "<b>🤝 Partners:</b>",
    helpPartnerAdd: "Register partner",
    helpPartnerDel: "Delete partner",
    helpCs: "<b>🎧 CS Support:</b>",
    helpCsList: "Unanswered CS tickets",
    helpCsReply: "Reply to CS ticket",
    helpLang: "<b>🌐 Language:</b>",
    helpLangChange: "Change language",
    helpExample: "<b>Usage example:</b>",
    helpEx1: "1. <code>/공지 XPLAY 2.0 Update</code>",
    helpEx2: "2. Send content text (attach photo if needed)",
    server: "Server",
    enterTitle: "⚠️ Please enter a title.",
    example: "Example",
    announceTitleSet: "📝 <b>Announcement title:</b>",
    pinnedNote: "📌 <i>Will be registered as pinned</i>",
    enterContent: "Now please enter the <b>announcement content</b>.\nAttach a photo to include an image.",
    uploadingImage: "📷 Uploading image...",
    registering: "⏳ Registering announcement...",
    announceSuccess: "✅ <b>Announcement registered!</b>",
    title: "Title",
    pinnedSet: "📍 Set as pinned",
    imageIncluded: "🖼 Image included",
    checkWebsite: "Check on website",
    deleteWith: "To delete",
    announceFail: "❌ Announcement registration failed",
    tryAgain: "Please try again.",
    enterId: "⚠️ Please enter an ID.",
    deleteSuccess: "✅ Deleted successfully.",
    deleteFail: "❌ Delete failed",
    unknownError: "Unknown error",
    enterUrl: "⚠️ Please enter a URL.",
    extractingMeta: "🔍 Extracting URL metadata...",
    newsSuccess: "✅ <b>News registered!</b>",
    newsTitle: "Title",
    newsSource: "Source",
    newsFail: "❌ News registration failed",
    enterPartnerName: "⚠️ Please enter partner name.",
    partnerNameSet: "🤝 <b>Partner name:</b>",
    enterContactInfo: "Now enter contact info in the format below:",
    contactFormat: "desc: XPLAY Partner\nphone: +1-234-567-8900\ntelegram: @username\nkakao: kakao_id\nwhatsapp: +1-234-567-8900\nwechat: wechat_id",
    onlyNeeded: "Enter only the fields you need.",
    partnerSuccess: "✅ <b>Partner registered!</b>",
    partnerName: "Name",
    partnerFail: "❌ Partner registration failed",
    csEnterReplyId: "⚠️ Please enter the CS ticket ID to reply.",
    csEnterReply: "🎧 Please enter your CS reply.",
    csNoTickets: "✅ No unanswered CS tickets.",
    csListTitle: "🎧 <b>Unanswered CS Tickets</b>",
    csReplyWith: "To reply",
    csReplySuccess: "✅ CS reply sent.",
    csReplyFail: "❌ Reply failed",
    enterReplyContent: "⚠️ Please enter reply content.",
    csListFail: "❌ Failed to load CS list",
    imageAnnounce: "(Image announcement)",
    descLabel: "desc",
    phoneLabel: "phone",
    telegramLabel: "telegram",
    kakaoLabel: "kakao",
    whatsappLabel: "whatsapp",
    wechatLabel: "wechat",
  },
  zh: {
    langSelected: "🇨🇳 已选择中文。",
    selectLang: "🌐 请选择您的语言：",
    helpTitle: "📢 <b>XPLAY 公告机器人</b>",
    helpAnnounce: "<b>📌 公告管理：</b>",
    helpAnnounceNew: "新建公告",
    helpAnnouncePin: "置顶公告",
    helpAnnounceDel: "删除公告",
    helpNews: "<b>📰 新闻管理：</b>",
    helpNewsAdd: "分享新闻链接",
    helpNewsDel: "删除新闻",
    helpPartner: "<b>🤝 合作伙伴：</b>",
    helpPartnerAdd: "注册合作伙伴",
    helpPartnerDel: "删除合作伙伴",
    helpCs: "<b>🎧 客服管理：</b>",
    helpCsList: "未回复工单",
    helpCsReply: "回复工单",
    helpLang: "<b>🌐 语言：</b>",
    helpLangChange: "更改语言",
    helpExample: "<b>使用示例：</b>",
    helpEx1: "1. <code>/공지 XPLAY 2.0 更新</code>",
    helpEx2: "2. 发送内容文本（可附带图片）",
    server: "服务器",
    enterTitle: "⚠️ 请输入标题。",
    example: "示例",
    announceTitleSet: "📝 <b>公告标题：</b>",
    pinnedNote: "📌 <i>将注册为置顶公告</i>",
    enterContent: "现在请输入<b>公告内容</b>。\n附带图片可一并上传。",
    uploadingImage: "📷 正在上传图片...",
    registering: "⏳ 正在注册公告...",
    announceSuccess: "✅ <b>公告已注册！</b>",
    title: "标题",
    pinnedSet: "📍 已设为置顶",
    imageIncluded: "🖼 包含图片",
    checkWebsite: "在网站查看",
    deleteWith: "删除请使用",
    announceFail: "❌ 公告注册失败",
    tryAgain: "请重试。",
    enterId: "⚠️ 请输入ID。",
    deleteSuccess: "✅ 删除成功。",
    deleteFail: "❌ 删除失败",
    unknownError: "未知错误",
    enterUrl: "⚠️ 请输入URL。",
    extractingMeta: "🔍 正在提取URL元数据...",
    newsSuccess: "✅ <b>新闻已注册！</b>",
    newsTitle: "标题",
    newsSource: "来源",
    newsFail: "❌ 新闻注册失败",
    enterPartnerName: "⚠️ 请输入合作伙伴名称。",
    partnerNameSet: "🤝 <b>合作伙伴名称：</b>",
    enterContactInfo: "请按以下格式输入联系方式：",
    contactFormat: "描述: XPLAY 合作伙伴\n电话: +86-123-4567-8900\ntelegram: @username\nkakao: kakao_id\nwhatsapp: +86-123-4567-8900\nwechat: wechat_id",
    onlyNeeded: "只需填写必要项目。",
    partnerSuccess: "✅ <b>合作伙伴已注册！</b>",
    partnerName: "名称",
    partnerFail: "❌ 合作伙伴注册失败",
    csEnterReplyId: "⚠️ 请输入要回复的工单ID。",
    csEnterReply: "🎧 请输入客服回复。",
    csNoTickets: "✅ 没有未回复的工单。",
    csListTitle: "🎧 <b>未回复工单</b>",
    csReplyWith: "回复请使用",
    csReplySuccess: "✅ 客服回复已发送。",
    csReplyFail: "❌ 回复失败",
    enterReplyContent: "⚠️ 请输入回复内容。",
    csListFail: "❌ 工单列表加载失败",
    imageAnnounce: "（图片公告）",
    descLabel: "描述",
    phoneLabel: "电话",
    telegramLabel: "telegram",
    kakaoLabel: "kakao",
    whatsappLabel: "whatsapp",
    wechatLabel: "wechat",
  },
  ja: {
    langSelected: "🇯🇵 日本語が選択されました。",
    selectLang: "🌐 言語を選択してください：",
    helpTitle: "📢 <b>XPLAY お知らせボット</b>",
    helpAnnounce: "<b>📌 お知らせ管理：</b>",
    helpAnnounceNew: "新規お知らせ",
    helpAnnouncePin: "固定お知らせ",
    helpAnnounceDel: "お知らせ削除",
    helpNews: "<b>📰 ニュース管理：</b>",
    helpNewsAdd: "ニュースURL共有",
    helpNewsDel: "ニュース削除",
    helpPartner: "<b>🤝 パートナー：</b>",
    helpPartnerAdd: "パートナー登録",
    helpPartnerDel: "パートナー削除",
    helpCs: "<b>🎧 CS管理：</b>",
    helpCsList: "未回答チケット",
    helpCsReply: "チケットに返信",
    helpLang: "<b>🌐 言語：</b>",
    helpLangChange: "言語変更",
    helpExample: "<b>使用例：</b>",
    helpEx1: "1. <code>/공지 XPLAY 2.0 アップデート</code>",
    helpEx2: "2. 内容テキストを送信（写真添付可）",
    server: "サーバー",
    enterTitle: "⚠️ タイトルを入力してください。",
    example: "例",
    announceTitleSet: "📝 <b>お知らせタイトル：</b>",
    pinnedNote: "📌 <i>固定お知らせとして登録されます</i>",
    enterContent: "<b>お知らせ内容</b>を入力してください。\n写真を添付すると画像も登録されます。",
    uploadingImage: "📷 画像アップロード中...",
    registering: "⏳ お知らせ登録中...",
    announceSuccess: "✅ <b>お知らせが登録されました！</b>",
    title: "タイトル",
    pinnedSet: "📍 固定に設定済み",
    imageIncluded: "🖼 画像含む",
    checkWebsite: "ウェブサイトで確認",
    deleteWith: "削除するには",
    announceFail: "❌ お知らせ登録失敗",
    tryAgain: "もう一度お試しください。",
    enterId: "⚠️ IDを入力してください。",
    deleteSuccess: "✅ 削除しました。",
    deleteFail: "❌ 削除失敗",
    unknownError: "不明なエラー",
    enterUrl: "⚠️ URLを入力してください。",
    extractingMeta: "🔍 URLメタデータ抽出中...",
    newsSuccess: "✅ <b>ニュースが登録されました！</b>",
    newsTitle: "タイトル",
    newsSource: "出典",
    newsFail: "❌ ニュース登録失敗",
    enterPartnerName: "⚠️ パートナー名を入力してください。",
    partnerNameSet: "🤝 <b>パートナー名：</b>",
    enterContactInfo: "以下の形式で連絡先情報を入力してください：",
    contactFormat: "説明: XPLAY パートナー\n電話: +81-90-1234-5678\ntelegram: @username\nkakao: kakao_id\nwhatsapp: +81-90-1234-5678\nwechat: wechat_id",
    onlyNeeded: "必要な項目のみ入力してください。",
    partnerSuccess: "✅ <b>パートナーが登録されました！</b>",
    partnerName: "名前",
    partnerFail: "❌ パートナー登録失敗",
    csEnterReplyId: "⚠️ 返信するCSチケットIDを入力してください。",
    csEnterReply: "🎧 CS返信を入力してください。",
    csNoTickets: "✅ 未回答のCSチケットはありません。",
    csListTitle: "🎧 <b>未回答CSチケット</b>",
    csReplyWith: "返信するには",
    csReplySuccess: "✅ CS返信が送信されました。",
    csReplyFail: "❌ 返信失敗",
    enterReplyContent: "⚠️ 返信内容を入力してください。",
    csListFail: "❌ CSリスト取得失敗",
    imageAnnounce: "（画像お知らせ）",
    descLabel: "説明",
    phoneLabel: "電話",
    telegramLabel: "telegram",
    kakaoLabel: "kakao",
    whatsappLabel: "whatsapp",
    wechatLabel: "wechat",
  },
  vi: {
    langSelected: "🇻🇳 Đã chọn Tiếng Việt.",
    selectLang: "🌐 Vui lòng chọn ngôn ngữ:",
    helpTitle: "📢 <b>XPLAY Bot Thông Báo</b>",
    helpAnnounce: "<b>📌 Quản lý thông báo:</b>",
    helpAnnounceNew: "Thông báo mới",
    helpAnnouncePin: "Ghim thông báo",
    helpAnnounceDel: "Xóa thông báo",
    helpNews: "<b>📰 Quản lý tin tức:</b>",
    helpNewsAdd: "Chia sẻ URL tin tức",
    helpNewsDel: "Xóa tin tức",
    helpPartner: "<b>🤝 Đối tác:</b>",
    helpPartnerAdd: "Đăng ký đối tác",
    helpPartnerDel: "Xóa đối tác",
    helpCs: "<b>🎧 Hỗ trợ CS:</b>",
    helpCsList: "Yêu cầu CS chưa trả lời",
    helpCsReply: "Trả lời yêu cầu CS",
    helpLang: "<b>🌐 Ngôn ngữ:</b>",
    helpLangChange: "Đổi ngôn ngữ",
    helpExample: "<b>Ví dụ:</b>",
    helpEx1: "1. <code>/공지 XPLAY 2.0 Cập nhật</code>",
    helpEx2: "2. Gửi nội dung (có thể đính kèm ảnh)",
    server: "Máy chủ",
    enterTitle: "⚠️ Vui lòng nhập tiêu đề.",
    example: "Ví dụ",
    announceTitleSet: "📝 <b>Tiêu đề thông báo:</b>",
    pinnedNote: "📌 <i>Sẽ được ghim</i>",
    enterContent: "Bây giờ hãy nhập <b>nội dung thông báo</b>.\nĐính kèm ảnh nếu cần.",
    uploadingImage: "📷 Đang tải ảnh lên...",
    registering: "⏳ Đang đăng ký thông báo...",
    announceSuccess: "✅ <b>Thông báo đã được đăng ký!</b>",
    title: "Tiêu đề",
    pinnedSet: "📍 Đã ghim",
    imageIncluded: "🖼 Có ảnh",
    checkWebsite: "Xem trên website",
    deleteWith: "Để xóa",
    announceFail: "❌ Đăng ký thông báo thất bại",
    tryAgain: "Vui lòng thử lại.",
    enterId: "⚠️ Vui lòng nhập ID.",
    deleteSuccess: "✅ Đã xóa thành công.",
    deleteFail: "❌ Xóa thất bại",
    unknownError: "Lỗi không xác định",
    enterUrl: "⚠️ Vui lòng nhập URL.",
    extractingMeta: "🔍 Đang trích xuất metadata...",
    newsSuccess: "✅ <b>Tin tức đã được đăng ký!</b>",
    newsTitle: "Tiêu đề",
    newsSource: "Nguồn",
    newsFail: "❌ Đăng ký tin tức thất bại",
    enterPartnerName: "⚠️ Vui lòng nhập tên đối tác.",
    partnerNameSet: "🤝 <b>Tên đối tác:</b>",
    enterContactInfo: "Nhập thông tin liên hệ theo định dạng:",
    contactFormat: "mô tả: Đối tác XPLAY\nđiện thoại: +84-123-456-789\ntelegram: @username\nkakao: kakao_id\nwhatsapp: +84-123-456-789\nwechat: wechat_id",
    onlyNeeded: "Chỉ cần nhập các mục cần thiết.",
    partnerSuccess: "✅ <b>Đối tác đã được đăng ký!</b>",
    partnerName: "Tên",
    partnerFail: "❌ Đăng ký đối tác thất bại",
    csEnterReplyId: "⚠️ Vui lòng nhập ID yêu cầu CS.",
    csEnterReply: "🎧 Vui lòng nhập câu trả lời CS.",
    csNoTickets: "✅ Không có yêu cầu CS chưa trả lời.",
    csListTitle: "🎧 <b>Yêu cầu CS chưa trả lời</b>",
    csReplyWith: "Để trả lời",
    csReplySuccess: "✅ Đã gửi câu trả lời CS.",
    csReplyFail: "❌ Trả lời thất bại",
    enterReplyContent: "⚠️ Vui lòng nhập nội dung trả lời.",
    csListFail: "❌ Không thể tải danh sách CS",
    imageAnnounce: "(Thông báo hình ảnh)",
    descLabel: "mô tả",
    phoneLabel: "điện thoại",
    telegramLabel: "telegram",
    kakaoLabel: "kakao",
    whatsappLabel: "whatsapp",
    wechatLabel: "wechat",
  },
  th: {
    langSelected: "🇹🇭 เลือกภาษาไทยแล้ว",
    selectLang: "🌐 กรุณาเลือกภาษา:",
    helpTitle: "📢 <b>XPLAY บอทประกาศ</b>",
    helpAnnounce: "<b>📌 จัดการประกาศ:</b>",
    helpAnnounceNew: "ประกาศใหม่",
    helpAnnouncePin: "ปักหมุดประกาศ",
    helpAnnounceDel: "ลบประกาศ",
    helpNews: "<b>📰 จัดการข่าว:</b>",
    helpNewsAdd: "แชร์ URL ข่าว",
    helpNewsDel: "ลบข่าว",
    helpPartner: "<b>🤝 พาร์ทเนอร์:</b>",
    helpPartnerAdd: "ลงทะเบียนพาร์ทเนอร์",
    helpPartnerDel: "ลบพาร์ทเนอร์",
    helpCs: "<b>🎧 CS:</b>",
    helpCsList: "ตั๋ว CS ที่ยังไม่ตอบ",
    helpCsReply: "ตอบตั๋ว CS",
    helpLang: "<b>🌐 ภาษา:</b>",
    helpLangChange: "เปลี่ยนภาษา",
    helpExample: "<b>ตัวอย่าง:</b>",
    helpEx1: "1. <code>/공지 XPLAY 2.0 อัปเดต</code>",
    helpEx2: "2. ส่งข้อความ (แนบรูปได้)",
    server: "เซิร์ฟเวอร์",
    enterTitle: "⚠️ กรุณาใส่หัวข้อ",
    example: "ตัวอย่าง",
    announceTitleSet: "📝 <b>หัวข้อประกาศ:</b>",
    pinnedNote: "📌 <i>จะถูกปักหมุด</i>",
    enterContent: "กรุณาใส่<b>เนื้อหาประกาศ</b>\nแนบรูปเพื่อรวมภาพ",
    uploadingImage: "📷 กำลังอัปโหลดรูป...",
    registering: "⏳ กำลังลงทะเบียนประกาศ...",
    announceSuccess: "✅ <b>ลงทะเบียนประกาศแล้ว!</b>",
    title: "หัวข้อ",
    pinnedSet: "📍 ปักหมุดแล้ว",
    imageIncluded: "🖼 มีรูปภาพ",
    checkWebsite: "ดูบนเว็บไซต์",
    deleteWith: "ลบด้วย",
    announceFail: "❌ ลงทะเบียนประกาศล้มเหลว",
    tryAgain: "กรุณาลองอีกครั้ง",
    enterId: "⚠️ กรุณาใส่ ID",
    deleteSuccess: "✅ ลบสำเร็จ",
    deleteFail: "❌ ลบล้มเหลว",
    unknownError: "ข้อผิดพลาดที่ไม่ทราบ",
    enterUrl: "⚠️ กรุณาใส่ URL",
    extractingMeta: "🔍 กำลังดึง metadata...",
    newsSuccess: "✅ <b>ลงทะเบียนข่าวแล้ว!</b>",
    newsTitle: "หัวข้อ",
    newsSource: "แหล่งที่มา",
    newsFail: "❌ ลงทะเบียนข่าวล้มเหลว",
    enterPartnerName: "⚠️ กรุณาใส่ชื่อพาร์ทเนอร์",
    partnerNameSet: "🤝 <b>ชื่อพาร์ทเนอร์:</b>",
    enterContactInfo: "ใส่ข้อมูลติดต่อตามรูปแบบ:",
    contactFormat: "คำอธิบาย: XPLAY พาร์ทเนอร์\nโทร: +66-12-345-6789\ntelegram: @username\nkakao: kakao_id\nwhatsapp: +66-12-345-6789\nwechat: wechat_id",
    onlyNeeded: "กรอกเฉพาะรายการที่ต้องการ",
    partnerSuccess: "✅ <b>ลงทะเบียนพาร์ทเนอร์แล้ว!</b>",
    partnerName: "ชื่อ",
    partnerFail: "❌ ลงทะเบียนพาร์ทเนอร์ล้มเหลว",
    csEnterReplyId: "⚠️ กรุณาใส่ ID ตั๋ว CS",
    csEnterReply: "🎧 กรุณาใส่คำตอบ CS",
    csNoTickets: "✅ ไม่มีตั๋ว CS ที่ยังไม่ตอบ",
    csListTitle: "🎧 <b>ตั๋ว CS ที่ยังไม่ตอบ</b>",
    csReplyWith: "ตอบด้วย",
    csReplySuccess: "✅ ส่งคำตอบ CS แล้ว",
    csReplyFail: "❌ ตอบล้มเหลว",
    enterReplyContent: "⚠️ กรุณาใส่เนื้อหาคำตอบ",
    csListFail: "❌ โหลดรายการ CS ล้มเหลว",
    imageAnnounce: "(ประกาศรูปภาพ)",
    descLabel: "คำอธิบาย",
    phoneLabel: "โทร",
    telegramLabel: "telegram",
    kakaoLabel: "kakao",
    whatsappLabel: "whatsapp",
    wechatLabel: "wechat",
  },
};

// For languages without full translations, fall back to English
function t(lang, key) {
  return I18N[lang]?.[key] || I18N.en[key] || key;
}

// Store user language preferences (chatId -> langCode)
const userLangs = new Map();

function getUserLang(chatId) {
  return userLangs.get(chatId) || "ko";
}

// Store pending states
const pendingAnnouncements = new Map();
const pendingPartners = new Map();
const pendingCsReplies = new Map();

// =====================================================================
// TELEGRAM API HELPERS
// =====================================================================

async function tgApi(method, body = {}) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function sendMessage(chatId, text, parseMode = "HTML", extra = {}) {
  return tgApi("sendMessage", { chat_id: chatId, text, parse_mode: parseMode, ...extra });
}

async function answerCallbackQuery(callbackQueryId, text = "") {
  return tgApi("answerCallbackQuery", { callback_query_id: callbackQueryId, text });
}

async function editMessageText(chatId, messageId, text, parseMode = "HTML", extra = {}) {
  return tgApi("editMessageText", { chat_id: chatId, message_id: messageId, text, parse_mode: parseMode, ...extra });
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

// =====================================================================
// LANGUAGE SELECTION UI
// =====================================================================

function buildLangKeyboard() {
  const langKeys = Object.keys(LANGUAGES);
  const rows = [];
  for (let i = 0; i < langKeys.length; i += 3) {
    const row = langKeys.slice(i, i + 3).map((code) => ({
      text: `${LANGUAGES[code].flag} ${LANGUAGES[code].name}`,
      callback_data: `lang:${code}`,
    }));
    rows.push(row);
  }
  return { inline_keyboard: rows };
}

async function showLangPicker(chatId, lang) {
  await sendMessage(chatId, t(lang, "selectLang"), "HTML", {
    reply_markup: buildLangKeyboard(),
  });
}

// =====================================================================
// PROCESS CALLBACK QUERIES (inline keyboard clicks)
// =====================================================================

async function processCallbackQuery(callbackQuery) {
  const data = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  if (data.startsWith("lang:")) {
    const langCode = data.replace("lang:", "");
    if (LANGUAGES[langCode]) {
      userLangs.set(chatId, langCode);
      const langInfo = LANGUAGES[langCode];
      await answerCallbackQuery(callbackQuery.id, `${langInfo.flag} ${langInfo.name}`);
      await editMessageText(chatId, messageId, t(langCode, "langSelected"));
      // Show help in selected language
      await showHelp(chatId, langCode);
    }
  }
}

// =====================================================================
// HELP MESSAGE
// =====================================================================

function showHelp(chatId, lang) {
  const s = (key) => t(lang, key);
  return sendMessage(chatId,
    `${s("helpTitle")}\n\n` +
    `${s("helpAnnounce")}\n` +
    `• <code>/공지 ${s("title")}</code> — ${s("helpAnnounceNew")}\n` +
    `• <code>/pin ${s("title")}</code> — ${s("helpAnnouncePin")}\n` +
    `• <code>/삭제 ID</code> — ${s("helpAnnounceDel")}\n\n` +
    `${s("helpNews")}\n` +
    `• <code>/뉴스 URL</code> — ${s("helpNewsAdd")}\n` +
    `• <code>/뉴스삭제 ID</code> — ${s("helpNewsDel")}\n\n` +
    `${s("helpPartner")}\n` +
    `• <code>/파트너 ${s("partnerName")}</code> — ${s("helpPartnerAdd")}\n` +
    `• <code>/파트너삭제 ID</code> — ${s("helpPartnerDel")}\n\n` +
    `${s("helpCs")}\n` +
    `• <code>/cs</code> — ${s("helpCsList")}\n` +
    `• <code>/cs답변 ID</code> — ${s("helpCsReply")}\n\n` +
    `${s("helpLang")}\n` +
    `• <code>/lang</code> — ${s("helpLangChange")}\n\n` +
    `${s("helpExample")}\n` +
    `${s("helpEx1")}\n` +
    `${s("helpEx2")}\n\n` +
    `<b>${s("server")}:</b> ${WEBHOOK_URL}`
  );
}

// =====================================================================
// PROCESS MESSAGE UPDATES
// =====================================================================

async function processUpdate(update) {
  // Handle callback queries (inline keyboard)
  if (update.callback_query) {
    await processCallbackQuery(update.callback_query);
    return;
  }

  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || message.caption || "";
  const lang = getUserLang(chatId);
  const s = (key) => t(lang, key);

  // ===== /start =====
  if (text.startsWith("/start")) {
    await showLangPicker(chatId, lang);
    return;
  }

  // ===== /lang =====
  if (text.startsWith("/lang")) {
    await showLangPicker(chatId, lang);
    return;
  }

  // ===== /help =====
  if (text.startsWith("/help")) {
    await showHelp(chatId, lang);
    return;
  }

  // ===== /cs답변 =====
  if (text.startsWith("/cs답변")) {
    const idStr = text.replace(/^\/cs답변\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `${s("csEnterReplyId")}\n${s("example")}: <code>/cs답변 5</code>`);
      return;
    }
    pendingCsReplies.set(chatId, { id });
    await sendMessage(chatId, `${s("csEnterReply")} (CS #${id})`);
    return;
  }

  // ===== /cs =====
  if (text === "/cs") {
    try {
      const res = await fetch(`${WEBHOOK_URL}/api/telegram/cs-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botSecret: BOT_SECRET }),
      });
      const data = await res.json();
      if (data.success && data.tickets?.length > 0) {
        let msg = `${s("csListTitle")} (${data.tickets.length})\n\n`;
        for (const ticket of data.tickets.slice(0, 10)) {
          msg += `#${ticket.id} [${ticket.ticketNo}] <b>${ticket.subject}</b>\n`;
          msg += `  👤 ${ticket.name} | 📁 ${ticket.category}\n`;
          msg += `  📝 ${(ticket.message || "").substring(0, 80)}...\n\n`;
        }
        msg += `${s("csReplyWith")}: <code>/cs답변 ID</code>`;
        await sendMessage(chatId, msg);
      } else {
        await sendMessage(chatId, s("csNoTickets"));
      }
    } catch (err) {
      await sendMessage(chatId, s("csListFail"));
    }
    return;
  }

  // ===== /공지 or /pin =====
  if (text.startsWith("/공지") || text.startsWith("/pin")) {
    const isPinned = text.startsWith("/pin");
    const title = text.replace(/^\/(공지|pin)\s*/, "").trim();
    if (!title) {
      await sendMessage(chatId, `${s("enterTitle")}\n${s("example")}: <code>/${isPinned ? "pin" : "공지"} XPLAY 2.0</code>`);
      return;
    }
    pendingAnnouncements.set(chatId, { title, isPinned });
    await sendMessage(chatId,
      `${s("announceTitleSet")} ${title}\n${isPinned ? s("pinnedNote") + "\n" : ""}\n${s("enterContent")}`
    );
    return;
  }

  // ===== /삭제 =====
  if (text.startsWith("/삭제")) {
    const idStr = text.replace(/^\/삭제\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `${s("enterId")}\n${s("example")}: <code>/삭제 5</code>`);
      return;
    }
    const result = await apiCall("/api/telegram/delete", { type: "announcement", id });
    if (result.success) {
      await sendMessage(chatId, `${s("deleteSuccess")} (#${id})`);
    } else {
      await sendMessage(chatId, `${s("deleteFail")}: ${result.error || s("unknownError")}`);
    }
    return;
  }

  // ===== /뉴스삭제 =====
  if (text.startsWith("/뉴스삭제")) {
    const idStr = text.replace(/^\/뉴스삭제\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `${s("enterId")}\n${s("example")}: <code>/뉴스삭제 3</code>`);
      return;
    }
    const result = await apiCall("/api/telegram/delete", { type: "news", id });
    if (result.success) {
      await sendMessage(chatId, `${s("deleteSuccess")} (#${id})`);
    } else {
      await sendMessage(chatId, `${s("deleteFail")}: ${result.error || s("unknownError")}`);
    }
    return;
  }

  // ===== /뉴스 =====
  if (text.startsWith("/뉴스")) {
    const url = text.replace(/^\/뉴스\s*/, "").trim();
    if (!url || !url.startsWith("http")) {
      await sendMessage(chatId, `${s("enterUrl")}\n${s("example")}: <code>/뉴스 https://example.com/article</code>`);
      return;
    }
    await sendMessage(chatId, s("extractingMeta"));
    const meta = await extractUrlMeta(url);
    const result = await apiCall("/api/telegram/news", {
      url, title: meta.title, description: meta.description, imageUrl: meta.imageUrl, siteName: meta.siteName,
    });
    if (result.success) {
      await sendMessage(chatId,
        `${s("newsSuccess")}\n\n` +
        `📰 <b>${s("newsTitle")}:</b> ${meta.title}\n` +
        `🌐 <b>${s("newsSource")}:</b> ${meta.siteName}\n` +
        `${meta.description ? `📝 ${meta.description.substring(0, 100)}...\n` : ""}` +
        `\n🔗 <a href="${WEBHOOK_URL}/#announcements">${s("checkWebsite")}</a>`
      );
    } else {
      await sendMessage(chatId, `${s("newsFail")}: ${result.error || s("unknownError")}`);
    }
    return;
  }

  // ===== /파트너삭제 =====
  if (text.startsWith("/파트너삭제")) {
    const idStr = text.replace(/^\/파트너삭제\s*/, "").trim();
    const id = parseInt(idStr);
    if (!id || isNaN(id)) {
      await sendMessage(chatId, `${s("enterId")}\n${s("example")}: <code>/파트너삭제 2</code>`);
      return;
    }
    const result = await apiCall("/api/telegram/partner/delete", { id });
    if (result.success) {
      await sendMessage(chatId, `${s("deleteSuccess")} (#${id})`);
    } else {
      await sendMessage(chatId, `${s("deleteFail")}: ${result.error || s("unknownError")}`);
    }
    return;
  }

  // ===== /파트너 =====
  if (text.startsWith("/파트너")) {
    const name = text.replace(/^\/파트너\s*/, "").trim();
    if (!name) {
      await sendMessage(chatId, `${s("enterPartnerName")}\n${s("example")}: <code>/파트너 Partner</code>`);
      return;
    }
    pendingPartners.set(chatId, { name });
    await sendMessage(chatId,
      `${s("partnerNameSet")} ${name}\n\n` +
      `${s("enterContactInfo")}\n\n` +
      `<code>${s("contactFormat")}</code>\n\n` +
      `${s("onlyNeeded")}`
    );
    return;
  }

  // ===== Pending Announcement Content =====
  if (pendingAnnouncements.has(chatId)) {
    const pending = pendingAnnouncements.get(chatId);
    pendingAnnouncements.delete(chatId);
    const content = text || s("imageAnnounce");
    let imageUrl = null;
    if (message.photo && message.photo.length > 0) {
      const largestPhoto = message.photo[message.photo.length - 1];
      await sendMessage(chatId, s("uploadingImage"));
      const fileUrl = await getFileUrl(largestPhoto.file_id);
      if (fileUrl) imageUrl = await uploadImageToServer(fileUrl);
    }
    await sendMessage(chatId, s("registering"));
    const result = await apiCall("/api/telegram/webhook", {
      title: pending.title, content, imageUrl, isPinned: pending.isPinned, authorName: "XPLAY Admin",
    });
    if (result.success) {
      await sendMessage(chatId,
        `${s("announceSuccess")} (ID: ${result.id})\n\n` +
        `📌 <b>${s("title")}:</b> ${pending.title}\n` +
        `${pending.isPinned ? s("pinnedSet") + "\n" : ""}` +
        `${imageUrl ? s("imageIncluded") + "\n" : ""}` +
        `\n🌐 <a href="${WEBHOOK_URL}/#announcements">${s("checkWebsite")}</a>\n` +
        `\n${s("deleteWith")}: <code>/삭제 ${result.id}</code>`
      );
    } else {
      await sendMessage(chatId, `${s("announceFail")}: ${result.error || s("unknownError")}\n${s("tryAgain")}`);
    }
    return;
  }

  // ===== Pending CS Reply =====
  if (pendingCsReplies.has(chatId)) {
    const pending = pendingCsReplies.get(chatId);
    pendingCsReplies.delete(chatId);
    const reply = text.trim();
    if (!reply) {
      await sendMessage(chatId, s("enterReplyContent"));
      return;
    }
    const result = await apiCall("/api/telegram/cs-reply", { id: pending.id, reply });
    if (result.success) {
      await sendMessage(chatId, `${s("csReplySuccess")} (CS #${pending.id})`);
    } else {
      await sendMessage(chatId, `${s("csReplyFail")}: ${result.error || s("unknownError")}`);
    }
    return;
  }

  // ===== Pending Partner Info =====
  if (pendingPartners.has(chatId)) {
    const pending = pendingPartners.get(chatId);
    pendingPartners.delete(chatId);
    const lines = text.split("\n");
    const info = { name: pending.name };
    const descKeys = ["설명", "desc", "描述", "説明", "mô tả", "คำอธิบาย", "descripción", "descrição", "beschreibung", "описание"];
    const phoneKeys = ["전화", "phone", "电话", "電話", "điện thoại", "โทร", "teléfono", "telefone", "telefon"];
    const tgKeys = ["텔레그램", "telegram"];
    const kakaoKeys = ["카카오", "kakao"];
    const waKeys = ["왓츠앱", "whatsapp"];
    const wcKeys = ["위챗", "wechat"];
    for (const line of lines) {
      const [key, ...vals] = line.split(":");
      const value = vals.join(":").trim();
      if (!value) continue;
      const k = key.trim().toLowerCase();
      if (descKeys.some(dk => k.includes(dk))) info.description = value;
      else if (phoneKeys.some(pk => k.includes(pk))) info.phone = value;
      else if (tgKeys.some(tk => k.includes(tk))) info.telegram = value;
      else if (kakaoKeys.some(kk => k.includes(kk))) info.kakao = value;
      else if (waKeys.some(wk => k.includes(wk))) info.whatsapp = value;
      else if (wcKeys.some(wk => k.includes(wk))) info.wechat = value;
    }
    const result = await apiCall("/api/telegram/partner", info);
    if (result.success) {
      await sendMessage(chatId,
        `${s("partnerSuccess")} (ID: ${result.id})\n\n` +
        `🤝 <b>${s("partnerName")}:</b> ${pending.name}\n` +
        `${info.telegram ? `📱 ${s("telegramLabel")}: ${info.telegram}\n` : ""}` +
        `${info.kakao ? `💬 ${s("kakaoLabel")}: ${info.kakao}\n` : ""}` +
        `${info.whatsapp ? `📞 ${s("whatsappLabel")}: ${info.whatsapp}\n` : ""}` +
        `${info.wechat ? `💚 ${s("wechatLabel")}: ${info.wechat}\n` : ""}` +
        `\n${s("deleteWith")}: <code>/파트너삭제 ${result.id}</code>`
      );
    } else {
      await sendMessage(chatId, `${s("partnerFail")}: ${result.error || s("unknownError")}`);
    }
    return;
  }
}

// =====================================================================
// LONG POLLING
// =====================================================================

async function startPolling() {
  console.log("🤖 XPLAY Announcement Bot (Multi-language) started");
  console.log(`📡 Webhook URL: ${WEBHOOK_URL}`);
  console.log("📋 Commands: /start, /lang, /공지, /pin, /뉴스, /삭제, /뉴스삭제, /파트너, /파트너삭제, /cs, /cs답변, /help");
  console.log(`🌐 Languages: ${Object.keys(LANGUAGES).length}`);

  let offset = 0;
  while (true) {
    try {
      const result = await tgApi("getUpdates", { offset, timeout: 30, allowed_updates: ["message", "callback_query"] });
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
