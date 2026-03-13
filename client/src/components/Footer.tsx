import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { Send } from "lucide-react";

export default function Footer() {
  const { t, ctaLink } = useApp();

  return (
    <footer
      className="py-12 px-4 text-center"
      style={{
        background: "rgba(10,14,26,0.95)",
        borderTop: "1px solid rgba(0,245,255,0.08)",
      }}
    >
      <div className="max-w-4xl mx-auto">
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
    </footer>
  );
}
