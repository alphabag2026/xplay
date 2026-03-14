/*
 * CommunicationPartners — Referral Contact Cards
 * Shows partner contacts with messaging platform buttons
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

const PARTNER_I18N: Record<string, Record<string, string>> = {
  "partner.badge": { ko: "COMMUNICATION", en: "COMMUNICATION", zh: "沟通", ja: "コミュニケーション", vi: "LIÊN LẠC", th: "การสื่อสาร" },
  "partner.title": { ko: "소통 파트너", en: "Communication Partners", zh: "沟通伙伴", ja: "コミュニケーションパートナー", vi: "Đối tác liên lạc", th: "พาร์ทเนอร์สื่อสาร" },
  "partner.subtitle": { ko: "추천인에게 직접 연락하여 자세한 안내를 받으세요", en: "Contact our partners directly for detailed guidance", zh: "直接联系合作伙伴获取详细指导", ja: "パートナーに直接連絡して詳しいガイダンスを受けてください", vi: "Liên hệ trực tiếp với đối tác để được hướng dẫn chi tiết", th: "ติดต่อพาร์ทเนอร์โดยตรงเพื่อรับคำแนะนำโดยละเอียด" },
  "partner.noPartners": { ko: "등록된 파트너가 없습니다", en: "No partners registered yet", zh: "暂无合作伙伴", ja: "パートナーはまだ登録されていません", vi: "Chưa có đối tác", th: "ยังไม่มีพาร์ทเนอร์" },
  "partner.telegramNote": { ko: "텔레그램 봇으로 파트너를 등록할 수 있습니다", en: "Partners can be registered via Telegram bot", zh: "可通过Telegram机器人注册合作伙伴", ja: "Telegramボットでパートナーを登録できます", vi: "Có thể đăng ký đối tác qua bot Telegram", th: "สามารถลงทะเบียนพาร์ทเนอร์ผ่านบอท Telegram" },
};

const SAMPLE_PARTNERS = [
  { id: 1, name: "김민수 (한국 총괄)", description: "XPLAY 한국 지역 총괄 파트너", phone: "+82-10-1234-5678", telegram: "@xplay_korea", kakao: "xplay_kr", whatsapp: "+821012345678", wechat: null, avatarUrl: null, isActive: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: "王小明 (中国区)", description: "XPLAY 中国区域合作伙伴", phone: null, telegram: "@xplay_china", kakao: null, whatsapp: null, wechat: "xplay_cn", avatarUrl: null, isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 3, name: "John Smith (Global)", description: "XPLAY Global Partner", phone: "+1-555-0123", telegram: "@xplay_global", kakao: null, whatsapp: "+15550123", wechat: null, avatarUrl: null, isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
];

interface PartnerItem {
  id: number; name: string; description: string | null;
  phone: string | null; telegram: string | null; kakao: string | null;
  whatsapp: string | null; wechat: string | null; avatarUrl: string | null;
}

// Messenger button configs
const MESSENGER_CONFIGS: { key: keyof PartnerItem; label: string; color: string; bgColor: string; borderColor: string; getUrl: (v: string) => string; icon: string }[] = [
  { key: "telegram", label: "Telegram", color: "#2AABEE", bgColor: "rgba(42,171,238,0.1)", borderColor: "rgba(42,171,238,0.2)", getUrl: (v) => `https://t.me/${v.replace("@", "")}`, icon: "✈️" },
  { key: "kakao", label: "KakaoTalk", color: "#FEE500", bgColor: "rgba(254,229,0,0.08)", borderColor: "rgba(254,229,0,0.2)", getUrl: (v) => `https://open.kakao.com/o/${v}`, icon: "💬" },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", bgColor: "rgba(37,211,102,0.1)", borderColor: "rgba(37,211,102,0.2)", getUrl: (v) => `https://wa.me/${v.replace(/[^0-9+]/g, "")}`, icon: "📱" },
  { key: "wechat", label: "WeChat", color: "#07C160", bgColor: "rgba(7,193,96,0.1)", borderColor: "rgba(7,193,96,0.2)", getUrl: () => "#", icon: "💚" },
  { key: "phone", label: "Phone", color: "#00f5ff", bgColor: "rgba(0,245,255,0.08)", borderColor: "rgba(0,245,255,0.15)", getUrl: (v) => `tel:${v}`, icon: "📞" },
];

function PartnerCard({ partner }: { partner: PartnerItem }) {
  const initials = partner.name.split(/[\s()（）]+/).filter(Boolean).map(w => w[0]).join("").substring(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-xl overflow-hidden"
      style={{ background: "rgba(10,14,26,0.7)", border: "1px solid rgba(0,245,255,0.1)" }}>
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          {partner.avatarUrl ? (
            <img src={partner.avatarUrl} alt={partner.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(168,85,247,0.15))", border: "1px solid rgba(0,245,255,0.2)", color: "#00f5ff" }}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold truncate" style={{ color: "rgba(226,232,240,0.95)", fontFamily: "'Space Grotesk', sans-serif" }}>{partner.name}</h3>
            {partner.description && <p className="text-xs truncate" style={{ color: "rgba(226,232,240,0.5)" }}>{partner.description}</p>}
          </div>
        </div>

        {/* Messenger Buttons */}
        <div className="flex flex-wrap gap-2">
          {MESSENGER_CONFIGS.map(cfg => {
            const value = partner[cfg.key] as string | null;
            if (!value) return null;
            return (
              <a key={cfg.key} href={cfg.getUrl(value)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                style={{ background: cfg.bgColor, border: `1px solid ${cfg.borderColor}`, color: cfg.color }}
                onClick={e => { if (cfg.key === "wechat") { e.preventDefault(); navigator.clipboard.writeText(value); alert(`WeChat ID copied: ${value}`); } }}>
                <span>{cfg.icon}</span> {cfg.label}
              </a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunicationPartners() {
  const { lang } = useApp();

  const bt = (key: string) => {
    const entry = PARTNER_I18N[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  };

  const { data: apiPartners } = trpc.partners.list.useQuery(undefined, { retry: 1, refetchInterval: 60000 });
  const partners: PartnerItem[] = apiPartners && apiPartners.length > 0 ? apiPartners : SAMPLE_PARTNERS;

  return (
    <SectionWrapper id="partners">
      <SectionTitle badge={bt("partner.badge")} title={bt("partner.title")} subtitle={bt("partner.subtitle")} />

      <div className="max-w-4xl mx-auto">
        {partners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map(partner => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Users size={48} className="mx-auto mb-4" style={{ color: "rgba(226,232,240,0.2)" }} />
            <p style={{ color: "rgba(226,232,240,0.4)" }}>{bt("partner.noPartners")}</p>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: "rgba(226,232,240,0.3)" }}>🤝 {bt("partner.telegramNote")}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}
