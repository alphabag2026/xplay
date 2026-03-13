import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { useApp } from "@/contexts/AppContext";
import { GAME_PREDICTION, IMAGES, LOTTO_DISTRIBUTION } from "@/lib/data";

export default function GameSection() {
  const { t } = useApp();

  return (
    <SectionWrapper id="game" bgImage={IMAGES.game}>
      <SectionTitle
        badge={t("game.badge")}
        title={t("game.title")}
        subtitle={t("game.subtitle")}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatBox label={t("game.round")} value="30s" sub={t("game.round.sub")} delay={0} />
        <StatBox label="Fee Rate" value="5%" delay={0.1} />
        <StatBox label={t("game.users")} value="80K" sub={t("game.users.sub")} delay={0.2} />
        <StatBox label={t("game.bettors")} value="100" sub={t("game.bettors.sub")} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10">
        {GAME_PREDICTION.simulations.map((sim, i) => (
          <GlassCard key={i} delay={i * 0.15} glowColor={i === 0 ? "cyan" : "purple"}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(226,232,240,0.5)" }}>
              {sim.label}
            </p>
            <p className="text-sm mb-3" style={{ color: "rgba(226,232,240,0.6)" }}>
              100 × ${sim.betSize} × 2,880 rounds/day × 5%
            </p>
            <p
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: i === 0 ? "#00f5ff" : "#a855f7",
                textShadow: i === 0 ? "0 0 20px rgba(0,245,255,0.4)" : "0 0 20px rgba(168,85,247,0.4)",
              }}
            >
              ${sim.dailyRevenue.toLocaleString()}/day
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.4)" }}>
              {t("game.calc.note")}
            </p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("game.why")}
        </h3>
        <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.7)" }}>
          {t("game.why.desc")}
        </p>
        <div
          className="p-4"
          style={{
            background: "rgba(0,245,255,0.05)",
            border: "1px solid rgba(0,245,255,0.15)",
            borderRadius: "6px",
          }}
        >
          <p className="text-sm font-medium" style={{ color: "#00f5ff" }}>
            {t("game.key")}
          </p>
        </div>
      </GlassCard>

      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("game.lotto")}
        </h3>
        <DataTable
          headers={[t("game.lotto.h1"), t("game.lotto.h2"), t("game.lotto.h3")]}
          rows={LOTTO_DISTRIBUTION.map((d) => [
            d.label === "1등 (Winner)" ? t("game.lotto.r1") :
            d.label === "2~10등" ? t("game.lotto.r2") :
            t("game.lotto.r3"),
            d.amount.toLocaleString(),
            `${d.pct}%`,
          ])}
        />
        <p className="text-xs mt-4" style={{ color: "rgba(226,232,240,0.5)" }}>
          {t("game.lotto.note")}
        </p>
      </GlassCard>
    </SectionWrapper>
  );
}
