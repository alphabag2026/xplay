/*
 * MediaGallerySection — Telegram Media Gallery
 * Displays media (images/videos) shared via Telegram bot
 * For now, shows curated XPLAY-related content with placeholder structure
 * Ready for future Telegram bot integration
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Image as ImageIcon, ExternalLink, MessageCircle, X } from "lucide-react";

// Sample media items (would come from Telegram bot in production)
const MEDIA_ITEMS = [
  {
    id: "1",
    type: "video" as const,
    thumbnail: "https://img.youtube.com/vi/fzsxiru7hAw/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/fzsxiru7hAw",
    title: "X Play Movie 소개영상",
    source: "Telegram @xplayplatform_official",
    date: "2025-12-15",
  },
  {
    id: "2",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
    title: "XPLAY AI Trading Dashboard",
    source: "Telegram @xplayplatform_official",
    date: "2025-12-20",
  },
  {
    id: "3",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=300&fit=crop",
    title: "BTC Prediction Game Live",
    source: "Telegram @BROCommunity",
    date: "2026-01-05",
  },
  {
    id: "4",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop",
    title: "XPLAY Global Community Meetup",
    source: "Telegram @xplayplatform_official",
    date: "2026-01-15",
  },
  {
    id: "5",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop",
    title: "Token Mixing Engine Architecture",
    source: "Telegram @BROCommunity",
    date: "2026-02-01",
  },
  {
    id: "6",
    type: "image" as const,
    thumbnail: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=300&fit=crop",
    title: "XPLAY Revenue Report Q1 2026",
    source: "Telegram @xplayplatform_official",
    date: "2026-03-01",
  },
];

export default function MediaGallerySection() {
  const { t } = useApp();
  const [selectedMedia, setSelectedMedia] = useState<typeof MEDIA_ITEMS[number] | null>(null);

  return (
    <SectionWrapper id="media-gallery">
      <SectionTitle
        badge={t("media.badge")}
        title={t("media.title")}
        subtitle={t("media.subtitle")}
      />

      {/* Telegram Channel Link */}
      <div
        className="flex items-center justify-between p-4 mb-6"
        style={{
          background: "rgba(0,136,204,0.08)",
          border: "1px solid rgba(0,136,204,0.2)",
          borderRadius: "10px",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,136,204,0.15)" }}
          >
            <MessageCircle size={18} style={{ color: "#0088cc" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#0088cc" }}>
              @xplayplatform_official
            </p>
            <p className="text-[11px]" style={{ color: "rgba(226,232,240,0.5)" }}>
              {t("media.telegram.desc")}
            </p>
          </div>
        </div>
        <a
          href="https://t.me/xplayplatform_official"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-xs font-bold transition-all"
          style={{
            background: "#0088cc",
            color: "#fff",
            borderRadius: "8px",
          }}
        >
          {t("media.telegram.join")}
        </a>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MEDIA_ITEMS.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer group"
            onClick={() => setSelectedMedia(item)}
          >
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: "10px",
                aspectRatio: "4/3",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(10,14,26,0.6)" }}
              >
                {item.type === "video" ? (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.9)" }}
                  >
                    <Play size={20} fill="#fff" style={{ color: "#fff" }} />
                  </div>
                ) : (
                  <ImageIcon size={24} style={{ color: "#00f5ff" }} />
                )}
              </div>
              {/* Type badge */}
              {item.type === "video" && (
                <div
                  className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded"
                  style={{ background: "rgba(239,68,68,0.9)", color: "#fff" }}
                >
                  VIDEO
                </div>
              )}
            </div>
            <p
              className="text-xs mt-2 truncate"
              style={{ color: "rgba(226,232,240,0.7)" }}
            >
              {item.title}
            </p>
            <p className="text-[10px]" style={{ color: "rgba(226,232,240,0.3)" }}>
              {item.source}
            </p>
          </motion.div>
        ))}
      </div>

      {/* View More */}
      <div className="text-center mt-6">
        <a
          href="https://t.me/xplayplatform_official"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-all"
          style={{
            background: "rgba(0,245,255,0.06)",
            border: "1px solid rgba(0,245,255,0.15)",
            borderRadius: "8px",
            color: "#00f5ff",
          }}
        >
          <ExternalLink size={14} />
          {t("media.viewmore")}
        </a>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute -top-10 right-0 p-2"
                style={{ color: "rgba(226,232,240,0.7)" }}
              >
                <X size={24} />
              </button>

              {selectedMedia.type === "video" && selectedMedia.embedUrl ? (
                <div
                  className="w-full overflow-hidden"
                  style={{ borderRadius: "12px", aspectRatio: "16/9" }}
                >
                  <iframe
                    src={selectedMedia.embedUrl}
                    title={selectedMedia.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
              ) : (
                <img
                  src={selectedMedia.thumbnail}
                  alt={selectedMedia.title}
                  className="w-full object-contain"
                  style={{ borderRadius: "12px", maxHeight: "80vh" }}
                />
              )}

              <div className="mt-3">
                <p className="text-sm font-medium" style={{ color: "rgba(226,232,240,0.9)" }}>
                  {selectedMedia.title}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(226,232,240,0.4)" }}>
                  {selectedMedia.source} · {selectedMedia.date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}
