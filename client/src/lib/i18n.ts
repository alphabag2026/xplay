// ===================================================================
// XPLAY i18n — Multi-language support
// Core languages: ko, en, zh, ja, vi, th (full translations)
// Extended languages: fallback to English
// ===================================================================

export type CoreLang = "ko" | "en" | "zh" | "ja" | "vi" | "th";
export type Lang = CoreLang | "es" | "pt" | "fr" | "de" | "ru" | "ar" | "hi" | "id" | "ms" | "tl" | "tr" | "it" | "nl" | "pl" | "sv" | "uk" | "bn" | "my" | "km";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  zh: "中文",
  es: "Español",
  pt: "Português",
  fr: "Français",
  ko: "한국어",
  ja: "日本語",
  vi: "Tiếng Việt",
  th: "ภาษาไทย",
  de: "Deutsch",
  ru: "Русский",
  ar: "العربية",
  hi: "हिन्दी",
  id: "Bahasa Indonesia",
  ms: "Bahasa Melayu",
  tl: "Filipino",
  tr: "Türkçe",
  it: "Italiano",
  nl: "Nederlands",
  pl: "Polski",
  sv: "Svenska",
  uk: "Українська",
  bn: "বাংলা",
  my: "မြန်မာ",
  km: "ខ្មែរ",
};

// Ordered list for dropdown (Korean at 6th position)
export const LANG_ORDER: Lang[] = [
  "en", "zh", "es", "pt", "fr",
  "ko", "ja", "vi", "th", "de",
  "ru", "ar", "hi", "id", "ms",
  "tl", "tr", "it", "nl", "pl",
  "sv", "uk", "bn", "my", "km",
];

// Core languages that have full translations
export const CORE_LANGS: CoreLang[] = ["ko", "en", "zh", "ja", "vi", "th"];

/** Map extended lang to nearest core lang for fallback */
function getFallbackCoreLang(lang: Lang): CoreLang {
  if (CORE_LANGS.includes(lang as CoreLang)) return lang as CoreLang;
  // Extended languages fallback to English
  return "en";
}

const LANG_STORAGE_KEY = "xplay_lang";

/**
 * Detect language from browser navigator.language
 * Maps browser language codes to supported Lang values
 */
function detectBrowserLang(): Lang {
  const nav = navigator.language.toLowerCase();
  const langMap: Record<string, Lang> = {
    ko: "ko", zh: "zh", ja: "ja", vi: "vi", th: "th",
    es: "es", pt: "pt", fr: "fr", de: "de", ru: "ru",
    ar: "ar", hi: "hi", id: "id", ms: "ms", tl: "tl",
    tr: "tr", it: "it", nl: "nl", pl: "pl", sv: "sv",
    uk: "uk", bn: "bn", my: "my", km: "km",
  };
  for (const [prefix, lang] of Object.entries(langMap)) {
    if (nav.startsWith(prefix)) return lang;
  }
  return "en";
}

/**
 * Get default language with priority:
 * 1. URL ?lang= parameter (highest — for shared links)
 * 2. localStorage saved preference (user's previous choice)
 * 3. navigator.language auto-detection (first visit)
 */
export function getDefaultLang(): Lang {
  // 1. URL parameter — highest priority (shared links, referral links)
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get("lang");
  if (paramLang && LANG_ORDER.includes(paramLang as Lang)) {
    const lang = paramLang as Lang;
    // Save URL language to localStorage so it persists
    try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch {}
    return lang;
  }

  // 2. localStorage — user's previously selected language
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && LANG_ORDER.includes(saved as Lang)) {
      return saved as Lang;
    }
  } catch {}

  // 3. Browser language auto-detection — first visit
  const detected = detectBrowserLang();
  try { localStorage.setItem(LANG_STORAGE_KEY, detected); } catch {}
  return detected;
}

/**
 * Save language preference to localStorage
 * Called when user manually selects a language
 */
export function saveLangPreference(lang: Lang): void {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang); } catch {}
}

// ===================================================================
// Translation dictionary
// ===================================================================
export const T: Record<string, Record<CoreLang, string>> = {
  // Navbar
  "nav.intro": { ko: "소개", en: "Intro", zh: "介绍", ja: "紹介", vi: "Giới thiệu", th: "แนะนำ" },
  "nav.business": { ko: "비즈니스 모델", en: "Business", zh: "商业模式", ja: "ビジネスモデル", vi: "Mô hình kinh doanh", th: "โมเดลธุรกิจ" },
  "nav.game": { ko: "BTC 예측 게임", en: "BTC Game", zh: "BTC预测游戏", ja: "BTC予測ゲーム", vi: "Trò chơi dự đoán BTC", th: "เกมทำนาย BTC" },
  "nav.staking": { ko: "AI 스테이킹", en: "AI Staking", zh: "AI质押", ja: "AIステーキング", vi: "AI Staking", th: "AI Staking" },
  "nav.referral": { ko: "직추천 수익", en: "Referral", zh: "推荐收益", ja: "紹介報酬", vi: "Thu nhập giới thiệu", th: "รายได้แนะนำ" },
  "nav.team": { ko: "팀 수익", en: "Team", zh: "团队收益", ja: "チーム収益", vi: "Thu nhập nhóm", th: "รายได้ทีม" },
  "nav.tokenomics": { ko: "토큰 이코노믹", en: "Tokenomics", zh: "代币经济", ja: "トークノミクス", vi: "Tokenomics", th: "Tokenomics" },
  "nav.flywheel": { ko: "플라이휠", en: "Flywheel", zh: "飞轮效应", ja: "フライホイール", vi: "Bánh đà", th: "ฟลายวีล" },
  "nav.resources": { ko: "자료실", en: "Resources", zh: "资料中心", ja: "資料室", vi: "Tài liệu", th: "ศูนย์ข้อมูล" },

  // Hero
  "hero.title1": { ko: "XPLAY ", en: "XPLAY ", zh: "XPLAY ", ja: "XPLAY ", vi: "XPLAY ", th: "XPLAY " },
  "hero.title2": { ko: "수익 구조", en: "Revenue Structure", zh: "收益结构", ja: "収益構造", vi: "Cấu trúc doanh thu", th: "โครงสร้างรายได้" },
  "hero.title3": { ko: "완전 분석", en: "Complete Analysis", zh: "完全解析", ja: "完全分析", vi: "Phân tích toàn diện", th: "วิเคราะห์ครบถ้วน" },
  "hero.subtitle": {
    ko: "AI 자동 수익 엔진 × GameFi 듀얼 엔진",
    en: "AI Auto Revenue Engine × GameFi Dual Engine",
    zh: "AI自动收益引擎 × GameFi双引擎",
    ja: "AI自動収益エンジン × GameFiデュアルエンジン",
    vi: "AI Tự động kiếm lợi nhuận × GameFi Dual Engine",
    th: "AI เครื่องยนต์รายได้อัตโนมัติ × GameFi Dual Engine",
  },
  "hero.desc": {
    ko: "프로젝트 팀 수익, 개인 수익, 회사 수익 구조를 투자자 관점에서 한눈에 비교합니다",
    en: "Compare team revenue, personal revenue, and company revenue structures at a glance from an investor's perspective",
    zh: "从投资者角度一目了然地比较项目团队收益、个人收益和公司收益结构",
    ja: "プロジェクトチーム収益、個人収益、会社収益構造を投資家の視点で一目で比較します",
    vi: "So sánh doanh thu nhóm, cá nhân và công ty từ góc nhìn nhà đầu tư",
    th: "เปรียบเทียบรายได้ทีม รายได้ส่วนตัว และโครงสร้างรายได้บริษัทจากมุมมองนักลงทุน",
  },
  "hero.stat1": { ko: "일 최대 수익률", en: "Max Daily Return", zh: "日最高收益率", ja: "日最大収益率", vi: "Lợi nhuận tối đa/ngày", th: "ผลตอบแทนสูงสุด/วัน" },
  "hero.stat2": { ko: "직추천 보상", en: "Referral Reward", zh: "直推奖励", ja: "直接紹介報酬", vi: "Thưởng giới thiệu", th: "รางวัลแนะนำ" },
  "hero.stat3": { ko: "팀 수익 배분", en: "Team Distribution", zh: "团队收益分配", ja: "チーム収益分配", vi: "Phân phối nhóm", th: "การแบ่งรายได้ทีม" },

  // Hero detail intro
  "hero.detail.badge": { ko: "ABOUT XPLAY", en: "ABOUT XPLAY", zh: "关于XPLAY", ja: "XPLAYについて", vi: "VỀ XPLAY", th: "เกี่ยวกับ XPLAY" },
  "hero.detail.1.title": { ko: "AI 기반 자동 수익 엔진", en: "AI-Powered Auto Revenue Engine", zh: "AI驱动自动收益引擎", ja: "AI搭載自動収益エンジン", vi: "Công cụ doanh thu tự động AI", th: "เครื่องยนต์รายได้อัตโนมัติ AI" },
  "hero.detail.1.desc": { ko: "토큰 믹싱, 퀀트 트레이딩, 마켓 메이킹 — 3가지 AI 엔진이 24시간 자동으로 수익을 창출합니다", en: "Token Mixing, Quant Trading, Market Making — 3 AI engines generate revenue 24/7 automatically", zh: "代币混合、量化交易、做市商 — 3个AI引擎24小时自动创造收益", ja: "トークンミキシング、クオンツ取引、マーケットメイキング — 3つのAIエンジンが24時間自動で収益を創出", vi: "Token Mixing, Quant Trading, Market Making — 3 AI engine tạo doanh thu 24/7", th: "Token Mixing, Quant Trading, Market Making — 3 AI engine สร้างรายได้ 24/7" },
  "hero.detail.2.title": { ko: "BTC 초단타 예측 게임", en: "BTC Ultra-Short Prediction Game", zh: "BTC超短线预测游戏", ja: "BTC超短期予測ゲーム", vi: "Trò chơi dự đoán BTC siêu ngắn", th: "เกมทำนาย BTC ระยะสั้นมาก" },
  "hero.detail.2.desc": { ko: "30초/1분/5분 라운드 — 5% 수수료가 회사의 핵심 매출원. 글로벌 80,000명 유저 목표", en: "30s/1m/5m rounds — 5% fee is the core revenue source. Targeting 80,000 global users", zh: "30秒/1分/5分回合 — 5%手续费是核心收入来源。目标全球80,000用户", ja: "30秒/1分/5分ラウンド — 5%手数料がコア収益源。グローバル80,000ユーザー目標", vi: "Vòng 30s/1p/5p — Phí 5% là nguồn doanh thu cốt lõi. Mục tiêu 80,000 người dùng", th: "รอบ 30วิ/1นาที/5นาที — ค่าธรรมเนียม 5% เป็นแหล่งรายได้หลัก เป้าหมาย 80,000 ผู้ใช้" },
  "hero.detail.3.title": { ko: "XP 토큰 디플레이션 모델", en: "XP Token Deflation Model", zh: "XP代币通缩模型", ja: "XPトークンデフレモデル", vi: "Mô hình giảm phát XP Token", th: "โมเดลเงินฝืด XP Token" },
  "hero.detail.3.desc": { ko: "총 발행량 2,100만 → 100만까지 소각. 극단적 디플레이션으로 토큰 가치 극대화", en: "Total supply 21M → burning to 1M. Extreme deflation maximizes token value", zh: "总发行量2100万 → 燃烧至100万。极端通缩最大化代币价值", ja: "総発行量2,100万 → 100万まで焼却。極端なデフレでトークン価値を最大化", vi: "Tổng cung 21M → đốt còn 1M. Giảm phát cực độ tối đa hóa giá trị token", th: "อุปทานรวม 21M → เผาเหลือ 1M ภาวะเงินฝืดสุดขีดเพิ่มมูลค่าโทเค็น" },
  "hero.detail.4.title": { ko: "6세대 레퍼럴 보상 시스템", en: "6-Generation Referral Reward System", zh: "6代推荐奖励系统", ja: "6世代リファラル報酬システム", vi: "Hệ thống thưởng giới thiệu 6 thế hệ", th: "ระบบรางวัลแนะนำ 6 รุ่น" },
  "hero.detail.4.desc": { ko: "직추천 10% + 팀 수익 80% 분배. 네트워크가 성장할수록 수동 수익이 증가합니다", en: "Direct referral 10% + 80% team distribution. Passive income grows as your network expands", zh: "直推10% + 团队收益80%分配。网络增长，被动收入增加", ja: "直接紹介10% + チーム収益80%分配。ネットワーク成長で不労所得が増加", vi: "Giới thiệu trực tiếp 10% + phân phối nhóm 80%. Thu nhập thụ động tăng theo mạng lưới", th: "แนะนำตรง 10% + แบ่งทีม 80% รายได้ passive เพิ่มตามเครือข่าย" },

  // Hero referral CTA
  "hero.register.referral": { ko: "내 레퍼럴 등록하기", en: "Register My Referral", zh: "注册我的推荐链接", ja: "マイリファラル登録", vi: "Đăng ký liên kết giới thiệu", th: "ลงทะเบียนลิงก์แนะนำ" },
  "hero.start.with.referral": { ko: "지금 XPLAY 시작하기", en: "Start XPLAY Now", zh: "立即开始XPLAY", ja: "今すぐXPLAYを始める", vi: "Bắt đầu XPLAY ngay", th: "เริ่ม XPLAY เลย" },

  // Business Section
  "biz.badge": { ko: "Revenue Engine", en: "Revenue Engine", zh: "Revenue Engine", ja: "Revenue Engine", vi: "Revenue Engine", th: "Revenue Engine" },
  "biz.title": { ko: "회사의 3대 핵심 비즈니스", en: "3 Core Business Models", zh: "公司三大核心业务", ja: "会社の3大コアビジネス", vi: "3 Mô hình kinh doanh cốt lõi", th: "3 โมเดลธุรกิจหลัก" },
  "biz.subtitle": {
    ko: "XPLAY의 수익은 실제 비즈니스 모델 3가지에서 발생하며, 그 수익을 유저에게 분배합니다",
    en: "XPLAY's revenue comes from 3 real business models, distributing profits to users",
    zh: "XPLAY的收益来自3个实际商业模式，并将收益分配给用户",
    ja: "XPLAYの収益は3つの実際のビジネスモデルから発生し、その収益をユーザーに分配します",
    vi: "Doanh thu XPLAY đến từ 3 mô hình kinh doanh thực, phân phối lợi nhuận cho người dùng",
    th: "รายได้ XPLAY มาจาก 3 โมเดลธุรกิจจริง กระจายกำไรให้ผู้ใช้",
  },
  "biz.mixing": { ko: "토큰 믹싱 엔진", en: "Token Mixing Engine", zh: "代币混合引擎", ja: "トークンミキシングエンジン", vi: "Token Mixing Engine", th: "Token Mixing Engine" },
  "biz.mixing.desc": { ko: "블록체인 프라이버시 기술 활용, 체인 간 스왑 수수료", en: "Blockchain privacy technology, cross-chain swap fees", zh: "利用区块链隐私技术，跨链交换手续费", ja: "ブロックチェーンプライバシー技術活用、チェーン間スワップ手数料", vi: "Công nghệ bảo mật blockchain, phí swap cross-chain", th: "เทคโนโลยีความเป็นส่วนตัวบล็อกเชน ค่าธรรมเนียม swap ข้ามเชน" },
  "biz.quant": { ko: "AI 계량화 트레이딩", en: "AI Quant Trading", zh: "AI量化交易", ja: "AI定量トレーディング", vi: "Giao dịch AI Quant", th: "AI Quant Trading" },
  "biz.quant.desc": { ko: "빅데이터 AI 24시간 자동 차익 실현", en: "Big data AI 24/7 automated arbitrage", zh: "大数据AI 24小时自动套利", ja: "ビッグデータAI 24時間自動アービトラージ", vi: "AI Big Data kiếm lời tự động 24/7", th: "AI Big Data ทำกำไรอัตโนมัติ 24/7" },
  "biz.market": { ko: "바이낸스 AI Market Making", en: "Binance AI Market Making", zh: "币安AI做市", ja: "バイナンスAIマーケットメイキング", vi: "Binance AI Market Making", th: "Binance AI Market Making" },
  "biz.market.desc": { ko: "유동성 공급 및 수익 공유", en: "Liquidity provision and revenue sharing", zh: "流动性供应及收益共享", ja: "流動性供給および収益共有", vi: "Cung cấp thanh khoản và chia sẻ doanh thu", th: "จัดหาสภาพคล่องและแบ่งปันรายได้" },
  "biz.footer1": {
    ko: "이 세 가지 엔진이 플랫폼의 **지속 가능한 수익 기반**을 형성합니다.",
    en: "These three engines form the platform's **sustainable revenue foundation**.",
    zh: "这三大引擎构成了平台**可持续的收益基础**。",
    ja: "この3つのエンジンがプラットフォームの**持続可能な収益基盤**を形成します。",
    vi: "Ba động cơ này tạo nên **nền tảng doanh thu bền vững** của nền tảng.",
    th: "เครื่องยนต์ทั้งสามนี้สร้าง**รากฐานรายได้ที่ยั่งยืน**ของแพลตฟอร์ม",
  },
  "biz.footer2": {
    ko: '단순히 "코인 가격이 오르면 돈 번다"가 아니라, **실제 비즈니스에서 수익이 발생**하는 구조입니다.',
    en: 'Not simply "make money when coin price rises", but a structure where **revenue comes from real business**.',
    zh: '不是简单的"币价上涨就赚钱"，而是**从实际业务中产生收益**的结构。',
    ja: '単に「コイン価格が上がれば儲かる」ではなく、**実際のビジネスから収益が発生**する構造です。',
    vi: 'Không đơn giản là "kiếm tiền khi giá coin tăng", mà là cấu trúc **doanh thu đến từ kinh doanh thực**.',
    th: 'ไม่ใช่แค่ "ทำเงินเมื่อราคาเหรียญขึ้น" แต่เป็นโครงสร้างที่**รายได้มาจากธุรกิจจริง**',
  },

  // Game Section
  "game.badge": { ko: "Killer Revenue Model", en: "Killer Revenue Model", zh: "Killer Revenue Model", ja: "Killer Revenue Model", vi: "Killer Revenue Model", th: "Killer Revenue Model" },
  "game.title": { ko: "BTC 초단타 예측 게임", en: "BTC Short-term Prediction Game", zh: "BTC超短线预测游戏", ja: "BTC超短期予測ゲーム", vi: "Trò chơi dự đoán BTC siêu ngắn hạn", th: "เกมทำนาย BTC ระยะสั้น" },
  "game.subtitle": {
    ko: "게임 수수료가 회사의 핵심 자원 — 숫자가 말해줍니다",
    en: "Game fees are the company's core resource — the numbers speak for themselves",
    zh: "游戏手续费是公司的核心资源——数字说明一切",
    ja: "ゲーム手数料が会社の核心資源 — 数字が物語ります",
    vi: "Phí game là nguồn lực cốt lõi — con số nói lên tất cả",
    th: "ค่าธรรมเนียมเกมคือทรัพยากรหลัก — ตัวเลขพูดแทนทุกอย่าง",
  },
  "game.round": { ko: "라운드 주기", en: "Round Cycle", zh: "轮次周期", ja: "ラウンド周期", vi: "Chu kỳ vòng", th: "รอบเกม" },
  "game.round.sub": { ko: "/ 1분 / 5분", en: "/ 1min / 5min", zh: "/ 1分钟 / 5分钟", ja: "/ 1分 / 5分", vi: "/ 1 phút / 5 phút", th: "/ 1 นาที / 5 นาที" },
  "game.users": { ko: "글로벌 목표 유저", en: "Global Target Users", zh: "全球目标用户", ja: "グローバル目標ユーザー", vi: "Mục tiêu người dùng toàn cầu", th: "เป้าหมายผู้ใช้ทั่วโลก" },
  "game.users.sub": { ko: "80,000명", en: "80,000 users", zh: "80,000人", ja: "80,000人", vi: "80.000 người dùng", th: "80,000 คน" },
  "game.bettors": { ko: "30초당 베팅 인원", en: "Bettors per 30s", zh: "每30秒投注人数", ja: "30秒あたりベッティング人数", vi: "Người đặt cược mỗi 30 giây", th: "ผู้เดิมพันต่อ 30 วินาที" },
  "game.bettors.sub": { ko: "$5 베팅 (최소)", en: "$5 bet (minimum)", zh: "$5投注（最低）", ja: "$5ベッティング（最低）", vi: "Đặt cược $5 (tối thiểu)", th: "เดิมพัน $5 (ขั้นต่ำ)" },
  "game.calc.note": { ko: "30초 라운드만 계산 (1분, 5분 별도)", en: "30s rounds only (1min, 5min separate)", zh: "仅计算30秒轮次（1分钟、5分钟另计）", ja: "30秒ラウンドのみ計算（1分、5分は別途）", vi: "Chỉ tính vòng 30 giây (1 phút, 5 phút riêng)", th: "คำนวณเฉพาะรอบ 30 วินาที (1 นาที, 5 นาที แยก)" },
  "game.why": { ko: "왜 유저가 모이는가?", en: "Why do users gather?", zh: "为什么用户会聚集？", ja: "なぜユーザーが集まるのか？", vi: "Tại sao người dùng tập trung?", th: "ทำไมผู้ใช้ถึงรวมตัวกัน?" },
  "game.why.desc": {
    ko: '매일 AI 스테이킹 봇에서 **5 USDT가 자동으로 입금**됩니다. 이 5달러로 부담 없이 예측 게임에 참여할 수 있습니다. "공짜 돈으로 게임한다"는 심리가 유저 유입의 핵심 동력입니다.',
    en: 'Every day, the AI staking bot **automatically deposits 5 USDT**. Users can participate in prediction games with this $5 without burden. The psychology of "playing with free money" is the core driver of user acquisition.',
    zh: '每天AI质押机器人会**自动存入5 USDT**。用这5美元可以无负担地参与预测游戏。"用免费的钱玩游戏"的心理是用户流入的核心动力。',
    ja: '毎日AIステーキングボットから**5 USDTが自動入金**されます。この5ドルで気軽に予測ゲームに参加できます。「タダのお金でゲームする」という心理がユーザー流入の核心動力です。',
    vi: 'Mỗi ngày, bot AI staking **tự động nạp 5 USDT**. Với $5 này, bạn có thể tham gia trò chơi dự đoán mà không lo lắng. Tâm lý "chơi bằng tiền miễn phí" là động lực cốt lõi thu hút người dùng.',
    th: 'ทุกวัน บอท AI staking **ฝาก 5 USDT โดยอัตโนมัติ** ด้วย $5 นี้คุณสามารถเข้าร่วมเกมทำนายได้โดยไม่ต้องกังวล จิตวิทยา "เล่นด้วยเงินฟรี" เป็นแรงขับเคลื่อนหลัก',
  },
  "game.key": {
    ko: "핵심: $5든 $100이든, 유저가 베팅할 때마다 5%의 수수료가 발생하고, 이것이 회사와 소개자들의 수익이 됩니다.",
    en: "Key: Whether $5 or $100, a 5% fee is generated every time a user bets, becoming revenue for the company and referrers.",
    zh: "核心：无论$5还是$100，用户每次投注都会产生5%的手续费，这就是公司和推荐人的收益来源。",
    ja: "核心：$5でも$100でも、ユーザーがベッティングするたびに5%の手数料が発生し、これが会社と紹介者の収益になります。",
    vi: "Điểm mấu chốt: Dù $5 hay $100, mỗi lần đặt cược đều phát sinh 5% phí, trở thành doanh thu cho công ty và người giới thiệu.",
    th: "สำคัญ: ไม่ว่า $5 หรือ $100 ทุกครั้งที่เดิมพันจะเกิดค่าธรรมเนียม 5% ซึ่งเป็นรายได้ของบริษัทและผู้แนะนำ",
  },
  "game.lotto": { ko: "올인 로또 수익 분배 (10,000 USDT 풀 기준)", en: "All-in Lotto Distribution (10,000 USDT Pool)", zh: "全押乐透收益分配（10,000 USDT池基准）", ja: "オールインロト収益分配（10,000 USDTプール基準）", vi: "Phân phối All-in Lotto (Pool 10,000 USDT)", th: "การแจกจ่าย All-in Lotto (Pool 10,000 USDT)" },
  "game.lotto.note": {
    ko: "91%를 유저에게 돌려주면서도, 빠른 회전율(일 240회)로 안정적인 플랫폼 수익을 창출합니다.",
    en: "While returning 91% to users, it generates stable platform revenue through fast turnover (240 rounds/day).",
    zh: "在将91%返还给用户的同时，通过快速周转率（日240次）创造稳定的平台收益。",
    ja: "91%をユーザーに還元しながらも、高速回転率（日240回）で安定したプラットフォーム収益を創出します。",
    vi: "Trả lại 91% cho người dùng, đồng thời tạo doanh thu ổn định nhờ tốc độ quay vòng nhanh (240 vòng/ngày).",
    th: "คืน 91% ให้ผู้ใช้ ขณะเดียวกันสร้างรายได้แพลตฟอร์มที่มั่นคงผ่านการหมุนเวียนเร็ว (240 รอบ/วัน)",
  },
  "game.lotto.h1": { ko: "구분", en: "Category", zh: "类别", ja: "区分", vi: "Loại", th: "ประเภท" },
  "game.lotto.h2": { ko: "금액 (USDT)", en: "Amount (USDT)", zh: "金额 (USDT)", ja: "金額 (USDT)", vi: "Số tiền (USDT)", th: "จำนวน (USDT)" },
  "game.lotto.h3": { ko: "비율", en: "Ratio", zh: "比例", ja: "比率", vi: "Tỷ lệ", th: "อัตราส่วน" },
  "game.lotto.r1": { ko: "1등 (Winner)", en: "1st (Winner)", zh: "第1名 (Winner)", ja: "1等 (Winner)", vi: "Giải nhất (Winner)", th: "อันดับ 1 (Winner)" },
  "game.lotto.r2": { ko: "2~10등", en: "2nd~10th", zh: "第2~10名", ja: "2~10等", vi: "Giải 2~10", th: "อันดับ 2~10" },
  "game.lotto.r3": { ko: "플랫폼 수수료", en: "Platform Fee", zh: "平台手续费", ja: "プラットフォーム手数料", vi: "Phí nền tảng", th: "ค่าธรรมเนียมแพลตฟอร์ม" },
  "game.testService": { ko: "테스트 서비스 오픈", en: "Test Service Open", zh: "测试服务已开放", ja: "テストサービス公開", vi: "Dịch vụ thử nghiệm đã mở", th: "เปิดบริการทดสอบ" },
  "game.tryNow": { ko: "지금 체험하기", en: "Try Now", zh: "立即体验", ja: "今すぐ体験", vi: "Trải nghiệm ngay", th: "ลองเลย" },

  // Staking Section
  "staking.badge": { ko: "Personal Revenue", en: "Personal Revenue", zh: "Personal Revenue", ja: "Personal Revenue", vi: "Personal Revenue", th: "Personal Revenue" },
  "staking.title": { ko: "AI 스테이킹 봇으로 매일 자동 수익", en: "Daily Auto Revenue with AI Staking Bots", zh: "AI质押机器人每日自动收益", ja: "AIステーキングボットで毎日自動収益", vi: "Thu nhập tự động hàng ngày với AI Staking Bot", th: "รายได้อัตโนมัติรายวันด้วย AI Staking Bot" },
  "staking.subtitle": {
    ko: "5가지 봇 중 투자 기간에 맞는 봇을 선택하면, AI가 자동으로 수익을 창출합니다",
    en: "Choose from 5 bots matching your investment period, and AI automatically generates revenue",
    zh: "从5种机器人中选择适合投资期限的机器人，AI将自动创造收益",
    ja: "5種類のボットから投資期間に合ったボットを選択すると、AIが自動的に収益を創出します",
    vi: "Chọn từ 5 bot phù hợp với kỳ hạn đầu tư, AI tự động tạo lợi nhuận",
    th: "เลือกจาก 5 บอทที่เหมาะกับระยะเวลาลงทุน AI จะสร้างรายได้โดยอัตโนมัติ",
  },
  "staking.daily": { ko: "일일 수익률", en: "Daily Return", zh: "日收益率", ja: "日利回り", vi: "Lợi nhuận hàng ngày", th: "ผลตอบแทนรายวัน" },
  "staking.fee.title": { ko: "5 USDT 자동 입금 구조 — 수수료 20%는 이렇게 작동합니다", en: "5 USDT Auto-deposit Structure — How the 20% Fee Works", zh: "5 USDT自动存入结构——20%手续费如何运作", ja: "5 USDT自動入金構造 — 手数料20%はこう作動します", vi: "Cấu trúc tự động nạp 5 USDT — Phí 20% hoạt động thế nào", th: "โครงสร้างฝากอัตโนมัติ 5 USDT — ค่าธรรมเนียม 20% ทำงานอย่างไร" },
  "staking.step1": { ko: "AI 봇이\n수익 창출", en: "AI Bot\nGenerates Revenue", zh: "AI机器人\n创造收益", ja: "AIボットが\n収益創出", vi: "AI Bot\ntạo lợi nhuận", th: "AI Bot\nสร้างรายได้" },
  "staking.step2": { ko: "20% 수수료\n차감", en: "20% Fee\nDeducted", zh: "扣除20%\n手续费", ja: "20%手数料\n差引", vi: "Trừ phí\n20%", th: "หัก\nค่าธรรมเนียม 20%" },
  "staking.step3": { ko: "5 USDT 도달 시\n자동 입금", en: "Auto-deposit\nwhen 5 USDT reached", zh: "达到5 USDT时\n自动存入", ja: "5 USDT到達時\n自動入金", vi: "Tự động nạp\nkhi đạt 5 USDT", th: "ฝากอัตโนมัติ\nเมื่อถึง 5 USDT" },
  "staking.fee.note": {
    ko: "여러분이 받는 **5 USDT는 이미 수수료가 빠진 순수익**입니다. 차감된 20%가 바로 플랫폼의 핵심 수익원입니다.",
    en: "The **5 USDT you receive is already net profit after fees**. The deducted 20% is the platform's core revenue source.",
    zh: "您收到的**5 USDT已经是扣除手续费后的纯收益**。扣除的20%正是平台的核心收益来源。",
    ja: "皆さんが受け取る**5 USDTはすでに手数料が引かれた純収益**です。差し引かれた20%がまさにプラットフォームの核心収益源です。",
    vi: "**5 USDT bạn nhận được đã là lợi nhuận ròng sau phí**. 20% bị trừ chính là nguồn doanh thu cốt lõi của nền tảng.",
    th: "**5 USDT ที่คุณได้รับเป็นกำไรสุทธิหลังหักค่าธรรมเนียมแล้ว** 20% ที่ถูกหักคือแหล่งรายได้หลักของแพลตฟอร์ม",
  },
  "staking.sim.title": { ko: "개인 수익 시뮬레이션 — 10,000 USDT × Quantum Bot (360일)", en: "Personal Revenue Simulation — 10,000 USDT × Quantum Bot (360 days)", zh: "个人收益模拟 — 10,000 USDT × Quantum Bot (360天)", ja: "個人収益シミュレーション — 10,000 USDT × Quantum Bot (360日)", vi: "Mô phỏng lợi nhuận — 10,000 USDT × Quantum Bot (360 ngày)", th: "จำลองรายได้ — 10,000 USDT × Quantum Bot (360 วัน)" },
  "staking.sim.h1": { ko: "항목", en: "Item", zh: "项目", ja: "項目", vi: "Mục", th: "รายการ" },
  "staking.sim.h2": { ko: "수치", en: "Value", zh: "数值", ja: "数値", vi: "Giá trị", th: "ค่า" },
  "staking.sim.r1": { ko: "투자금", en: "Investment", zh: "投资金", ja: "投資金", vi: "Vốn đầu tư", th: "เงินลงทุน" },
  "staking.sim.r2": { ko: "일평균 수익률", en: "Avg Daily Return", zh: "日均收益率", ja: "日平均収益率", vi: "Lợi nhuận TB/ngày", th: "ผลตอบแทนเฉลี่ย/วัน" },
  "staking.sim.r3": { ko: "연간 예상 수익률 (APY)", en: "Expected APY", zh: "年预期收益率 (APY)", ja: "年間予想収益率 (APY)", vi: "APY dự kiến", th: "APY ที่คาดหวัง" },
  "staking.sim.r4": { ko: "360일 예상 순이익", en: "360-day Expected Profit", zh: "360天预期纯利润", ja: "360日予想純利益", vi: "Lợi nhuận dự kiến 360 ngày", th: "กำไรที่คาดหวัง 360 วัน" },
  "staking.sim.note": {
    ko: "* 시뮬레이션이며, 실제 수익은 시장 상황에 따라 달라질 수 있습니다.",
    en: "* This is a simulation. Actual returns may vary depending on market conditions.",
    zh: "* 此为模拟数据，实际收益可能因市场情况而异。",
    ja: "* シミュレーションであり、実際の収益は市場状況により異なる場合があります。",
    vi: "* Đây là mô phỏng. Lợi nhuận thực tế có thể thay đổi tùy điều kiện thị trường.",
    th: "* นี่คือการจำลอง ผลตอบแทนจริงอาจแตกต่างตามสภาวะตลาด",
  },

  // Referral Section
  "ref.badge": { ko: "Referral Rewards", en: "Referral Rewards", zh: "Referral Rewards", ja: "Referral Rewards", vi: "Referral Rewards", th: "Referral Rewards" },
  "ref.title": { ko: "직추천 수익 — 6단계 보상 체계", en: "Referral Revenue — 6-tier Reward System", zh: "直推收益 — 6级奖励体系", ja: "直接紹介収益 — 6段階報酬体系", vi: "Thu nhập giới thiệu — Hệ thống thưởng 6 cấp", th: "รายได้แนะนำ — ระบบรางวัล 6 ระดับ" },
  "ref.subtitle": {
    ko: "1명만 추천해도 10% 보상. 추천 인원이 늘어날수록 더 깊은 세대까지 수익이 열립니다",
    en: "10% reward for just 1 referral. More referrals unlock deeper generation rewards",
    zh: "仅推荐1人即可获得10%奖励。推荐人数越多，收益延伸到更深层级",
    ja: "1人紹介するだけで10%報酬。紹介人数が増えるほど、より深い世代まで収益が開きます",
    vi: "Thưởng 10% chỉ với 1 lượt giới thiệu. Càng nhiều giới thiệu, phần thưởng mở rộng càng sâu",
    th: "รางวัล 10% แค่แนะนำ 1 คน ยิ่งแนะนำมาก รางวัลยิ่งลึก",
  },
  "ref.table.title": { ko: "6단계 직추천 보상 체계", en: "6-tier Referral Reward System", zh: "6级直推奖励体系", ja: "6段階直接紹介報酬体系", vi: "Hệ thống thưởng giới thiệu 6 cấp", th: "ระบบรางวัลแนะนำ 6 ระดับ" },
  "ref.h1": { ko: "유효 직추 인원", en: "Direct Referrals", zh: "有效直推人数", ja: "有効直接紹介人数", vi: "Số người giới thiệu", th: "จำนวนแนะนำตรง" },
  "ref.h2": { ko: "잠금 해제 대수", en: "Unlocked Gen", zh: "解锁代数", ja: "ロック解除世代", vi: "Thế hệ mở khóa", th: "เจเนอเรชันที่ปลดล็อก" },
  "ref.h3": { ko: "유동성 실적 요구", en: "Liquidity Req.", zh: "流动性要求", ja: "流動性要件", vi: "Yêu cầu thanh khoản", th: "ข้อกำหนดสภาพคล่อง" },
  "ref.h4": { ko: "추천 보상 비율", en: "Reward Rate", zh: "推荐奖励比例", ja: "紹介報酬率", vi: "Tỷ lệ thưởng", th: "อัตราส่วนรางวัล" },
  "ref.gen": { ko: "세대", en: "Gen", zh: "代", ja: "世代", vi: "Thế hệ", th: "เจเนอเรชัน" },
  "ref.how": { ko: "어떻게 작동하나요?", en: "How does it work?", zh: "如何运作？", ja: "どのように作動しますか？", vi: "Hoạt động như thế nào?", th: "ทำงานอย่างไร?" },
  "ref.example": {
    ko: "예시: A → B → C → D 추천 체인",
    en: "Example: A → B → C → D referral chain",
    zh: "示例：A → B → C → D 推荐链",
    ja: "例：A → B → C → D 紹介チェーン",
    vi: "Ví dụ: Chuỗi giới thiệu A → B → C → D",
    th: "ตัวอย่าง: เชนแนะนำ A → B → C → D",
  },

  // Team Section
  "team.badge": { ko: "Team Revenue", en: "Team Revenue", zh: "Team Revenue", ja: "Team Revenue", vi: "Team Revenue", th: "Team Revenue" },
  "team.title": { ko: "팀 수익 & 직급 수익", en: "Team Revenue & Rank Revenue", zh: "团队收益 & 等级收益", ja: "チーム収益 & 等級収益", vi: "Thu nhập nhóm & Thu nhập cấp bậc", th: "รายได้ทีม & รายได้ระดับ" },
  "team.subtitle": {
    ko: "V1~V8 커뮤니티 파트너 등급 — 커뮤니티를 성장시킬수록 수익이 기하급수적으로 증가합니다",
    en: "V1~V8 Community Partner Ranks — Revenue grows exponentially as your community grows",
    zh: "V1~V8社区合伙人等级 — 社区越壮大，收益呈指数级增长",
    ja: "V1~V8コミュニティパートナー等級 — コミュニティを成長させるほど収益が指数関数的に増加します",
    vi: "Cấp bậc đối tác V1~V8 — Doanh thu tăng theo cấp số nhân khi cộng đồng phát triển",
    th: "ระดับพาร์ทเนอร์ V1~V8 — รายได้เพิ่มขึ้นแบบทวีคูณเมื่อชุมชนเติบโต",
  },
  "team.table.title": { ko: "V1~V8 등급 전체 테이블", en: "V1~V8 Full Rank Table", zh: "V1~V8等级完整表格", ja: "V1~V8等級全テーブル", vi: "Bảng cấp bậc V1~V8 đầy đủ", th: "ตารางระดับ V1~V8 ทั้งหมด" },
  "team.h1": { ko: "등급", en: "Rank", zh: "等级", ja: "等級", vi: "Cấp bậc", th: "ระดับ" },
  "team.h2": { ko: "개인 유동성", en: "Personal Liq.", zh: "个人流动性", ja: "個人流動性", vi: "Thanh khoản cá nhân", th: "สภาพคล่องส่วนตัว" },
  "team.h3": { ko: "추천팀 유동성", en: "Team Liq.", zh: "推荐团队流动性", ja: "推薦チーム流動性", vi: "Thanh khoản nhóm", th: "สภาพคล่องทีม" },
  "team.h4": { ko: "믹싱 수익비", en: "Mixing Rate", zh: "混合收益比", ja: "ミキシング収益比", vi: "Tỷ lệ Mixing", th: "อัตรา Mixing" },
  "team.h5": { ko: "AI퀀트 수익비", en: "AI Quant Rate", zh: "AI量化收益比", ja: "AIクオンツ収益比", vi: "Tỷ lệ AI Quant", th: "อัตรา AI Quant" },
  "team.h6": { ko: "등급 보너스", en: "Rank Bonus", zh: "等级奖金", ja: "等級ボーナス", vi: "Thưởng cấp bậc", th: "โบนัสระดับ" },
  "team.info.personal": { ko: "개인 유동성", en: "Personal Liquidity", zh: "个人流动性", ja: "個人流動性", vi: "Thanh khoản cá nhân", th: "สภาพคล่องส่วนตัว" },
  "team.info.personal.desc": { ko: "본인이 플랫폼에 예치한 USDT 금액. V1은 100 USDT만 있으면 시작", en: "USDT deposited on the platform. V1 starts with just 100 USDT", zh: "本人在平台存入的USDT金额。V1只需100 USDT即可开始", ja: "本人がプラットフォームに預けたUSDT金額。V1は100 USDTだけで開始", vi: "Số USDT gửi trên nền tảng. V1 chỉ cần 100 USDT để bắt đầu", th: "USDT ที่ฝากบนแพลตฟอร์ม V1 เริ่มต้นเพียง 100 USDT" },
  "team.info.team": { ko: "추천팀 유동성", en: "Team Liquidity", zh: "推荐团队流动性", ja: "推薦チーム流動性", vi: "Thanh khoản nhóm", th: "สภาพคล่องทีม" },
  "team.info.team.desc": { ko: "내가 구축한 팀 전체의 총 유동성. 팀이 클수록 높은 등급 도달", en: "Total liquidity of your team. Larger teams reach higher ranks", zh: "我构建的团队总流动性。团队越大，等级越高", ja: "自分が構築したチーム全体の総流動性。チームが大きいほど高い等級に到達", vi: "Tổng thanh khoản nhóm. Nhóm càng lớn, cấp bậc càng cao", th: "สภาพคล่องรวมของทีม ทีมยิ่งใหญ่ ระดับยิ่งสูง" },
  "team.info.rate": { ko: "믹싱/AI퀀트 수익비", en: "Mixing/AI Quant Rate", zh: "混合/AI量化收益比", ja: "ミキシング/AIクオンツ収益比", vi: "Tỷ lệ Mixing/AI Quant", th: "อัตรา Mixing/AI Quant" },
  "team.info.rate.desc": { ko: "팀 수익의 배분 비율. V8은 최대 80%까지 수령 가능", en: "Team revenue distribution rate. V8 can receive up to 80%", zh: "团队收益分配比例。V8最高可获得80%", ja: "チーム収益の配分比率。V8は最大80%まで受領可能", vi: "Tỷ lệ phân phối doanh thu nhóm. V8 có thể nhận tới 80%", th: "อัตราการแบ่งรายได้ทีม V8 สามารถรับได้สูงสุด 80%" },
  "team.info.bonus": { ko: "등급 보너스", en: "Rank Bonus", zh: "等级奖金", ja: "等級ボーナス", vi: "Thưởng cấp bậc", th: "โบนัสระดับ" },
  "team.info.bonus.desc": { ko: "모든 등급에서 동일하게 10%의 추가 보너스 지급", en: "All ranks receive an additional 10% bonus", zh: "所有等级均享有10%额外奖金", ja: "全等級で同一の10%追加ボーナス支給", vi: "Tất cả cấp bậc đều nhận thêm 10% thưởng", th: "ทุกระดับได้รับโบนัสเพิ่ม 10%" },
  "team.sim.title": { ko: "V5 노드 수익 시뮬레이션 (보수적 예측)", en: "V5 Node Revenue Simulation (Conservative)", zh: "V5节点收益模拟（保守预测）", ja: "V5ノード収益シミュレーション（保守的予測）", vi: "Mô phỏng thu nhập V5 (dự đoán thận trọng)", th: "จำลองรายได้ V5 (ประมาณการอนุรักษ์นิยม)" },
  "team.sim.basis": { ko: "개인 5,000 U / 팀 1,500,000 U 기준", en: "Personal 5,000 U / Team 1,500,000 U basis", zh: "个人5,000 U / 团队1,500,000 U基准", ja: "個人5,000 U / チーム1,500,000 U基準", vi: "Cá nhân 5,000 U / Nhóm 1,500,000 U", th: "ส่วนตัว 5,000 U / ทีม 1,500,000 U" },
  "team.sim.h1": { ko: "수익원", en: "Revenue Source", zh: "收益来源", ja: "収益源", vi: "Nguồn thu nhập", th: "แหล่งรายได้" },
  "team.sim.h2": { ko: "일일 이익 (USDT)", en: "Daily (USDT)", zh: "日收益 (USDT)", ja: "日利益 (USDT)", vi: "Hàng ngày (USDT)", th: "รายวัน (USDT)" },
  "team.sim.h3": { ko: "월별 이익 (USDT)", en: "Monthly (USDT)", zh: "月收益 (USDT)", ja: "月利益 (USDT)", vi: "Hàng tháng (USDT)", th: "รายเดือน (USDT)" },
  "team.sim.h4": { ko: "연간 이익 (USDT)", en: "Annual (USDT)", zh: "年收益 (USDT)", ja: "年利益 (USDT)", vi: "Hàng năm (USDT)", th: "รายปี (USDT)" },
  "team.sim.r1": { ko: "팀 관리 이익", en: "Team Mgmt Revenue", zh: "团队管理收益", ja: "チーム管理利益", vi: "Thu nhập quản lý nhóm", th: "รายได้จัดการทีม" },
  "team.sim.r2": { ko: "개인 이익", en: "Personal Revenue", zh: "个人收益", ja: "個人利益", vi: "Thu nhập cá nhân", th: "รายได้ส่วนตัว" },
  "team.sim.r3": { ko: "등급 보상", en: "Rank Reward", zh: "等级奖励", ja: "等級報酬", vi: "Thưởng cấp bậc", th: "รางวัลระดับ" },
  "team.sim.r4": { ko: "총 이익 예상", en: "Total Expected", zh: "总收益预估", ja: "総利益予想", vi: "Tổng dự kiến", th: "รวมที่คาดหวัง" },
  "team.stat1": { ko: "팀 관리 이익 비중", en: "Team Mgmt Share", zh: "团队管理收益占比", ja: "チーム管理利益比重", vi: "Tỷ trọng quản lý nhóm", th: "สัดส่วนจัดการทีม" },
  "team.stat2": { ko: "V8 최대 수익 배분", en: "V8 Max Distribution", zh: "V8最高收益分配", ja: "V8最大収益分配", vi: "Phân phối tối đa V8", th: "การแจกจ่ายสูงสุด V8" },

  // Tokenomics
  "token.badge": { ko: "Token Economics", en: "Token Economics", zh: "Token Economics", ja: "Token Economics", vi: "Token Economics", th: "Token Economics" },
  "token.title": { ko: "XP 토큰 이코노믹", en: "XP Token Economics", zh: "XP代币经济", ja: "XPトークンエコノミクス", vi: "Kinh tế token XP", th: "เศรษฐศาสตร์โทเค็น XP" },
  "token.subtitle": {
    ko: "극한 디플레이션 가치 모델 — 2,100만 개 중 2,000만 개를 소각하여 100만 개만 남깁니다",
    en: "Extreme deflation model — Burning 20M out of 21M, leaving only 1M",
    zh: "极致通缩价值模型 — 2100万枚中销毁2000万枚，仅保留100万枚",
    ja: "究極のデフレ価値モデル — 2,100万個中2,000万個を焼却し100万個のみ残します",
    vi: "Mô hình giảm phát cực đại — Đốt 20 triệu trong 21 triệu, chỉ còn 1 triệu",
    th: "โมเดลเงินฝืดสุดขีด — เผา 20 ล้านจาก 21 ล้าน เหลือเพียง 1 ล้าน",
  },
  "token.supply": { ko: "총 발행량", en: "Total Supply", zh: "总发行量", ja: "総発行量", vi: "Tổng cung", th: "อุปทานรวม" },
  "token.burn": { ko: "소각 목표", en: "Burn Target", zh: "销毁目标", ja: "焼却目標", vi: "Mục tiêu đốt", th: "เป้าหมายเผา" },
  "token.remaining": { ko: "잔여량", en: "Remaining", zh: "剩余量", ja: "残余量", vi: "Còn lại", th: "คงเหลือ" },
  "token.burnRate": { ko: "소각률", en: "Burn Rate", zh: "销毁率", ja: "焼却率", vi: "Tỷ lệ đốt", th: "อัตราการเผา" },
  "token.supplyValue": { ko: "2100만개", en: "21M", zh: "2100万", ja: "2100万", vi: "21 triệu", th: "21 ล้าน" },
  "token.remainingValue": { ko: "100만개", en: "1M", zh: "100万", ja: "100万", vi: "1 triệu", th: "1 ล้าน" },
  "token.burnAmount": { ko: "-2000만개 소각", en: "-20M Burned", zh: "-2000万销毁", ja: "-2000万焼却", vi: "-20 triệu đã đốt", th: "-20 ล้านเผาแล้ว" },
  "token.deflation": { ko: "극한 디플레이션 프로세스", en: "Extreme Deflation Process", zh: "极致通缩流程", ja: "究極デフレプロセス", vi: "Quy trình giảm phát cực đại", th: "กระบวนการเงินฝืดสุดขีด" },
  "token.purchase": { ko: "수익형 구매 한도 시스템", en: "Revenue-based Purchase Limit System", zh: "收益型购买限额系统", ja: "収益型購入限度システム", vi: "Hệ thống giới hạn mua dựa trên doanh thu", th: "ระบบจำกัดการซื้อตามรายได้" },
  "token.purchase.desc": {
    ko: "XP 토큰은 시장에서 마음대로 구매할 수 없습니다. 오직 플랫폼에서 발생한 실제 수익으로만 구매 기회가 열립니다.",
    en: "XP tokens cannot be freely purchased on the market. Purchase opportunities only open through actual platform revenue.",
    zh: "XP代币不能在市场上随意购买。只有通过平台产生的实际收益才能获得购买机会。",
    ja: "XPトークンは市場で自由に購入できません。プラットフォームで発生した実際の収益でのみ購入機会が開かれます。",
    vi: "Token XP không thể mua tự do trên thị trường. Cơ hội mua chỉ mở ra thông qua doanh thu thực tế.",
    th: "โทเค็น XP ไม่สามารถซื้อได้อย่างอิสระในตลาด โอกาสซื้อเปิดเฉพาะผ่านรายได้จริงของแพลตฟอร์ม",
  },
  "token.step1": { ko: "수익 발생", en: "Revenue Generated", zh: "产生收益", ja: "収益発生", vi: "Tạo doanh thu", th: "สร้างรายได้" },
  "token.step1.desc": { ko: "AI 스테이킹 봇 또는 게임을 통해 USDT 이익 획득", en: "Earn USDT through AI staking bot or games", zh: "通过AI质押机器人或游戏获得USDT收益", ja: "AIステーキングボットまたはゲームを通じてUSDT利益獲得", vi: "Kiếm USDT qua AI staking bot hoặc game", th: "รับ USDT ผ่าน AI staking bot หรือเกม" },
  "token.step2": { ko: "구매 한도 부여", en: "Purchase Limit Granted", zh: "授予购买限额", ja: "購入限度付与", vi: "Cấp hạn mức mua", th: "ได้รับวงเงินซื้อ" },
  "token.step2.desc": { ko: "실제 USDT 이익에 비례하여 XP 구매 한도 자동 부여", en: "XP purchase limit auto-granted proportional to USDT profit", zh: "按实际USDT收益比例自动授予XP购买限额", ja: "実際のUSDT利益に比例してXP購入限度を自動付与", vi: "Hạn mức mua XP tự động cấp theo tỷ lệ lợi nhuận USDT", th: "วงเงินซื้อ XP ได้รับอัตโนมัติตามสัดส่วนกำไร USDT" },
  "token.step3": { ko: "XP 토큰 획득", en: "XP Token Acquired", zh: "获取XP代币", ja: "XPトークン獲得", vi: "Nhận token XP", th: "ได้รับโทเค็น XP" },
  "token.step3.desc": { ko: "부여된 한도를 사용하여 XP 토큰 선형 획득", en: "Linearly acquire XP tokens using granted limit", zh: "使用授予的限额线性获取XP代币", ja: "付与された限度を使用してXPトークンを線形獲得", vi: "Nhận token XP tuyến tính bằng hạn mức được cấp", th: "รับโทเค็น XP แบบเชิงเส้นโดยใช้วงเงินที่ได้รับ" },
  "token.util.governance": { ko: "거버넌스", en: "Governance", zh: "治理", ja: "ガバナンス", vi: "Quản trị", th: "การกำกับดูแล" },
  "token.util.governance.desc": { ko: "플랫폼 의사결정 투표 참여 권한", en: "Platform decision-making voting rights", zh: "平台决策投票参与权", ja: "プラットフォーム意思決定投票参加権限", vi: "Quyền bỏ phiếu quyết định nền tảng", th: "สิทธิ์ลงคะแนนตัดสินใจแพลตฟอร์ม" },
  "token.util.boost": { ko: "수익 부스트", en: "Revenue Boost", zh: "收益加速", ja: "収益ブースト", vi: "Tăng lợi nhuận", th: "เพิ่มรายได้" },
  "token.util.boost.desc": { ko: "XP 보유량에 따라 스테이킹 보상 증가", en: "Staking rewards increase based on XP holdings", zh: "根据XP持有量增加质押奖励", ja: "XP保有量に応じてステーキング報酬増加", vi: "Phần thưởng staking tăng theo lượng XP nắm giữ", th: "รางวัล staking เพิ่มตามจำนวน XP ที่ถือ" },
  "token.util.vip": { ko: "VIP 특전", en: "VIP Benefits", zh: "VIP特权", ja: "VIP特典", vi: "Đặc quyền VIP", th: "สิทธิพิเศษ VIP" },
  "token.util.vip.desc": { ko: "프리미엄 기능 우선 액세스", en: "Priority access to premium features", zh: "优先访问高级功能", ja: "プレミアム機能優先アクセス", vi: "Truy cập ưu tiên tính năng cao cấp", th: "เข้าถึงฟีเจอร์พรีเมียมก่อน" },
  "token.util.value": { ko: "가치 상승", en: "Value Appreciation", zh: "价值上升", ja: "価値上昇", vi: "Tăng giá trị", th: "มูลค่าเพิ่มขึ้น" },
  "token.util.value.desc": { ko: "수수료 소각 + Buyback & Burn", en: "Fee burn + Buyback & Burn", zh: "手续费销毁 + 回购销毁", ja: "手数料焼却 + Buyback & Burn", vi: "Đốt phí + Buyback & Burn", th: "เผาค่าธรรมเนียม + Buyback & Burn" },

  // Flywheel
  "fly.badge": { ko: "Ecosystem Flywheel", en: "Ecosystem Flywheel", zh: "Ecosystem Flywheel", ja: "Ecosystem Flywheel", vi: "Ecosystem Flywheel", th: "Ecosystem Flywheel" },
  "fly.title": { ko: "생태계 선순환 플라이휠", en: "Ecosystem Virtuous Flywheel", zh: "生态良性循环飞轮", ja: "エコシステム好循環フライホイール", vi: "Bánh đà hệ sinh thái tuần hoàn", th: "ฟลายวีลระบบนิเวศเชิงบวก" },
  "fly.subtitle": {
    ko: "수익이 수익을 만드는 구조 — 세 가지 수익 축이 서로 맞물려 돌아갑니다",
    en: "Revenue creates revenue — three revenue axes interlock and rotate together",
    zh: "收益创造收益的结构 — 三大收益轴相互联动运转",
    ja: "収益が収益を生む構造 — 3つの収益軸が互いに噛み合って回ります",
    vi: "Doanh thu tạo ra doanh thu — ba trục doanh thu liên kết và quay cùng nhau",
    th: "รายได้สร้างรายได้ — สามแกนรายได้เชื่อมต่อและหมุนไปด้วยกัน",
  },
  "fly.wheel.1": { ko: "AI 자동 수익", en: "AI Auto Revenue", zh: "AI自动收益", ja: "AI自動収益", vi: "AI Thu nhập tự động", th: "AI รายได้อัตโนมัติ" },
  "fly.wheel.2": { ko: "지갑 잔고 증가", en: "Wallet Balance Up", zh: "钱包余额增加", ja: "ウォレット残高増加", vi: "Số dư ví tăng", th: "ยอดกระเป๋าเพิ่ม" },
  "fly.wheel.3": { ko: "게임 참여", en: "Game Participation", zh: "游戏参与", ja: "ゲーム参加", vi: "Tham gia game", th: "เข้าร่วมเกม" },
  "fly.wheel.4": { ko: "수수료 발생", en: "Fees Generated", zh: "手续费产生", ja: "手数料発生", vi: "Phát sinh phí", th: "เกิดค่าธรรมเนียม" },
  "fly.wheel.5": { ko: "수익 풀 확장", en: "Revenue Pool Expansion", zh: "收益池扩大", ja: "収益プール拡張", vi: "Mở rộng pool lợi nhuận", th: "ขยาย Revenue Pool" },
  "fly.wheel.6": { ko: "커뮤니티 성장", en: "Community Growth", zh: "社区增长", ja: "コミュニティ成長", vi: "Tăng trưởng cộng đồng", th: "ชุมชนเติบโต" },
  "fly.pillar1": { ko: "회사 이익", en: "Company Revenue", zh: "公司收益", ja: "会社利益", vi: "Doanh thu công ty", th: "รายได้บริษัท" },
  "fly.pillar1.summary": { ko: "안정적 플랫폼 운영 기반", en: "Stable platform operation base", zh: "稳定的平台运营基础", ja: "安定したプラットフォーム運営基盤", vi: "Nền tảng vận hành ổn định", th: "ฐานการดำเนินงานแพลตฟอร์มที่มั่นคง" },
  "fly.pillar2": { ko: "개인 수익", en: "Personal Revenue", zh: "个人收益", ja: "個人収益", vi: "Thu nhập cá nhân", th: "รายได้ส่วนตัว" },
  "fly.pillar2.summary": { ko: "자동화된 자산 증식", en: "Automated asset growth", zh: "自动化资产增值", ja: "自動化された資産増殖", vi: "Tăng trưởng tài sản tự động", th: "การเติบโตของสินทรัพย์อัตโนมัติ" },
  "fly.pillar3": { ko: "팀 수익", en: "Team Revenue", zh: "团队收益", ja: "チーム収益", vi: "Thu nhập nhóm", th: "รายได้ทีม" },
  "fly.pillar3.summary": { ko: "커뮤니티 확장의 핵심 동력", en: "Core driver of community expansion", zh: "社区扩展的核心动力", ja: "コミュニティ拡張の核心動力", vi: "Động lực cốt lõi mở rộng cộng đồng", th: "แรงขับเคลื่อนหลักในการขยายชุมชน" },
  "fly.summary.title": { ko: "수익 구조 한눈에 정리", en: "Revenue Structure at a Glance", zh: "收益结构一目了然", ja: "収益構造一目で整理", vi: "Tổng quan cấu trúc doanh thu", th: "โครงสร้างรายได้โดยรวม" },
  "fly.summary.h1": { ko: "수익 유형", en: "Revenue Type", zh: "收益类型", ja: "収益タイプ", vi: "Loại doanh thu", th: "ประเภทรายได้" },
  "fly.summary.h2": { ko: "핵심 내용", en: "Key Content", zh: "核心内容", ja: "核心内容", vi: "Nội dung chính", th: "เนื้อหาหลัก" },
  "fly.summary.h3": { ko: "최대 수익률/비율", en: "Max Rate/Ratio", zh: "最高收益率/比例", ja: "最大収益率/比率", vi: "Tỷ lệ tối đa", th: "อัตราสูงสุด" },
  "fly.quote": {
    ko: '"내가 벌면 → 플랫폼이 커지고 → 플랫폼이 커지면 → 내가 더 많이 번다"',
    en: '"I earn → Platform grows → Platform grows → I earn more"',
    zh: '"我赚钱 → 平台壮大 → 平台壮大 → 我赚更多"',
    ja: '"私が稼ぐ → プラットフォームが大きくなる → プラットフォームが大きくなる → 私がもっと稼ぐ"',
    vi: '"Tôi kiếm tiền → Nền tảng lớn lên → Nền tảng lớn lên → Tôi kiếm nhiều hơn"',
    th: '"ฉันหาเงิน → แพลตฟอร์มเติบโต → แพลตฟอร์มเติบโต → ฉันหาเงินได้มากขึ้น"',
  },
  "fly.quote.desc": {
    ko: "사용자의 수익 활동과 게임 참여가 플랫폼의 가치를 높이고, 높아진 가치가 다시 사용자에게 더 큰 보상으로 돌아가는 무한 확장형 생태계",
    en: "Users' revenue activities and game participation increase platform value, and increased value returns to users as greater rewards — an infinitely expanding ecosystem",
    zh: "用户的收益活动和游戏参与提升平台价值，提升的价值又以更大的奖励回馈用户的无限扩展生态系统",
    ja: "ユーザーの収益活動とゲーム参加がプラットフォームの価値を高め、高まった価値が再びユーザーにより大きな報酬として戻る無限拡張型エコシステム",
    vi: "Hoạt động kiếm lợi nhuận và tham gia game của người dùng tăng giá trị nền tảng, giá trị tăng lên quay lại người dùng dưới dạng phần thưởng lớn hơn",
    th: "กิจกรรมสร้างรายได้และการเข้าร่วมเกมของผู้ใช้เพิ่มมูลค่าแพลตฟอร์ม มูลค่าที่เพิ่มขึ้นกลับคืนสู่ผู้ใช้เป็นรางวัลที่มากขึ้น",
  },
  "fly.cta": { ko: "지금 XPLAY 시작하기 →", en: "Start XPLAY Now →", zh: "立即开始XPLAY →", ja: "今すぐXPLAYを始める →", vi: "Bắt đầu XPLAY ngay →", th: "เริ่ม XPLAY เลย →" },

  // Flywheel bottom referral area
  "fly.share.title": { ko: "지인에게 공유하기", en: "Share with Friends", zh: "分享给朋友", ja: "友達に共有する", vi: "Chia sẻ với bạn bè", th: "แชร์ให้เพื่อน" },
  "fly.share.desc": { ko: "레퍼럴 링크가 포함된 이 페이지를 지인에게 공유하세요", en: "Share this page with your referral link to friends", zh: "将包含推荐链接的此页面分享给朋友", ja: "リファラルリンク付きのこのページを友達に共有しましょう", vi: "Chia sẻ trang này có chứa liên kết giới thiệu cho bạn bè", th: "แชร์หน้านี้พร้อมลิงก์แนะนำให้เพื่อน" },
  "fly.share.btn": { ko: "이 페이지 공유하기", en: "Share This Page", zh: "分享此页面", ja: "このページを共有", vi: "Chia sẻ trang này", th: "แชร์หน้านี้" },
  "fly.share.copied": { ko: "링크가 복사되었습니다!", en: "Link copied!", zh: "链接已复制！", ja: "リンクがコピーされました！", vi: "Đã sao chép liên kết!", th: "คัดลอกลิงก์แล้ว!" },
  "fly.referral.input.title": { ko: "나의 레퍼럴 링크", en: "My Referral Link", zh: "我的推荐链接", ja: "マイリファラルリンク", vi: "Liên kết giới thiệu của tôi", th: "ลิงก์แนะนำของฉัน" },
  "fly.referral.input.placeholder": { ko: "레퍼럴 링크를 입력하세요", en: "Enter your referral link", zh: "请输入推荐链接", ja: "リファラルリンクを入力", vi: "Nhập liên kết giới thiệu", th: "กรอกลิงก์แนะนำ" },
  "fly.referral.save": { ko: "등록", en: "Save", zh: "注册", ja: "登録", vi: "Lưu", th: "บันทึก" },
  "fly.referral.saved": { ko: "등록 완료!", en: "Saved!", zh: "注册成功！", ja: "登録完了！", vi: "Đã lưu!", th: "บันทึกแล้ว!" },

  // Resources Section
  "res.badge": { ko: "Resources", en: "Resources", zh: "Resources", ja: "Resources", vi: "Resources", th: "Resources" },
  "res.title": { ko: "자료실", en: "Resource Center", zh: "资料中心", ja: "資料室", vi: "Trung tâm tài liệu", th: "ศูนย์ข้อมูล" },
  "res.subtitle": {
    ko: "XPLAY 프로젝트의 핵심 자료를 다운로드하고, 소개 영상을 확인하세요",
    en: "Download XPLAY project materials and watch introduction videos",
    zh: "下载XPLAY项目核心资料，观看介绍视频",
    ja: "XPLAYプロジェクトの核心資料をダウンロードし、紹介動画をご確認ください",
    vi: "Tải tài liệu dự án XPLAY và xem video giới thiệu",
    th: "ดาวน์โหลดเอกสารโครงการ XPLAY และดูวิดีโอแนะนำ",
  },
  "res.docs": { ko: "문서 자료", en: "Documents", zh: "文档资料", ja: "文書資料", vi: "Tài liệu", th: "เอกสาร" },
  "res.video": { ko: "소개 영상", en: "Introduction Video", zh: "介绍视频", ja: "紹介動画", vi: "Video giới thiệu", th: "วิดีโอแนะนำ" },
  "res.download": { ko: "다운로드", en: "Download", zh: "下载", ja: "ダウンロード", vi: "Tải xuống", th: "ดาวน์โหลด" },
  "res.notion": { ko: "노션에서 전체 자료 보기", en: "View all materials on Notion", zh: "在Notion查看全部资料", ja: "Notionで全資料を見る", vi: "Xem tất cả tài liệu trên Notion", th: "ดูเอกสารทั้งหมดบน Notion" },

  // Blog
  "res.blog": { ko: "블로그", en: "Blog", zh: "博客", ja: "ブログ", vi: "Blog", th: "บล็อก" },
  "res.blog.title": { ko: "XPLAY 상세 분석 블로그", en: "XPLAY Detailed Analysis Blog", zh: "XPLAY详细分析博客", ja: "XPLAY詳細分析ブログ", vi: "Blog phân tích chi tiết XPLAY", th: "บล็อกวิเคราะห์ XPLAY โดยละเอียด" },
  "res.blog.read": { ko: "블로그 읽기", en: "Read Blog", zh: "阅读博客", ja: "ブログを読む", vi: "Đọc blog", th: "อ่านบล็อก" },
  "res.noData": { ko: "등록된 자료가 없습니다", en: "No resources available", zh: "暂无资料", ja: "資料がありません", vi: "Không có tài liệu", th: "ไม่มีข้อมูล" },
  "res.readMore": { ko: "자세히 보기", en: "Read More", zh: "查看详情", ja: "詳細を見る", vi: "Xem thêm", th: "อ่านเพิ่มเติม" },
  "res.all": { ko: "전체", en: "All", zh: "全部", ja: "全て", vi: "Tất cả", th: "ทั้งหมด" },
  "res.watchVideo": { ko: "영상 보기", en: "Watch Video", zh: "观看视频", ja: "動画を見る", vi: "Xem video", th: "ดูวิดีโอ" },

  // Referral modal
  "referral.modal.title": { ko: "나의 레퍼럴 링크 설정", en: "Set My Referral Link", zh: "设置我的推荐链接", ja: "マイリファラルリンク設定", vi: "Cài đặt liên kết giới thiệu", th: "ตั้งค่าลิงก์แนะนำ" },
  "referral.modal.desc": {
    ko: "레퍼럴 링크를 입력하면 모든 CTA 버튼이 해당 링크로 변경됩니다. 이 페이지를 지인에게 공유하세요!",
    en: "Enter your referral link and all CTA buttons will change to that link. Share this page with friends!",
    zh: "输入推荐链接后，所有CTA按钮将更改为该链接。将此页面分享给朋友！",
    ja: "リファラルリンクを入力すると、すべてのCTAボタンがそのリンクに変更されます。このページを知人に共有しましょう！",
    vi: "Nhập liên kết giới thiệu, tất cả nút CTA sẽ đổi sang liên kết đó. Chia sẻ trang này cho bạn bè!",
    th: "กรอกลิงก์แนะนำ ปุ่ม CTA ทั้งหมดจะเปลี่ยนเป็นลิงก์นั้น แชร์หน้านี้ให้เพื่อน!",
  },
  "referral.modal.placeholder": { ko: "https://app.xplaybot.com/ref/...", en: "https://app.xplaybot.com/ref/...", zh: "https://app.xplaybot.com/ref/...", ja: "https://app.xplaybot.com/ref/...", vi: "https://app.xplaybot.com/ref/...", th: "https://app.xplaybot.com/ref/..." },
  "referral.modal.save": { ko: "저장", en: "Save", zh: "保存", ja: "保存", vi: "Lưu", th: "บันทึก" },
  "referral.modal.reset": { ko: "초기화", en: "Reset", zh: "重置", ja: "リセット", vi: "Đặt lại", th: "รีเซ็ต" },
  "referral.modal.share": { ko: "링크 복사 & 공유", en: "Copy Link & Share", zh: "复制链接并分享", ja: "リンクコピー＆共有", vi: "Sao chép & chia sẻ liên kết", th: "คัดลอกลิงก์ & แชร์" },
  "referral.modal.copied": { ko: "복사 완료!", en: "Copied!", zh: "已复制！", ja: "コピー完了！", vi: "Đã sao chép!", th: "คัดลอกแล้ว!" },
  "referral.modal.tokenpocket": { ko: "레퍼럴은 토큰포켓과 같은 dApp에서 복사해서 붙여넣기하세요.", en: "Copy your referral from a dApp like TokenPocket and paste it here.", zh: "请从TokenPocket等dApp中复制推荐链接并粘贴。", ja: "リファラルはTokenPocketなどのdAppからコピーして貼り付けてください。", vi: "Sao chép liên kết giới thiệu từ dApp như TokenPocket và dán vào đây.", th: "คัดลอกลิงก์แนะนำจาก dApp เช่น TokenPocket แล้ววางที่นี่" },

  // Referral button
  "referral.btn": { ko: "레퍼럴 설정", en: "Referral", zh: "推荐设置", ja: "リファラル設定", vi: "Cài đặt giới thiệu", th: "ตั้งค่าแนะนำ" },

  // Flywheel summary rows
  "fly.sum.r1": { ko: "회사 수익", en: "Company Revenue", zh: "公司收益", ja: "会社収益", vi: "Doanh thu công ty", th: "รายได้บริษัท" },
  "fly.sum.r1.content": { ko: "믹싱 + 퀀트 + 마켓메이킹 + GameFi", en: "Mixing + Quant + Market Making + GameFi", zh: "混币 + 量化 + 做市 + GameFi", ja: "ミキシング + クオンツ + マーケットメイキング + GameFi", vi: "Mixing + Quant + Market Making + GameFi", th: "Mixing + Quant + Market Making + GameFi" },
  "fly.sum.r1.rate": { ko: "3.2% ~ 9%", en: "3.2% ~ 9%", zh: "3.2% ~ 9%", ja: "3.2% ~ 9%", vi: "3.2% ~ 9%", th: "3.2% ~ 9%" },
  "fly.sum.r2": { ko: "개인 수익", en: "Personal Revenue", zh: "个人收益", ja: "個人収益", vi: "Thu nhập cá nhân", th: "รายได้ส่วนตัว" },
  "fly.sum.r2.content": { ko: "AI 봇 자동 수익 (5종)", en: "AI Bot Auto Revenue (5 types)", zh: "AI机器人自动收益（5种）", ja: "AIボット自動収益（5種）", vi: "AI Bot tự động (5 loại)", th: "AI Bot อัตโนมัติ (5 ประเภท)" },
  "fly.sum.r2.rate": { ko: "최대 1.8%/일", en: "Max 1.8%/day", zh: "最高1.8%/天", ja: "最大1.8%/日", vi: "Tối đa 1.8%/ngày", th: "สูงสุด 1.8%/วัน" },
  "fly.sum.r3": { ko: "직추천 수익", en: "Referral Revenue", zh: "推荐收益", ja: "紹介報酬", vi: "Thu nhập giới thiệu", th: "รายได้แนะนำ" },
  "fly.sum.r3.content": { ko: "6세대 깊이 보상", en: "6-generation depth rewards", zh: "6代深度奖励", ja: "6世代深度報酬", vi: "Phần thưởng 6 thế hệ", th: "รางวัล 6 ระดับ" },
  "fly.sum.r3.rate": { ko: "최대 10%", en: "Max 10%", zh: "最高10%", ja: "最大10%", vi: "Tối đa 10%", th: "สูงสุด 10%" },
  "fly.sum.r4": { ko: "팀 수익", en: "Team Revenue", zh: "团队收益", ja: "チーム収益", vi: "Thu nhập nhóm", th: "รายได้ทีม" },
  "fly.sum.r4.content": { ko: "V1~V8 커뮤니티 파트너", en: "V1~V8 Community Partners", zh: "V1~V8社区合伙人", ja: "V1~V8コミュニティパートナー", vi: "V1~V8 Đối tác cộng đồng", th: "V1~V8 พาร์ทเนอร์ชุมชน" },
  "fly.sum.r4.rate": { ko: "최대 80%", en: "Max 80%", zh: "最高80%", ja: "最大80%", vi: "Tối đa 80%", th: "สูงสุด 80%" },
  "fly.sum.r5": { ko: "XP 토큰", en: "XP Token", zh: "XP代币", ja: "XPトークン", vi: "XP Token", th: "XP Token" },
  "fly.sum.r5.content": { ko: "극단적 디플레이션 모델", en: "Extreme Deflation Model", zh: "极端通缩模型", ja: "極端デフレモデル", vi: "Mô hình giảm phát cực đoan", th: "โมเดลเงินฝืดสุดขีด" },
  "fly.sum.r5.rate": { ko: "21M → 1M 소각", en: "21M → 1M Burn", zh: "21M → 1M 销毁", ja: "21M → 1M バーン", vi: "21M → 1M Đốt", th: "21M → 1M เผา" },

  // Simulator
  "sim.badge": { ko: "수익 시뮬레이터", en: "Revenue Simulator", zh: "收益模拟器", ja: "収益シミュレーター", vi: "Mô phỏng lợi nhuận", th: "จำลองรายได้" },
  "sim.title": { ko: "수익 시뮬레이터", en: "Revenue Simulator", zh: "收益模拟器", ja: "収益シミュレーター", vi: "Mô phỏng lợi nhuận", th: "จำลองรายได้" },
  "sim.subtitle": { ko: "투자금액을 입력하면 봇별 예상 수익을 자동으로 계산합니다", en: "Enter your investment amount to calculate estimated returns by bot", zh: "输入投资金额，自动计算各机器人的预期收益", ja: "投資額を入力すると、ボット別の予想収益を自動計算します", vi: "Nhập số tiền đầu tư để tính lợi nhuận ước tính theo bot", th: "กรอกจำนวนเงินลงทุนเพื่อคำนวณผลตอบแทนโดยประมาณ" },
  "sim.input.label": { ko: "투자금액 (USDT)", en: "Investment Amount (USDT)", zh: "投资金额 (USDT)", ja: "投資額 (USDT)", vi: "Số tiền đầu tư (USDT)", th: "จำนวนเงินลงทุน (USDT)" },
  "sim.bot.label": { ko: "AI 스테이킹 봇 선택", en: "Select AI Staking Bot", zh: "选择AI质押机器人", ja: "AIステーキングボット選択", vi: "Chọn AI Staking Bot", th: "เลือก AI Staking Bot" },
  "sim.result.daily": { ko: "일일 예상 수익", en: "Est. Daily Return", zh: "预计日收益", ja: "予想日次収益", vi: "Lợi nhuận hàng ngày", th: "ผลตอบแทนรายวัน" },
  "sim.result.monthly": { ko: "월 예상 수익", en: "Est. Monthly Return", zh: "预计月收益", ja: "予想月次収益", vi: "Lợi nhuận hàng tháng", th: "ผลตอบแทนรายเดือน" },
  "sim.result.total": { ko: "총 예상 수익", en: "Est. Total Return", zh: "预计总收益", ja: "予想総収益", vi: "Tổng lợi nhuận", th: "ผลตอบแทนรวม" },
  "sim.result.days": { ko: "일", en: " days", zh: "天", ja: "日", vi: " ngày", th: " วัน" },
  "sim.detail.title": { ko: "상세 수익 분석", en: "Detailed Revenue Analysis", zh: "详细收益分析", ja: "詳細収益分析", vi: "Phân tích chi tiết", th: "วิเคราะห์รายละเอียด" },
  "sim.detail.item": { ko: "항목", en: "Item", zh: "项目", ja: "項目", vi: "Hạng mục", th: "รายการ" },
  "sim.detail.min": { ko: "최소", en: "Min", zh: "最低", ja: "最小", vi: "Tối thiểu", th: "ต่ำสุด" },
  "sim.detail.max": { ko: "최대", en: "Max", zh: "最高", ja: "最大", vi: "Tối đa", th: "สูงสุด" },
  "sim.detail.invest": { ko: "투자금", en: "Investment", zh: "投资金额", ja: "投資額", vi: "Đầu tư", th: "เงินลงทุน" },
  "sim.detail.dailyNet": { ko: "일일 순수익", en: "Daily Net Return", zh: "日净收益", ja: "日次純収益", vi: "Lợi nhuận ròng/ngày", th: "ผลตอบแทนสุทธิ/วัน" },
  "sim.detail.monthlyNet": { ko: "월 순수익", en: "Monthly Net Return", zh: "月净收益", ja: "月次純収益", vi: "Lợi nhuận ròng/tháng", th: "ผลตอบแทนสุทธิ/เดือน" },
  "sim.detail.periodTotal": { ko: "기간 총 수익", en: "Period Total Return", zh: "期间总收益", ja: "期間総収益", vi: "Tổng lợi nhuận kỳ hạn", th: "ผลตอบแทนรวมตามระยะเวลา" },
  "sim.tax.title": { ko: "세금 예상 (한국 기준)", en: "Tax Estimation (Korea)", zh: "税务估算（韩国标准）", ja: "税金予想（韓国基準）", vi: "Ước tính thuế (Hàn Quốc)", th: "ประมาณการภาษี (เกาหลี)" },
  "sim.tax.gain": { ko: "예상 총 수익 (KRW)", en: "Est. Total Gain (KRW)", zh: "预计总收益 (KRW)", ja: "予想総収益 (KRW)", vi: "Tổng lợi nhuận (KRW)", th: "กำไรรวม (KRW)" },
  "sim.tax.amount": { ko: "예상 세금 (22%)", en: "Est. Tax (22%)", zh: "预计税款 (22%)", ja: "予想税金 (22%)", vi: "Thuế ước tính (22%)", th: "ภาษีโดยประมาณ (22%)" },
  "sim.tax.afterTax": { ko: "세후 순수익", en: "After-Tax Net Gain", zh: "税后净收益", ja: "税引後純利益", vi: "Lợi nhuận sau thuế", th: "กำไรสุทธิหลังหักภาษี" },
  "sim.tax.note": { ko: "한국 가상자산 과세 기준: 연간 수익 250만원 기본공제 후 22%(소득세 20% + 지방세 2%) 적용. 환율 1 USD = 1,350 KRW 기준. 실제 세금은 개인 상황과 세법 변경에 따라 달라질 수 있으므로 세무 전문가와 상담하시기 바랍니다.", en: "Based on Korean crypto tax: 22% (20% income tax + 2% local tax) on gains exceeding 2.5M KRW basic deduction. Exchange rate: 1 USD = 1,350 KRW. Actual taxes may vary based on individual circumstances and tax law changes. Please consult a tax professional.", zh: "基于韩国加密货币税：超过250万韩元基本扣除后按22%（20%所得税+2%地方税）征收。汇率：1 USD = 1,350 KRW。实际税款可能因个人情况和税法变更而异，请咨询税务专家。", ja: "韓国の仮想資産課税基準：年間収益250万ウォン基本控除後22%（所得税20%+地方税2%）適用。為替レート1 USD = 1,350 KRW基準。実際の税金は個人の状況や税法の変更により異なる場合があります。税務専門家にご相談ください。", vi: "Dựa trên thuế tiền điện tử Hàn Quốc: 22% (20% thuế thu nhập + 2% thuế địa phương) trên lợi nhuận vượt quá 2.5 triệu KRW khấu trừ cơ bản. Tỷ giá: 1 USD = 1,350 KRW. Thuế thực tế có thể thay đổi. Vui lòng tham khảo chuyên gia thuế.", th: "ตามภาษีคริปโตเกาหลี: 22% (ภาษีเงินได้ 20% + ภาษีท้องถิ่น 2%) สำหรับกำไรที่เกิน 2.5 ล้านวอนหักลดหย่อนพื้นฐาน อัตราแลกเปลี่ยน: 1 USD = 1,350 KRW ภาษีจริงอาจแตกต่างกัน กรุณาปรึกษาผู้เชี่ยวชาญด้านภาษี" },

  // Simulator fee notice
  "sim.feeNotice1": { ko: "플랫폼 수수료 20% 미제외 금액입니다", en: "Amounts shown before 20% platform fee deduction", zh: "金额未扣除20%平台手续费", ja: "プラットフォーム手数料20%未控除の金額です", vi: "Số tiền chưa trừ phí nền tảng 20%", th: "จำนวนเงินก่อนหักค่าธรรมเนียมแพลตฟอร์ม 20%" },
  "sim.feeNotice2": { ko: "플랫폼 수수료는 변동 될 수 있습니다.", en: "Platform fees are subject to change.", zh: "平台手续费可能会变动。", ja: "プラットフォーム手数料は変動する場合があります。", vi: "Phí nền tảng có thể thay đổi.", th: "ค่าธรรมเนียมแพลตฟอร์มอาจเปลี่ยนแปลงได้" },

  // Nav simulator
  "nav.simulator": { ko: "시뮬레이터", en: "Simulator", zh: "模拟器", ja: "シミュレーター", vi: "Mô phỏng", th: "จำลอง" },

  // Footer
  "footer.tagline": { ko: "XPLAY — AI 자동 수익 × GameFi 듀얼 엔진", en: "XPLAY — AI Auto Revenue × GameFi Dual Engine", zh: "XPLAY — AI自动收益 × GameFi双引擎", ja: "XPLAY — AI自動収益 × GameFiデュアルエンジン", vi: "XPLAY — AI Thu nhập tự động × GameFi Dual Engine", th: "XPLAY — AI รายได้อัตโนมัติ × GameFi Dual Engine" },
  "footer.site": { ko: "공식 사이트:", en: "Official Site:", zh: "官方网站：", ja: "公式サイト：", vi: "Trang chính thức:", th: "เว็บไซต์อย่างเป็นทางการ:" },
  "footer.telegram": { ko: "텔레그램:", en: "Telegram:", zh: "Telegram：", ja: "テレグラム：", vi: "Telegram:", th: "Telegram:" },
  // Referral flow
  "ref.flow.check": { ko: "추천링크를 확인하세요", en: "Please check your referral link", zh: "请确认您的推荐链接", ja: "紹介リンクを確認してください", vi: "Vui lòng kiểm tra liên kết giới thiệu", th: "กรุณาตรวจสอบลิงก์แนะนำ" },
  "ref.flow.check.desc": { ko: "XPLAY를 시작하려면 추천링크가 필요합니다. 추천링크를 받으셨나요?", en: "You need a referral link to start XPLAY. Have you received one?", zh: "开始XPLAY需要推荐链接。您收到了吗？", ja: "XPLAYを始めるには紹介リンクが必要です。受け取りましたか？", vi: "Bạn cần liên kết giới thiệu để bắt đầu XPLAY. Bạn đã nhận được chưa?", th: "คุณต้องมีลิงก์แนะนำเพื่อเริ่ม XPLAY คุณได้รับแล้วหรือยัง?" },
  "ref.flow.confirmed": { ko: "추천링크를 확인했습니다", en: "Referral link confirmed", zh: "已确认推荐链接", ja: "紹介リンクを確認しました", vi: "Đã xác nhận liên kết giới thiệu", th: "ยืนยันลิงก์แนะนำแล้ว" },
  "ref.flow.enter": { ko: "추천링크 입력하기", en: "Enter referral link", zh: "输入推荐链接", ja: "紹介リンクを入力", vi: "Nhập liên kết giới thiệu", th: "กรอกลิงก์แนะนำ" },
  "ref.flow.warning": { ko: "주의: 다른 사람의 추천링크로 등록되어 있습니다!\n지인에게 전송하려면 반드시 자신의 추천링크로 변경하세요.", en: "Warning: A different referral link is registered!\nTo share with friends, please change to your own referral link.", zh: "注意：已注册了其他人的推荐链接！\n要分享给朋友，请更改为您自己的推荐链接。", ja: "注意：他の人の紹介リンクが登録されています！\n友達に送るには、自分の紹介リンクに変更してください。", vi: "Cảnh báo: Liên kết giới thiệu của người khác đã được đăng ký!\nĐể chia sẻ với bạn bè, vui lòng thay đổi thành liên kết giới thiệu của bạn.", th: "คำเตือน: ลิงก์แนะนำของคนอื่นถูกลงทะเบียนแล้ว!\nหากต้องการแชร์ให้เพื่อน กรุณาเปลี่ยนเป็นลิงก์แนะนำของคุณเอง" },
  "ref.flow.change.mine": { ko: "자신의 추천링크 넣기", en: "Enter my referral link", zh: "输入我的推荐链接", ja: "自分の紹介リンクを入力", vi: "Nhập liên kết giới thiệu của tôi", th: "กรอกลิงก์แนะนำของฉัน" },
  "ref.flow.go": { ko: "XPLAY 바로가기", en: "Go to XPLAY", zh: "前往XPLAY", ja: "XPLAYへ移動", vi: "Đi đến XPLAY", th: "ไปที่ XPLAY" },
  "ref.flow.share.now": { ko: "지금 공유하기", en: "Share Now", zh: "立即分享", ja: "今すぐ共有", vi: "Chia sẻ ngay", th: "แชร์เลย" },
  "share.select": { ko: "공유 방법 선택", en: "Choose how to share", zh: "选择分享方式", ja: "共有方法を選択", vi: "Chọn cách chia sẻ", th: "เลือกวิธีแชร์" },
  "share.copy.link": { ko: "링크 복사", en: "Copy Link", zh: "复制链接", ja: "リンクをコピー", vi: "Sao chép liên kết", th: "คัดลอกลิงก์" },
  "share.kakao": { ko: "카카오톡", en: "KakaoTalk", zh: "KakaoTalk", ja: "KakaoTalk", vi: "KakaoTalk", th: "KakaoTalk" },
  "share.telegram": { ko: "텔레그램", en: "Telegram", zh: "Telegram", ja: "Telegram", vi: "Telegram", th: "Telegram" },
  "share.line": { ko: "라인", en: "LINE", zh: "LINE", ja: "LINE", vi: "LINE", th: "LINE" },
  "share.whatsapp": { ko: "왓츠앱", en: "WhatsApp", zh: "WhatsApp", ja: "WhatsApp", vi: "WhatsApp", th: "WhatsApp" },
  "share.twitter": { ko: "X (트위터)", en: "X (Twitter)", zh: "X (Twitter)", ja: "X (Twitter)", vi: "X (Twitter)", th: "X (Twitter)" },
  "share.msg": { ko: "XPLAY - AI 자동 수익 × GameFi 듀얼 엔진! 지금 시작하세요.", en: "XPLAY - AI Auto Revenue × GameFi Dual Engine! Start now.", zh: "XPLAY - AI自动收益 × GameFi双引擎！立即开始。", ja: "XPLAY - AI自動収益 × GameFiデュアルエンジン！今すぐ始めましょう。", vi: "XPLAY - AI tự động thu nhập × GameFi Dual Engine! Bắt đầu ngay.", th: "XPLAY - AI รายได้อัตโนมัติ × GameFi Dual Engine! เริ่มเลย" },
  // TokenPocket deep link & simplified referral
  "hero.open.tokenpocket": { ko: "TokenPocket으로 열기", en: "Open in TokenPocket", zh: "在TokenPocket中打开", ja: "TokenPocketで開く", vi: "Mở trong TokenPocket", th: "เปิดใน TokenPocket" },
  "hero.open.browser": { ko: "브라우저로 열기", en: "Open in Browser", zh: "在浏览器中打开", ja: "ブラウザで開く", vi: "Mở trong trình duyệt", th: "เปิดในเบราว์เซอร์" },
  "ref.copy.btn": { ko: "복사", en: "Copy", zh: "复制", ja: "コピー", vi: "Sao chép", th: "คัดลอก" },
  "ref.copy.done": { ko: "복사됨!", en: "Copied!", zh: "已复制！", ja: "コピー済み！", vi: "Đã sao chép!", th: "คัดลอกแล้ว!" },
  "ref.from.friend": { ko: "추천인의 레퍼럴 링크", en: "Referral link from friend", zh: "来自朋友的推荐链接", ja: "友達からの紹介リンク", vi: "Liên kết giới thiệu từ bạn bè", th: "ลิงก์แนะนำจากเพื่อน" },
  "ref.simple.title": { ko: "추천링크 입력", en: "Enter Referral Link", zh: "输入推荐链接", ja: "紹介リンク入力", vi: "Nhập liên kết giới thiệu", th: "กรอกลิงก์แนะนำ" },
  "ref.simple.desc": { ko: "XPLAY 시작을 위해 추천인의 레퍼럴 링크를 입력하세요", en: "Enter your referrer's link to start XPLAY", zh: "请输入推荐人的链接以开始XPLAY", ja: "XPLAYを始めるために紹介者のリンクを入力してください", vi: "Nhập liên kết giới thiệu để bắt đầu XPLAY", th: "กรอกลิงก์แนะนำเพื่อเริ่ม XPLAY" },
  "ref.simple.skip": { ko: "추천링크 없이 시작", en: "Start without referral", zh: "无推荐链接开始", ja: "紹介リンクなしで始める", vi: "Bắt đầu không có liên kết", th: "เริ่มโดยไม่มีลิงก์แนะนำ" },
  "ref.simple.save.go": { ko: "저장 후 XPLAY 시작", en: "Save & Start XPLAY", zh: "保存并开始XPLAY", ja: "保存してXPLAY開始", vi: "Lưu & Bắt đầu XPLAY", th: "บันทึก & เริ่ม XPLAY" },
  "tp.or.browser": { ko: "TokenPocket 또는 브라우저에서 열기", en: "Open in TokenPocket or Browser", zh: "在TokenPocket或浏览器中打开", ja: "TokenPocketまたはブラウザで開く", vi: "Mở trong TokenPocket hoặc trình duyệt", th: "เปิดใน TokenPocket หรือเบราว์เซอร์" },

  // Roadmap Section
  "nav.roadmap": { ko: "로드맵", en: "Roadmap", zh: "路线图", ja: "ロードマップ", vi: "Lộ trình", th: "แผนงาน" },
  "nav.livefeed": { ko: "실시간 매출", en: "Live Feed", zh: "实时动态", ja: "ライブフィード", vi: "Bảng tin trực tiếp", th: "ฟีดสด" },
  "nav.media": { ko: "미디어", en: "Media", zh: "媒体", ja: "メディア", vi: "Media", th: "สื่อ" },
  "nav.livechat": { ko: "라이브 채팅", en: "Live Chat", zh: "实时聊天", ja: "ライブチャット", vi: "Chat trực tiếp", th: "แชทสด" },
  "nav.announcements": { ko: "공지방", en: "Notices", zh: "公告", ja: "お知らせ", vi: "Thông báo", th: "ประกาศ" },
  "nav.leaderReferral": { ko: "리더 추천", en: "Leader Referral", zh: "领袖推荐", ja: "リーダー紹介", vi: "Giới thiệu lãnh đạo", th: "แนะนำผู้นำ" },
  "nav.partners": { ko: "소통 파트너", en: "Partners", zh: "合作伙伴", ja: "パートナー", vi: "Đối tác", th: "พาร์ทเนอร์" },
  "road.badge": { ko: "ROADMAP", en: "ROADMAP", zh: "ROADMAP", ja: "ROADMAP", vi: "ROADMAP", th: "ROADMAP" },
  "road.title": { ko: "XPLAY 로드맵", en: "XPLAY Roadmap", zh: "XPLAY 路线图", ja: "XPLAY ロードマップ", vi: "Lộ trình XPLAY", th: "แผนงาน XPLAY" },
  "road.subtitle": { ko: "예측 플랫폼에서 AI 에이전트, Web4까지 — XPLAY의 미래 비전", en: "From prediction platform to AI Agent & Web4 — XPLAY's future vision", zh: "从预测平台到AI代理和Web4 — XPLAY的未来愿景", ja: "予測プラットフォームからAIエージェント、Web4まで — XPLAYの未来ビジョン", vi: "Từ nền tảng dự đoán đến AI Agent & Web4 — Tầm nhìn tương lai XPLAY", th: "จากแพลตฟอร์มทำนายสู่ AI Agent & Web4 — วิสัยทัศน์อนาคต XPLAY" },
  "road.phase1.title": { ko: "예측 플랫폼 시장 진출", en: "Prediction Platform Market Entry", zh: "预测平台市场进入", ja: "予測プラットフォーム市場参入", vi: "Gia nhập thị trường nền tảng dự đoán", th: "เข้าสู่ตลาดแพลตฟอร์มทำนาย" },
  "road.phase1.desc": { ko: "월드컵을 시작으로 글로벌 예측 플랫폼 시장에 진출. 이미 확보된 10만명 이상의 유저와 함께 예측 플랫폼을 운용 중입니다.", en: "Entering the global prediction platform market starting with the World Cup. Operating the prediction platform with over 100,000 secured users.", zh: "以世界杯为起点进入全球预测平台市场。已拥有超过10万用户，正在运营预测平台。", ja: "ワールドカップを皮切りにグローバル予測プラットフォーム市場に参入。すでに確保された10万人以上のユーザーと共に予測プラットフォームを運用中です。", vi: "Gia nhập thị trường nền tảng dự đoán toàn cầu bắt đầu từ World Cup. Đang vận hành nền tảng dự đoán với hơn 100.000 người dùng đã có.", th: "เข้าสู่ตลาดแพลตฟอร์มทำนายทั่วโลกเริ่มจากฟุตบอลโลก ดำเนินการแพลตฟอร์มทำนายกับผู้ใช้มากกว่า 100,000 คน" },
  "road.phase1.status": { ko: "테스트중", en: "Testing", zh: "测试中", ja: "テスト中", vi: "Đang thử nghiệm", th: "กำลังทดสอบ" },
  "road.phase1.users": { ko: "10만명+ 유저 확보", en: "100K+ Users Secured", zh: "10万+用户已确保", ja: "10万人以上のユーザー確保", vi: "100K+ người dùng đã có", th: "ผู้ใช้ 100K+ คน" },
  "road.phase2.title": { ko: "AI 에이전트 플랫폼", en: "AI Agent Platform", zh: "AI代理平台", ja: "AIエージェントプラットフォーム", vi: "Nền tảng AI Agent", th: "แพลตฟอร์ม AI Agent" },
  "road.phase2.desc": { ko: "AI를 활용한 차세대 AI 에이전트 플랫폼을 개발 중입니다. 자동화된 투자 전략과 개인 맞춤형 AI 어시스턴트를 제공합니다.", en: "Developing next-generation AI Agent platform leveraging AI technology. Providing automated investment strategies and personalized AI assistants.", zh: "正在开发利用AI技术的下一代AI代理平台。提供自动化投资策略和个性化AI助手。", ja: "AIを活用した次世代AIエージェントプラットフォームを開発中です。自動化された投資戦略と個人向けAIアシスタントを提供します。", vi: "Đang phát triển nền tảng AI Agent thế hệ tiếp theo. Cung cấp chiến lược đầu tư tự động và trợ lý AI cá nhân hóa.", th: "กำลังพัฒนาแพลตฟอร์ม AI Agent รุ่นถัดไป ให้กลยุทธ์การลงทุนอัตโนมัติและผู้ช่วย AI ส่วนตัว" },
  "road.phase2.status": { ko: "개발중", en: "In Development", zh: "开发中", ja: "開発中", vi: "Đang phát triển", th: "กำลังพัฒนา" },
  "road.phase3.title": { ko: "Web4 플랫폼", en: "Web4 Platform", zh: "Web4平台", ja: "Web4プラットフォーム", vi: "Nền tảng Web4", th: "แพลตฟอร์ม Web4" },
  "road.phase3.desc": { ko: "AI + 블록체인이 결합된 Web4 플랫폼을 개발 중입니다. 완전한 탈중앙화와 AI 자동화가 융합된 차세대 인터넷 생태계를 구축합니다.", en: "Developing Web4 platform combining AI + Blockchain. Building a next-generation internet ecosystem fusing full decentralization with AI automation.", zh: "正在开发AI+区块链结合的Web4平台。构建完全去中心化与AI自动化融合的下一代互联网生态系统。", ja: "AI+ブロックチェーンが結合されたWeb4プラットフォームを開発中です。完全な分散化とAI自動化が融合した次世代インターネットエコシステムを構築します。", vi: "Đang phát triển nền tảng Web4 kết hợp AI + Blockchain. Xây dựng hệ sinh thái internet thế hệ tiếp theo kết hợp phi tập trung hoàn toàn với tự động hóa AI.", th: "กำลังพัฒนาแพลตฟอร์ม Web4 ที่รวม AI + Blockchain สร้างระบบนิเวศอินเทอร์เน็ตรุ่นถัดไปที่รวมการกระจายอำนาจกับ AI อัตโนมัติ" },
  "road.phase3.status": { ko: "개발중", en: "In Development", zh: "开发中", ja: "開発中", vi: "Đang phát triển", th: "กำลังพัฒนา" },

  // Live Transaction Feed
  "feed.badge": { ko: "GLOBAL REVENUE", en: "GLOBAL REVENUE", zh: "全球收益", ja: "グローバル収益", vi: "DOANH THU TOÀN CẦU", th: "รายได้ทั่วโลก" },
  "feed.title": { ko: "실시간 글로벌 매출", en: "Live Global Revenue", zh: "实时全球收益", ja: "リアルタイムグローバル収益", vi: "Doanh thu toàn cầu trực tiếp", th: "รายได้ทั่วโลกแบบเรียลไทม์" },
  "feed.subtitle": { ko: "전 세계 100개국에서 실시간으로 발생하는 XPLAY 투자 현황", en: "Real-time XPLAY investments from 100 countries worldwide", zh: "来自全球100个国家的XPLAY实时投资状况", ja: "世界100カ国からのXPLAYリアルタイム投資状況", vi: "Tình hình đầu tư XPLAY thời gian thực từ 100 quốc gia", th: "สถานะการลงทุน XPLAY แบบเรียลไทม์จาก 100 ประเทศ" },
  "feed.live": { ko: "LIVE", en: "LIVE", zh: "直播", ja: "LIVE", vi: "TRỰC TIẾP", th: "สด" },
  "feed.stat.volume": { ko: "누적 유동성", en: "Total Liquidity", zh: "累计流动性", ja: "累計流動性", vi: "Tổng thanh khoản", th: "สภาพคล่องรวม" },
  "feed.stat.txcount": { ko: "거래 수", en: "Transactions", zh: "交易数", ja: "取引数", vi: "Giao dịch", th: "ธุรกรรม" },
  "feed.stat.countries": { ko: "참여 국가", en: "Countries", zh: "参与国家", ja: "参加国", vi: "Quốc gia", th: "ประเทศ" },

  // Live Chat
  "chat.badge": { ko: "GLOBAL COMMUNITY", en: "GLOBAL COMMUNITY", zh: "全球社区", ja: "グローバルコミュニティ", vi: "CỘNG ĐỒNG TOÀN CẦU", th: "ชุมชนทั่วโลก" },
  "chat.title": { ko: "실시간 Xplay 커뮤니티 채팅", en: "Live Xplay Community Chat", zh: "实时全球聊天", ja: "リアルタイムグローバルチャット", vi: "Chat toàn cầu trực tiếp", th: "แชทสดทั่วโลก" },
  "chat.subtitle": { ko: "전 세계 XPLAY 커뮤니티와 실시간으로 소통하세요", en: "Connect with the global XPLAY community in real-time", zh: "与全球XPLAY社区实时交流", ja: "世界中のXPLAYコミュニティとリアルタイムで交流", vi: "Kết nối với cộng đồng XPLAY toàn cầu", th: "เชื่อมต่อกับชุมชน XPLAY ทั่วโลก" },
  "chat.global": { ko: "XPLAY 커뮤니티 채팅", en: "XPLAY Community Chat", zh: "XPLAY全球聊天", ja: "XPLAYグローバルチャット", vi: "XPLAY Chat Toàn Cầu", th: "XPLAY แชททั่วโลก" },
  "chat.online": { ko: "온라인", en: "online", zh: "在线", ja: "オンライン", vi: "trực tuyến", th: "ออนไลน์" },
  "chat.placeholder": { ko: "메시지를 입력하세요...", en: "Type a message...", zh: "输入消息...", ja: "メッセージを入力...", vi: "Nhập tin nhắn...", th: "พิมพ์ข้อความ..." },
  "chat.you": { ko: "나", en: "You", zh: "我", ja: "あなた", vi: "Bạn", th: "คุณ" },
  "chat.autoTranslated": { ko: "메시지가 자동 번역되어 전송되었습니다:", en: "Your message was auto-translated and broadcast to", zh: "您的消息已自动翻译并广播至", ja: "メッセージが自動翻訳され送信されました：", vi: "Tin nhắn của bạn đã được tự động dịch và phát tới", th: "ข้อความของคุณถูกแปลอัตโนมัติและส่งไปยัง" },
  "chat.languages": { ko: "개 언어", en: "languages", zh: "种语言", ja: "言語", vi: "ngôn ngữ", th: "ภาษา" },

  // Media Gallery
  "media.badge": { ko: "TELEGRAM MEDIA", en: "TELEGRAM MEDIA", zh: "电报媒体", ja: "テレグラムメディア", vi: "TELEGRAM MEDIA", th: "สื่อเทเลแกรม" },
  "media.title": { ko: "텔레그램 미디어 갤러리", en: "Telegram Media Gallery", zh: "Telegram媒体画廊", ja: "テレグラムメディアギャラリー", vi: "Thư viện Media Telegram", th: "แกลเลอรีสื่อเทเลแกรม" },
  "media.subtitle": { ko: "텔레그램 공식 채널에서 공유된 최신 영상과 이미지", en: "Latest videos and images shared from official Telegram channel", zh: "来自官方Telegram频道的最新视频和图片", ja: "公式テレグラムチャンネルから共有された最新の動画と画像", vi: "Video và hình ảnh mới nhất từ kênh Telegram chính thức", th: "วิดีโอและรูปภาพล่าสุดจากช่องเทเลแกรมอย่างเป็นทางการ" },
  "media.telegram.desc": { ko: "공식 텔레그램 채널에서 최신 소식을 받아보세요", en: "Get the latest updates from our official Telegram channel", zh: "从我们的官方Telegram频道获取最新消息", ja: "公式テレグラムチャンネルで最新情報をチェック", vi: "Nhận cập nhật mới nhất từ kênh Telegram chính thức", th: "รับข่าวสารล่าสุดจากช่องเทเลแกรมอย่างเป็นทางการ" },
  "media.telegram.join": { ko: "채널 참여", en: "Join Channel", zh: "加入频道", ja: "チャンネル参加", vi: "Tham gia kênh", th: "เข้าร่วมช่อง" },
  "media.viewmore": { ko: "텔레그램에서 더 보기", en: "View More on Telegram", zh: "在Telegram查看更多", ja: "テレグラムでもっと見る", vi: "Xem thêm trên Telegram", th: "ดูเพิ่มเติมบนเทเลแกรม" },

  // Tutorial Section
  "nav.tutorial": { ko: "튜토리얼", en: "Tutorial", zh: "教程", ja: "チュートリアル", vi: "Hướng dẫn", th: "บทช่วยสอน" },
  "tutorial.badge": { ko: "TUTORIAL", en: "TUTORIAL", zh: "教程", ja: "チュートリアル", vi: "HƯỚNG DẪN", th: "บทช่วยสอน" },
  "tutorial.title": { ko: "XPLAY 튜토리얼", en: "XPLAY Tutorials", zh: "XPLAY 教程", ja: "XPLAY チュートリアル", vi: "Hướng dẫn XPLAY", th: "บทช่วยสอน XPLAY" },
  "tutorial.subtitle": { ko: "XPLAY 시작부터 수익 극대화까지 단계별 가이드", en: "Step-by-step guide from getting started to maximizing returns", zh: "从入门到收益最大化的分步指南", ja: "始め方から収益最大化まで段階的ガイド", vi: "Hướng dẫn từng bước từ bắt đầu đến tối đa hóa lợi nhuận", th: "คู่มือทีละขั้นตอนตั้งแต่เริ่มต้นจนถึงผลตอบแทนสูงสุด" },
  "tutorial.bot.title": { ko: "텔레그램 봇으로 튜토리얼 관리", en: "Manage tutorials via Telegram Bot", zh: "通过Telegram机器人管理教程", ja: "テレグラムボットでチュートリアル管理", vi: "Quản lý hướng dẫn qua Telegram Bot", th: "จัดการบทช่วยสอนผ่าน Telegram Bot" },
  "tutorial.bot.desc": { ko: "텔레그램으로 유튜브 URL과 제목을 보내면 자동으로 업데이트됩니다", en: "Send YouTube URL and title via Telegram for auto-update", zh: "通过Telegram发送YouTube URL和标题即可自动更新", ja: "テレグラムでYouTube URLとタイトルを送信すると自動更新", vi: "Gửi URL YouTube và tiêu đề qua Telegram để tự động cập nhật", th: "ส่ง URL YouTube และชื่อผ่าน Telegram เพื่ออัปเดตอัตโนมัติ" },

  // Share Warning
  "share.warning.title": { ko: "레퍼럴 확인 필요", en: "Referral Verification", zh: "推荐验证", ja: "リファラル確認", vi: "Xác minh giới thiệu", th: "ตรวจสอบการแนะนำ" },
  "share.warning.not.own": { ko: "본인의 레퍼럴이 아닙니다!", en: "This is not your referral!", zh: "这不是您的推荐链接！", ja: "あなたのリファラルではありません！", vi: "Đây không phải liên kết giới thiệu của bạn!", th: "นี่ไม่ใช่ลิงก์แนะนำของคุณ!" },
  "share.warning.desc": { ko: "현재 등록된 레퍼럴은 본인의 것이 아닙니다. 본인의 레퍼럴을 등록하고 전달하세요.", en: "The registered referral is not yours. Please register your own referral and share.", zh: "当前注册的推荐链接不是您的。请注册您自己的推荐链接后分享。", ja: "登録されたリファラルはあなたのものではありません。自分のリファラルを登録して共有してください。", vi: "Liên kết giới thiệu đã đăng ký không phải của bạn. Vui lòng đăng ký liên kết của bạn.", th: "ลิงก์แนะนำที่ลงทะเบียนไม่ใช่ของคุณ กรุณาลงทะเบียนลิงก์ของคุณ" },
  "share.warning.current": { ko: "현재 등록된 레퍼럴", en: "Currently registered referral", zh: "当前注册的推荐链接", ja: "現在登録されたリファラル", vi: "Liên kết giới thiệu hiện tại", th: "ลิงก์แนะนำปัจจุบัน" },
  "share.warning.register": { ko: "내 레퍼럴 등록하기", en: "Register My Referral", zh: "注册我的推荐链接", ja: "自分のリファラルを登録", vi: "Đăng ký liên kết của tôi", th: "ลงทะเบียนลิงก์ของฉัน" },
  "share.warning.ignore": { ko: "무시하고 진행", en: "Ignore & Proceed", zh: "忽略并继续", ja: "無視して進む", vi: "Bỏ qua & Tiếp tục", th: "ข้ามและดำเนินการต่อ" },
  "share.register.title": { ko: "내 레퍼럴 등록", en: "Register My Referral", zh: "注册我的推荐链接", ja: "自分のリファラル登録", vi: "Đăng ký liên kết của tôi", th: "ลงทะเบียนลิงก์ของฉัน" },
  "share.register.desc": { ko: "본인의 XPLAY 레퍼럴 링크를 입력하세요. 이 링크가 공유 시 포함됩니다.", en: "Enter your XPLAY referral link. This will be included when sharing.", zh: "请输入您的XPLAY推荐链接。分享时将包含此链接。", ja: "あなたのXPLAYリファラルリンクを入力してください。共有時に含まれます。", vi: "Nhập liên kết giới thiệu XPLAY của bạn. Liên kết này sẽ được bao gồm khi chia sẻ.", th: "กรอกลิงก์แนะนำ XPLAY ของคุณ ลิงก์นี้จะรวมอยู่เมื่อแชร์" },
  "share.register.save": { ko: "등록 후 공유하기", en: "Register & Share", zh: "注册并分享", ja: "登録して共有", vi: "Đăng ký & Chia sẻ", th: "ลงทะเบียน & แชร์" },

  "footer.disclaimer": { ko: "본 사이트는 프로젝트에서 제공하는 자료를 중심으로 분석 및 구성된 내용을 중심으로 제공됩니다. 모든 법적 및 투자 책임은 당사자들에게 있습니다.", en: "This site provides content based on analysis and organization of materials provided by the project. All legal and investment responsibilities lie with the parties involved.", zh: "本网站提供基于项目提供的资料进行分析和组织的内容。所有法律和投资责任由当事人承担。", ja: "本サイトはプロジェクトから提供された資料を中心に分析・構成された内容を提供します。すべての法的および投資責任は当事者にあります。", vi: "Trang web này cung cấp nội dung dựa trên phân tích và tổ chức tài liệu do dự án cung cấp. Mọi trách nhiệm pháp lý và đầu tư thuộc về các bên liên quan.", th: "เว็บไซต์นี้ให้บริการเนื้อหาที่วิเคราะห์และจัดระเบียบจากข้อมูลโครงการ ความรับผิดชอบทางกฎหมายและการลงทุนเป็นของผู้เกี่ยวข้อง" },
  "footer.infoweb4": { ko: "infoweb4를 통해 프로젝트 등록하기", en: "Register your project via infoweb4", zh: "通过infoweb4注册项目", ja: "infoweb4でプロジェクトを登録", vi: "Đăng ký dự án qua infoweb4", th: "ลงทะเบียนโครงการผ่าน infoweb4" },
};
