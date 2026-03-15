import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { motion } from "framer-motion";
import { Globe, Bot, Blocks, Users, Rocket, Code, ExternalLink } from "lucide-react";

export default function RoadmapSection() {
  const { t } = useApp();

  const phases = [
    {
      icon: <Globe size={24} />,
      title: t("road.phase1.title"),
      desc: t("road.phase1.desc"),
      status: t("road.phase1.status"),
      statusColor: "#22c55e",
      statusBg: "rgba(34,197,94,0.12)",
      statusBorder: "rgba(34,197,94,0.3)",
      highlight: t("road.phase1.users"),
      highlightIcon: <Users size={14} />,
      accentColor: "#00f5ff",
      lineActive: true,
      link: "https://k-play.net",
    },
    {
      icon: <Bot size={24} />,
      title: t("road.phase2.title"),
      desc: t("road.phase2.desc"),
      status: t("road.phase2.status"),
      statusColor: "#eab308",
      statusBg: "rgba(234,179,8,0.12)",
      statusBorder: "rgba(234,179,8,0.3)",
      highlight: null,
      highlightIcon: null,
      accentColor: "#a855f7",
      lineActive: false,
      link: null,
    },
    {
      icon: <Blocks size={24} />,
      title: t("road.phase3.title"),
      desc: t("road.phase3.desc"),
      status: t("road.phase3.status"),
      statusColor: "#eab308",
      statusBg: "rgba(234,179,8,0.12)",
      statusBorder: "rgba(234,179,8,0.3)",
      highlight: null,
      highlightIcon: null,
      accentColor: "#e879f9",
      lineActive: false,
      link: null,
    },
  ];

  return (
    <SectionWrapper id="roadmap" bgImage={IMAGES.tokenomics}>
      <SectionTitle
        badge={t("road.badge")}
        title={t("road.title")}
        subtitle={t("road.subtitle")}
      />

      <div className="relative max-w-2xl mx-auto">
        {phases.map((phase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="relative flex gap-4 sm:gap-6 mb-8 last:mb-0"
          >
            {/* Timeline line & dot */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shrink-0"
                style={{
                  background: `rgba(${phase.accentColor === "#00f5ff" ? "0,245,255" : phase.accentColor === "#a855f7" ? "168,85,247" : "232,121,249"},0.12)`,
                  border: `2px solid ${phase.accentColor}`,
                  boxShadow: `0 0 20px ${phase.accentColor}30`,
                  color: phase.accentColor,
                }}
              >
                {phase.icon}
              </div>
              {i < phases.length - 1 && (
                <div
                  className="w-0.5 flex-1 mt-2"
                  style={{
                    background: phase.lineActive
                      ? `linear-gradient(to bottom, ${phase.accentColor}, ${phases[i + 1].accentColor})`
                      : `linear-gradient(to bottom, rgba(226,232,240,0.15), rgba(226,232,240,0.05))`,
                  }}
                />
              )}
            </div>

            {/* Content */}
            <div
              className="flex-1 p-4 sm:p-5 pb-6"
              style={{
                background: "rgba(15,15,35,0.7)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${phase.accentColor}20`,
                borderRadius: "8px",
                boxShadow: `0 0 20px ${phase.accentColor}08`,
              }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3
                  className="text-base sm:text-lg font-bold"
                  style={{
                    color: phase.accentColor,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {phase.title}
                </h3>
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full"
                  style={{
                    background: phase.statusBg,
                    border: `1px solid ${phase.statusBorder}`,
                    color: phase.statusColor,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: phase.statusColor,
                      boxShadow: `0 0 6px ${phase.statusColor}`,
                    }}
                  />
                  {phase.status}
                </span>
              </div>

              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "rgba(226,232,240,0.65)" }}
              >
                {phase.desc}
              </p>

              {phase.highlight && (
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0,245,255,0.06)",
                    border: "1px solid rgba(0,245,255,0.15)",
                  }}
                >
                  <span style={{ color: "#00f5ff" }}>{phase.highlightIcon}</span>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: "#00f5ff",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {phase.highlight}
                  </span>
                </div>
              )}

              {phase.link && (
                <a
                  href={phase.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-3 rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${phase.accentColor}20, ${phase.accentColor}10)`,
                    border: `1px solid ${phase.accentColor}40`,
                    color: phase.accentColor,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <Rocket size={14} />
                  {t("game.testService")}
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
}
