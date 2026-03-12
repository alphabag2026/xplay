import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { GAME_PREDICTION, IMAGES, LOTTO_DISTRIBUTION } from "@/lib/data";

export default function GameSection() {
  return (
    <SectionWrapper id="game" bgImage={IMAGES.game}>
      <SectionTitle
        badge="Killer Revenue Model"
        title="BTC 초단타 예측 게임"
        subtitle="게임 수수료가 회사의 핵심 자원 — 숫자가 말해줍니다"
      />

      {/* Game stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatBox label="라운드 주기" value="30초" sub="/ 1분 / 5분" delay={0} />
        <StatBox label="게임 수수료율" value="5%" delay={0.1} />
        <StatBox label="글로벌 목표 유저" value="80K" sub="80,000명" delay={0.2} />
        <StatBox label="30초당 베팅 인원" value="100명" delay={0.3} />
      </div>

      {/* Revenue simulation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-10">
        {GAME_PREDICTION.simulations.map((sim, i) => (
          <GlassCard key={i} delay={i * 0.15} glowColor={i === 0 ? "cyan" : "purple"}>
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(226,232,240,0.5)" }}>
              {sim.label}
            </p>
            <p className="text-sm mb-3" style={{ color: "rgba(226,232,240,0.6)" }}>
              100명 × ${sim.betSize} × 2,880라운드/일 × 5%
            </p>
            <p
              className="text-3xl sm:text-4xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: i === 0 ? "#00f5ff" : "#a855f7",
                textShadow: i === 0 ? "0 0 20px rgba(0,245,255,0.4)" : "0 0 20px rgba(168,85,247,0.4)",
              }}
            >
              일 ${sim.dailyRevenue.toLocaleString()}
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.4)" }}>
              30초 라운드만 계산 (1분, 5분 별도)
            </p>
          </GlassCard>
        ))}
      </div>

      {/* Why users come */}
      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-3"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          왜 유저가 모이는가?
        </h3>
        <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.7)" }}>
          매일 AI 스테이킹 봇에서 <strong style={{ color: "#00f5ff" }}>5 USDT가 자동으로 입금</strong>됩니다.
          이 5달러로 부담 없이 예측 게임에 참여할 수 있습니다.
          "공짜 돈으로 게임한다"는 심리가 유저 유입의 핵심 동력입니다.
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
            핵심: $5든 $100이든, 유저가 베팅할 때마다 5%의 수수료가 발생하고,
            이것이 회사와 소개자들의 수익이 됩니다.
          </p>
        </div>
      </GlassCard>

      {/* Lotto distribution */}
      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          올인 로또 수익 분배 (10,000 USDT 풀 기준)
        </h3>
        <DataTable
          headers={["구분", "금액 (USDT)", "비율"]}
          rows={LOTTO_DISTRIBUTION.map((d) => [d.label, d.amount.toLocaleString(), `${d.pct}%`])}
        />
        <p className="text-xs mt-4" style={{ color: "rgba(226,232,240,0.5)" }}>
          91%를 유저에게 돌려주면서도, 빠른 회전율(일 240회)로 안정적인 플랫폼 수익을 창출합니다.
        </p>
      </GlassCard>
    </SectionWrapper>
  );
}
