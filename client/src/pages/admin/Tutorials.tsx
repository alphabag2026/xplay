import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Eye, EyeOff, Video, HelpCircle, X } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

type TutorialStep = { title: Record<string, string>; desc: Record<string, string> };
type TutorialForm = {
  youtubeId: string; videoUrl: string; iconName: string; iconColor: string;
  title: string; description: string; tooltip: string; category: string; steps: string; sortOrder: number;
};
const emptyTutorialForm: TutorialForm = {
  youtubeId: "", videoUrl: "", iconName: "Rocket", iconColor: "#00f5ff",
  title: '{"ko":"","en":""}', description: '{"ko":"","en":""}', tooltip: '{"ko":"","en":""}',
  category: "beginner", steps: "[]", sortOrder: 0,
};
const ICON_OPTIONS = ["Rocket", "Bot", "Wallet", "Share2", "Gamepad2", "BookOpen", "Video", "Zap", "Star", "Shield", "Target", "Coins", "HelpCircle"];
const CORE_LANGS = ["ko", "en", "zh", "ja", "vi", "th"];

function parseLangMap(json: string): Record<string, string> {
  try { return JSON.parse(json); } catch { return {}; }
}
function stringifyLangMap(map: Record<string, string>): string { return JSON.stringify(map); }

function LangMapEditor({ value, onChange, label, multiline = false }: {
  value: string; onChange: (v: string) => void; label: string; multiline?: boolean;
}) {
  const map = parseLangMap(value);
  const updateLang = (lang: string, text: string) => onChange(stringifyLangMap({ ...map, [lang]: text }));
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1 space-y-1.5">
        {CORE_LANGS.map((lang) => (
          <div key={lang} className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0 mt-1 text-[10px] w-8 justify-center">{lang.toUpperCase()}</Badge>
            {multiline ? (
              <Textarea value={map[lang] || ""} onChange={(e) => updateLang(lang, e.target.value)} rows={2} className="text-xs" placeholder={`${lang}`} />
            ) : (
              <Input value={map[lang] || ""} onChange={(e) => updateLang(lang, e.target.value)} className="text-xs" placeholder={`${lang}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepsEditor({ value, onChange, t }: { value: string; onChange: (v: string) => void; t: (k: string) => string }) {
  const steps: TutorialStep[] = (() => { try { return JSON.parse(value); } catch { return []; } })();
  const updateSteps = (s: TutorialStep[]) => onChange(JSON.stringify(s));
  const addStep = () => updateSteps([...steps, { title: { ko: "", en: "" }, desc: { ko: "", en: "" } }]);
  const removeStep = (idx: number) => updateSteps(steps.filter((_, i) => i !== idx));
  const updateStep = (idx: number, field: "title" | "desc", lang: string, text: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: { ...updated[idx][field], [lang]: text } };
    updateSteps(updated);
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm">{t("tutorial.steps")}</Label>
        <Button variant="outline" size="sm" onClick={addStep} className="gap-1 h-7 text-xs">
          <Plus className="h-3 w-3" /> {t("tutorial.addStep")}
        </Button>
      </div>
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={idx} className="p-3 rounded-lg border border-border/50 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Step {idx + 1}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeStep(idx)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            {CORE_LANGS.slice(0, 2).map((lang) => (
              <div key={lang} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] w-8 justify-center">{lang.toUpperCase()}</Badge>
                  <Input value={step.title[lang] || ""} onChange={(e) => updateStep(idx, "title", lang, e.target.value)} className="text-xs h-7" placeholder={`Title (${lang})`} />
                </div>
                <div className="flex items-start gap-2 ml-10">
                  <Textarea value={step.desc[lang] || ""} onChange={(e) => updateStep(idx, "desc", lang, e.target.value)} className="text-xs" rows={1} placeholder={`Desc (${lang})`} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type FaqForm = { question: string; answer: string; sortOrder: number };
const emptyFaqForm: FaqForm = { question: '{"ko":"","en":""}', answer: '{"ko":"","en":""}', sortOrder: 0 };

export default function AdminTutorials() {
  const { t } = useApp();
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState("tutorials");

  const CATEGORY_OPTIONS = [
    { value: "beginner", label: t("tutorial.beginner") },
    { value: "intermediate", label: t("tutorial.intermediate") },
    { value: "advanced", label: t("tutorial.advanced") },
  ];

  const [tutDialogOpen, setTutDialogOpen] = useState(false);
  const [tutEditId, setTutEditId] = useState<number | null>(null);
  const [tutForm, setTutForm] = useState<TutorialForm>({ ...emptyTutorialForm });
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [faqEditId, setFaqEditId] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState<FaqForm>({ ...emptyFaqForm });

  const { data: tutorials, isLoading: tutLoading } = trpc.tutorials.list.useQuery();
  const { data: faqItems, isLoading: faqLoading } = trpc.faq.list.useQuery();

  const tutCreateMut = trpc.tutorials.create.useMutation({
    onSuccess: () => { utils.tutorials.list.invalidate(); toast.success(t("admin.create") + " ✓"); closeTutDialog(); },
    onError: (e) => toast.error(e.message),
  });
  const tutUpdateMut = trpc.tutorials.update.useMutation({
    onSuccess: () => { utils.tutorials.list.invalidate(); toast.success(t("admin.save") + " ✓"); closeTutDialog(); },
    onError: (e: any) => toast.error(e.message),
  });
  const tutDeleteMut = trpc.tutorials.delete.useMutation({
    onSuccess: () => { utils.tutorials.list.invalidate(); toast.success(t("admin.delete") + " ✓"); },
    onError: (e) => toast.error(e.message),
  });
  const tutToggleMut = trpc.tutorials.update.useMutation({
    onSuccess: () => utils.tutorials.list.invalidate(),
    onError: (e: any) => toast.error(e.message),
  });

  const faqCreateMut = trpc.faq.create.useMutation({
    onSuccess: () => { utils.faq.list.invalidate(); toast.success(t("admin.create") + " ✓"); closeFaqDialog(); },
    onError: (e) => toast.error(e.message),
  });
  const faqUpdateMut = trpc.faq.update.useMutation({
    onSuccess: () => { utils.faq.list.invalidate(); toast.success(t("admin.save") + " ✓"); closeFaqDialog(); },
    onError: (e: any) => toast.error(e.message),
  });
  const faqDeleteMut = trpc.faq.delete.useMutation({
    onSuccess: () => { utils.faq.list.invalidate(); toast.success(t("admin.delete") + " ✓"); },
    onError: (e) => toast.error(e.message),
  });
  const faqToggleMut = trpc.faq.update.useMutation({
    onSuccess: () => utils.faq.list.invalidate(),
    onError: (e: any) => toast.error(e.message),
  });

  const closeTutDialog = () => { setTutDialogOpen(false); setTutEditId(null); setTutForm({ ...emptyTutorialForm }); };
  const openTutCreate = () => { setTutEditId(null); setTutForm({ ...emptyTutorialForm }); setTutDialogOpen(true); };
  const openTutEdit = (item: any) => {
    setTutEditId(item.id);
    setTutForm({
      youtubeId: item.youtubeId || "", videoUrl: item.videoUrl || "", iconName: item.iconName || "Rocket",
      iconColor: item.iconColor || "#00f5ff", title: item.title || '{"ko":"","en":""}',
      description: item.description || '{"ko":"","en":""}', tooltip: item.tooltip || '{"ko":"","en":""}',
      category: item.category || "beginner", steps: item.steps || "[]", sortOrder: item.sortOrder ?? 0,
    });
    setTutDialogOpen(true);
  };
  const handleTutSubmit = () => {
    const titleMap = parseLangMap(tutForm.title);
    if (!titleMap.ko && !titleMap.en) { toast.error(t("admin.noData")); return; }
    const payload = {
      youtubeId: tutForm.youtubeId || "", videoUrl: tutForm.videoUrl || undefined, iconName: tutForm.iconName,
      iconColor: tutForm.iconColor, title: tutForm.title, description: tutForm.description || "",
      tooltip: tutForm.tooltip || undefined, category: tutForm.category, steps: tutForm.steps || undefined, sortOrder: tutForm.sortOrder,
    };
    if (tutEditId) tutUpdateMut.mutate({ id: tutEditId, ...payload });
    else tutCreateMut.mutate(payload);
  };

  const closeFaqDialog = () => { setFaqDialogOpen(false); setFaqEditId(null); setFaqForm({ ...emptyFaqForm }); };
  const openFaqCreate = () => { setFaqEditId(null); setFaqForm({ ...emptyFaqForm }); setFaqDialogOpen(true); };
  const openFaqEdit = (f: any) => {
    setFaqEditId(f.id);
    setFaqForm({ question: f.question || '{"ko":"","en":""}', answer: f.answer || '{"ko":"","en":""}', sortOrder: f.sortOrder ?? 0 });
    setFaqDialogOpen(true);
  };
  const handleFaqSubmit = () => {
    const qMap = parseLangMap(faqForm.question);
    if (!qMap.ko && !qMap.en) { toast.error(t("admin.noData")); return; }
    const payload = { question: faqForm.question, answer: faqForm.answer, sortOrder: faqForm.sortOrder };
    if (faqEditId) faqUpdateMut.mutate({ id: faqEditId, ...payload });
    else faqCreateMut.mutate(payload);
  };

  const getTitle = (jsonStr: string | null) => {
    if (!jsonStr) return "-";
    const map = parseLangMap(jsonStr);
    return map.ko || map.en || "-";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("tutorial.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("tutorial.subtitle")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tutorials" className="gap-2">
            <Video className="h-4 w-4" /> {t("tutorial.tutorials")} ({tutorials?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" /> FAQ ({faqItems?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openTutCreate} className="gap-2"><Plus className="h-4 w-4" /> {t("tutorial.create")}</Button>
          </div>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              {tutLoading ? (
                <p className="text-center text-muted-foreground py-8">{t("admin.loading")}</p>
              ) : tutorials && tutorials.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {tutorials.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3">
                      <div className="shrink-0">
                        {item.youtubeId ? (
                          <img src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} alt="" className="h-16 w-24 rounded object-cover bg-muted" />
                        ) : (
                          <div className="h-16 w-24 rounded bg-muted flex items-center justify-center"><Video className="h-4 w-4 text-muted-foreground" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{getTitle(item.title)}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {CATEGORY_OPTIONS.find(c => c.value === item.category)?.label || item.category}
                          </Badge>
                          {item.youtubeId && <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-400">YouTube</Badge>}
                          {!item.isActive && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{t("admin.inactive")}</Badge>}
                          <span className="text-[10px] text-muted-foreground">#{item.sortOrder}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => tutToggleMut.mutate({ id: item.id, isActive: !item.isActive })}>
                          {item.isActive ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTutEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => { if (confirm(t("admin.confirm"))) tutDeleteMut.mutate({ id: item.id }); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("admin.noData")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openFaqCreate} className="gap-2"><Plus className="h-4 w-4" /> {t("tutorial.createFaq")}</Button>
          </div>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              {faqLoading ? (
                <p className="text-center text-muted-foreground py-8">{t("admin.loading")}</p>
              ) : faqItems && faqItems.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {faqItems.map((f) => (
                    <div key={f.id} className="flex items-center gap-4 py-3">
                      <div className="shrink-0">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center"><HelpCircle className="h-4 w-4 text-cyan-400" /></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{getTitle(f.question)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {!f.isActive && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">{t("admin.inactive")}</Badge>}
                          <span className="text-[10px] text-muted-foreground">#{f.sortOrder}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => faqToggleMut.mutate({ id: f.id, isActive: !f.isActive })}>
                          {f.isActive ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openFaqEdit(f)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => { if (confirm(t("admin.confirm"))) faqDeleteMut.mutate({ id: f.id }); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("admin.noData")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tutorial Dialog */}
      <Dialog open={tutDialogOpen} onOpenChange={(open) => { if (!open) closeTutDialog(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{tutEditId ? t("tutorial.edit") : t("tutorial.create")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-sm">YouTube ID</Label><Input className="mt-1" value={tutForm.youtubeId} onChange={(e) => setTutForm((p) => ({ ...p, youtubeId: e.target.value }))} placeholder="fzsxiru7hAw" /></div>
              <div><Label className="text-sm">{t("tutorial.videoUrl")}</Label><Input className="mt-1" value={tutForm.videoUrl} onChange={(e) => setTutForm((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="https://..." /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-sm">{t("tutorial.icon")}</Label>
                <Select value={tutForm.iconName} onValueChange={(v) => setTutForm((p) => ({ ...p, iconName: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{ICON_OPTIONS.map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-sm">{t("tutorial.iconColor")}</Label><Input className="mt-1" type="color" value={tutForm.iconColor} onChange={(e) => setTutForm((p) => ({ ...p, iconColor: e.target.value }))} /></div>
              <div><Label className="text-sm">{t("tutorial.category")}</Label>
                <Select value={tutForm.category} onValueChange={(v) => setTutForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORY_OPTIONS.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <LangMapEditor value={tutForm.title} onChange={(v) => setTutForm((p) => ({ ...p, title: v }))} label={t("tutorial.titleLabel")} />
            <LangMapEditor value={tutForm.description} onChange={(v) => setTutForm((p) => ({ ...p, description: v }))} label={t("tutorial.descLabel")} multiline />
            <LangMapEditor value={tutForm.tooltip} onChange={(v) => setTutForm((p) => ({ ...p, tooltip: v }))} label={t("tutorial.tooltipLabel")} />
            <StepsEditor value={tutForm.steps} onChange={(v) => setTutForm((p) => ({ ...p, steps: v }))} t={t} />
            <div className="w-32"><Label className="text-sm">{t("tutorial.sortOrder")}</Label><Input className="mt-1" type="number" value={tutForm.sortOrder} onChange={(e) => setTutForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeTutDialog}>{t("admin.cancel")}</Button>
            <Button onClick={handleTutSubmit} disabled={tutCreateMut.isPending || tutUpdateMut.isPending}>
              {tutCreateMut.isPending || tutUpdateMut.isPending ? t("admin.processing") : t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialogOpen} onOpenChange={(open) => { if (!open) closeFaqDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{faqEditId ? t("tutorial.editFaq") : t("tutorial.createFaq")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <LangMapEditor value={faqForm.question} onChange={(v) => setFaqForm((p) => ({ ...p, question: v }))} label={t("tutorial.question")} />
            <LangMapEditor value={faqForm.answer} onChange={(v) => setFaqForm((p) => ({ ...p, answer: v }))} label={t("tutorial.answer")} multiline />
            <div className="w-32"><Label className="text-sm">{t("tutorial.sortOrder")}</Label><Input className="mt-1" type="number" value={faqForm.sortOrder} onChange={(e) => setFaqForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))} /></div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeFaqDialog}>{t("admin.cancel")}</Button>
            <Button onClick={handleFaqSubmit} disabled={faqCreateMut.isPending || faqUpdateMut.isPending}>
              {faqCreateMut.isPending || faqUpdateMut.isPending ? t("admin.processing") : t("admin.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
