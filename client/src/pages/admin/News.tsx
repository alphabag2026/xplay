import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export default function AdminNews() {
  const utils = trpc.useUtils();
  const { data: newsList, isLoading } = trpc.admin.news.list.useQuery({ limit: 100 });
  const { t } = useApp();

  const createMutation = trpc.admin.news.create.useMutation({
    onSuccess: () => { utils.admin.news.list.invalidate(); toast.success(t("admin.create") + " ✓"); setShowCreate(false); resetForm(); },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.admin.news.delete.useMutation({
    onSuccess: () => { utils.admin.news.list.invalidate(); toast.success(t("admin.delete") + " ✓"); },
    onError: (e) => toast.error(e.message),
  });

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ url: "", title: "", description: "", imageUrl: "", siteName: "", authorName: "XPLAY Admin" });

  const resetForm = () => setForm({ url: "", title: "", description: "", imageUrl: "", siteName: "", authorName: "XPLAY Admin" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("news.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("news.subtitle")}</p>
        </div>
        <Button onClick={() => { resetForm(); setShowCreate(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> {t("news.addUrl")}
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">{t("admin.loading")}</p>
          ) : newsList && newsList.length > 0 ? (
            <div className="divide-y divide-border/30">
              {newsList.map((news) => (
                <div key={news.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">#{news.id}</span>
                      <p className="text-sm font-medium truncate">{news.title}</p>
                      {news.siteName && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">{news.siteName}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{news.authorName}</span>
                      <span className="text-xs text-muted-foreground">{new Date(news.createdAt).toLocaleDateString()}</span>
                      <a href={news.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-0.5">
                        <ExternalLink className="h-3 w-3" /> Link
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if (confirm(t("news.deleteConfirm"))) deleteMutation.mutate({ id: news.id });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t("news.noNews")}</p>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{t("news.addUrl")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>URL *</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <Label>{t("admin.title")} *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={t("news.urlPlaceholder")} />
            </div>
            <div>
              <Label>{t("admin.content")}</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t("admin.content")} rows={3} />
            </div>
            <div>
              <Label>{t("admin.image")} URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Site Name</Label>
                <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} placeholder="CoinDesk" />
              </div>
              <div>
                <Label>{t("ann.author")}</Label>
                <Input value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>{t("admin.cancel")}</Button>
            <Button onClick={() => createMutation.mutate({
              url: form.url, title: form.title,
              description: form.description || null, imageUrl: form.imageUrl || null,
              siteName: form.siteName || null, authorName: form.authorName,
            })} disabled={!form.url || !form.title || createMutation.isPending}>
              {createMutation.isPending ? t("admin.processing") : t("admin.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
