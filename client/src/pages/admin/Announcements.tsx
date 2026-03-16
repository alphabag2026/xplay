import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Pin, PinOff, Heart, Sparkles, Eye, Globe, Copy, Share2, Upload, Image as ImageIcon, X } from "lucide-react";

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
  const polishMutation = trpc.admin.announcements.polishContent.useMutation({
    onSuccess: (data) => { setForm(f => ({ ...f, content: data.polished })); toast.success("AI가 내용을 다듬었습니다"); },
    onError: (e) => toast.error(`AI 다듬기 실패: ${e.message}`),
  });
  const translateMutation = trpc.admin.announcements.autoTranslate.useMutation({
    onSuccess: (data) => {
      if (data.translations) {
        setTranslations(data.translations);
        toast.success("다국어 번역이 완료되었습니다");
      } else {
        toast.error("번역 결과를 파싱할 수 없습니다");
      }
    },
    onError: (e) => toast.error(`번역 실패: ${e.message}`),
  });
  const uploadImageMutation = trpc.admin.announcements.uploadImage.useMutation({
    onSuccess: (data) => { setForm(f => ({ ...f, imageUrl: data.url })); toast.success("이미지가 업로드되었습니다"); },
    onError: (e) => toast.error(`이미지 업로드 실패: ${e.message}`),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "", isPinned: false, authorName: "XPLAY Admin" });
  const [translations, setTranslations] = useState<Record<string, { title: string; content: string }> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm({ title: "", content: "", imageUrl: "", isPinned: false, authorName: "XPLAY Admin" });
    setTranslations(null);
  };

  const handleEdit = (ann: any) => {
    setEditId(ann.id);
    setForm({ title: ann.title, content: ann.content, imageUrl: ann.imageUrl || "", isPinned: ann.isPinned, authorName: ann.authorName });
    setTranslations(null);
    setShowEdit(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("이미지 크기는 5MB 이하여야 합니다"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadImageMutation.mutate({ imageBase64: base64, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleCopyText = (ann: any) => {
    navigator.clipboard.writeText(`${ann.title}\n\n${ann.content}`);
    toast.success("공지 글씨가 복사되었습니다");
  };

  const handleShareFull = (ann: any) => {
    const text = `📢 ${ann.title}\n\n${ann.content}${ann.imageUrl ? `\n\n🖼️ ${ann.imageUrl}` : ""}`;
    navigator.clipboard.writeText(text);
    toast.success("이미지 포함 전체 내용이 복사되었습니다");
  };

  const LANG_LABELS: Record<string, string> = { en: "🇺🇸 English", zh: "🇨🇳 中文", ja: "🇯🇵 日本語", vi: "🇻🇳 Tiếng Việt", th: "🇹🇭 ภาษาไทย" };

  // ===== Announcement Form (shared between create & edit) =====
  const AnnouncementForm = ({ mode }: { mode: "create" | "edit" }) => (
    <div className="space-y-4">
      <div>
        <Label>제목</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="공지 제목" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>내용</Label>
          <Button variant="outline" size="sm" className="gap-1 text-xs h-7" disabled={!form.content || polishMutation.isPending}
            onClick={() => polishMutation.mutate({ content: form.content })}>
            <Sparkles className="h-3 w-3" />
            {polishMutation.isPending ? "다듬는 중..." : "AI 내용 다듬기"}
          </Button>
        </div>
        <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="공지 내용을 작성하세요..." rows={20}
          className="min-h-[400px] text-sm leading-relaxed resize-y" />
      </div>

      {/* Image Upload */}
      <div>
        <Label>이미지</Label>
        <div className="flex gap-2 mt-1">
          <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="이미지 URL 또는 아래 버튼으로 업로드" className="flex-1" />
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <Button variant="outline" size="sm" className="gap-1 shrink-0" onClick={() => fileInputRef.current?.click()} disabled={uploadImageMutation.isPending}>
            <Upload className="h-3 w-3" />
            {uploadImageMutation.isPending ? "업로드 중..." : "이미지 업로드"}
          </Button>
        </div>
        {form.imageUrl && (
          <div className="mt-2 relative inline-block">
            <img src={form.imageUrl} alt="Preview" className="max-h-32 rounded-lg border border-border/50 object-contain" />
            <button onClick={() => setForm({ ...form, imageUrl: "" })} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5">
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      <div>
        <Label>작성자</Label>
        <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
      </div>
      {mode === "create" && (
        <div className="flex items-center gap-2">
          <Switch checked={form.isPinned} onCheckedChange={(v) => setForm({ ...form, isPinned: v })} />
          <Label>상단 고정</Label>
        </div>
      )}

      {/* Auto-translate */}
      <div className="border-t border-border/30 pt-3">
        <div className="flex items-center justify-between mb-2">
          <Label className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> 다국어 자동 번역</Label>
          <Button variant="outline" size="sm" className="gap-1 text-xs h-7"
            disabled={!form.title || !form.content || translateMutation.isPending}
            onClick={() => translateMutation.mutate({ title: form.title, content: form.content })}>
            <Globe className="h-3 w-3" />
            {translateMutation.isPending ? "번역 중..." : "자동 번역"}
          </Button>
        </div>
        {translations && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {Object.entries(translations).map(([lang, t]) => (
              <div key={lang} className="p-2 rounded-lg bg-muted/30 border border-border/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{LANG_LABELS[lang] || lang}</span>
                  <Button variant="ghost" size="sm" className="h-5 px-1" onClick={() => { navigator.clipboard.writeText(`${t.title}\n\n${t.content}`); toast.success(`${lang} 번역 복사됨`); }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs font-medium">{t.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-3">{t.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

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
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-amber-500/10 text-amber-500 border-amber-500/30 shrink-0">고정</Badge>
                      )}
                      {ann.imageUrl && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0"><ImageIcon className="h-3 w-3 inline mr-0.5" />이미지</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{ann.authorName}</span>
                      <span className="text-xs text-muted-foreground">{new Date(ann.createdAt).toLocaleDateString("ko-KR")}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-0.5"><Heart className="h-3 w-3" /> {ann.likeCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Copy text only */}
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="글씨만 복사" onClick={() => handleCopyText(ann)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    {/* Share full (text + image) */}
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="이미지+내용 전체 전달" onClick={() => handleShareFull(ann)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
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
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader><DialogTitle>새 공지 작성</DialogTitle></DialogHeader>
          <AnnouncementForm mode="create" />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowPreview(true); }} disabled={!form.title || !form.content} className="gap-1">
              <Eye className="h-4 w-4" /> 미리보기
            </Button>
            <Button variant="outline" onClick={() => setShowCreate(false)}>취소</Button>
            <Button onClick={() => createMutation.mutate({
              title: form.title, content: form.content,
              imageUrl: form.imageUrl || null, isPinned: form.isPinned, authorName: form.authorName,
            })} disabled={!form.title || !form.content || createMutation.isPending}>
              {createMutation.isPending ? "생성 중..." : "송출하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader><DialogTitle>공지 수정</DialogTitle></DialogHeader>
          <AnnouncementForm mode="edit" />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(true)} disabled={!form.title || !form.content} className="gap-1">
              <Eye className="h-4 w-4" /> 미리보기
            </Button>
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>공지 미리보기</DialogTitle></DialogHeader>
          <div className="rounded-lg p-4 border border-border/30 bg-muted/20">
            <h3 className="text-lg font-bold mb-2">{form.title || "(제목 없음)"}</h3>
            {form.imageUrl && (
              <img src={form.imageUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-lg mb-3 border border-border/20" />
            )}
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{form.content || "(내용 없음)"}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <span>{form.authorName}</span>
              <span>{new Date().toLocaleDateString("ko-KR")}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
