import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { BUSINESS_MODELS, IMAGES } from "@/lib/data";

export default function BusinessSection() {
  return (
    <SectionWrapper id="business" bgImage={IMAGES.revenue}>
      <SectionTitle
        badge="Revenue Engine"
        title="회사의 3대 핵심 비즈니스"
        subtitle="XPLAY의 수익은 실제 비즈니스 모델 3가지에서 발생하며, 그 수익을 유저에게 분배합니다"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
        {BUSINESS_MODELS.map((model, i) => (
          <GlassCard key={model.id} delay={i * 0.15} glowColor={i === 1 ? "purple" : "cyan"}>
            <div className="text-3xl mb-3">{model.icon}</div>
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {model.name}
            </h3>
            <p className="text-xs mb-4" style={{ color: "rgba(226,232,240,0.5)" }}>
              {model.nameEn}
            </p>
            <p className="text-sm mb-4" style={{ color: "rgba(226,232,240,0.7)" }}>
              {model.description}
            </p>
            <div
              className="pt-4"
              style={{ borderTop: "1px solid rgba(0,245,255,0.1)" }}
            >
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>
                평균 수익률
              </p>
              <p
                className="text-3xl font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: i === 1 ? "#a855f7" : "#00f5ff",
                  textShadow: i === 1 ? "0 0 20px rgba(168,85,247,0.4)" : "0 0 20px rgba(0,245,255,0.4)",
                }}
              >
                {model.avgReturn}%
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Summary callout */}
      <GlassCard className="text-center" glowColor="purple">
        <p className="text-sm sm:text-base" style={{ color: "rgba(226,232,240,0.8)" }}>
          이 세 가지 엔진이 플랫폼의 <strong style={{ color: "#00f5ff" }}>지속 가능한 수익 기반</strong>을 형성합니다.
          <br className="hidden sm:block" />
          단순히 "코인 가격이 오르면 돈 번다"가 아니라,{" "}
          <strong style={{ color: "#a855f7" }}>실제 비즈니스에서 수익이 발생</strong>하는 구조입니다.
        </p>
      </GlassCard>
    </SectionWrapper>
  );
}
