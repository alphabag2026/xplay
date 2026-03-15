import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requireTotp, setRequireTotp] = useState(false);

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
        setError(data.error || "인증 실패");
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
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0e1a" }}>
      <div className="w-full max-w-md p-8 rounded-2xl border border-cyan-500/20" style={{ background: "rgba(10, 14, 26, 0.95)" }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{ background: "linear-gradient(135deg, #a855f7, #00f5ff)" }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">XPLAY Admin</h1>
          <p className="text-sm text-gray-400 mt-1">
            {requireTotp ? "2단계 인증" : "관리자 로그인"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!requireTotp ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
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
                Google Authenticator 코드
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Google Authenticator 앱에서 6자리 코드를 입력해주세요
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
                처리 중...
              </span>
            ) : requireTotp ? (
              "인증 확인"
            ) : (
              "로그인"
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
              ← 이메일/비밀번호 입력으로 돌아가기
            </button>
          </div>
        )}

        {/* Back to site */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setLocation("/")}
            className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            ← 메인 사이트로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
