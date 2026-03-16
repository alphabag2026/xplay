/*
 * TutorialSection — XPLAY Tutorial & FAQ
 * DB-driven content with admin management
 * FAQ tab shown first, Tutorial tab on click
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import {
  Play,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Rocket,
  Bot,
  Wallet,
  Share2,
  Gamepad2,
  HelpCircle,
  MessageCircleQuestion,
  Info,
  Video,
  Zap,
  Star,
  Shield,
  Target,
  Coins,
  Search,
  X,
} from "lucide-react";

// Icon mapping for DB-stored icon names
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Rocket, Bot, Wallet, Share2, Gamepad2, BookOpen, Video, Zap, Star, Shield, Target, Coins, HelpCircle,
};

function getIcon(iconName: string, iconColor: string) {
  const IconComp = ICON_MAP[iconName] || Rocket;
  return <IconComp size={16} style={{ color: iconColor }} />;
}

type LangMap = Record<string, string>;

// Parse JSON string safely
function parseJson<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try { return JSON.parse(str) as T; } catch { return fallback; }
}

// ===== Hardcoded fallback data (used when DB is empty) =====
const FALLBACK_TUTORIALS = [
  {
    id: -1, youtubeId: "dQw4w9WgXcQ", videoUrl: null,
    iconName: "Rocket", iconColor: "#00f5ff",
    title: JSON.stringify({ ko: "XPLAY 가입부터 첫 투자까지", en: "XPLAY Registration to First Investment", zh: "XPLAY注册到首次投资", ja: "XPLAY登録から初投資まで", vi: "Đăng ký XPLAY đến đầu tư đầu tiên", th: "สมัคร XPLAY ถึงการลงทุนครั้งแรก" }),
    description: JSON.stringify({ ko: "TokenPocket 지갑 설치부터 USDT 입금, 봇 선택까지 완벽 가이드", en: "Complete guide from TokenPocket wallet setup to USDT deposit and bot selection", zh: "从TokenPocket钱包安装到USDT充值和机器人选择的完整指南", ja: "TokenPocketウォレット設定からUSDT入金、ボット選択まで完全ガイド", vi: "Hướng dẫn hoàn chỉnh từ cài đặt ví TokenPocket đến nạp USDT và chọn bot", th: "คู่มือสมบูรณ์ตั้งแต่ตั้งค่ากระเป๋า TokenPocket ถึงฝาก USDT และเลือกบอท" }),
    tooltip: JSON.stringify({ ko: "5분이면 완료! 초보자도 쉽게 따라할 수 있는 단계별 가이드", en: "Done in 5 min! Easy step-by-step guide for beginners", zh: "5分钟完成！初学者也能轻松跟随的指南", ja: "5分で完了！初心者でも簡単なガイド", vi: "Hoàn thành trong 5 phút! Hướng dẫn dễ dàng cho người mới", th: "เสร็จใน 5 นาที! คู่มือง่ายๆ สำหรับมือใหม่" }),
    category: "beginner",
    steps: JSON.stringify([
      { title: { ko: "1. TokenPocket 지갑 설치", en: "1. Install TokenPocket Wallet" }, desc: { ko: "App Store 또는 Google Play에서 TokenPocket을 다운로드하고 지갑을 생성합니다.", en: "Download TokenPocket from App Store or Google Play and create a wallet." } },
      { title: { ko: "2. USDT 입금", en: "2. Deposit USDT" }, desc: { ko: "거래소에서 TokenPocket 지갑으로 USDT(Polygon 네트워크)를 전송합니다.", en: "Transfer USDT (Polygon network) from exchange to your TokenPocket wallet." } },
      { title: { ko: "3. XPLAY 접속 & 봇 선택", en: "3. Access XPLAY & Choose Bot" }, desc: { ko: "TokenPocket dApp 브라우저에서 XPLAY에 접속하고 투자 봇을 선택합니다.", en: "Access XPLAY through TokenPocket dApp browser and select an investment bot." } },
    ]),
    sortOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
];

const FALLBACK_FAQ = [
  {
    id: -1,
    question: JSON.stringify({ ko: "XPLAY는 안전한가요? 자금은 어떻게 보호되나요?", en: "Is XPLAY safe? How are funds protected?", zh: "XPLAY安全吗？资金如何保护？", ja: "XPLAYは安全ですか？資金はどう保護されますか？", vi: "XPLAY có an toàn không? Tiền được bảo vệ thế nào?", th: "XPLAY ปลอดภัยไหม? เงินถูกปกป้องอย่างไร?" }),
    answer: JSON.stringify({ ko: "XPLAY는 Polygon 블록체인 기반 스마트 컨트랙트로 운영되며, 모든 거래가 온체인에 기록됩니다. 자금은 스마트 컨트랙트에 안전하게 보관되고, 출금은 사용자 본인만 가능합니다.", en: "XPLAY operates on Polygon blockchain smart contracts with all transactions recorded on-chain. Funds are securely held in smart contracts, and only users can withdraw their own funds.", zh: "XPLAY基于Polygon区块链智能合约运行，所有交易记录在链上。资金安全保管在智能合约中，只有用户本人可以提现。", ja: "XPLAYはPolygonブロックチェーンのスマートコントラクトで運営され、全取引がオンチェーンに記録されます。", vi: "XPLAY hoạt động trên smart contract Polygon blockchain, mọi giao dịch được ghi trên chain.", th: "XPLAY ทำงานบน smart contract Polygon blockchain ทุกธุรกรรมบันทึกบน chain" }),
    sortOrder: 0, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: -2,
    question: JSON.stringify({ ko: "최소 투자 금액은 얼마인가요?", en: "What is the minimum investment amount?", zh: "最低投资金额是多少？", ja: "最低投資額はいくらですか？", vi: "Số tiền đầu tư tối thiểu là bao nhiêu?", th: "จำนวนเงินลงทุนขั้นต่ำเท่าไหร่?" }),
    answer: JSON.stringify({ ko: "Sprint Bot 기준 최소 $100 USDT부터 시작할 수 있습니다. 봇별로 최소 금액이 다릅니다: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000).", en: "You can start from $100 USDT with Sprint Bot. Minimum varies by bot: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000).", zh: "Sprint Bot最低$100 USDT起。各机器人最低金额不同。", ja: "Sprint Botなら最低$100 USDTから。", vi: "Bắt đầu từ $100 USDT với Sprint Bot.", th: "เริ่มจาก $100 USDT กับ Sprint Bot" }),
    sortOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: -3,
    question: JSON.stringify({ ko: "출금은 얼마나 걸리나요?", en: "How long does withdrawal take?", zh: "提现需要多长时间？", ja: "出金にはどのくらいかかりますか？", vi: "Rút tiền mất bao lâu?", th: "ถอนเงินใช้เวลานานเท่าไหร่?" }),
    answer: JSON.stringify({ ko: "봇 수익율이 자동으로 6.25 USDT에 도달하면 20%를 제외하고 자동으로 지갑으로 입금됩니다.", en: "When bot earnings automatically reach 6.25 USDT, 20% is deducted and the remainder is automatically deposited to your wallet.", zh: "当机器人收益自动达到6.25 USDT时，扣除20%后自动存入您的钱包。", ja: "ボット収益が自動的に6.25 USDTに達すると、20%を差し引いて自動的にウォレットに入金されます。", vi: "Khi lợi nhuận bot tự động đạt 6.25 USDT, 20% được khấu trừ và phần còn lại tự động chuyển vào ví.", th: "เมื่อรายได้บอทถึง 6.25 USDT อัตโนมัติ หัก 20% แล้วฝากเข้ากระเป๋าอัตโนมัติ" }),
    sortOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: -4,
    question: JSON.stringify({ ko: "레퍼럴 보너스는 어떻게 작동하나요?", en: "How does the referral bonus work?", zh: "推荐奖金如何运作？", ja: "リファラルボーナスはどう機能しますか？", vi: "Thưởng giới thiệu hoạt động thế nào?", th: "โบนัสแนะนำทำงานอย่างไร?" }),
    answer: JSON.stringify({ ko: "1세대 직접 추천 시 해당 투자금의 10%를 즉시 보너스로 받습니다. 2~6세대까지는 팀 배분 80%에서 단계별 보너스가 지급됩니다.", en: "You receive 10% instant bonus from 1st generation direct referrals. Generations 2-6 earn stepped bonuses from the 80% team distribution.", zh: "第1代直接推荐获得10%即时奖金。2-6代从80%团队分配中获得阶梯奖金。", ja: "1世代直接紹介で投資額の10%を即時ボーナス。2~6世代は80%チーム配分から段階的ボーナス。", vi: "Nhận 10% thưởng ngay từ giới thiệu trực tiếp thế hệ 1.", th: "รับโบนัสทันที 10% จากแนะนำตรงรุ่นที่ 1" }),
    sortOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: -5,
    question: JSON.stringify({ ko: "BTC 예측 게임에서 잃으면 어떻게 되나요?", en: "What happens if I lose in the BTC prediction game?", zh: "BTC预测游戏输了怎么办？", ja: "BTC予測ゲームで負けたらどうなりますか？", vi: "Nếu thua trong game dự đoán BTC thì sao?", th: "ถ้าแพ้ในเกมทำนาย BTC จะเป็นอย่างไร?" }),
    answer: JSON.stringify({ ko: "예측이 틀리면 해당 라운드의 베팅 금액을 잃게 됩니다. 하지만 수수료 5%를 제외한 풀의 95%가 승자에게 배분되므로 공정한 구조입니다. 소액($5)부터 시작하여 감을 익히는 것을 권장합니다.", en: "If your prediction is wrong, you lose the bet amount for that round. However, 95% of the pool (minus 5% fee) is distributed to winners, making it a fair structure.", zh: "预测错误会失去该回合的投注金额。但扣除5%手续费后95%分配给赢家，结构公平。", ja: "予測が外れるとそのラウンドの賭け金を失います。ただし手数料5%を除くプールの95%が勝者に配分される公正な構造。", vi: "Nếu dự đoán sai, bạn mất tiền đặt cược vòng đó. Nhưng 95% pool (trừ 5% phí) được chia cho người thắng.", th: "ถ้าทำนายผิด จะเสียเงินเดิมพันรอบนั้น แต่ 95% ของ pool (หัก 5% ค่าธรรมเนียม) แจกให้ผู้ชนะ" }),
    sortOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: -6,
    question: JSON.stringify({ ko: "XPLAY를 시작하려면 어떤 지갑이 필요한가요?", en: "What wallet do I need to start with XPLAY?", zh: "开始使用XPLAY需要什么钱包？", ja: "XPLAYを始めるにはどのウォレットが必要ですか？", vi: "Cần ví gì để bắt đầu với XPLAY?", th: "ต้องใช้กระเป๋าอะไรเพื่อเริ่มใช้ XPLAY?" }),
    answer: JSON.stringify({ ko: "TokenPocket 지갑을 권장합니다. dApp 브라우저가 내장되어 있어 XPLAY에 바로 접속할 수 있습니다. Polygon 네트워크를 지원하는 다른 지갑(MetaMask 등)도 사용 가능하지만, TokenPocket이 가장 편리합니다.", en: "We recommend TokenPocket wallet. It has a built-in dApp browser for direct XPLAY access. Other wallets supporting Polygon (like MetaMask) also work, but TokenPocket is the most convenient.", zh: "推荐TokenPocket钱包。内置dApp浏览器可直接访问XPLAY。", ja: "TokenPocketウォレットを推奨。dAppブラウザ内蔵でXPLAYに直接アクセス可能。", vi: "Khuyến nghị ví TokenPocket. Có trình duyệt dApp tích hợp để truy cập XPLAY trực tiếp.", th: "แนะนำกระเป๋า TokenPocket มีเบราว์เซอร์ dApp ในตัวเข้า XPLAY ได้โดยตรง" }),
    sortOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date(),
  },
];

const CATEGORIES = [
  { key: "all", label: { ko: "전체", en: "All", zh: "全部", ja: "すべて", vi: "Tất cả", th: "ทั้งหมด" } },
  { key: "beginner", label: { ko: "초급", en: "Beginner", zh: "初级", ja: "初級", vi: "Cơ bản", th: "เริ่มต้น" } },
  { key: "intermediate", label: { ko: "중급", en: "Intermediate", zh: "中级", ja: "中級", vi: "Trung cấp", th: "ระดับกลาง" } },
  { key: "advanced", label: { ko: "고급", en: "Advanced", zh: "高级", ja: "上級", vi: "Nâng cao", th: "ขั้นสูง" } },
];

// Tab order: Tutorials first, then FAQ
const TAB_ITEMS = [
  { key: "tutorials", icon: <BookOpen size={14} />, label: { ko: "튜토리얼", en: "Tutorials", zh: "教程", ja: "チュートリアル", vi: "Hướng dẫn", th: "บทเรียน" } },
  { key: "faq", icon: <MessageCircleQuestion size={14} />, label: { ko: "자주 묻는 질문", en: "FAQ", zh: "常见问题", ja: "よくある質問", vi: "Câu hỏi thường gặp", th: "คำถามที่พบบ่อย" } },
];

export default function TutorialSection() {
  const { t, lang } = useApp();
  // Default to Tutorials tab
  const [activeTab, setActiveTab] = useState("tutorials");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");

  // Fetch from DB
  const { data: dbTutorials } = trpc.tutorials.list.useQuery();
  const { data: dbFaq } = trpc.faq.list.useQuery();

  // Use DB data if available, otherwise fallback to hardcoded
  const tutorials = useMemo(() => {
    if (dbTutorials && dbTutorials.length > 0) return dbTutorials;
    return FALLBACK_TUTORIALS;
  }, [dbTutorials]);

  const faqItems = useMemo(() => {
    if (dbFaq && dbFaq.length > 0) return dbFaq;
    return FALLBACK_FAQ;
  }, [dbFaq]);

  // FAQ search filtering
  const filteredFaqItems = useMemo(() => {
    if (!faqSearchQuery.trim()) return faqItems;
    const query = faqSearchQuery.trim().toLowerCase();
    return faqItems.filter((faq) => {
      const qMap = parseJson<Record<string, string>>(faq.question, {});
      const aMap = parseJson<Record<string, string>>(faq.answer, {});
      // Search in all languages
      const allQTexts = Object.values(qMap).join(" ").toLowerCase();
      const allATexts = Object.values(aMap).join(" ").toLowerCase();
      return allQTexts.includes(query) || allATexts.includes(query);
    });
  }, [faqItems, faqSearchQuery]);

  const filteredTutorials = useMemo(() => {
    if (selectedCategory === "all") return tutorials;
    return tutorials.filter((t) => t.category === selectedCategory);
  }, [tutorials, selectedCategory]);

  const getLocalizedText = (textMap: Record<string, string>) => {
    return textMap[lang] || textMap["en"] || "";
  };

  const getLocalizedFromJson = (jsonStr: string | null | undefined) => {
    const map = parseJson<Record<string, string>>(jsonStr, {});
    return map[lang] || map["en"] || "";
  };

  return (
    <SectionWrapper id="tutorial">
      <SectionTitle
        badge={t("tutorial.badge")}
        title={t("tutorial.title")}
        subtitle={t("tutorial.subtitle")}
      />

      {/* Tab Switcher: FAQ first, then Tutorials */}
      <div className="flex gap-2 mb-6">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-medium transition-all"
            style={{
              background: activeTab === tab.key
                ? "linear-gradient(135deg, #00f5ff, #a855f7)"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeTab === tab.key ? "transparent" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "20px",
              color: activeTab === tab.key ? "#0a0e1a" : "rgba(226,232,240,0.6)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {tab.icon}
            {getLocalizedText(tab.label)}
          </button>
        ))}
      </div>

      {/* ===== FAQ TAB (now first) ===== */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          {/* FAQ Search Bar */}
          <div className="relative mb-2">
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{
                background: "rgba(10,14,26,0.8)",
                border: "1px solid rgba(0,245,255,0.15)",
                borderRadius: "12px",
              }}
            >
              <Search size={16} style={{ color: "rgba(0,245,255,0.5)", flexShrink: 0 }} />
              <input
                type="text"
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                placeholder={lang === "ko" ? "FAQ 검색..." : lang === "zh" ? "搜索FAQ..." : lang === "ja" ? "FAQ検索..." : lang === "vi" ? "Tìm kiếm FAQ..." : lang === "th" ? "ค้นหา FAQ..." : "Search FAQ..."}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{
                  color: "#e2e8f0",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {faqSearchQuery && (
                <button
                  onClick={() => setFaqSearchQuery("")}
                  className="shrink-0 p-1 rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <X size={12} style={{ color: "rgba(226,232,240,0.5)" }} />
                </button>
              )}
            </div>
            {faqSearchQuery && (
              <div className="mt-2 text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
                {filteredFaqItems.length > 0
                  ? `${filteredFaqItems.length} ${lang === "ko" ? "개 결과" : lang === "zh" ? "个结果" : lang === "ja" ? "件の結果" : "results"}`
                  : lang === "ko" ? "검색 결과가 없습니다" : lang === "zh" ? "没有搜索结果" : lang === "ja" ? "検索結果がありません" : "No results found"}
              </div>
            )}
          </div>

          {filteredFaqItems.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div
                style={{
                  background: "rgba(10,14,26,0.8)",
                  border: `1px solid ${expandedFaqId === faq.id ? "rgba(0,245,255,0.25)" : "rgba(0,245,255,0.1)"}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.3s",
                }}
              >
                <button
                  onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: expandedFaqId === faq.id ? "rgba(0,245,255,0.15)" : "rgba(0,245,255,0.06)",
                      border: `1px solid ${expandedFaqId === faq.id ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.1)"}`,
                      transition: "all 0.3s",
                    }}
                  >
                    <HelpCircle size={14} style={{ color: expandedFaqId === faq.id ? "#00f5ff" : "rgba(0,245,255,0.5)" }} />
                  </div>
                  <span
                    className="flex-1 text-sm font-medium"
                    style={{
                      color: expandedFaqId === faq.id ? "#e2e8f0" : "rgba(226,232,240,0.7)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {getLocalizedFromJson(faq.question)}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaqId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} style={{ color: "rgba(226,232,240,0.4)" }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedFaqId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 pb-4"
                        style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}
                      >
                        <p
                          className="text-sm leading-relaxed pt-3"
                          style={{ color: "rgba(226,232,240,0.6)" }}
                        >
                          {getLocalizedFromJson(faq.answer)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {/* No results message */}
          {faqSearchQuery && filteredFaqItems.length === 0 && (
            <div
              className="flex flex-col items-center justify-center py-12"
              style={{ color: "rgba(226,232,240,0.4)" }}
            >
              <Search size={40} style={{ color: "rgba(0,245,255,0.2)", marginBottom: "12px" }} />
              <p className="text-sm font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
                {lang === "ko" ? "일치하는 FAQ가 없습니다" : lang === "zh" ? "没有匹配的FAQ" : lang === "ja" ? "一致するFAQがありません" : "No matching FAQ found"}
              </p>
              <p className="text-xs mt-1">
                {lang === "ko" ? "다른 키워드로 검색해보세요" : lang === "zh" ? "请尝试其他关键词" : lang === "ja" ? "別のキーワードで検索してください" : "Try different keywords"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ===== TUTORIALS TAB ===== */}
      {activeTab === "tutorials" && (
        <>
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className="px-4 py-2 text-xs font-medium whitespace-nowrap transition-all"
                style={{
                  background: selectedCategory === cat.key
                    ? "rgba(0,245,255,0.15)"
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedCategory === cat.key ? "rgba(0,245,255,0.3)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: "20px",
                  color: selectedCategory === cat.key ? "#00f5ff" : "rgba(226,232,240,0.6)",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {getLocalizedText(cat.label)}
              </button>
            ))}
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTutorials.map((tutorial) => {
                const tutId = `tut-${tutorial.id}`;
                const titleMap = parseJson<LangMap>(tutorial.title, {});
                const descMap = parseJson<LangMap>(tutorial.description, {});
                const tooltipMap = parseJson<LangMap>(tutorial.tooltip, {});
                const stepsArr = parseJson<Array<{ title: LangMap; desc: LangMap }>>(tutorial.steps, []);
                const hasVideo = !!tutorial.videoUrl;
                const hasYoutube = !!tutorial.youtubeId && tutorial.youtubeId !== "none";

                return (
                  <motion.div
                    key={tutId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                    onMouseEnter={() => setHoveredId(tutId)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Tooltip on hover */}
                    <AnimatePresence>
                      {hoveredId === tutId && tooltipMap && Object.keys(tooltipMap).length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute -top-12 left-1/2 z-50 px-4 py-2 text-xs whitespace-nowrap pointer-events-none"
                          style={{
                            transform: "translateX(-50%)",
                            background: "rgba(0,245,255,0.15)",
                            border: "1px solid rgba(0,245,255,0.3)",
                            borderRadius: "8px",
                            color: "#00f5ff",
                            backdropFilter: "blur(10px)",
                            fontFamily: "'Space Grotesk', sans-serif",
                            maxWidth: "90vw",
                            whiteSpace: "normal",
                            textAlign: "center",
                          }}
                        >
                          <Info size={10} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                          {getLocalizedText(tooltipMap)}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      style={{
                        background: "rgba(10,14,26,0.8)",
                        border: `1px solid ${hoveredId === tutId ? "rgba(0,245,255,0.25)" : "rgba(0,245,255,0.1)"}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                        transition: "border-color 0.3s",
                      }}
                    >
                      {/* Video Player / Thumbnail */}
                      {hasVideo ? (
                        // Direct video (R2 or external URL)
                        playingId === tutId ? (
                          <div className="relative" style={{ paddingBottom: "56.25%" }}>
                            <video
                              className="absolute inset-0 w-full h-full"
                              src={tutorial.videoUrl!}
                              controls
                              autoPlay
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlayingId(tutId)}
                            className="w-full relative"
                            style={{ paddingBottom: "56.25%" }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(168,85,247,0.08))" }}
                            >
                              <div
                                className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(0,245,255,0.9)", boxShadow: "0 0 30px rgba(0,245,255,0.4)" }}
                              >
                                <Play size={24} style={{ color: "#0a0e1a", marginLeft: "2px" }} fill="#0a0e1a" />
                              </div>
                            </div>
                          </button>
                        )
                      ) : hasYoutube ? (
                        // YouTube video
                        playingId === tutId ? (
                          <div className="relative" style={{ paddingBottom: "56.25%" }}>
                            <iframe
                              className="absolute inset-0 w-full h-full"
                              src={`https://www.youtube.com/embed/${tutorial.youtubeId}?autoplay=1&rel=0`}
                              title={getLocalizedText(titleMap)}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlayingId(tutId)}
                            className="w-full relative"
                            style={{ paddingBottom: "56.25%" }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.08), rgba(168,85,247,0.08))" }}
                            >
                              <img
                                src={`https://img.youtube.com/vi/${tutorial.youtubeId}/hqdefault.jpg`}
                                alt={getLocalizedText(titleMap)}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ opacity: 0.6 }}
                              />
                              <div
                                className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(0,245,255,0.9)", boxShadow: "0 0 30px rgba(0,245,255,0.4)" }}
                              >
                                <Play size={24} style={{ color: "#0a0e1a", marginLeft: "2px" }} fill="#0a0e1a" />
                              </div>
                            </div>
                          </button>
                        )
                      ) : null}

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
                            {getIcon(tutorial.iconName, tutorial.iconColor)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-sm font-bold mb-1 line-clamp-2"
                              style={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                              {getLocalizedText(titleMap)}
                            </h4>
                            <p className="text-xs line-clamp-2" style={{ color: "rgba(226,232,240,0.5)" }}>
                              {getLocalizedText(descMap)}
                            </p>
                          </div>
                        </div>

                        {/* Category + YouTube Link + Expand */}
                        <div className="flex items-center justify-between mt-3">
                          <span
                            className="text-[10px] px-2 py-1 rounded-full"
                            style={{
                              background: tutorial.category === "beginner"
                                ? "rgba(34,197,94,0.1)"
                                : tutorial.category === "intermediate"
                                ? "rgba(0,245,255,0.1)"
                                : "rgba(168,85,247,0.1)",
                              color: tutorial.category === "beginner"
                                ? "#22c55e"
                                : tutorial.category === "intermediate"
                                ? "#00f5ff"
                                : "#a855f7",
                              border: `1px solid ${
                                tutorial.category === "beginner"
                                  ? "rgba(34,197,94,0.2)"
                                  : tutorial.category === "intermediate"
                                  ? "rgba(0,245,255,0.2)"
                                  : "rgba(168,85,247,0.2)"
                              }`,
                            }}
                          >
                            {getLocalizedText(CATEGORIES.find((c) => c.key === tutorial.category)?.label || CATEGORIES[0].label)}
                          </span>

                          <div className="flex items-center gap-3">
                            {hasYoutube && (
                              <button
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${tutorial.youtubeId}`, "_blank")}
                                className="flex items-center gap-1 text-[10px]"
                                style={{ color: "rgba(226,232,240,0.4)" }}
                              >
                                <ExternalLink size={10} />
                                YouTube
                              </button>
                            )}

                            {stepsArr.length > 0 && (
                              <button
                                onClick={() => setExpandedId(expandedId === tutId ? null : tutId)}
                                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-all"
                                style={{
                                  background: expandedId === tutId ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.04)",
                                  color: expandedId === tutId ? "#00f5ff" : "rgba(226,232,240,0.5)",
                                  border: `1px solid ${expandedId === tutId ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                                }}
                              >
                                <BookOpen size={10} />
                                {expandedId === tutId ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Step-by-Step Guide (Expandable) */}
                        <AnimatePresence>
                          {expandedId === tutId && stepsArr.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div
                                className="mt-3 pt-3 space-y-3"
                                style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}
                              >
                                {stepsArr.map((step, idx) => (
                                  <div key={idx} className="flex gap-3">
                                    <div
                                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                                      style={{
                                        background: "rgba(0,245,255,0.1)",
                                        border: "1px solid rgba(0,245,255,0.2)",
                                        color: "#00f5ff",
                                      }}
                                    >
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5
                                        className="text-xs font-bold mb-0.5"
                                        style={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}
                                      >
                                        {getLocalizedText(step.title)}
                                      </h5>
                                      <p className="text-[11px] leading-relaxed" style={{ color: "rgba(226,232,240,0.5)" }}>
                                        {getLocalizedText(step.desc)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
        </>
      )}
    </SectionWrapper>
  );
}
