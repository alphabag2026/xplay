import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { AlertTriangle, Plus, Trash2, Power, PowerOff, XCircle } from "lucide-react";

const MEETING_TYPES = [
  { value: "general", label: "일반 긴급 공지" },
  { value: "zoom", label: "Zoom 회의" },
  { value: "tencent", label: "텐센트 회의" },
  { value: "debox", label: "DeBox 회의" },
  { value: "google", label: "구글 미팅" },
];

const MEETING_ICONS: Record<string, string> = {
  zoom: "📹",
  tencent: "🎥",
  debox: "💬",
  google: "🎦",
  general: "🔴",
};

export default function UrgentNotices() {
  const utils = trpc.useUtils();
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [meetingType, setMeetingType] = useState("general");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingTime, setMeetingTime] = useState("");

  const { data, isLoading } = trpc.admin.urgentNotices.list.useQuery({});
  const createMut = trpc.admin.urgentNotices.create.useMutation({
    onSuccess: () => {
      toast.success("긴급 공지가 등록되었습니다.");
      utils.admin.urgentNotices.list.invalidate();
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });
  const toggleMut = trpc.admin.urgentNotices.toggleActive.useMutation({
    onSuccess: () => {
      toast.success("상태가 변경되었습니다.");
      utils.admin.urgentNotices.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
  const deleteMut = trpc.admin.urgentNotices.delete.useMutation({
    onSuccess: () => {
      toast.success("삭제되었습니다.");
      utils.admin.urgentNotices.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
  const deactivateAllMut = trpc.admin.urgentNotices.deactivateAll.useMutation({
    onSuccess: () => {
      toast.success("모든 긴급 공지가 비활성화되었습니다.");
      utils.admin.urgentNotices.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const resetForm = () => {
    setShowForm(false);
    setMessage("");
    setMeetingType("general");
    setMeetingLink("");
    setMeetingTime("");
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("공지 내용을 입력하세요.");
      return;
    }
    createMut.mutate({
      message: message.trim(),
      meetingType: meetingType as any,
      meetingLink: meetingLink.trim() || null,
      meetingTime: meetingTime.trim() || null,
    });
  };

  const notices = data?.notices ?? [];
  const activeCount = notices.filter(n => n.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={24} />
            긴급 공지 관리
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Navbar 위에 빨간 띠로 표시되는 긴급 공지를 관리합니다. 텔레그램 봇으로도 등록 가능합니다.
          </p>
        </div>
        <div className="flex gap-2">
          {activeCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => deactivateAllMut.mutate()}
              disabled={deactivateAllMut.isPending}
              className="text-red-500 border-red-500/30"
            >
              <XCircle size={14} className="mr-1" />
              전체 비활성화
            </Button>
          )}
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} className="mr-1" />
            새 긴급 공지
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <div className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-500 font-medium">
          활성: {activeCount}개
        </div>
        <div className="px-3 py-1.5 rounded-md bg-muted text-muted-foreground font-medium">
          전체: {notices.length}개
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="border rounded-lg p-4 space-y-4 bg-card">
          <h3 className="font-semibold">새 긴급 공지 등록</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1 block">공지 유형</label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEETING_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>
                      {MEETING_ICONS[t.value]} {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">공지 내용 *</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="예: 오늘 저녁 8시 긴급 화상회의가 있습니다."
                rows={2}
              />
            </div>
            {meetingType !== "general" && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1 block">회의 링크</label>
                  <Input
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">회의 시간</label>
                  <Input
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    placeholder="2026-03-15 20:00 KST"
                  />
                </div>
              </>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={createMut.isPending} size="sm">
                {createMut.isPending ? "등록 중..." : "등록"}
              </Button>
              <Button variant="outline" onClick={resetForm} size="sm">
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notice List */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle size={40} className="mx-auto mb-3 opacity-30" />
          <p>등록된 긴급 공지가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="border rounded-lg p-4 flex items-start justify-between gap-4"
              style={{
                borderColor: notice.isActive ? "rgba(239,68,68,0.3)" : undefined,
                background: notice.isActive ? "rgba(239,68,68,0.05)" : undefined,
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{MEETING_ICONS[notice.meetingType] ?? "🔴"}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded" style={{
                    background: notice.isActive ? "rgba(239,68,68,0.15)" : "rgba(100,100,100,0.15)",
                    color: notice.isActive ? "#ef4444" : "#888",
                  }}>
                    {notice.isActive ? "활성" : "비활성"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {MEETING_TYPES.find(t => t.value === notice.meetingType)?.label}
                  </span>
                </div>
                <p className="text-sm font-medium">{notice.message}</p>
                {notice.meetingTime && (
                  <p className="text-xs text-muted-foreground mt-1">⏰ {notice.meetingTime}</p>
                )}
                {notice.meetingLink && (
                  <a
                    href={notice.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                  >
                    🔗 {notice.meetingLink}
                  </a>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(notice.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleMut.mutate({ id: notice.id, isActive: !notice.isActive })}
                  disabled={toggleMut.isPending}
                  title={notice.isActive ? "비활성화" : "활성화"}
                >
                  {notice.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm("정말 삭제하시겠습니까?")) {
                      deleteMut.mutate({ id: notice.id });
                    }
                  }}
                  disabled={deleteMut.isPending}
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Telegram Bot Guide */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h3 className="font-semibold text-sm mb-2">📱 텔레그램 봇 명령어</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><code className="bg-muted px-1 py-0.5 rounded">POST /api/telegram/urgent</code> — 긴급 공지 등록</p>
          <p className="ml-4">Body: {"{"} message, meetingType (zoom/tencent/debox/google/general), meetingLink, meetingTime {"}"}</p>
          <p><code className="bg-muted px-1 py-0.5 rounded">POST /api/telegram/urgent/off</code> — 모든 긴급 공지 비활성화</p>
        </div>
      </div>
    </div>
  );
}
