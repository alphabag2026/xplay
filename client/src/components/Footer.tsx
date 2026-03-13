import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import ShareModal from "@/components/ShareModal";
import { Send, Link2, Rocket, Share2, Check, Copy } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const { t, ctaLink, referralLink, setReferralLink } = useApp();
  const [refInput, setRefInput] = useState(referralLink);
  const [saved, setSaved] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSaveRef = () => {
    setReferralLink(refInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <footer
      className="py-12 px-4 text-center"
      style={{
        background: "rgba(10,14,26,0.95)",
        borderTop: "1px solid rgba(0,245,255,0.08)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Referral + CTA Area */}
        <div
          className="mb-8 p-5 mx-auto max-w-md"
          style={{
            background: "rgba(0,245,255,0.03)",
            border: "1px solid rgba(0,245,255,0.12)",
            borderRadius: "12px",
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Link2 size={14} style={{ color: "#00f5ff" }} />
            <p className="text-sm font-semibold" style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}>
              {t("fly.referral.input.title")}
            </p>
          </div>
          <div className="flex gap-2 mb-3">
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
              className="px-4 py-2.5 text-sm font-semibold"
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

          {/* CTA + Share buttons */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => {
                const url = ctaLink;
                const isMob = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (isMob) {
                  const params = JSON.stringify({ url, chain: "Polygon", source: "XPLAY" });
                  const tpLink = `tpdapp://open?params=${encodeURIComponent(params)}`;
                  const start = Date.now();
                  window.location.href = tpLink;
                  setTimeout(() => { if (Date.now() - start < 2000) window.open(url, "_blank"); }, 1500);
                } else {
                  window.open(url, "_blank");
                }
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase"
              style={{
                background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                color: "#0a0e1a",
                borderRadius: "6px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Rocket size={14} />
              {t("fly.cta")}
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold uppercase"
              style={{
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.3)",
                color: "#c084fc",
                borderRadius: "6px",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Share2 size={14} />
              {t("fly.share.btn")}
            </button>
          </div>

          {/* TokenPocket 안내 */}
          <p className="text-[10px]" style={{ color: "rgba(226,232,240,0.3)" }}>
            {t("referral.modal.tokenpocket")}
          </p>
        </div>

        <img
          src={IMAGES.logo}
          alt="XPLAY"
          className="w-10 h-10 mx-auto mb-4 object-contain"
          style={{ filter: "drop-shadow(0 0 15px rgba(0,245,255,0.3))" }}
        />
        <p
          className="text-sm font-bold mb-3"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {t("footer.tagline")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-3">
          <p className="text-xs" style={{ color: "rgba(226,232,240,0.4)" }}>
            {t("footer.site")}{" "}
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00f5ff" }}
            >
              APP.XPLAYBOT.COM
            </a>
          </p>
          <span className="hidden sm:inline text-xs" style={{ color: "rgba(226,232,240,0.2)" }}>|</span>
          <p className="text-xs flex items-center gap-1" style={{ color: "rgba(226,232,240,0.4)" }}>
            <Send size={10} style={{ color: "#00f5ff" }} />
            {t("footer.telegram")}{" "}
            <a
              href="https://t.me/xplayplatform_official"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00f5ff" }}
            >
              @xplayplatform_official
            </a>
          </p>
        </div>
        <div className="h-px w-20 mx-auto mb-4" style={{ background: "rgba(0,245,255,0.15)" }} />
        <p className="text-[10px]" style={{ color: "rgba(226,232,240,0.25)" }}>
          {t("footer.disclaimer")}
        </p>
      </div>

      {/* Share Modal */}
      <ShareModal open={showShareModal} onClose={() => setShowShareModal(false)} />
    </footer>
  );
}
