import { useApp } from "@/contexts/AppContext";
import { IMAGES } from "@/lib/data";
import LangSelector from "./LangSelector";
import { Link2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_KEYS = [
  { id: "business", key: "nav.business" },
  { id: "game", key: "nav.game" },
  { id: "staking", key: "nav.staking" },
  { id: "referral", key: "nav.referral" },
  { id: "team", key: "nav.team" },
  { id: "tokenomics", key: "nav.tokenomics" },
  { id: "roadmap", key: "nav.roadmap" },
  { id: "live-feed", key: "nav.livefeed" },
  { id: "tutorial", key: "nav.tutorial" },
  { id: "media-gallery", key: "nav.media" },
  { id: "simulator", key: "nav.simulator" },
  { id: "live-chat", key: "nav.livechat" },
  { id: "announcements", key: "nav.announcements" },
  { id: "leader-referral", key: "nav.leaderReferral" },
  { id: "partners", key: "nav.partners" },
  { id: "resources", key: "nav.resources" },
];

export default function Navbar() {
  const { t, referralLink } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const handler = () => setMenuOpen(false);
      window.addEventListener("scroll", handler, { passive: true });
      return () => window.removeEventListener("scroll", handler);
    }
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,14,26,0.95)" : "rgba(10,14,26,0.5)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(0,245,255,0.08)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <a
            href="#hero"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <img src={IMAGES.logo} alt="XPLAY" className="w-8 h-8 object-contain" />
            <span
              className="text-base font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#00f5ff" }}
            >
              XPLAY
            </span>
          </a>

          <div className="flex items-center gap-2">
            {referralLink && (
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
                title={referralLink}
              />
            )}
            <LangSelector />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 transition-colors"
              style={{
                color: "rgba(226,232,240,0.7)",
                background: "rgba(0,245,255,0.06)",
                border: "1px solid rgba(0,245,255,0.15)",
                borderRadius: "6px",
              }}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-64 pt-16 pb-6 px-4 overflow-y-auto"
              style={{
                background: "rgba(10,14,26,0.98)",
                borderLeft: "1px solid rgba(0,245,255,0.1)",
                backdropFilter: "blur(30px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-1">
                {NAV_KEYS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="block w-full text-left px-4 py-3 text-sm font-medium transition-colors"
                    style={{ color: "rgba(226,232,240,0.7)", borderRadius: "6px" }}
                  >
                    {t(item.key)}
                  </button>
                ))}
              </div>

              {referralLink && (
                <div
                  className="mt-4 mx-2 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.1)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Link2 size={12} style={{ color: "#00f5ff" }} />
                    <span className="text-[10px] font-medium" style={{ color: "#00f5ff" }}>
                      {t("referral.modal.title")}
                    </span>
                  </div>
                  <p className="text-[10px] truncate" style={{ color: "rgba(226,232,240,0.5)" }}>
                    {referralLink}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
