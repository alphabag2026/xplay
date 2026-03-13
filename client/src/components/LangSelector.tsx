import { useApp } from "@/contexts/AppContext";
import { LANG_LABELS, LANG_ORDER, type Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function LangSelector() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const langs = LANG_ORDER;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors"
        style={{
          color: "rgba(226,232,240,0.7)",
          background: "rgba(0,245,255,0.06)",
          border: "1px solid rgba(0,245,255,0.15)",
          borderRadius: "6px",
        }}
      >
        <Globe size={14} style={{ color: "#00f5ff" }} />
        {LANG_LABELS[lang]}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 py-1 min-w-[120px] z-50"
          style={{
            background: "rgba(15,15,35,0.95)",
            border: "1px solid rgba(0,245,255,0.2)",
            borderRadius: "8px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm transition-colors"
              style={{
                color: l === lang ? "#00f5ff" : "rgba(226,232,240,0.7)",
                background: l === lang ? "rgba(0,245,255,0.08)" : "transparent",
              }}
            >
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
