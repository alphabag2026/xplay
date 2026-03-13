import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { TEAM_RANKS, V5_SIMULATION } from "@/lib/data";

export default function TeamSection() {
  const { t } = useApp();

  const simRows = V5_SIMULATION.map((s, i) => [
    i === 0 ? t("team.sim.r1") : i === 1 ? t("team.sim.r2") : i === 2 ? t("team.sim.r3") : t("team.sim.r4"),
    s.daily,
    s.monthly,
    s.yearly,
  ]);

  return (
    <SectionWrapper id="team" className="grid-bg">
      <SectionTitle
        badge={t("team.badge")}
        title={t("team.title")}
        subtitle={t("team.subtitle")}
      />

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("team.table.title")}
        </h3>
        <DataTable
          headers={[t("team.h1"), t("team.h2"), t("team.h3"), t("team.h4"), t("team.h5"), t("team.h6")]}
          rows={TEAM_RANKS.map((r) => [
            r.rank,
            r.personalLiq,
            r.teamLiq,
            r.mixingRate,
            r.quantRate,
            r.bonus,
          ])}
          highlightRow={4}
        />
      </GlassCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { titleKey: "team.info.personal", descKey: "team.info.personal.desc", color: "#22d3ee" },
          { titleKey: "team.info.team", descKey: "team.info.team.desc", color: "#818cf8" },
          { titleKey: "team.info.rate", descKey: "team.info.rate.desc", color: "#a855f7" },
          { titleKey: "team.info.bonus", descKey: "team.info.bonus.desc", color: "#e879f9" },
        ].map((item, i) => (
          <GlassCard key={i} delay={i * 0.1} glowColor={i % 2 === 0 ? "cyan" : "purple"}>
            <p
              className="text-sm font-bold mb-2"
              style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t(item.titleKey)}
            </p>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.6)" }}>
              {t(item.descKey)}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("team.sim.title")}
        </h3>
        <p className="text-xs mb-4" style={{ color: "rgba(226,232,240,0.5)" }}>
          {t("team.sim.basis")}
        </p>
        <DataTable
          headers={[t("team.sim.h1"), t("team.sim.h2"), t("team.sim.h3"), t("team.sim.h4")]}
          rows={simRows}
          highlightRow={3}
        />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div
            className="p-4 text-center"
            style={{
              background: "rgba(168,85,247,0.05)",
              border: "1px solid rgba(168,85,247,0.15)",
              borderRadius: "6px",
            }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>
              {t("team.stat1")}
            </p>
            <p
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#a855f7",
                textShadow: "0 0 20px rgba(168,85,247,0.4)",
              }}
            >
              85%
            </p>
          </div>
          <div
            className="p-4 text-center"
            style={{
              background: "rgba(0,245,255,0.05)",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "6px",
            }}
          >
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>
              {t("team.stat2")}
            </p>
            <p
              className="text-3xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "#00f5ff",
                textShadow: "0 0 20px rgba(0,245,255,0.4)",
              }}
            >
              80%
            </p>
          </div>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}
