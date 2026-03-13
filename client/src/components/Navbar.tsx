import LangSelector from "@/components/LangSelector";
import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import { Link2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_KEYS = [
  { id: "hero", key: "nav.intro" },
  { id: "business", key: "nav.business" },
  { id: "game", key: "nav.game" },
  { id: "staking", key: "nav.staking" },
  { id: "referral", key: "nav.referral" },
  { id: "team", key: "nav.team" },
  { id: "tokenomics", key: "nav.tokenomics" },
  { id: "flywheel", key: "nav.flywheel" },
  { id: "simulator", key: "nav.simulator" },
  { id: "resources", key: "nav.resources" },
];

interface Props {
  onOpenReferral: () => void;
}

export default function Navbar({ onOpenReferral }: Props) {
  const { t, referralLink } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,14,26,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,245,255,0.1)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <img src={IMAGES.logo} alt="XPLAY" className="h-8 w-8 object-contain" />
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#00f5ff" }}
          >
            XPLAY
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_KEYS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-3 py-1.5 text-sm transition-colors hover:text-[#00f5ff]"
              style={{ color: "rgba(226,232,240,0.7)" }}
            >
              {t(item.key)}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReferral}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors"
            style={{
              color: referralLink ? "#0a0e1a" : "rgba(226,232,240,0.7)",
              background: referralLink ? "linear-gradient(135deg, #00f5ff, #a855f7)" : "rgba(0,245,255,0.06)",
              border: referralLink ? "none" : "1px solid rgba(0,245,255,0.15)",
              borderRadius: "6px",
            }}
          >
            <Link2 size={14} />
            <span className="hidden sm:inline">{t("referral.btn")}</span>
          </button>
          <LangSelector />

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "#00f5ff" }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden py-4 px-4"
          style={{
            background: "rgba(10,14,26,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(0,245,255,0.1)",
          }}
        >
          {NAV_KEYS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="block w-full text-left px-4 py-3 text-sm transition-colors hover:text-[#00f5ff]"
              style={{ color: "rgba(226,232,240,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              {t(item.key)}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
