/*
 * TutorialSection — YouTube Tutorial Videos
 * Embeds YouTube tutorial videos for XPLAY
 * Videos can be updated via Telegram bot (future feature)
 * Supports multilingual titles
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ExternalLink, BookOpen } from "lucide-react";

interface TutorialVideo {
  id: string;
  youtubeId: string;
  title: Record<string, string>;
  description: Record<string, string>;
  category: string;
}

// Sample tutorial videos - in production these would come from backend/Telegram bot
const TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: "tut-1",
    youtubeId: "dQw4w9WgXcQ",
    title: {
      ko: "XPLAY 시작 가이드 - 회원가입부터 첫 투자까지",
      en: "XPLAY Getting Started - From Registration to First Investment",
      zh: "XPLAY 入门指南 - 从注册到首次投资",
      ja: "XPLAY スタートガイド - 登録から初投資まで",
      vi: "Hướng dẫn bắt đầu XPLAY",
      th: "คู่มือเริ่มต้น XPLAY",
    },
    description: {
      ko: "TokenPocket 설치, 계정 생성, 레퍼럴 등록, 첫 스테이킹까지 완벽 가이드",
      en: "Complete guide: TokenPocket install, account creation, referral registration, first staking",
      zh: "完整指南：TokenPocket安装、账户创建、推荐注册、首次质押",
      ja: "完全ガイド：TokenPocketインストール、アカウント作成、紹介登録、初回ステーキング",
      vi: "Hướng dẫn đầy đủ: Cài đặt TokenPocket, tạo tài khoản, đăng ký giới thiệu",
      th: "คู่มือฉบับสมบูรณ์: ติดตั้ง TokenPocket สร้างบัญชี",
    },
    category: "beginner",
  },
  {
    id: "tut-2",
    youtubeId: "dQw4w9WgXcQ",
    title: {
      ko: "XPLAY 봇 선택 가이드 - Sprint vs Velocity vs Quantum",
      en: "XPLAY Bot Selection Guide - Sprint vs Velocity vs Quantum",
      zh: "XPLAY 机器人选择指南 - Sprint vs Velocity vs Quantum",
      ja: "XPLAY ボット選択ガイド - Sprint vs Velocity vs Quantum",
      vi: "Hướng dẫn chọn Bot XPLAY",
      th: "คู่มือเลือก Bot XPLAY",
    },
    description: {
      ko: "각 봇의 수익률, 잠금 기간, 리스크를 비교 분석합니다",
      en: "Compare each bot's returns, lock periods, and risks",
      zh: "比较每个机器人的收益率、锁定期和风险",
      ja: "各ボットの収益率、ロック期間、リスクを比較分析",
      vi: "So sánh lợi nhuận, thời gian khóa và rủi ro của mỗi bot",
      th: "เปรียบเทียบผลตอบแทน ระยะเวลาล็อค และความเสี่ยงของแต่ละบอท",
    },
    category: "intermediate",
  },
  {
    id: "tut-3",
    youtubeId: "dQw4w9WgXcQ",
    title: {
      ko: "XPLAY 수익 출금 방법 - USDT 출금 완벽 가이드",
      en: "XPLAY Withdrawal Guide - Complete USDT Withdrawal Tutorial",
      zh: "XPLAY 提现指南 - 完整USDT提现教程",
      ja: "XPLAY 出金ガイド - USDT出金完全チュートリアル",
      vi: "Hướng dẫn rút tiền XPLAY - USDT",
      th: "คู่มือถอนเงิน XPLAY - USDT",
    },
    description: {
      ko: "수익 확인, 출금 신청, 지갑으로 USDT 수령까지 전 과정",
      en: "Full process: Check profits, request withdrawal, receive USDT to wallet",
      zh: "全流程：查看利润、申请提现、接收USDT到钱包",
      ja: "全プロセス：利益確認、出金申請、ウォレットへのUSDT受取",
      vi: "Toàn bộ quy trình: Kiểm tra lợi nhuận, yêu cầu rút tiền",
      th: "กระบวนการทั้งหมด: ตรวจสอบกำไร ขอถอนเงิน",
    },
    category: "intermediate",
  },
  {
    id: "tut-4",
    youtubeId: "dQw4w9WgXcQ",
    title: {
      ko: "XPLAY 레퍼럴 시스템 활용법 - 패시브 인컴 극대화",
      en: "XPLAY Referral System - Maximize Your Passive Income",
      zh: "XPLAY 推荐系统 - 最大化被动收入",
      ja: "XPLAY リファラルシステム - パッシブインカム最大化",
      vi: "Hệ thống giới thiệu XPLAY - Tối đa hóa thu nhập thụ động",
      th: "ระบบแนะนำ XPLAY - เพิ่มรายได้แบบ Passive สูงสุด",
    },
    description: {
      ko: "6세대 추천 보너스 구조, 공유 전략, 팀 빌딩 노하우",
      en: "6-generation referral bonus structure, sharing strategies, team building tips",
      zh: "6代推荐奖金结构、分享策略、团队建设技巧",
      ja: "6世代紹介ボーナス構造、共有戦略、チームビルディングのコツ",
      vi: "Cấu trúc thưởng giới thiệu 6 thế hệ, chiến lược chia sẻ",
      th: "โครงสร้างโบนัสแนะนำ 6 รุ่น กลยุทธ์การแชร์",
    },
    category: "advanced",
  },
];

const CATEGORIES = [
  { key: "all", label: { ko: "전체", en: "All", zh: "全部", ja: "すべて", vi: "Tất cả", th: "ทั้งหมด" } },
  { key: "beginner", label: { ko: "초급", en: "Beginner", zh: "初级", ja: "初級", vi: "Cơ bản", th: "เริ่มต้น" } },
  { key: "intermediate", label: { ko: "중급", en: "Intermediate", zh: "中级", ja: "中級", vi: "Trung cấp", th: "ระดับกลาง" } },
  { key: "advanced", label: { ko: "고급", en: "Advanced", zh: "高级", ja: "上級", vi: "Nâng cao", th: "ขั้นสูง" } },
];

export default function TutorialSection() {
  const { t, lang } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredVideos = selectedCategory === "all"
    ? TUTORIAL_VIDEOS
    : TUTORIAL_VIDEOS.filter((v) => v.category === selectedCategory);

  const getLocalizedText = (textMap: Record<string, string>) => {
    return textMap[lang] || textMap["en"] || "";
  };

  return (
    <SectionWrapper id="tutorial">
      <SectionTitle
        badge={t("tutorial.badge")}
        title={t("tutorial.title")}
        subtitle={t("tutorial.subtitle")}
      />

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-all"
            style={{
              background: selectedCategory === cat.key
                ? "linear-gradient(135deg, #00f5ff, #a855f7)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${selectedCategory === cat.key ? "transparent" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "20px",
              color: selectedCategory === cat.key ? "#0a0e1a" : "rgba(226,232,240,0.6)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {getLocalizedText(cat.label)}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  background: "rgba(10,14,26,0.8)",
                  border: "1px solid rgba(0,245,255,0.1)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {/* Video Player / Thumbnail */}
                <div className="relative" style={{ paddingBottom: playingId === video.id ? "56.25%" : "0" }}>
                  {playingId === video.id ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                      title={getLocalizedText(video.title)}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingId(video.id)}
                      className="w-full relative"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, rgba(0,245,255,0.08), rgba(168,85,247,0.08))`,
                        }}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={getLocalizedText(video.title)}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ opacity: 0.6 }}
                        />
                        <div
                          className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(0,245,255,0.9)",
                            boxShadow: "0 0 30px rgba(0,245,255,0.4)",
                          }}
                        >
                          <Play size={24} style={{ color: "#0a0e1a", marginLeft: "2px" }} fill="#0a0e1a" />
                        </div>
                      </div>
                    </button>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: "rgba(0,245,255,0.1)",
                        border: "1px solid rgba(0,245,255,0.2)",
                      }}
                    >
                      <BookOpen size={14} style={{ color: "#00f5ff" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-bold mb-1 line-clamp-2"
                        style={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {getLocalizedText(video.title)}
                      </h4>
                      <p className="text-xs line-clamp-2" style={{ color: "rgba(226,232,240,0.5)" }}>
                        {getLocalizedText(video.description)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span
                      className="text-[10px] px-2 py-1 rounded-full"
                      style={{
                        background: video.category === "beginner"
                          ? "rgba(34,197,94,0.1)"
                          : video.category === "intermediate"
                          ? "rgba(0,245,255,0.1)"
                          : "rgba(168,85,247,0.1)",
                        color: video.category === "beginner"
                          ? "#22c55e"
                          : video.category === "intermediate"
                          ? "#00f5ff"
                          : "#a855f7",
                        border: `1px solid ${
                          video.category === "beginner"
                            ? "rgba(34,197,94,0.2)"
                            : video.category === "intermediate"
                            ? "rgba(0,245,255,0.2)"
                            : "rgba(168,85,247,0.2)"
                        }`,
                      }}
                    >
                      {getLocalizedText(CATEGORIES.find((c) => c.key === video.category)?.label || CATEGORIES[0].label)}
                    </span>
                    <button
                      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank")}
                      className="flex items-center gap-1 text-[10px]"
                      style={{ color: "rgba(226,232,240,0.4)" }}
                    >
                      <ExternalLink size={10} />
                      YouTube
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Telegram Bot Info */}
      <div
        className="mt-6 p-4 flex items-center gap-3"
        style={{
          background: "rgba(38,165,228,0.06)",
          border: "1px solid rgba(38,165,228,0.15)",
          borderRadius: "10px",
        }}
      >
        <span className="text-2xl shrink-0">🤖</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium" style={{ color: "#26A5E4" }}>
            {t("tutorial.bot.title")}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(226,232,240,0.4)" }}>
            {t("tutorial.bot.desc")}
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
