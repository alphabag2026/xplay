/*
 * LiveChatSection — Global Live Chat
 * AI bot + simulated global users chatting about XPLAY
 * Creates a vibrant, active community feel
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, Users, Globe2 } from "lucide-react";

// Virtual users from around the world
const VIRTUAL_USERS = [
  { name: "Alex K.", flag: "🇺🇸", color: "#00f5ff" },
  { name: "김민수", flag: "🇰🇷", color: "#22c55e" },
  { name: "田中太郎", flag: "🇯🇵", color: "#f59e0b" },
  { name: "王小明", flag: "🇨🇳", color: "#ef4444" },
  { name: "Nguyễn Văn", flag: "🇻🇳", color: "#8b5cf6" },
  { name: "สมชาย", flag: "🇹🇭", color: "#ec4899" },
  { name: "Hans M.", flag: "🇩🇪", color: "#06b6d4" },
  { name: "Pierre L.", flag: "🇫🇷", color: "#f97316" },
  { name: "Marco R.", flag: "🇮🇹", color: "#14b8a6" },
  { name: "Carlos S.", flag: "🇪🇸", color: "#a855f7" },
  { name: "João P.", flag: "🇧🇷", color: "#eab308" },
  { name: "Raj P.", flag: "🇮🇳", color: "#10b981" },
  { name: "Ahmed H.", flag: "🇸🇦", color: "#f43f5e" },
  { name: "Olga V.", flag: "🇷🇺", color: "#6366f1" },
  { name: "Sarah W.", flag: "🇬🇧", color: "#0ea5e9" },
  { name: "Mike T.", flag: "🇨🇦", color: "#84cc16" },
  { name: "Yuki S.", flag: "🇯🇵", color: "#d946ef" },
  { name: "이지은", flag: "🇰🇷", color: "#f472b6" },
  { name: "张伟", flag: "🇨🇳", color: "#fb923c" },
  { name: "Budi S.", flag: "🇮🇩", color: "#2dd4bf" },
  { name: "Fatima A.", flag: "🇦🇪", color: "#c084fc" },
  { name: "Chen Wei", flag: "🇹🇼", color: "#fbbf24" },
  { name: "박준호", flag: "🇰🇷", color: "#34d399" },
  { name: "David L.", flag: "🇦🇺", color: "#60a5fa" },
  { name: "Sophia M.", flag: "🇳🇱", color: "#fb7185" },
];

// Predefined chat messages (multilingual, about XPLAY)
const CHAT_MESSAGES: Record<string, string[]> = {
  en: [
    "Just staked $5,000 on Quantum Bot! 🚀",
    "The daily returns are incredible, 1.5% today!",
    "Anyone tried the Catalyst Bot? Thinking about switching",
    "XPLAY's revenue model is the most transparent I've seen",
    "Referred 3 friends this week, the 10% bonus is amazing",
    "BTC prediction game is so addictive lol",
    "My Sprint Bot just completed 7 days, reinvesting now!",
    "The AI quant trading engine is legit, checked the on-chain data",
    "Web4 platform sounds revolutionary, can't wait!",
    "100K users already? This is growing fast 🔥",
    "Token mixing engine fees are a genius revenue source",
    "Just withdrew my first month's profit, smooth process",
    "Momentum Bot giving me steady 0.9% daily 💰",
    "The prediction platform during World Cup was insane!",
    "AI Agent platform will be a game changer",
  ],
  ko: [
    "퀀텀봇에 5000달러 스테이킹 완료! 🚀",
    "오늘 일일 수익률 1.5% 대박이네요",
    "카탈리스트봇 써보신 분? 변경 고민중",
    "XPLAY 수익 모델이 제가 본 중 가장 투명해요",
    "이번 주 3명 추천했는데 10% 보너스 최고",
    "BTC 예측 게임 중독성 있네요 ㅋㅋ",
    "스프린트봇 7일 완료, 재투자합니다!",
    "AI 퀀트 트레이딩 엔진 온체인 데이터 확인했는데 진짜네요",
    "Web4 플랫폼 기대됩니다!",
    "벌써 10만 유저? 성장 속도 미쳤다 🔥",
    "모멘텀봇 매일 0.9% 안정적 수익 💰",
    "첫 달 수익 출금 완료, 과정 매끄러워요",
    "월드컵 때 예측 플랫폼 진짜 대박이었음",
    "AI 에이전트 플랫폼 게임체인저 될 듯",
    "토큰 믹싱 엔진 수수료 수익 모델 천재적",
  ],
  zh: [
    "刚在Quantum Bot上质押了5000美元！🚀",
    "今天日收益1.5%，太棒了！",
    "有人试过Catalyst Bot吗？考虑切换",
    "XPLAY的收益模式是我见过最透明的",
    "这周推荐了3个朋友，10%奖金太好了",
    "BTC预测游戏太上瘾了哈哈",
    "Sprint Bot刚完成7天，现在再投资！",
    "AI量化交易引擎是真的，查了链上数据",
    "Web4平台听起来很革命性，等不及了！",
    "已经10万用户了？增长太快了🔥",
    "动量机器人每天稳定0.9%收益💰",
    "第一个月利润提现完成，流程顺畅",
  ],
  ja: [
    "Quantum Botに5000ドルステーキング完了！🚀",
    "今日の日次リターン1.5%、すごい！",
    "Catalyst Bot試した人いますか？切り替え検討中",
    "XPLAYの収益モデルは最も透明",
    "今週3人紹介、10%ボーナス最高",
    "BTC予測ゲーム中毒性あるw",
    "Sprint Bot 7日完了、再投資します！",
    "AI量子取引エンジン本物だった",
    "Web4プラットフォーム楽しみ！",
    "もう10万ユーザー？成長速度すごい🔥",
  ],
};

// AI Bot responses
const AI_RESPONSES: Record<string, string[]> = {
  en: [
    "Welcome to XPLAY! 🎉 Our AI engines are running 24/7 generating real revenue from token mixing, quant trading, and market making.",
    "Great question! The Quantum Bot offers the highest daily return at 1.3%~1.8% for a 360-day lock period. Perfect for long-term investors!",
    "XPLAY currently has over 100,000 active users across 100+ countries. Our prediction platform launched during the World Cup! ⚽",
    "The referral system offers up to 10% direct referral bonus across 6 generations. Share your link to earn passive income!",
    "Our AI Agent platform is currently in development. It will provide automated investment strategies and personalized AI assistants. Stay tuned! 🤖",
    "XP Token follows an extreme deflation model: 21M total supply burning down to 1M. Scarcity drives value! 📈",
    "All three revenue engines (Token Mixing 3.2%, AI Quant 6.5%, Binance Market Making 4.5%) are running and generating real profits.",
  ],
  ko: [
    "XPLAY에 오신 것을 환영합니다! 🎉 AI 엔진이 24시간 토큰 믹싱, 퀀트 트레이딩, 마켓 메이킹으로 실제 수익을 창출하고 있습니다.",
    "좋은 질문입니다! 퀀텀봇은 360일 잠금 기간으로 일 1.3%~1.8%의 최고 수익률을 제공합니다. 장기 투자자에게 완벽합니다!",
    "XPLAY는 현재 100개국 이상에서 10만명 이상의 활성 유저를 보유하고 있습니다. 월드컵 때 예측 플랫폼을 런칭했죠! ⚽",
    "추천 시스템은 6세대에 걸쳐 최대 10% 직추천 보너스를 제공합니다. 링크를 공유하여 패시브 인컴을 얻으세요!",
    "AI 에이전트 플랫폼은 현재 개발 중입니다. 자동화된 투자 전략과 맞춤형 AI 어시스턴트를 제공할 예정입니다! 🤖",
    "XP 토큰은 극단적 디플레이션 모델을 따릅니다: 총 2100만개에서 100만개로 소각. 희소성이 가치를 만듭니다! 📈",
  ],
  zh: [
    "欢迎来到XPLAY！🎉 AI引擎24/7运行，通过代币混合、量化交易和做市产生真实收益。",
    "好问题！Quantum Bot提供最高日收益1.3%~1.8%，锁定期360天。适合长期投资者！",
    "XPLAY目前在100多个国家拥有超过10万活跃用户。我们在世界杯期间推出了预测平台！⚽",
    "推荐系统提供6代最高10%直推奖金。分享链接赚取被动收入！",
  ],
  ja: [
    "XPLAYへようこそ！🎉 AIエンジンが24時間稼働し、トークンミキシング、クオンツ取引、マーケットメイキングで実際の収益を生み出しています。",
    "いい質問ですね！Quantum Botは360日ロック期間で日次1.3%~1.8%の最高リターンを提供します！",
    "XPLAYは現在100カ国以上で10万人以上のアクティブユーザーがいます。ワールドカップ中に予測プラットフォームを立ち上げました！⚽",
  ],
};

interface ChatMessage {
  id: string;
  user: typeof VIRTUAL_USERS[number] | null; // null = AI bot
  text: string;
  timestamp: Date;
  isAI: boolean;
}

export default function LiveChatSection() {
  const { t, lang } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getLangMessages = useCallback(() => {
    const langKey = lang === "vi" || lang === "th" ? "en" : lang;
    return CHAT_MESSAGES[langKey] || CHAT_MESSAGES.en;
  }, [lang]);

  const getLangAIResponses = useCallback(() => {
    const langKey = lang === "vi" || lang === "th" ? "en" : lang;
    return AI_RESPONSES[langKey] || AI_RESPONSES.en;
  }, [lang]);

  const addAutoMessage = useCallback(() => {
    const isAI = Math.random() < 0.25; // 25% chance AI responds
    const msgs = isAI ? getLangAIResponses() : getLangMessages();
    const text = msgs[Math.floor(Math.random() * msgs.length)];
    const user = isAI ? null : VIRTUAL_USERS[Math.floor(Math.random() * VIRTUAL_USERS.length)];

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      user,
      text,
      timestamp: new Date(),
      isAI,
    };

    setMessages((prev) => [...prev, msg].slice(-50));

    // Random interval 8-25 seconds
    const interval = (Math.floor(Math.random() * 18) + 8) * 1000;
    timerRef.current = setTimeout(addAutoMessage, interval);
  }, [getLangMessages, getLangAIResponses]);

  useEffect(() => {
    // Initialize with some messages
    const initial: ChatMessage[] = [];
    const msgs = getLangMessages();
    const aiMsgs = getLangAIResponses();

    for (let i = 0; i < 8; i++) {
      const isAI = i % 4 === 0;
      const pool = isAI ? aiMsgs : msgs;
      const user = isAI ? null : VIRTUAL_USERS[Math.floor(Math.random() * VIRTUAL_USERS.length)];
      initial.push({
        id: `init-${i}`,
        user,
        text: pool[i % pool.length],
        timestamp: new Date(Date.now() - (8 - i) * 15000),
        isAI,
      });
    }
    setMessages(initial);
    setOnlineCount(Math.floor(Math.random() * 300) + 500);

    timerRef.current = setTimeout(addAutoMessage, (Math.floor(Math.random() * 10) + 5) * 1000);

    // Fluctuate online count
    const onlineInterval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 21) - 10);
    }, 30000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(onlineInterval);
    };
  }, [addAutoMessage, getLangMessages, getLangAIResponses]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      user: { name: t("chat.you"), flag: "👤", color: "#00f5ff" },
      text: userInput,
      timestamp: new Date(),
      isAI: false,
    };
    setMessages((prev) => [...prev, userMsg].slice(-50));
    setUserInput("");

    // AI responds after 2-4 seconds
    setTimeout(() => {
      const aiMsgs = getLangAIResponses();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        user: null,
        text: aiMsgs[Math.floor(Math.random() * aiMsgs.length)],
        timestamp: new Date(),
        isAI: true,
      };
      setMessages((prev) => [...prev, aiMsg].slice(-50));
    }, 2000 + Math.random() * 2000);
  };

  return (
    <SectionWrapper id="live-chat">
      <SectionTitle
        badge={t("chat.badge")}
        title={t("chat.title")}
        subtitle={t("chat.subtitle")}
      />

      <div
        style={{
          background: "rgba(10,14,26,0.8)",
          border: "1px solid rgba(0,245,255,0.1)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: "rgba(0,245,255,0.04)",
            borderBottom: "1px solid rgba(0,245,255,0.1)",
          }}
        >
          <div className="flex items-center gap-2">
            <Globe2 size={16} style={{ color: "#00f5ff" }} />
            <span
              className="text-sm font-bold"
              style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("chat.global")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} style={{ color: "rgba(226,232,240,0.5)" }} />
            <span className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
              {onlineCount.toLocaleString()} {t("chat.online")}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
            />
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatRef}
          className="overflow-y-auto px-4 py-3 space-y-3"
          style={{ height: "400px" }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.isAI ? (
                  /* AI Bot Message */
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                      }}
                    >
                      <Bot size={14} style={{ color: "#0a0e1a" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold"
                          style={{
                            background: "linear-gradient(90deg, #00f5ff, #a855f7)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          XPLAY AI
                        </span>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7" }}
                        >
                          BOT
                        </span>
                      </div>
                      <div
                        className="text-sm p-3"
                        style={{
                          color: "rgba(226,232,240,0.85)",
                          background: "rgba(168,85,247,0.06)",
                          border: "1px solid rgba(168,85,247,0.15)",
                          borderRadius: "0 10px 10px 10px",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* User Message */
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-lg"
                      style={{
                        background: `${msg.user?.color || "#00f5ff"}15`,
                        border: `1px solid ${msg.user?.color || "#00f5ff"}30`,
                      }}
                    >
                      {msg.user?.flag || "👤"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-bold"
                          style={{ color: msg.user?.color || "#00f5ff" }}
                        >
                          {msg.user?.name || "User"}
                        </span>
                        <span className="text-[9px]" style={{ color: "rgba(226,232,240,0.3)" }}>
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div
                        className="text-sm p-3"
                        style={{
                          color: "rgba(226,232,240,0.8)",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "0 10px 10px 10px",
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            borderTop: "1px solid rgba(0,245,255,0.1)",
            background: "rgba(0,245,255,0.02)",
          }}
        >
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("chat.placeholder")}
            className="flex-1 text-sm px-4 py-2.5 outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "8px",
              color: "rgba(226,232,240,0.9)",
            }}
          />
          <button
            onClick={handleSend}
            className="p-2.5 transition-all"
            style={{
              background: "linear-gradient(135deg, #00f5ff, #a855f7)",
              borderRadius: "8px",
            }}
          >
            <Send size={16} style={{ color: "#0a0e1a" }} />
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}
