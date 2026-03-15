import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusLabels: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  open: { label: "접수", color: "bg-blue-500/10 text-blue-500", icon: AlertCircle },
  in_progress: { label: "처리중", color: "bg-amber-500/10 text-amber-500", icon: Clock },
  resolved: { label: "답변완료", color: "bg-green-500/10 text-green-500", icon: CheckCircle },
  closed: { label: "종료", color: "bg-gray-500/10 text-gray-500", icon: XCircle },
};

const categoryLabels: Record<string, string> = {
  general: "일반 문의",
  technical: "기술 지원",
  billing: "결제/수익",
  partnership: "파트너십",
  other: "기타",
};

export default function CsTickets() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const statsQuery = trpc.admin.csTickets.stats.useQuery();
  const ticketsQuery = trpc.admin.csTickets.list.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 100,
  });

  const replyMutation = trpc.admin.csTickets.reply.useMutation({
    onSuccess: () => {
      toast.success("답변이 전송되었습니다.");
      ticketsQuery.refetch();
      statsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const statusMutation = trpc.admin.csTickets.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("상태가 변경되었습니다.");
      ticketsQuery.refetch();
      statsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const stats = statsQuery.data;
  const tickets = ticketsQuery.data?.tickets ?? [];

  const handleReply = (id: number) => {
    const text = replyText[id]?.trim();
    if (!text) return toast.error("답변 내용을 입력하세요.");
    replyMutation.mutate({ id, reply: text });
    setReplyText(prev => ({ ...prev, [id]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Headphones className="h-6 w-6 text-cyan-400" />
          <h1 className="text-2xl font-bold">CS 관리</h1>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "전체", value: stats.total, color: "text-foreground" },
            { label: "접수", value: stats.open, color: "text-blue-500" },
            { label: "처리중", value: stats.inProgress, color: "text-amber-500" },
            { label: "답변완료", value: stats.resolved, color: "text-green-500" },
            { label: "종료", value: stats.closed, color: "text-gray-500" },
          ].map(s => (
            <div key={s.label} className="rounded-lg border p-3 text-center">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="open">접수</SelectItem>
            <SelectItem value="in_progress">처리중</SelectItem>
            <SelectItem value="resolved">답변완료</SelectItem>
            <SelectItem value="closed">종료</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{tickets.length}건</span>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Headphones className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>접수된 문의가 없습니다.</p>
          </div>
        )}

        {tickets.map((ticket: any) => {
          const isExpanded = expandedId === ticket.id;
          const statusInfo = statusLabels[ticket.status] ?? statusLabels.open;
          const StatusIcon = statusInfo.icon;

          return (
            <div key={ticket.id} className="rounded-lg border overflow-hidden">
              {/* Ticket Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                className="w-full flex items-center gap-3 p-4 hover:bg-accent/30 transition-colors text-left"
              >
                <Badge variant="outline" className={`${statusInfo.color} gap-1 shrink-0`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusInfo.label}
                </Badge>
                <span className="text-xs text-muted-foreground shrink-0">{ticket.ticketNo}</span>
                <span className="text-xs text-muted-foreground shrink-0">{categoryLabels[ticket.category] ?? ticket.category}</span>
                <span className="font-medium truncate flex-1">{ticket.subject}</span>
                <span className="text-xs text-muted-foreground shrink-0">{ticket.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(ticket.createdAt).toLocaleDateString("ko-KR")}
                </span>
                {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="border-t p-4 space-y-4 bg-muted/20">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">이름:</span>{" "}
                      <span className="font-medium">{ticket.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">연락처:</span>{" "}
                      <span className="font-medium">{ticket.contact || "-"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">카테고리:</span>{" "}
                      <span className="font-medium">{categoryLabels[ticket.category] ?? ticket.category}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">접수일:</span>{" "}
                      <span className="font-medium">{new Date(ticket.createdAt).toLocaleString("ko-KR")}</span>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="rounded-lg bg-background p-4 border">
                    <p className="text-sm font-medium text-muted-foreground mb-2">문의 내용</p>
                    <p className="text-sm whitespace-pre-wrap">{ticket.message}</p>
                  </div>

                  {/* Reply (if exists) */}
                  {ticket.reply && (
                    <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-4">
                      <p className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        답변 ({ticket.repliedBy} - {ticket.repliedAt ? new Date(ticket.repliedAt).toLocaleString("ko-KR") : ""})
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{ticket.reply}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Status Change */}
                    <Select
                      value={ticket.status}
                      onValueChange={(val) => statusMutation.mutate({ id: ticket.id, status: val as any })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">접수</SelectItem>
                        <SelectItem value="in_progress">처리중</SelectItem>
                        <SelectItem value="resolved">답변완료</SelectItem>
                        <SelectItem value="closed">종료</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reply Form */}
                  {ticket.status !== "closed" && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="답변을 입력하세요..."
                        value={replyText[ticket.id] ?? ""}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                        rows={3}
                      />
                      <Button
                        onClick={() => handleReply(ticket.id)}
                        disabled={replyMutation.isPending}
                        size="sm"
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        답변 전송
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
