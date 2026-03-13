import { useApp } from "@/contexts/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ShareModal({ open, onClose }: ShareModalProps) {
  const { t, referralLink } = useApp();
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    const url = new URL(window.location.origin);
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
        // KakaoTalk share via URL scheme
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
                {t("share.select")}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <X size={16} style={{ color: "rgba(226,232,240,0.5)" }} />
              </button>
            </div>

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

            {/* Bottom safe area for mobile */}
            <div className="h-6 sm:hidden" style={{ background: "rgba(10,14,26,0.98)" }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
