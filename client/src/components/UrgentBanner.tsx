import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef, useContext } from "react";
import { X, ExternalLink } from "lucide-react";

// Import the raw context object to avoid the throw in useApp()
// This way we can safely handle the case when AppProvider is not available
// (e.g., during HMR invalidation or ErrorBoundary recovery)
import { AppContext } from "@/contexts/AppContext";

const MEETING_ICONS: Record<string, string> = {
  zoom: "📹",
  tencent: "🎥",
  debox: "💬",
  google: "🎦",
  general: "🔴",
};

const MEETING_LABELS: Record<string, Record<string, string>> = {
  zoom: { ko: "Zoom 회의", en: "Zoom Meeting", zh: "Zoom会议", ja: "Zoom会議", vi: "Họp Zoom", th: "ประชุม Zoom" },
  tencent: { ko: "텐센트 회의", en: "Tencent Meeting", zh: "腾讯会议", ja: "テンセント会議", vi: "Họp Tencent", th: "ประชุม Tencent" },
  debox: { ko: "DeBox 회의", en: "DeBox Meeting", zh: "DeBox会议", ja: "DeBox会議", vi: "Họp DeBox", th: "ประชุม DeBox" },
  google: { ko: "구글 미팅", en: "Google Meet", zh: "Google Meet", ja: "Google Meet", vi: "Google Meet", th: "Google Meet" },
  general: { ko: "긴급 공지", en: "URGENT", zh: "紧急通知", ja: "緊急通知", vi: "Khẩn cấp", th: "ด่วน" },
};

export default function UrgentBanner() {
  // Use useContext directly instead of useApp() to avoid throwing when AppProvider is missing
  const appCtx = useContext(AppContext);
  const lang = appCtx?.lang ?? "en";

  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: notices } = trpc.urgentNotice.active.useQuery(undefined, {
    refetchInterval: 15000, // Poll every 15 seconds
  });

  const activeNotices = (notices ?? []).filter(n => !dismissed.has(n.id));

  // Auto-scroll marquee effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || activeNotices.length === 0) return;
    let animId: number;
    let pos = 0;
    const speed = 0.5;
    const animate = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.scrollLeft = pos;
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [activeNotices.length]);

  if (activeNotices.length === 0) return null;

  const handleDismiss = (id: number) => {
    setDismissed(prev => new Set(prev).add(id));
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%)",
        height: "36px",
        boxShadow: "0 2px 8px rgba(220, 38, 38, 0.4)",
      }}
    >
      <div
        ref={scrollRef}
        className="flex items-center h-full whitespace-nowrap overflow-hidden"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Duplicate content for seamless scroll */}
        {[...activeNotices, ...activeNotices].map((notice, idx) => {
          const icon = MEETING_ICONS[notice.meetingType] ?? MEETING_ICONS.general;
          const label = MEETING_LABELS[notice.meetingType]?.[lang] ?? MEETING_LABELS[notice.meetingType]?.en ?? "";
          return (
            <div
              key={`${notice.id}-${idx}`}
              className="inline-flex items-center gap-2 px-6 h-full shrink-0"
            >
              <span className="text-sm">{icon}</span>
              {notice.meetingType !== "general" && (
                <span
                  className="text-[11px] font-bold uppercase px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                >
                  {label}
                </span>
              )}
              <span
                className="text-[13px] font-semibold"
                style={{ color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
              >
                {notice.message}
              </span>
              {notice.meetingTime && (
                <span
                  className="text-[11px] font-medium px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fef2f2" }}
                >
                  ⏰ {notice.meetingTime}
                </span>
              )}
              {notice.meetingLink && (
                <a
                  href={notice.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded transition-all"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={10} />
                  {lang === "ko" ? "참여" : lang === "zh" ? "加入" : lang === "ja" ? "参加" : "JOIN"}
                </a>
              )}
              <span className="text-white/30 mx-4">|</span>
            </div>
          );
        })}
      </div>

      {/* Close button */}
      <button
        onClick={() => activeNotices.forEach(n => handleDismiss(n.id))}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
        style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
