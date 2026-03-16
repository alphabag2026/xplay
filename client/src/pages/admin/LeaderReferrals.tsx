import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Crown, Eye, CheckCircle, XCircle, Clock, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useApp } from "@/contexts/AppContext";

const PAGE_SIZE = 20;

export default function AdminLeaderReferrals() {
  const { t } = useApp();

  const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: t("leader.pending"), color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: <Clock className="h-3 w-3" /> },
    reviewing: { label: t("leader.reviewing"), color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <Eye className="h-3 w-3" /> },
    approved: { label: t("leader.approved"), color: "bg-green-500/10 text-green-500 border-green-500/20", icon: <CheckCircle className="h-3 w-3" /> },
    rejected: { label: t("leader.rejected"), color: "bg-red-500/10 text-red-500 border-red-500/20", icon: <XCircle className="h-3 w-3" /> },
  };

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("reviewing");
  const [adminNote, setAdminNote] = useState("");

  const utils = trpc.useUtils();
  const { data: stats } = trpc.admin.leaderReferrals.stats.useQuery();
  const { data: listData, isLoading } = trpc.admin.leaderReferrals.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: PAGE_SIZE, offset: page * PAGE_SIZE,
  });
  const { data: detail } = trpc.admin.leaderReferrals.getById.useQuery(
    { id: selectedId! }, { enabled: selectedId !== null }
  );

  const updateStatusMutation = trpc.admin.leaderReferrals.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(t("admin.save") + " ✓");
      setShowStatusDialog(false); setSelectedId(null); setAdminNote("");
      utils.admin.leaderReferrals.list.invalidate();
      utils.admin.leaderReferrals.stats.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleUpdateStatus = () => {
    if (selectedId === null) return;
    updateStatusMutation.mutate({ id: selectedId, status: newStatus as any, adminNote: adminNote.trim() || undefined });
  };

  const referrals = listData?.referrals ?? [];
  const total = listData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-yellow-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">{t("leader.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("leader.subtitle")}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          utils.admin.leaderReferrals.list.invalidate();
          utils.admin.leaderReferrals.stats.invalidate();
        }}>
          <RefreshCw className="h-4 w-4 mr-1" /> {t("admin.refresh")}
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: t("admin.all"), value: stats.total, color: "text-foreground" },
            { label: t("leader.pending"), value: stats.pending, color: "text-yellow-500" },
            { label: t("leader.reviewing"), value: stats.reviewing, color: "text-blue-500" },
            { label: t("leader.approved"), value: stats.approved, color: "text-green-500" },
            { label: t("leader.rejected"), value: stats.rejected, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder={t("admin.status")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.all")}</SelectItem>
            <SelectItem value="pending">{t("leader.pending")}</SelectItem>
            <SelectItem value="reviewing">{t("leader.reviewing")}</SelectItem>
            <SelectItem value="approved">{t("leader.approved")}</SelectItem>
            <SelectItem value="rejected">{t("leader.rejected")}</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{total}</span>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">{t("leader.type")}</th>
                <th className="text-left p-3 font-medium">{t("leader.referrer")}</th>
                <th className="text-left p-3 font-medium">{t("leader.contact")}</th>
                <th className="text-left p-3 font-medium">{t("leader.leader")}</th>
                <th className="text-left p-3 font-medium">{t("leader.region")}</th>
                <th className="text-left p-3 font-medium">{t("admin.status")}</th>
                <th className="text-left p-3 font-medium">{t("leader.date")}</th>
                <th className="text-left p-3 font-medium">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">{t("admin.loading")}</td></tr>
              ) : referrals.length === 0 ? (
                <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">{t("admin.noData")}</td></tr>
              ) : (
                referrals.map((r: any) => {
                  const st = STATUS_MAP[r.status] ?? STATUS_MAP.pending;
                  return (
                    <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {r.referralType === "self" ? t("leader.selfType") : t("leader.acquaintanceType")}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{r.referrerName}</td>
                      <td className="p-3 text-xs text-muted-foreground">{r.referrerContact}</td>
                      <td className="p-3">{r.leaderName || "-"}</td>
                      <td className="p-3 text-xs">{r.region || "-"}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-xs gap-1 ${st.color}`}>{st.icon} {st.label}</Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedId(r.id)}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedId(r.id); setNewStatus(r.status === "pending" ? "reviewing" : r.status);
                            setAdminNote(r.adminNote || ""); setShowStatusDialog(true);
                          }}><CheckCircle className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={selectedId !== null && !showStatusDialog} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" /> {t("leader.detail")} #{selectedId}
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("leader.type")}</p>
                  <Badge variant="outline">{detail.referralType === "self" ? t("leader.selfType") : t("leader.acquaintanceType")}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{t("admin.status")}</p>
                  <Badge variant="outline" className={STATUS_MAP[detail.status]?.color}>
                    {STATUS_MAP[detail.status]?.icon} {STATUS_MAP[detail.status]?.label}
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-3">
                <h4 className="font-semibold mb-2">{t("leader.referrerInfo")}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-xs text-muted-foreground">{t("user.name")}</p><p>{detail.referrerName}</p></div>
                  <div><p className="text-xs text-muted-foreground">{t("leader.contact")}</p><p>{detail.referrerContact}</p></div>
                  {detail.referrerEmail && <div className="col-span-2"><p className="text-xs text-muted-foreground">{t("user.email")}</p><p>{detail.referrerEmail}</p></div>}
                </div>
              </div>
              {detail.referralType === "acquaintance" && (detail.leaderName || detail.leaderContact) && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">{t("leader.leaderInfo")}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {detail.leaderName && <div><p className="text-xs text-muted-foreground">{t("user.name")}</p><p>{detail.leaderName}</p></div>}
                    {detail.leaderContact && <div><p className="text-xs text-muted-foreground">{t("leader.contact")}</p><p>{detail.leaderContact}</p></div>}
                  </div>
                </div>
              )}
              <div className="border-t pt-3">
                <h4 className="font-semibold mb-2">{t("leader.experience")}</h4>
                <div className="space-y-2">
                  {detail.previousExperience && <div><p className="text-xs text-muted-foreground">{t("leader.experience")}</p><p className="whitespace-pre-wrap">{detail.previousExperience}</p></div>}
                  {detail.organizationStructure && <div><p className="text-xs text-muted-foreground">{t("leader.organization")}</p><p className="whitespace-pre-wrap">{detail.organizationStructure}</p></div>}
                  {detail.region && <div><p className="text-xs text-muted-foreground">{t("leader.region")}</p><p>{detail.region}</p></div>}
                  {detail.expertise && <div><p className="text-xs text-muted-foreground">{t("leader.expertise")}</p><p>{detail.expertise}</p></div>}
                </div>
              </div>
              {detail.introduction && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">{t("leader.introduction")}</h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{detail.introduction}</p>
                </div>
              )}
              {detail.additionalNotes && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">{t("leader.additionalNotes")}</h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{detail.additionalNotes}</p>
                </div>
              )}
              {detail.adminNote && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">{t("leader.adminNote")}</h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{detail.adminNote}</p>
                </div>
              )}
              <div className="border-t pt-3 text-xs text-muted-foreground">
                {t("leader.date")}: {detail.createdAt ? new Date(detail.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedId(null)}>{t("admin.close")}</Button>
            <Button onClick={() => {
              if (detail) { setNewStatus(detail.status === "pending" ? "reviewing" : detail.status); setAdminNote(detail.adminNote || ""); setShowStatusDialog(true); }
            }}>{t("leader.changeStatus")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>{t("leader.changeStatus")} #{selectedId}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("leader.newStatus")}</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t("leader.pending")}</SelectItem>
                  <SelectItem value="reviewing">{t("leader.reviewing")}</SelectItem>
                  <SelectItem value="approved">{t("leader.approved")}</SelectItem>
                  <SelectItem value="rejected">{t("leader.rejected")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("leader.adminNote")}</label>
              <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder={t("leader.adminNote")} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>{t("admin.cancel")}</Button>
            <Button onClick={handleUpdateStatus} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? t("admin.processing") : t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
