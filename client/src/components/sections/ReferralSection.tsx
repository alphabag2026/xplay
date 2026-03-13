import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { useApp } from "@/contexts/AppContext";
import { REFERRAL_TIERS } from "@/lib/data";

export default function ReferralSection() {
  const { t } = useApp();

  return (
    <SectionWrapper id="referral" className="grid-bg">
      <SectionTitle
        badge={t("ref.badge")}
        title={t("ref.title")}
        subtitle={t("ref.subtitle")}
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-xl mx-auto">
        <StatBox label={`1${t("ref.gen")} `} value="10%" color="#00f5ff" delay={0} />
        <StatBox label={`Max ${t("ref.gen")}`} value="6" color="#a855f7" delay={0.1} />
        <StatBox label="Min Liq." value="100U" color="#22d3ee" delay={0.2} />
      </div>

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("ref.table.title")}
        </h3>
        <DataTable
          headers={[t("ref.h1"), t("ref.h2"), t("ref.h3"), t("ref.h4")]}
          rows={REFERRAL_TIERS.map((tier) => [
            `${tier.directRefs}`,
            `${tier.tier}${t("ref.gen")}`,
            tier.liquidity,
            tier.reward,
          ])}
          highlightRow={0}
        />
      </GlassCard>

      <GlassCard glowColor="purple" className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("ref.how")}
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold"
              style={{
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "6px",
                color: "#00f5ff",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              1
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(226,232,240,0.9)" }}>
                1 referral + 100 USDT liquidity
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                → <strong style={{ color: "#00f5ff" }}>10%</strong> reward
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold"
              style={{
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.2)",
                borderRadius: "6px",
                color: "#a855f7",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              2
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(226,232,240,0.9)" }}>
                2 referrals + 500 USDT liquidity
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                → <strong style={{ color: "#a855f7" }}>5%</strong> additional
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-sm font-bold"
              style={{
                background: "rgba(0,245,255,0.1)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "6px",
                color: "#00f5ff",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              3+
            </div>
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(226,232,240,0.9)" }}>
                Up to 6 generations
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                → Deeper rewards with more referrals
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div
          className="p-4"
          style={{
            background: "rgba(0,245,255,0.05)",
            border: "1px solid rgba(0,245,255,0.15)",
            borderRadius: "6px",
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: "#00f5ff" }}>
            {t("ref.example")}
          </p>
          <p className="text-sm" style={{ color: "rgba(226,232,240,0.7)" }}>
            A → B: <strong style={{ color: "#00f5ff" }}>10%</strong> + B → C:{" "}
            <strong style={{ color: "#a855f7" }}>5%</strong> + C → D:{" "}
            <strong style={{ color: "#22d3ee" }}>3%</strong>
          </p>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}
