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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, Eye, EyeOff, Upload, Video, BookOpen,
  HelpCircle, GripVertical, ChevronDown, ChevronUp, X,
} from "lucide-react";

// ===== TUTORIALS TAB =====

type TutorialStep = { title: Record<string, string>; desc: Record<string, string> };

type TutorialForm = {
  youtubeId: string;
  videoUrl: string;
  iconName: string;
  iconColor: string;
  title: string; // JSON string of lang map
  description: string;
  tooltip: string;
  category: string;
  steps: string; // JSON string of steps array
  sortOrder: number;
};

const emptyTutorialForm: TutorialForm = {
  youtubeId: "",
  videoUrl: "",
  iconName: "Rocket",
  iconColor: "#00f5ff",
  title: '{"ko":"","en":""}',
  description: '{"ko":"","en":""}',
  tooltip: '{"ko":"","en":""}',
  category: "beginner",
  steps: "[]",
  sortOrder: 0,
};

const ICON_OPTIONS = [
  "Rocket", "Bot", "Wallet", "Share2", "Gamepad2", "BookOpen",
  "Video", "Zap", "Star", "Shield", "Target", "Coins", "HelpCircle",
];

const CATEGORY_OPTIONS = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
];

const CORE_LANGS = ["ko", "en", "zh", "ja", "vi", "th"];

function parseLangMap(json: string): Record<string, string> {
  try { return JSON.parse(json); } catch { return {}; }
}

function stringifyLangMap(map: Record<string, string>): string {
  return JSON.stringify(map);
}

function LangMapEditor({ value, onChange, label, multiline = false }: {
  value: string; onChange: (v: string) => void; label: string; multiline?: boolean;
}) {
  const map = parseLangMap(value);
  const updateLang = (lang: string, text: string) => {
    const updated = { ...map, [lang]: text };
    onChange(stringifyLangMap(updated));
  };

  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <div className="mt-1 space-y-1.5">
        {CORE_LANGS.map((lang) => (
          <div key={lang} className="flex items-start gap-2">
            <Badge variant="outline" className="shrink-0 mt-1 text-[10px] w-8 justify-center">{lang.toUpperCase()}</Badge>
            {multiline ? (
              <Textarea
                value={map[lang] || ""}
                onChange={(e) => updateLang(lang, e.target.value)}
                rows={2}
                className="text-xs"
                placeholder={`${lang} 텍스트`}
              />
            ) : (
              <Input
                value={map[lang] || ""}
                onChange={(e) => updateLang(lang, e.target.value)}
                className="text-xs"
                placeholder={`${lang} 텍스트`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepsEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const steps: TutorialStep[] = (() => {
    try { return JSON.parse(value); } catch { return []; }
  })();

  const updateSteps = (newSteps: TutorialStep[]) => {
    onChange(JSON.stringify(newSteps));
  };

  const addStep = () => {
    updateSteps([...steps, { title: { ko: "", en: "" }, desc: { ko: "", en: "" } }]);
  };

  const removeStep = (idx: number) => {
    updateSteps(steps.filter((_, i) => i !== idx));
  };

  const updateStep = (idx: number, field: "title" | "desc", lang: string, text: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], [field]: { ...updated[idx][field], [lang]: text } };
    updateSteps(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm">단계별 가이드</Label>
        <Button variant="outline" size="sm" onClick={addStep} className="gap-1 h-7 text-xs">
          <Plus className="h-3 w-3" /> 단계 추가
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
                  <Input
                    value={step.title[lang] || ""}
                    onChange={(e) => updateStep(idx, "title", lang, e.target.value)}
                    className="text-xs h-7"
                    placeholder={`제목 (${lang})`}
                  />
                </div>
                <div className="flex items-start gap-2 ml-10">
                  <Textarea
                    value={step.desc[lang] || ""}
                    onChange={(e) => updateStep(idx, "desc", lang, e.target.value)}
                    className="text-xs"
                    rows={1}
                    placeholder={`설명 (${lang})`}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== FAQ TAB =====

type FaqForm = {
  question: string; // JSON lang map
  answer: string;   // JSON lang map
  sortOrder: number;
};

const emptyFaqForm: FaqForm = {
  question: '{"ko":"","en":""}',
  answer: '{"ko":"","en":""}',
  sortOrder: 0,
};

// ===== MAIN COMPONENT =====

export default function AdminTutorials() {
  const utils = trpc.useUtils();
  const [activeTab, setActiveTab] = useState("tutorials");

  // Tutorial state
  const [tutDialogOpen, setTutDialogOpen] = useState(false);
  const [tutEditId, setTutEditId] = useState<number | null>(null);
  const [tutForm, setTutForm] = useState<TutorialForm>({ ...emptyTutorialForm });

  // FAQ state
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);
  const [faqEditId, setFaqEditId] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState<FaqForm>({ ...emptyFaqForm });

  // Queries
  const { data: tutorials, isLoading: tutLoading } = trpc.tutorials.list.useQuery();
  const { data: faqItems, isLoading: faqLoading } = trpc.faq.list.useQuery();

  // Tutorial mutations
  const tutCreateMut = trpc.tutorials.create.useMutation({
    onSuccess: () => { utils.tutorials.list.invalidate(); toast.success("튜토리얼이 등록되었습니다"); closeTutDialog(); },
    onError: (e) => toast.error(e.message),
  });
  const tutUpdateMut = trpc.tutorials.update.useMutation({
    onSuccess: () => { utils.tutorials.list.invalidate(); toast.success("튜토리얼이 수정되었습니다"); closeTutDialog(); },
    onError: (e: any) => toast.error(e.message),
  });
  const tutDeleteMut = trpc.tutorials.delete.useMutation({
    onSuccess: () => { utils.tutorials.list.invalidate(); toast.success("튜토리얼이 삭제되었습니다"); },
    onError: (e) => toast.error(e.message),
  });
  const tutToggleMut = trpc.tutorials.update.useMutation({
    onSuccess: () => utils.tutorials.list.invalidate(),
    onError: (e: any) => toast.error(e.message),
  });

  // FAQ mutations
  const faqCreateMut = trpc.faq.create.useMutation({
    onSuccess: () => { utils.faq.list.invalidate(); toast.success("FAQ가 등록되었습니다"); closeFaqDialog(); },
    onError: (e) => toast.error(e.message),
  });
  const faqUpdateMut = trpc.faq.update.useMutation({
    onSuccess: () => { utils.faq.list.invalidate(); toast.success("FAQ가 수정되었습니다"); closeFaqDialog(); },
    onError: (e: any) => toast.error(e.message),
  });
  const faqDeleteMut = trpc.faq.delete.useMutation({
    onSuccess: () => { utils.faq.list.invalidate(); toast.success("FAQ가 삭제되었습니다"); },
    onError: (e) => toast.error(e.message),
  });
  const faqToggleMut = trpc.faq.update.useMutation({
    onSuccess: () => utils.faq.list.invalidate(),
    onError: (e: any) => toast.error(e.message),
  });

  // Tutorial dialog helpers
  const closeTutDialog = () => { setTutDialogOpen(false); setTutEditId(null); setTutForm({ ...emptyTutorialForm }); };
  const openTutCreate = () => { setTutEditId(null); setTutForm({ ...emptyTutorialForm }); setTutDialogOpen(true); };
  const openTutEdit = (t: any) => {
    setTutEditId(t.id);
    setTutForm({
      youtubeId: t.youtubeId || "",
      videoUrl: t.videoUrl || "",
      iconName: t.iconName || "Rocket",
      iconColor: t.iconColor || "#00f5ff",
      title: t.title || '{"ko":"","en":""}',
      description: t.description || '{"ko":"","en":""}',
      tooltip: t.tooltip || '{"ko":"","en":""}',
      category: t.category || "beginner",
      steps: t.steps || "[]",
      sortOrder: t.sortOrder ?? 0,
    });
    setTutDialogOpen(true);
  };
  const handleTutSubmit = () => {
    const titleMap = parseLangMap(tutForm.title);
    if (!titleMap.ko && !titleMap.en) { toast.error("제목(한국어 또는 영어)은 필수입니다"); return; }
    const payload = {
      youtubeId: tutForm.youtubeId || "",
      videoUrl: tutForm.videoUrl || undefined,
      iconName: tutForm.iconName,
      iconColor: tutForm.iconColor,
      title: tutForm.title,
      description: tutForm.description || "",
      tooltip: tutForm.tooltip || undefined,
      category: tutForm.category,
      steps: tutForm.steps || undefined,
      sortOrder: tutForm.sortOrder,
    };
    if (tutEditId) {
      tutUpdateMut.mutate({ id: tutEditId, ...payload });
    } else {
      tutCreateMut.mutate(payload);
    }
  };

  // FAQ dialog helpers
  const closeFaqDialog = () => { setFaqDialogOpen(false); setFaqEditId(null); setFaqForm({ ...emptyFaqForm }); };
  const openFaqCreate = () => { setFaqEditId(null); setFaqForm({ ...emptyFaqForm }); setFaqDialogOpen(true); };
  const openFaqEdit = (f: any) => {
    setFaqEditId(f.id);
    setFaqForm({
      question: f.question || '{"ko":"","en":""}',
      answer: f.answer || '{"ko":"","en":""}',
      sortOrder: f.sortOrder ?? 0,
    });
    setFaqDialogOpen(true);
  };
  const handleFaqSubmit = () => {
    const qMap = parseLangMap(faqForm.question);
    if (!qMap.ko && !qMap.en) { toast.error("질문(한국어 또는 영어)은 필수입니다"); return; }
    const payload = {
      question: faqForm.question,
      answer: faqForm.answer,
      sortOrder: faqForm.sortOrder,
    };
    if (faqEditId) {
      faqUpdateMut.mutate({ id: faqEditId, ...payload });
    } else {
      faqCreateMut.mutate(payload);
    }
  };

  const getTitle = (jsonStr: string | null) => {
    if (!jsonStr) return "(제목 없음)";
    const map = parseLangMap(jsonStr);
    return map.ko || map.en || "(제목 없음)";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">튜토리얼 & FAQ 관리</h1>
        <p className="text-muted-foreground mt-1">튜토리얼 영상과 자주 묻는 질문을 관리합니다</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tutorials" className="gap-2">
            <Video className="h-4 w-4" /> 튜토리얼 ({tutorials?.length ?? 0})
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" /> FAQ ({faqItems?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        {/* ===== TUTORIALS TAB ===== */}
        <TabsContent value="tutorials" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openTutCreate} className="gap-2">
              <Plus className="h-4 w-4" /> 튜토리얼 등록
            </Button>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              {tutLoading ? (
                <p className="text-center text-muted-foreground py-8">로딩 중...</p>
              ) : tutorials && tutorials.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {tutorials.map((t) => (
                    <div key={t.id} className="flex items-center gap-4 py-3">
                      {/* Thumbnail */}
                      <div className="shrink-0">
                        {t.youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`}
                            alt="" className="h-16 w-24 rounded object-cover bg-muted"
                          />
                        ) : (
                          <div className="h-16 w-24 rounded bg-muted flex items-center justify-center">
                            <Video className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium truncate">{getTitle(t.title)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {CATEGORY_OPTIONS.find(c => c.value === t.category)?.label || t.category}
                          </Badge>
                          {t.videoUrl && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-purple-500/10 text-purple-400">
                              직접 영상
                            </Badge>
                          )}
                          {t.youtubeId && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-400">
                              YouTube
                            </Badge>
                          )}
                          {!t.isActive && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">비활성</Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground">#{t.sortOrder}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => tutToggleMut.mutate({ id: t.id, isActive: !t.isActive })}
                        >
                          {t.isActive ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openTutEdit(t)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => { if (confirm("이 튜토리얼을 삭제하시겠습니까?")) tutDeleteMut.mutate({ id: t.id }); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">등록된 튜토리얼이 없습니다</p>
                  <p className="text-xs text-muted-foreground mt-1">"튜토리얼 등록" 버튼으로 추가하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== FAQ TAB ===== */}
        <TabsContent value="faq" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openFaqCreate} className="gap-2">
              <Plus className="h-4 w-4" /> FAQ 등록
            </Button>
          </div>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="pt-4">
              {faqLoading ? (
                <p className="text-center text-muted-foreground py-8">로딩 중...</p>
              ) : faqItems && faqItems.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {faqItems.map((f) => (
                    <div key={f.id} className="flex items-center gap-4 py-3">
                      <div className="shrink-0">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <HelpCircle className="h-4 w-4 text-cyan-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{getTitle(f.question)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {!f.isActive && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">비활성</Badge>
                          )}
                          <span className="text-[10px] text-muted-foreground">#{f.sortOrder}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          onClick={() => faqToggleMut.mutate({ id: f.id, isActive: !f.isActive })}
                        >
                          {f.isActive ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openFaqEdit(f)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                          onClick={() => { if (confirm("이 FAQ를 삭제하시겠습니까?")) faqDeleteMut.mutate({ id: f.id }); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">등록된 FAQ가 없습니다</p>
                  <p className="text-xs text-muted-foreground mt-1">"FAQ 등록" 버튼으로 추가하세요</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== Tutorial Create/Edit Dialog ===== */}
      <Dialog open={tutDialogOpen} onOpenChange={(open) => { if (!open) closeTutDialog(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{tutEditId ? "튜토리얼 수정" : "튜토리얼 등록"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Video Source */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">YouTube ID</Label>
                <Input
                  className="mt-1"
                  value={tutForm.youtubeId}
                  onChange={(e) => setTutForm((p) => ({ ...p, youtubeId: e.target.value }))}
                  placeholder="예: fzsxiru7hAw"
                />
              </div>
              <div>
                <Label className="text-sm">직접 영상 URL (R2 등)</Label>
                <Input
                  className="mt-1"
                  value={tutForm.videoUrl}
                  onChange={(e) => setTutForm((p) => ({ ...p, videoUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Icon & Category */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">아이콘</Label>
                <Select value={tutForm.iconName} onValueChange={(v) => setTutForm((p) => ({ ...p, iconName: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">아이콘 색상</Label>
                <Input
                  className="mt-1"
                  type="color"
                  value={tutForm.iconColor}
                  onChange={(e) => setTutForm((p) => ({ ...p, iconColor: e.target.value }))}
                />
              </div>
              <div>
                <Label className="text-sm">카테고리</Label>
                <Select value={tutForm.category} onValueChange={(v) => setTutForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title (multi-lang) */}
            <LangMapEditor
              value={tutForm.title}
              onChange={(v) => setTutForm((p) => ({ ...p, title: v }))}
              label="제목 (다국어) *"
            />

            {/* Description (multi-lang) */}
            <LangMapEditor
              value={tutForm.description}
              onChange={(v) => setTutForm((p) => ({ ...p, description: v }))}
              label="설명 (다국어)"
              multiline
            />

            {/* Tooltip (multi-lang) */}
            <LangMapEditor
              value={tutForm.tooltip}
              onChange={(v) => setTutForm((p) => ({ ...p, tooltip: v }))}
              label="툴팁 (다국어)"
            />

            {/* Steps */}
            <StepsEditor
              value={tutForm.steps}
              onChange={(v) => setTutForm((p) => ({ ...p, steps: v }))}
            />

            {/* Sort Order */}
            <div className="w-32">
              <Label className="text-sm">정렬 순서</Label>
              <Input
                className="mt-1"
                type="number"
                value={tutForm.sortOrder}
                onChange={(e) => setTutForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeTutDialog}>취소</Button>
            <Button
              onClick={handleTutSubmit}
              disabled={tutCreateMut.isPending || tutUpdateMut.isPending}
            >
              {tutCreateMut.isPending || tutUpdateMut.isPending ? "저장 중..." : tutEditId ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== FAQ Create/Edit Dialog ===== */}
      <Dialog open={faqDialogOpen} onOpenChange={(open) => { if (!open) closeFaqDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{faqEditId ? "FAQ 수정" : "FAQ 등록"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <LangMapEditor
              value={faqForm.question}
              onChange={(v) => setFaqForm((p) => ({ ...p, question: v }))}
              label="질문 (다국어) *"
            />

            <LangMapEditor
              value={faqForm.answer}
              onChange={(v) => setFaqForm((p) => ({ ...p, answer: v }))}
              label="답변 (다국어) *"
              multiline
            />

            <div className="w-32">
              <Label className="text-sm">정렬 순서</Label>
              <Input
                className="mt-1"
                type="number"
                value={faqForm.sortOrder}
                onChange={(e) => setFaqForm((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeFaqDialog}>취소</Button>
            <Button
              onClick={handleFaqSubmit}
              disabled={faqCreateMut.isPending || faqUpdateMut.isPending}
            >
              {faqCreateMut.isPending || faqUpdateMut.isPending ? "저장 중..." : faqEditId ? "수정" : "등록"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
