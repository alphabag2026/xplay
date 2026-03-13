import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import ShareModal from "@/components/ShareModal";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Rocket, Share2, Check, AlertTriangle, Link2, ExternalLink } from "lucide-react";
import { useState } from "react";

type FlowStep = "idle" | "check" | "warning" | "input" | "confirmed";

export default function HeroSection() {
  const { t, ctaLink, referralLink, setReferralLink } = useApp();
  const [flowStep, setFlowStep] = useState<FlowStep>("idle");
  const [newRefInput, setNewRefInput] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  const handleStartClick = () => {
    if (!referralLink) {
      setFlowStep("check");
    } else {
      window.open(ctaLink, "_blank");
    }
  };

  const handleConfirmRef = () => {
    setFlowStep("confirmed");
  };

  const handleShareWithWarning = () => {
    if (referralLink) {
      // 이미 다른 사람의 추천링크가 등록된 상태 → 경고
      setFlowStep("warning");
    } else {
      setShowShareModal(true);
    }
  };

  const handleChangeToMine = () => {
    setFlowStep("input");
  };

  const handleSaveMyRef = () => {
    if (newRefInput.trim()) {
      setReferralLink(newRefInput.trim());
      setFlowStep("confirmed");
    }
  };

  const handleGoXplay = () => {
    window.open(ctaLink, "_blank");
    setFlowStep("idle");
  };

  const handleShareNow = () => {
    setFlowStep("idle");
    setShowShareModal(true);
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
            onClick={referralLink ? handleShareWithWarning : () => setShowShareModal(true)}
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

        {/* 현재 레퍼럴 표시 */}
        {referralLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(0,245,255,0.06)",
              border: "1px solid rgba(0,245,255,0.15)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            <p className="text-[10px] truncate max-w-[200px]" style={{ color: "rgba(0,245,255,0.7)" }}>
              {referralLink}
            </p>
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

      {/* === Referral Flow Modal === */}
      <AnimatePresence>
        {flowStep !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={() => setFlowStep("idle")}
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
              {/* Step: Check — 추천링크를 확인하세요 */}
              {flowStep === "check" && (
                <div className="text-center">
                  <div
                    className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.3)" }}
                  >
                    <Link2 size={24} style={{ color: "#00f5ff" }} />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {t("ref.flow.check")}
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {t("ref.flow.check.desc")}
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmRef}
                      className="w-full py-3 text-sm font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                        color: "#0a0e1a",
                        borderRadius: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {t("ref.flow.confirmed")}
                    </button>
                    <button
                      onClick={() => setFlowStep("input")}
                      className="w-full py-3 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "rgba(226,232,240,0.7)",
                      }}
                    >
                      {t("ref.flow.enter")}
                    </button>
                    <button
                      onClick={() => setFlowStep("idle")}
                      className="w-full py-3 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "rgba(226,232,240,0.5)",
                      }}
                    >
                      {t("referral.modal.reset")}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Warning — 다른 사람의 추천링크로 등록되어 있습니다 */}
              {flowStep === "warning" && (
                <div className="text-center">
                  <div
                    className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)" }}
                  >
                    <AlertTriangle size={24} style={{ color: "#eab308" }} />
                  </div>
                  <h3
                    className="text-base font-bold mb-3"
                    style={{ color: "#eab308", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {t("ref.flow.warning").split("\n")[0]}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {t("ref.flow.warning").split("\n")[1]}
                  </p>
                  <div
                    className="mb-5 px-3 py-2 rounded-lg"
                    style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)" }}
                  >
                    <p className="text-xs truncate" style={{ color: "rgba(234,179,8,0.7)" }}>
                      {t("referral.modal.tokenpocket")}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={handleChangeToMine}
                      className="w-full py-3 text-sm font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #eab308, #f97316)",
                        color: "#0a0e1a",
                        borderRadius: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {t("ref.flow.change.mine")}
                    </button>
                    <button
                      onClick={handleConfirmRef}
                      className="w-full py-3 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "rgba(226,232,240,0.5)",
                      }}
                    >
                      {t("ref.flow.confirmed")}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Input — 추천링크 입력 */}
              {flowStep === "input" && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
                      style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)" }}
                    >
                      <Link2 size={18} style={{ color: "#00f5ff" }} />
                    </div>
                    <h3
                      className="text-base font-bold"
                      style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {t("ref.flow.change.mine")}
                    </h3>
                  </div>
                  <input
                    type="url"
                    value={newRefInput}
                    onChange={(e) => setNewRefInput(e.target.value)}
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
                      onClick={handleSaveMyRef}
                      className="w-full py-3 text-sm font-semibold"
                      style={{
                        background: newRefInput.trim() ? "linear-gradient(135deg, #00f5ff, #a855f7)" : "rgba(255,255,255,0.1)",
                        color: newRefInput.trim() ? "#0a0e1a" : "rgba(226,232,240,0.3)",
                        borderRadius: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                      disabled={!newRefInput.trim()}
                    >
                      {t("fly.referral.save")}
                    </button>
                    <button
                      onClick={() => setFlowStep("idle")}
                      className="w-full py-3 text-sm"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "rgba(226,232,240,0.5)",
                      }}
                    >
                      {t("referral.modal.reset")}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Confirmed — 추천링크 확인 완료 → 바로 전송 */}
              {flowStep === "confirmed" && (
                <div className="text-center">
                  <div
                    className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full"
                    style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}
                  >
                    <Check size={24} style={{ color: "#22c55e" }} />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "#22c55e", fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {t("ref.flow.confirmed")}
                  </h3>
                  {referralLink && (
                    <div
                      className="mb-5 px-3 py-2 rounded-lg"
                      style={{ background: "rgba(0,245,255,0.05)" }}
                    >
                      <p className="text-xs truncate" style={{ color: "rgba(0,245,255,0.7)" }}>
                        {referralLink}
                      </p>
                    </div>
                  )}
                  <div className="space-y-3">
                    <button
                      onClick={handleGoXplay}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                        color: "#0a0e1a",
                        borderRadius: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      <ExternalLink size={16} />
                      {t("ref.flow.go")}
                    </button>
                    <button
                      onClick={handleShareNow}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                      style={{
                        background: "rgba(168,85,247,0.12)",
                        border: "1px solid rgba(168,85,247,0.3)",
                        color: "#c084fc",
                        borderRadius: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      <Share2 size={16} />
                      {t("ref.flow.share.now")}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal — 메신저 선택 */}
      <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} />
    </section>
  );
}
