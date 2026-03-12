import { IMAGES, NAV_ITEMS } from "@/lib/data";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
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
            className="text-lg font-bold neon-text-cyan"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#00f5ff" }}
          >
            XPLAY
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-3 py-1.5 text-sm transition-colors hover:text-[#00f5ff]"
              style={{ color: "rgba(226,232,240,0.7)" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: "#00f5ff" }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="block w-full text-left px-4 py-3 text-sm transition-colors hover:text-[#00f5ff]"
              style={{ color: "rgba(226,232,240,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
