/*
 * TutorialSection — XPLAY Usage Tutorials
 * Each tutorial has: YouTube video + step-by-step guide text
 * Categories: Getting Started, Bot Selection, Withdrawal, Referral, Prediction Game
 * Videos can be updated via Telegram bot (future feature)
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ExternalLink, BookOpen, ChevronDown, ChevronUp, Smartphone, Wallet, Users, Gamepad2, ArrowDownToLine } from "lucide-react";

interface TutorialStep {
  title: Record<string, string>;
  desc: Record<string, string>;
}

interface TutorialVideo {
  id: string;
  youtubeId: string;
  icon: React.ReactNode;
  title: Record<string, string>;
  description: Record<string, string>;
  category: string;
  steps: TutorialStep[];
}

// Actual XPLAY tutorial videos with step-by-step guides
const TUTORIAL_VIDEOS: TutorialVideo[] = [
  {
    id: "tut-1",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Smartphone size={16} style={{ color: "#00f5ff" }} />,
    title: {
      ko: "XPLAY 시작 가이드 — 회원가입부터 첫 투자까지",
      en: "Getting Started — From Registration to First Investment",
      zh: "入门指南 — 从注册到首次投资",
      ja: "スタートガイド — 登録から初投資まで",
      vi: "Bắt đầu — Từ đăng ký đến đầu tư đầu tiên",
      th: "เริ่มต้น — จากสมัครถึงลงทุนครั้งแรก",
    },
    description: {
      ko: "TokenPocket 설치부터 XPLAY 계정 생성, 레퍼럴 등록, 첫 스테이킹까지 완벽 가이드",
      en: "Complete guide: Install TokenPocket, create XPLAY account, register referral, first staking",
      zh: "完整指南：安装TokenPocket、创建XPLAY账户、注册推荐、首次质押",
      ja: "完全ガイド：TokenPocketインストール、XPLAY口座開設、紹介登録、初回ステーキング",
      vi: "Hướng dẫn đầy đủ: Cài TokenPocket, tạo tài khoản, đăng ký giới thiệu, stake đầu tiên",
      th: "คู่มือฉบับสมบูรณ์: ติดตั้ง TokenPocket สร้างบัญชี สมัครแนะนำ stake ครั้งแรก",
    },
    category: "beginner",
    steps: [
      {
        title: { ko: "1. TokenPocket 앱 설치", en: "1. Install TokenPocket App", zh: "1. 安装TokenPocket应用", ja: "1. TokenPocketアプリをインストール", vi: "1. Cài đặt ứng dụng TokenPocket", th: "1. ติดตั้งแอป TokenPocket" },
        desc: { ko: "App Store 또는 Google Play에서 TokenPocket을 검색하여 설치합니다. 공식 앱만 사용하세요.", en: "Search and install TokenPocket from App Store or Google Play. Use only the official app.", zh: "在App Store或Google Play搜索安装TokenPocket。仅使用官方应用。", ja: "App StoreまたはGoogle PlayでTokenPocketを検索してインストール。公式アプリのみ使用。", vi: "Tìm và cài đặt TokenPocket từ App Store hoặc Google Play. Chỉ dùng app chính thức.", th: "ค้นหาและติดตั้ง TokenPocket จาก App Store หรือ Google Play ใช้แอปทางการเท่านั้น" },
      },
      {
        title: { ko: "2. Polygon 지갑 생성", en: "2. Create Polygon Wallet", zh: "2. 创建Polygon钱包", ja: "2. Polygonウォレットを作成", vi: "2. Tạo ví Polygon", th: "2. สร้างกระเป๋า Polygon" },
        desc: { ko: "TokenPocket에서 Polygon(MATIC) 네트워크를 선택하고 새 지갑을 생성합니다. 시드 구문을 안전하게 백업하세요.", en: "Select Polygon (MATIC) network in TokenPocket and create a new wallet. Safely backup your seed phrase.", zh: "在TokenPocket中选择Polygon(MATIC)网络并创建新钱包。安全备份助记词。", ja: "TokenPocketでPolygon(MATIC)ネットワークを選択し新しいウォレットを作成。シードフレーズを安全にバックアップ。", vi: "Chọn mạng Polygon (MATIC) trong TokenPocket và tạo ví mới. Sao lưu cụm từ khôi phục an toàn.", th: "เลือกเครือข่าย Polygon (MATIC) ใน TokenPocket และสร้างกระเป๋าใหม่ สำรอง seed phrase อย่างปลอดภัย" },
      },
      {
        title: { ko: "3. XPLAY dApp 접속", en: "3. Access XPLAY dApp", zh: "3. 访问XPLAY dApp", ja: "3. XPLAY dAppにアクセス", vi: "3. Truy cập XPLAY dApp", th: "3. เข้าถึง XPLAY dApp" },
        desc: { ko: "TokenPocket 내 dApp 브라우저에서 app.xplaybot.com을 입력하여 접속합니다.", en: "Enter app.xplaybot.com in TokenPocket's dApp browser to access.", zh: "在TokenPocket的dApp浏览器中输入app.xplaybot.com访问。", ja: "TokenPocketのdAppブラウザでapp.xplaybot.comにアクセス。", vi: "Nhập app.xplaybot.com trong trình duyệt dApp của TokenPocket.", th: "พิมพ์ app.xplaybot.com ในเบราว์เซอร์ dApp ของ TokenPocket" },
      },
      {
        title: { ko: "4. 레퍼럴 등록 & 첫 스테이킹", en: "4. Register Referral & First Staking", zh: "4. 注册推荐 & 首次质押", ja: "4. 紹介登録 & 初回ステーキング", vi: "4. Đăng ký giới thiệu & Stake đầu tiên", th: "4. สมัครแนะนำ & Stake ครั้งแรก" },
        desc: { ko: "추천인 링크로 접속했다면 자동 등록됩니다. 원하는 봇을 선택하고 USDT를 스테이킹하세요.", en: "If you accessed via referral link, it's auto-registered. Choose your bot and stake USDT.", zh: "如果通过推荐链接访问，会自动注册。选择机器人并质押USDT。", ja: "紹介リンクからアクセスした場合は自動登録。ボットを選択しUSDTをステーキング。", vi: "Nếu truy cập qua link giới thiệu, tự động đăng ký. Chọn bot và stake USDT.", th: "หากเข้าผ่านลิงก์แนะนำ จะลงทะเบียนอัตโนมัติ เลือกบอทและ stake USDT" },
      },
    ],
  },
  {
    id: "tut-2",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Wallet size={16} style={{ color: "#a855f7" }} />,
    title: {
      ko: "봇 선택 가이드 — Sprint vs Velocity vs Quantum",
      en: "Bot Selection Guide — Sprint vs Velocity vs Quantum",
      zh: "机器人选择指南 — Sprint vs Velocity vs Quantum",
      ja: "ボット選択ガイド — Sprint vs Velocity vs Quantum",
      vi: "Hướng dẫn chọn Bot — Sprint vs Velocity vs Quantum",
      th: "คู่มือเลือก Bot — Sprint vs Velocity vs Quantum",
    },
    description: {
      ko: "각 봇의 수익률, 잠금 기간, 리스크를 비교하여 나에게 맞는 봇을 선택하세요",
      en: "Compare each bot's returns, lock periods, and risks to find the right one for you",
      zh: "比较每个机器人的收益率、锁定期和风险，选择适合您的",
      ja: "各ボットの収益率、ロック期間、リスクを比較して最適なボットを選択",
      vi: "So sánh lợi nhuận, thời gian khóa và rủi ro để chọn bot phù hợp",
      th: "เปรียบเทียบผลตอบแทน ระยะเวลาล็อค และความเสี่ยงเพื่อเลือกบอทที่เหมาะ",
    },
    category: "intermediate",
    steps: [
      {
        title: { ko: "Sprint Bot (7일)", en: "Sprint Bot (7 days)", zh: "Sprint Bot (7天)", ja: "Sprint Bot (7日)", vi: "Sprint Bot (7 ngày)", th: "Sprint Bot (7 วัน)" },
        desc: { ko: "일 0.5%~0.8% 수익률, 7일 잠금. 단기 투자자에게 적합. 최소 $100부터 시작 가능.", en: "0.5%~0.8% daily, 7-day lock. Ideal for short-term investors. Min $100.", zh: "日收益0.5%~0.8%，锁定7天。适合短期投资。最低$100。", ja: "日次0.5%~0.8%、7日ロック。短期投資家向け。最低$100。", vi: "0.5%~0.8%/ngày, khóa 7 ngày. Phù hợp đầu tư ngắn hạn. Tối thiểu $100.", th: "0.5%~0.8%/วัน ล็อค 7 วัน เหมาะกับนักลงทุนระยะสั้น ขั้นต่ำ $100" },
      },
      {
        title: { ko: "Velocity Bot (30일)", en: "Velocity Bot (30 days)", zh: "Velocity Bot (30天)", ja: "Velocity Bot (30日)", vi: "Velocity Bot (30 ngày)", th: "Velocity Bot (30 วัน)" },
        desc: { ko: "일 0.8%~1.2% 수익률, 30일 잠금. 중기 투자에 최적화. 밸런스 있는 수익과 유동성.", en: "0.8%~1.2% daily, 30-day lock. Optimized for mid-term. Balanced returns and liquidity.", zh: "日收益0.8%~1.2%，锁定30天。中期投资最优。收益与流动性平衡。", ja: "日次0.8%~1.2%、30日ロック。中期投資に最適。", vi: "0.8%~1.2%/ngày, khóa 30 ngày. Tối ưu đầu tư trung hạn.", th: "0.8%~1.2%/วัน ล็อค 30 วัน เหมาะกับการลงทุนระยะกลาง" },
      },
      {
        title: { ko: "Quantum Bot (360일)", en: "Quantum Bot (360 days)", zh: "Quantum Bot (360天)", ja: "Quantum Bot (360日)", vi: "Quantum Bot (360 ngày)", th: "Quantum Bot (360 วัน)" },
        desc: { ko: "일 1.3%~1.8% 최고 수익률, 360일 잠금. 장기 투자자에게 최대 수익. 복리 효과 극대화.", en: "1.3%~1.8% daily max returns, 360-day lock. Maximum returns for long-term investors. Compound effect.", zh: "日收益1.3%~1.8%最高，锁定360天。长期投资最大收益。复利效果。", ja: "日次1.3%~1.8%最高、360日ロック。長期投資家に最大リターン。複利効果。", vi: "1.3%~1.8%/ngày cao nhất, khóa 360 ngày. Lợi nhuận tối đa cho đầu tư dài hạn.", th: "1.3%~1.8%/วัน สูงสุด ล็อค 360 วัน ผลตอบแทนสูงสุดสำหรับนักลงทุนระยะยาว" },
      },
    ],
  },
  {
    id: "tut-3",
    youtubeId: "dQw4w9WgXcQ",
    icon: <ArrowDownToLine size={16} style={{ color: "#22c55e" }} />,
    title: {
      ko: "수익 출금 방법 — USDT 출금 완벽 가이드",
      en: "Withdrawal Guide — Complete USDT Withdrawal Tutorial",
      zh: "提现指南 — 完整USDT提现教程",
      ja: "出金ガイド — USDT出金完全チュートリアル",
      vi: "Hướng dẫn rút tiền — USDT",
      th: "คู่มือถอนเงิน — USDT",
    },
    description: {
      ko: "수익 확인부터 출금 신청, 지갑으로 USDT 수령까지 전 과정을 안내합니다",
      en: "Full process from checking profits to requesting withdrawal and receiving USDT",
      zh: "从查看利润到申请提现、接收USDT的全流程",
      ja: "利益確認から出金申請、USDT受取までの全プロセス",
      vi: "Toàn bộ quy trình từ kiểm tra lợi nhuận đến rút tiền USDT",
      th: "กระบวนการทั้งหมดตั้งแต่ตรวจสอบกำไรจนถึงถอน USDT",
    },
    category: "intermediate",
    steps: [
      {
        title: { ko: "1. 수익 대시보드 확인", en: "1. Check Revenue Dashboard", zh: "1. 查看收益仪表板", ja: "1. 収益ダッシュボード確認", vi: "1. Kiểm tra bảng điều khiển doanh thu", th: "1. ตรวจสอบแดชบอร์ดรายได้" },
        desc: { ko: "XPLAY 앱에서 My Revenue 탭을 열어 현재 수익과 출금 가능 금액을 확인합니다.", en: "Open My Revenue tab in XPLAY app to check current earnings and withdrawable amount.", zh: "在XPLAY应用中打开我的收益标签，查看当前收益和可提现金额。", ja: "XPLAYアプリでMy Revenueタブを開き、現在の収益と出金可能額を確認。", vi: "Mở tab My Revenue trong ứng dụng XPLAY để kiểm tra thu nhập và số tiền có thể rút.", th: "เปิดแท็บ My Revenue ในแอป XPLAY เพื่อตรวจสอบรายได้และจำนวนที่ถอนได้" },
      },
      {
        title: { ko: "2. 출금 신청", en: "2. Request Withdrawal", zh: "2. 申请提现", ja: "2. 出金申請", vi: "2. Yêu cầu rút tiền", th: "2. ขอถอนเงิน" },
        desc: { ko: "Withdraw 버튼을 클릭하고 출금 금액을 입력합니다. 최소 출금액은 $10입니다.", en: "Click Withdraw button and enter the amount. Minimum withdrawal is $10.", zh: "点击提现按钮并输入金额。最低提现$10。", ja: "Withdrawボタンをクリックし金額を入力。最低出金額$10。", vi: "Nhấn nút Withdraw và nhập số tiền. Rút tối thiểu $10.", th: "คลิกปุ่ม Withdraw และใส่จำนวนเงิน ถอนขั้นต่ำ $10" },
      },
      {
        title: { ko: "3. USDT 수령 확인", en: "3. Confirm USDT Receipt", zh: "3. 确认USDT到账", ja: "3. USDT受取確認", vi: "3. Xác nhận nhận USDT", th: "3. ยืนยันการรับ USDT" },
        desc: { ko: "출금 처리 후 TokenPocket 지갑에서 USDT(Polygon) 잔액을 확인합니다. 보통 1~24시간 소요.", en: "After processing, check USDT (Polygon) balance in TokenPocket wallet. Usually 1-24 hours.", zh: "处理后在TokenPocket钱包查看USDT(Polygon)余额。通常1-24小时。", ja: "処理後TokenPocketウォレットでUSDT(Polygon)残高を確認。通常1~24時間。", vi: "Sau khi xử lý, kiểm tra số dư USDT (Polygon) trong ví TokenPocket. Thường 1-24 giờ.", th: "หลังจากดำเนินการ ตรวจสอบยอด USDT (Polygon) ในกระเป๋า TokenPocket ปกติ 1-24 ชั่วโมง" },
      },
    ],
  },
  {
    id: "tut-4",
    youtubeId: "dQw4w9WgXcQ",
    icon: <Users size={16} style={{ color: "#f59e0b" }} />,
    title: {
      ko: "레퍼럴 시스템 활용법 — 패시브 인컴 극대화",
      en: "Referral System — Maximize Your Passive Income",
      zh: "推荐系统 — 最大化被动收入",
      ja: "リファラルシステム — パッシブインカム最大化",
      vi: "Hệ thống giới thiệu — Tối đa hóa thu nhập thụ động",
      th: "ระบบแนะนำ — เพิ่มรายได้ Passive สูงสุด",
    },
    description: {
      ko: "6세대 추천 보너스 구조, 효과적인 공유 전략, 팀 빌딩 노하우를 알려드립니다",
      en: "6-generation referral bonus structure, effective sharing strategies, team building tips",
      zh: "6代推荐奖金结构、有效分享策略、团队建设技巧",
      ja: "6世代紹介ボーナス構造、効果的な共有戦略、チームビルディングのコツ",
      vi: "Cấu trúc thưởng 6 thế hệ, chiến lược chia sẻ hiệu quả, mẹo xây dựng đội",
      th: "โครงสร้างโบนัส 6 รุ่น กลยุทธ์แชร์ที่มีประสิทธิภาพ เคล็ดลับสร้างทีม",
    },
    category: "advanced",
    steps: [
      {
        title: { ko: "직추천 10% 보너스", en: "Direct Referral 10% Bonus", zh: "直推10%奖金", ja: "直接紹介10%ボーナス", vi: "Thưởng giới thiệu trực tiếp 10%", th: "โบนัสแนะนำตรง 10%" },
        desc: { ko: "직접 추천한 사람의 스테이킹 금액에서 10%를 즉시 보너스로 받습니다.", en: "Receive 10% instant bonus from your direct referral's staking amount.", zh: "从直接推荐人的质押金额中获得10%即时奖金。", ja: "直接紹介者のステーキング額から10%即時ボーナス。", vi: "Nhận 10% thưởng ngay từ số tiền stake của người giới thiệu trực tiếp.", th: "รับโบนัส 10% ทันทีจากยอด stake ของผู้ที่แนะนำตรง" },
      },
      {
        title: { ko: "2~6세대 팀 보너스", en: "2nd~6th Gen Team Bonus", zh: "2~6代团队奖金", ja: "2~6世代チームボーナス", vi: "Thưởng đội 2~6 thế hệ", th: "โบนัสทีม รุ่น 2~6" },
        desc: { ko: "2세대부터 6세대까지 팀 배분 80%에서 추가 보너스를 받습니다. 네트워크가 커질수록 수익 증가.", en: "Earn additional bonuses from 80% team distribution across generations 2-6. Income grows with network.", zh: "从2-6代80%团队分配中获得额外奖金。网络越大收益越多。", ja: "2~6世代の80%チーム配分から追加ボーナス。ネットワーク拡大で収益増加。", vi: "Nhận thưởng thêm từ 80% phân phối đội qua thế hệ 2-6. Thu nhập tăng theo mạng lưới.", th: "รับโบนัสเพิ่มจาก 80% การกระจายทีมรุ่น 2-6 รายได้เพิ่มตามเครือข่าย" },
      },
      {
        title: { ko: "효과적인 공유 전략", en: "Effective Sharing Strategy", zh: "有效分享策略", ja: "効果的な共有戦略", vi: "Chiến lược chia sẻ hiệu quả", th: "กลยุทธ์แชร์ที่มีประสิทธิภาพ" },
        desc: { ko: "카카오톡, 텔레그램, 왓츠앱 등에서 이 페이지를 공유하세요. 수익 구조를 설명하면 전환율이 높아집니다.", en: "Share this page via KakaoTalk, Telegram, WhatsApp. Explaining the revenue structure increases conversion.", zh: "通过KakaoTalk、Telegram、WhatsApp分享此页面。解释收益结构提高转化率。", ja: "KakaoTalk、Telegram、WhatsAppでこのページを共有。収益構造の説明で転換率UP。", vi: "Chia sẻ trang này qua KakaoTalk, Telegram, WhatsApp. Giải thích cấu trúc doanh thu tăng tỷ lệ chuyển đổi.", th: "แชร์หน้านี้ผ่าน KakaoTalk Telegram WhatsApp อธิบายโครงสร้างรายได้เพิ่มอัตราแปลง" },
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
    category: "beginner",
    steps: [
      {
        title: { ko: "1. 게임 라운드 선택", en: "1. Choose Game Round", zh: "1. 选择游戏回合", ja: "1. ゲームラウンド選択", vi: "1. Chọn vòng chơi", th: "1. เลือกรอบเกม" },
        desc: { ko: "30초, 1분, 5분 중 원하는 라운드를 선택합니다. 짧을수록 빠르고 스릴 있습니다.", en: "Choose from 30s, 1m, or 5m rounds. Shorter rounds are faster and more thrilling.", zh: "选择30秒、1分钟或5分钟回合。越短越快越刺激。", ja: "30秒、1分、5分から選択。短いほど速くスリリング。", vi: "Chọn vòng 30s, 1p hoặc 5p. Vòng ngắn hơn nhanh và hồi hộp hơn.", th: "เลือกรอบ 30 วินาที 1 นาที หรือ 5 นาที รอบสั้นเร็วและตื่นเต้นกว่า" },
      },
      {
        title: { ko: "2. UP 또는 DOWN 베팅", en: "2. Bet UP or DOWN", zh: "2. 押涨或跌", ja: "2. UPまたはDOWNに賭ける", vi: "2. Đặt cược TĂNG hoặc GIẢM", th: "2. เดิมพัน ขึ้น หรือ ลง" },
        desc: { ko: "BTC 가격이 올라갈지(UP) 내려갈지(DOWN) 예측하고 최소 $5부터 베팅합니다.", en: "Predict if BTC price goes UP or DOWN and bet from minimum $5.", zh: "预测BTC价格涨(UP)还是跌(DOWN)，最低$5下注。", ja: "BTC価格がUPかDOWNか予測し、最低$5から賭ける。", vi: "Dự đoán giá BTC tăng (UP) hay giảm (DOWN) và đặt cược từ $5.", th: "ทำนายว่าราคา BTC จะขึ้น (UP) หรือลง (DOWN) และเดิมพันตั้งแต่ $5" },
      },
      {
        title: { ko: "3. 결과 확인 & 수익 수령", en: "3. Check Results & Collect Profits", zh: "3. 查看结果 & 领取收益", ja: "3. 結果確認 & 利益受取", vi: "3. Xem kết quả & Nhận lợi nhuận", th: "3. ดูผลลัพธ์ & รับกำไร" },
        desc: { ko: "라운드 종료 후 자동으로 결과가 표시됩니다. 맞추면 베팅액의 약 1.9배를 수령합니다.", en: "Results shown automatically after round ends. Win ~1.9x your bet amount.", zh: "回合结束后自动显示结果。赢得约1.9倍投注额。", ja: "ラウンド終了後自動で結果表示。的中で賭け金の約1.9倍を獲得。", vi: "Kết quả hiển thị tự động sau vòng. Thắng ~1.9 lần số tiền đặt cược.", th: "ผลลัพธ์แสดงอัตโนมัติหลังจบรอบ ชนะได้ ~1.9 เท่าของเงินเดิมพัน" },
      },
    ],
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
                        {expandedId === video.id ? (
                          <ChevronUp size={10} />
                        ) : (
                          <ChevronDown size={10} />
                        )}
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
                            <div
                              key={idx}
                              className="flex gap-3"
                            >
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
    </SectionWrapper>
  );
}
