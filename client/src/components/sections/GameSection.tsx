import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { useApp } from "@/contexts/AppContext";
import { GAME_PREDICTION, IMAGES, LOTTO_DISTRIBUTION } from "@/lib/data";
import { Rocket, ExternalLink } from "lucide-react";

const K_PLAY_URL = "https://k-play.net";

export default function GameSection() {
  const { t } = useApp();

  return (
    <SectionWrapper id="game" bgImage={IMAGES.game}>
      <SectionTitle
        badge={t("game.badge")}
        title={t("game.title")}
        subtitle={t("game.subtitle")}
      />

      {/* Test Service Open Banner */}
      <div
        className="mb-8 p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(0,245,255,0.08))",
          border: "1px solid rgba(34,197,94,0.3)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="relative flex h-3 w-3"
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#22c55e" }} />
            <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "#22c55e" }} />
          </span>
          <span
            className="text-sm sm:text-base font-bold"
            style={{
              color: "#22c55e",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {t("game.testService")}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#4ade80",
            }}
          >
            LIVE
          </span>
        </div>
        <a
          href={K_PLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #22c55e, #00f5ff)",
            color: "#0a0e1a",
            fontFamily: "'Space Grotesk', sans-serif",
            boxShadow: "0 0 20px rgba(34,197,94,0.3)",
          }}
        >
          <Rocket size={16} />
          {t("game.tryNow")}
          <ExternalLink size={14} />
        </a>
      </div>

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
