import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import ShareModal from "@/components/ShareModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Rocket, Share2, Copy, Check, Link2, ExternalLink,
  Bot, Gamepad2, Flame, Users
} from "lucide-react";
import { useState } from "react";

const DEFAULT_CTA = "https://app.xplaybot.com/";

function getTokenPocketDeepLink(url: string) {
  const params = JSON.stringify({ url, chain: "Polygon", source: "XPLAY" });
  return `tpdapp://open?params=${encodeURIComponent(params)}`;
}

function isMobile() {
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

const DETAIL_CARDS = [
  { icon: Bot, color: "#00f5ff", titleKey: "hero.detail.1.title", descKey: "hero.detail.1.desc" },
  { icon: Gamepad2, color: "#22c55e", titleKey: "hero.detail.2.title", descKey: "hero.detail.2.desc" },
  { icon: Flame, color: "#f59e0b", titleKey: "hero.detail.3.title", descKey: "hero.detail.3.desc" },
  { icon: Users, color: "#a855f7", titleKey: "hero.detail.4.title", descKey: "hero.detail.4.desc" },
];

export default function HeroSection() {
  const { t, ctaLink, referralLink, setReferralLink } = useApp();
  const [showRefModal, setShowRefModal] = useState(false);
  const [refInput, setRefInput] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const openXplay = (url: string) => {
    if (isMobile()) {
      const tpLink = getTokenPocketDeepLink(url);
      const start = Date.now();
      window.location.href = tpLink;
      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.open(url, "_blank");
        }
      }, 1500);
    } else {
      window.open(url, "_blank");
    }
  };

  const handleStartClick = () => {
    if (!referralLink) {
      setShowRefModal(true);
    } else {
      openXplay(ctaLink);
    }
  };

  const handleSaveAndGo = () => {
    if (refInput.trim()) {
      setReferralLink(refInput.trim());
      setShowRefModal(false);
      openXplay(refInput.trim());
    }
  };

  const handleSkipAndGo = () => {
    setShowRefModal(false);
    openXplay(DEFAULT_CTA);
  };

  const handleCopyRef = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <>
      {/* ===== HERO TOP ===== */}
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

        <div className="relative z-10 text-center px-4 w-full max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={IMAGES.logo}
              alt="XPLAY"
              className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 object-contain"
              style={{ filter: "drop-shadow(0 0 30px rgba(0,245,255,0.4))" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 leading-tight"
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
            className="text-sm sm:text-base mb-2"
            style={{ color: "rgba(226,232,240,0.8)" }}
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs sm:text-sm mb-8"
            style={{ color: "rgba(226,232,240,0.5)" }}
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-8"
          >
            {[
              { label: t("hero.stat1"), value: "1.8%" },
              { label: t("hero.stat2"), value: "10%" },
              { label: t("hero.stat3"), value: "80%" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-xl sm:text-2xl font-bold"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: "#00f5ff",
                    textShadow: "0 0 20px rgba(0,245,255,0.4)",
                  }}
                >
                  {stat.value}
                </p>
                <p className="text-[9px] sm:text-[10px] mt-0.5" style={{ color: "rgba(226,232,240,0.5)" }}>
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
            className="flex flex-col gap-3 w-full"
          >
            <button
              onClick={handleStartClick}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wider uppercase"
              style={{
                background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                color: "#0a0e1a",
                borderRadius: "8px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Rocket size={16} />
              {t("hero.start.with.referral")}
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wider uppercase"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c084fc",
                borderRadius: "8px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Share2 size={16} />
              {t("fly.share.btn")}
            </button>
          </motion.div>

          {/* 현재 레퍼럴 표시 + 복사 버튼 */}
          {referralLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-3 flex items-center justify-center gap-2"
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(0,245,255,0.06)",
                  border: "1px solid rgba(0,245,255,0.15)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
                <p className="text-[10px] truncate max-w-[180px]" style={{ color: "rgba(0,245,255,0.7)" }}>
                  {referralLink}
                </p>
              </div>
              <button
                onClick={handleCopyRef}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-medium active:scale-95"
                style={{
                  background: copied ? "rgba(34,197,94,0.15)" : "rgba(0,245,255,0.08)",
                  border: copied ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(0,245,255,0.2)",
                  color: copied ? "#22c55e" : "#00f5ff",
                }}
              >
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? t("ref.copy.done") : t("ref.copy.btn")}
              </button>
            </motion.div>
          )}
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} style={{ color: "rgba(0,245,255,0.5)" }} />
        </motion.div>

        {/* === 단순화된 레퍼럴 입력 모달 === */}
        <AnimatePresence>
          {showRefModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
              onClick={() => setShowRefModal(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full sm:max-w-md p-5 sm:p-6"
                style={{
                  background: "rgba(15,15,35,0.98)",
                  border: "1px solid rgba(0,245,255,0.2)",
                  borderRadius: "16px 16px 0 0",
                  boxShadow: "0 -10px 60px rgba(0,245,255,0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
                    style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)" }}
                  >
                    <Link2 size={18} style={{ color: "#00f5ff" }} />
                  </div>
                  <div>
                    <h3
                      className="text-base font-bold"
                      style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {t("ref.simple.title")}
                    </h3>
                    <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>
                      {t("ref.simple.desc")}
                    </p>
                  </div>
                </div>

                <input
                  type="url"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder={t("referral.modal.placeholder")}
                  className="w-full px-4 py-3 text-sm outline-none mb-2"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                  autoFocus
                />
                <p className="text-[10px] mb-4" style={{ color: "rgba(226,232,240,0.35)" }}>
                  {t("referral.modal.tokenpocket")}
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleSaveAndGo}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                    style={{
                      background: refInput.trim()
                        ? "linear-gradient(135deg, #00f5ff, #a855f7)"
                        : "rgba(255,255,255,0.1)",
                      color: refInput.trim() ? "#0a0e1a" : "rgba(226,232,240,0.3)",
                      borderRadius: "8px",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                    disabled={!refInput.trim()}
                  >
                    <Rocket size={16} />
                    {t("ref.simple.save.go")}
                  </button>
                  <button
                    onClick={handleSkipAndGo}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "rgba(226,232,240,0.5)",
                    }}
                  >
                    <ExternalLink size={14} />
                    {t("ref.simple.skip")}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} />
      </section>

      {/* ===== ABOUT XPLAY — Detail Intro Section ===== */}
      <section
        id="about-xplay"
        className="relative py-16 px-4"
        style={{ background: "#0a0e1a" }}
      >
        <div className="max-w-lg mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span
              className="inline-block px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "999px",
                color: "#00f5ff",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {t("hero.detail.badge")}
            </span>
          </motion.div>

          {/* 4 Detail Cards */}
          <div className="space-y-4">
            {DETAIL_CARDS.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex gap-4 p-4"
                  style={{
                    background: `rgba(${card.color === "#00f5ff" ? "0,245,255" : card.color === "#22c55e" ? "34,197,94" : card.color === "#f59e0b" ? "245,158,11" : "168,85,247"},0.04)`,
                    border: `1px solid rgba(${card.color === "#00f5ff" ? "0,245,255" : card.color === "#22c55e" ? "34,197,94" : card.color === "#f59e0b" ? "245,158,11" : "168,85,247"},0.12)`,
                    borderRadius: "12px",
                  }}
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center rounded-lg shrink-0 mt-0.5"
                    style={{
                      background: `rgba(${card.color === "#00f5ff" ? "0,245,255" : card.color === "#22c55e" ? "34,197,94" : card.color === "#f59e0b" ? "245,158,11" : "168,85,247"},0.12)`,
                    }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-bold mb-1"
                      style={{
                        color: card.color,
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {t(card.titleKey)}
                    </h4>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "rgba(226,232,240,0.6)" }}
                    >
                      {t(card.descKey)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Intro Video — YouTube Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div
              className="overflow-hidden"
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(0,245,255,0.1)",
                aspectRatio: "16/9",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/fzsxiru7hAw"
                title="XPLAY Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ border: "none" }}
              />
            </div>
            <p
              className="text-center text-xs mt-2"
              style={{ color: "rgba(226,232,240,0.4)" }}
            >
              X Play Movie
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
