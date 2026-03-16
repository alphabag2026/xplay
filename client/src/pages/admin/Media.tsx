import { trpc } from "@/lib/trpc";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Image, Film, FileText, RefreshCw } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function getFileIcon(key: string) {
  const ext = key.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return <Image className="h-4 w-4 text-green-400" />;
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return <Film className="h-4 w-4 text-purple-400" />;
  return <FileText className="h-4 w-4 text-muted-foreground" />;
}

export default function AdminMedia() {
  const utils = trpc.useUtils();
  const { t } = useApp();
  const [prefix, setPrefix] = useState<string>("");
  const { data: files, isLoading, refetch } = trpc.admin.media.list.useQuery({ prefix: prefix || undefined, maxKeys: 200 });

  const uploadMutation = trpc.admin.media.upload.useMutation({
    onSuccess: (data) => {
      utils.admin.media.list.invalidate();
      toast.success(t("admin.upload") + " ✓");
      if (data.url) { navigator.clipboard.writeText(data.url); toast.info(t("media.copyUrl")); }
    },
    onError: (e) => toast.error(e.message),
  });
  const deleteMutation = trpc.admin.media.delete.useMutation({
    onSuccess: () => { utils.admin.media.list.invalidate(); toast.success(t("admin.delete") + " ✓"); },
    onError: (e) => toast.error(e.message),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState("media");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error("Max 50MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadMutation.mutate({ fileName: file.name, folder, contentType: file.type, base64Data: base64 });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast.success(t("admin.copied")); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("media.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("media.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()} className="h-9 w-9">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*,.pdf,.doc,.docx,.zip" />
          <Button onClick={() => fileInputRef.current?.click()} className="gap-2" disabled={uploadMutation.isPending}>
            <Upload className="h-4 w-4" />
            {uploadMutation.isPending ? t("admin.uploading") : t("media.uploadFile")}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0">Folder:</Label>
          <Select value={folder} onValueChange={setFolder}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="media">media</SelectItem>
              <SelectItem value="announcements">announcements</SelectItem>
              <SelectItem value="news">news</SelectItem>
              <SelectItem value="partners">partners</SelectItem>
              <SelectItem value="videos">videos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-sm shrink-0">{t("admin.search")}:</Label>
          <Input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="prefix..." className="w-48" />
        </div>
        <Badge variant="outline" className="shrink-0">{files?.length ?? 0}</Badge>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">{t("admin.loading")}</p>
          ) : files && files.length > 0 ? (
            <div className="divide-y divide-border/30">
              {files.map((file) => (
                <div key={file.key} className="flex items-center justify-between py-3 gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {file.key.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img src={file.url} alt="" className="h-10 w-10 rounded object-cover shrink-0 bg-muted" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">{getFileIcon(file.key)}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{file.key}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                        {file.lastModified && <span className="text-xs text-muted-foreground">{new Date(file.lastModified).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyUrl(file.url)} title={t("admin.copy")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => {
                      if (confirm(t("admin.confirm"))) deleteMutation.mutate({ key: file.key });
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">{t("media.noMedia")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
