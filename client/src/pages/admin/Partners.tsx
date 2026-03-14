import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Phone, MessageCircle } from "lucide-react";

export default function AdminPartners() {
  const utils = trpc.useUtils();
  const { data: partners, isLoading } = trpc.admin.partners.list.useQuery();

  const createMutation = trpc.admin.partners.create.useMutation({
    onSuccess: () => { utils.admin.partners.list.invalidate(); toast.success("파트너가 등록되었습니다"); setShowCreate(false); resetForm(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.admin.partners.update.useMutation({
    onSuccess: () => { utils.admin.partners.list.invalidate(); toast.success("파트너가 수정되었습니다"); setShowEdit(false); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.admin.partners.delete.useMutation({
    onSuccess: () => { utils.admin.partners.list.invalidate(); toast.success("파트너가 삭제되었습니다"); },
    onError: (e) => toast.error(e.message),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "", description: "", phone: "", telegram: "", kakao: "", whatsapp: "", wechat: "", avatarUrl: "", isActive: true, sortOrder: 0,
  });

  const resetForm = () => setForm({ name: "", description: "", phone: "", telegram: "", kakao: "", whatsapp: "", wechat: "", avatarUrl: "", isActive: true, sortOrder: 0 });

  const handleEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name, description: p.description || "", phone: p.phone || "", telegram: p.telegram || "",
      kakao: p.kakao || "", whatsapp: p.whatsapp || "", wechat: p.wechat || "", avatarUrl: p.avatarUrl || "",
      isActive: p.isActive, sortOrder: p.sortOrder,
    });
    setShowEdit(true);
  };

  const contactBadges = (p: any) => {
    const badges = [];
    if (p.phone) badges.push("📞");
    if (p.telegram) badges.push("✈️");
    if (p.kakao) badges.push("💬");
    if (p.whatsapp) badges.push("📱");
    if (p.wechat) badges.push("🟢");
    return badges;
  };

  const PartnerForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>이름 *</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="파트너 이름" />
        </div>
        <div>
          <Label>정렬 순서</Label>
          <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      <div>
        <Label>설명 (선택)</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="파트너 소개" rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>📞 전화번호</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+82-10-xxxx-xxxx" />
        </div>
        <div>
          <Label>✈️ 텔레그램</Label>
          <Input value={form.telegram} onChange={(e) => setForm({ ...form, telegram: e.target.value })} placeholder="@username" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>💬 카카오톡</Label>
          <Input value={form.kakao} onChange={(e) => setForm({ ...form, kakao: e.target.value })} placeholder="카카오톡 ID" />
        </div>
        <div>
          <Label>📱 왓츠앱</Label>
          <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+82-10-xxxx-xxxx" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>🟢 위챗</Label>
          <Input value={form.wechat} onChange={(e) => setForm({ ...form, wechat: e.target.value })} placeholder="WeChat ID" />
        </div>
        <div>
          <Label>아바타 URL (선택)</Label>
          <Input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://..." />
        </div>
      </div>
      {isEdit && (
        <div className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
          <Label>활성 상태</Label>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">소통 파트너 관리</h1>
          <p className="text-muted-foreground mt-1">추천인 연락처를 등록하고 관리합니다</p>
        </div>
        <Button onClick={() => { resetForm(); setShowCreate(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> 새 파트너
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">로딩 중...</p>
          ) : partners && partners.length > 0 ? (
            <div className="divide-y divide-border/30">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{p.id}</span>
                      <p className="text-sm font-medium">{p.name}</p>
                      {!p.isActive && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-500 border-red-500/30">비활성</Badge>
                      )}
                      {contactBadges(p).map((b, i) => (
                        <span key={i} className="text-xs">{b}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      정렬: {p.sortOrder} · {new Date(p.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if (confirm(`"${p.name}" 파트너를 삭제하시겠습니까?`)) deleteMutation.mutate({ id: p.id });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">소통 파트너가 없습니다</p>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>새 파트너 등록</DialogTitle></DialogHeader>
          <PartnerForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>취소</Button>
            <Button onClick={() => createMutation.mutate({
              name: form.name, description: form.description || null, phone: form.phone || null,
              telegram: form.telegram || null, kakao: form.kakao || null, whatsapp: form.whatsapp || null,
              wechat: form.wechat || null, avatarUrl: form.avatarUrl || null, sortOrder: form.sortOrder,
            })} disabled={!form.name || createMutation.isPending}>
              {createMutation.isPending ? "등록 중..." : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>파트너 수정</DialogTitle></DialogHeader>
          <PartnerForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>취소</Button>
            <Button onClick={() => editId && updateMutation.mutate({
              id: editId, name: form.name, description: form.description || null, phone: form.phone || null,
              telegram: form.telegram || null, kakao: form.kakao || null, whatsapp: form.whatsapp || null,
              wechat: form.wechat || null, avatarUrl: form.avatarUrl || null, isActive: form.isActive, sortOrder: form.sortOrder,
            })} disabled={!form.name || updateMutation.isPending}>
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
