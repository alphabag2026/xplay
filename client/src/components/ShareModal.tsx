/*
 * ShareModal — Share page with referral link
 * Logic:
 * 1. "이 페이지 공유" = 나의 레퍼럴이 포함된 현재 페이지 URL 전송
 * 2. 새로 등록한 레퍼럴이면 바로 공유
 * 3. 이전에 저장된(등록 안된) 레퍼럴이면 경고 표시:
 *    - "본인의 레퍼럴이 아닌데 등록하시고 전달하세요" + 레퍼럴 등록 이동
 *    - "무시하고 진행" 옵션
 */

import { useApp } from "@/contexts/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { useState, useEffect } from "react";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ShareModal({ open, onClose }: ShareModalProps) {
  const { t, referralLink, setReferralLink } = useApp();
  const [copied, setCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showRefInput, setShowRefInput] = useState(false);
  const [refInput, setRefInput] = useState("");
  const [warningDismissed, setWarningDismissed] = useState(false);

  // Check if the current referral was set by the user (newly registered) or from URL param
  const isOwnReferral = (() => {
    const ownRef = localStorage.getItem("xplay_own_referral");
    return ownRef === referralLink && !!referralLink;
  })();

  // When modal opens, check referral status
  useEffect(() => {
    if (open) {
      setCopied(false);
      setWarningDismissed(false);
      setShowRefInput(false);
      
      // If referral exists but is NOT the user's own registered one, show warning
      if (referralLink && !isOwnReferral) {
        setShowWarning(true);
      } else if (!referralLink) {
        // No referral at all - show input
        setShowRefInput(true);
      } else {
        setShowWarning(false);
      }
    }
  }, [open, referralLink, isOwnReferral]);

  const getShareUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    if (referralLink) {
      url.searchParams.set("ref", referralLink);
    }
    return url.toString();
  };

  const shareText = t("share.msg");
  const shareUrl = getShareUrl();
  const fullMsg = `${shareText}\n${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Register own referral and proceed to share
  const handleRegisterAndShare = () => {
    if (refInput.trim()) {
      setReferralLink(refInput.trim());
      localStorage.setItem("xplay_own_referral", refInput.trim());
      setShowRefInput(false);
      setShowWarning(false);
    }
  };

  // Go to referral registration from warning
  const handleGoToRegister = () => {
    setShowWarning(false);
    setShowRefInput(true);
  };

  // Ignore warning and proceed
  const handleIgnoreWarning = () => {
    setShowWarning(false);
    setWarningDismissed(true);
  };

  const shareOptions = [
    {
      key: "copy",
      label: t("share.copy.link"),
      icon: copied ? <Check size={20} /> : <Copy size={20} />,
      color: "#00f5ff",
      bg: "rgba(0,245,255,0.1)",
      border: "rgba(0,245,255,0.25)",
      onClick: handleCopyLink,
    },
    {
      key: "kakao",
      label: t("share.kakao"),
      icon: <MessageCircle size={20} />,
      color: "#FEE500",
      bg: "rgba(254,229,0,0.1)",
      border: "rgba(254,229,0,0.25)",
      onClick: () => {
        const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(kakaoUrl, "_blank");
      },
    },
    {
      key: "telegram",
      label: t("share.telegram"),
      icon: <Send size={20} />,
      color: "#26A5E4",
      bg: "rgba(38,165,228,0.1)",
      border: "rgba(38,165,228,0.25)",
      onClick: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      },
    },
    {
      key: "line",
      label: t("share.line"),
      icon: <MessageCircle size={20} />,
      color: "#06C755",
      bg: "rgba(6,199,85,0.1)",
      border: "rgba(6,199,85,0.25)",
      onClick: () => {
        window.open(
          `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      },
    },
    {
      key: "whatsapp",
      label: t("share.whatsapp"),
      icon: <MessageCircle size={20} />,
      color: "#25D366",
      bg: "rgba(37,211,102,0.1)",
      border: "rgba(37,211,102,0.25)",
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(fullMsg)}`,
          "_blank"
        );
      },
    },
    {
      key: "twitter",
      label: t("share.twitter"),
      icon: <ExternalLink size={20} />,
      color: "#e2e8f0",
      bg: "rgba(226,232,240,0.06)",
      border: "rgba(226,232,240,0.15)",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
      },
    },
  ];

  // Should we show share options?
  const canShare = (isOwnReferral || warningDismissed || !referralLink) && !showRefInput && !showWarning;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-0 sm:pb-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm"
            style={{
              background: "linear-gradient(145deg, rgba(15,20,40,0.98), rgba(10,14,26,0.98))",
              border: "1px solid rgba(0,245,255,0.15)",
              borderRadius: "16px 16px 0 0",
              boxShadow: "0 -4px 30px rgba(0,245,255,0.08)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h3
                className="text-base font-bold"
                style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {showRefInput ? t("share.register.title") : showWarning ? t("share.warning.title") : t("share.select")}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <X size={16} style={{ color: "rgba(226,232,240,0.5)" }} />
              </button>
            </div>

            {/* === WARNING: Not own referral === */}
            {showWarning && (
              <div className="px-5 pb-5">
                <div
                  className="p-4 mb-4"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    borderRadius: "10px",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} style={{ color: "#f59e0b", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <p className="text-sm font-bold mb-1" style={{ color: "#f59e0b" }}>
                        {t("share.warning.not.own")}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(226,232,240,0.6)" }}>
                        {t("share.warning.desc")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Current referral display */}
                <div
                  className="px-3 py-2 mb-4 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-[10px] mb-1" style={{ color: "rgba(226,232,240,0.4)" }}>
                    {t("share.warning.current")}
                  </p>
                  <p className="text-xs truncate font-mono" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {referralLink}
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleGoToRegister}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                    style={{
                      background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                      color: "#0a0e1a",
                      borderRadius: "8px",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    <Link2 size={16} />
                    {t("share.warning.register")}
                  </button>
                  <button
                    onClick={handleIgnoreWarning}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "rgba(226,232,240,0.5)",
                    }}
                  >
                    {t("share.warning.ignore")}
                  </button>
                </div>
              </div>
            )}

            {/* === REFERRAL INPUT === */}
            {showRefInput && (
              <div className="px-5 pb-5">
                <p className="text-xs mb-3" style={{ color: "rgba(226,232,240,0.5)" }}>
                  {t("share.register.desc")}
                </p>
                <input
                  type="url"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  placeholder={t("referral.modal.placeholder")}
                  className="w-full px-4 py-3 text-sm outline-none mb-4"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    border: "1px solid rgba(0,245,255,0.2)",
                    borderRadius: "8px",
                    color: "#e2e8f0",
                  }}
                  autoFocus
                />
                <button
                  onClick={handleRegisterAndShare}
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
                  <Link2 size={16} />
                  {t("share.register.save")}
                </button>
              </div>
            )}

            {/* === SHARE OPTIONS (shown when referral is verified or warning dismissed) === */}
            {canShare && (
              <>
                {/* Share URL Preview */}
                {referralLink && (
                  <div className="mx-5 mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}>
                    <p className="text-[10px] mb-1" style={{ color: "rgba(0,245,255,0.5)" }}>Referral Link</p>
                    <p className="text-xs truncate" style={{ color: "rgba(0,245,255,0.8)" }}>{referralLink}</p>
                  </div>
                )}

                {/* Share Options Grid */}
                <div className="grid grid-cols-3 gap-3 px-5 pb-6 pt-2">
                  {shareOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={opt.onClick}
                      className="flex flex-col items-center gap-2 py-4 rounded-xl transition-all active:scale-95"
                      style={{
                        background: opt.key === "copy" && copied ? "rgba(34,197,94,0.15)" : opt.bg,
                        border: `1px solid ${opt.key === "copy" && copied ? "rgba(34,197,94,0.3)" : opt.border}`,
                      }}
                    >
                      <span style={{ color: opt.key === "copy" && copied ? "#22c55e" : opt.color }}>
                        {opt.icon}
                      </span>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: opt.key === "copy" && copied ? "#22c55e" : opt.color }}
                      >
                        {opt.key === "copy" && copied ? t("fly.share.copied") : opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Bottom safe area for mobile */}
            <div className="h-6 sm:hidden" style={{ background: "rgba(10,14,26,0.98)" }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
