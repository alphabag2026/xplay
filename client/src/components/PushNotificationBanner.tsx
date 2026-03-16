import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { usePushNotification } from "@/hooks/usePushNotification";
import { useApp } from "@/contexts/AppContext";

const DISMISS_KEY = "xplay_push_dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function PushNotificationBanner() {
  const { t } = useApp();
  const { permission, isSubscribed, loading, subscribe, isSupported } = usePushNotification();
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Don't show if: not supported, already subscribed, denied, or recently dismissed
    if (!isSupported || isSubscribed || permission === "denied") return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DURATION) return;
    }

    // Show banner after 5 seconds delay
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, [isSupported, isSubscribed, permission]);

  const handleAllow = async () => {
    const ok = await subscribe();
    if (ok) {
      setSuccess(true);
      setTimeout(() => setVisible(false), 2000);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
      style={{
        animation: "slideUp 0.3s ease-out",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        className="p-4"
        style={{
          background: "rgba(10,14,26,0.95)",
          border: "1px solid rgba(0,245,255,0.2)",
          borderRadius: "12px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,245,255,0.1)",
        }}
      >
        {success ? (
          <p className="text-sm text-center py-1" style={{ color: "#22c55e" }}>
            {t("push.banner.subscribed")}
          </p>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center"
                style={{
                  background: "rgba(0,245,255,0.1)",
                  borderRadius: "8px",
                }}
              >
                <Bell size={18} style={{ color: "#00f5ff" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t("push.banner.title")}
                </p>
                <p className="text-xs" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {t("push.banner.desc")}
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1"
                style={{ color: "rgba(226,232,240,0.4)" }}
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAllow}
                disabled={loading}
                className="flex-1 py-2 text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, #00f5ff, #a855f7)",
                  color: "#0a0e1a",
                  borderRadius: "6px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "..." : t("push.banner.allow")}
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 text-xs font-semibold"
                style={{
                  background: "rgba(226,232,240,0.05)",
                  border: "1px solid rgba(226,232,240,0.1)",
                  color: "rgba(226,232,240,0.5)",
                  borderRadius: "6px",
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {t("push.banner.dismiss")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
