import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { REFERRAL_TIERS } from "@/lib/data";

export default function ReferralSection() {
  return (
    <SectionWrapper id="referral" className="grid-bg">
      <SectionTitle
        badge="Referral Rewards"
        title="직추천 수익 — 6단계 보상 체계"
        subtitle="1명만 추천해도 10% 보상. 추천 인원이 늘어날수록 더 깊은 세대까지 수익이 열립니다"
      />

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10 max-w-xl mx-auto">
        <StatBox label="1세대 보상" value="10%" color="#00f5ff" delay={0} />
        <StatBox label="최대 세대" value="6단계" color="#a855f7" delay={0.1} />
        <StatBox label="최소 유동성" value="100U" color="#22d3ee" delay={0.2} />
      </div>

      {/* Referral table */}
      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          6단계 직추천 보상 체계
        </h3>
        <DataTable
          headers={["유효 직추 인원", "잠금 해제 대수", "유동성 실적 요구", "추천 보상 비율"]}
          rows={REFERRAL_TIERS.map((t) => [
            `${t.directRefs}명`,
            t.generation,
            t.liquidity,
            t.reward,
          ])}
          highlightRow={0}
        />
      </GlassCard>

      {/* How it works */}
      <GlassCard glowColor="purple" className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          어떻게 작동하나요?
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
                1명을 직접 추천 + 100 USDT 유동성 보유
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                추천인의 수익에서 <strong style={{ color: "#00f5ff" }}>10%</strong>를 보상으로 받습니다
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
                2명을 직접 추천 + 500 USDT 유동성 보유
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                2세대의 수익에서 <strong style={{ color: "#a855f7" }}>5%</strong>를 추가로 받습니다
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
                최대 6세대까지 수익 확보
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                추천 인원이 늘어날수록 더 깊은 세대까지 수익이 열립니다
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Example */}
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
            예시: A → B → C → D 추천 체인
          </p>
          <p className="text-sm" style={{ color: "rgba(226,232,240,0.7)" }}>
            A는 B의 수익 <strong style={{ color: "#00f5ff" }}>10%</strong> + C의 수익{" "}
            <strong style={{ color: "#a855f7" }}>5%</strong> + D의 수익{" "}
            <strong style={{ color: "#22d3ee" }}>3%</strong>를 동시에 받을 수 있습니다.
          </p>
          <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.4)" }}>
            (조건: A가 3명 이상 직추 + 1,000U 이상 유동성 보유)
          </p>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}
