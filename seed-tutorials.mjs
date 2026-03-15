import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const conn = await mysql.createConnection(DATABASE_URL);

const STAKING_VIDEO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663373200888/45mU6xhgdRUAikfBjGs2KY/xplay-staking_6e02c791.mp4';

// Tutorials to seed
const tutorials = [
  {
    youtubeId: 'none',
    videoUrl: STAKING_VIDEO_URL,
    iconName: 'Wallet',
    iconColor: '#a855f7',
    title: JSON.stringify({ ko: "XPLAY 스테이킹 완전 가이드", en: "XPLAY Staking Complete Guide", zh: "XPLAY质押完整指南", ja: "XPLAYステーキング完全ガイド", vi: "Hướng dẫn Staking XPLAY đầy đủ", th: "คู่มือ Staking XPLAY ฉบับสมบูรณ์" }),
    description: JSON.stringify({ ko: "XPLAY 스테이킹 방법을 영상으로 쉽게 배워보세요. 지갑 연결부터 수익 확인까지 단계별 안내", en: "Learn XPLAY staking easily with this video guide. Step-by-step from wallet connection to earnings check", zh: "通过视频轻松学习XPLAY质押。从钱包连接到收益查看的逐步指南", ja: "動画でXPLAYステーキングを簡単に学びましょう。ウォレット接続から収益確認まで", vi: "Học staking XPLAY dễ dàng qua video. Hướng dẫn từng bước từ kết nối ví đến kiểm tra lợi nhuận", th: "เรียนรู้การ Staking XPLAY ง่ายๆ ผ่านวิดีโอ ตั้งแต่เชื่อมต่อกระเป๋าถึงตรวจสอบรายได้" }),
    tooltip: JSON.stringify({ ko: "영상으로 따라하면 3분이면 스테이킹 시작!", en: "Follow the video and start staking in 3 minutes!", zh: "跟着视频3分钟开始质押！", ja: "動画に沿って3分でステーキング開始！", vi: "Theo video và bắt đầu staking trong 3 phút!", th: "ทำตามวิดีโอเริ่ม Staking ใน 3 นาที!" }),
    category: 'beginner',
    steps: JSON.stringify([
      { title: { ko: "1. 지갑 연결", en: "1. Connect Wallet" }, desc: { ko: "TokenPocket 또는 MetaMask에서 Polygon 네트워크를 선택하고 XPLAY에 접속합니다.", en: "Select Polygon network in TokenPocket or MetaMask and connect to XPLAY." } },
      { title: { ko: "2. 봇 선택 & 금액 설정", en: "2. Select Bot & Set Amount" }, desc: { ko: "Sprint, Velocity, Momentum 등 원하는 봇을 선택하고 투자 금액을 입력합니다.", en: "Choose your preferred bot (Sprint, Velocity, Momentum, etc.) and enter investment amount." } },
      { title: { ko: "3. 스테이킹 시작", en: "3. Start Staking" }, desc: { ko: "트랜잭션을 승인하면 자동으로 스테이킹이 시작됩니다. 수익은 대시보드에서 실시간 확인 가능합니다.", en: "Approve the transaction and staking starts automatically. Check earnings in real-time on the dashboard." } },
    ]),
    sortOrder: 0,
    isActive: true,
  },
  {
    youtubeId: 'dQw4w9WgXcQ',
    videoUrl: null,
    iconName: 'Rocket',
    iconColor: '#00f5ff',
    title: JSON.stringify({ ko: "XPLAY 가입부터 첫 투자까지", en: "XPLAY Registration to First Investment", zh: "XPLAY注册到首次投资", ja: "XPLAY登録から初投資まで", vi: "Đăng ký XPLAY đến đầu tư đầu tiên", th: "สมัคร XPLAY ถึงการลงทุนครั้งแรก" }),
    description: JSON.stringify({ ko: "TokenPocket 지갑 설치부터 USDT 입금, 봇 선택까지 완벽 가이드", en: "Complete guide from TokenPocket wallet setup to USDT deposit and bot selection", zh: "从TokenPocket钱包安装到USDT充值和机器人选择的完整指南", ja: "TokenPocketウォレット設定からUSDT入金、ボット選択まで完全ガイド", vi: "Hướng dẫn hoàn chỉnh từ cài đặt ví TokenPocket đến nạp USDT và chọn bot", th: "คู่มือสมบูรณ์ตั้งแต่ตั้งค่ากระเป๋า TokenPocket ถึงฝาก USDT และเลือกบอท" }),
    tooltip: JSON.stringify({ ko: "5분이면 완료! 초보자도 쉽게 따라할 수 있는 단계별 가이드", en: "Done in 5 min! Easy step-by-step guide for beginners", zh: "5分钟完成！初学者也能轻松跟随的指南", ja: "5分で完了！初心者でも簡単なガイド", vi: "Hoàn thành trong 5 phút! Hướng dẫn dễ dàng cho người mới", th: "เสร็จใน 5 นาที! คู่มือง่ายๆ สำหรับมือใหม่" }),
    category: 'beginner',
    steps: JSON.stringify([
      { title: { ko: "1. TokenPocket 지갑 설치", en: "1. Install TokenPocket Wallet" }, desc: { ko: "App Store 또는 Google Play에서 TokenPocket을 다운로드하고 지갑을 생성합니다.", en: "Download TokenPocket from App Store or Google Play and create a wallet." } },
      { title: { ko: "2. USDT 입금", en: "2. Deposit USDT" }, desc: { ko: "거래소에서 TokenPocket 지갑으로 USDT(Polygon 네트워크)를 전송합니다.", en: "Transfer USDT (Polygon network) from exchange to your TokenPocket wallet." } },
      { title: { ko: "3. XPLAY 접속 & 봇 선택", en: "3. Access XPLAY & Choose Bot" }, desc: { ko: "TokenPocket dApp 브라우저에서 XPLAY에 접속하고 투자 봇을 선택합니다.", en: "Access XPLAY through TokenPocket dApp browser and select an investment bot." } },
    ]),
    sortOrder: 1,
    isActive: true,
  },
];

// FAQ items to seed
const faqItems = [
  {
    question: JSON.stringify({ ko: "XPLAY는 안전한가요? 자금은 어떻게 보호되나요?", en: "Is XPLAY safe? How are funds protected?", zh: "XPLAY安全吗？资金如何保护？", ja: "XPLAYは安全ですか？資金はどう保護されますか？", vi: "XPLAY có an toàn không? Tiền được bảo vệ thế nào?", th: "XPLAY ปลอดภัยไหม? เงินถูกปกป้องอย่างไร?" }),
    answer: JSON.stringify({ ko: "XPLAY는 Polygon 블록체인 기반 스마트 컨트랙트로 운영되며, 모든 거래가 온체인에 기록됩니다. 자금은 스마트 컨트랙트에 안전하게 보관되고, 출금은 사용자 본인만 가능합니다.", en: "XPLAY operates on Polygon blockchain smart contracts with all transactions recorded on-chain. Funds are securely held in smart contracts, and only users can withdraw their own funds.", zh: "XPLAY基于Polygon区块链智能合约运行，所有交易记录在链上。资金安全保管在智能合约中，只有用户本人可以提现。", ja: "XPLAYはPolygonブロックチェーンのスマートコントラクトで運営され、全取引がオンチェーンに記録されます。", vi: "XPLAY hoạt động trên smart contract Polygon blockchain, mọi giao dịch được ghi trên chain.", th: "XPLAY ทำงานบน smart contract Polygon blockchain ทุกธุรกรรมบันทึกบน chain" }),
    sortOrder: 0,
    isActive: true,
  },
  {
    question: JSON.stringify({ ko: "최소 투자 금액은 얼마인가요?", en: "What is the minimum investment amount?", zh: "最低投资金额是多少？", ja: "最低投資額はいくらですか？", vi: "Số tiền đầu tư tối thiểu là bao nhiêu?", th: "จำนวนเงินลงทุนขั้นต่ำเท่าไหร่?" }),
    answer: JSON.stringify({ ko: "Sprint Bot 기준 최소 $100 USDT부터 시작할 수 있습니다. 봇별로 최소 금액이 다릅니다: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000).", en: "You can start from $100 USDT with Sprint Bot. Minimum varies by bot: Sprint($100), Velocity($300), Momentum($500), Quantum($1,000), Catalyst($2,000).", zh: "Sprint Bot最低$100 USDT起。各机器人最低金额不同。", ja: "Sprint Botなら最低$100 USDTから。", vi: "Bắt đầu từ $100 USDT với Sprint Bot.", th: "เริ่มจาก $100 USDT กับ Sprint Bot" }),
    sortOrder: 1,
    isActive: true,
  },
  {
    question: JSON.stringify({ ko: "출금은 얼마나 걸리나요?", en: "How long does withdrawal take?", zh: "提现需要多长时间？", ja: "出金にはどのくらいかかりますか？", vi: "Rút tiền mất bao lâu?", th: "ถอนเงินใช้เวลานานเท่าไหร่?" }),
    answer: JSON.stringify({ ko: "봇 수익율이 자동으로 6.25 USDT에 도달하면 20%를 제외하고 자동으로 지갑으로 입금됩니다.", en: "When bot earnings automatically reach 6.25 USDT, 20% is deducted and the remainder is automatically deposited to your wallet.", zh: "当机器人收益自动达到6.25 USDT时，扣除20%后自动存入您的钱包。", ja: "ボット収益が自動的に6.25 USDTに達すると、20%を差し引いて自動的にウォレットに入金されます。", vi: "Khi lợi nhuận bot tự động đạt 6.25 USDT, 20% được khấu trừ và phần còn lại tự động chuyển vào ví.", th: "เมื่อรายได้บอทถึง 6.25 USDT อัตโนมัติ หัก 20% แล้วฝากเข้ากระเป๋าอัตโนมัติ" }),
    sortOrder: 2,
    isActive: true,
  },
  {
    question: JSON.stringify({ ko: "레퍼럴 보너스는 어떻게 작동하나요?", en: "How does the referral bonus work?", zh: "推荐奖金如何运作？", ja: "リファラルボーナスはどう機能しますか？", vi: "Thưởng giới thiệu hoạt động thế nào?", th: "โบนัสแนะนำทำงานอย่างไร?" }),
    answer: JSON.stringify({ ko: "1세대 직접 추천 시 해당 투자금의 10%를 즉시 보너스로 받습니다. 2~6세대까지는 팀 배분 80%에서 단계별 보너스가 지급됩니다.", en: "You receive 10% instant bonus from 1st generation direct referrals. Generations 2-6 earn stepped bonuses from the 80% team distribution.", zh: "第1代直接推荐获得10%即时奖金。2-6代从80%团队分配中获得阶梯奖金。", ja: "1世代直接紹介で投資額の10%を即時ボーナス。2~6世代は80%チーム配分から段階的ボーナス。", vi: "Nhận 10% thưởng ngay từ giới thiệu trực tiếp thế hệ 1.", th: "รับโบนัสทันที 10% จากแนะนำตรงรุ่นที่ 1" }),
    sortOrder: 3,
    isActive: true,
  },
  {
    question: JSON.stringify({ ko: "BTC 예측 게임에서 잃으면 어떻게 되나요?", en: "What happens if I lose in the BTC prediction game?", zh: "BTC预测游戏输了怎么办？", ja: "BTC予測ゲームで負けたらどうなりますか？", vi: "Nếu thua trong game dự đoán BTC thì sao?", th: "ถ้าแพ้ในเกมทำนาย BTC จะเป็นอย่างไร?" }),
    answer: JSON.stringify({ ko: "예측이 틀리면 해당 라운드의 베팅 금액을 잃게 됩니다. 하지만 수수료 5%를 제외한 풀의 95%가 승자에게 배분되므로 공정한 구조입니다. 소액($5)부터 시작하여 감을 익히는 것을 권장합니다.", en: "If your prediction is wrong, you lose the bet amount for that round. However, 95% of the pool (minus 5% fee) is distributed to winners, making it a fair structure.", zh: "预测错误会失去该回合的投注金额。但扣除5%手续费后95%分配给赢家，结构公平。", ja: "予測が外れるとそのラウンドの賭け金を失います。ただし手数料5%を除くプールの95%が勝者に配分される公正な構造。", vi: "Nếu dự đoán sai, bạn mất tiền đặt cược vòng đó. Nhưng 95% pool (trừ 5% phí) được chia cho người thắng.", th: "ถ้าทำนายผิด จะเสียเงินเดิมพันรอบนั้น แต่ 95% ของ pool (หัก 5% ค่าธรรมเนียม) แจกให้ผู้ชนะ" }),
    sortOrder: 4,
    isActive: true,
  },
  {
    question: JSON.stringify({ ko: "XPLAY를 시작하려면 어떤 지갑이 필요한가요?", en: "What wallet do I need to start with XPLAY?", zh: "开始使用XPLAY需要什么钱包？", ja: "XPLAYを始めるにはどのウォレットが必要ですか？", vi: "Cần ví gì để bắt đầu với XPLAY?", th: "ต้องใช้กระเป๋าอะไรเพื่อเริ่มใช้ XPLAY?" }),
    answer: JSON.stringify({ ko: "TokenPocket 지갑을 권장합니다. dApp 브라우저가 내장되어 있어 XPLAY에 바로 접속할 수 있습니다. Polygon 네트워크를 지원하는 다른 지갑(MetaMask 등)도 사용 가능하지만, TokenPocket이 가장 편리합니다.", en: "We recommend TokenPocket wallet. It has a built-in dApp browser for direct XPLAY access. Other wallets supporting Polygon (like MetaMask) also work, but TokenPocket is the most convenient.", zh: "推荐TokenPocket钱包。内置dApp浏览器可直接访问XPLAY。", ja: "TokenPocketウォレットを推奨。dAppブラウザ内蔵でXPLAYに直接アクセス可能。", vi: "Khuyến nghị ví TokenPocket. Có trình duyệt dApp tích hợp để truy cập XPLAY trực tiếp.", th: "แนะนำกระเป๋า TokenPocket มีเบราว์เซอร์ dApp ในตัวเข้า XPLAY ได้โดยตรง" }),
    sortOrder: 5,
    isActive: true,
  },
];

async function seed() {
  console.log('Seeding tutorials...');
  
  // Check if tutorials already exist
  const [existingTuts] = await conn.query('SELECT COUNT(*) as cnt FROM tutorials');
  if (existingTuts[0].cnt > 0) {
    console.log(`Tutorials table already has ${existingTuts[0].cnt} entries. Clearing...`);
    await conn.query('DELETE FROM tutorials');
  }

  for (const t of tutorials) {
    await conn.query(
      `INSERT INTO tutorials (youtubeId, videoUrl, iconName, iconColor, title, description, tooltip, category, steps, sortOrder, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [t.youtubeId, t.videoUrl, t.iconName, t.iconColor, t.title, t.description, t.tooltip, t.category, t.steps, t.sortOrder, t.isActive ? 1 : 0]
    );
  }
  console.log(`Seeded ${tutorials.length} tutorials`);

  // Check if FAQ already exists
  const [existingFaq] = await conn.query('SELECT COUNT(*) as cnt FROM faqItems');
  if (existingFaq[0].cnt > 0) {
    console.log(`FAQ table already has ${existingFaq[0].cnt} entries. Clearing...`);
    await conn.query('DELETE FROM faqItems');
  }

  for (const f of faqItems) {
    await conn.query(
      `INSERT INTO faqItems (question, answer, sortOrder, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [f.question, f.answer, f.sortOrder, f.isActive ? 1 : 0]
    );
  }
  console.log(`Seeded ${faqItems.length} FAQ items`);

  await conn.end();
  console.log('Done!');
}

seed().catch(console.error);
