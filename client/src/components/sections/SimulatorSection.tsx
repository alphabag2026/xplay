/*
 * XPLAY Revenue Simulator Section
 * Design: Cyberpunk Data Terminal — Interactive calculator
 * Colors: Deep Navy (#0a0e1a) + Neon Cyan (#00f5ff) + Purple (#a855f7)
 */

import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { STAKING_BOTS } from "@/lib/data";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Coins, Receipt } from "lucide-react";
import { useState, useMemo } from "react";

// Tax brackets for reference (Korean crypto tax as example)
const TAX_RATE = 22; // 22% (20% tax + 2% local tax) on gains over 2.5M KRW
const TAX_EXEMPTION_KRW = 2_500_000; // 250만원 기본공제
const USD_TO_KRW = 1_350; // approximate rate

export default function SimulatorSection() {
  const { t } = useApp();
  const [investment, setInvestment] = useState<string>("1000");
  const [selectedBot, setSelectedBot] = useState<number>(4); // Quantum Bot default

  const investmentNum = useMemo(() => {
    const n = parseFloat(investment);
    return isNaN(n) || n < 0 ? 0 : n;
  }, [investment]);

  const bot = STAKING_BOTS[selectedBot];

  const results = useMemo(() => {
    if (!investmentNum || !bot) return null;

    const dailyMin = investmentNum * (bot.minReturn / 100);
    const dailyMax = investmentNum * (bot.maxReturn / 100);
    const dailyAvg = (dailyMin + dailyMax) / 2;

    // Fee deduction (20% platform fee already applied, user gets net)
    const feeRate = 0.20;
    const grossDailyMin = dailyMin / (1 - feeRate);
    const grossDailyMax = dailyMax / (1 - feeRate);

    const periodDays = bot.days;
    const totalMin = dailyMin * periodDays;
    const totalMax = dailyMax * periodDays;
    const totalAvg = dailyAvg * periodDays;

    const monthlyMin = dailyMin * 30;
    const monthlyMax = dailyMax * 30;

    // ROI
    const roiMin = (totalMin / investmentNum) * 100;
    const roiMax = (totalMax / investmentNum) * 100;

    // Tax calculation (Korean crypto tax)
    const totalGainKRW = totalAvg * USD_TO_KRW;
    const taxableGain = Math.max(0, totalGainKRW - TAX_EXEMPTION_KRW);
    const taxAmount = taxableGain * (TAX_RATE / 100);
    const taxAmountUSD = taxAmount / USD_TO_KRW;
    const afterTaxGain = totalAvg - taxAmountUSD;

    return {
      dailyMin,
      dailyMax,
      dailyAvg,
      monthlyMin,
      monthlyMax,
      totalMin,
      totalMax,
      totalAvg,
      roiMin,
      roiMax,
      periodDays,
      taxableGain,
      taxAmount,
      taxAmountUSD,
      afterTaxGain,
      grossDailyMin,
      grossDailyMax,
    };
  }, [investmentNum, bot]);

  const fmt = (n: number) =>
    n >= 1000
      ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : n.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const fmtKRW = (n: number) =>
    n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

  return (
    <SectionWrapper id="simulator">
      <SectionTitle
        badge={t("sim.badge")}
        title={t("sim.title")}
        subtitle={t("sim.subtitle")}
      />

      {/* Input Area */}
      <GlassCard className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Investment Input */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-3"
              style={{ color: "#00f5ff" }}
            >
              <Coins size={16} />
              {t("sim.input.label")}
            </label>
            <div className="relative">
              <input
                type="number"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                placeholder="1000"
                min="0"
                className="w-full px-4 py-3 text-lg font-bold outline-none transition-all"
                style={{
                  background: "rgba(0,245,255,0.04)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  borderRadius: "8px",
                  color: "#e2e8f0",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#00f5ff")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(0,245,255,0.2)")}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                style={{ color: "rgba(0,245,255,0.5)" }}
              >
                USDT
              </span>
            </div>
            {/* Quick amount buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setInvestment(String(amount))}
                  className="px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    background:
                      investment === String(amount)
                        ? "rgba(0,245,255,0.15)"
                        : "rgba(0,245,255,0.04)",
                    border: `1px solid ${investment === String(amount) ? "rgba(0,245,255,0.4)" : "rgba(0,245,255,0.1)"}`,
                    borderRadius: "6px",
                    color: investment === String(amount) ? "#00f5ff" : "rgba(226,232,240,0.6)",
                  }}
                >
                  ${fmt(amount)}
                </button>
              ))}
            </div>
          </div>

          {/* Bot Selection */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium mb-3"
              style={{ color: "#a855f7" }}
            >
              <TrendingUp size={16} />
              {t("sim.bot.label")}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {STAKING_BOTS.map((b, i) => (
                <button
                  key={b.name}
                  onClick={() => setSelectedBot(i)}
                  className="flex items-center justify-between px-4 py-2.5 text-left transition-all"
                  style={{
                    background:
                      selectedBot === i
                        ? `${b.color}15`
                        : "rgba(15,15,35,0.5)",
                    border: `1px solid ${selectedBot === i ? `${b.color}40` : "rgba(255,255,255,0.05)"}`,
                    borderRadius: "6px",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: b.color,
                        boxShadow: selectedBot === i ? `0 0 8px ${b.color}` : "none",
                      }}
                    />
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: selectedBot === i ? b.color : "rgba(226,232,240,0.7)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {b.name}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
                      ({b.period})
                    </span>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color: selectedBot === i ? b.color : "rgba(226,232,240,0.5)",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {b.dailyReturn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Results */}
      {results && investmentNum > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              {
                label: t("sim.result.daily"),
                value: `$${fmt(results.dailyMin)} ~ $${fmt(results.dailyMax)}`,
                color: "#22d3ee",
                icon: <TrendingUp size={18} />,
              },
              {
                label: t("sim.result.monthly"),
                value: `$${fmt(results.monthlyMin)} ~ $${fmt(results.monthlyMax)}`,
                color: "#818cf8",
                icon: <Coins size={18} />,
              },
              {
                label: `${t("sim.result.total")} (${results.periodDays}${t("sim.result.days")})`,
                value: `$${fmt(results.totalMin)} ~ $${fmt(results.totalMax)}`,
                color: "#a855f7",
                icon: <Calculator size={18} />,
              },
              {
                label: "ROI",
                value: `${fmt(results.roiMin)}% ~ ${fmt(results.roiMax)}%`,
                color: "#e879f9",
                icon: <TrendingUp size={18} />,
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="p-4 sm:p-5 text-center"
                style={{
                  background: `${metric.color}08`,
                  border: `1px solid ${metric.color}20`,
                  borderRadius: "8px",
                }}
              >
                <div className="flex items-center justify-center gap-2 mb-2" style={{ color: metric.color }}>
                  {metric.icon}
                </div>
                <p
                  className="text-lg sm:text-xl font-bold mb-1"
                  style={{
                    color: metric.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                    textShadow: `0 0 12px ${metric.color}30`,
                  }}
                >
                  {metric.value}
                </p>
                <p className="text-[10px] sm:text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Results Table */}
          <GlassCard className="mb-6" glowColor="purple">
            <h3
              className="flex items-center gap-2 text-base font-bold mb-4"
              style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Calculator size={18} />
              {t("sim.detail.title")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: "0 4px" }}>
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2 text-xs font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
                      {t("sim.detail.item")}
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
                      {t("sim.detail.min")}
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
                      {t("sim.detail.max")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: t("sim.detail.invest"), min: `$${fmt(investmentNum)}`, max: `$${fmt(investmentNum)}`, highlight: false },
                    { label: t("sim.detail.dailyNet"), min: `$${fmt(results.dailyMin)}`, max: `$${fmt(results.dailyMax)}`, highlight: false },
                    { label: t("sim.detail.monthlyNet"), min: `$${fmt(results.monthlyMin)}`, max: `$${fmt(results.monthlyMax)}`, highlight: false },
                    { label: `${t("sim.detail.periodTotal")} (${results.periodDays}${t("sim.result.days")})`, min: `$${fmt(results.totalMin)}`, max: `$${fmt(results.totalMax)}`, highlight: true },
                    { label: `ROI`, min: `${fmt(results.roiMin)}%`, max: `${fmt(results.roiMax)}%`, highlight: true },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background: row.highlight ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <td
                        className="px-4 py-2.5 text-sm"
                        style={{
                          color: row.highlight ? "#a855f7" : "rgba(226,232,240,0.7)",
                          fontWeight: row.highlight ? 700 : 400,
                          borderRadius: "6px 0 0 6px",
                        }}
                      >
                        {row.label}
                      </td>
                      <td
                        className="px-4 py-2.5 text-sm text-right font-mono"
                        style={{
                          color: row.highlight ? "#00f5ff" : "rgba(226,232,240,0.8)",
                          fontWeight: row.highlight ? 700 : 400,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {row.min}
                      </td>
                      <td
                        className="px-4 py-2.5 text-sm text-right font-mono"
                        style={{
                          color: row.highlight ? "#00f5ff" : "rgba(226,232,240,0.8)",
                          fontWeight: row.highlight ? 700 : 400,
                          fontFamily: "'Space Grotesk', sans-serif",
                          borderRadius: "0 6px 6px 0",
                        }}
                      >
                        {row.max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Tax Estimation */}
          <GlassCard>
            <h3
              className="flex items-center gap-2 text-base font-bold mb-4"
              style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Receipt size={18} />
              {t("sim.tax.title")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div
                className="p-4 text-center"
                style={{
                  background: "rgba(0,245,255,0.04)",
                  border: "1px solid rgba(0,245,255,0.1)",
                  borderRadius: "6px",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.5)" }}>
                  {t("sim.tax.gain")}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  ₩{fmtKRW(results.totalAvg * USD_TO_KRW)}
                </p>
                <p className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
                  (${fmt(results.totalAvg)})
                </p>
              </div>
              <div
                className="p-4 text-center"
                style={{
                  background: "rgba(239,68,68,0.04)",
                  border: "1px solid rgba(239,68,68,0.15)",
                  borderRadius: "6px",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.5)" }}>
                  {t("sim.tax.amount")}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "#ef4444", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  ₩{fmtKRW(results.taxAmount)}
                </p>
                <p className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
                  (~${fmt(results.taxAmountUSD)})
                </p>
              </div>
              <div
                className="p-4 text-center"
                style={{
                  background: "rgba(34,197,94,0.04)",
                  border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: "6px",
                }}
              >
                <p className="text-xs mb-1" style={{ color: "rgba(226,232,240,0.5)" }}>
                  {t("sim.tax.afterTax")}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "#22c55e", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  ${fmt(results.afterTaxGain)}
                </p>
                <p className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
                  (₩{fmtKRW(results.afterTaxGain * USD_TO_KRW)})
                </p>
              </div>
            </div>
            <div
              className="p-3"
              style={{
                background: "rgba(234,179,8,0.05)",
                border: "1px solid rgba(234,179,8,0.15)",
                borderRadius: "6px",
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: "rgba(226,232,240,0.6)" }}>
                {t("sim.tax.note")}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </SectionWrapper>
  );
}
