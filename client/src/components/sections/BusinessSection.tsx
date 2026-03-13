import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";

export default function BusinessSection() {
  const { t } = useApp();

  const models = [
    { icon: "🔄", nameKey: "biz.mixing", descKey: "biz.mixing.desc", avgReturn: 3.2, color: "#00f5ff" },
    { icon: "🤖", nameKey: "biz.quant", descKey: "biz.quant.desc", avgReturn: 6.5, color: "#a855f7" },
    { icon: "📊", nameKey: "biz.market", descKey: "biz.market.desc", avgReturn: 4.5, color: "#e879f9" },
  ];

  return (
    <SectionWrapper id="business" bgImage={IMAGES.revenue}>
      <SectionTitle
        badge={t("biz.badge")}
        title={t("biz.title")}
        subtitle={t("biz.subtitle")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
        {models.map((m, i) => (
          <GlassCard key={i} delay={i * 0.15} glowColor={i === 1 ? "purple" : "cyan"}>
            <div className="text-3xl mb-3">{m.icon}</div>
            <h3
              className="text-lg font-bold mb-2"
              style={{ color: m.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t(m.nameKey)}
            </h3>
            <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.7)" }}>
              {t(m.descKey)}
            </p>
            <div className="pt-4" style={{ borderTop: `1px solid ${m.color}22` }}>
              <p
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: m.color,
                  textShadow: `0 0 20px ${m.color}66`,
                }}
              >
                {m.avgReturn}%
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="text-center" glowColor="purple">
        <p className="text-sm sm:text-base" style={{ color: "rgba(226,232,240,0.8)" }}>
          {t("biz.footer1")}
          <br className="hidden sm:block" />
          {t("biz.footer2")}
        </p>
      </GlassCard>
    </SectionWrapper>
  );
}
