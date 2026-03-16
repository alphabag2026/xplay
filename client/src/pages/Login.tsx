import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Loader2, Globe } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { LANG_LABELS, LANG_ORDER } from "@/lib/i18n";

function LoginLangSelector() {
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

  return (
    <div ref={ref} className="absolute top-4 right-4">
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
          className="absolute right-0 top-full mt-2 py-1 min-w-[160px] max-h-[400px] overflow-y-auto z-50"
          style={{
            background: "rgba(15,15,35,0.95)",
            border: "1px solid rgba(0,245,255,0.2)",
            borderRadius: "8px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {LANG_ORDER.map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
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

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requireTotp, setRequireTotp] = useState(false);
  const { t } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body: Record<string, string> = { email, password };
      if (requireTotp && totpCode) {
        body.totpCode = totpCode;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("login.error"));
        return;
      }

      // Check if TOTP is required
      if (data.requireTotp) {
        setRequireTotp(true);
        return;
      }

      // Success - redirect to admin
      window.location.href = "/admin";
    } catch (err) {
      setError(t("login.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: "#0a0e1a" }}>
      <LoginLangSelector />
      <div className="w-full max-w-md p-8 rounded-2xl border border-cyan-500/20" style={{ background: "rgba(10, 14, 26, 0.95)" }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, #a855f7, #00f5ff)" }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t("login.title")}</h1>
          <p className="text-sm text-gray-400 mt-1">
            {requireTotp ? t("login.totp.title") : t("login.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!requireTotp ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("login.email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.email.placeholder")}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t("login.password")}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.password.placeholder")}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                {t("login.totp.label")}
              </label>
              <p className="text-xs text-gray-500 mb-3">
                {t("login.totp.desc")}
              </p>
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                required
                maxLength={6}
                autoFocus
                autoComplete="one-time-code"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors text-center text-2xl tracking-[0.5em] font-mono"
              />
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #a855f7, #00f5ff)" }}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("admin.processing")}
              </span>
            ) : requireTotp ? (
              t("login.totp.verify")
            ) : (
              t("login.submit")
            )}
          </Button>
        </form>

        {/* Back button for TOTP step */}
        {requireTotp && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setRequireTotp(false);
                setTotpCode("");
                setError("");
              }}
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {t("login.totp.back")}
            </button>
          </div>
        )}

        {/* Back to site */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            {t("login.backToSite")}
          </button>
        </div>
      </div>
    </div>
  );
}
