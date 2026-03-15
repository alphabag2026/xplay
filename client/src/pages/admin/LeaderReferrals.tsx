import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Crown, Eye, CheckCircle, XCircle, Clock, Search, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "대기", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: <Clock className="h-3 w-3" /> },
  reviewing: { label: "검토중", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: <Eye className="h-3 w-3" /> },
  approved: { label: "승인", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: <CheckCircle className="h-3 w-3" /> },
  rejected: { label: "거절", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: <XCircle className="h-3 w-3" /> },
};

const PAGE_SIZE = 20;

export default function AdminLeaderReferrals() {

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
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  const { data: detail } = trpc.admin.leaderReferrals.getById.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );

  const updateStatusMutation = trpc.admin.leaderReferrals.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("상태 업데이트 완료");
      setShowStatusDialog(false);
      setSelectedId(null);
      setAdminNote("");
      utils.admin.leaderReferrals.list.invalidate();
      utils.admin.leaderReferrals.stats.invalidate();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleUpdateStatus = () => {
    if (selectedId === null) return;
    updateStatusMutation.mutate({
      id: selectedId,
      status: newStatus as any,
      adminNote: adminNote.trim() || undefined,
    });
  };

  const referrals = listData?.referrals ?? [];
  const total = listData?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-yellow-500" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">리더 추천 관리</h1>
            <p className="text-sm text-muted-foreground">리더 추천 신청을 검토하고 관리합니다</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          utils.admin.leaderReferrals.list.invalidate();
          utils.admin.leaderReferrals.stats.invalidate();
        }}>
          <RefreshCw className="h-4 w-4 mr-1" /> 새로고침
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "전체", value: stats.total, color: "text-foreground" },
            { label: "대기", value: stats.pending, color: "text-yellow-500" },
            { label: "검토중", value: stats.reviewing, color: "text-blue-500" },
            { label: "승인", value: stats.approved, color: "text-green-500" },
            { label: "거절", value: stats.rejected, color: "text-red-500" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="pending">대기</SelectItem>
            <SelectItem value="reviewing">검토중</SelectItem>
            <SelectItem value="approved">승인</SelectItem>
            <SelectItem value="rejected">거절</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">총 {total}건</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">유형</th>
                <th className="text-left p-3 font-medium">추천자</th>
                <th className="text-left p-3 font-medium">연락처</th>
                <th className="text-left p-3 font-medium">리더</th>
                <th className="text-left p-3 font-medium">지역</th>
                <th className="text-left p-3 font-medium">상태</th>
                <th className="text-left p-3 font-medium">접수일</th>
                <th className="text-left p-3 font-medium">액션</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">로딩 중...</td></tr>
              ) : referrals.length === 0 ? (
                <tr><td colSpan={9} className="text-center p-8 text-muted-foreground">데이터가 없습니다</td></tr>
              ) : (
                referrals.map((r: any) => {
                  const st = STATUS_MAP[r.status] ?? STATUS_MAP.pending;
                  return (
                    <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono text-xs">{r.id}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-xs">
                          {r.referralType === "self" ? "본인" : "지인"}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{r.referrerName}</td>
                      <td className="p-3 text-xs text-muted-foreground">{r.referrerContact}</td>
                      <td className="p-3">{r.leaderName || "-"}</td>
                      <td className="p-3 text-xs">{r.region || "-"}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-xs gap-1 ${st.color}`}>
                          {st.icon} {st.label}
                        </Badge>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString("ko-KR") : "-"}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedId(r.id)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedId(r.id);
                            setNewStatus(r.status === "pending" ? "reviewing" : r.status);
                            setAdminNote(r.adminNote || "");
                            setShowStatusDialog(true);
                          }}>
                            <CheckCircle className="h-3.5 w-3.5" />
                          </Button>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{page + 1} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={selectedId !== null && !showStatusDialog} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              리더 추천 상세 #{selectedId}
            </DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">추천 유형</p>
                  <Badge variant="outline">{detail.referralType === "self" ? "본인 추천" : "지인 추천"}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">상태</p>
                  <Badge variant="outline" className={STATUS_MAP[detail.status]?.color}>
                    {STATUS_MAP[detail.status]?.icon} {STATUS_MAP[detail.status]?.label}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-semibold mb-2">추천자 정보</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-xs text-muted-foreground">이름</p><p>{detail.referrerName}</p></div>
                  <div><p className="text-xs text-muted-foreground">연락처</p><p>{detail.referrerContact}</p></div>
                  {detail.referrerEmail && <div className="col-span-2"><p className="text-xs text-muted-foreground">이메일</p><p>{detail.referrerEmail}</p></div>}
                </div>
              </div>

              {detail.referralType === "acquaintance" && (detail.leaderName || detail.leaderContact) && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">리더 정보</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {detail.leaderName && <div><p className="text-xs text-muted-foreground">이름</p><p>{detail.leaderName}</p></div>}
                    {detail.leaderContact && <div><p className="text-xs text-muted-foreground">연락처</p><p>{detail.leaderContact}</p></div>}
                  </div>
                </div>
              )}

              <div className="border-t pt-3">
                <h4 className="font-semibold mb-2">경력 및 조직</h4>
                <div className="space-y-2">
                  {detail.previousExperience && <div><p className="text-xs text-muted-foreground">이전 경력</p><p className="whitespace-pre-wrap">{detail.previousExperience}</p></div>}
                  {detail.teamSize && <div><p className="text-xs text-muted-foreground">팀 규모</p><p>{detail.teamSize}</p></div>}
                  {detail.organizationStructure && <div><p className="text-xs text-muted-foreground">조직 구성</p><p className="whitespace-pre-wrap">{detail.organizationStructure}</p></div>}
                  {detail.region && <div><p className="text-xs text-muted-foreground">지역</p><p>{detail.region}</p></div>}
                  {detail.expertise && <div><p className="text-xs text-muted-foreground">분야</p><p>{detail.expertise}</p></div>}
                </div>
              </div>

              {detail.introduction && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">소개글</h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{detail.introduction}</p>
                </div>
              )}

              {detail.additionalNotes && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">추가 메모</h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{detail.additionalNotes}</p>
                </div>
              )}

              {detail.adminNote && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">관리자 메모</h4>
                  <p className="whitespace-pre-wrap text-muted-foreground">{detail.adminNote}</p>
                </div>
              )}

              <div className="border-t pt-3 text-xs text-muted-foreground">
                접수일: {detail.createdAt ? new Date(detail.createdAt).toLocaleString("ko-KR") : "-"}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedId(null)}>닫기</Button>
            <Button onClick={() => {
              if (detail) {
                setNewStatus(detail.status === "pending" ? "reviewing" : detail.status);
                setAdminNote(detail.adminNote || "");
                setShowStatusDialog(true);
              }
            }}>상태 변경</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>상태 변경 #{selectedId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">새 상태</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">대기</SelectItem>
                  <SelectItem value="reviewing">검토중</SelectItem>
                  <SelectItem value="approved">승인</SelectItem>
                  <SelectItem value="rejected">거절</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">관리자 메모</label>
              <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="메모를 남겨주세요 (선택)" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>취소</Button>
            <Button onClick={handleUpdateStatus} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? "처리 중..." : "변경"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
