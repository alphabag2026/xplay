import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff, Check, Shield } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useApp();

  const isValid = currentPassword.length >= 1 && newPassword.length >= 6 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    if (newPassword !== confirmPassword) {
      toast.error(t("pw.mismatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("pw.minLength"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(t("pw.success"));
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || t("pw.error"));
      }
    } catch (err) {
      toast.error(t("pw.serverError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">{t("pw.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("pw.subtitle")}</p>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{t("pw.security")}</CardTitle>
              <CardDescription>{t("pw.securityDesc")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current">{t("pw.current")}</Label>
              <div className="relative">
                <Input
                  id="current"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={t("pw.currentPlaceholder")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new">{t("pw.new")}</Label>
              <div className="relative">
                <Input
                  id="new"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("pw.newPlaceholder")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 6 && (
                <p className="text-xs text-destructive">{t("pw.minLength")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">{t("pw.confirm")}</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("pw.confirmPlaceholder")}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive">{t("pw.mismatch")}</p>
              )}
              {confirmPassword.length > 0 && newPassword === confirmPassword && newPassword.length >= 6 && (
                <p className="text-xs text-green-500 flex items-center gap-1"><Check className="h-3 w-3" /> {t("pw.match")}</p>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" disabled={!isValid || loading}>
              <KeyRound className="h-4 w-4" />
              {loading ? t("pw.changing") : t("pw.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
