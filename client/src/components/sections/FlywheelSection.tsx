import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { IMAGES, REVENUE_SUMMARY } from "@/lib/data";
import { motion } from "framer-motion";

export default function FlywheelSection() {
  return (
    <SectionWrapper id="flywheel" bgImage={IMAGES.flywheel}>
      <SectionTitle
        badge="Ecosystem Flywheel"
        title="생태계 선순환 플라이휠"
        subtitle="수익이 수익을 만드는 구조 — 세 가지 수익 축이 서로 맞물려 돌아갑니다"
      />

      {/* Flywheel visual */}
      <GlassCard className="mb-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 items-center text-sm">
          {[
            { text: "AI 자동 수익", color: "#00f5ff" },
            { text: "→", color: "rgba(226,232,240,0.3)" },
            { text: "지갑 잔고 증가", color: "rgba(226,232,240,0.7)" },
            { text: "→", color: "rgba(226,232,240,0.3)" },
            { text: "게임 참여", color: "#a855f7" },
            { text: "→", color: "rgba(226,232,240,0.3)" },
            { text: "수수료 발생", color: "#e879f9" },
            { text: "→", color: "rgba(226,232,240,0.3)" },
            { text: "수익 풀 확장", color: "#22d3ee" },
            { text: "→", color: "rgba(226,232,240,0.3)" },
            { text: "커뮤니티 성장", color: "#00f5ff" },
            { text: "→ 반복", color: "rgba(226,232,240,0.3)" },
          ].map((item, i) => (
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

      {/* 3 Revenue Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
        {[
          {
            title: "회사 이익",
            items: [
              "토큰 믹싱 (3.2%)",
              "AI 트레이딩 (6.5%)",
              "Market Making (4.5%)",
              "GameFi 수수료 (5~9%)",
            ],
            summary: "안정적 플랫폼 운영 기반",
            color: "#00f5ff",
            glow: "cyan" as const,
          },
          {
            title: "개인 수익",
            items: [
              "AI 봇 스테이킹 (일 최대 1.8%)",
              "GameFi 참여 보상",
              "직추천 수익 (최대 10%)",
            ],
            summary: "자동화된 자산 증식",
            color: "#a855f7",
            glow: "purple" as const,
          },
          {
            title: "팀 수익",
            items: [
              "V1~V8 커뮤니티 파트너",
              "최대 80% 수익 분배",
              "무한 깊이 하위 수익",
            ],
            summary: "커뮤니티 확장의 핵심 동력",
            color: "#e879f9",
            glow: "purple" as const,
          },
        ].map((pillar, i) => (
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
            <div
              className="pt-3"
              style={{ borderTop: `1px solid ${pillar.color}15` }}
            >
              <p className="text-xs" style={{ color: pillar.color }}>
                {pillar.summary}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Revenue summary table */}
      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          수익 구조 한눈에 정리
        </h3>
        <DataTable
          headers={["수익 유형", "핵심 내용", "최대 수익률/비율"]}
          rows={REVENUE_SUMMARY.map((r) => [r.type, r.content, r.maxRate])}
        />
      </GlassCard>

      {/* Quote */}
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
            "내가 벌면 → 플랫폼이 커지고 → 플랫폼이 커지면 → 내가 더 많이 번다"
          </p>
          <p className="text-sm mb-6" style={{ color: "rgba(226,232,240,0.6)" }}>
            사용자의 수익 활동과 게임 참여가 플랫폼의 가치를 높이고,
            <br className="hidden sm:block" />
            높아진 가치가 다시 사용자에게 더 큰 보상으로 돌아가는 무한 확장형 생태계
          </p>
          <a
            href="https://www.xplay.io"
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
            지금 XPLAY 시작하기 →
          </a>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}
