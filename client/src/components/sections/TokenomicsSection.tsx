import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { motion } from "framer-motion";

export default function TokenomicsSection() {
  const { t } = useApp();

  return (
    <SectionWrapper id="tokenomics" bgImage={IMAGES.tokenomics}>
      <SectionTitle
        badge={t("token.badge")}
        title={t("token.title")}
        subtitle={t("token.subtitle")}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatBox label={t("token.supply")} value="2100만개" sub="21,000,000 XP" color="#00f5ff" delay={0} />
        <StatBox label={t("token.burn")} value="20M" sub="20,000,000 XP" color="#ef4444" delay={0.1} />
        <StatBox label="Remaining" value="100만개" sub="1,000,000 XP" color="#a855f7" delay={0.2} />
        <StatBox label="Burn Rate" value="95.2%" color="#e879f9" delay={0.3} />
      </div>

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-6 text-center"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("token.deflation")}
        </h3>
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
          <div className="text-center">
            <motion.div
              className="w-20 h-20 sm:w-28 sm:h-28 mx-auto flex items-center justify-center"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "2px solid rgba(0,245,255,0.3)",
                borderRadius: "50%",
              }}
              animate={{ scale: [1, 0.95, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <span
                className="text-sm sm:text-lg font-bold"
                style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                2100만개
              </span>
            </motion.div>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.5)" }}>
              {t("token.supply")}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl" style={{ color: "rgba(239,68,68,0.8)" }}>
              🔥
            </span>
            <div className="w-12 sm:w-20 h-px my-2" style={{ background: "linear-gradient(90deg, #00f5ff, #ef4444)" }} />
            <p className="text-xs" style={{ color: "rgba(239,68,68,0.8)" }}>
              -2000만개 소각
            </p>
          </div>

          <div className="text-center">
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center"
              style={{
                background: "rgba(168,85,247,0.15)",
                border: "2px solid rgba(168,85,247,0.4)",
                borderRadius: "50%",
                boxShadow: "0 0 30px rgba(168,85,247,0.3)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span
                className="text-xs sm:text-sm font-bold"
                style={{ color: "#e879f9", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                100만개
              </span>
            </motion.div>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.5)" }}>
              Remaining
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mb-10" glowColor="purple">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("token.purchase")}
        </h3>
        <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.6)" }}>
          {t("token.purchase.desc")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "Step 1", titleKey: "token.step1", descKey: "token.step1.desc", color: "#22d3ee" },
            { step: "Step 2", titleKey: "token.step2", descKey: "token.step2.desc", color: "#a855f7" },
            { step: "Step 3", titleKey: "token.step3", descKey: "token.step3.desc", color: "#e879f9" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 text-center"
              style={{
                background: `${item.color}08`,
                border: `1px solid ${item.color}20`,
                borderRadius: "6px",
              }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.step}
              </p>
              <p className="text-sm font-bold mb-1" style={{ color: "rgba(226,232,240,0.9)" }}>
                {t(item.titleKey)}
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                {t(item.descKey)}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { titleKey: "token.util.governance", descKey: "token.util.governance.desc", icon: "🗳️", color: "#22d3ee" },
          { titleKey: "token.util.boost", descKey: "token.util.boost.desc", icon: "🚀", color: "#a855f7" },
          { titleKey: "token.util.vip", descKey: "token.util.vip.desc", icon: "👑", color: "#e879f9" },
          { titleKey: "token.util.value", descKey: "token.util.value.desc", icon: "💎", color: "#00f5ff" },
        ].map((item, i) => (
          <GlassCard key={i} delay={i * 0.1} glowColor={i % 2 === 0 ? "cyan" : "purple"}>
            <div className="text-center">
              <span className="text-2xl">{item.icon}</span>
              <p
                className="text-sm font-bold mt-2 mb-1"
                style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t(item.titleKey)}
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                {t(item.descKey)}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
