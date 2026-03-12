import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { STAKING_BOTS } from "@/lib/data";
import { motion } from "framer-motion";

export default function StakingSection() {
  return (
    <SectionWrapper id="staking" className="grid-bg">
      <SectionTitle
        badge="Personal Revenue"
        title="AI 스테이킹 봇으로 매일 자동 수익"
        subtitle="5가지 봇 중 투자 기간에 맞는 봇을 선택하면, AI가 자동으로 수익을 창출합니다"
      />

      {/* Bot cards - horizontal scroll on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {STAKING_BOTS.map((bot, i) => (
          <motion.div
            key={bot.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="p-4 sm:p-5 text-center"
            style={{
              background: "rgba(15,15,35,0.7)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${bot.color}22`,
              borderRadius: "8px",
              boxShadow: `0 0 20px ${bot.color}10`,
            }}
          >
            <p
              className="text-sm font-bold mb-1"
              style={{ color: bot.color, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {bot.name}
            </p>
            <p className="text-xs mb-3" style={{ color: "rgba(226,232,240,0.5)" }}>
              {bot.period}
            </p>
            <p
              className="text-2xl font-bold mb-1"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: bot.color,
                textShadow: `0 0 15px ${bot.color}40`,
              }}
            >
              {bot.dailyReturn}
            </p>
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(226,232,240,0.4)" }}>
              일일 수익률
            </p>
            <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${bot.color}15` }}>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                APY {bot.apy}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fee structure explanation */}
      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          5 USDT 자동 입금 구조 — 수수료 20%는 이렇게 작동합니다
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6">
          {[
            { step: "1", text: "AI 봇이\n수익 창출", color: "#22d3ee" },
            { step: "→", text: "", color: "rgba(226,232,240,0.3)" },
            { step: "2", text: "20% 수수료\n차감", color: "#a855f7" },
            { step: "→", text: "", color: "rgba(226,232,240,0.3)" },
            { step: "3", text: "5 USDT 도달 시\n자동 입금", color: "#00f5ff" },
          ].map((item, i) =>
            item.text ? (
              <div
                key={i}
                className="flex-1 p-3 sm:p-4 text-center"
                style={{
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}20`,
                  borderRadius: "6px",
                  minWidth: "120px",
                }}
              >
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: item.color }}
                >
                  Step {item.step}
                </p>
                <p className="text-xs whitespace-pre-line" style={{ color: "rgba(226,232,240,0.7)" }}>
                  {item.text}
                </p>
              </div>
            ) : (
              <span key={i} className="text-xl hidden sm:block" style={{ color: item.color }}>
                →
              </span>
            )
          )}
        </div>

        <div
          className="p-4"
          style={{
            background: "rgba(168,85,247,0.05)",
            border: "1px solid rgba(168,85,247,0.15)",
            borderRadius: "6px",
          }}
        >
          <p className="text-sm" style={{ color: "rgba(226,232,240,0.8)" }}>
            여러분이 받는 <strong style={{ color: "#00f5ff" }}>5 USDT는 이미 수수료가 빠진 순수익</strong>입니다.
            차감된 20%가 바로 플랫폼의 핵심 수익원입니다.
          </p>
        </div>
      </GlassCard>

      {/* Simulation table */}
      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          개인 수익 시뮬레이션 — 10,000 USDT × Quantum Bot (360일)
        </h3>
        <DataTable
          headers={["항목", "수치"]}
          rows={[
            ["투자금", "10,000 USDT"],
            ["일평균 수익률", "1.3% ~ 1.8%"],
            ["연간 예상 수익률 (APY)", "2,640% ~ 17,145%"],
            ["360일 예상 순이익", "264,000 U ~ 1,714,500 U"],
          ]}
          highlightRow={3}
        />
        <p className="text-xs mt-4" style={{ color: "rgba(226,232,240,0.4)" }}>
          * 시뮬레이션이며, 실제 수익은 시장 상황에 따라 달라질 수 있습니다.
        </p>
      </GlassCard>
    </SectionWrapper>
  );
}
