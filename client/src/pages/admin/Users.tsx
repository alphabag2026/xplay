import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Users as UsersIcon, Shield, ShieldCheck, User, Search, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const utils = trpc.useUtils();
  const { t } = useApp();
  const { data: users, isLoading } = trpc.admin.users.list.useQuery();

  const roleLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    admin: { label: t("user.admin"), color: "text-red-500 bg-red-500/10", icon: <Shield className="h-3.5 w-3.5" /> },
    sub_admin: { label: t("user.subAdmin"), color: "text-amber-500 bg-amber-500/10", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    user: { label: t("user.normalUser"), color: "text-slate-500 bg-slate-500/10", icon: <User className="h-3.5 w-3.5" /> },
  };

  const updateRole = trpc.admin.users.updateRole.useMutation({
    onSuccess: (result) => {
      if (result.success) { toast.success(t("admin.save") + " ✓"); utils.admin.users.list.invalidate(); }
      else { toast.error(result.error || t("admin.error")); }
    },
    onError: (err) => toast.error(err.message),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchesSearch = !searchQuery ||
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.openId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const roleCounts = useMemo(() => {
    if (!users) return { admin: 0, sub_admin: 0, user: 0 };
    return users.reduce(
      (acc, u) => { acc[u.role as keyof typeof acc] = (acc[u.role as keyof typeof acc] || 0) + 1; return acc; },
      { admin: 0, sub_admin: 0, user: 0 }
    );
  }, [users]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <UsersIcon className="h-6 w-6 text-primary" /> {t("user.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("user.subtitle")}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => utils.admin.users.list.invalidate()}>
          <RefreshCw className="h-4 w-4 mr-2" /> {t("admin.refresh")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(roleLabels).map(([key, { label, color, icon }]) => (
          <div key={key} className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-1.5 ${color}`}>{icon}</div>
              <span className="text-sm font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold mt-2">{roleCounts[key as keyof typeof roleCounts]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder={t("admin.search") + "..."} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("admin.status")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.all")}</SelectItem>
            <SelectItem value="admin">{t("user.admin")}</SelectItem>
            <SelectItem value="sub_admin">{t("user.subAdmin")}</SelectItem>
            <SelectItem value="user">{t("user.normalUser")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Permission Guide */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h3 className="text-sm font-semibold mb-2">{t("user.permGuide")}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">{t("user.feature")}</th>
                <th className="text-center py-2 px-3 font-medium">{t("user.admin")}</th>
                <th className="text-center py-2 px-3 font-medium">{t("user.subAdmin")}</th>
                <th className="text-center py-2 px-3 font-medium">{t("user.normalUser")}</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b"><td className="py-1.5 pr-4">{t("admin.sidebar.dashboard")}</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">---</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">{t("admin.sidebar.announcements")}</td><td className="text-center">✅</td><td className="text-center">---</td><td className="text-center">---</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">{t("admin.sidebar.news")}</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">---</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">{t("admin.sidebar.partners")}</td><td className="text-center">✅</td><td className="text-center">✅</td><td className="text-center">---</td></tr>
              <tr className="border-b"><td className="py-1.5 pr-4">{t("admin.sidebar.media")}</td><td className="text-center">✅</td><td className="text-center">---</td><td className="text-center">---</td></tr>
              <tr><td className="py-1.5 pr-4">{t("admin.sidebar.users")}</td><td className="text-center">✅</td><td className="text-center">---</td><td className="text-center">---</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">{t("admin.loading")}</div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left py-3 px-4 font-medium">ID</th>
                <th className="text-left py-3 px-4 font-medium">{t("user.name")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("user.email")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("user.currentRole")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("user.lastLogin")}</th>
                <th className="text-left py-3 px-4 font-medium">{t("user.changeRole")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const roleInfo = roleLabels[u.role] || roleLabels.user;
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className={`border-t hover:bg-muted/30 ${isSelf ? "bg-primary/5" : ""}`}>
                    <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{u.id}</td>
                    <td className="py-3 px-4 font-medium">
                      {u.name || "-"}
                      {isSelf && <span className="ml-2 text-xs text-primary">({t("user.me")})</span>}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{u.email || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${roleInfo.color}`}>
                        {roleInfo.icon} {roleInfo.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleString() : "-"}
                    </td>
                    <td className="py-3 px-4">
                      {isSelf ? (
                        <span className="text-xs text-muted-foreground">{t("user.cannotChange")}</span>
                      ) : (
                        <Select value={u.role} onValueChange={(newRole) => { updateRole.mutate({ userId: u.id, role: newRole as "user" | "admin" | "sub_admin" }); }}>
                          <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">{t("user.normalUser")}</SelectItem>
                            <SelectItem value="sub_admin">{t("user.subAdmin")}</SelectItem>
                            <SelectItem value="admin">{t("user.admin")}</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">{t("admin.noData")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
