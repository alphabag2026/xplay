// ===================================================================
// XPLAY Revenue Structure Data
// Design: Cyberpunk Data Terminal — Neon Cyan/Purple on Deep Navy
// ===================================================================

export const IMAGES = {
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay_logo_d17145fa.png",
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay_hero_bg-bf3f3B2hJ55oavuwrxE5Lp.webp",
  revenue: "https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay_revenue_section-6kGp9CjNr2RsRfzgtpcPNN.webp",
  game: "https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay_game_section-DmJHP2GHPEvQwZNxkBFb5F.webp",
  tokenomics: "https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay_tokenomics_bg-JEU3sTxG8LapHBTxzgigmf.webp",
  flywheel: "https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay_flywheel_bg-TR5Gag4qZj3WPNuZgjg4Ns.webp",
};

export const BUSINESS_MODELS = [
  {
    id: "mixing",
    name: "토큰 믹싱 엔진",
    nameEn: "Token Mixing Engine",
    description: "블록체인 프라이버시 기술 활용, 체인 간 스왑 수수료",
    avgReturn: 3.2,
    icon: "🔄",
  },
  {
    id: "quant",
    name: "AI 계량화 트레이딩",
    nameEn: "AI Quant Trading",
    description: "빅데이터 AI 24시간 자동 차익 실현",
    avgReturn: 6.5,
    icon: "🤖",
  },
  {
    id: "market",
    name: "바이낸스 AI Market Making",
    nameEn: "Binance AI Market Making",
    description: "유동성 공급 및 수익 공유",
    avgReturn: 4.5,
    icon: "📊",
  },
];

export const STAKING_BOTS = [
  {
    name: "Sprint Bot",
    period: "7일 (단기)",
    dailyReturn: "0.3% ~ 0.6%",
    apy: "~880%",
    minReturn: 0.3,
    maxReturn: 0.6,
    days: 7,
    color: "#22d3ee",
  },
  {
    name: "Velocity Bot",
    period: "30일 (중단기)",
    dailyReturn: "0.6% ~ 0.8%",
    apy: "~1,740%",
    minReturn: 0.6,
    maxReturn: 0.8,
    days: 30,
    color: "#818cf8",
  },
  {
    name: "Momentum Bot",
    period: "90일 (중기)",
    dailyReturn: "0.8% ~ 1.0%",
    apy: "~3,580%",
    minReturn: 0.8,
    maxReturn: 1.0,
    days: 90,
    color: "#a78bfa",
  },
  {
    name: "Catalyst Bot",
    period: "180일 (중장기)",
    dailyReturn: "1.0% ~ 1.3%",
    apy: "~7,890%",
    minReturn: 1.0,
    maxReturn: 1.3,
    days: 180,
    color: "#c084fc",
  },
  {
    name: "Quantum Bot",
    period: "360일 (장기)",
    dailyReturn: "1.3% ~ 1.8%",
    apy: "~17,145%",
    minReturn: 1.3,
    maxReturn: 1.8,
    days: 360,
    color: "#e879f9",
  },
];

export const REFERRAL_TIERS = [
  { tier: 1, directRefs: 1, generation: "1세대", liquidity: "100 U", reward: "10%" },
  { tier: 2, directRefs: 2, generation: "2세대", liquidity: "500 U", reward: "5%" },
  { tier: 3, directRefs: 3, generation: "3세대", liquidity: "1,000 U", reward: "3%" },
  { tier: 4, directRefs: 4, generation: "4세대", liquidity: "1,500 U", reward: "1%" },
  { tier: 5, directRefs: 5, generation: "5세대", liquidity: "2,000 U", reward: "1%" },
  { tier: 6, directRefs: 6, generation: "6세대", liquidity: "3,000 U", reward: "1%" },
];

export const TEAM_RANKS = [
  { rank: "V1", personalLiq: "100 U", teamLiq: "20,000 U", mixingRate: "10%", quantRate: "10%", bonus: "10%" },
  { rank: "V2", personalLiq: "500 U", teamLiq: "50,000 U", mixingRate: "20%", quantRate: "20%", bonus: "10%" },
  { rank: "V3", personalLiq: "1,000 U", teamLiq: "150,000 U", mixingRate: "30%", quantRate: "30%", bonus: "10%" },
  { rank: "V4", personalLiq: "3,000 U", teamLiq: "500,000 U", mixingRate: "40%", quantRate: "40%", bonus: "10%" },
  { rank: "V5", personalLiq: "5,000 U", teamLiq: "1,500,000 U", mixingRate: "50%", quantRate: "50%", bonus: "10%", highlight: true },
  { rank: "V6", personalLiq: "10,000 U", teamLiq: "3,000,000 U", mixingRate: "60%", quantRate: "60%", bonus: "10%" },
  { rank: "V7", personalLiq: "10,000 U", teamLiq: "5,000,000 U", mixingRate: "70%", quantRate: "70%", bonus: "10%" },
  { rank: "V8", personalLiq: "10,000 U", teamLiq: "8,000,000 U", mixingRate: "80%", quantRate: "80%", bonus: "10%" },
];

export const V5_SIMULATION = [
  { source: "팀 관리 이익", daily: "13,500", monthly: "405,000", yearly: "4,927,500" },
  { source: "개인 이익", daily: "90", monthly: "2,700", yearly: "32,850" },
  { source: "등급 보상", daily: "2,200", monthly: "66,000", yearly: "803,000" },
  { source: "총 이익 예상", daily: "15,790", monthly: "473,700", yearly: "5,763,350", isTotal: true },
];

export const TOKEN_INFO = {
  totalSupply: 21_000_000,
  burnTarget: 20_000_000,
  remaining: 1_000_000,
  burnRate: 95.2,
};

export const GAME_PREDICTION = {
  rounds: ["30초", "1분", "5분"],
  feeRate: 5,
  targetUsers: 80_000,
  bettorsPerRound: 100,
  simulations: [
    { betSize: 5, label: "$5 Bet (Min)", dailyRevenue: 72_000 },
    { betSize: 100, label: "$100 Bet", dailyRevenue: 1_440_000 },
  ],
};

export const LOTTO_DISTRIBUTION = [
  { label: "1등 (Winner)", amount: 7_300, pct: 73 },
  { label: "2~10등", amount: 1_800, pct: 18 },
  { label: "플랫폼 수수료", amount: 900, pct: 9 },
];

export const REVENUE_SUMMARY = [
  { type: "개인 수익", content: "AI 스테이킹 봇 자동 수익", maxRate: "일 최대 1.8%" },
  { type: "직추천 수익", content: "6단계 직추천 보상", maxRate: "최대 10% (1세대)" },
  { type: "팀 수익", content: "V1~V8 커뮤니티 파트너", maxRate: "최대 80% (V8)" },
  { type: "게임 수수료", content: "BTC 예측 + 올인 로또", maxRate: "5~9% 수수료" },
  { type: "토큰 가치", content: "XP 극한 디플레이션", maxRate: "95.2% 소각" },
];
