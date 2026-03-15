import GlassCard from "@/components/GlassCard";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useApp } from "@/contexts/AppContext";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  FileText, Download, ExternalLink, Play, BookOpen, Film,
  ChevronRight, Globe,
} from "lucide-react";
import { useState, useMemo } from "react";

const NOTION_URL = "https://frill-tuck-900.notion.site/X-PLAY-31f95eaa77f680d885a3c215497e3dc5";

type TabType = "all" | "document" | "blog" | "video";

function getLangBadgeColor(lang: string) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    ko: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
    en: { bg: "rgba(34,197,94,0.12)", text: "#4ade80", border: "rgba(34,197,94,0.3)" },
    zh: { bg: "rgba(239,68,68,0.12)", text: "#f87171", border: "rgba(239,68,68,0.3)" },
    ja: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", border: "rgba(168,85,247,0.3)" },
    vi: { bg: "rgba(234,179,8,0.12)", text: "#facc15", border: "rgba(234,179,8,0.3)" },
    th: { bg: "rgba(249,115,22,0.12)", text: "#fb923c", border: "rgba(249,115,22,0.3)" },
    all: { bg: "rgba(0,245,255,0.12)", text: "#00f5ff", border: "rgba(0,245,255,0.3)" },
  };
  return map[lang] || map.all;
}

function getFileTypeBadge(fileType?: string | null) {
  if (!fileType) return null;
  const colors: Record<string, { bg: string; text: string }> = {
    pdf: { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
    pptx: { bg: "rgba(168,85,247,0.15)", text: "#a855f7" },
    doc: { bg: "rgba(59,130,246,0.15)", text: "#3b82f6" },
  };
  const c = colors[fileType] || { bg: "rgba(100,116,139,0.15)", text: "#94a3b8" };
  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded"
      style={{ background: c.bg, color: c.text }}
    >
      {fileType}
    </span>
  );
}

function formatDate(d: Date | string) {
  const date = new Date(d);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 30) return `${days}일 전`;
  return date.toLocaleDateString();
}

export default function ResourcesSection() {
  const { t, lang } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const { data: resources, isLoading } = trpc.resources.list.useQuery({ lang });

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    if (activeTab === "all") return resources;
    return resources.filter((r) => r.type === activeTab);
  }, [resources, activeTab]);

  const documents = useMemo(() => filteredResources.filter((r) => r.type === "document"), [filteredResources]);
  const blogs = useMemo(() => filteredResources.filter((r) => r.type === "blog"), [filteredResources]);
  const videos = useMemo(() => filteredResources.filter((r) => r.type === "video"), [filteredResources]);

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: t("res.all"), icon: <Globe size={14} /> },
    { key: "document", label: t("res.docs"), icon: <FileText size={14} /> },
    { key: "blog", label: t("res.blog"), icon: <BookOpen size={14} /> },
    { key: "video", label: t("res.video"), icon: <Film size={14} /> },
  ];

  return (
    <SectionWrapper id="resources">
      <SectionTitle
        badge={t("res.badge")}
        title={t("res.title")}
        subtitle={t("res.subtitle")}
      />

      {/* Tab Filter */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap"
            style={{
              background: activeTab === tab.key ? "rgba(0,245,255,0.12)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${activeTab === tab.key ? "rgba(0,245,255,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: activeTab === tab.key ? "#00f5ff" : "rgba(226,232,240,0.6)",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : filteredResources.length === 0 ? (
        <GlassCard className="text-center py-12">
          <FileText size={40} className="mx-auto mb-3 opacity-30" style={{ color: "#00f5ff" }} />
          <p style={{ color: "rgba(226,232,240,0.5)" }}>{t("res.noData")}</p>
        </GlassCard>
      ) : (
        <div className="space-y-8">
          {/* Documents Section */}
          {(activeTab === "all" || activeTab === "document") && documents.length > 0 && (
            <div>
              {activeTab === "all" && (
                <h3
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: "#00f5ff", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <FileText size={20} />
                  {t("res.docs")}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((doc) => (
                  <motion.a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 transition-all group"
                    style={{
                      background: "rgba(0,245,255,0.04)",
                      border: "1px solid rgba(0,245,255,0.12)",
                      borderRadius: "10px",
                    }}
                  >
                    {/* Thumbnail or file type icon */}
                    {doc.thumbnailUrl ? (
                      <img
                        src={doc.thumbnailUrl}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover shrink-0 bg-black/30"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 flex items-center justify-center rounded-lg shrink-0"
                        style={{
                          background: doc.fileType === "pdf" ? "rgba(239,68,68,0.12)" : "rgba(168,85,247,0.12)",
                          border: `1px solid ${doc.fileType === "pdf" ? "rgba(239,68,68,0.25)" : "rgba(168,85,247,0.25)"}`,
                        }}
                      >
                        <span className="text-xs font-bold" style={{ color: doc.fileType === "pdf" ? "#ef4444" : "#a855f7" }}>
                          {(doc.fileType || "FILE").toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "rgba(226,232,240,0.9)" }}>
                        {doc.title}
                      </p>
                      {doc.description && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(226,232,240,0.4)" }}>
                          {doc.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1.5">
                        {getFileTypeBadge(doc.fileType)}
                        <LangBadge lang={doc.lang} />
                      </div>
                    </div>
                    <Download
                      size={16}
                      className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ color: "#00f5ff" }}
                    />
                  </motion.a>
                ))}
              </div>
              {/* Notion link */}
              <a
                href={NOTION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: "rgba(0,245,255,0.05)",
                  border: "1px solid rgba(0,245,255,0.12)",
                  borderRadius: "8px",
                  color: "#00f5ff",
                }}
              >
                <ExternalLink size={14} />
                {t("res.notion")}
              </a>
            </div>
          )}

          {/* Blog Section — Card Style */}
          {(activeTab === "all" || activeTab === "blog") && blogs.length > 0 && (
            <div>
              {activeTab === "all" && (
                <h3
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: "#22d3ee", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <BookOpen size={20} />
                  {t("res.blog")}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogs.map((blog) => (
                  <motion.a
                    key={blog.id}
                    href={blog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group block overflow-hidden transition-all"
                    style={{
                      background: "rgba(15,15,35,0.6)",
                      border: "1px solid rgba(34,211,238,0.12)",
                      borderRadius: "12px",
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      {blog.thumbnailUrl ? (
                        <img
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))" }}
                        >
                          <BookOpen size={40} style={{ color: "rgba(34,211,238,0.3)" }} />
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "linear-gradient(180deg, transparent 50%, rgba(10,14,26,0.8) 100%)",
                        }}
                      />
                      {/* Platform badge */}
                      {blog.platform && (
                        <span
                          className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold rounded-full"
                          style={{
                            background: "rgba(0,0,0,0.6)",
                            backdropFilter: "blur(8px)",
                            color: "rgba(226,232,240,0.8)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {blog.platform}
                        </span>
                      )}
                      <LangBadge
                        lang={blog.lang}
                        className="absolute top-3 right-3"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h4
                        className="text-sm font-semibold line-clamp-2 mb-1.5 group-hover:text-cyan-300 transition-colors"
                        style={{ color: "rgba(226,232,240,0.95)" }}
                      >
                        {blog.title}
                      </h4>
                      {blog.description && (
                        <p
                          className="text-xs line-clamp-2 mb-3"
                          style={{ color: "rgba(226,232,240,0.45)" }}
                        >
                          {blog.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: "rgba(226,232,240,0.35)" }}>
                          {formatDate(blog.createdAt)}
                        </span>
                        <span
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: "#22d3ee" }}
                        >
                          {t("res.readMore")}
                          <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          )}

          {/* Video Section */}
          {(activeTab === "all" || activeTab === "video") && videos.length > 0 && (
            <div>
              {activeTab === "all" && (
                <h3
                  className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ color: "#a855f7", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <Play size={20} />
                  {t("res.video")}
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="overflow-hidden"
                    style={{
                      background: "rgba(15,15,35,0.6)",
                      border: "1px solid rgba(168,85,247,0.12)",
                      borderRadius: "12px",
                    }}
                  >
                    {video.youtubeId ? (
                      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                          style={{ border: "none" }}
                        />
                      </div>
                    ) : video.thumbnailUrl ? (
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-full overflow-hidden group"
                        style={{ aspectRatio: "16/9" }}
                      >
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                          <div
                            className="w-14 h-14 flex items-center justify-center rounded-full"
                            style={{ background: "rgba(168,85,247,0.8)" }}
                          >
                            <Play size={24} className="text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </a>
                    ) : null}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4
                            className="text-sm font-semibold truncate"
                            style={{ color: "rgba(226,232,240,0.95)" }}
                          >
                            {video.title}
                          </h4>
                          {video.description && (
                            <p className="text-xs mt-1 truncate" style={{ color: "rgba(226,232,240,0.4)" }}>
                              {video.description}
                            </p>
                          )}
                        </div>
                        <LangBadge lang={video.lang} className="ml-2" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <a
                href="https://www.youtube.com/@BROCommunity2025"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-4 py-2.5 text-sm font-medium transition-all"
                style={{
                  background: "rgba(168,85,247,0.06)",
                  border: "1px solid rgba(168,85,247,0.15)",
                  borderRadius: "8px",
                  color: "#a855f7",
                }}
              >
                <ExternalLink size={14} />
                YouTube Channel
              </a>
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
}

/** Small language badge component */
function LangBadge({ lang, className = "" }: { lang: string; className?: string }) {
  const c = getLangBadgeColor(lang);
  return (
    <span
      className={`inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded ${className}`}
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {lang.toUpperCase()}
    </span>
  );
}
