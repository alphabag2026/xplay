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
import { useApp } from "@/contexts/AppContext";

export default function AdminPartners() {
  const utils = trpc.useUtils();
  const { data: partners, isLoading } = trpc.admin.partners.list.useQuery();
  const { t } = useApp();

  const createMutation = trpc.admin.partners.create.useMutation({
    onSuccess: () => { utils.admin.partners.list.invalidate(); toast.success(t("admin.create") + " ✓"); setShowCreate(false); resetForm(); },
    onError: (e) => toast.error(e.message),
  });
  const updateMutation = trpc.admin.partners.update.useMutation({
    onSuccess: () => { utils.admin.partners.list.invalidate(); toast.success(t("admin.save") + " ✓"); setShowEdit(false); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.admin.partners.delete.useMutation({
    onSuccess: () => { utils.admin.partners.list.invalidate(); toast.success(t("admin.delete") + " ✓"); },
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

  const partnerFormJsx = (isEdit = false) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("partner.name")} *</Label>
          <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t("partner.name")} />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input type="number" value={form.sortOrder} onChange={(e) => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
        </div>
      </div>
      <div>
        <Label>{t("admin.content")}</Label>
        <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} placeholder={t("admin.content")} rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("partner.phone")}</Label>
          <Input value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+82-10-xxxx-xxxx" />
        </div>
        <div>
          <Label>{t("partner.telegram")}</Label>
          <Input value={form.telegram} onChange={(e) => setForm(f => ({ ...f, telegram: e.target.value }))} placeholder="@username" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("partner.kakao")}</Label>
          <Input value={form.kakao} onChange={(e) => setForm(f => ({ ...f, kakao: e.target.value }))} placeholder="KakaoTalk ID" />
        </div>
        <div>
          <Label>{t("partner.whatsapp")}</Label>
          <Input value={form.whatsapp} onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+82-10-xxxx-xxxx" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{t("partner.wechat")}</Label>
          <Input value={form.wechat} onChange={(e) => setForm(f => ({ ...f, wechat: e.target.value }))} placeholder="WeChat ID" />
        </div>
        <div>
          <Label>Avatar URL</Label>
          <Input value={form.avatarUrl} onChange={(e) => setForm(f => ({ ...f, avatarUrl: e.target.value }))} placeholder="https://..." />
        </div>
      </div>
      {isEdit && (
        <div className="flex items-center gap-2">
          <Switch checked={form.isActive} onCheckedChange={(v) => setForm(f => ({ ...f, isActive: v }))} />
          <Label>{t("admin.active")}</Label>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("partner.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("partner.subtitle")}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowCreate(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> {t("partner.new")}
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">{t("admin.loading")}</p>
          ) : partners && partners.length > 0 ? (
            <div className="divide-y divide-border/30">
              {partners.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{p.id}</span>
                      <p className="text-sm font-medium">{p.name}</p>
                      {!p.isActive && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-500 border-red-500/30">{t("admin.inactive")}</Badge>
                      )}
                      {contactBadges(p).map((b, i) => (
                        <span key={i} className="text-xs">{b}</span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Sort: {p.sortOrder} · {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if (confirm(t("admin.confirm"))) deleteMutation.mutate({ id: p.id });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t("partner.noPartners")}</p>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t("partner.new")}</DialogTitle></DialogHeader>
          {partnerFormJsx()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>{t("admin.cancel")}</Button>
            <Button onClick={() => createMutation.mutate({
              name: form.name, description: form.description || null, phone: form.phone || null,
              telegram: form.telegram || null, kakao: form.kakao || null, whatsapp: form.whatsapp || null,
              wechat: form.wechat || null, avatarUrl: form.avatarUrl || null, sortOrder: form.sortOrder,
            })} disabled={!form.name || createMutation.isPending}>
              {createMutation.isPending ? t("admin.processing") : t("admin.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{t("admin.edit")}</DialogTitle></DialogHeader>
          {partnerFormJsx(true)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEdit(false)}>{t("admin.cancel")}</Button>
            <Button onClick={() => editId && updateMutation.mutate({
              id: editId, name: form.name, description: form.description || null, phone: form.phone || null,
              telegram: form.telegram || null, kakao: form.kakao || null, whatsapp: form.whatsapp || null,
              wechat: form.wechat || null, avatarUrl: form.avatarUrl || null, isActive: form.isActive, sortOrder: form.sortOrder,
            })} disabled={!form.name || updateMutation.isPending}>
              {updateMutation.isPending ? t("admin.processing") : t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
