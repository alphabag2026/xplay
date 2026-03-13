import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { motion } from "framer-motion";
import { ChevronDown, Link2, Rocket, Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
  const { t, ctaLink, referralLink } = useApp();
  const [showRefInput, setShowRefInput] = useState(false);
  const [pageCopied, setPageCopied] = useState(false);

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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${IMAGES.hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 via-[#0a0e1a]/50 to-[#0a0e1a]/95" />
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={IMAGES.logo}
            alt="XPLAY"
            className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 object-contain"
            style={{ filter: "drop-shadow(0 0 30px rgba(0,245,255,0.4))" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "#ffffff",
            textShadow: "0 0 40px rgba(0,245,255,0.3)",
          }}
        >
          {t("hero.title1")}
          <span style={{ color: "#00f5ff" }}>{t("hero.title2")}</span>
          <br />
          {t("hero.title3")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg lg:text-xl mb-3 max-w-2xl mx-auto"
          style={{ color: "rgba(226,232,240,0.8)" }}
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm sm:text-base mb-10 max-w-xl mx-auto"
          style={{ color: "rgba(226,232,240,0.5)" }}
        >
          {t("hero.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg mx-auto mb-10"
        >
          {[
            { label: t("hero.stat1"), value: "1.8%" },
            { label: t("hero.stat2"), value: "10%" },
            { label: t("hero.stat3"), value: "80%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "#00f5ff",
                  textShadow: "0 0 20px rgba(0,245,255,0.4)",
                }}
              >
                {stat.value}
              </p>
              <p className="text-[10px] sm:text-xs mt-1" style={{ color: "rgba(226,232,240,0.5)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
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
            {t("hero.start.with.referral")}
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
        </motion.div>

        {/* 현재 레퍼럴 표시 */}
        {referralLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(0,245,255,0.06)",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <p className="text-xs truncate max-w-[250px]" style={{ color: "rgba(0,245,255,0.7)" }}>
              {referralLink}
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown size={28} style={{ color: "rgba(0,245,255,0.5)" }} />
      </motion.div>
    </section>
  );
}
