import DataTable from "@/components/DataTable";
import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { motion } from "framer-motion";
import { Rocket, Share2, Check, Copy, Link2 } from "lucide-react";
import { useState } from "react";

export default function FlywheelSection() {
  const { t, ctaLink, referralLink, setReferralLink } = useApp();
  const [refInput, setRefInput] = useState(referralLink);
  const [saved, setSaved] = useState(false);
  const [pageCopied, setPageCopied] = useState(false);

  const handleSaveRef = () => {
    setReferralLink(refInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSharePage = () => {
    const url = new URL(window.location.href);
    if (referralLink) {
      url.searchParams.set("ref", referralLink);
    }
    navigator.clipboard.writeText(url.toString()).then(() => {
      setPageCopied(true);
      setTimeout(() => setPageCopied(false), 2000);
    });
  };

  const wheelItems = [
    { text: t("fly.wheel.1"), color: "#00f5ff" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.2"), color: "rgba(226,232,240,0.7)" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.3"), color: "#a855f7" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.4"), color: "#e879f9" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.5"), color: "#22d3ee" },
    { text: "→", color: "rgba(226,232,240,0.3)" },
    { text: t("fly.wheel.6"), color: "#00f5ff" },
    { text: "→ ∞", color: "rgba(226,232,240,0.3)" },
  ];

  const pillars = [
    {
      title: t("fly.pillar1"),
      items: [
        `${t("biz.mixing")} (3.2%)`,
        `${t("biz.quant")} (6.5%)`,
        `${t("biz.market")} (4.5%)`,
        "GameFi (5~9%)",
      ],
      summary: t("fly.pillar1.summary"),
      color: "#00f5ff",
      glow: "cyan" as const,
    },
    {
      title: t("fly.pillar2"),
      items: [
        `AI Bot (max 1.8%/day)`,
        "GameFi Rewards",
        `Referral (max 10%)`,
      ],
      summary: t("fly.pillar2.summary"),
      color: "#a855f7",
      glow: "purple" as const,
    },
    {
      title: t("fly.pillar3"),
      items: [
        "V1~V8 Partners",
        "Max 80%",
        "Infinite Depth",
      ],
      summary: t("fly.pillar3.summary"),
      color: "#e879f9",
      glow: "purple" as const,
    },
  ];

  const summaryRows = [
    [t("fly.sum.r1"), t("fly.sum.r1.content"), t("fly.sum.r1.rate")],
    [t("fly.sum.r2"), t("fly.sum.r2.content"), t("fly.sum.r2.rate")],
    [t("fly.sum.r3"), t("fly.sum.r3.content"), t("fly.sum.r3.rate")],
    [t("fly.sum.r4"), t("fly.sum.r4.content"), t("fly.sum.r4.rate")],
    [t("fly.sum.r5"), t("fly.sum.r5.content"), t("fly.sum.r5.rate")],
  ];

  return (
    <SectionWrapper id="flywheel" bgImage={IMAGES.flywheel}>
      <SectionTitle
        badge={t("fly.badge")}
        title={t("fly.title")}
        subtitle={t("fly.subtitle")}
      />

      <GlassCard className="mb-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 items-center text-sm">
          {wheelItems.map((item, i) => (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-10">
        {pillars.map((pillar, i) => (
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
            <div className="pt-3" style={{ borderTop: `1px solid ${pillar.color}15` }}>
              <p className="text-xs" style={{ color: pillar.color }}>
                {pillar.summary}
              </p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mb-10">
        <h3
          className="text-lg font-bold mb-4"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("fly.summary.title")}
        </h3>
        <DataTable
          headers={[t("fly.summary.h1"), t("fly.summary.h2"), t("fly.summary.h3")]}
          rows={summaryRows}
        />
      </GlassCard>

      {/* Quote + CTA + Share + Referral Input */}
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
            {t("fly.quote")}
          </p>
          <p className="text-sm mb-6" style={{ color: "rgba(226,232,240,0.6)" }}>
            {t("fly.quote.desc")}
          </p>

          {/* CTA Buttons: 시작하기 + 공유하기 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <a
              href={ctaLink}
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
              <Rocket size={16} />
              {t("fly.cta")}
            </a>
            <button
              onClick={handleSharePage}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-all"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c084fc",
                borderRadius: "4px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {pageCopied ? <Check size={16} /> : <Share2 size={16} />}
              {pageCopied ? t("fly.share.copied") : t("fly.share.btn")}
            </button>
          </div>

          {/* Referral Input Area */}
          <div
            className="max-w-md mx-auto pt-5"
            style={{ borderTop: "1px solid rgba(0,245,255,0.1)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Link2 size={14} style={{ color: "#00f5ff" }} />
              <p className="text-sm font-semibold" style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}>
                {t("fly.referral.input.title")}
              </p>
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder={t("fly.referral.input.placeholder")}
                className="flex-1 px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  borderRadius: "6px",
                  color: "#e2e8f0",
                }}
              />
              <button
                onClick={handleSaveRef}
                className="px-5 py-2.5 text-sm font-semibold"
                style={{
                  background: saved ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg, #00f5ff, #a855f7)",
                  color: saved ? "#22c55e" : "#0a0e1a",
                  borderRadius: "6px",
                  border: saved ? "1px solid rgba(34,197,94,0.3)" : "none",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {saved ? t("fly.referral.saved") : t("fly.referral.save")}
              </button>
            </div>
            {/* TokenPocket 안내 */}
            <p className="text-[11px]" style={{ color: "rgba(226,232,240,0.35)" }}>
              {t("referral.modal.tokenpocket")}
            </p>
          </div>
        </div>
      </GlassCard>
    </SectionWrapper>
  );
}
