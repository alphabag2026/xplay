import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { TEAM_RANKS, V5_SIMULATION } from "@/lib/data";

export default function TeamSection() {
  return (
    <SectionWrapper id="team" className="grid-bg">
      <SectionTitle
        badge="Team Revenue"
        title="팀 수익 & 직급 수익"
        subtitle="V1~V8 커뮤니티 파트너 등급 — 커뮤니티를 성장시킬수록 수익이 기하급수적으로 증가합니다"
      />

      {/* V1-V8 Table */}
      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          V1~V8 등급 전체 테이블
        </h3>
        <DataTable
          headers={["등급", "개인 유동성", "추천팀 유동성", "믹싱 수익비", "AI퀀트 수익비", "등급 보너스"]}
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

      {/* Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          {
            title: "개인 유동성",
            desc: "본인이 플랫폼에 예치한 USDT 금액. V1은 100 USDT만 있으면 시작",
            color: "#22d3ee",
          },
          {
            title: "추천팀 유동성",
            desc: "내가 구축한 팀 전체의 총 유동성. 팀이 클수록 높은 등급 도달",
            color: "#818cf8",
          },
          {
            title: "믹싱/AI퀀트 수익비",
            desc: "팀 수익의 배분 비율. V8은 최대 80%까지 수령 가능",
            color: "#a855f7",
          },
          {
            title: "등급 보너스",
            desc: "모든 등급에서 동일하게 10%의 추가 보너스 지급",
            color: "#e879f9",
          },
        ].map((item, i) => (
          <GlassCard key={i} delay={i * 0.1} glowColor={i % 2 === 0 ? "cyan" : "purple"}>
            <p
              className="text-sm font-bold mb-2"
              style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {item.title}
            </p>
            <p className="text-xs" style={{ color: "rgba(226,232,240,0.6)" }}>
              {item.desc}
            </p>
          </GlassCard>
        ))}
      </div>

      {/* V5 Simulation */}
      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          V5 노드 수익 시뮬레이션 (보수적 예측)
        </h3>
        <p className="text-xs mb-4" style={{ color: "rgba(226,232,240,0.5)" }}>
          개인 5,000 U / 팀 1,500,000 U 기준
        </p>
        <DataTable
          headers={["수익원", "일일 이익 (USDT)", "월별 이익 (USDT)", "연간 이익 (USDT)"]}
          rows={V5_SIMULATION.map((s) => [s.source, s.daily, s.monthly, s.yearly])}
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
              팀 관리 이익 비중
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
              V8 최대 수익 배분
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
