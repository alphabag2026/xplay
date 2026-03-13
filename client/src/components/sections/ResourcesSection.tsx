import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { FileText, Download, ExternalLink, Play } from "lucide-react";

const NOTION_URL = "https://frill-tuck-900.notion.site/X-PLAY-31f95eaa77f680d885a3c215497e3dc5";

interface DocItem {
  titleKey: string;
  fallbackTitle: string;
  type: "pdf" | "pptx";
  langTag: string;
  url: string;
}

const DOCS: DocItem[] = [
  { titleKey: "XPLAY 수익 구조 완전 분석 (PDF)", fallbackTitle: "XPLAY Revenue Structure Analysis (PDF)", type: "pdf", langTag: "KO", url: NOTION_URL },
  { titleKey: "XPLAY 프레젠테이션 (PPTX)", fallbackTitle: "XPLAY Presentation (PPTX)", type: "pptx", langTag: "KO", url: NOTION_URL },
  { titleKey: "XPLAY Revenue Structure (PDF)", fallbackTitle: "XPLAY Revenue Structure (PDF)", type: "pdf", langTag: "EN", url: NOTION_URL },
  { titleKey: "XPLAY Presentation (PPTX)", fallbackTitle: "XPLAY Presentation (PPTX)", type: "pptx", langTag: "EN", url: NOTION_URL },
  { titleKey: "XPLAY 收益结构完全解析 (PDF)", fallbackTitle: "XPLAY Revenue Analysis (PDF)", type: "pdf", langTag: "ZH", url: NOTION_URL },
  { titleKey: "XPLAY 双引擎 (PDF)", fallbackTitle: "XPLAY Dual Engine (PDF)", type: "pdf", langTag: "ZH", url: NOTION_URL },
  { titleKey: "XPLAY 演示文稿 (PPTX)", fallbackTitle: "XPLAY Presentation (PPTX)", type: "pptx", langTag: "ZH", url: NOTION_URL },
  { titleKey: "XPLAY プレゼンテーション (PPTX)", fallbackTitle: "XPLAY Presentation (PPTX)", type: "pptx", langTag: "JP", url: NOTION_URL },
];

const VIDEOS = [
  {
    id: "fzsxiru7hAw",
    title: "X Play Movie 소개영상",
  },
];

export default function ResourcesSection() {
  const { t, lang } = useApp();

  // Filter docs by language relevance (show all, but highlight matching)
  const langTagMap: Record<string, string> = { ko: "KO", zh: "ZH", ja: "JP", en: "EN" };
  const currentTag = langTagMap[lang] || "EN";

  // Sort: current language first
  const sortedDocs = [...DOCS].sort((a, b) => {
    if (a.langTag === currentTag && b.langTag !== currentTag) return -1;
    if (a.langTag !== currentTag && b.langTag === currentTag) return 1;
    return 0;
  });

  return (
    <SectionWrapper id="resources">
      <SectionTitle
        badge={t("res.badge")}
        title={t("res.title")}
        subtitle={t("res.subtitle")}
      />

      {/* Documents */}
      <GlassCard className="mb-8">
        <h3
          className="text-lg font-bold mb-5 flex items-center gap-2"
          style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <FileText size={20} />
          {t("res.docs")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedDocs.map((doc, i) => (
            <a
              key={i}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 transition-all group"
              style={{
                background: doc.langTag === currentTag ? "rgba(0,245,255,0.06)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${doc.langTag === currentTag ? "rgba(0,245,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "8px",
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
                style={{
                  background: doc.type === "pdf" ? "rgba(239,68,68,0.15)" : "rgba(168,85,247,0.15)",
                  border: `1px solid ${doc.type === "pdf" ? "rgba(239,68,68,0.3)" : "rgba(168,85,247,0.3)"}`,
                }}
              >
                <span className="text-xs font-bold" style={{ color: doc.type === "pdf" ? "#ef4444" : "#a855f7" }}>
                  {doc.type.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {doc.titleKey}
                </p>
                <span
                  className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold rounded"
                  style={{
                    background: "rgba(0,245,255,0.1)",
                    color: "#00f5ff",
                  }}
                >
                  {doc.langTag}
                </span>
              </div>
              <Download size={16} className="shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: "#00f5ff" }} />
            </a>
          ))}
        </div>
        <a
          href={NOTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-5 py-2.5 text-sm font-medium transition-all"
          style={{
            background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.15)",
            borderRadius: "8px",
            color: "#00f5ff",
          }}
        >
          <ExternalLink size={14} />
          {t("res.notion")}
        </a>
      </GlassCard>

      {/* Video */}
      <GlassCard glowColor="purple">
        <h3
          className="text-lg font-bold mb-5 flex items-center gap-2"
          style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <Play size={20} />
          {t("res.video")}
        </h3>
        <div className="space-y-4">
          {VIDEOS.map((video) => (
            <div key={video.id}>
              <div
                className="relative w-full overflow-hidden"
                style={{ borderRadius: "8px", aspectRatio: "16/9" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              </div>
              <p className="mt-2 text-sm font-medium" style={{ color: "rgba(226,232,240,0.8)" }}>
                {video.title}
              </p>
            </div>
          ))}
        </div>
        <a
          href="https://www.youtube.com/@BROCommunity2025"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 mt-5 py-2.5 text-sm font-medium transition-all"
          style={{
            background: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(168,85,247,0.2)",
            borderRadius: "8px",
            color: "#a855f7",
          }}
        >
          <ExternalLink size={14} />
          YouTube Channel
        </a>
      </GlassCard>
    </SectionWrapper>
  );
}
