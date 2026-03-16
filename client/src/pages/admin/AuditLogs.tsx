import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ShieldCheck, User, ChevronLeft, ChevronRight, Megaphone, Newspaper, Users, HardDrive, MessageSquare, Pin, Trash2, Pencil, Plus, Upload, UserCog, Clock } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const PAGE_SIZE = 30;

export default function AuditLogs() {
  const { t } = useApp();
  const [page, setPage] = useState(0);
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterTarget, setFilterTarget] = useState<string>("all");

  const ACTION_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
    create: { label: t("audit.create"), icon: Plus, color: "text-green-400" },
    update: { label: t("audit.update"), icon: Pencil, color: "text-blue-400" },
    delete: { label: t("audit.actionDelete"), icon: Trash2, color: "text-red-400" },
    pin: { label: t("audit.pin"), icon: Pin, color: "text-amber-400" },
    unpin: { label: t("audit.unpin"), icon: Pin, color: "text-gray-400" },
    upload: { label: t("audit.upload"), icon: Upload, color: "text-cyan-400" },
    updateRole: { label: t("audit.updateRole"), icon: UserCog, color: "text-purple-400" },
  };

  const TARGET_LABELS: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
    announcement: { label: t("nav.announcements"), icon: Megaphone },
    news: { label: t("nav.news"), icon: Newspaper },
    partner: { label: t("nav.partners"), icon: Users },
    media: { label: t("nav.media"), icon: HardDrive },
    comment: { label: t("audit.comment"), icon: MessageSquare },
    user: { label: t("nav.users"), icon: User },
  };

  const ROLE_BADGES: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
    admin: { label: t("user.admin"), icon: Shield, className: "text-red-400 bg-red-400/10" },
    sub_admin: { label: t("user.subAdmin"), icon: ShieldCheck, className: "text-amber-400 bg-amber-400/10" },
  };

  const queryInput = useMemo(() => ({
    limit: PAGE_SIZE, offset: page * PAGE_SIZE,
    action: filterAction !== "all" ? filterAction : undefined,
    targetType: filterTarget !== "all" ? filterTarget : undefined,
  }), [page, filterAction, filterTarget]);

  const { data, isLoading } = trpc.admin.auditLogs.list.useQuery(queryInput);
  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleString();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("audit.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("audit.subtitle")}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={filterAction} onValueChange={(v) => { setFilterAction(v); setPage(0); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("audit.actionFilter")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.all")}</SelectItem>
            {Object.entries(ACTION_LABELS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterTarget} onValueChange={(v) => { setFilterTarget(v); setPage(0); }}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("audit.targetFilter")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.all")}</SelectItem>
            {Object.entries(TARGET_LABELS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="h-4 w-4" /> {data?.total ?? 0}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <ScrollArea className="h-[calc(100vh-320px)]">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 font-medium">{t("audit.time")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("audit.user")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("audit.action")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("audit.target")}</th>
                <th className="text-left px-4 py-3 font-medium">{t("audit.details")}</th>
                <th className="text-left px-4 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">{t("admin.loading")}</td></tr>
              ) : !data?.logs?.length ? (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">{t("admin.noData")}</td></tr>
              ) : (
                data.logs.map((log) => {
                  const actionInfo = ACTION_LABELS[log.action] ?? { label: log.action, icon: Clock, color: "text-muted-foreground" };
                  const targetInfo = TARGET_LABELS[log.targetType] ?? { label: log.targetType, icon: Clock };
                  const roleInfo = ROLE_BADGES[log.userRole ?? ""] ?? null;
                  const ActionIcon = actionInfo.icon;
                  const TargetIcon = targetInfo.icon;

                  return (
                    <tr key={log.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">{formatDate(log.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{log.userName ?? "-"}</span>
                          {roleInfo && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${roleInfo.className}`}>
                              <roleInfo.icon className="h-2.5 w-2.5" /> {roleInfo.label}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 ${actionInfo.color}`}>
                          <ActionIcon className="h-3.5 w-3.5" /> <span className="font-medium text-xs">{actionInfo.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <TargetIcon className="h-3.5 w-3.5" /> <span className="text-xs">{targetInfo.label}</span>
                          {log.targetId && <span className="text-[10px] opacity-60">#{log.targetId}</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[300px] truncate text-xs text-muted-foreground" title={log.details ?? ""}>{log.details ?? "-"}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{log.ipAddress ?? "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {page * PAGE_SIZE + 1} - {Math.min((page + 1) * PAGE_SIZE, data?.total ?? 0)} / {data?.total ?? 0}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
