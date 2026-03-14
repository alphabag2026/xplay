/*
 * LiveChatSection — Global Live Chat
 * AI bot + simulated global users chatting about XPLAY
 * KEY: Each message shows in the user's NATIVE language
 * Below each foreign message, show translation in the viewer's system language
 * Creates a vibrant, active global community feel
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Users, Globe2 } from "lucide-react";

// Virtual users from around the world with their native language
const VIRTUAL_USERS = [
  { name: "Alex K.", flag: "🇺🇸", color: "#00f5ff", lang: "en" },
  { name: "김민수", flag: "🇰🇷", color: "#22c55e", lang: "ko" },
  { name: "田中太郎", flag: "🇯🇵", color: "#f59e0b", lang: "ja" },
  { name: "王小明", flag: "🇨🇳", color: "#ef4444", lang: "zh" },
  { name: "Nguyễn Văn", flag: "🇻🇳", color: "#8b5cf6", lang: "vi" },
  { name: "สมชาย", flag: "🇹🇭", color: "#ec4899", lang: "th" },
  { name: "Hans M.", flag: "🇩🇪", color: "#06b6d4", lang: "de" },
  { name: "Pierre L.", flag: "🇫🇷", color: "#f97316", lang: "fr" },
  { name: "Marco R.", flag: "🇮🇹", color: "#14b8a6", lang: "it" },
  { name: "Carlos S.", flag: "🇪🇸", color: "#a855f7", lang: "es" },
  { name: "João P.", flag: "🇧🇷", color: "#eab308", lang: "pt" },
  { name: "Raj P.", flag: "🇮🇳", color: "#10b981", lang: "hi" },
  { name: "Ahmed H.", flag: "🇸🇦", color: "#f43f5e", lang: "ar" },
  { name: "Olga V.", flag: "🇷🇺", color: "#6366f1", lang: "ru" },
  { name: "Sarah W.", flag: "🇬🇧", color: "#0ea5e9", lang: "en" },
  { name: "Mike T.", flag: "🇨🇦", color: "#84cc16", lang: "en" },
  { name: "Yuki S.", flag: "🇯🇵", color: "#d946ef", lang: "ja" },
  { name: "이지은", flag: "🇰🇷", color: "#f472b6", lang: "ko" },
  { name: "张伟", flag: "🇨🇳", color: "#fb923c", lang: "zh" },
  { name: "Budi S.", flag: "🇮🇩", color: "#2dd4bf", lang: "id" },
  { name: "Fatima A.", flag: "🇦🇪", color: "#c084fc", lang: "ar" },
  { name: "Chen Wei", flag: "🇹🇼", color: "#fbbf24", lang: "zh" },
  { name: "박준호", flag: "🇰🇷", color: "#34d399", lang: "ko" },
  { name: "David L.", flag: "🇦🇺", color: "#60a5fa", lang: "en" },
  { name: "Sophia M.", flag: "🇳🇱", color: "#fb7185", lang: "nl" },
];

// Messages in each language (native) with translation keys
interface NativeMessage {
  native: string;
  translations: Record<string, string>;
}

// Chat messages in their native language + translations for all supported languages
const NATIVE_MESSAGES: Record<string, NativeMessage[]> = {
  en: [
    { native: "Just staked $5,000 on Quantum Bot! 🚀", translations: { ko: "퀀텀봇에 5000달러 스테이킹 완료! 🚀", zh: "刚在Quantum Bot上质押了5000美元！🚀", ja: "Quantum Botに5000ドルステーキング完了！🚀", vi: "Vừa stake 5,000$ trên Quantum Bot! 🚀", th: "เพิ่ง stake $5,000 บน Quantum Bot! 🚀" } },
    { native: "The daily returns are incredible, 1.5% today!", translations: { ko: "오늘 일일 수익률 1.5% 대박이네요!", zh: "今天日收益1.5%，太棒了！", ja: "今日の日次リターン1.5%、すごい！", vi: "Lợi nhuận hàng ngày tuyệt vời, 1.5% hôm nay!", th: "ผลตอบแทนรายวันเหลือเชื่อ 1.5% วันนี้!" } },
    { native: "Anyone tried the Catalyst Bot? Thinking about switching", translations: { ko: "카탈리스트봇 써보신 분? 변경 고민중", zh: "有人试过Catalyst Bot吗？考虑切换", ja: "Catalyst Bot試した人いますか？切り替え検討中", vi: "Ai đã thử Catalyst Bot chưa?", th: "ใครลอง Catalyst Bot แล้วบ้าง?" } },
    { native: "XPLAY's revenue model is the most transparent I've seen", translations: { ko: "XPLAY 수익 모델이 제가 본 중 가장 투명해요", zh: "XPLAY的收益模式是我见过最透明的", ja: "XPLAYの収益モデルは最も透明", vi: "Mô hình doanh thu XPLAY minh bạch nhất tôi từng thấy", th: "โมเดลรายได้ XPLAY โปร่งใสที่สุดที่เคยเห็น" } },
    { native: "Referred 3 friends this week, the 10% bonus is amazing", translations: { ko: "이번 주 3명 추천했는데 10% 보너스 최고", zh: "这周推荐了3个朋友，10%奖金太好了", ja: "今週3人紹介、10%ボーナス最高", vi: "Giới thiệu 3 bạn tuần này, thưởng 10% tuyệt vời", th: "แนะนำเพื่อน 3 คนสัปดาห์นี้ โบนัส 10% สุดยอด" } },
    { native: "BTC prediction game is so addictive lol", translations: { ko: "BTC 예측 게임 중독성 있네요 ㅋㅋ", zh: "BTC预测游戏太上瘾了哈哈", ja: "BTC予測ゲーム中毒性あるw", vi: "Game dự đoán BTC gây nghiện quá", th: "เกมทำนาย BTC เสพติดมาก 555" } },
    { native: "My Sprint Bot just completed 7 days, reinvesting now!", translations: { ko: "스프린트봇 7일 완료, 재투자합니다!", zh: "Sprint Bot刚完成7天，现在再投资！", ja: "Sprint Bot 7日完了、再投資します！", vi: "Sprint Bot vừa hoàn thành 7 ngày, tái đầu tư ngay!", th: "Sprint Bot ครบ 7 วันแล้ว ลงทุนซ้ำเลย!" } },
    { native: "100K users already? This is growing fast 🔥", translations: { ko: "벌써 10만 유저? 성장 속도 미쳤다 🔥", zh: "已经10万用户了？增长太快了🔥", ja: "もう10万ユーザー？成長速度すごい🔥", vi: "Đã 100K người dùng rồi? Tăng trưởng nhanh quá 🔥", th: "100K ผู้ใช้แล้ว? โตเร็วมาก 🔥" } },
  ],
  ko: [
    { native: "퀀텀봇에 5000달러 스테이킹 완료! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", zh: "刚在Quantum Bot上质押了5000美元！🚀", ja: "Quantum Botに5000ドルステーキング完了！🚀", vi: "Vừa stake 5,000$ trên Quantum Bot! 🚀", th: "เพิ่ง stake $5,000 บน Quantum Bot! 🚀" } },
    { native: "오늘 일일 수익률 1.5% 대박이네요", translations: { en: "Today's daily return is 1.5%, incredible!", zh: "今天日收益1.5%，太棒了！", ja: "今日の日次リターン1.5%、すごい！", vi: "Lợi nhuận hàng ngày 1.5% hôm nay!", th: "ผลตอบแทนรายวัน 1.5% วันนี้!" } },
    { native: "카탈리스트봇 써보신 분? 변경 고민중", translations: { en: "Anyone tried Catalyst Bot? Thinking about switching", zh: "有人试过Catalyst Bot吗？考虑切换", ja: "Catalyst Bot試した人いますか？", vi: "Ai đã thử Catalyst Bot chưa?", th: "ใครลอง Catalyst Bot แล้วบ้าง?" } },
    { native: "이번 주 3명 추천했는데 10% 보너스 최고", translations: { en: "Referred 3 friends this week, 10% bonus is the best", zh: "这周推荐了3个朋友，10%奖金太好了", ja: "今週3人紹介、10%ボーナス最高", vi: "Giới thiệu 3 bạn tuần này, thưởng 10%", th: "แนะนำเพื่อน 3 คน โบนัส 10% สุดยอด" } },
    { native: "BTC 예측 게임 중독성 있네요 ㅋㅋ", translations: { en: "BTC prediction game is so addictive lol", zh: "BTC预测游戏太上瘾了哈哈", ja: "BTC予測ゲーム中毒性あるw", vi: "Game dự đoán BTC gây nghiện quá", th: "เกมทำนาย BTC เสพติดมาก" } },
    { native: "스프린트봇 7일 완료, 재투자합니다!", translations: { en: "Sprint Bot 7 days done, reinvesting!", zh: "Sprint Bot刚完成7天，再投资！", ja: "Sprint Bot 7日完了、再投資！", vi: "Sprint Bot hoàn thành 7 ngày, tái đầu tư!", th: "Sprint Bot ครบ 7 วัน ลงทุนซ้ำ!" } },
    { native: "벌써 10만 유저? 성장 속도 미쳤다 🔥", translations: { en: "Already 100K users? Growth speed is insane 🔥", zh: "已经10万用户？增长太快🔥", ja: "もう10万ユーザー？成長速度すごい🔥", vi: "Đã 100K người dùng? Tăng trưởng nhanh 🔥", th: "100K ผู้ใช้แล้ว? โตเร็วมาก 🔥" } },
    { native: "모멘텀봇 매일 0.9% 안정적 수익 💰", translations: { en: "Momentum Bot gives stable 0.9% daily 💰", zh: "动量机器人每天稳定0.9%收益💰", ja: "Momentum Bot毎日安定0.9%収益💰", vi: "Momentum Bot lợi nhuận ổn định 0.9%/ngày 💰", th: "Momentum Bot กำไรคงที่ 0.9%/วัน 💰" } },
  ],
  zh: [
    { native: "刚在Quantum Bot上质押了5000美元！🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러 스테이킹 완료! 🚀", ja: "Quantum Botに5000ドルステーキング完了！🚀", vi: "Vừa stake 5,000$ trên Quantum Bot! 🚀", th: "เพิ่ง stake $5,000 บน Quantum Bot! 🚀" } },
    { native: "今天日收益1.5%，太棒了！", translations: { en: "Today's daily return 1.5%, awesome!", ko: "오늘 일일 수익률 1.5% 대박!", ja: "今日の日次リターン1.5%、すごい！", vi: "Lợi nhuận hàng ngày 1.5%!", th: "ผลตอบแทนรายวัน 1.5%!" } },
    { native: "有人试过Catalyst Bot吗？考虑切换", translations: { en: "Anyone tried Catalyst Bot? Thinking about switching", ko: "카탈리스트봇 써보신 분?", ja: "Catalyst Bot試した人いますか？", vi: "Ai đã thử Catalyst Bot?", th: "ใครลอง Catalyst Bot บ้าง?" } },
    { native: "这周推荐了3个朋友，10%奖金太好了", translations: { en: "Referred 3 friends, 10% bonus is great", ko: "3명 추천, 10% 보너스 최고", ja: "3人紹介、10%ボーナス最高", vi: "Giới thiệu 3 bạn, thưởng 10%", th: "แนะนำเพื่อน 3 คน โบนัส 10%" } },
    { native: "BTC预测游戏太上瘾了哈哈", translations: { en: "BTC prediction game is addictive haha", ko: "BTC 예측 게임 중독성 ㅋㅋ", ja: "BTC予測ゲーム中毒性w", vi: "Game dự đoán BTC gây nghiện", th: "เกมทำนาย BTC เสพติด" } },
    { native: "已经10万用户了？增长太快了🔥", translations: { en: "100K users already? Growing so fast 🔥", ko: "벌써 10만 유저? 성장 속도 미쳤다 🔥", ja: "もう10万ユーザー？🔥", vi: "100K người dùng rồi? 🔥", th: "100K ผู้ใช้แล้ว? 🔥" } },
  ],
  ja: [
    { native: "Quantum Botに5000ドルステーキング完了！🚀", translations: { en: "Staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러 스테이킹! 🚀", zh: "Quantum Bot质押5000美元！🚀", vi: "Stake 5,000$ trên Quantum Bot! 🚀", th: "stake $5,000 บน Quantum Bot! 🚀" } },
    { native: "今日の日次リターン1.5%、すごい！", translations: { en: "Today's daily return 1.5%, amazing!", ko: "오늘 수익률 1.5% 대박!", zh: "今天日收益1.5%！", vi: "Lợi nhuận 1.5% hôm nay!", th: "ผลตอบแทน 1.5% วันนี้!" } },
    { native: "Catalyst Bot試した人いますか？切り替え検討中", translations: { en: "Anyone tried Catalyst Bot?", ko: "카탈리스트봇 써보신 분?", zh: "有人试过Catalyst Bot吗？", vi: "Ai thử Catalyst Bot chưa?", th: "ใครลอง Catalyst Bot?" } },
    { native: "もう10万ユーザー？成長速度すごい🔥", translations: { en: "100K users? Growth is incredible 🔥", ko: "10만 유저? 성장 속도 미쳤다 🔥", zh: "10万用户？增长太快🔥", vi: "100K người dùng? Tăng trưởng nhanh 🔥", th: "100K ผู้ใช้? โตเร็วมาก 🔥" } },
  ],
  de: [
    { native: "Gerade $5.000 auf Quantum Bot gestaked! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러 스테이킹! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
    { native: "Die tägliche Rendite ist unglaublich, 1,5% heute!", translations: { en: "Daily return is incredible, 1.5% today!", ko: "일일 수익률 1.5% 대박!", zh: "日收益1.5%！", ja: "日次リターン1.5%！", vi: "Lợi nhuận 1.5%!", th: "ผลตอบแทน 1.5%!" } },
  ],
  fr: [
    { native: "Je viens de staker 5 000$ sur Quantum Bot ! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러 스테이킹! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
    { native: "Les rendements quotidiens sont incroyables, 1,5% aujourd'hui !", translations: { en: "Daily returns are incredible, 1.5% today!", ko: "일일 수익률 1.5% 대박!", zh: "日收益1.5%！", ja: "日次リターン1.5%！", vi: "Lợi nhuận 1.5%!", th: "ผลตอบแทน 1.5%!" } },
  ],
  es: [
    { native: "¡Acabo de hacer staking de $5,000 en Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러 스테이킹! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
    { native: "Los rendimientos diarios son increíbles, ¡1.5% hoy!", translations: { en: "Daily returns are incredible, 1.5% today!", ko: "일일 수익률 1.5%!", zh: "日收益1.5%！", ja: "日次リターン1.5%！", vi: "Lợi nhuận 1.5%!", th: "ผลตอบแทน 1.5%!" } },
  ],
  pt: [
    { native: "Acabei de fazer staking de $5.000 no Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
  ],
  ru: [
    { native: "Только что застейкал $5,000 на Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
    { native: "Дневная доходность невероятная, 1.5% сегодня!", translations: { en: "Daily return incredible, 1.5% today!", ko: "일일 수익률 1.5%!", zh: "日收益1.5%！", ja: "日次リターン1.5%！", vi: "Lợi nhuận 1.5%!", th: "ผลตอบแทน 1.5%!" } },
  ],
  ar: [
    { native: "!🚀 لقد قمت بتكديس 5000 دولار على Quantum Bot", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
  ],
  hi: [
    { native: "Quantum Bot पर $5,000 स्टेक किया! 🚀", translations: { en: "Staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
  ],
  vi: [
    { native: "Vừa stake 5,000$ trên Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", th: "stake $5,000! 🚀" } },
    { native: "Lợi nhuận hàng ngày tuyệt vời, 1.5% hôm nay!", translations: { en: "Daily return 1.5% today!", ko: "일일 수익률 1.5%!", zh: "日收益1.5%！", ja: "日次リターン1.5%！", th: "ผลตอบแทน 1.5%!" } },
  ],
  th: [
    { native: "เพิ่ง stake $5,000 บน Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀" } },
    { native: "ผลตอบแทนรายวันเหลือเชื่อ 1.5% วันนี้!", translations: { en: "Daily return 1.5% today!", ko: "일일 수익률 1.5%!", zh: "日收益1.5%！", ja: "日次リターン1.5%！", vi: "Lợi nhuận 1.5%!" } },
  ],
  id: [
    { native: "Baru saja stake $5,000 di Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
  ],
  nl: [
    { native: "Net $5.000 gestaked op Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
  ],
  it: [
    { native: "Ho appena stakato $5.000 su Quantum Bot! 🚀", translations: { en: "Just staked $5,000 on Quantum Bot! 🚀", ko: "퀀텀봇에 5000달러! 🚀", zh: "Quantum Bot质押5000美元！🚀", ja: "Quantum Botに5000ドル！🚀", vi: "Stake 5,000$! 🚀", th: "stake $5,000! 🚀" } },
  ],
};

// AI Bot responses (always in the viewer's language)
const AI_RESPONSES: Record<string, string[]> = {
  en: [
    "Welcome to XPLAY! 🎉 Our AI engines run 24/7 generating real revenue from token mixing, quant trading, and market making.",
    "Great question! Quantum Bot offers 1.3%~1.8% daily for 360-day lock. Perfect for long-term investors!",
    "XPLAY has 100,000+ active users across 100+ countries. Our prediction platform launched during the World Cup! ⚽",
    "The referral system offers up to 10% direct bonus across 6 generations. Share your link!",
    "XP Token: 21M total supply burning to 1M. Extreme deflation = value! 📈",
  ],
  ko: [
    "XPLAY에 오신 것을 환영합니다! 🎉 AI 엔진이 24시간 토큰 믹싱, 퀀트 트레이딩으로 실제 수익을 창출합니다.",
    "좋은 질문입니다! 퀀텀봇은 360일 잠금으로 일 1.3%~1.8% 수익률을 제공합니다!",
    "XPLAY는 100개국 이상에서 10만명+ 활성 유저를 보유하고 있습니다. 월드컵 때 예측 플랫폼 런칭! ⚽",
    "추천 시스템은 6세대 최대 10% 직추천 보너스를 제공합니다. 링크를 공유하세요!",
    "XP 토큰: 2100만개에서 100만개로 소각. 극단적 디플레이션 = 가치! 📈",
  ],
  zh: [
    "欢迎来到XPLAY！🎉 AI引擎24/7运行，通过代币混合、量化交易产生真实收益。",
    "好问题！Quantum Bot日收益1.3%~1.8%，锁定360天。适合长期投资！",
    "XPLAY在100多个国家有10万+活跃用户。世界杯期间推出预测平台！⚽",
    "推荐系统6代最高10%直推奖金。分享链接！",
  ],
  ja: [
    "XPLAYへようこそ！🎉 AIエンジンが24時間稼働中。",
    "Quantum Botは360日ロックで日次1.3%~1.8%！",
    "100カ国以上で10万人+のアクティブユーザー！⚽",
  ],
  vi: [
    "Chào mừng đến XPLAY! 🎉 AI engine hoạt động 24/7.",
    "Quantum Bot lợi nhuận 1.3%~1.8%/ngày, khóa 360 ngày!",
  ],
  th: [
    "ยินดีต้อนรับสู่ XPLAY! 🎉 AI engine ทำงาน 24/7",
    "Quantum Bot ผลตอบแทน 1.3%~1.8%/วัน ล็อค 360 วัน!",
  ],
};

interface ChatMessage {
  id: string;
  user: typeof VIRTUAL_USERS[number] | null;
  nativeText: string;
  translationText: string; // Translation in viewer's language
  nativeLang: string;
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

  // Map site lang to supported chat lang
  const viewerLang = ["ko", "en", "zh", "ja", "vi", "th"].includes(lang) ? lang : "en";

  const addAutoMessage = useCallback(() => {
    const isAI = Math.random() < 0.2;

    if (isAI) {
      // AI always responds in viewer's language
      const aiMsgs = AI_RESPONSES[viewerLang] || AI_RESPONSES.en;
      const text = aiMsgs[Math.floor(Math.random() * aiMsgs.length)];
      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user: null,
        nativeText: text,
        translationText: "",
        nativeLang: viewerLang,
        timestamp: new Date(),
        isAI: true,
      };
      setMessages((prev) => [...prev, msg].slice(-50));
    } else {
      // Pick a random user
      const user = VIRTUAL_USERS[Math.floor(Math.random() * VIRTUAL_USERS.length)];
      const userLang = user.lang;
      const msgs = NATIVE_MESSAGES[userLang] || NATIVE_MESSAGES.en;
      const msgData = msgs[Math.floor(Math.random() * msgs.length)];

      // Get translation in viewer's language
      let translation = "";
      if (userLang !== viewerLang) {
        translation = msgData.translations[viewerLang] || msgData.translations["en"] || "";
      }

      const msg: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        user,
        nativeText: msgData.native,
        translationText: translation,
        nativeLang: userLang,
        timestamp: new Date(),
        isAI: false,
      };
      setMessages((prev) => [...prev, msg].slice(-50));
    }

    // Random interval 5-15 seconds for lively feel
    const interval = (Math.floor(Math.random() * 11) + 5) * 1000;
    timerRef.current = setTimeout(addAutoMessage, interval);
  }, [viewerLang]);

  useEffect(() => {
    // Initialize with some messages
    const initial: ChatMessage[] = [];
    const allLangs = Object.keys(NATIVE_MESSAGES);

    for (let i = 0; i < 8; i++) {
      const isAI = i % 4 === 0;
      if (isAI) {
        const aiMsgs = AI_RESPONSES[viewerLang] || AI_RESPONSES.en;
        initial.push({
          id: `init-${i}`,
          user: null,
          nativeText: aiMsgs[i % aiMsgs.length],
          translationText: "",
          nativeLang: viewerLang,
          timestamp: new Date(Date.now() - (8 - i) * 12000),
          isAI: true,
        });
      } else {
        const user = VIRTUAL_USERS[Math.floor(Math.random() * VIRTUAL_USERS.length)];
        const userLang = user.lang;
        const msgs = NATIVE_MESSAGES[userLang] || NATIVE_MESSAGES.en;
        const msgData = msgs[Math.floor(Math.random() * msgs.length)];
        let translation = "";
        if (userLang !== viewerLang) {
          translation = msgData.translations[viewerLang] || msgData.translations["en"] || "";
        }
        initial.push({
          id: `init-${i}`,
          user,
          nativeText: msgData.native,
          translationText: translation,
          nativeLang: userLang,
          timestamp: new Date(Date.now() - (8 - i) * 12000),
          isAI: false,
        });
      }
    }
    setMessages(initial);
    setOnlineCount(Math.floor(Math.random() * 300) + 500);

    timerRef.current = setTimeout(addAutoMessage, (Math.floor(Math.random() * 6) + 3) * 1000);

    // Online count only increases (with small fluctuations up)
    const onlineInterval = setInterval(() => {
      setOnlineCount((prev) => prev + Math.floor(Math.random() * 15) + 1);
    }, 30000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(onlineInterval);
    };
  }, [addAutoMessage, viewerLang]);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      user: { name: t("chat.you"), flag: "👤", color: "#00f5ff", lang: viewerLang },
      nativeText: userInput,
      translationText: "",
      nativeLang: viewerLang,
      timestamp: new Date(),
      isAI: false,
    };
    setMessages((prev) => [...prev, userMsg].slice(-50));
    setUserInput("");

    // AI responds after 2-4 seconds
    setTimeout(() => {
      const aiMsgs = AI_RESPONSES[viewerLang] || AI_RESPONSES.en;
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        user: null,
        nativeText: aiMsgs[Math.floor(Math.random() * aiMsgs.length)],
        translationText: "",
        nativeLang: viewerLang,
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
          style={{ height: "420px" }}
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
                        {msg.nativeText}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* User Message — native language + translation */
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
                      {/* Native language message */}
                      <div
                        className="text-sm p-3"
                        style={{
                          color: "rgba(226,232,240,0.8)",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: "0 10px 10px 10px",
                        }}
                      >
                        {msg.nativeText}
                      </div>
                      {/* Translation in viewer's language */}
                      {msg.translationText && (
                        <div
                          className="text-[11px] mt-1 px-3 py-1.5"
                          style={{
                            color: "rgba(226,232,240,0.45)",
                            background: "rgba(0,245,255,0.03)",
                            borderRadius: "0 8px 8px 8px",
                            borderLeft: "2px solid rgba(0,245,255,0.15)",
                          }}
                        >
                          🌐 {msg.translationText}
                        </div>
                      )}
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
