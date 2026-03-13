// ===================================================================
// XPLAY i18n — Multi-language support
// Languages: ko (한국어), zh (中文), ja (日本語), en (English)
// ===================================================================

export type Lang = "ko" | "zh" | "ja" | "en";

export const LANG_LABELS: Record<Lang, string> = {
  ko: "한국어",
  zh: "中文",
  ja: "日本語",
  en: "English",
};

// Helper to get browser default language
export function getDefaultLang(): Lang {
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get("lang");
  if (paramLang && ["ko", "zh", "ja", "en"].includes(paramLang)) return paramLang as Lang;

  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("ko")) return "ko";
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("ja")) return "ja";
  return "en";
}

// ===================================================================
// Translation dictionary
// ===================================================================
export const T: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.intro": { ko: "소개", zh: "介绍", ja: "紹介", en: "Intro" },
  "nav.business": { ko: "비즈니스 모델", zh: "商业模式", ja: "ビジネスモデル", en: "Business" },
  "nav.game": { ko: "BTC 예측 게임", zh: "BTC预测游戏", ja: "BTC予測ゲーム", en: "BTC Game" },
  "nav.staking": { ko: "AI 스테이킹", zh: "AI质押", ja: "AIステーキング", en: "AI Staking" },
  "nav.referral": { ko: "직추천 수익", zh: "推荐收益", ja: "紹介報酬", en: "Referral" },
  "nav.team": { ko: "팀 수익", zh: "团队收益", ja: "チーム収益", en: "Team" },
  "nav.tokenomics": { ko: "토큰 이코노믹", zh: "代币经济", ja: "トークノミクス", en: "Tokenomics" },
  "nav.flywheel": { ko: "플라이휠", zh: "飞轮效应", ja: "フライホイール", en: "Flywheel" },
  "nav.resources": { ko: "자료실", zh: "资料中心", ja: "資料室", en: "Resources" },

  // Hero
  "hero.title1": { ko: "XPLAY ", zh: "XPLAY ", ja: "XPLAY ", en: "XPLAY " },
  "hero.title2": { ko: "수익 구조", zh: "收益结构", ja: "収益構造", en: "Revenue Structure" },
  "hero.title3": { ko: "완전 분석", zh: "完全解析", ja: "完全分析", en: "Complete Analysis" },
  "hero.subtitle": {
    ko: "AI 자동 수익 엔진 × GameFi 듀얼 엔진",
    zh: "AI自动收益引擎 × GameFi双引擎",
    ja: "AI自動収益エンジン × GameFiデュアルエンジン",
    en: "AI Auto Revenue Engine × GameFi Dual Engine",
  },
  "hero.desc": {
    ko: "프로젝트 팀 수익, 개인 수익, 회사 수익 구조를 투자자 관점에서 한눈에 비교합니다",
    zh: "从投资者角度一目了然地比较项目团队收益、个人收益和公司收益结构",
    ja: "プロジェクトチーム収益、個人収益、会社収益構造を投資家の視点で一目で比較します",
    en: "Compare team revenue, personal revenue, and company revenue structures at a glance from an investor's perspective",
  },
  "hero.stat1": { ko: "일 최대 수익률", zh: "日最高收益率", ja: "日最大収益率", en: "Max Daily Return" },
  "hero.stat2": { ko: "직추천 보상", zh: "直推奖励", ja: "直接紹介報酬", en: "Referral Reward" },
  "hero.stat3": { ko: "팀 수익 배분", zh: "团队收益分配", ja: "チーム収益分配", en: "Team Distribution" },

  // Business Section
  "biz.badge": { ko: "Revenue Engine", zh: "Revenue Engine", ja: "Revenue Engine", en: "Revenue Engine" },
  "biz.title": { ko: "회사의 3대 핵심 비즈니스", zh: "公司三大核心业务", ja: "会社の3大コアビジネス", en: "3 Core Business Models" },
  "biz.subtitle": {
    ko: "XPLAY의 수익은 실제 비즈니스 모델 3가지에서 발생하며, 그 수익을 유저에게 분배합니다",
    zh: "XPLAY的收益来自3个实际商业模式，并将收益分配给用户",
    ja: "XPLAYの収益は3つの実際のビジネスモデルから発生し、その収益をユーザーに分配します",
    en: "XPLAY's revenue comes from 3 real business models, distributing profits to users",
  },
  "biz.mixing": { ko: "토큰 믹싱 엔진", zh: "代币混合引擎", ja: "トークンミキシングエンジン", en: "Token Mixing Engine" },
  "biz.mixing.desc": { ko: "블록체인 프라이버시 기술 활용, 체인 간 스왑 수수료", zh: "利用区块链隐私技术，跨链交换手续费", ja: "ブロックチェーンプライバシー技術活用、チェーン間スワップ手数料", en: "Blockchain privacy technology, cross-chain swap fees" },
  "biz.quant": { ko: "AI 계량화 트레이딩", zh: "AI量化交易", ja: "AI定量トレーディング", en: "AI Quant Trading" },
  "biz.quant.desc": { ko: "빅데이터 AI 24시간 자동 차익 실현", zh: "大数据AI 24小时自动套利", ja: "ビッグデータAI 24時間自動アービトラージ", en: "Big data AI 24/7 automated arbitrage" },
  "biz.market": { ko: "바이낸스 AI Market Making", zh: "币安AI做市", ja: "バイナンスAIマーケットメイキング", en: "Binance AI Market Making" },
  "biz.market.desc": { ko: "유동성 공급 및 수익 공유", zh: "流动性供应及收益共享", ja: "流動性供給および収益共有", en: "Liquidity provision and revenue sharing" },
  "biz.footer1": {
    ko: "이 세 가지 엔진이 플랫폼의 **지속 가능한 수익 기반**을 형성합니다.",
    zh: "这三大引擎构成了平台**可持续的收益基础**。",
    ja: "この3つのエンジンがプラットフォームの**持続可能な収益基盤**を形成します。",
    en: "These three engines form the platform's **sustainable revenue foundation**.",
  },
  "biz.footer2": {
    ko: '단순히 "코인 가격이 오르면 돈 번다"가 아니라, **실제 비즈니스에서 수익이 발생**하는 구조입니다.',
    zh: '不是简单的"币价上涨就赚钱"，而是**从实际业务中产生收益**的结构。',
    ja: '単に「コイン価格が上がれば儲かる」ではなく、**実際のビジネスから収益が発生**する構造です。',
    en: 'Not simply "make money when coin price rises", but a structure where **revenue comes from real business**.',
  },

  // Game Section
  "game.badge": { ko: "Killer Revenue Model", zh: "Killer Revenue Model", ja: "Killer Revenue Model", en: "Killer Revenue Model" },
  "game.title": { ko: "BTC 초단타 예측 게임", zh: "BTC超短线预测游戏", ja: "BTC超短期予測ゲーム", en: "BTC Short-term Prediction Game" },
  "game.subtitle": {
    ko: "게임 수수료가 회사의 핵심 자원 — 숫자가 말해줍니다",
    zh: "游戏手续费是公司的核心资源——数字说明一切",
    ja: "ゲーム手数料が会社の核心資源 — 数字が物語ります",
    en: "Game fees are the company's core resource — the numbers speak for themselves",
  },
  "game.round": { ko: "라운드 주기", zh: "轮次周期", ja: "ラウンド周期", en: "Round Cycle" },
  "game.round.sub": { ko: "/ 1분 / 5분", zh: "/ 1分钟 / 5分钟", ja: "/ 1分 / 5分", en: "/ 1min / 5min" },
  "game.users": { ko: "글로벌 목표 유저", zh: "全球目标用户", ja: "グローバル目標ユーザー", en: "Global Target Users" },
  "game.users.sub": { ko: "80,000명", zh: "80,000人", ja: "80,000人", en: "80,000 users" },
  "game.bettors": { ko: "30초당 베팅 인원", zh: "每30秒投注人数", ja: "30秒あたりベッティング人数", en: "Bettors per 30s" },
  "game.bettors.sub": { ko: "$5 베팅 (최소)", zh: "$5投注（最低）", ja: "$5ベッティング（最低）", en: "$5 bet (minimum)" },
  "game.calc.note": { ko: "30초 라운드만 계산 (1분, 5분 별도)", zh: "仅计算30秒轮次（1分钟、5分钟另计）", ja: "30秒ラウンドのみ計算（1分、5分は別途）", en: "30s rounds only (1min, 5min separate)" },
  "game.why": { ko: "왜 유저가 모이는가?", zh: "为什么用户会聚集？", ja: "なぜユーザーが集まるのか？", en: "Why do users gather?" },
  "game.why.desc": {
    ko: '매일 AI 스테이킹 봇에서 **5 USDT가 자동으로 입금**됩니다. 이 5달러로 부담 없이 예측 게임에 참여할 수 있습니다. "공짜 돈으로 게임한다"는 심리가 유저 유입의 핵심 동력입니다.',
    zh: '每天AI质押机器人会**自动存入5 USDT**。用这5美元可以无负担地参与预测游戏。"用免费的钱玩游戏"的心理是用户流入的核心动力。',
    ja: '毎日AIステーキングボットから**5 USDTが自動入金**されます。この5ドルで気軽に予測ゲームに参加できます。「タダのお金でゲームする」という心理がユーザー流入の核心動力です。',
    en: 'Every day, the AI staking bot **automatically deposits 5 USDT**. Users can participate in prediction games with this $5 without burden. The psychology of "playing with free money" is the core driver of user acquisition.',
  },
  "game.key": {
    ko: "핵심: $5든 $100이든, 유저가 베팅할 때마다 5%의 수수료가 발생하고, 이것이 회사와 소개자들의 수익이 됩니다.",
    zh: "核心：无论$5还是$100，用户每次投注都会产生5%的手续费，这就是公司和推荐人的收益来源。",
    ja: "核心：$5でも$100でも、ユーザーがベッティングするたびに5%の手数料が発生し、これが会社と紹介者の収益になります。",
    en: "Key: Whether $5 or $100, a 5% fee is generated every time a user bets, becoming revenue for the company and referrers.",
  },
  "game.lotto": { ko: "올인 로또 수익 분배 (10,000 USDT 풀 기준)", zh: "全押乐透收益分配（10,000 USDT池基准）", ja: "オールインロト収益分配（10,000 USDTプール基準）", en: "All-in Lotto Distribution (10,000 USDT Pool)" },
  "game.lotto.note": {
    ko: "91%를 유저에게 돌려주면서도, 빠른 회전율(일 240회)로 안정적인 플랫폼 수익을 창출합니다.",
    zh: "在将91%返还给用户的同时，通过快速周转率（日240次）创造稳定的平台收益。",
    ja: "91%をユーザーに還元しながらも、高速回転率（日240回）で安定したプラットフォーム収益を創出します。",
    en: "While returning 91% to users, it generates stable platform revenue through fast turnover (240 rounds/day).",
  },
  "game.lotto.h1": { ko: "구분", zh: "类别", ja: "区分", en: "Category" },
  "game.lotto.h2": { ko: "금액 (USDT)", zh: "金额 (USDT)", ja: "金額 (USDT)", en: "Amount (USDT)" },
  "game.lotto.h3": { ko: "비율", zh: "比例", ja: "比率", en: "Ratio" },
  "game.lotto.r1": { ko: "1등 (Winner)", zh: "第1名 (Winner)", ja: "1等 (Winner)", en: "1st (Winner)" },
  "game.lotto.r2": { ko: "2~10등", zh: "第2~10名", ja: "2~10等", en: "2nd~10th" },
  "game.lotto.r3": { ko: "플랫폼 수수료", zh: "平台手续费", ja: "プラットフォーム手数料", en: "Platform Fee" },

  // Staking Section
  "staking.badge": { ko: "Personal Revenue", zh: "Personal Revenue", ja: "Personal Revenue", en: "Personal Revenue" },
  "staking.title": { ko: "AI 스테이킹 봇으로 매일 자동 수익", zh: "AI质押机器人每日自动收益", ja: "AIステーキングボットで毎日自動収益", en: "Daily Auto Revenue with AI Staking Bots" },
  "staking.subtitle": {
    ko: "5가지 봇 중 투자 기간에 맞는 봇을 선택하면, AI가 자동으로 수익을 창출합니다",
    zh: "从5种机器人中选择适合投资期限的机器人，AI将自动创造收益",
    ja: "5種類のボットから投資期間に合ったボットを選択すると、AIが自動的に収益を創出します",
    en: "Choose from 5 bots matching your investment period, and AI automatically generates revenue",
  },
  "staking.daily": { ko: "일일 수익률", zh: "日收益率", ja: "日利回り", en: "Daily Return" },
  "staking.fee.title": { ko: "5 USDT 자동 입금 구조 — 수수료 20%는 이렇게 작동합니다", zh: "5 USDT自动存入结构——20%手续费如何运作", ja: "5 USDT自動入金構造 — 手数料20%はこう作動します", en: "5 USDT Auto-deposit Structure — How the 20% Fee Works" },
  "staking.step1": { ko: "AI 봇이\n수익 창출", zh: "AI机器人\n创造收益", ja: "AIボットが\n収益創出", en: "AI Bot\nGenerates Revenue" },
  "staking.step2": { ko: "20% 수수료\n차감", zh: "扣除20%\n手续费", ja: "20%手数料\n差引", en: "20% Fee\nDeducted" },
  "staking.step3": { ko: "5 USDT 도달 시\n자동 입금", zh: "达到5 USDT时\n自动存入", ja: "5 USDT到達時\n自動入金", en: "Auto-deposit\nwhen 5 USDT reached" },
  "staking.fee.note": {
    ko: "여러분이 받는 **5 USDT는 이미 수수료가 빠진 순수익**입니다. 차감된 20%가 바로 플랫폼의 핵심 수익원입니다.",
    zh: "您收到的**5 USDT已经是扣除手续费后的纯收益**。扣除的20%正是平台的核心收益来源。",
    ja: "皆さんが受け取る**5 USDTはすでに手数料が引かれた純収益**です。差し引かれた20%がまさにプラットフォームの核心収益源です。",
    en: "The **5 USDT you receive is already net profit after fees**. The deducted 20% is the platform's core revenue source.",
  },
  "staking.sim.title": { ko: "개인 수익 시뮬레이션 — 10,000 USDT × Quantum Bot (360일)", zh: "个人收益模拟 — 10,000 USDT × Quantum Bot (360天)", ja: "個人収益シミュレーション — 10,000 USDT × Quantum Bot (360日)", en: "Personal Revenue Simulation — 10,000 USDT × Quantum Bot (360 days)" },
  "staking.sim.h1": { ko: "항목", zh: "项目", ja: "項目", en: "Item" },
  "staking.sim.h2": { ko: "수치", zh: "数值", ja: "数値", en: "Value" },
  "staking.sim.r1": { ko: "투자금", zh: "投资金", ja: "投資金", en: "Investment" },
  "staking.sim.r2": { ko: "일평균 수익률", zh: "日均收益率", ja: "日平均収益率", en: "Avg Daily Return" },
  "staking.sim.r3": { ko: "연간 예상 수익률 (APY)", zh: "年预期收益率 (APY)", ja: "年間予想収益率 (APY)", en: "Expected APY" },
  "staking.sim.r4": { ko: "360일 예상 순이익", zh: "360天预期纯利润", ja: "360日予想純利益", en: "360-day Expected Profit" },
  "staking.sim.note": {
    ko: "* 시뮬레이션이며, 실제 수익은 시장 상황에 따라 달라질 수 있습니다.",
    zh: "* 此为模拟数据，实际收益可能因市场情况而异。",
    ja: "* シミュレーションであり、実際の収益は市場状況により異なる場合があります。",
    en: "* This is a simulation. Actual returns may vary depending on market conditions.",
  },

  // Referral Section
  "ref.badge": { ko: "Referral Rewards", zh: "Referral Rewards", ja: "Referral Rewards", en: "Referral Rewards" },
  "ref.title": { ko: "직추천 수익 — 6단계 보상 체계", zh: "直推收益 — 6级奖励体系", ja: "直接紹介収益 — 6段階報酬体系", en: "Referral Revenue — 6-tier Reward System" },
  "ref.subtitle": {
    ko: "1명만 추천해도 10% 보상. 추천 인원이 늘어날수록 더 깊은 세대까지 수익이 열립니다",
    zh: "仅推荐1人即可获得10%奖励。推荐人数越多，收益延伸到更深层级",
    ja: "1人紹介するだけで10%報酬。紹介人数が増えるほど、より深い世代まで収益が開きます",
    en: "10% reward for just 1 referral. More referrals unlock deeper generation rewards",
  },
  "ref.table.title": { ko: "6단계 직추천 보상 체계", zh: "6级直推奖励体系", ja: "6段階直接紹介報酬体系", en: "6-tier Referral Reward System" },
  "ref.h1": { ko: "유효 직추 인원", zh: "有效直推人数", ja: "有効直接紹介人数", en: "Direct Referrals" },
  "ref.h2": { ko: "잠금 해제 대수", zh: "解锁代数", ja: "ロック解除世代", en: "Unlocked Gen" },
  "ref.h3": { ko: "유동성 실적 요구", zh: "流动性要求", ja: "流動性要件", en: "Liquidity Req." },
  "ref.h4": { ko: "추천 보상 비율", zh: "推荐奖励比例", ja: "紹介報酬率", en: "Reward Rate" },
  "ref.gen": { ko: "세대", zh: "代", ja: "世代", en: "Gen" },
  "ref.how": { ko: "어떻게 작동하나요?", zh: "如何运作？", ja: "どのように作動しますか？", en: "How does it work?" },
  "ref.example": {
    ko: "예시: A → B → C → D 추천 체인",
    zh: "示例：A → B → C → D 推荐链",
    ja: "例：A → B → C → D 紹介チェーン",
    en: "Example: A → B → C → D referral chain",
  },

  // Team Section
  "team.badge": { ko: "Team Revenue", zh: "Team Revenue", ja: "Team Revenue", en: "Team Revenue" },
  "team.title": { ko: "팀 수익 & 직급 수익", zh: "团队收益 & 等级收益", ja: "チーム収益 & 等級収益", en: "Team Revenue & Rank Revenue" },
  "team.subtitle": {
    ko: "V1~V8 커뮤니티 파트너 등급 — 커뮤니티를 성장시킬수록 수익이 기하급수적으로 증가합니다",
    zh: "V1~V8社区合伙人等级 — 社区越壮大，收益呈指数级增长",
    ja: "V1~V8コミュニティパートナー等級 — コミュニティを成長させるほど収益が指数関数的に増加します",
    en: "V1~V8 Community Partner Ranks — Revenue grows exponentially as your community grows",
  },
  "team.table.title": { ko: "V1~V8 등급 전체 테이블", zh: "V1~V8等级完整表格", ja: "V1~V8等級全テーブル", en: "V1~V8 Full Rank Table" },
  "team.h1": { ko: "등급", zh: "等级", ja: "等級", en: "Rank" },
  "team.h2": { ko: "개인 유동성", zh: "个人流动性", ja: "個人流動性", en: "Personal Liq." },
  "team.h3": { ko: "추천팀 유동성", zh: "推荐团队流动性", ja: "推薦チーム流動性", en: "Team Liq." },
  "team.h4": { ko: "믹싱 수익비", zh: "混合收益比", ja: "ミキシング収益比", en: "Mixing Rate" },
  "team.h5": { ko: "AI퀀트 수익비", zh: "AI量化收益比", ja: "AIクオンツ収益比", en: "AI Quant Rate" },
  "team.h6": { ko: "등급 보너스", zh: "等级奖金", ja: "等級ボーナス", en: "Rank Bonus" },
  "team.info.personal": { ko: "개인 유동성", zh: "个人流动性", ja: "個人流動性", en: "Personal Liquidity" },
  "team.info.personal.desc": { ko: "본인이 플랫폼에 예치한 USDT 금액. V1은 100 USDT만 있으면 시작", zh: "本人在平台存入的USDT金额。V1只需100 USDT即可开始", ja: "本人がプラットフォームに預けたUSDT金額。V1は100 USDTだけで開始", en: "USDT deposited on the platform. V1 starts with just 100 USDT" },
  "team.info.team": { ko: "추천팀 유동성", zh: "推荐团队流动性", ja: "推薦チーム流動性", en: "Team Liquidity" },
  "team.info.team.desc": { ko: "내가 구축한 팀 전체의 총 유동성. 팀이 클수록 높은 등급 도달", zh: "我构建的团队总流动性。团队越大，等级越高", ja: "自分が構築したチーム全体の総流動性。チームが大きいほど高い等級に到達", en: "Total liquidity of your team. Larger teams reach higher ranks" },
  "team.info.rate": { ko: "믹싱/AI퀀트 수익비", zh: "混合/AI量化收益比", ja: "ミキシング/AIクオンツ収益比", en: "Mixing/AI Quant Rate" },
  "team.info.rate.desc": { ko: "팀 수익의 배분 비율. V8은 최대 80%까지 수령 가능", zh: "团队收益分配比例。V8最高可获得80%", ja: "チーム収益の配分比率。V8は最大80%まで受領可能", en: "Team revenue distribution rate. V8 can receive up to 80%" },
  "team.info.bonus": { ko: "등급 보너스", zh: "等级奖金", ja: "等級ボーナス", en: "Rank Bonus" },
  "team.info.bonus.desc": { ko: "모든 등급에서 동일하게 10%의 추가 보너스 지급", zh: "所有等级均享有10%额外奖金", ja: "全等級で同一の10%追加ボーナス支給", en: "All ranks receive an additional 10% bonus" },
  "team.sim.title": { ko: "V5 노드 수익 시뮬레이션 (보수적 예측)", zh: "V5节点收益模拟（保守预测）", ja: "V5ノード収益シミュレーション（保守的予測）", en: "V5 Node Revenue Simulation (Conservative)" },
  "team.sim.basis": { ko: "개인 5,000 U / 팀 1,500,000 U 기준", zh: "个人5,000 U / 团队1,500,000 U基准", ja: "個人5,000 U / チーム1,500,000 U基準", en: "Personal 5,000 U / Team 1,500,000 U basis" },
  "team.sim.h1": { ko: "수익원", zh: "收益来源", ja: "収益源", en: "Revenue Source" },
  "team.sim.h2": { ko: "일일 이익 (USDT)", zh: "日收益 (USDT)", ja: "日利益 (USDT)", en: "Daily (USDT)" },
  "team.sim.h3": { ko: "월별 이익 (USDT)", zh: "月收益 (USDT)", ja: "月利益 (USDT)", en: "Monthly (USDT)" },
  "team.sim.h4": { ko: "연간 이익 (USDT)", zh: "年收益 (USDT)", ja: "年利益 (USDT)", en: "Annual (USDT)" },
  "team.sim.r1": { ko: "팀 관리 이익", zh: "团队管理收益", ja: "チーム管理利益", en: "Team Mgmt Revenue" },
  "team.sim.r2": { ko: "개인 이익", zh: "个人收益", ja: "個人利益", en: "Personal Revenue" },
  "team.sim.r3": { ko: "등급 보상", zh: "等级奖励", ja: "等級報酬", en: "Rank Reward" },
  "team.sim.r4": { ko: "총 이익 예상", zh: "总收益预估", ja: "総利益予想", en: "Total Expected" },
  "team.stat1": { ko: "팀 관리 이익 비중", zh: "团队管理收益占比", ja: "チーム管理利益比重", en: "Team Mgmt Share" },
  "team.stat2": { ko: "V8 최대 수익 배분", zh: "V8最高收益分配", ja: "V8最大収益分配", en: "V8 Max Distribution" },

  // Tokenomics
  "token.badge": { ko: "Token Economics", zh: "Token Economics", ja: "Token Economics", en: "Token Economics" },
  "token.title": { ko: "XP 토큰 이코노믹", zh: "XP代币经济", ja: "XPトークンエコノミクス", en: "XP Token Economics" },
  "token.subtitle": {
    ko: "극한 디플레이션 가치 모델 — 2,100만 개 중 2,000만 개를 소각하여 100만 개만 남깁니다",
    zh: "极致通缩价值模型 — 2100万枚中销毁2000万枚，仅保留100万枚",
    ja: "究極のデフレ価値モデル — 2,100万個中2,000万個を焼却し100万個のみ残します",
    en: "Extreme deflation model — Burning 20M out of 21M, leaving only 1M",
  },
  "token.supply": { ko: "총 발행량", zh: "总发行量", ja: "総発行量", en: "Total Supply" },
  "token.burn": { ko: "소각 목표", zh: "销毁目标", ja: "焼却目標", en: "Burn Target" },
  "token.deflation": { ko: "극한 디플레이션 프로세스", zh: "极致通缩流程", ja: "究極デフレプロセス", en: "Extreme Deflation Process" },
  "token.purchase": { ko: "수익형 구매 한도 시스템", zh: "收益型购买限额系统", ja: "収益型購入限度システム", en: "Revenue-based Purchase Limit System" },
  "token.purchase.desc": {
    ko: "XP 토큰은 시장에서 마음대로 구매할 수 없습니다. 오직 플랫폼에서 발생한 실제 수익으로만 구매 기회가 열립니다.",
    zh: "XP代币不能在市场上随意购买。只有通过平台产生的实际收益才能获得购买机会。",
    ja: "XPトークンは市場で自由に購入できません。プラットフォームで発生した実際の収益でのみ購入機会が開かれます。",
    en: "XP tokens cannot be freely purchased on the market. Purchase opportunities only open through actual platform revenue.",
  },
  "token.step1": { ko: "수익 발생", zh: "产生收益", ja: "収益発生", en: "Revenue Generated" },
  "token.step1.desc": { ko: "AI 스테이킹 봇 또는 게임을 통해 USDT 이익 획득", zh: "通过AI质押机器人或游戏获得USDT收益", ja: "AIステーキングボットまたはゲームを通じてUSDT利益獲得", en: "Earn USDT through AI staking bot or games" },
  "token.step2": { ko: "구매 한도 부여", zh: "授予购买限额", ja: "購入限度付与", en: "Purchase Limit Granted" },
  "token.step2.desc": { ko: "실제 USDT 이익에 비례하여 XP 구매 한도 자동 부여", zh: "按实际USDT收益比例自动授予XP购买限额", ja: "実際のUSDT利益に比例してXP購入限度を自動付与", en: "XP purchase limit auto-granted proportional to USDT profit" },
  "token.step3": { ko: "XP 토큰 획득", zh: "获取XP代币", ja: "XPトークン獲得", en: "XP Token Acquired" },
  "token.step3.desc": { ko: "부여된 한도를 사용하여 XP 토큰 선형 획득", zh: "使用授予的限额线性获取XP代币", ja: "付与された限度を使用してXPトークンを線形獲得", en: "Linearly acquire XP tokens using granted limit" },
  "token.util.governance": { ko: "거버넌스", zh: "治理", ja: "ガバナンス", en: "Governance" },
  "token.util.governance.desc": { ko: "플랫폼 의사결정 투표 참여 권한", zh: "平台决策投票参与权", ja: "プラットフォーム意思決定投票参加権限", en: "Platform decision-making voting rights" },
  "token.util.boost": { ko: "수익 부스트", zh: "收益加速", ja: "収益ブースト", en: "Revenue Boost" },
  "token.util.boost.desc": { ko: "XP 보유량에 따라 스테이킹 보상 증가", zh: "根据XP持有量增加质押奖励", ja: "XP保有量に応じてステーキング報酬増加", en: "Staking rewards increase based on XP holdings" },
  "token.util.vip": { ko: "VIP 특전", zh: "VIP特权", ja: "VIP特典", en: "VIP Benefits" },
  "token.util.vip.desc": { ko: "프리미엄 기능 우선 액세스", zh: "优先访问高级功能", ja: "プレミアム機能優先アクセス", en: "Priority access to premium features" },
  "token.util.value": { ko: "가치 상승", zh: "价值上升", ja: "価値上昇", en: "Value Appreciation" },
  "token.util.value.desc": { ko: "수수료 소각 + Buyback & Burn", zh: "手续费销毁 + 回购销毁", ja: "手数料焼却 + Buyback & Burn", en: "Fee burn + Buyback & Burn" },

  // Flywheel
  "fly.badge": { ko: "Ecosystem Flywheel", zh: "Ecosystem Flywheel", ja: "Ecosystem Flywheel", en: "Ecosystem Flywheel" },
  "fly.title": { ko: "생태계 선순환 플라이휠", zh: "生态良性循环飞轮", ja: "エコシステム好循環フライホイール", en: "Ecosystem Virtuous Flywheel" },
  "fly.subtitle": {
    ko: "수익이 수익을 만드는 구조 — 세 가지 수익 축이 서로 맞물려 돌아갑니다",
    zh: "收益创造收益的结构 — 三大收益轴相互联动运转",
    ja: "収益が収益を生む構造 — 3つの収益軸が互いに噛み合って回ります",
    en: "Revenue creates revenue — three revenue axes interlock and rotate together",
  },
  "fly.wheel.1": { ko: "AI 자동 수익", zh: "AI自动收益", ja: "AI自動収益", en: "AI Auto Revenue" },
  "fly.wheel.2": { ko: "지갑 잔고 증가", zh: "钱包余额增加", ja: "ウォレット残高増加", en: "Wallet Balance Up" },
  "fly.wheel.3": { ko: "게임 참여", zh: "游戏参与", ja: "ゲーム参加", en: "Game Participation" },
  "fly.wheel.4": { ko: "수수료 발생", zh: "手续费产生", ja: "手数料発生", en: "Fees Generated" },
  "fly.wheel.5": { ko: "수익 풀 확장", zh: "收益池扩大", ja: "収益プール拡張", en: "Revenue Pool Expansion" },
  "fly.wheel.6": { ko: "커뮤니티 성장", zh: "社区增长", ja: "コミュニティ成長", en: "Community Growth" },
  "fly.pillar1": { ko: "회사 이익", zh: "公司收益", ja: "会社利益", en: "Company Revenue" },
  "fly.pillar1.summary": { ko: "안정적 플랫폼 운영 기반", zh: "稳定的平台运营基础", ja: "安定したプラットフォーム運営基盤", en: "Stable platform operation base" },
  "fly.pillar2": { ko: "개인 수익", zh: "个人收益", ja: "個人収益", en: "Personal Revenue" },
  "fly.pillar2.summary": { ko: "자동화된 자산 증식", zh: "自动化资产增值", ja: "自動化された資産増殖", en: "Automated asset growth" },
  "fly.pillar3": { ko: "팀 수익", zh: "团队收益", ja: "チーム収益", en: "Team Revenue" },
  "fly.pillar3.summary": { ko: "커뮤니티 확장의 핵심 동력", zh: "社区扩展的核心动力", ja: "コミュニティ拡張の核心動力", en: "Core driver of community expansion" },
  "fly.summary.title": { ko: "수익 구조 한눈에 정리", zh: "收益结构一目了然", ja: "収益構造一目で整理", en: "Revenue Structure at a Glance" },
  "fly.summary.h1": { ko: "수익 유형", zh: "收益类型", ja: "収益タイプ", en: "Revenue Type" },
  "fly.summary.h2": { ko: "핵심 내용", zh: "核心内容", ja: "核心内容", en: "Key Content" },
  "fly.summary.h3": { ko: "최대 수익률/비율", zh: "最高收益率/比例", ja: "最大収益率/比率", en: "Max Rate/Ratio" },
  "fly.quote": {
    ko: '"내가 벌면 → 플랫폼이 커지고 → 플랫폼이 커지면 → 내가 더 많이 번다"',
    zh: '"我赚钱 → 平台壮大 → 平台壮大 → 我赚更多"',
    ja: '"私が稼ぐ → プラットフォームが大きくなる → プラットフォームが大きくなる → 私がもっと稼ぐ"',
    en: '"I earn → Platform grows → Platform grows → I earn more"',
  },
  "fly.quote.desc": {
    ko: "사용자의 수익 활동과 게임 참여가 플랫폼의 가치를 높이고, 높아진 가치가 다시 사용자에게 더 큰 보상으로 돌아가는 무한 확장형 생태계",
    zh: "用户的收益活动和游戏参与提升平台价值，提升的价值又以更大的奖励回馈用户的无限扩展生态系统",
    ja: "ユーザーの収益活動とゲーム参加がプラットフォームの価値を高め、高まった価値が再びユーザーにより大きな報酬として戻る無限拡張型エコシステム",
    en: "Users' revenue activities and game participation increase platform value, and increased value returns to users as greater rewards — an infinitely expanding ecosystem",
  },
  "fly.cta": { ko: "지금 XPLAY 시작하기 →", zh: "立即开始XPLAY →", ja: "今すぐXPLAYを始める →", en: "Start XPLAY Now →" },

  // Resources Section
  "res.badge": { ko: "Resources", zh: "Resources", ja: "Resources", en: "Resources" },
  "res.title": { ko: "자료실", zh: "资料中心", ja: "資料室", en: "Resource Center" },
  "res.subtitle": {
    ko: "XPLAY 프로젝트의 핵심 자료를 다운로드하고, 소개 영상을 확인하세요",
    zh: "下载XPLAY项目核心资料，观看介绍视频",
    ja: "XPLAYプロジェクトの核心資料をダウンロードし、紹介動画をご確認ください",
    en: "Download XPLAY project materials and watch introduction videos",
  },
  "res.docs": { ko: "문서 자료", zh: "文档资料", ja: "文書資料", en: "Documents" },
  "res.video": { ko: "소개 영상", zh: "介绍视频", ja: "紹介動画", en: "Introduction Video" },
  "res.download": { ko: "다운로드", zh: "下载", ja: "ダウンロード", en: "Download" },
  "res.notion": { ko: "노션에서 전체 자료 보기", zh: "在Notion查看全部资料", ja: "Notionで全資料を見る", en: "View all materials on Notion" },

  // Referral input
  "referral.modal.title": { ko: "나의 레퍼럴 링크 설정", zh: "设置我的推荐链接", ja: "マイリファラルリンク設定", en: "Set My Referral Link" },
  "referral.modal.desc": {
    ko: "레퍼럴 링크를 입력하면 모든 CTA 버튼이 해당 링크로 변경됩니다. 이 페이지를 지인에게 공유하세요!",
    zh: "输入推荐链接后，所有CTA按钮将更改为该链接。将此页面分享给朋友！",
    ja: "リファラルリンクを入力すると、すべてのCTAボタンがそのリンクに変更されます。このページを知人に共有しましょう！",
    en: "Enter your referral link and all CTA buttons will change to that link. Share this page with friends!",
  },
  "referral.modal.placeholder": { ko: "https://app.xplaybot.com/ref/...", zh: "https://app.xplaybot.com/ref/...", ja: "https://app.xplaybot.com/ref/...", en: "https://app.xplaybot.com/ref/..." },
  "referral.modal.save": { ko: "저장", zh: "保存", ja: "保存", en: "Save" },
  "referral.modal.reset": { ko: "초기화", zh: "重置", ja: "リセット", en: "Reset" },
  "referral.modal.share": { ko: "링크 복사 & 공유", zh: "复制链接并分享", ja: "リンクコピー＆共有", en: "Copy Link & Share" },
  "referral.modal.copied": { ko: "복사 완료!", zh: "复制成功！", ja: "コピー完了！", en: "Copied!" },
  "referral.btn": { ko: "레퍼럴 설정", zh: "推荐设置", ja: "リファラル設定", en: "Referral" },

  // Footer
  "footer.tagline": { ko: "XPLAY — AI 자동 수익 × GameFi 듀얼 엔진", zh: "XPLAY — AI自动收益 × GameFi双引擎", ja: "XPLAY — AI自動収益 × GameFiデュアルエンジン", en: "XPLAY — AI Auto Revenue × GameFi Dual Engine" },
  "footer.site": { ko: "공식 사이트:", zh: "官方网站:", ja: "公式サイト:", en: "Official Site:" },
  "footer.telegram": { ko: "텔레그램:", zh: "Telegram:", ja: "テレグラム:", en: "Telegram:" },
  "footer.disclaimer": {
    ko: "본 웹사이트는 XPLAY 프로젝트의 수익 구조를 분석한 정보성 콘텐츠입니다. 모든 투자에는 리스크가 따르며, 투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.",
    zh: "本网站是分析XPLAY项目收益结构的信息性内容。所有投资都有风险，投资决策应在个人判断和责任下做出。",
    ja: "本ウェブサイトはXPLAYプロジェクトの収益構造を分析した情報性コンテンツです。すべての投資にはリスクが伴い、投資決定は本人の判断と責任の下で行われるべきです。",
    en: "This website is informational content analyzing the XPLAY project's revenue structure. All investments carry risk, and investment decisions should be made under your own judgment and responsibility.",
  },

  // Revenue summary rows
  "fly.sum.r1": { ko: "개인 수익", zh: "个人收益", ja: "個人収益", en: "Personal Revenue" },
  "fly.sum.r1.content": { ko: "AI 스테이킹 봇 자동 수익", zh: "AI质押机器人自动收益", ja: "AIステーキングボット自動収益", en: "AI Staking Bot Auto Revenue" },
  "fly.sum.r1.rate": { ko: "일 최대 1.8%", zh: "日最高1.8%", ja: "日最大1.8%", en: "Max 1.8%/day" },
  "fly.sum.r2": { ko: "직추천 수익", zh: "直推收益", ja: "直接紹介収益", en: "Referral Revenue" },
  "fly.sum.r2.content": { ko: "6단계 직추천 보상", zh: "6级直推奖励", ja: "6段階直接紹介報酬", en: "6-tier Referral Reward" },
  "fly.sum.r2.rate": { ko: "최대 10% (1세대)", zh: "最高10%（第1代）", ja: "最大10%（1世代）", en: "Max 10% (Gen 1)" },
  "fly.sum.r3": { ko: "팀 수익", zh: "团队收益", ja: "チーム収益", en: "Team Revenue" },
  "fly.sum.r3.content": { ko: "V1~V8 커뮤니티 파트너", zh: "V1~V8社区合伙人", ja: "V1~V8コミュニティパートナー", en: "V1~V8 Community Partners" },
  "fly.sum.r3.rate": { ko: "최대 80% (V8)", zh: "最高80% (V8)", ja: "最大80% (V8)", en: "Max 80% (V8)" },
  "fly.sum.r4": { ko: "게임 수수료", zh: "游戏手续费", ja: "ゲーム手数料", en: "Game Fees" },
  "fly.sum.r4.content": { ko: "BTC 예측 + 올인 로또", zh: "BTC预测 + 全押乐透", ja: "BTC予測 + オールインロト", en: "BTC Prediction + All-in Lotto" },
  "fly.sum.r4.rate": { ko: "5~9% 수수료", zh: "5~9%手续费", ja: "5~9%手数料", en: "5~9% fee" },
  "fly.sum.r5": { ko: "토큰 가치", zh: "代币价值", ja: "トークン価値", en: "Token Value" },
  "fly.sum.r5.content": { ko: "XP 극한 디플레이션", zh: "XP极致通缩", ja: "XP究極デフレ", en: "XP Extreme Deflation" },
  "fly.sum.r5.rate": { ko: "95.2% 소각", zh: "95.2%销毁", ja: "95.2%焼却", en: "95.2% burned" },
};
