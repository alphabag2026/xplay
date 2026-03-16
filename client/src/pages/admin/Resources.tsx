import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, FileText, Globe, Image as ImageIcon,
  Film, BookOpen, Eye, EyeOff, Upload, RefreshCw, GripVertical, LinkIcon,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";

const LANG_OPTIONS = [
  { value: "all", label: "ALL" },
  { value: "ko", label: "한국어 (KO)" },
  { value: "en", label: "English (EN)" },
  { value: "zh", label: "中文 (ZH)" },
  { value: "ja", label: "日本語 (JA)" },
  { value: "vi", label: "Tiếng Việt (VI)" },
  { value: "th", label: "ไทย (TH)" },
];

const TYPE_OPTIONS = [
  { value: "document", label: "Document", icon: FileText },
  { value: "blog", label: "Blog", icon: BookOpen },
  { value: "video", label: "Video", icon: Film },
];

const FILE_TYPE_OPTIONS = [
  { value: "pdf", label: "PDF" },
  { value: "pptx", label: "PPTX" },
  { value: "doc", label: "DOC" },
  { value: "link", label: "Link" },
  { value: "youtube", label: "YouTube" },
];

type FormData = {
  type: "document" | "blog" | "video";
  lang: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
  fileType: string;
  platform: string;
  youtubeId: string;
  sortOrder: number;
};

const emptyForm: FormData = {
  type: "document",
  lang: "all",
  title: "",
  description: "",
  thumbnailUrl: "",
  url: "",
  fileType: "pdf",
  platform: "",
  youtubeId: "",
  sortOrder: 0,
};

function getLangColor(lang: string) {
  const map: Record<string, string> = {
    ko: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    en: "bg-green-500/15 text-green-400 border-green-500/30",
    zh: "bg-red-500/15 text-red-400 border-red-500/30",
    ja: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    vi: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    th: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    all: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  };
  return map[lang] || map.all;
}

export default function AdminResources() {
  const utils = trpc.useUtils();
  const { t } = useApp();
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLang, setFilterLang] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>({ ...emptyForm });
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const { data: resources, isLoading } = trpc.admin.resources.list.useQuery({
    type: filterType !== "all" ? filterType : undefined,
    lang: filterLang !== "all" ? filterLang : undefined,
  });

  const createMutation = trpc.admin.resources.create.useMutation({
    onSuccess: () => { utils.admin.resources.list.invalidate(); toast.success(t("admin.create") + " ✓"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const updateMutation = trpc.admin.resources.update.useMutation({
    onSuccess: () => { utils.admin.resources.list.invalidate(); toast.success(t("admin.save") + " ✓"); closeDialog(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.resources.delete.useMutation({
    onSuccess: () => { utils.admin.resources.list.invalidate(); toast.success(t("admin.delete") + " ✓"); },
    onError: (e) => toast.error(e.message),
  });

  const toggleActiveMutation = trpc.admin.resources.update.useMutation({
    onSuccess: () => { utils.admin.resources.list.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  const uploadThumbMutation = trpc.admin.resources.uploadThumbnail.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        setForm((prev) => ({ ...prev, thumbnailUrl: data.url! }));
        toast.success(t("admin.upload") + " ✓");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const fetchOgMutation = trpc.admin.resources.fetchOgImage.useMutation({
    onSuccess: (data) => {
      if (data.success && data.imageUrl) {
        setForm((prev) => ({ ...prev, thumbnailUrl: data.imageUrl! }));
        toast.success("OG image ✓");
      } else {
        toast.error("OG image not found");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const batchOgMutation = trpc.admin.resources.batchFetchOgImages.useMutation({
    onSuccess: (data) => {
      utils.admin.resources.list.invalidate();
      toast.success(`${data.updated}/${data.total} OG images fetched`);
    },
    onError: (e) => toast.error(e.message),
  });

  const closeDialog = () => { setDialogOpen(false); setEditId(null); setForm({ ...emptyForm }); };
  const openCreate = () => { setEditId(null); setForm({ ...emptyForm }); setDialogOpen(true); };

  const openEdit = (r: any) => {
    setEditId(r.id);
    setForm({
      type: r.type, lang: r.lang, title: r.title, description: r.description || "",
      thumbnailUrl: r.thumbnailUrl || "", url: r.url, fileType: r.fileType || "pdf",
      platform: r.platform || "", youtubeId: r.youtubeId || "", sortOrder: r.sortOrder ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.url.trim()) { toast.error(t("admin.noData")); return; }
    if (editId) {
      updateMutation.mutate({ id: editId, ...form, description: form.description || undefined, thumbnailUrl: form.thumbnailUrl || undefined, platform: form.platform || undefined, youtubeId: form.youtubeId || undefined });
    } else {
      createMutation.mutate({ ...form, description: form.description || undefined, thumbnailUrl: form.thumbnailUrl || undefined, platform: form.platform || undefined, youtubeId: form.youtubeId || undefined });
    }
  };

  const handleThumbUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadThumbMutation.mutate({ fileName: file.name, contentType: file.type, base64Data: base64 });
    };
    reader.readAsDataURL(file);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const getTypeIcon = (type: string) => {
    if (type === "document") return <FileText className="h-4 w-4 text-cyan-400" />;
    if (type === "blog") return <BookOpen className="h-4 w-4 text-emerald-400" />;
    if (type === "video") return <Film className="h-4 w-4 text-purple-400" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("res.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("res.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => batchOgMutation.mutate()} disabled={batchOgMutation.isPending} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${batchOgMutation.isPending ? 'animate-spin' : ''}`} />
            {batchOgMutation.isPending ? t("admin.processing") : 'Batch OG'}
          </Button>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" /> {t("res.new")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0">{t("admin.status")}:</Label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.all")}</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0">{t("res.language")}:</Label>
          <Select value={filterLang} onValueChange={setFilterLang}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("admin.all")}</SelectItem>
              {LANG_OPTIONS.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="shrink-0">
          {resources?.length ?? 0}
        </Badge>
      </div>

      {/* Resource List */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">{t("admin.loading")}</p>
          ) : resources && resources.length > 0 ? (
            <div className="divide-y divide-border/30">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center gap-4 py-3">
                  <div className="shrink-0">
                    {r.thumbnailUrl ? (
                      <img src={r.thumbnailUrl} alt="" className="h-16 w-24 rounded object-cover bg-muted" />
                    ) : (
                      <div className="h-16 w-24 rounded bg-muted flex items-center justify-center">
                        {getTypeIcon(r.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(r.type)}
                      <span className="text-sm font-medium truncate">{r.title}</span>
                    </div>
                    {r.description && <p className="text-xs text-muted-foreground truncate">{r.description}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getLangColor(r.lang)}`}>{r.lang.toUpperCase()}</Badge>
                      {r.fileType && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{r.fileType.toUpperCase()}</Badge>}
                      {!r.isActive && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{t("admin.inactive")}</Badge>}
                      <span className="text-[10px] text-muted-foreground">#{r.sortOrder}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActiveMutation.mutate({ id: r.id, isActive: !r.isActive })} title={r.isActive ? t("admin.inactive") : t("admin.active")}>
                      {r.isActive ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)} title={t("admin.edit")}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { if (confirm(t("admin.confirm"))) deleteMutation.mutate({ id: r.id }); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">{t("admin.noData")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? t("admin.edit") : t("res.new")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">{t("admin.status")} *</Label>
                <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as any }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((tp) => (
                      <SelectItem key={tp.value} value={tp.value}>
                        <span className="flex items-center gap-2"><tp.icon className="h-3.5 w-3.5" />{tp.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">{t("res.language")} *</Label>
                <Select value={form.lang} onValueChange={(v) => setForm((p) => ({ ...p, lang: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANG_OPTIONS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-sm">{t("admin.title")} *</Label>
              <Input className="mt-1" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder={t("admin.title")} />
            </div>
            <div>
              <Label className="text-sm">{t("res.description")}</Label>
              <Textarea className="mt-1" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder={t("res.description")} rows={2} />
            </div>
            <div>
              <Label className="text-sm">{t("res.thumbnail")}</Label>
              <div className="mt-1 flex items-center gap-3">
                {form.thumbnailUrl ? (
                  <img src={form.thumbnailUrl} alt="thumb" className="h-20 w-32 rounded object-cover bg-muted" />
                ) : (
                  <div className="h-20 w-32 rounded bg-muted flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <input ref={thumbInputRef} type="file" className="hidden" accept="image/*" onChange={handleThumbUpload} />
                  <Button variant="outline" size="sm" onClick={() => thumbInputRef.current?.click()} disabled={uploadThumbMutation.isPending} className="gap-1">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadThumbMutation.isPending ? t("admin.uploading") : t("admin.upload")}
                  </Button>
                  {(form.type === "blog" || form.type === "video") && form.url && (
                    <Button variant="outline" size="sm" onClick={() => fetchOgMutation.mutate({ url: form.url })} disabled={fetchOgMutation.isPending} className="gap-1">
                      <LinkIcon className="h-3.5 w-3.5" />
                      {fetchOgMutation.isPending ? t("admin.processing") : "OG Image"}
                    </Button>
                  )}
                  <Input value={form.thumbnailUrl} onChange={(e) => setForm((p) => ({ ...p, thumbnailUrl: e.target.value }))} placeholder="URL" className="text-xs h-8" />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm">{t("res.url")} *</Label>
              <Input className="mt-1" value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {form.type === "document" && (
                <div>
                  <Label className="text-sm">File Type</Label>
                  <Select value={form.fileType} onValueChange={(v) => setForm((p) => ({ ...p, fileType: v }))}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FILE_TYPE_OPTIONS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {form.type === "blog" && (
                <div>
                  <Label className="text-sm">Platform</Label>
                  <Input className="mt-1" value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))} placeholder="Naver Blog, Medium" />
                </div>
              )}
              {form.type === "video" && (
                <div>
                  <Label className="text-sm">YouTube ID</Label>
                  <Input className="mt-1" value={form.youtubeId} onChange={(e) => setForm((p) => ({ ...p, youtubeId: e.target.value }))} placeholder="fzsxiru7hAw" />
                </div>
              )}
              <div>
                <Label className="text-sm">Sort Order</Label>
                <Input className="mt-1" type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeDialog}>{t("admin.cancel")}</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? t("admin.processing") : editId ? t("admin.save") : t("admin.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
