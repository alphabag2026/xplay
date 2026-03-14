import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Pin, PinOff, Heart, MessageSquare } from "lucide-react";

export default function AdminAnnouncements() {
  const utils = trpc.useUtils();
  const { data: announcements, isLoading } = trpc.admin.announcements.list.useQuery({ limit: 100 });

  const createMutation = trpc.admin.announcements.create.useMutation({
    onSuccess: () => { utils.admin.announcements.list.invalidate(); toast.success("공지가 생성되었습니다"); setShowCreate(false); resetForm(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.admin.announcements.update.useMutation({
    onSuccess: () => { utils.admin.announcements.list.invalidate(); toast.success("공지가 수정되었습니다"); setShowEdit(false); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.admin.announcements.delete.useMutation({
    onSuccess: () => { utils.admin.announcements.list.invalidate(); toast.success("공지가 삭제되었습니다"); },
    onError: (e) => toast.error(e.message),
  });
  const togglePinMutation = trpc.admin.announcements.togglePin.useMutation({
    onSuccess: () => { utils.admin.announcements.list.invalidate(); toast.success("고정 상태가 변경되었습니다"); },
    onError: (e) => toast.error(e.message),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "", isPinned: false, authorName: "XPLAY Admin" });

  const resetForm = () => setForm({ title: "", content: "", imageUrl: "", isPinned: false, authorName: "XPLAY Admin" });

  const handleEdit = (ann: any) => {
    setEditId(ann.id);
    setForm({ title: ann.title, content: ann.content, imageUrl: ann.imageUrl || "", isPinned: ann.isPinned, authorName: ann.authorName });
    setShowEdit(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">공지사항 관리</h1>
          <p className="text-muted-foreground mt-1">공지를 생성, 수정, 삭제하고 고정할 수 있습니다</p>
        </div>
        <Button onClick={() => { resetForm(); setShowCreate(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> 새 공지
        </Button>
      </div>

      {/* List */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">로딩 중...</p>
          ) : announcements && announcements.length > 0 ? (
            <div className="divide-y divide-border/30">
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{ann.id}</span>
                      <p className="text-sm font-medium truncate">{ann.title}</p>
                      {ann.isPinned && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-500 border-amber-500/30 shrink-0">📌 고정</Badge>
                      )}
                      {ann.imageUrl && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">🖼️ 이미지</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{ann.authorName}</span>
                      <span className="text-xs text-muted-foreground">{new Date(ann.createdAt).toLocaleDateString("ko-KR")}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Heart className="h-3 w-3" /> {ann.likeCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => togglePinMutation.mutate({ id: ann.id, isPinned: !ann.isPinned })}
                      title={ann.isPinned ? "고정 해제" : "고정"}>
                      {ann.isPinned ? <PinOff className="h-4 w-4 text-amber-500" /> : <Pin className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(ann)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if (confirm(`"${ann.title}" 공지를 삭제하시겠습니까?`)) deleteMutation.mutate({ id: ann.id });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">공지사항이 없습니다</p>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>새 공지 작성</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>제목</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="공지 제목" />
            </div>
            <div>
              <Label>내용</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="공지 내용" rows={6} />
            </div>
            <div>
              <Label>이미지 URL (선택)</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>작성자</Label>
              <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.isPinned} onCheckedChange={(v) => setForm({ ...form, isPinned: v })} />
              <Label>상단 고정</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>취소</Button>
            <Button onClick={() => createMutation.mutate({
              title: form.title, content: form.content,
              imageUrl: form.imageUrl || null, isPinned: form.isPinned, authorName: form.authorName,
            })} disabled={!form.title || !form.content || createMutation.isPending}>
              {createMutation.isPending ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>공지 수정</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>제목</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>내용</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} />
            </div>
            <div>
              <Label>이미지 URL (선택)</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <div>
              <Label>작성자</Label>
              <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>취소</Button>
            <Button onClick={() => editId && updateMutation.mutate({
              id: editId, title: form.title, content: form.content,
              imageUrl: form.imageUrl || null, authorName: form.authorName,
            })} disabled={!form.title || !form.content || updateMutation.isPending}>
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
