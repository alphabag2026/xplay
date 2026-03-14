/*
 * TutorialSection — XPLAY Tutorial & FAQ
 * YouTube video embeds with step-by-step guides
 * FAQ accordion tab for common questions
 * Tooltip on hover for each guide card
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

type LangMap = Record<string, string>;

interface TutorialStep {
  title: LangMap;
  desc: LangMap;
}

interface TutorialVideo {
  id: string;
  youtubeId: string;
  icon: React.ReactNode;
  title: LangMap;
  description: LangMap;
  tooltip: LangMap; // Short summary tooltip on hover
  category: string;
  steps: TutorialStep[];
}

interface FAQItem {
  question: LangMap;
  answer: LangMap;
}

const TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: "tut-1",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Rocket size={16} style={{ color: "#00f5ff" }} />,
    title: {
      ko: "XPLAY 가입부터 첫 투자까지",
      en: "XPLAY Registration to First Investment",
      zh: "XPLAY注册到首次投资",
      ja: "XPLAY登録から初投資まで",
      vi: "Đăng ký XPLAY đến đầu tư đầu tiên",
      th: "สมัคร XPLAY ถึงการลงทุนครั้งแรก",
    },
    description: {
      ko: "TokenPocket 지갑 설치부터 USDT 입금, 봇 선택까지 완벽 가이드",
      en: "Complete guide from TokenPocket wallet setup to USDT deposit and bot selection",
      zh: "从TokenPocket钱包安装到USDT充值和机器人选择的完整指南",
      ja: "TokenPocketウォレット設定からUSDT入金、ボット選択まで完全ガイド",
      vi: "Hướng dẫn hoàn chỉnh từ cài đặt ví TokenPocket đến nạp USDT và chọn bot",
      th: "คู่มือสมบูรณ์ตั้งแต่ตั้งค่ากระเป๋า TokenPocket ถึงฝาก USDT และเลือกบอท",
    },
    tooltip: {
      ko: "5분이면 완료! 초보자도 쉽게 따라할 수 있는 단계별 가이드",
      en: "Done in 5 min! Easy step-by-step guide for beginners",
      zh: "5分钟完成！初学者也能轻松跟随的指南",
      ja: "5分で完了！初心者でも簡単なガイド",
      vi: "Hoàn thành trong 5 phút! Hướng dẫn dễ dàng cho người mới",
      th: "เสร็จใน 5 นาที! คู่มือง่ายๆ สำหรับมือใหม่",
    },
    category: "beginner",
    steps: [
      {
        title: { ko: "1. TokenPocket 지갑 설치", en: "1. Install TokenPocket Wallet", zh: "1. 安装TokenPocket钱包", ja: "1. TokenPocketウォレットインストール", vi: "1. Cài đặt ví TokenPocket", th: "1. ติดตั้งกระเป๋า TokenPocket" },
        desc: { ko: "App Store 또는 Google Play에서 TokenPocket을 다운로드하고 지갑을 생성합니다.", en: "Download TokenPocket from App Store or Google Play and create a wallet.", zh: "从App Store或Google Play下载TokenPocket并创建钱包。", ja: "App StoreまたはGoogle PlayからTokenPocketをダウンロードしてウォレットを作成。", vi: "Tải TokenPocket từ App Store hoặc Google Play và tạo ví.", th: "ดาวน์โหลด TokenPocket จาก App Store หรือ Google Play และสร้างกระเป๋า" },
      },
      {
        title: { ko: "2. USDT 입금", en: "2. Deposit USDT", zh: "2. 充值USDT", ja: "2. USDT入金", vi: "2. Nạp USDT", th: "2. ฝาก USDT" },
        desc: { ko: "거래소에서 TokenPocket 지갑으로 USDT(Polygon 네트워크)를 전송합니다.", en: "Transfer USDT (Polygon network) from exchange to your TokenPocket wallet.", zh: "从交易所向TokenPocket钱包转入USDT（Polygon网络）。", ja: "取引所からTokenPocketウォレットにUSDT（Polygonネットワーク）を送金。", vi: "Chuyển USDT (mạng Polygon) từ sàn giao dịch sang ví TokenPocket.", th: "โอน USDT (เครือข่าย Polygon) จากตลาดไปยังกระเป๋า TokenPocket" },
      },
      {
        title: { ko: "3. XPLAY 접속 & 봇 선택", en: "3. Access XPLAY & Choose Bot", zh: "3. 访问XPLAY & 选择机器人", ja: "3. XPLAYアクセス & ボット選択", vi: "3. Truy cập XPLAY & Chọn Bot", th: "3. เข้า XPLAY & เลือกบอท" },
        desc: { ko: "TokenPocket dApp 브라우저에서 XPLAY에 접속하고 투자 봇을 선택합니다.", en: "Access XPLAY through TokenPocket dApp browser and select an investment bot.", zh: "通过TokenPocket dApp浏览器访问XPLAY并选择投资机器人。", ja: "TokenPocket dAppブラウザでXPLAYにアクセスしてボットを選択。", vi: "Truy cập XPLAY qua trình duyệt dApp TokenPocket và chọn bot đầu tư.", th: "เข้า XPLAY ผ่านเบราว์เซอร์ dApp TokenPocket และเลือกบอทลงทุน" },
      },
    ],
  },
  {
    id: "tut-2",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Bot size={16} style={{ color: "#a855f7" }} />,
    title: {
      ko: "AI 봇 선택 가이드 (Sprint/Velocity/Momentum/Quantum/Catalyst)",
      en: "AI Bot Selection Guide (Sprint/Velocity/Momentum/Quantum/Catalyst)",
      zh: "AI机器人选择指南",
      ja: "AIボット選択ガイド",
      vi: "Hướng dẫn chọn Bot AI",
      th: "คู่มือเลือกบอท AI",
    },
    description: {
      ko: "5가지 봇의 수익률, 기간, 특징을 비교하고 나에게 맞는 봇을 선택하세요",
      en: "Compare 5 bots' returns, duration, and features to find your best fit",
      zh: "比较5种机器人的收益率、期限和特点，选择最适合你的",
      ja: "5つのボットの収益率・期間・特徴を比較して最適なボットを選択",
      vi: "So sánh lợi nhuận, thời gian và tính năng của 5 bot để chọn phù hợp nhất",
      th: "เปรียบเทียบผลตอบแทน ระยะเวลา และคุณสมบัติของ 5 บอท",
    },
    tooltip: {
      ko: "Sprint(7일) → Catalyst(90일) 까지 5가지 봇 비교 분석",
      en: "Compare 5 bots from Sprint(7d) to Catalyst(90d)",
      zh: "从Sprint(7天)到Catalyst(90天)5种机器人对比",
      ja: "Sprint(7日)〜Catalyst(90日)の5ボット比較",
      vi: "So sánh 5 bot từ Sprint(7 ngày) đến Catalyst(90 ngày)",
      th: "เปรียบเทียบ 5 บอท จาก Sprint(7วัน) ถึง Catalyst(90วัน)",
    },
    category: "intermediate",
    steps: [
      {
        title: { ko: "Sprint Bot (7일)", en: "Sprint Bot (7 days)", zh: "Sprint Bot (7天)", ja: "Sprint Bot (7日)", vi: "Sprint Bot (7 ngày)", th: "Sprint Bot (7 วัน)" },
        desc: { ko: "최소 $100, 일일 0.8~1.2%, 7일 만기. 빠른 회전을 원하는 분에게 추천.", en: "Min $100, 0.8~1.2% daily, 7-day term. Best for quick rotation.", zh: "最低$100，日收益0.8~1.2%，7天期限。适合快速周转。", ja: "最低$100、日次0.8~1.2%、7日間。速い回転向け。", vi: "Tối thiểu $100, 0.8~1.2%/ngày, 7 ngày. Phù hợp quay vòng nhanh.", th: "ขั้นต่ำ $100, 0.8~1.2%/วัน, 7 วัน เหมาะกับการหมุนเร็ว" },
      },
      {
        title: { ko: "Velocity Bot (14일)", en: "Velocity Bot (14 days)", zh: "Velocity Bot (14天)", ja: "Velocity Bot (14日)", vi: "Velocity Bot (14 ngày)", th: "Velocity Bot (14 วัน)" },
        desc: { ko: "최소 $300, 일일 0.9~1.4%, 14일 만기. 안정성과 수익의 균형.", en: "Min $300, 0.9~1.4% daily, 14-day term. Balance of stability and returns.", zh: "最低$300，日收益0.9~1.4%，14天。稳定与收益的平衡。", ja: "最低$300、日次0.9~1.4%、14日間。安定と収益のバランス。", vi: "Tối thiểu $300, 0.9~1.4%/ngày, 14 ngày. Cân bằng ổn định và lợi nhuận.", th: "ขั้นต่ำ $300, 0.9~1.4%/วัน, 14 วัน สมดุลความมั่นคงและผลตอบแทน" },
      },
      {
        title: { ko: "Quantum Bot (60일)", en: "Quantum Bot (60 days)", zh: "Quantum Bot (60天)", ja: "Quantum Bot (60日)", vi: "Quantum Bot (60 ngày)", th: "Quantum Bot (60 วัน)" },
        desc: { ko: "최소 $1,000, 일일 1.0~1.8%, 60일 만기. 높은 수익률을 원하는 중급 투자자.", en: "Min $1,000, 1.0~1.8% daily, 60-day term. For intermediate investors seeking higher returns.", zh: "最低$1,000，日收益1.0~1.8%，60天。适合追求高收益的中级投资者。", ja: "最低$1,000、日次1.0~1.8%、60日間。高収益を求める中級投資家向け。", vi: "Tối thiểu $1,000, 1.0~1.8%/ngày, 60 ngày. Cho nhà đầu tư trung cấp.", th: "ขั้นต่ำ $1,000, 1.0~1.8%/วัน, 60 วัน สำหรับนักลงทุนระดับกลาง" },
      },
    ],
  },
  {
    id: "tut-3",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Wallet size={16} style={{ color: "#22c55e" }} />,
    title: {
      ko: "수익 출금 방법 (USDT → 거래소)",
      en: "How to Withdraw Profits (USDT → Exchange)",
      zh: "收益提现方法 (USDT → 交易所)",
      ja: "利益出金方法 (USDT → 取引所)",
      vi: "Cách rút lợi nhuận (USDT → Sàn giao dịch)",
      th: "วิธีถอนกำไร (USDT → ตลาด)",
    },
    description: {
      ko: "XPLAY에서 수익을 출금하고 거래소를 통해 현금화하는 전체 과정",
      en: "Complete process of withdrawing profits from XPLAY and cashing out via exchange",
      zh: "从XPLAY提现收益并通过交易所兑现的完整流程",
      ja: "XPLAYから利益を出金し取引所で現金化する全プロセス",
      vi: "Quy trình hoàn chỉnh rút lợi nhuận từ XPLAY và rút tiền qua sàn",
      th: "ขั้นตอนทั้งหมดในการถอนกำไรจาก XPLAY และแลกเงินผ่านตลาด",
    },
    tooltip: {
      ko: "출금 요청 후 평균 2시간 이내 처리! 수수료 및 주의사항 안내",
      en: "Processed within ~2 hours! Fee info and tips included",
      zh: "平均2小时内处理！含手续费和注意事项",
      ja: "平均2時間以内に処理！手数料と注意事項",
      vi: "Xử lý trong ~2 giờ! Bao gồm phí và lưu ý",
      th: "ดำเนินการภายใน ~2 ชั่วโมง! รวมค่าธรรมเนียมและข้อควรระวัง",
    },
    category: "beginner",
    steps: [
      {
        title: { ko: "1. 출금 요청", en: "1. Request Withdrawal", zh: "1. 申请提现", ja: "1. 出金申請", vi: "1. Yêu cầu rút tiền", th: "1. ขอถอนเงิน" },
        desc: { ko: "XPLAY 대시보드에서 출금 버튼을 클릭하고 금액을 입력합니다.", en: "Click withdraw button on XPLAY dashboard and enter the amount.", zh: "在XPLAY仪表板点击提现按钮并输入金额。", ja: "XPLAYダッシュボードで出金ボタンをクリックし金額を入力。", vi: "Nhấn nút rút tiền trên bảng điều khiển XPLAY và nhập số tiền.", th: "คลิกปุ่มถอนเงินบนแดชบอร์ด XPLAY และใส่จำนวนเงิน" },
      },
      {
        title: { ko: "2. 지갑으로 수령", en: "2. Receive to Wallet", zh: "2. 钱包收款", ja: "2. ウォレットで受取", vi: "2. Nhận vào ví", th: "2. รับเข้ากระเป๋า" },
        desc: { ko: "평균 2시간 이내에 TokenPocket 지갑으로 USDT가 입금됩니다.", en: "USDT arrives in your TokenPocket wallet within ~2 hours on average.", zh: "平均2小时内USDT到达TokenPocket钱包。", ja: "平均2時間以内にTokenPocketウォレットにUSDT着金。", vi: "USDT đến ví TokenPocket trong ~2 giờ.", th: "USDT เข้ากระเป๋า TokenPocket ภายใน ~2 ชั่วโมง" },
      },
      {
        title: { ko: "3. 거래소로 전송 & 현금화", en: "3. Transfer to Exchange & Cash Out", zh: "3. 转到交易所 & 兑现", ja: "3. 取引所へ送金 & 現金化", vi: "3. Chuyển sang sàn & Rút tiền", th: "3. โอนไปตลาด & แลกเงิน" },
        desc: { ko: "Binance, Upbit 등 거래소로 USDT를 전송하고 원하는 통화로 환전합니다.", en: "Transfer USDT to Binance, Upbit etc. and convert to your preferred currency.", zh: "将USDT转到Binance、Upbit等交易所并兑换成所需货币。", ja: "Binance、Upbit等にUSDTを送金し希望の通貨に換金。", vi: "Chuyển USDT sang Binance, Upbit và đổi sang tiền tệ mong muốn.", th: "โอน USDT ไป Binance, Upbit แล้วแลกเป็นสกุลเงินที่ต้องการ" },
      },
    ],
  },
  {
    id: "tut-4",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Share2 size={16} style={{ color: "#f59e0b" }} />,
    title: {
      ko: "레퍼럴 시스템 활용법 (6세대 보너스)",
      en: "Referral System Guide (6-Gen Bonus)",
      zh: "推荐系统使用指南（6代奖金）",
      ja: "リファラルシステム活用法（6世代ボーナス）",
      vi: "Hướng dẫn hệ thống giới thiệu (Thưởng 6 thế hệ)",
      th: "คู่มือระบบแนะนำ (โบนัส 6 รุ่น)",
    },
    description: {
      ko: "1세대 직접 추천 10% + 2~6세대 팀 보너스로 패시브 인컴 극대화",
      en: "Maximize passive income with 10% direct referral + 2-6 gen team bonus",
      zh: "通过10%直接推荐+2-6代团队奖金最大化被动收入",
      ja: "10%直接紹介+2~6世代チームボーナスでパッシブインカム最大化",
      vi: "Tối đa thu nhập thụ động với 10% giới thiệu trực tiếp + thưởng đội 2-6 thế hệ",
      th: "เพิ่มรายได้ passive สูงสุดด้วย 10% แนะนำตรง + โบนัสทีม 2-6 รุ่น",
    },
    tooltip: {
      ko: "1세대 10% 직접 보너스 + 2~6세대 팀 배분 80%에서 추가 수익",
      en: "10% direct bonus + additional earnings from 80% team distribution",
      zh: "10%直接奖金+80%团队分配的额外收益",
      ja: "10%直接ボーナス+80%チーム配分から追加収益",
      vi: "10% thưởng trực tiếp + thu nhập thêm từ 80% phân phối đội",
      th: "โบนัสตรง 10% + รายได้เพิ่มจาก 80% การกระจายทีม",
    },
    category: "advanced",
    steps: [
      {
        title: { ko: "1세대 직접 추천 보너스 10%", en: "1st Gen Direct Referral 10%", zh: "第1代直接推荐10%", ja: "1世代直接紹介10%", vi: "Thế hệ 1 giới thiệu trực tiếp 10%", th: "รุ่นที่ 1 แนะนำตรง 10%" },
        desc: { ko: "직접 추천한 사람의 투자금에서 10%를 즉시 보너스로 받습니다.", en: "Receive 10% instant bonus from your direct referral's investment.", zh: "从直接推荐人的投资中获得10%即时奖金。", ja: "直接紹介者の投資額から10%を即時ボーナスで受取。", vi: "Nhận 10% thưởng ngay từ đầu tư của người được giới thiệu trực tiếp.", th: "รับโบนัสทันที 10% จากการลงทุนของผู้ที่แนะนำตรง" },
      },
      {
        title: { ko: "2~6세대 팀 보너스", en: "2nd~6th Gen Team Bonus", zh: "2~6代团队奖金", ja: "2~6世代チームボーナス", vi: "Thưởng đội 2~6 thế hệ", th: "โบนัสทีม รุ่น 2~6" },
        desc: { ko: "2세대부터 6세대까지 팀 배분 80%에서 추가 보너스를 받습니다.", en: "Earn additional bonuses from 80% team distribution across generations 2-6.", zh: "从2-6代80%团队分配中获得额外奖金。", ja: "2~6世代の80%チーム配分から追加ボーナス。", vi: "Nhận thưởng thêm từ 80% phân phối đội qua thế hệ 2-6.", th: "รับโบนัสเพิ่มจาก 80% การกระจายทีมรุ่น 2-6" },
      },
      {
        title: { ko: "효과적인 공유 전략", en: "Effective Sharing Strategy", zh: "有效分享策略", ja: "効果的な共有戦略", vi: "Chiến lược chia sẻ hiệu quả", th: "กลยุทธ์แชร์ที่มีประสิทธิภาพ" },
        desc: { ko: "카카오톡, 텔레그램, 왓츠앱 등에서 이 페이지를 공유하세요.", en: "Share this page via KakaoTalk, Telegram, WhatsApp.", zh: "通过KakaoTalk、Telegram、WhatsApp分享此页面。", ja: "KakaoTalk、Telegram、WhatsAppでこのページを共有。", vi: "Chia sẻ trang này qua KakaoTalk, Telegram, WhatsApp.", th: "แชร์หน้านี้ผ่าน KakaoTalk Telegram WhatsApp" },
      },
    ],
  },
  {
    id: "tut-5",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Gamepad2 size={16} style={{ color: "#ef4444" }} />,
    title: {
      ko: "BTC 예측 게임 플레이 방법",
      en: "How to Play BTC Prediction Game",
      zh: "BTC预测游戏玩法",
      ja: "BTC予測ゲームのプレイ方法",
      vi: "Cách chơi game dự đoán BTC",
      th: "วิธีเล่นเกมทำนาย BTC",
    },
    description: {
      ko: "30초/1분/5분 라운드에서 BTC 가격 방향을 예측하고 수익을 얻는 방법",
      en: "Predict BTC price direction in 30s/1m/5m rounds and earn profits",
      zh: "在30秒/1分钟/5分钟回合中预测BTC价格方向并获利",
      ja: "30秒/1分/5分ラウンドでBTC価格方向を予測して利益を獲得",
      vi: "Dự đoán hướng giá BTC trong vòng 30s/1p/5p và kiếm lợi nhuận",
      th: "ทำนายทิศทางราคา BTC ในรอบ 30 วินาที/1 นาที/5 นาที และทำกำไร",
    },
    tooltip: {
      ko: "30초 라운드부터 시작! 최소 $5 베팅, 맞추면 1.9배 수령",
      en: "Start with 30s rounds! Min $5 bet, win ~1.9x payout",
      zh: "从30秒回合开始！最低$5，赢得1.9倍",
      ja: "30秒ラウンドから！最低$5、的中で1.9倍",
      vi: "Bắt đầu từ vòng 30s! Tối thiểu $5, thắng ~1.9 lần",
      th: "เริ่มจากรอบ 30 วินาที! ขั้นต่ำ $5 ชนะได้ ~1.9 เท่า",
    },
    category: "beginner",
    steps: [
      {
        title: { ko: "1. 게임 라운드 선택", en: "1. Choose Game Round", zh: "1. 选择游戏回合", ja: "1. ゲームラウンド選択", vi: "1. Chọn vòng chơi", th: "1. เลือกรอบเกม" },
        desc: { ko: "30초, 1분, 5분 중 원하는 라운드를 선택합니다.", en: "Choose from 30s, 1m, or 5m rounds.", zh: "选择30秒、1分钟或5分钟回合。", ja: "30秒、1分、5分から選択。", vi: "Chọn vòng 30s, 1p hoặc 5p.", th: "เลือกรอบ 30 วินาที 1 นาที หรือ 5 นาที" },
      },
      {
        title: { ko: "2. UP 또는 DOWN 베팅", en: "2. Bet UP or DOWN", zh: "2. 押涨或跌", ja: "2. UPまたはDOWNに賭ける", vi: "2. Đặt cược TĂNG hoặc GIẢM", th: "2. เดิมพัน ขึ้น หรือ ลง" },
        desc: { ko: "BTC 가격이 올라갈지(UP) 내려갈지(DOWN) 예측하고 최소 $5부터 베팅합니다.", en: "Predict if BTC price goes UP or DOWN and bet from minimum $5.", zh: "预测BTC价格涨还是跌，最低$5下注。", ja: "BTC価格がUPかDOWNか予測し最低$5から。", vi: "Dự đoán giá BTC tăng hay giảm, đặt cược từ $5.", th: "ทำนายว่าราคา BTC จะขึ้นหรือลง เดิมพันตั้งแต่ $5" },
      },
      {
        title: { ko: "3. 결과 확인 & 수익 수령", en: "3. Check Results & Collect Profits", zh: "3. 查看结果 & 领取收益", ja: "3. 結果確認 & 利益受取", vi: "3. Xem kết quả & Nhận lợi nhuận", th: "3. ดูผลลัพธ์ & รับกำไร" },
        desc: { ko: "라운드 종료 후 자동으로 결과가 표시됩니다. 맞추면 약 1.9배를 수령합니다.", en: "Results shown automatically after round ends. Win ~1.9x your bet.", zh: "回合结束后自动显示结果。赢得约1.9倍。", ja: "ラウンド終了後自動で結果表示。的中で約1.9倍。", vi: "Kết quả hiển thị tự động. Thắng ~1.9 lần.", th: "ผลลัพธ์แสดงอัตโนมัติ ชนะได้ ~1.9 เท่า" },
      },
    ],
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: {
      ko: "XPLAY는 안전한가요? 자금은 어떻게 보호되나요?",
      en: "Is XPLAY safe? How are funds protected?",
      zh: "XPLAY安全吗？资金如何保护？",
      ja: "XPLAYは安全ですか？資金はどう保護されますか？",
      vi: "XPLAY có an toàn không? Tiền được bảo vệ thế nào?",
      th: "XPLAY ปลอดภัยไหม? เงินถูกปกป้องอย่างไร?",
    },
    answer: {
      ko: "XPLAY는 Polygon 블록체인 기반 스마트 컨트랙트로 운영되며, 모든 거래가 온체인에 기록됩니다. 자금은 스마트 컨트랙트에 안전하게 보관되고, 출금은 사용자 본인만 가능합니다. 제3자 감사(Audit)를 통해 보안이 검증되었습니다.",
      en: "XPLAY operates on Polygon blockchain smart contracts with all transactions recorded on-chain. Funds are securely held in smart contracts, and only users can withdraw their own funds. Security has been verified through third-party audits.",
      zh: "XPLAY基于Polygon区块链智能合约运行，所有交易记录在链上。资金安全保管在智能合约中，只有用户本人可以提现。已通过第三方审计验证安全性。",
      ja: "XPLAYはPolygonブロックチェーンのスマートコントラクトで運営され、全取引がオンチェーンに記録されます。資金はスマートコントラクトに安全に保管され、出金はユーザー本人のみ可能です。",
      vi: "XPLAY hoạt động trên smart contract Polygon blockchain, mọi giao dịch được ghi trên chain. Tiền được giữ an toàn trong smart contract, chỉ người dùng mới có thể rút tiền của mình.",
      th: "XPLAY ทำงานบน smart contract Polygon blockchain ทุกธุรกรรมบันทึกบน chain เงินถูกเก็บอย่างปลอดภัยใน smart contract เฉพาะผู้ใช้เท่านั้นที่ถอนเงินได้",
    },
  },
  {
    question: {
      ko: "최소 투자 금액은 얼마인가요?",
      en: "What is the minimum investment amount?",
      zh: "最低投资金额是多少？",
      ja: "最低投資額はいくらですか？",
      vi: "Số tiền đầu tư tối thiểu là bao nhiêu?",
      th: "จำนวนเงินลงทุนขั้นต่ำเท่าไหร่?",
    },
    answer: {
      ko: "Sprint Bot 기준 최소 $100 USDT부터 시작할 수 있습니다. 봇별로 최소 금액이 다릅니다: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000). 소액으로 시작하여 수익을 확인한 후 증액하는 것을 권장합니다.",
      en: "You can start from $100 USDT with Sprint Bot. Minimum varies by bot: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000). We recommend starting small and increasing after verifying returns.",
      zh: "Sprint Bot最低$100 USDT起。各机器人最低金额不同：Sprint($100)、Velocity($300)、Momentum($500)、Quantum($1,000)、Catalyst($2,000)。建议先小额试水再增加。",
      ja: "Sprint Botなら最低$100 USDTから。ボット別最低額：Sprint($100)、Velocity($300)、Momentum($500)、Quantum($1,000)、Catalyst($2,000)。少額から始めて確認後に増額推奨。",
      vi: "Bắt đầu từ $100 USDT với Sprint Bot. Tối thiểu khác nhau: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000).",
      th: "เริ่มจาก $100 USDT กับ Sprint Bot ขั้นต่ำต่างกัน: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000)",
    },
  },
  {
    question: {
      ko: "출금은 얼마나 걸리나요?",
      en: "How long does withdrawal take?",
      zh: "提现需要多长时间？",
      ja: "出金にはどのくらいかかりますか？",
      vi: "Rút tiền mất bao lâu?",
      th: "ถอนเงินใช้เวลานานเท่าไหร่?",
    },
    answer: {
      ko: "출금 요청 후 평균 2시간 이내에 처리됩니다. Polygon 네트워크의 빠른 트랜잭션 속도 덕분에 대부분 1시간 이내에 완료됩니다. 네트워크 혼잡 시 최대 24시간까지 소요될 수 있습니다.",
      en: "Withdrawals are processed within ~2 hours on average. Thanks to Polygon's fast transaction speed, most complete within 1 hour. During network congestion, it may take up to 24 hours.",
      zh: "提现平均2小时内处理。得益于Polygon的快速交易速度，大多数1小时内完成。网络拥堵时最多24小时。",
      ja: "出金は平均2時間以内に処理。Polygonの高速トランザクションにより大半は1時間以内。ネットワーク混雑時は最大24時間。",
      vi: "Rút tiền được xử lý trong ~2 giờ. Nhờ tốc độ nhanh của Polygon, hầu hết hoàn thành trong 1 giờ.",
      th: "ถอนเงินดำเนินการภายใน ~2 ชั่วโมง ด้วยความเร็วของ Polygon ส่วนใหญ่เสร็จภายใน 1 ชั่วโมง",
    },
  },
  {
    question: {
      ko: "레퍼럴 보너스는 어떻게 작동하나요?",
      en: "How does the referral bonus work?",
      zh: "推荐奖金如何运作？",
      ja: "リファラルボーナスはどう機能しますか？",
      vi: "Thưởng giới thiệu hoạt động thế nào?",
      th: "โบนัสแนะนำทำงานอย่างไร?",
    },
    answer: {
      ko: "1세대 직접 추천 시 해당 투자금의 10%를 즉시 보너스로 받습니다. 2~6세대까지는 팀 배분 80%에서 단계별 보너스가 지급됩니다. 네트워크가 커질수록 패시브 인컴이 기하급수적으로 증가합니다.",
      en: "You receive 10% instant bonus from 1st generation direct referrals. Generations 2-6 earn stepped bonuses from the 80% team distribution. Passive income grows exponentially as your network expands.",
      zh: "第1代直接推荐获得10%即时奖金。2-6代从80%团队分配中获得阶梯奖金。网络越大被动收入指数增长。",
      ja: "1世代直接紹介で投資額の10%を即時ボーナス。2~6世代は80%チーム配分から段階的ボーナス。ネットワーク拡大でパッシブインカムが指数関数的に増加。",
      vi: "Nhận 10% thưởng ngay từ giới thiệu trực tiếp thế hệ 1. Thế hệ 2-6 nhận thưởng từ 80% phân phối đội.",
      th: "รับโบนัสทันที 10% จากแนะนำตรงรุ่นที่ 1 รุ่น 2-6 รับโบนัสจาก 80% การกระจายทีม",
    },
  },
  {
    question: {
      ko: "BTC 예측 게임에서 잃으면 어떻게 되나요?",
      en: "What happens if I lose in the BTC prediction game?",
      zh: "BTC预测游戏输了怎么办？",
      ja: "BTC予測ゲームで負けたらどうなりますか？",
      vi: "Nếu thua trong game dự đoán BTC thì sao?",
      th: "ถ้าแพ้ในเกมทำนาย BTC จะเป็นอย่างไร?",
    },
    answer: {
      ko: "예측이 틀리면 해당 라운드의 베팅 금액을 잃게 됩니다. 하지만 수수료 5%를 제외한 풀의 95%가 승자에게 배분되므로 공정한 구조입니다. 소액($5)부터 시작하여 감을 익히는 것을 권장합니다.",
      en: "If your prediction is wrong, you lose the bet amount for that round. However, 95% of the pool (minus 5% fee) is distributed to winners, making it a fair structure. Start with small amounts ($5) to learn.",
      zh: "预测错误会失去该回合的投注金额。但扣除5%手续费后95%分配给赢家，结构公平。建议从小额($5)开始熟悉。",
      ja: "予測が外れるとそのラウンドの賭け金を失います。ただし手数料5%を除くプールの95%が勝者に配分される公正な構造。少額($5)から始めて慣れることを推奨。",
      vi: "Nếu dự đoán sai, bạn mất tiền đặt cược vòng đó. Nhưng 95% pool (trừ 5% phí) được chia cho người thắng.",
      th: "ถ้าทำนายผิด จะเสียเงินเดิมพันรอบนั้น แต่ 95% ของ pool (หัก 5% ค่าธรรมเนียม) แจกให้ผู้ชนะ",
    },
  },
  {
    question: {
      ko: "XPLAY를 시작하려면 어떤 지갑이 필요한가요?",
      en: "What wallet do I need to start with XPLAY?",
      zh: "开始使用XPLAY需要什么钱包？",
      ja: "XPLAYを始めるにはどのウォレットが必要ですか？",
      vi: "Cần ví gì để bắt đầu với XPLAY?",
      th: "ต้องใช้กระเป๋าอะไรเพื่อเริ่มใช้ XPLAY?",
    },
    answer: {
      ko: "TokenPocket 지갑을 권장합니다. dApp 브라우저가 내장되어 있어 XPLAY에 바로 접속할 수 있습니다. Polygon 네트워크를 지원하는 다른 지갑(MetaMask 등)도 사용 가능하지만, TokenPocket이 가장 편리합니다.",
      en: "We recommend TokenPocket wallet. It has a built-in dApp browser for direct XPLAY access. Other wallets supporting Polygon (like MetaMask) also work, but TokenPocket is the most convenient.",
      zh: "推荐TokenPocket钱包。内置dApp浏览器可直接访问XPLAY。支持Polygon的其他钱包（如MetaMask）也可用，但TokenPocket最方便。",
      ja: "TokenPocketウォレットを推奨。dAppブラウザ内蔵でXPLAYに直接アクセス可能。Polygon対応の他ウォレット（MetaMask等）も使用可能ですがTokenPocketが最も便利。",
      vi: "Khuyến nghị ví TokenPocket. Có trình duyệt dApp tích hợp để truy cập XPLAY trực tiếp.",
      th: "แนะนำกระเป๋า TokenPocket มีเบราว์เซอร์ dApp ในตัวเข้า XPLAY ได้โดยตรง",
    },
  },
];

const CATEGORIES = [
  { key: "all", label: { ko: "전체", en: "All", zh: "全部", ja: "すべて", vi: "Tất cả", th: "ทั้งหมด" } },
  { key: "beginner", label: { ko: "초급", en: "Beginner", zh: "初级", ja: "初級", vi: "Cơ bản", th: "เริ่มต้น" } },
  { key: "intermediate", label: { ko: "중급", en: "Intermediate", zh: "中级", ja: "中級", vi: "Trung cấp", th: "ระดับกลาง" } },
  { key: "advanced", label: { ko: "고급", en: "Advanced", zh: "高级", ja: "上級", vi: "Nâng cao", th: "ขั้นสูง" } },
];

const TAB_ITEMS = [
  { key: "tutorials", icon: <BookOpen size={14} />, label: { ko: "튜토리얼", en: "Tutorials", zh: "教程", ja: "チュートリアル", vi: "Hướng dẫn", th: "บทเรียน" } },
  { key: "faq", icon: <MessageCircleQuestion size={14} />, label: { ko: "자주 묻는 질문", en: "FAQ", zh: "常见问题", ja: "よくある質問", vi: "Câu hỏi thường gặp", th: "คำถามที่พบบ่อย" } },
];

export default function TutorialSection() {
  const { t, lang } = useApp();
  const [activeTab, setActiveTab] = useState("tutorials");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

      {/* Tab Switcher: Tutorials / FAQ */}
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
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  onMouseEnter={() => setHoveredId(video.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {hoveredId === video.id && (
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
                        {getLocalizedText(video.tooltip)}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    style={{
                      background: "rgba(10,14,26,0.8)",
                      border: `1px solid ${hoveredId === video.id ? "rgba(0,245,255,0.25)" : "rgba(0,245,255,0.1)"}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "border-color 0.3s",
                    }}
                  >
                    {/* Video Player / Thumbnail */}
                    {playingId === video.id ? (
                      <div className="relative" style={{ paddingBottom: "56.25%" }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                          title={getLocalizedText(video.title)}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
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
                          {video.icon}
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

                      {/* Category + YouTube Link + Expand */}
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

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank")}
                            className="flex items-center gap-1 text-[10px]"
                            style={{ color: "rgba(226,232,240,0.4)" }}
                          >
                            <ExternalLink size={10} />
                            YouTube
                          </button>

                          <button
                            onClick={() => setExpandedId(expandedId === video.id ? null : video.id)}
                            className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full transition-all"
                            style={{
                              background: expandedId === video.id ? "rgba(0,245,255,0.1)" : "rgba(255,255,255,0.04)",
                              color: expandedId === video.id ? "#00f5ff" : "rgba(226,232,240,0.5)",
                              border: `1px solid ${expandedId === video.id ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                            }}
                          >
                            <BookOpen size={10} />
                            {expandedId === video.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                          </button>
                        </div>
                      </div>

                      {/* Step-by-Step Guide (Expandable) */}
                      <AnimatePresence>
                        {expandedId === video.id && (
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
                              {video.steps.map((step, idx) => (
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
        </>
      )}

      {/* ===== FAQ TAB ===== */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div
                style={{
                  background: "rgba(10,14,26,0.8)",
                  border: `1px solid ${expandedFaqId === idx ? "rgba(0,245,255,0.25)" : "rgba(0,245,255,0.1)"}`,
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "border-color 0.3s",
                }}
              >
                <button
                  onClick={() => setExpandedFaqId(expandedFaqId === idx ? null : idx)}
                  className="w-full flex items-center gap-3 p-4 text-left"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: expandedFaqId === idx ? "rgba(0,245,255,0.15)" : "rgba(0,245,255,0.06)",
                      border: `1px solid ${expandedFaqId === idx ? "rgba(0,245,255,0.3)" : "rgba(0,245,255,0.1)"}`,
                      transition: "all 0.3s",
                    }}
                  >
                    <HelpCircle size={14} style={{ color: expandedFaqId === idx ? "#00f5ff" : "rgba(0,245,255,0.5)" }} />
                  </div>
                  <span
                    className="flex-1 text-sm font-medium"
                    style={{
                      color: expandedFaqId === idx ? "#e2e8f0" : "rgba(226,232,240,0.7)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {getLocalizedText(faq.question)}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaqId === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={16} style={{ color: "rgba(226,232,240,0.4)" }} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedFaqId === idx && (
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
                          {getLocalizedText(faq.answer)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
