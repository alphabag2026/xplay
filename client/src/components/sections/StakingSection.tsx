import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { STAKING_BOTS } from "@/lib/data";
import { motion } from "framer-motion";

export default function StakingSection() {
  const { t } = useApp();

  return (
    <SectionWrapper id="staking" className="grid-bg">
      <SectionTitle
        badge={t("staking.badge")}
        title={t("staking.title")}
        subtitle={t("staking.subtitle")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {STAKING_BOTS.map((bot, i) => (
          <motion.div
            key={bot.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-4 sm:p-5 text-center"
            style={{
              background: "rgba(15,15,35,0.7)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${bot.color}22`,
              borderRadius: "8px",
              boxShadow: `0 0 20px ${bot.color}10`,
            }}
          >
            <p
              className="text-sm font-bold mb-1"
              style={{ color: bot.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {bot.name}
            </p>
            <p className="text-xs mb-3" style={{ color: "rgba(226,232,240,0.5)" }}>
              {bot.period}
            </p>
            <p
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: bot.color,
                textShadow: `0 0 15px ${bot.color}40`,
              }}
            >
              {bot.dailyReturn}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(226,232,240,0.4)" }}>
              {t("staking.daily")}
            </p>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${bot.color}15` }}>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                APY {bot.apy}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("staking.fee.title")}
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
          {[
            { step: "1", text: t("staking.step1"), color: "#22d3ee" },
            { step: "→", text: "", color: "rgba(226,232,240,0.3)" },
            { step: "2", text: t("staking.step2"), color: "#a855f7" },
            { step: "→", text: "", color: "rgba(226,232,240,0.3)" },
            { step: "3", text: t("staking.step3"), color: "#00f5ff" },
          ].map((item, i) =>
            item.text ? (
              <div
                key={i}
                className="flex-1 p-3 sm:p-4 text-center"
                style={{
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}20`,
                  borderRadius: "6px",
                  minWidth: "120px",
                }}
              >
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: item.color }}
                >
                  Step {item.step}
                </p>
                <p className="text-xs whitespace-pre-line" style={{ color: "rgba(226,232,240,0.7)" }}>
                  {item.text}
                </p>
              </div>
            ) : (
              <span key={i} className="text-xl hidden sm:block" style={{ color: item.color }}>
                →
              </span>
            )
          )}
        </div>
        <div
          className="p-4"
          style={{
            background: "rgba(168,85,247,0.05)",
            border: "1px solid rgba(168,85,247,0.15)",
            borderRadius: "6px",
          }}
        >
          <p className="text-sm" style={{ color: "rgba(226,232,240,0.8)" }}>
            {t("staking.fee.note")}
          </p>
        </div>
      </GlassCard>

      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("staking.sim.title")}
        </h3>
        <DataTable
          headers={[t("staking.sim.h1"), t("staking.sim.h2")]}
          rows={[
            [t("staking.sim.r1"), "10,000 USDT"],
            [t("staking.sim.r2"), "1.3% ~ 1.8%"],
            [t("staking.sim.r3"), "2,640% ~ 17,145%"],
            [t("staking.sim.r4"), "264,000 U ~ 1,714,500 U"],
          ]}
          highlightRow={3}
        />
        <p className="text-xs mt-4" style={{ color: "rgba(226,232,240,0.4)" }}>
          {t("staking.sim.note")}
        </p>
      </GlassCard>
    </SectionWrapper>
  );
}
