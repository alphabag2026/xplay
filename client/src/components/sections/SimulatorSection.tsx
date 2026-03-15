/*
 * XPLAY Revenue Simulator Section — Mobile-first, no tax
 * Design: Cyberpunk Data Terminal — Interactive calculator
 */

import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { STAKING_BOTS } from "@/lib/data";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Coins } from "lucide-react";
import { useState, useMemo } from "react";

export default function SimulatorSection() {
  const { t } = useApp();
  const [investment, setInvestment] = useState<string>("1000");
  const [selectedBot, setSelectedBot] = useState<number>(4);

  const investmentNum = useMemo(() => {
    const n = parseFloat(investment);
    return isNaN(n) || n < 0 ? 0 : n;
  }, [investment]);

  const bot = STAKING_BOTS[selectedBot];

  const results = useMemo(() => {
    if (!investmentNum || !bot) return null;

    const dailyMin = investmentNum * (bot.minReturn / 100);
    const dailyMax = investmentNum * (bot.maxReturn / 100);

    const periodDays = bot.days;
    const totalMin = dailyMin * periodDays;
    const totalMax = dailyMax * periodDays;

    const monthlyMin = dailyMin * 30;
    const monthlyMax = dailyMax * 30;

    const roiMin = (totalMin / investmentNum) * 100;
    const roiMax = (totalMax / investmentNum) * 100;

    return { dailyMin, dailyMax, monthlyMin, monthlyMax, totalMin, totalMax, roiMin, roiMax, periodDays };
  }, [investmentNum, bot]);

  const fmt = (n: number) =>
    n >= 1000
      ? n.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : n.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <SectionWrapper id="simulator">
      <SectionTitle
        badge={t("sim.badge")}
        title={t("sim.title")}
        subtitle={t("sim.subtitle")}
      />

      {/* Input Area — stacked for mobile */}
      <GlassCard className="mb-6">
        {/* Investment Input */}
        <div className="mb-5">
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
              className="w-full px-4 py-3 text-lg font-bold outline-none"
              style={{
                background: "rgba(0,245,255,0.04)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold"
              style={{ color: "rgba(0,245,255,0.5)" }}
            >
              USDT
            </span>
          </div>
          {/* Quick amount buttons — 3 cols on mobile */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[100, 500, 1000, 5000, 10000, 50000].map((amount) => (
              <button
                key={amount}
                onClick={() => setInvestment(String(amount))}
                className="px-2 py-2 text-xs font-medium transition-all text-center"
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
          <div className="space-y-2">
            {STAKING_BOTS.map((b, i) => (
              <button
                key={b.name}
                onClick={() => setSelectedBot(i)}
                className="flex items-center justify-between w-full px-4 py-2.5 text-left transition-all"
                style={{
                  background:
                    selectedBot === i ? `${b.color}15` : "rgba(15,15,35,0.5)",
                  border: `1px solid ${selectedBot === i ? `${b.color}40` : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "6px",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
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
                  <span className="text-[10px]" style={{ color: "rgba(226,232,240,0.4)" }}>
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
      </GlassCard>

      {/* Results */}
      {results && investmentNum > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Key Metrics — 2x2 grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              {
                label: t("sim.result.daily"),
                value: `$${fmt(results.dailyMin)} ~ $${fmt(results.dailyMax)}`,
                color: "#22d3ee",
                icon: <TrendingUp size={16} />,
              },
              {
                label: t("sim.result.monthly"),
                value: `$${fmt(results.monthlyMin)} ~ $${fmt(results.monthlyMax)}`,
                color: "#818cf8",
                icon: <Coins size={16} />,
              },
              {
                label: `${t("sim.result.total")} (${results.periodDays}${t("sim.result.days")})`,
                value: `$${fmt(results.totalMin)} ~ $${fmt(results.totalMax)}`,
                color: "#a855f7",
                icon: <Calculator size={16} />,
              },
              {
                label: "ROI",
                value: `${fmt(results.roiMin)}% ~ ${fmt(results.roiMax)}%`,
                color: "#e879f9",
                icon: <TrendingUp size={16} />,
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="p-3 sm:p-4 text-center"
                style={{
                  background: `${metric.color}08`,
                  border: `1px solid ${metric.color}20`,
                  borderRadius: "8px",
                }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1.5" style={{ color: metric.color }}>
                  {metric.icon}
                </div>
                <p
                  className="text-base sm:text-lg font-bold mb-0.5"
                  style={{
                    color: metric.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                    textShadow: `0 0 12px ${metric.color}30`,
                    fontSize: "clamp(0.75rem, 3vw, 1.125rem)",
                  }}
                >
                  {metric.value}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(226,232,240,0.5)" }}>
                  {metric.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Detailed Results Table */}
          <GlassCard>
            <h3
              className="flex items-center gap-2 text-sm font-bold mb-3"
              style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Calculator size={16} />
              {t("sim.detail.title")}
            </h3>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm" style={{ borderCollapse: "separate", borderSpacing: "0 3px" }}>
                <thead>
                  <tr>
                    <th className="text-left px-3 py-1.5 text-[10px] font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
                      {t("sim.detail.item")}
                    </th>
                    <th className="text-right px-3 py-1.5 text-[10px] font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
                      {t("sim.detail.min")}
                    </th>
                    <th className="text-right px-3 py-1.5 text-[10px] font-medium" style={{ color: "rgba(226,232,240,0.5)" }}>
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
                    { label: "ROI", min: `${fmt(results.roiMin)}%`, max: `${fmt(results.roiMax)}%`, highlight: true },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background: row.highlight ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <td
                        className="px-3 py-2 text-xs"
                        style={{
                          color: row.highlight ? "#a855f7" : "rgba(226,232,240,0.7)",
                          fontWeight: row.highlight ? 700 : 400,
                          borderRadius: "6px 0 0 6px",
                        }}
                      >
                        {row.label}
                      </td>
                      <td
                        className="px-3 py-2 text-xs text-right"
                        style={{
                          color: row.highlight ? "#00f5ff" : "rgba(226,232,240,0.8)",
                          fontWeight: row.highlight ? 700 : 400,
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {row.min}
                      </td>
                      <td
                        className="px-3 py-2 text-xs text-right"
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
        </motion.div>
      )}

      {/* Fee Notice */}
      <div className="mt-4 text-center space-y-1">
        <p className="text-[11px]" style={{ color: "rgba(226,232,240,0.4)" }}>
          플랫폼 수수료 20% 미제외 금액입니다
        </p>
        <p className="text-[10px]" style={{ color: "rgba(226,232,240,0.3)" }}>
          플랫폼 수수료는 변동 될 수 있습니다.
        </p>
      </div>
    </SectionWrapper>
  );
}
