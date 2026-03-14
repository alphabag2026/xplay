/*
 * LiveTransactionFeed — Global Revenue Live Feed
 * Shows simulated real-time transactions from 180 countries
 * Random intervals 5-20 seconds, amounts $100-$100,000
 * CRITICAL: totalVolume, txCount, activeCountries NEVER decrease
 * CRITICAL: Data persisted in localStorage — survives refresh/revisit
 * Uses a deterministic seed based on page creation timestamp so all visitors see consistent data
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, Globe, Zap } from "lucide-react";

// 180 countries with flag emoji and name
const COUNTRIES = [
  { flag: "🇺🇸", code: "US", name: "United States" },
  { flag: "🇰🇷", code: "KR", name: "South Korea" },
  { flag: "🇨🇳", code: "CN", name: "China" },
  { flag: "🇯🇵", code: "JP", name: "Japan" },
  { flag: "🇬🇧", code: "GB", name: "United Kingdom" },
  { flag: "🇩🇪", code: "DE", name: "Germany" },
  { flag: "🇫🇷", code: "FR", name: "France" },
  { flag: "🇮🇹", code: "IT", name: "Italy" },
  { flag: "🇪🇸", code: "ES", name: "Spain" },
  { flag: "🇧🇷", code: "BR", name: "Brazil" },
  { flag: "🇮🇳", code: "IN", name: "India" },
  { flag: "🇷🇺", code: "RU", name: "Russia" },
  { flag: "🇨🇦", code: "CA", name: "Canada" },
  { flag: "🇦🇺", code: "AU", name: "Australia" },
  { flag: "🇲🇽", code: "MX", name: "Mexico" },
  { flag: "🇮🇩", code: "ID", name: "Indonesia" },
  { flag: "🇹🇷", code: "TR", name: "Turkey" },
  { flag: "🇸🇦", code: "SA", name: "Saudi Arabia" },
  { flag: "🇦🇪", code: "AE", name: "UAE" },
  { flag: "🇹🇭", code: "TH", name: "Thailand" },
  { flag: "🇻🇳", code: "VN", name: "Vietnam" },
  { flag: "🇵🇭", code: "PH", name: "Philippines" },
  { flag: "🇲🇾", code: "MY", name: "Malaysia" },
  { flag: "🇸🇬", code: "SG", name: "Singapore" },
  { flag: "🇳🇱", code: "NL", name: "Netherlands" },
  { flag: "🇨🇭", code: "CH", name: "Switzerland" },
  { flag: "🇸🇪", code: "SE", name: "Sweden" },
  { flag: "🇳🇴", code: "NO", name: "Norway" },
  { flag: "🇩🇰", code: "DK", name: "Denmark" },
  { flag: "🇫🇮", code: "FI", name: "Finland" },
  { flag: "🇵🇱", code: "PL", name: "Poland" },
  { flag: "🇦🇹", code: "AT", name: "Austria" },
  { flag: "🇧🇪", code: "BE", name: "Belgium" },
  { flag: "🇵🇹", code: "PT", name: "Portugal" },
  { flag: "🇬🇷", code: "GR", name: "Greece" },
  { flag: "🇨🇿", code: "CZ", name: "Czech Republic" },
  { flag: "🇷🇴", code: "RO", name: "Romania" },
  { flag: "🇭🇺", code: "HU", name: "Hungary" },
  { flag: "🇮🇪", code: "IE", name: "Ireland" },
  { flag: "🇮🇱", code: "IL", name: "Israel" },
  { flag: "🇿🇦", code: "ZA", name: "South Africa" },
  { flag: "🇳🇬", code: "NG", name: "Nigeria" },
  { flag: "🇪🇬", code: "EG", name: "Egypt" },
  { flag: "🇰🇪", code: "KE", name: "Kenya" },
  { flag: "🇬🇭", code: "GH", name: "Ghana" },
  { flag: "🇲🇦", code: "MA", name: "Morocco" },
  { flag: "🇹🇳", code: "TN", name: "Tunisia" },
  { flag: "🇦🇷", code: "AR", name: "Argentina" },
  { flag: "🇨🇱", code: "CL", name: "Chile" },
  { flag: "🇨🇴", code: "CO", name: "Colombia" },
  { flag: "🇵🇪", code: "PE", name: "Peru" },
  { flag: "🇻🇪", code: "VE", name: "Venezuela" },
  { flag: "🇪🇨", code: "EC", name: "Ecuador" },
  { flag: "🇺🇾", code: "UY", name: "Uruguay" },
  { flag: "🇵🇰", code: "PK", name: "Pakistan" },
  { flag: "🇧🇩", code: "BD", name: "Bangladesh" },
  { flag: "🇱🇰", code: "LK", name: "Sri Lanka" },
  { flag: "🇳🇵", code: "NP", name: "Nepal" },
  { flag: "🇲🇲", code: "MM", name: "Myanmar" },
  { flag: "🇰🇭", code: "KH", name: "Cambodia" },
  { flag: "🇱🇦", code: "LA", name: "Laos" },
  { flag: "🇧🇳", code: "BN", name: "Brunei" },
  { flag: "🇲🇳", code: "MN", name: "Mongolia" },
  { flag: "🇰🇿", code: "KZ", name: "Kazakhstan" },
  { flag: "🇺🇿", code: "UZ", name: "Uzbekistan" },
  { flag: "🇬🇪", code: "GE", name: "Georgia" },
  { flag: "🇦🇲", code: "AM", name: "Armenia" },
  { flag: "🇦🇿", code: "AZ", name: "Azerbaijan" },
  { flag: "🇶🇦", code: "QA", name: "Qatar" },
  { flag: "🇰🇼", code: "KW", name: "Kuwait" },
  { flag: "🇧🇭", code: "BH", name: "Bahrain" },
  { flag: "🇴🇲", code: "OM", name: "Oman" },
  { flag: "🇯🇴", code: "JO", name: "Jordan" },
  { flag: "🇱🇧", code: "LB", name: "Lebanon" },
  { flag: "🇮🇶", code: "IQ", name: "Iraq" },
  { flag: "🇮🇷", code: "IR", name: "Iran" },
  { flag: "🇭🇰", code: "HK", name: "Hong Kong" },
  { flag: "🇹🇼", code: "TW", name: "Taiwan" },
  { flag: "🇲🇴", code: "MO", name: "Macau" },
  { flag: "🇳🇿", code: "NZ", name: "New Zealand" },
  { flag: "🇫🇯", code: "FJ", name: "Fiji" },
  { flag: "🇵🇬", code: "PG", name: "Papua New Guinea" },
  { flag: "🇨🇷", code: "CR", name: "Costa Rica" },
  { flag: "🇵🇦", code: "PA", name: "Panama" },
  { flag: "🇩🇴", code: "DO", name: "Dominican Republic" },
  { flag: "🇯🇲", code: "JM", name: "Jamaica" },
  { flag: "🇹🇹", code: "TT", name: "Trinidad & Tobago" },
  { flag: "🇮🇸", code: "IS", name: "Iceland" },
  { flag: "🇱🇺", code: "LU", name: "Luxembourg" },
  { flag: "🇲🇹", code: "MT", name: "Malta" },
  { flag: "🇨🇾", code: "CY", name: "Cyprus" },
  { flag: "🇪🇪", code: "EE", name: "Estonia" },
  { flag: "🇱🇻", code: "LV", name: "Latvia" },
  { flag: "🇱🇹", code: "LT", name: "Lithuania" },
  { flag: "🇸🇰", code: "SK", name: "Slovakia" },
  { flag: "🇸🇮", code: "SI", name: "Slovenia" },
  { flag: "🇭🇷", code: "HR", name: "Croatia" },
  { flag: "🇷🇸", code: "RS", name: "Serbia" },
  { flag: "🇧🇬", code: "BG", name: "Bulgaria" },
  { flag: "🇺🇦", code: "UA", name: "Ukraine" },
  { flag: "🇪🇹", code: "ET", name: "Ethiopia" },
  { flag: "🇹🇿", code: "TZ", name: "Tanzania" },
  { flag: "🇺🇬", code: "UG", name: "Uganda" },
  { flag: "🇸🇳", code: "SN", name: "Senegal" },
  { flag: "🇨🇲", code: "CM", name: "Cameroon" },
  { flag: "🇨🇮", code: "CI", name: "Ivory Coast" },
  { flag: "🇲🇬", code: "MG", name: "Madagascar" },
  { flag: "🇲🇿", code: "MZ", name: "Mozambique" },
  { flag: "🇿🇲", code: "ZM", name: "Zambia" },
  { flag: "🇿🇼", code: "ZW", name: "Zimbabwe" },
  { flag: "🇧🇼", code: "BW", name: "Botswana" },
  { flag: "🇳🇦", code: "NA", name: "Namibia" },
  { flag: "🇷🇼", code: "RW", name: "Rwanda" },
  { flag: "🇲🇱", code: "ML", name: "Mali" },
  { flag: "🇧🇫", code: "BF", name: "Burkina Faso" },
  { flag: "🇳🇪", code: "NE", name: "Niger" },
  { flag: "🇹🇩", code: "TD", name: "Chad" },
  { flag: "🇬🇦", code: "GA", name: "Gabon" },
  { flag: "🇨🇬", code: "CG", name: "Congo" },
  { flag: "🇦🇴", code: "AO", name: "Angola" },
  { flag: "🇱🇾", code: "LY", name: "Libya" },
  { flag: "🇸🇩", code: "SD", name: "Sudan" },
  { flag: "🇩🇿", code: "DZ", name: "Algeria" },
  { flag: "🇧🇴", code: "BO", name: "Bolivia" },
  { flag: "🇵🇾", code: "PY", name: "Paraguay" },
  { flag: "🇬🇹", code: "GT", name: "Guatemala" },
  { flag: "🇭🇳", code: "HN", name: "Honduras" },
  { flag: "🇸🇻", code: "SV", name: "El Salvador" },
  { flag: "🇳🇮", code: "NI", name: "Nicaragua" },
  { flag: "🇨🇺", code: "CU", name: "Cuba" },
  { flag: "🇭🇹", code: "HT", name: "Haiti" },
  { flag: "🇧🇸", code: "BS", name: "Bahamas" },
  { flag: "🇧🇧", code: "BB", name: "Barbados" },
  { flag: "🇦🇫", code: "AF", name: "Afghanistan" },
  { flag: "🇹🇲", code: "TM", name: "Turkmenistan" },
  { flag: "🇹🇯", code: "TJ", name: "Tajikistan" },
  { flag: "🇰🇬", code: "KG", name: "Kyrgyzstan" },
  { flag: "🇾🇪", code: "YE", name: "Yemen" },
  { flag: "🇸🇾", code: "SY", name: "Syria" },
  { flag: "🇵🇸", code: "PS", name: "Palestine" },
  { flag: "🇲🇩", code: "MD", name: "Moldova" },
  { flag: "🇧🇾", code: "BY", name: "Belarus" },
  { flag: "🇦🇱", code: "AL", name: "Albania" },
  { flag: "🇲🇰", code: "MK", name: "North Macedonia" },
  { flag: "🇲🇪", code: "ME", name: "Montenegro" },
  { flag: "🇧🇦", code: "BA", name: "Bosnia" },
  { flag: "🇽🇰", code: "XK", name: "Kosovo" },
  { flag: "🇱🇮", code: "LI", name: "Liechtenstein" },
  { flag: "🇲🇨", code: "MC", name: "Monaco" },
  { flag: "🇦🇩", code: "AD", name: "Andorra" },
  { flag: "🇸🇲", code: "SM", name: "San Marino" },
  { flag: "🇲🇻", code: "MV", name: "Maldives" },
  { flag: "🇧🇹", code: "BT", name: "Bhutan" },
  { flag: "🇹🇱", code: "TL", name: "Timor-Leste" },
  { flag: "🇲🇺", code: "MU", name: "Mauritius" },
  { flag: "🇸🇨", code: "SC", name: "Seychelles" },
  { flag: "🇧🇯", code: "BJ", name: "Benin" },
  { flag: "🇹🇬", code: "TG", name: "Togo" },
  { flag: "🇸🇱", code: "SL", name: "Sierra Leone" },
  { flag: "🇱🇷", code: "LR", name: "Liberia" },
  { flag: "🇬🇳", code: "GN", name: "Guinea" },
  { flag: "🇬🇲", code: "GM", name: "Gambia" },
  { flag: "🇬🇼", code: "GW", name: "Guinea-Bissau" },
  { flag: "🇨🇻", code: "CV", name: "Cape Verde" },
  { flag: "🇸🇹", code: "ST", name: "Sao Tome" },
  { flag: "🇬🇶", code: "GQ", name: "Equatorial Guinea" },
  { flag: "🇩🇯", code: "DJ", name: "Djibouti" },
  { flag: "🇪🇷", code: "ER", name: "Eritrea" },
  { flag: "🇸🇴", code: "SO", name: "Somalia" },
  { flag: "🇰🇲", code: "KM", name: "Comoros" },
  { flag: "🇧🇮", code: "BI", name: "Burundi" },
  { flag: "🇲🇼", code: "MW", name: "Malawi" },
  { flag: "🇱🇸", code: "LS", name: "Lesotho" },
  { flag: "🇸🇿", code: "SZ", name: "Eswatini" },
  { flag: "🇲🇷", code: "MR", name: "Mauritania" },
  { flag: "🇼🇸", code: "WS", name: "Samoa" },
  { flag: "🇹🇴", code: "TO", name: "Tonga" },
  { flag: "🇻🇺", code: "VU", name: "Vanuatu" },
  { flag: "🇸🇧", code: "SB", name: "Solomon Islands" },
];

// Bot types
const BOT_TYPES = ["Sprint", "Velocity", "Momentum", "Catalyst", "Quantum"];

// ========== Deterministic PRNG (Mulberry32) ==========
// Same seed → same sequence, so all visitors see the same data
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fixed creation timestamp — the "birth" of this page
// All calculations are relative to this moment
const PAGE_BIRTH = new Date("2026-03-10T00:00:00Z").getTime();

// Average interval between transactions (in ms)
const AVG_INTERVAL = 12000; // ~12 seconds average

function generateHashFromSeed(rng: () => number): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(rng() * chars.length)];
  }
  return hash;
}

function generateAmountFromSeed(rng: () => number): number {
  const tiers = [
    { min: 100, max: 500, weight: 35 },
    { min: 500, max: 1000, weight: 25 },
    { min: 1000, max: 5000, weight: 20 },
    { min: 5000, max: 10000, weight: 10 },
    { min: 10000, max: 50000, weight: 7 },
    { min: 50000, max: 100000, weight: 3 },
  ];
  const totalWeight = tiers.reduce((s, t) => s + t.weight, 0);
  let r = rng() * totalWeight;
  for (const tier of tiers) {
    r -= tier.weight;
    if (r <= 0) {
      return Math.round(tier.min + rng() * (tier.max - tier.min));
    }
  }
  return 500;
}

// Generate the interval (in ms) for a given transaction index
function getIntervalForIndex(rng: () => number): number {
  // 5-20 seconds random
  return (Math.floor(rng() * 16) + 5) * 1000;
}

// Shuffled country order (deterministic)
function getShuffledCountryIndices(rng: () => number): number[] {
  const indices = Array.from({ length: COUNTRIES.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

interface Transaction {
  id: string;
  country: (typeof COUNTRIES)[number];
  hash: string;
  amount: number;
  bot: string;
  timestamp: number; // ms since epoch
}

// Compute all transactions that should have occurred from PAGE_BIRTH until `upToTime`
function computeTransactionsUpTo(upToTime: number): {
  transactions: Transaction[];
  totalVolume: number;
  txCount: number;
  seenCountryCodes: Set<string>;
} {
  const rng = mulberry32(42); // fixed seed
  const shuffled = getShuffledCountryIndices(mulberry32(123)); // separate seed for shuffle

  const transactions: Transaction[] = [];
  let totalVolume = 0;
  const seenCountryCodes = new Set<string>();
  let currentTime = PAGE_BIRTH;
  let txIndex = 0;
  // Track which shuffled countries have been introduced
  let nextNewCountryIdx = 0;

  while (currentTime <= upToTime) {
    const interval = getIntervalForIndex(rng);
    currentTime += interval;
    if (currentTime > upToTime) break;

    // Pick country: 40% chance new country if available, else from seen
    let country: (typeof COUNTRIES)[number];
    const useNew = rng() < 0.4 && nextNewCountryIdx < shuffled.length;
    if (useNew) {
      country = COUNTRIES[shuffled[nextNewCountryIdx]];
      nextNewCountryIdx++;
    } else if (seenCountryCodes.size > 0) {
      const seenArr = Array.from(seenCountryCodes);
      const code = seenArr[Math.floor(rng() * seenArr.length)];
      country = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    } else {
      country = COUNTRIES[shuffled[nextNewCountryIdx]];
      nextNewCountryIdx++;
    }

    const amount = generateAmountFromSeed(rng);
    const hash = generateHashFromSeed(rng);
    const bot = BOT_TYPES[Math.floor(rng() * BOT_TYPES.length)];

    seenCountryCodes.add(country.code);
    totalVolume += amount;
    txIndex++;

    transactions.push({
      id: `tx-${txIndex}`,
      country,
      hash,
      amount,
      bot,
      timestamp: currentTime,
    });
  }

  return {
    transactions: transactions.slice(-20), // keep last 20 for display
    totalVolume,
    txCount: txIndex,
    seenCountryCodes,
  };
}

function formatAmount(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return `$${n.toLocaleString()}`;
}

function shortenHash(hash: string): string {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export default function LiveTransactionFeed() {
  const { t } = useApp();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [displayVolume, setDisplayVolume] = useState(0);
  const [displayTxCount, setDisplayTxCount] = useState(0);
  const [displayCountries, setDisplayCountries] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute current state based on elapsed time since PAGE_BIRTH
  const refreshState = useCallback(() => {
    const now = Date.now();
    const result = computeTransactionsUpTo(now);
    setTransactions(result.transactions);
    setDisplayVolume(result.totalVolume);
    setDisplayTxCount(result.txCount);
    setDisplayCountries(result.seenCountryCodes.size);
  }, []);

  useEffect(() => {
    // Initial computation
    refreshState();

    // Refresh every 3 seconds to pick up new transactions
    timerRef.current = setInterval(refreshState, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refreshState]);

  return (
    <SectionWrapper id="live-feed">
      <SectionTitle
        badge={t("feed.badge")}
        title={t("feed.title")}
        subtitle={t("feed.subtitle")}
      />

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          {
            icon: <TrendingUp size={16} />,
            label: t("feed.stat.volume"),
            value: formatAmount(displayVolume),
          },
          {
            icon: <Activity size={16} />,
            label: t("feed.stat.txcount"),
            value: displayTxCount.toString(),
          },
          {
            icon: <Globe size={16} />,
            label: t("feed.stat.countries"),
            value: `${displayCountries}`,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center py-4 px-2"
            style={{
              background: "rgba(0,245,255,0.04)",
              border: "1px solid rgba(0,245,255,0.1)",
              borderRadius: "10px",
            }}
          >
            <div
              className="flex items-center justify-center gap-1 mb-1"
              style={{ color: "#00f5ff" }}
            >
              {stat.icon}
            </div>
            <div
              className="text-xl font-bold"
              style={{
                color: "#00f5ff",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {stat.value}
            </div>
            <div
              className="text-[10px] mt-0.5"
              style={{ color: "rgba(226,232,240,0.5)" }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Live Indicator */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{
              background: "#ef4444",
              boxShadow: "0 0 8px #ef4444",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            className="text-xs font-bold tracking-wider uppercase"
            style={{
              color: "#ef4444",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {t("feed.live")}
          </span>
        </div>
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(239,68,68,0.2)" }}
        />
      </div>

      {/* Transaction Feed */}
      <div className="space-y-2 overflow-hidden" style={{ maxHeight: "480px" }}>
        <AnimatePresence initial={false}>
          {transactions.map((tx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -40, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div
                className="flex items-center gap-3 p-3"
                style={{
                  background:
                    tx.amount >= 50000
                      ? "rgba(168,85,247,0.08)"
                      : tx.amount >= 10000
                        ? "rgba(0,245,255,0.06)"
                        : "rgba(255,255,255,0.02)",
                  border: `1px solid ${
                    tx.amount >= 50000
                      ? "rgba(168,85,247,0.2)"
                      : tx.amount >= 10000
                        ? "rgba(0,245,255,0.15)"
                        : "rgba(255,255,255,0.06)"
                  }`,
                  borderRadius: "10px",
                }}
              >
                {/* Flag */}
                <span className="text-2xl shrink-0">{tx.country.flag}</span>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{
                        color:
                          tx.amount >= 50000
                            ? "#a855f7"
                            : tx.amount >= 10000
                              ? "#00f5ff"
                              : "#22c55e",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {formatAmount(tx.amount)}
                    </span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{
                        background: "rgba(0,245,255,0.08)",
                        color: "rgba(226,232,240,0.5)",
                      }}
                    >
                      {tx.bot}
                    </span>
                    {tx.amount >= 10000 && (
                      <Zap
                        size={12}
                        style={{
                          color: tx.amount >= 50000 ? "#a855f7" : "#00f5ff",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[11px] font-mono"
                      style={{ color: "rgba(226,232,240,0.4)" }}
                    >
                      {shortenHash(tx.hash)}
                    </span>
                    <span
                      className="text-[10px]"
                      style={{ color: "rgba(226,232,240,0.3)" }}
                    >
                      {tx.country.name}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <span
                  className="text-[10px] shrink-0"
                  style={{ color: "rgba(226,232,240,0.3)" }}
                >
                  {timeAgo(tx.timestamp)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pulse animation CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </SectionWrapper>
  );
}
