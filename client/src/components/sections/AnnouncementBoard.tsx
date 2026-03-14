/*
 * AnnouncementBoard — Project Notice Board
 * Displays announcements created via Telegram bot
 * Fetches from /api/trpc/announcements.list
 * Falls back to sample data when API is unavailable
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Pin,
  Calendar,
  ChevronRight,
  X,
  ImageIcon,
  Eye,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

// i18n keys for the announcement board
const BOARD_I18N: Record<string, Record<string, string>> = {
  "board.badge": {
    ko: "NOTICE BOARD",
    en: "NOTICE BOARD",
    zh: "公告板",
    ja: "掲示板",
    vi: "BẢNG THÔNG BÁO",
    th: "กระดานประกาศ",
  },
  "board.title": {
    ko: "XPLAY 공지방",
    en: "XPLAY Announcements",
    zh: "XPLAY 公告",
    ja: "XPLAY お知らせ",
    vi: "Thông báo XPLAY",
    th: "ประกาศ XPLAY",
  },
  "board.subtitle": {
    ko: "프로젝트 최신 소식과 중요 공지를 확인하세요",
    en: "Check the latest project news and important announcements",
    zh: "查看最新项目新闻和重要公告",
    ja: "最新のプロジェクトニュースと重要なお知らせを確認",
    vi: "Xem tin tức dự án mới nhất và thông báo quan trọng",
    th: "ตรวจสอบข่าวสารโครงการล่าสุดและประกาศสำคัญ",
  },
  "board.pinned": {
    ko: "고정 공지",
    en: "PINNED",
    zh: "置顶",
    ja: "固定",
    vi: "GHIM",
    th: "ปักหมุด",
  },
  "board.new": {
    ko: "NEW",
    en: "NEW",
    zh: "新",
    ja: "NEW",
    vi: "MỚI",
    th: "ใหม่",
  },
  "board.noAnnouncements": {
    ko: "아직 공지사항이 없습니다",
    en: "No announcements yet",
    zh: "暂无公告",
    ja: "お知らせはまだありません",
    vi: "Chưa có thông báo",
    th: "ยังไม่มีประกาศ",
  },
  "board.close": {
    ko: "닫기",
    en: "Close",
    zh: "关闭",
    ja: "閉じる",
    vi: "Đóng",
    th: "ปิด",
  },
  "board.readMore": {
    ko: "자세히 보기",
    en: "Read More",
    zh: "查看详情",
    ja: "詳細を見る",
    vi: "Xem thêm",
    th: "อ่านเพิ่มเติม",
  },
  "board.telegramNote": {
    ko: "텔레그램 봇으로 공지를 등록할 수 있습니다",
    en: "Announcements can be posted via Telegram bot",
    zh: "可通过Telegram机器人发布公告",
    ja: "Telegramボットで公知を登録できます",
    vi: "Có thể đăng thông báo qua bot Telegram",
    th: "สามารถโพสต์ประกาศผ่านบอท Telegram",
  },
};

// Sample announcements for when API is not available
const SAMPLE_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "XPLAY 2.0 업데이트 안내",
    content:
      "새로운 AI 에이전트 봇과 Web4 플랫폼이 곧 출시됩니다. 더 강력해진 수익 엔진과 함께 새로운 기능들을 만나보세요. 자세한 내용은 공식 텔레그램 채널을 확인해주세요!",
    imageUrl: null as string | null,
    isPinned: true,
    authorName: "XPLAY Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 2,
    title: "BTC 예측 게임 시즌 3 오픈",
    content:
      "BTC 예측 게임 시즌 3가 시작되었습니다! 이번 시즌에는 더 큰 보상과 새로운 게임 모드가 추가되었습니다. 지금 바로 참여하세요.",
    imageUrl: null as string | null,
    isPinned: false,
    authorName: "XPLAY Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 3,
    title: "신규 봇 출시: Catalyst Bot Pro",
    content:
      "Catalyst Bot의 업그레이드 버전인 Catalyst Bot Pro가 출시되었습니다. 기존 대비 20% 향상된 수익률과 더 안정적인 운영을 제공합니다. 최소 투자금 $500부터 시작 가능합니다.",
    imageUrl: null as string | null,
    isPinned: false,
    authorName: "XPLAY Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
  },
  {
    id: 4,
    title: "출금 정책 업데이트",
    content:
      "출금 처리 시간이 기존 24시간에서 2시간으로 단축되었습니다. 더 빠르고 편리한 출금 서비스를 이용해주세요. 최소 출금 금액은 $50 USDT입니다.",
    imageUrl: null as string | null,
    isPinned: false,
    authorName: "XPLAY Admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
  },
];

interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  isPinned: boolean;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

function formatTimeAgo(date: Date, lang: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === "ko") {
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return new Date(date).toLocaleDateString("ko-KR");
  }
  if (lang === "zh") {
    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return new Date(date).toLocaleDateString("zh-CN");
  }
  if (lang === "ja") {
    if (diffMins < 1) return "たった今";
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return new Date(date).toLocaleDateString("ja-JP");
  }
  // Default English
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString("en-US");
}

function isNew(date: Date): boolean {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  return diffMs < 1000 * 60 * 60 * 24; // 24 hours
}

export default function AnnouncementBoard() {
  const { lang } = useApp();
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<AnnouncementItem | null>(null);

  const bt = useCallback(
    (key: string) => {
      const entry = BOARD_I18N[key];
      if (!entry) return key;
      return entry[lang] || entry["en"] || key;
    },
    [lang]
  );

  // Try to fetch from API, fall back to sample data
  const { data: apiAnnouncements } = trpc.announcements.list.useQuery(
    { limit: 20 },
    {
      retry: 1,
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  const announcements: AnnouncementItem[] =
    apiAnnouncements && apiAnnouncements.length > 0
      ? apiAnnouncements
      : SAMPLE_ANNOUNCEMENTS;

  // Separate pinned from regular
  const pinnedItems = announcements.filter((a) => a.isPinned);
  const regularItems = announcements.filter((a) => !a.isPinned);

  return (
    <SectionWrapper id="announcements">
      <SectionTitle
        badge={bt("board.badge")}
        title={bt("board.title")}
        subtitle={bt("board.subtitle")}
      />

      <div className="max-w-4xl mx-auto">
        {/* Pinned Announcements */}
        {pinnedItems.map((item) => (
          <motion.div
            key={`pinned-${item.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 cursor-pointer"
            onClick={() => setSelectedAnnouncement(item)}
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(0,245,255,0.04))",
                border: "1px solid rgba(234,179,8,0.2)",
              }}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(234,179,8,0.15)",
                      border: "1px solid rgba(234,179,8,0.3)",
                    }}
                  >
                    <Pin
                      size={18}
                      style={{ color: "#eab308", transform: "rotate(45deg)" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 text-[10px] font-bold rounded"
                        style={{
                          background: "rgba(234,179,8,0.15)",
                          border: "1px solid rgba(234,179,8,0.25)",
                          color: "#eab308",
                        }}
                      >
                        {bt("board.pinned")}
                      </span>
                      {isNew(item.createdAt) && (
                        <span
                          className="px-2 py-0.5 text-[10px] font-bold rounded"
                          style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            color: "#ef4444",
                          }}
                        >
                          {bt("board.new")}
                        </span>
                      )}
                      <span
                        className="text-[10px]"
                        style={{ color: "rgba(226,232,240,0.4)" }}
                      >
                        {item.authorName}
                      </span>
                    </div>
                    <h3
                      className="text-base sm:text-lg font-bold mb-2"
                      style={{
                        color: "#eab308",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: "rgba(226,232,240,0.7)" }}
                    >
                      {item.content}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1">
                        <Calendar
                          size={12}
                          style={{ color: "rgba(226,232,240,0.4)" }}
                        />
                        <span
                          className="text-[11px]"
                          style={{ color: "rgba(226,232,240,0.4)" }}
                        >
                          {formatTimeAgo(item.createdAt, lang)}
                        </span>
                      </div>
                      {item.imageUrl && (
                        <div className="flex items-center gap-1">
                          <ImageIcon
                            size={12}
                            style={{ color: "rgba(226,232,240,0.4)" }}
                          />
                          <span
                            className="text-[11px]"
                            style={{ color: "rgba(226,232,240,0.4)" }}
                          >
                            {lang === "ko" ? "이미지 포함" : "Image"}
                          </span>
                        </div>
                      )}
                      <div className="ml-auto flex items-center gap-1">
                        <span
                          className="text-[11px]"
                          style={{ color: "#00f5ff" }}
                        >
                          {bt("board.readMore")}
                        </span>
                        <ChevronRight size={12} style={{ color: "#00f5ff" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Regular Announcements */}
        <div className="space-y-3">
          {regularItems.map((item, idx) => (
            <motion.div
              key={`ann-${item.id}`}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="cursor-pointer"
              onClick={() => setSelectedAnnouncement(item)}
            >
              <div
                className="rounded-lg overflow-hidden p-4 sm:p-5 transition-all"
                style={{
                  background: "rgba(10,14,26,0.6)",
                  border: "1px solid rgba(0,245,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(0,245,255,0.2)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(0,245,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(0,245,255,0.08)";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(10,14,26,0.6)";
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "rgba(0,245,255,0.08)",
                      border: "1px solid rgba(0,245,255,0.15)",
                    }}
                  >
                    <Megaphone size={16} style={{ color: "#00f5ff" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {isNew(item.createdAt) && (
                        <span
                          className="px-1.5 py-0.5 text-[9px] font-bold rounded"
                          style={{
                            background: "rgba(239,68,68,0.15)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            color: "#ef4444",
                          }}
                        >
                          {bt("board.new")}
                        </span>
                      )}
                      <span
                        className="text-[10px]"
                        style={{ color: "rgba(226,232,240,0.4)" }}
                      >
                        {item.authorName} · {formatTimeAgo(item.createdAt, lang)}
                      </span>
                    </div>
                    <h4
                      className="text-sm sm:text-base font-semibold mb-1.5"
                      style={{
                        color: "rgba(226,232,240,0.9)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      className="text-xs leading-relaxed line-clamp-2"
                      style={{ color: "rgba(226,232,240,0.5)" }}
                    >
                      {item.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.imageUrl && (
                        <div className="flex items-center gap-1">
                          <ImageIcon
                            size={11}
                            style={{ color: "rgba(226,232,240,0.3)" }}
                          />
                        </div>
                      )}
                      <div className="ml-auto flex items-center gap-1">
                        <Eye
                          size={11}
                          style={{ color: "rgba(226,232,240,0.3)" }}
                        />
                        <span
                          className="text-[10px]"
                          style={{ color: "rgba(226,232,240,0.3)" }}
                        >
                          {bt("board.readMore")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-16">
            <Megaphone
              size={48}
              className="mx-auto mb-4"
              style={{ color: "rgba(226,232,240,0.2)" }}
            />
            <p style={{ color: "rgba(226,232,240,0.4)" }}>
              {bt("board.noAnnouncements")}
            </p>
          </div>
        )}

        {/* Telegram bot note */}
        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: "rgba(226,232,240,0.3)" }}>
            📢 {bt("board.telegramNote")}
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)" }}
            onClick={() => setSelectedAnnouncement(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl"
              style={{
                background: "rgba(10,14,26,0.98)",
                border: "1px solid rgba(0,245,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className="flex items-center justify-between p-4 sm:p-5"
                style={{
                  borderBottom: "1px solid rgba(0,245,255,0.08)",
                  background: selectedAnnouncement.isPinned
                    ? "linear-gradient(135deg, rgba(234,179,8,0.06), transparent)"
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-2">
                  {selectedAnnouncement.isPinned ? (
                    <Pin
                      size={16}
                      style={{ color: "#eab308", transform: "rotate(45deg)" }}
                    />
                  ) : (
                    <Megaphone size={16} style={{ color: "#00f5ff" }} />
                  )}
                  <span
                    className="text-xs"
                    style={{ color: "rgba(226,232,240,0.5)" }}
                  >
                    {selectedAnnouncement.authorName} ·{" "}
                    {formatTimeAgo(selectedAnnouncement.createdAt, lang)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="p-1.5 rounded-lg"
                  style={{
                    color: "rgba(226,232,240,0.5)",
                    background: "rgba(226,232,240,0.05)",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 sm:p-5">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                  style={{
                    color: selectedAnnouncement.isPinned
                      ? "#eab308"
                      : "#00f5ff",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {selectedAnnouncement.title}
                </h2>

                {/* Image */}
                {selectedAnnouncement.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={selectedAnnouncement.imageUrl}
                      alt={selectedAnnouncement.title}
                      className="w-full object-contain max-h-80"
                      style={{
                        background: "rgba(0,0,0,0.3)",
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: "rgba(226,232,240,0.8)" }}
                >
                  {selectedAnnouncement.content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
