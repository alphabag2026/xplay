import { useApp } from "@/contexts/AppContext";
import { Link2, X, Copy, Check, RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ReferralModal({ open, onClose }: Props) {
  const { t, referralLink, setReferralLink } = useApp();
  const [input, setInput] = useState(referralLink);
  const [copied, setCopied] = useState(false);
  const [pageCopied, setPageCopied] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setReferralLink(input.trim());
  };

  const handleReset = () => {
    setInput("");
    setReferralLink("");
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md p-6 relative"
        style={{
          background: "rgba(15,15,35,0.95)",
          border: "1px solid rgba(0,245,255,0.2)",
          borderRadius: "12px",
          boxShadow: "0 0 60px rgba(0,245,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
          style={{ color: "rgba(226,232,240,0.5)" }}
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)" }}
          >
            <Link2 size={20} style={{ color: "#00f5ff" }} />
          </div>
          <h3
            className="text-lg font-bold"
            style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("referral.modal.title")}
          </h3>
        </div>

        <p className="text-sm mb-5" style={{ color: "rgba(226,232,240,0.6)" }}>
          {t("referral.modal.desc")}
        </p>

        <div className="mb-4">
          <input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("referral.modal.placeholder")}
            className="w-full px-4 py-3 text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(0,245,255,0.2)",
              borderRadius: "8px",
              color: "#e2e8f0",
            }}
          />
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #00f5ff, #a855f7)",
              color: "#0a0e1a",
              borderRadius: "8px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {t("referral.modal.save")}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "rgba(226,232,240,0.7)",
            }}
          >
            <RotateCcw size={14} />
            {t("referral.modal.reset")}
          </button>
        </div>

        {referralLink && (
          <div className="space-y-2 mb-3">
            {/* Copy referral link */}
            <button
              onClick={handleCopyReferral}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium"
              style={{
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "8px",
                color: "#00f5ff",
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? t("referral.modal.copied") : t("referral.modal.share")}
            </button>

            {/* Share this page with referral */}
            <button
              onClick={handleSharePage}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium"
              style={{
                background: "rgba(168,85,247,0.1)",
                border: "1px solid rgba(168,85,247,0.3)",
                borderRadius: "8px",
                color: "#c084fc",
              }}
            >
              {pageCopied ? <Check size={16} /> : <Share2 size={16} />}
              {pageCopied ? t("fly.share.copied") : t("fly.share.btn")}
            </button>
          </div>
        )}

        {referralLink && (
          <div className="mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(0,245,255,0.05)" }}>
            <p className="text-xs truncate" style={{ color: "rgba(0,245,255,0.7)" }}>
              {referralLink}
            </p>
          </div>
        )}

        {/* TokenPocket 안내 문구 */}
        <p className="text-[11px] text-center" style={{ color: "rgba(226,232,240,0.35)" }}>
          {t("referral.modal.tokenpocket")}
        </p>
      </div>
    </div>
  );
}
