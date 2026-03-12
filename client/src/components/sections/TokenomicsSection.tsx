import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import StatBox from "@/components/StatBox";
import { IMAGES, TOKEN_INFO } from "@/lib/data";
import { motion } from "framer-motion";

export default function TokenomicsSection() {
  return (
    <SectionWrapper id="tokenomics" bgImage={IMAGES.tokenomics}>
      <SectionTitle
        badge="Token Economics"
        title="XP 토큰 이코노믹"
        subtitle="극한 디플레이션 가치 모델 — 2,100만 개 중 2,000만 개를 소각하여 100만 개만 남깁니다"
      />

      {/* Token stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatBox label="총 발행량" value="21M" sub="21,000,000 XP" color="#00f5ff" delay={0} />
        <StatBox label="소각 목표" value="20M" sub="20,000,000 XP" color="#ef4444" delay={0.1} />
        <StatBox label="잔존량" value="1M" sub="1,000,000 XP" color="#a855f7" delay={0.2} />
        <StatBox label="소각 비율" value="95.2%" color="#e879f9" delay={0.3} />
      </div>

      {/* Deflation visual */}
      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-6 text-center"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          극한 디플레이션 프로세스
        </h3>
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6">
          <div className="text-center">
            <motion.div
              className="w-20 h-20 sm:w-28 sm:h-28 mx-auto flex items-center justify-center"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "2px solid rgba(0,245,255,0.3)",
                borderRadius: "50%",
              }}
              animate={{ scale: [1, 0.95, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <span
                className="text-sm sm:text-lg font-bold"
                style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                21M
              </span>
            </motion.div>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.5)" }}>
              총 발행량
            </p>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl" style={{ color: "rgba(239,68,68,0.8)" }}>
              🔥
            </span>
            <div className="w-12 sm:w-20 h-px my-2" style={{ background: "linear-gradient(90deg, #00f5ff, #ef4444)" }} />
            <p className="text-xs" style={{ color: "rgba(239,68,68,0.8)" }}>
              -20M 소각
            </p>
          </div>

          <div className="text-center">
            <motion.div
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center"
              style={{
                background: "rgba(168,85,247,0.15)",
                border: "2px solid rgba(168,85,247,0.4)",
                borderRadius: "50%",
                boxShadow: "0 0 30px rgba(168,85,247,0.3)",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span
                className="text-xs sm:text-sm font-bold"
                style={{ color: "#e879f9", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                1M
              </span>
            </motion.div>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.5)" }}>
              잔존량
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Purchase system */}
      <GlassCard className="mb-10" glowColor="purple">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          수익형 구매 한도 시스템
        </h3>
        <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.6)" }}>
          XP 토큰은 시장에서 마음대로 구매할 수 없습니다. 오직 플랫폼에서 발생한 실제 수익으로만 구매 기회가 열립니다.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: "Step 1", title: "수익 발생", desc: "AI 스테이킹 봇 또는 게임을 통해 USDT 이익 획득", color: "#22d3ee" },
            { step: "Step 2", title: "구매 한도 부여", desc: "실제 USDT 이익에 비례하여 XP 구매 한도 자동 부여", color: "#a855f7" },
            { step: "Step 3", title: "XP 토큰 획득", desc: "부여된 한도를 사용하여 XP 토큰 선형 획득", color: "#e879f9" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 text-center"
              style={{
                background: `${item.color}08`,
                border: `1px solid ${item.color}20`,
                borderRadius: "6px",
              }}
            >
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.step}
              </p>
              <p className="text-sm font-bold mb-1" style={{ color: "rgba(226,232,240,0.9)" }}>
                {item.title}
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* 4 Utilities */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "거버넌스", desc: "플랫폼 의사결정 투표 참여 권한", icon: "🗳️", color: "#22d3ee" },
          { title: "수익 부스트", desc: "XP 보유량에 따라 스테이킹 보상 증가", icon: "🚀", color: "#a855f7" },
          { title: "VIP 특전", desc: "프리미엄 기능 우선 액세스", icon: "👑", color: "#e879f9" },
          { title: "가치 상승", desc: "수수료 소각 + Buyback & Burn", icon: "💎", color: "#00f5ff" },
        ].map((item, i) => (
          <GlassCard key={i} delay={i * 0.1} glowColor={i % 2 === 0 ? "cyan" : "purple"}>
            <div className="text-center">
              <span className="text-2xl">{item.icon}</span>
              <p
                className="text-sm font-bold mt-2 mb-1"
                style={{ color: item.color, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {item.title}
              </p>
              <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                {item.desc}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  );
}
