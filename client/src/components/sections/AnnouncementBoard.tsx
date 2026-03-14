/*
 * AnnouncementBoard — Full-featured Notice Board
 * Features: announcements, news links, likes, search, comments, translation
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Pin, Calendar, ChevronRight, X, ImageIcon, Eye,
  Heart, Search, MessageCircle, Globe, ExternalLink, Newspaper,
  Send, ThumbsUp, Flame, ChevronDown, ChevronUp,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// ===== i18n =====
const I18N: Record<string, Record<string, string>> = {
  "board.badge": { ko: "NOTICE BOARD", en: "NOTICE BOARD", zh: "公告板", ja: "掲示板", vi: "BẢNG THÔNG BÁO", th: "กระดานประกาศ" },
  "board.title": { ko: "XPLAY 공지방", en: "XPLAY Announcements", zh: "XPLAY 公告", ja: "XPLAY お知らせ", vi: "Thông báo XPLAY", th: "ประกาศ XPLAY" },
  "board.subtitle": { ko: "프로젝트 최신 소식과 중요 공지를 확인하세요", en: "Check the latest project news and important announcements", zh: "查看最新项目新闻和重要公告", ja: "最新のプロジェクトニュースと重要なお知らせを確認", vi: "Xem tin tức dự án mới nhất", th: "ตรวจสอบข่าวสารล่าสุด" },
  "board.pinned": { ko: "고정 공지", en: "PINNED", zh: "置顶", ja: "固定", vi: "GHIM", th: "ปักหมุด" },
  "board.new": { ko: "NEW", en: "NEW", zh: "新", ja: "NEW", vi: "MỚI", th: "ใหม่" },
  "board.popular": { ko: "인기", en: "HOT", zh: "热门", ja: "人気", vi: "NỔI BẬT", th: "ยอดนิยม" },
  "board.noAnnouncements": { ko: "아직 공지사항이 없습니다", en: "No announcements yet", zh: "暂无公告", ja: "お知らせはまだありません", vi: "Chưa có thông báo", th: "ยังไม่มีประกาศ" },
  "board.close": { ko: "닫기", en: "Close", zh: "关闭", ja: "閉じる", vi: "Đóng", th: "ปิด" },
  "board.readMore": { ko: "자세히 보기", en: "Read More", zh: "查看详情", ja: "詳細を見る", vi: "Xem thêm", th: "อ่านเพิ่มเติม" },
  "board.telegramNote": { ko: "텔레그램 봇으로 공지를 등록할 수 있습니다", en: "Announcements can be posted via Telegram bot", zh: "可通过Telegram机器人发布公告", ja: "Telegramボットで公知を登録できます", vi: "Có thể đăng thông báo qua bot Telegram", th: "สามารถโพสต์ประกาศผ่านบอท Telegram" },
  "board.searchPlaceholder": { ko: "공지사항 검색...", en: "Search announcements...", zh: "搜索公告...", ja: "お知らせを検索...", vi: "Tìm kiếm thông báo...", th: "ค้นหาประกาศ..." },
  "board.comments": { ko: "댓글", en: "Comments", zh: "评论", ja: "コメント", vi: "Bình luận", th: "ความคิดเห็น" },
  "board.writeComment": { ko: "댓글을 입력하세요...", en: "Write a comment...", zh: "写评论...", ja: "コメントを入力...", vi: "Viết bình luận...", th: "เขียนความคิดเห็น..." },
  "board.nickname": { ko: "닉네임", en: "Nickname", zh: "昵称", ja: "ニックネーム", vi: "Biệt danh", th: "ชื่อเล่น" },
  "board.send": { ko: "전송", en: "Send", zh: "发送", ja: "送信", vi: "Gửi", th: "ส่ง" },
  "board.translate": { ko: "번역 보기", en: "Translate", zh: "翻译", ja: "翻訳", vi: "Dịch", th: "แปล" },
  "board.original": { ko: "원문 보기", en: "Original", zh: "原文", ja: "原文", vi: "Bản gốc", th: "ต้นฉบับ" },
  "board.news": { ko: "뉴스 & 속보", en: "News & Updates", zh: "新闻与更新", ja: "ニュース", vi: "Tin tức", th: "ข่าวสาร" },
  "board.all": { ko: "전체", en: "All", zh: "全部", ja: "すべて", vi: "Tất cả", th: "ทั้งหมด" },
  "board.announcements": { ko: "공지", en: "Notices", zh: "公告", ja: "お知らせ", vi: "Thông báo", th: "ประกาศ" },
  "board.newsTab": { ko: "뉴스", en: "News", zh: "新闻", ja: "ニュース", vi: "Tin tức", th: "ข่าว" },
};

// ===== Sample data =====
const SAMPLE_ANNOUNCEMENTS = [
  { id: 1, title: "XPLAY 2.0 업데이트 안내", content: "새로운 AI 에이전트 봇과 Web4 플랫폼이 곧 출시됩니다.", imageUrl: null as string | null, isPinned: true, authorName: "XPLAY Admin", likeCount: 12, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 2, title: "BTC 예측 게임 시즌 3 오픈", content: "BTC 예측 게임 시즌 3가 시작되었습니다! 더 큰 보상과 새로운 게임 모드가 추가되었습니다.", imageUrl: null as string | null, isPinned: false, authorName: "XPLAY Admin", likeCount: 8, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 3, title: "신규 봇 출시: Catalyst Bot Pro", content: "Catalyst Bot의 업그레이드 버전인 Catalyst Bot Pro가 출시되었습니다.", imageUrl: null as string | null, isPinned: false, authorName: "XPLAY Admin", likeCount: 5, createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48) },
];

interface AnnouncementItem {
  id: number; title: string; content: string; imageUrl: string | null;
  isPinned: boolean; authorName: string; likeCount: number;
  createdAt: Date; updatedAt: Date;
}

interface NewsItem {
  id: number; url: string; title: string; description: string | null;
  imageUrl: string | null; siteName: string | null;
  originalContent: string | null; translatedContent: string | null;
  authorName: string; createdAt: Date; updatedAt: Date;
}

function formatTimeAgo(date: Date, lang: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (lang === "ko") { if (diffMins < 1) return "방금 전"; if (diffMins < 60) return `${diffMins}분 전`; if (diffHours < 24) return `${diffHours}시간 전`; if (diffDays < 7) return `${diffDays}일 전`; return new Date(date).toLocaleDateString("ko-KR"); }
  if (lang === "zh") { if (diffMins < 1) return "刚刚"; if (diffMins < 60) return `${diffMins}分钟前`; if (diffHours < 24) return `${diffHours}小时前`; if (diffDays < 7) return `${diffDays}天前`; return new Date(date).toLocaleDateString("zh-CN"); }
  if (lang === "ja") { if (diffMins < 1) return "たった今"; if (diffMins < 60) return `${diffMins}分前`; if (diffHours < 24) return `${diffHours}時間前`; if (diffDays < 7) return `${diffDays}日前`; return new Date(date).toLocaleDateString("ja-JP"); }
  if (diffMins < 1) return "just now"; if (diffMins < 60) return `${diffMins}m ago`; if (diffHours < 24) return `${diffHours}h ago`; if (diffDays < 7) return `${diffDays}d ago`; return new Date(date).toLocaleDateString("en-US");
}

function isNew(date: Date): boolean { return Date.now() - new Date(date).getTime() < 86400000; }

function getVisitorId(): string {
  let id = localStorage.getItem("xplay_visitor_id");
  if (!id) { id = "v_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36); localStorage.setItem("xplay_visitor_id", id); }
  return id;
}

// ===== News Card Component =====
function NewsCard({ item, lang, bt, onClick }: { item: NewsItem; lang: string; bt: (k: string) => string; onClick: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="cursor-pointer" onClick={onClick}>
      <div className="rounded-lg overflow-hidden p-4 transition-all"
        style={{ background: "rgba(10,14,26,0.6)", border: "1px solid rgba(168,85,247,0.12)" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.3)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(168,85,247,0.12)"; }}>
        <div className="flex gap-3">
          {item.imageUrl && (
            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0" style={{ background: "rgba(0,0,0,0.3)" }}>
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}>
                <Newspaper size={9} className="inline mr-1" />NEWS
              </span>
              {item.siteName && <span className="text-[10px]" style={{ color: "rgba(226,232,240,0.4)" }}>{item.siteName}</span>}
              <span className="text-[10px]" style={{ color: "rgba(226,232,240,0.3)" }}>{formatTimeAgo(item.createdAt, lang)}</span>
            </div>
            <h4 className="text-sm font-semibold mb-1 line-clamp-1" style={{ color: "rgba(226,232,240,0.9)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h4>
            {item.description && <p className="text-xs line-clamp-2" style={{ color: "rgba(226,232,240,0.5)" }}>{item.description}</p>}
            <div className="flex items-center gap-2 mt-2">
              <ExternalLink size={11} style={{ color: "#a855f7" }} />
              <span className="text-[10px]" style={{ color: "#a855f7" }}>{bt("board.readMore")}</span>
              <Globe size={11} className="ml-auto" style={{ color: "rgba(226,232,240,0.3)" }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ===== Comment Section =====
function CommentSection({ announcementId, bt }: { announcementId: number; bt: (k: string) => string }) {
  const [nickname, setNickname] = useState(() => localStorage.getItem("xplay_nickname") || "");
  const [content, setContent] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { data: comments = [], refetch } = trpc.announcements.comments.useQuery(
    { announcementId }, { retry: 1, refetchInterval: 15000 }
  );

  const addComment = trpc.announcements.addComment.useMutation({
    onSuccess: () => { setContent(""); refetch(); },
  });

  const handleSubmit = () => {
    if (!nickname.trim() || !content.trim()) return;
    localStorage.setItem("xplay_nickname", nickname.trim());
    addComment.mutate({ announcementId, nickname: nickname.trim(), content: content.trim() });
  };

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle size={14} style={{ color: "#00f5ff" }} />
        <span className="text-xs font-semibold" style={{ color: "rgba(226,232,240,0.7)" }}>
          {bt("board.comments")} ({comments.length})
        </span>
      </div>

      {/* Comment list */}
      <div className="space-y-2 mb-3">
        {visibleComments.map((c: any) => (
          <div key={c.id} className="px-3 py-2 rounded-lg" style={{ background: "rgba(0,245,255,0.03)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold" style={{ color: "#00f5ff" }}>{c.nickname}</span>
              <span className="text-[9px]" style={{ color: "rgba(226,232,240,0.3)" }}>{formatTimeAgo(c.createdAt, "en")}</span>
            </div>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.6)" }}>{c.content}</p>
          </div>
        ))}
      </div>

      {comments.length > 3 && (
        <button onClick={() => setShowAll(!showAll)} className="text-[11px] mb-3 flex items-center gap-1" style={{ color: "#00f5ff" }}>
          {showAll ? <><ChevronUp size={12} /> 접기</> : <><ChevronDown size={12} /> 댓글 {comments.length - 3}개 더 보기</>}
        </button>
      )}

      {/* Comment form */}
      <div className="flex gap-2">
        <input value={nickname} onChange={e => setNickname(e.target.value)} placeholder={bt("board.nickname")}
          className="w-20 shrink-0 px-2 py-1.5 rounded text-[11px] outline-none"
          style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.1)", color: "rgba(226,232,240,0.8)" }} />
        <input value={content} onChange={e => setContent(e.target.value)} placeholder={bt("board.writeComment")}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          className="flex-1 px-2 py-1.5 rounded text-[11px] outline-none"
          style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.1)", color: "rgba(226,232,240,0.8)" }} />
        <button onClick={handleSubmit} disabled={addComment.isPending || !nickname.trim() || !content.trim()}
          className="px-3 py-1.5 rounded text-[11px] font-semibold shrink-0 disabled:opacity-40"
          style={{ background: "rgba(0,245,255,0.15)", color: "#00f5ff" }}>
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

// ===== Main Component =====
export default function AnnouncementBoard() {
  const { lang } = useApp();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "announcements" | "news">("all");
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const visitorId = useMemo(() => getVisitorId(), []);

  const bt = useCallback((key: string) => {
    const entry = I18N[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  }, [lang]);

  // API queries
  const { data: apiAnnouncements } = trpc.announcements.list.useQuery({ limit: 30 }, { retry: 1, refetchInterval: 30000 });
  const { data: searchResults } = trpc.announcements.search.useQuery(
    { query: searchQuery }, { enabled: searchQuery.length >= 2, retry: 1 }
  );
  const { data: apiNews } = trpc.news.list.useQuery({ limit: 20 }, { retry: 1, refetchInterval: 30000 });
  const { data: likedIds = [] } = trpc.announcements.likedIds.useQuery({ visitorId }, { retry: 1 });

  const toggleLikeMutation = trpc.announcements.toggleLike.useMutation();
  const translateMutation = trpc.news.translate.useMutation();

  const announcements: AnnouncementItem[] = apiAnnouncements && apiAnnouncements.length > 0 ? apiAnnouncements : SAMPLE_ANNOUNCEMENTS;
  const newsItems: NewsItem[] = (apiNews as NewsItem[]) || [];

  const displayedAnnouncements = searchQuery.length >= 2 && searchResults ? searchResults : announcements;
  const pinnedItems = displayedAnnouncements.filter(a => a.isPinned);
  const regularItems = displayedAnnouncements.filter(a => !a.isPinned);

  const handleLike = async (announcementId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikeMutation.mutate({ announcementId, visitorId });
  };

  const handleTranslateNews = async (newsId: number) => {
    setIsTranslating(true);
    try {
      const result = await translateMutation.mutateAsync({ id: newsId, targetLang: lang });
      if (result.success && result.translation) setTranslatedText(result.translation);
    } catch (e) { console.error("Translation error:", e); }
    setIsTranslating(false);
  };

  // Like button component
  const LikeButton = ({ item, size = "sm" }: { item: AnnouncementItem; size?: "sm" | "md" }) => {
    const isLiked = likedIds.includes(item.id);
    const iconSize = size === "sm" ? 12 : 16;
    return (
      <button onClick={(e) => handleLike(item.id, e)}
        className="flex items-center gap-1 transition-all"
        style={{ color: isLiked ? "#ef4444" : "rgba(226,232,240,0.4)" }}>
        <Heart size={iconSize} fill={isLiked ? "#ef4444" : "none"} />
        <span className={size === "sm" ? "text-[10px]" : "text-xs"}>{item.likeCount || 0}</span>
      </button>
    );
  };

  return (
    <SectionWrapper id="announcements">
      <SectionTitle badge={bt("board.badge")} title={bt("board.title")} subtitle={bt("board.subtitle")} />

      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="mb-5 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(226,232,240,0.3)" }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder={bt("board.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)", color: "rgba(226,232,240,0.8)" }} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {(["all", "announcements", "news"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab ? "rgba(0,245,255,0.12)" : "rgba(0,245,255,0.03)",
                border: `1px solid ${activeTab === tab ? "rgba(0,245,255,0.25)" : "rgba(0,245,255,0.06)"}`,
                color: activeTab === tab ? "#00f5ff" : "rgba(226,232,240,0.5)",
              }}>
              {tab === "all" ? bt("board.all") : tab === "announcements" ? bt("board.announcements") : bt("board.newsTab")}
              {tab === "news" && newsItems.length > 0 && (
                <span className="ml-1 px-1 rounded text-[9px]" style={{ background: "rgba(168,85,247,0.2)", color: "#a855f7" }}>{newsItems.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Pinned Announcements */}
        {(activeTab === "all" || activeTab === "announcements") && pinnedItems.map(item => (
          <motion.div key={`pinned-${item.id}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-4 cursor-pointer" onClick={() => setSelectedAnnouncement(item)}>
            <div className="rounded-xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(0,245,255,0.04))", border: "1px solid rgba(234,179,8,0.2)" }}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)" }}>
                    <Pin size={18} style={{ color: "#eab308", transform: "rotate(45deg)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded" style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.25)", color: "#eab308" }}>{bt("board.pinned")}</span>
                      {isNew(item.createdAt) && <span className="px-2 py-0.5 text-[10px] font-bold rounded" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>{bt("board.new")}</span>}
                      {item.likeCount >= 5 && <span className="px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-0.5" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)", color: "#f97316" }}><Flame size={9} />{bt("board.popular")}</span>}
                      <span className="text-[10px]" style={{ color: "rgba(226,232,240,0.4)" }}>{item.authorName}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: "#eab308", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(226,232,240,0.7)" }}>{item.content}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1"><Calendar size={12} style={{ color: "rgba(226,232,240,0.4)" }} /><span className="text-[11px]" style={{ color: "rgba(226,232,240,0.4)" }}>{formatTimeAgo(item.createdAt, lang)}</span></div>
                      <LikeButton item={item} />
                      {item.imageUrl && <div className="flex items-center gap-1"><ImageIcon size={12} style={{ color: "rgba(226,232,240,0.4)" }} /></div>}
                      <div className="ml-auto flex items-center gap-1"><span className="text-[11px]" style={{ color: "#00f5ff" }}>{bt("board.readMore")}</span><ChevronRight size={12} style={{ color: "#00f5ff" }} /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* News Section */}
        {(activeTab === "all" || activeTab === "news") && newsItems.length > 0 && (
          <div className="mb-5">
            {activeTab === "all" && (
              <div className="flex items-center gap-2 mb-3">
                <Newspaper size={14} style={{ color: "#a855f7" }} />
                <span className="text-xs font-bold" style={{ color: "#a855f7" }}>{bt("board.news")}</span>
              </div>
            )}
            <div className="space-y-3">
              {newsItems.map(item => (
                <NewsCard key={`news-${item.id}`} item={item} lang={lang} bt={bt} onClick={() => { setSelectedNews(item); setTranslatedText(null); }} />
              ))}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        {(activeTab === "all" || activeTab === "announcements") && (
          <div className="space-y-3">
            {regularItems.map((item, idx) => (
              <motion.div key={`ann-${item.id}`} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }} className="cursor-pointer" onClick={() => setSelectedAnnouncement(item)}>
                <div className="rounded-lg overflow-hidden p-4 sm:p-5 transition-all"
                  style={{ background: "rgba(10,14,26,0.6)", border: "1px solid rgba(0,245,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.2)"; (e.currentTarget as HTMLElement).style.background = "rgba(0,245,255,0.03)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,245,255,0.08)"; (e.currentTarget as HTMLElement).style.background = "rgba(10,14,26,0.6)"; }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.15)" }}>
                      <Megaphone size={16} style={{ color: "#00f5ff" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        {isNew(item.createdAt) && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444" }}>{bt("board.new")}</span>}
                        {item.likeCount >= 5 && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded flex items-center gap-0.5" style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.25)", color: "#f97316" }}><Flame size={9} />{bt("board.popular")}</span>}
                        <span className="text-[10px]" style={{ color: "rgba(226,232,240,0.4)" }}>{item.authorName} · {formatTimeAgo(item.createdAt, lang)}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold mb-1.5" style={{ color: "rgba(226,232,240,0.9)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h4>
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(226,232,240,0.5)" }}>{item.content}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <LikeButton item={item} />
                        {item.imageUrl && <ImageIcon size={11} style={{ color: "rgba(226,232,240,0.3)" }} />}
                        <div className="ml-auto flex items-center gap-1">
                          <Eye size={11} style={{ color: "rgba(226,232,240,0.3)" }} />
                          <span className="text-[10px]" style={{ color: "rgba(226,232,240,0.3)" }}>{bt("board.readMore")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {displayedAnnouncements.length === 0 && newsItems.length === 0 && (
          <div className="text-center py-16">
            <Megaphone size={48} className="mx-auto mb-4" style={{ color: "rgba(226,232,240,0.2)" }} />
            <p style={{ color: "rgba(226,232,240,0.4)" }}>{bt("board.noAnnouncements")}</p>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: "rgba(226,232,240,0.3)" }}>📢 {bt("board.telegramNote")}</p>
        </div>
      </div>

      {/* ===== Announcement Detail Modal ===== */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }} onClick={() => setSelectedAnnouncement(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl"
              style={{ background: "rgba(10,14,26,0.98)", border: "1px solid rgba(0,245,255,0.15)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 sm:p-5"
                style={{ borderBottom: "1px solid rgba(0,245,255,0.08)", background: selectedAnnouncement.isPinned ? "linear-gradient(135deg, rgba(234,179,8,0.06), transparent)" : "transparent" }}>
                <div className="flex items-center gap-2">
                  {selectedAnnouncement.isPinned ? <Pin size={16} style={{ color: "#eab308", transform: "rotate(45deg)" }} /> : <Megaphone size={16} style={{ color: "#00f5ff" }} />}
                  <span className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>{selectedAnnouncement.authorName} · {formatTimeAgo(selectedAnnouncement.createdAt, lang)}</span>
                </div>
                <button onClick={() => setSelectedAnnouncement(null)} className="p-1.5 rounded-lg" style={{ color: "rgba(226,232,240,0.5)", background: "rgba(226,232,240,0.05)" }}><X size={16} /></button>
              </div>
              <div className="p-4 sm:p-5">
                <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: selectedAnnouncement.isPinned ? "#eab308" : "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}>{selectedAnnouncement.title}</h2>
                {selectedAnnouncement.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden"><img src={selectedAnnouncement.imageUrl} alt={selectedAnnouncement.title} className="w-full object-contain max-h-80" style={{ background: "rgba(0,0,0,0.3)" }} /></div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(226,232,240,0.8)" }}>{selectedAnnouncement.content}</div>
                <div className="flex items-center gap-4 mt-4 pt-3" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
                  <LikeButton item={selectedAnnouncement} size="md" />
                </div>
                <CommentSection announcementId={selectedAnnouncement.id} bt={bt} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== News Detail Modal ===== */}
      <AnimatePresence>
        {selectedNews && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }} onClick={() => { setSelectedNews(null); setTranslatedText(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl"
              style={{ background: "rgba(10,14,26,0.98)", border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 sm:p-5" style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}>
                <div className="flex items-center gap-2">
                  <Newspaper size={16} style={{ color: "#a855f7" }} />
                  <span className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>{selectedNews.siteName} · {formatTimeAgo(selectedNews.createdAt, lang)}</span>
                </div>
                <button onClick={() => { setSelectedNews(null); setTranslatedText(null); }} className="p-1.5 rounded-lg" style={{ color: "rgba(226,232,240,0.5)", background: "rgba(226,232,240,0.05)" }}><X size={16} /></button>
              </div>
              <div className="p-4 sm:p-5">
                {selectedNews.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden"><img src={selectedNews.imageUrl} alt="" className="w-full object-contain max-h-60" style={{ background: "rgba(0,0,0,0.3)" }} /></div>
                )}
                <h2 className="text-xl font-bold mb-3" style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}>{selectedNews.title}</h2>

                {/* Translate button */}
                <div className="flex gap-2 mb-4">
                  <button onClick={() => handleTranslateNews(selectedNews.id)} disabled={isTranslating}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                    style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7" }}>
                    <Globe size={12} /> {isTranslating ? "..." : bt("board.translate")}
                  </button>
                  {translatedText && (
                    <button onClick={() => setTranslatedText(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.15)", color: "#00f5ff" }}>
                      {bt("board.original")}
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap mb-4" style={{ color: "rgba(226,232,240,0.8)" }}>
                  {translatedText || selectedNews.description || selectedNews.title}
                </div>

                {/* Link to original */}
                <a href={selectedNews.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7" }}>
                  <ExternalLink size={14} /> {lang === "ko" ? "원문 보기" : "View Original"}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
