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
import { Send, Bot, Users, Globe2, ChevronDown, Languages, Pin, X, Megaphone } from "lucide-react";

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
    { native: "Just withdrew $2,000 USDT to my wallet, took only 2 hours! 💸", translations: { ko: "방금 2000달러 USDT 출금했는데 2시간밖에 안 걸렸어요! 💸", zh: "刚提现2000美元USDT，只用了2小时！💸", ja: "2000ドルUSDT出金、たった2時間！💸", vi: "Vừa rút $2,000 USDT, chỉ mất 2 tiếng! 💸", th: "เพิ่งถอน $2,000 USDT ใช้เวลาแค่ 2 ชั่วโมง! 💸" } },
    { native: "The prediction game during World Cup was insane! Can't wait for the next one", translations: { ko: "월드컵 때 예측 게임 미쳤었는데! 다음 거 기대됨", zh: "世界杯期间的预测游戏太疯狂了！期待下一个", ja: "W杯の予測ゲーム最高だった！次が楽しみ", vi: "Game dự đoán World Cup điên cuồng! Mong chờ lần tiếp", th: "เกมทำนายช่วง World Cup บ้ามาก! รอครั้งต่อไป" } },
    { native: "My team has 50+ members now, passive income is real 🙌", translations: { ko: "우리 팀 50명 넘었어요, 패시브 인컴 실화 🙌", zh: "我的团队已经50+人了，被动收入是真的🙌", ja: "チーム50人超え、パッシブインカムは本物🙌", vi: "Đội tôi đã 50+ thành viên, thu nhập thụ động thật sự 🙌", th: "ทีมมี 50+ คนแล้ว รายได้ passive เป็นจริง 🙌" } },
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
    { native: "방금 2000달러 USDT 출금했는데 2시간밖에 안 걸렸어요! 💸", translations: { en: "Just withdrew $2,000 USDT, took only 2 hours! 💸", zh: "刚提现2000美元USDT，只用了2小时！💸", ja: "2000ドルUSDT出金、たった2時間！💸", vi: "Vừa rút $2,000 USDT, chỉ mất 2 tiếng! 💸", th: "เพิ่งถอน $2,000 USDT แค่ 2 ชั่วโมง! 💸" } },
    { native: "월드컵 예측 게임 때 진짜 대박이었는데 다음 이벤트 기대됩니다", translations: { en: "World Cup prediction game was amazing, looking forward to next event", zh: "世界杯预测游戏太棒了，期待下一个活动", ja: "W杯予測ゲーム最高だった、次のイベント楽しみ", vi: "Game dự đoán World Cup tuyệt vời, mong chờ sự kiện tiếp", th: "เกมทำนาย World Cup สุดยอด รอกิจกรรมต่อไป" } },
    { native: "우리 팀 50명 넘었어요 패시브 인컴 실화입니다 🙌", translations: { en: "Our team has 50+ members, passive income is real 🙌", zh: "团队50+人了，被动收入是真的🙌", ja: "チーム50人超え、パッシブインカムは本物🙌", vi: "Đội 50+ thành viên, thu nhập thụ động thật sự 🙌", th: "ทีม 50+ คน รายได้ passive เป็นจริง 🙌" } },
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

// Supported chat languages with display names
const CHAT_LANGUAGES = [
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
];

export default function LiveChatSection() {
  const { t, lang } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Pinned announcement
  const [pinnedMessage, setPinnedMessage] = useState<{
    text: string;
    translations: Record<string, string>;
    timestamp: Date;
    author: string;
  } | null>({
    text: "XPLAY 2.0 업데이트 안내: 새로운 AI 에이전트 봇과 Web4 플랫폼이 곧 출시됩니다. 자세한 내용은 공식 텔레그램 채널을 확인해주세요! 🚀",
    translations: {
      en: "XPLAY 2.0 Update: New AI Agent Bot and Web4 Platform launching soon. Check the official Telegram channel for details! \ud83d\ude80",
      zh: "XPLAY 2.0 \u66f4\u65b0\uff1a\u65b0AI\u4ee3\u7406Bot\u548cWeb4\u5e73\u53f0\u5373\u5c06\u4e0a\u7ebf\u3002\u8bf7\u67e5\u770b\u5b98\u65b9Telegram\u9891\u9053\uff01\ud83d\ude80",
      ja: "XPLAY 2.0\u30a2\u30c3\u30d7\u30c7\u30fc\u30c8\uff1a\u65b0AI\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8Bot\u3068Web4\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u304c\u307e\u3082\u306a\u304f\u30ed\u30fc\u30f3\u30c1\u3002\u516c\u5f0fTelegram\u3092\u30c1\u30a7\u30c3\u30af\uff01\ud83d\ude80",
      vi: "C\u1eadp nh\u1eadt XPLAY 2.0: AI Agent Bot v\u00e0 n\u1ec1n t\u1ea3ng Web4 s\u1eafp ra m\u1eaft. Ki\u1ec3m tra k\u00eanh Telegram ch\u00ednh th\u1ee9c! \ud83d\ude80",
      th: "\u0e2d\u0e31\u0e1b\u0e40\u0e14\u0e15 XPLAY 2.0: AI Agent Bot \u0e41\u0e25\u0e30 Web4 Platform \u0e40\u0e23\u0e47\u0e27\u0e46\u0e19\u0e35\u0e49 \u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e0a\u0e48\u0e2d\u0e07 Telegram! \ud83d\ude80",
    },
    timestamp: new Date(),
    author: "XPLAY Admin",
  });
  const [pinnedExpanded, setPinnedExpanded] = useState(false);
  const [pinnedDismissed, setPinnedDismissed] = useState(false);

  // User-selected preferred language (defaults to site language)
  const defaultLang = ["ko", "en", "zh", "ja", "vi", "th"].includes(lang) ? lang : "en";
  const [preferredLang, setPreferredLang] = useState<string>(defaultLang);
  const viewerLang = preferredLang;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    // Random interval 3-12 seconds for lively feel
    const interval = (Math.floor(Math.random() * 10) + 3) * 1000;
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

  // Simple client-side translation map for user messages (bidirectional)
  const USER_MSG_TRANSLATIONS: Record<string, Record<string, string>> = {
    ko: { en: "(Korean message)", zh: "(韩语消息)", ja: "(韓国語メッセージ)", vi: "(Tin nhắn tiếng Hàn)", th: "(ข้อความภาษาเกาหลี)" },
    en: { ko: "(영어 메시지)", zh: "(英语消息)", ja: "(英語メッセージ)", vi: "(Tin nhắn tiếng Anh)", th: "(ข้อความภาษาอังกฤษ)" },
    zh: { ko: "(중국어 메시지)", en: "(Chinese message)", ja: "(中国語メッセージ)", vi: "(Tin nhắn tiếng Trung)", th: "(ข้อความภาษาจีน)" },
    ja: { ko: "(일본어 메시지)", en: "(Japanese message)", zh: "(日语消息)", vi: "(Tin nhắn tiếng Nhật)", th: "(ข้อความภาษาญี่ปุ่น)" },
    vi: { ko: "(베트남어 메시지)", en: "(Vietnamese message)", zh: "(越南语消息)", ja: "(ベトナム語メッセージ)", th: "(ข้อความภาษาเวียดนาม)" },
    th: { ko: "(태국어 메시지)", en: "(Thai message)", zh: "(泰语消息)", ja: "(タイ語メッセージ)", vi: "(Tin nhắn tiếng Thái)" },
  };

  // Simulate bidirectional translation: after user sends, foreign users "react" with translated version
  const simulateBidirectionalReaction = useCallback((userText: string) => {
    // Pick 1-2 random foreign users to "see" and react to the user's message
    const foreignUsers = VIRTUAL_USERS.filter(u => u.lang !== viewerLang);
    const reactCount = Math.floor(Math.random() * 2) + 1;
    const shuffled = [...foreignUsers].sort(() => Math.random() - 0.5).slice(0, reactCount);

    shuffled.forEach((foreignUser, idx) => {
      setTimeout(() => {
        // Foreign user reacts in their language
        const reactions: Record<string, string[]> = {
          en: [`Nice! "${userText.slice(0, 20)}..." - I agree! 👍`, `Great point! Welcome to XPLAY! 🎉`, `That's what I'm talking about! 🚀`],
          ko: [`좋은 말씀이세요! 동감합니다 👍`, `맞아요! XPLAY 최고! 🎉`, `저도 그렇게 생각해요! 🚀`],
          zh: [`说得好！我同意！👍`, `太对了！XPLAY最棒！🎉`, `我也是这么想的！🚀`],
          ja: [`いいですね！同感です👍`, `その通り！XPLAY最高！🎉`, `私もそう思います！🚀`],
          vi: [`Hay quá! Tôi đồng ý! 👍`, `Đúng vậy! XPLAY tuyệt vời! 🎉`, `Tôi cũng nghĩ vậy! 🚀`],
          th: [`เห็นด้วย! 👍`, `ใช่เลย! XPLAY สุดยอด! 🎉`, `คิดเหมือนกัน! 🚀`],
          fr: [`Bien dit ! Je suis d'accord ! 👍`, `Exactement ! XPLAY est génial ! 🎉`, `Je pense pareil ! 🚀`],
          de: [`Gut gesagt! Stimme zu! 👍`, `Genau! XPLAY ist super! 🎉`, `Denke ich auch! 🚀`],
          es: [`¡Bien dicho! ¡Estoy de acuerdo! 👍`, `¡Exacto! ¡XPLAY es genial! 🎉`, `¡Pienso lo mismo! 🚀`],
          pt: [`Bem dito! Concordo! 👍`, `Exato! XPLAY é incrível! 🎉`, `Penso o mesmo! 🚀`],
          it: [`Ben detto! Sono d'accordo! 👍`, `Esatto! XPLAY è fantastico! 🎉`, `La penso anch'io! 🚀`],
          ar: [`أحسنت! أوافق! 👍`, `بالضبط! XPLAY رائع! 🎉`, `أفكر بنفس الشيء! 🚀`],
          hi: [`बहुत अच्छा! मैं सहमत हूँ! 👍`, `बिल्कुल! XPLAY शानदार है! 🎉`, `मैं भी ऐसा सोचता हूँ! 🚀`],
          ru: [`Хорошо сказано! Согласен! 👍`, `Точно! XPLAY супер! 🎉`, `Думаю так же! 🚀`],
          id: [`Setuju! 👍`, `Benar! XPLAY luar biasa! 🎉`, `Saya juga berpikir begitu! 🚀`],
          nl: [`Goed gezegd! Mee eens! 👍`, `Precies! XPLAY is geweldig! 🎉`, `Denk ik ook! 🚀`],
        };
        const fLang = foreignUser.lang;
        const fReactions = reactions[fLang] || reactions.en;
        const nativeText = fReactions[Math.floor(Math.random() * fReactions.length)];

        // Translation for viewer
        const translationMap: Record<string, Record<string, string>> = {
          en: { ko: "좋아요! 동감합니다! 👍", zh: "说得好！同意！👍", ja: "いいね！同感！👍" },
          ko: { en: "Nice! I agree! 👍", zh: "说得好！同意！👍", ja: "いいね！同感！👍" },
          zh: { ko: "좋아요! 동감합니다! 👍", en: "Well said! I agree! 👍", ja: "いいね！同感！👍" },
          ja: { ko: "좋아요! 동감합니다! 👍", en: "Nice! I agree! 👍", zh: "说得好！同意！👍" },
          fr: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          de: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          es: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          pt: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          it: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          ar: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          hi: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          ru: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          vi: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          th: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          id: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
          nl: { ko: "잘 말씀하셨어요! 동감합니다! 👍", en: "Well said! I agree! 👍", zh: "说得好！同意！👍", ja: "よく言った！同感！👍" },
        };
        const translation = (translationMap[fLang] && translationMap[fLang][viewerLang]) || "";

        const reactionMsg: ChatMessage = {
          id: `reaction-${Date.now()}-${idx}`,
          user: foreignUser,
          nativeText,
          translationText: fLang !== viewerLang ? translation : "",
          nativeLang: fLang,
          timestamp: new Date(),
          isAI: false,
        };
        setMessages((prev) => [...prev, reactionMsg].slice(-50));
      }, (idx + 1) * (3000 + Math.random() * 4000));
    });
  }, [viewerLang]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    // User's message with bidirectional translation indicator
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
    const sentText = userInput;
    setUserInput("");

    // Show "translating..." indicator then show translated broadcast
    setTimeout(() => {
      // Show a system message that the user's message was auto-translated
      const broadcastLangs = ["en", "zh", "ja", "ko", "vi", "th"].filter(l => l !== viewerLang);
      const targetLang = broadcastLangs[Math.floor(Math.random() * broadcastLangs.length)];
      const langNames: Record<string, Record<string, string>> = {
        en: { ko: "영어", zh: "英语", ja: "英語", vi: "tiếng Anh", th: "ภาษาอังกฤษ" },
        ko: { en: "Korean", zh: "韩语", ja: "韓国語", vi: "tiếng Hàn", th: "ภาษาเกาหลี" },
        zh: { en: "Chinese", ko: "중국어", ja: "中国語", vi: "tiếng Trung", th: "ภาษาจีน" },
        ja: { en: "Japanese", ko: "일본어", zh: "日语", vi: "tiếng Nhật", th: "ภาษาญี่ปุ่น" },
        vi: { en: "Vietnamese", ko: "베트남어", zh: "越南语", ja: "ベトナム語", th: "ภาษาเวียดนาม" },
        th: { en: "Thai", ko: "태국어", zh: "泰语", ja: "タイ語", vi: "tiếng Thái" },
      };
      const translatedToName = (langNames[viewerLang] && langNames[viewerLang][targetLang]) || targetLang.toUpperCase();

      const sysMsg: ChatMessage = {
        id: `sys-translate-${Date.now()}`,
        user: null,
        nativeText: `🌐 ${t("chat.autoTranslated") || "Your message was auto-translated and broadcast to"} ${broadcastLangs.length} ${t("chat.languages") || "languages"}`,
        translationText: "",
        nativeLang: viewerLang,
        timestamp: new Date(),
        isAI: true,
      };
      setMessages((prev) => [...prev, sysMsg].slice(-50));
    }, 1500);

    // Foreign users react to the user's message
    simulateBidirectionalReaction(sentText);

    // AI also responds after 4-6 seconds
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
    }, 4000 + Math.random() * 2000);
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
          <div className="flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all"
                style={{
                  background: showLangDropdown ? "rgba(0,245,255,0.12)" : "rgba(0,245,255,0.06)",
                  border: `1px solid ${showLangDropdown ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.12)"}`,
                }}
              >
                <Languages size={13} style={{ color: "#00f5ff" }} />
                <span className="text-xs" style={{ color: "rgba(226,232,240,0.8)" }}>
                  {CHAT_LANGUAGES.find(l => l.code === preferredLang)?.flag}{" "}
                  {CHAT_LANGUAGES.find(l => l.code === preferredLang)?.name}
                </span>
                <ChevronDown size={12} style={{ color: "rgba(226,232,240,0.5)", transform: showLangDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </button>
              {showLangDropdown && (
                <div
                  className="absolute right-0 mt-1 py-1 z-50"
                  style={{
                    background: "rgba(10,14,26,0.95)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    borderRadius: "8px",
                    backdropFilter: "blur(12px)",
                    minWidth: "150px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                  }}
                >
                  {CHAT_LANGUAGES.map((chatLang) => (
                    <button
                      key={chatLang.code}
                      onClick={() => {
                        setPreferredLang(chatLang.code);
                        setShowLangDropdown(false);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left transition-all"
                      style={{
                        background: preferredLang === chatLang.code ? "rgba(0,245,255,0.1)" : "transparent",
                        color: preferredLang === chatLang.code ? "#00f5ff" : "rgba(226,232,240,0.7)",
                      }}
                      onMouseEnter={(e) => { if (preferredLang !== chatLang.code) (e.target as HTMLElement).style.background = "rgba(0,245,255,0.05)"; }}
                      onMouseLeave={(e) => { if (preferredLang !== chatLang.code) (e.target as HTMLElement).style.background = "transparent"; }}
                    >
                      <span className="text-base">{chatLang.flag}</span>
                      <span className="text-xs font-medium">{chatLang.name}</span>
                      {preferredLang === chatLang.code && (
                        <span className="ml-auto text-[10px]" style={{ color: "#00f5ff" }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
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
        </div>

        {/* Pinned Announcement */}
        {pinnedMessage && !pinnedDismissed && (
          <div
            className="px-4 py-2.5"
            style={{
              background: "linear-gradient(90deg, rgba(234,179,8,0.08), rgba(0,245,255,0.06))",
              borderBottom: "1px solid rgba(234,179,8,0.15)",
            }}
          >
            <div className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: "rgba(234,179,8,0.15)",
                  border: "1px solid rgba(234,179,8,0.3)",
                }}
              >
                <Pin size={11} style={{ color: "#eab308", transform: "rotate(45deg)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Megaphone size={12} style={{ color: "#eab308" }} />
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "#eab308", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {pinnedMessage.author}
                  </span>
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-bold rounded"
                    style={{
                      background: "rgba(234,179,8,0.15)",
                      border: "1px solid rgba(234,179,8,0.25)",
                      color: "#eab308",
                    }}
                  >
                    PINNED
                  </span>
                </div>
                <p
                  className={`text-xs leading-relaxed ${!pinnedExpanded ? "line-clamp-2" : ""}`}
                  style={{ color: "rgba(226,232,240,0.85)" }}
                >
                  {(() => {
                    const translated = pinnedMessage.translations[preferredLang];
                    if (preferredLang === "ko" || !translated) return pinnedMessage.text;
                    return translated;
                  })()}
                </p>
                {/* Show original if viewing translation */}
                {preferredLang !== "ko" && pinnedMessage.translations[preferredLang] && (
                  <p
                    className="text-[10px] mt-1 italic"
                    style={{ color: "rgba(226,232,240,0.4)" }}
                  >
                    {pinnedMessage.text}
                  </p>
                )}
                {pinnedMessage.text.length > 80 && (
                  <button
                    onClick={() => setPinnedExpanded(!pinnedExpanded)}
                    className="text-[10px] mt-1"
                    style={{ color: "#eab308" }}
                  >
                    {pinnedExpanded ? "▲ 접기" : "▼ 더보기"}
                  </button>
                )}
              </div>
              <button
                onClick={() => setPinnedDismissed(true)}
                className="shrink-0 p-1 rounded transition-all mt-0.5"
                style={{ color: "rgba(226,232,240,0.4)" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "rgba(226,232,240,0.8)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(226,232,240,0.4)"; }}
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={chatRef}
          className="overflow-y-auto px-4 py-3 space-y-3"
          style={{ height: pinnedMessage && !pinnedDismissed ? "360px" : "420px" }}
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
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full"
                          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(226,232,240,0.35)" }}
                        >
                          {msg.nativeLang.toUpperCase()}
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
                          <span style={{ color: "rgba(0,245,255,0.4)", fontSize: "9px", marginRight: "4px" }}>AUTO-TRANSLATE</span> {msg.translationText}
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
