import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { motion } from "framer-motion";

export default function FlywheelSection() {
  const { t, ctaLink } = useApp();

  const wheelItems = [
    { text: t("fly.wheel.1"), color: "#00f5ff" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.2"), color: "rgba(226,232,240,0.7)" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.3"), color: "#a855f7" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.4"), color: "#e879f9" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.5"), color: "#22d3ee" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.6"), color: "#00f5ff" },
    { text: "→ ∞", color: "rgba(226,232,240,0.3)" },
  ];

  const pillars = [
    {
      title: t("fly.pillar1"),
      items: [
        `${t("biz.mixing")} (3.2%)`,
        `${t("biz.quant")} (6.5%)`,
        `${t("biz.market")} (4.5%)`,
        "GameFi (5~9%)",
      ],
      summary: t("fly.pillar1.summary"),
      color: "#00f5ff",
      glow: "cyan" as const,
    },
    {
      title: t("fly.pillar2"),
      items: [
        `AI Bot (max 1.8%/day)`,
        "GameFi Rewards",
        `Referral (max 10%)`,
      ],
      summary: t("fly.pillar2.summary"),
      color: "#a855f7",
      glow: "purple" as const,
    },
    {
      title: t("fly.pillar3"),
      items: [
        "V1~V8 Partners",
        "Max 80%",
        "Infinite Depth",
      ],
      summary: t("fly.pillar3.summary"),
      color: "#e879f9",
      glow: "purple" as const,
    },
  ];

  const summaryRows = [
    [t("fly.sum.r1"), t("fly.sum.r1.content"), t("fly.sum.r1.rate")],
    [t("fly.sum.r2"), t("fly.sum.r2.content"), t("fly.sum.r2.rate")],
    [t("fly.sum.r3"), t("fly.sum.r3.content"), t("fly.sum.r3.rate")],
    [t("fly.sum.r4"), t("fly.sum.r4.content"), t("fly.sum.r4.rate")],
    [t("fly.sum.r5"), t("fly.sum.r5.content"), t("fly.sum.r5.rate")],
  ];

  return (
    <SectionWrapper id="flywheel" bgImage={IMAGES.flywheel}>
      <SectionTitle
        badge={t("fly.badge")}
        title={t("fly.title")}
        subtitle={t("fly.subtitle")}
      />

      <GlassCard className="mb-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 items-center text-sm">
          {wheelItems.map((item, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="font-medium"
              style={{
                color: item.color,
                fontFamily: item.text.includes("→") ? undefined : "'Space Grotesk', sans-serif",
              }}
            >
              {item.text}
            </motion.span>
          ))}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
        {pillars.map((pillar, i) => (
          <GlassCard key={i} delay={i * 0.15} glowColor={pillar.glow}>
            <h3
              className="text-lg font-bold mb-3"
              style={{ color: pillar.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {pillar.title}
            </h3>
            <ul className="space-y-2 mb-4">
              {pillar.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "rgba(226,232,240,0.7)" }}>
                  <span style={{ color: pillar.color }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="pt-3" style={{ borderTop: `1px solid ${pillar.color}15` }}>
              <p className="text-xs" style={{ color: pillar.color }}>
                {pillar.summary}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("fly.summary.title")}
        </h3>
        <DataTable
          headers={[t("fly.summary.h1"), t("fly.summary.h2"), t("fly.summary.h3")]}
          rows={summaryRows}
        />
      </GlassCard>

      <GlassCard glowColor="purple">
        <div className="text-center">
          <p
            className="text-lg sm:text-xl font-bold mb-4"
            style={{
              color: "#00f5ff",
              fontFamily: "'Space Grotesk', sans-serif",
              textShadow: "0 0 20px rgba(0,245,255,0.3)",
            }}
          >
            {t("fly.quote")}
          </p>
          <p className="text-sm mb-6" style={{ color: "rgba(226,232,240,0.6)" }}>
            {t("fly.quote.desc")}
          </p>
          <a
            href={ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold tracking-wider uppercase transition-all"
            style={{
              background: "linear-gradient(135deg, #00f5ff, #a855f7)",
              color: "#0a0e1a",
              borderRadius: "4px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {t("fly.cta")}
          </a>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}
