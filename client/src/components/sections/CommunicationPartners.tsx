/*
 * CommunicationPartners — Referral Contact Cards + Public Contact Registration + CS Support
 * Contact registration NO LONGER requires login — just name + various contact methods.
 * Only 1 partner is displayed (latest registered). Card is displayed larger.
 * After registration, partner list auto-refreshes.
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Users, UserPlus, X, Headphones, Send, CheckCircle, Copy, Check, ExternalLink, Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const PARTNER_I18N: Record<string, Record<string, string>> = {
  "partner.badge": { ko: "COMMUNICATION", en: "COMMUNICATION", zh: "沟通", ja: "コミュニケーション", vi: "LIÊN LẠC", th: "การสื่อสาร" },
  "partner.title": { ko: "소통 파트너", en: "Communication Partners", zh: "沟通伙伴", ja: "コミュニケーションパートナー", vi: "Đối tác liên lạc", th: "พาร์ทเนอร์สื่อสาร" },
  "partner.subtitle": { ko: "추천인에게 직접 연락하여 자세한 안내를 받으세요", en: "Contact our partners directly for detailed guidance", zh: "直接联系合作伙伴获取详细指导", ja: "パートナーに直接連絡して詳しいガイダンスを受けてください", vi: "Liên hệ trực tiếp với đối tác để được hướng dẫn chi tiết", th: "ติดต่อพาร์ทเนอร์โดยตรงเพื่อรับคำแนะนำโดยละเอียด" },
  "partner.noPartners": { ko: "등록된 파트너가 없습니다", en: "No partners registered yet", zh: "暂无合作伙伴", ja: "パートナーはまだ登録されていません", vi: "Chưa có đối tác", th: "ยังไม่มีพาร์ทเนอร์" },
  "partner.registerBtn": { ko: "내 연락처 등록", en: "Register My Contact", zh: "注册我的联系方式", ja: "連絡先を登録", vi: "Đăng ký liên hệ", th: "ลงทะเบียนข้อมูลติดต่อ" },
  "partner.csBtn": { ko: "CS 문의하기", en: "Contact Support", zh: "联系客服", ja: "サポートに問い合わせ", vi: "Liên hệ hỗ trợ", th: "ติดต่อฝ่ายสนับสนุน" },
  "cs.title": { ko: "CS 문의", en: "Customer Support", zh: "客服咨询", ja: "カスタマーサポート", vi: "Hỗ trợ khách hàng", th: "ฝ่ายสนับสนุนลูกค้า" },
  "cs.subtitle": { ko: "문의사항을 남겨주시면 빠르게 답변드리겠습니다", en: "Leave your inquiry and we'll respond promptly", zh: "留下您的咨询，我们会尽快回复", ja: "お問い合わせを残していただければ、迅速にお答えします", vi: "Để lại câu hỏi và chúng tôi sẽ phản hồi nhanh chóng", th: "ฝากคำถามของคุณแล้วเราจะตอบกลับอย่างรวดเร็ว" },
  "cs.name": { ko: "이름", en: "Name", zh: "姓名", ja: "名前", vi: "Tên", th: "ชื่อ" },
  "cs.contact": { ko: "연락처 (선택)", en: "Contact (optional)", zh: "联系方式（选填）", ja: "連絡先（任意）", vi: "Liên hệ (tùy chọn)", th: "ข้อมูลติดต่อ (ไม่บังคับ)" },
  "cs.category": { ko: "카테고리", en: "Category", zh: "类别", ja: "カテゴリ", vi: "Danh mục", th: "หมวดหมู่" },
  "cs.subject": { ko: "제목", en: "Subject", zh: "主题", ja: "件名", vi: "Tiêu đề", th: "หัวข้อ" },
  "cs.message": { ko: "문의 내용", en: "Message", zh: "咨询内容", ja: "お問い合わせ内容", vi: "Nội dung", th: "ข้อความ" },
  "cs.submit": { ko: "문의 접수", en: "Submit Inquiry", zh: "提交咨询", ja: "問い合わせ送信", vi: "Gửi yêu cầu", th: "ส่งคำถาม" },
  "cs.success": { ko: "문의가 접수되었습니다!", en: "Inquiry submitted!", zh: "咨询已提交！", ja: "お問い合わせが送信されました！", vi: "Đã gửi yêu cầu!", th: "ส่งคำถามแล้ว!" },
  "cs.ticketNo": { ko: "접수번호", en: "Ticket No", zh: "工单号", ja: "チケット番号", vi: "Số vé", th: "หมายเลขตั๋ว" },
};

const CATEGORIES = [
  { value: "general", labels: { ko: "일반 문의", en: "General", zh: "一般咨询", ja: "一般", vi: "Chung", th: "ทั่วไป" } },
  { value: "technical", labels: { ko: "기술 지원", en: "Technical", zh: "技术支持", ja: "技術", vi: "Kỹ thuật", th: "เทคนิค" } },
  { value: "billing", labels: { ko: "결제/수익", en: "Billing", zh: "付款/收益", ja: "決済/収益", vi: "Thanh toán", th: "การชำระเงิน" } },
  { value: "partnership", labels: { ko: "파트너십", en: "Partnership", zh: "合作", ja: "パートナーシップ", vi: "Đối tác", th: "พาร์ทเนอร์" } },
  { value: "other", labels: { ko: "기타", en: "Other", zh: "其他", ja: "その他", vi: "Khác", th: "อื่นๆ" } },
];

interface PartnerItem {
  id: number; name: string; description: string | null;
  phone: string | null; telegram: string | null; kakao: string | null;
  openKakaoChat: string | null;
  whatsapp: string | null; wechat: string | null;
  personalCommunity: string | null;
  avatarUrl: string | null;
}

// ===== Copy Button Component =====
function CopyBtn({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded transition-colors" title={`Copy ${label}`}
      style={{ color: copied ? "#22c55e" : "rgba(226,232,240,0.4)" }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

// ===== Messenger configs with copy support =====
const MESSENGER_CONFIGS: { key: keyof PartnerItem; label: string; color: string; bgColor: string; borderColor: string; getUrl: (v: string) => string | null; icon: string; copyable: boolean }[] = [
  { key: "openKakaoChat", label: "오픈카카오", color: "#FEE500", bgColor: "rgba(254,229,0,0.08)", borderColor: "rgba(254,229,0,0.2)", getUrl: (v) => v.startsWith("http") ? v : `https://open.kakao.com/o/${v}`, icon: "💬", copyable: true },
  { key: "kakao", label: "카카오ID", color: "#FEE500", bgColor: "rgba(254,229,0,0.08)", borderColor: "rgba(254,229,0,0.2)", getUrl: () => null, icon: "💛", copyable: true },
  { key: "telegram", label: "Telegram", color: "#2AABEE", bgColor: "rgba(42,171,238,0.1)", borderColor: "rgba(42,171,238,0.2)", getUrl: (v) => `https://t.me/${v.replace("@", "")}`, icon: "✈️", copyable: true },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", bgColor: "rgba(37,211,102,0.1)", borderColor: "rgba(37,211,102,0.2)", getUrl: (v) => `https://wa.me/${v.replace(/[^0-9+]/g, "")}`, icon: "📱", copyable: true },
  { key: "wechat", label: "WeChat", color: "#07C160", bgColor: "rgba(7,193,96,0.1)", borderColor: "rgba(7,193,96,0.2)", getUrl: () => null, icon: "💚", copyable: true },
  { key: "phone", label: "Phone", color: "#00f5ff", bgColor: "rgba(0,245,255,0.08)", borderColor: "rgba(0,245,255,0.15)", getUrl: (v) => `tel:${v}`, icon: "📞", copyable: true },
];

// ===== Community link configs =====
interface CommunityLinks {
  band?: string;
  blog?: string;
  webpage?: string;
  social?: string;
}

const COMMUNITY_CONFIGS: { key: keyof CommunityLinks; label: string; icon: string; color: string }[] = [
  { key: "band", label: "밴드", icon: "🎵", color: "#00C73C" },
  { key: "blog", label: "블로그", icon: "📝", color: "#a855f7" },
  { key: "webpage", label: "웹페이지", icon: "🌐", color: "#00f5ff" },
  { key: "social", label: "소셜", icon: "👥", color: "#f97316" },
];

// ===== ENLARGED Partner Card (single partner, full width) =====
function PartnerCard({ partner }: { partner: PartnerItem }) {
  const initials = partner.name.split(/[\s()（）]+/).filter(Boolean).map(w => w[0]).join("").substring(0, 2).toUpperCase();
  
  // Parse community links
  let community: CommunityLinks = {};
  try {
    if (partner.personalCommunity) community = JSON.parse(partner.personalCommunity);
  } catch {}

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="rounded-2xl overflow-hidden relative w-full max-w-2xl mx-auto"
      style={{ background: "linear-gradient(145deg, rgba(10,14,26,0.85), rgba(15,20,40,0.9))", border: "1px solid rgba(0,245,255,0.15)", boxShadow: "0 4px 30px rgba(0,245,255,0.06)" }}>
      <div className="p-6 sm:p-8">
        {/* Header - Avatar + Name */}
        <div className="flex items-center gap-4 mb-5">
          {partner.avatarUrl ? (
            <img src={partner.avatarUrl} alt={partner.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" style={{ border: "2px solid rgba(0,245,255,0.2)" }} />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold"
              style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(168,85,247,0.15))", border: "2px solid rgba(0,245,255,0.2)", color: "#00f5ff" }}>
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold truncate" style={{ color: "rgba(226,232,240,0.95)", fontFamily: "'Space Grotesk', sans-serif" }}>{partner.name}</h3>
            {partner.description && <p className="text-sm mt-1" style={{ color: "rgba(226,232,240,0.5)" }}>{partner.description}</p>}
          </div>
        </div>

        {/* Messenger buttons with copy - larger */}
        <div className="flex flex-wrap gap-2.5 mb-3">
          {MESSENGER_CONFIGS.map(cfg => {
            const value = partner[cfg.key] as string | null;
            if (!value) return null;
            const url = cfg.getUrl(value);
            return (
              <div key={cfg.key} className="inline-flex items-center gap-1 rounded-xl text-sm font-semibold"
                style={{ background: cfg.bgColor, border: `1px solid ${cfg.borderColor}` }}>
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2"
                    style={{ color: cfg.color }}>
                    <span>{cfg.icon}</span> {cfg.label}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2" style={{ color: cfg.color }}>
                    <span>{cfg.icon}</span> {cfg.label}
                  </span>
                )}
                <CopyBtn value={value} label={cfg.label} />
              </div>
            );
          })}
        </div>

        {/* Community links */}
        {Object.keys(community).some(k => community[k as keyof CommunityLinks]) && (
          <div className="flex flex-wrap gap-2.5 mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,245,255,0.06)" }}>
            {COMMUNITY_CONFIGS.map(cfg => {
              const url = community[cfg.key];
              if (!url) return null;
              return (
                <a key={cfg.key} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.12)", color: cfg.color }}>
                  <span>{cfg.icon}</span> {cfg.label}
                  <ExternalLink size={10} />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ========== Public Contact Registration Modal (no login required) ==========
function MyContactModal({ onClose, onRegistered, lang, bt }: { onClose: () => void; onRegistered: () => void; lang: string; bt: (k: string) => string }) {
  const utils = trpc.useUtils();
  const registerMutation = trpc.myContact.register.useMutation({
    onSuccess: () => {
      setSaved(true);
      // Invalidate partner list so it auto-refreshes
      utils.partners.list.invalidate();
      // Call onRegistered callback
      setTimeout(() => {
        onRegistered();
        onClose();
      }, 1500);
    },
  });

  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    description: "",
    openKakaoChat: "",
    kakao: "",
    telegram: "",
    whatsapp: "",
    wechat: "",
    communityBand: "",
    communityBlog: "",
    communityWebpage: "",
    communitySocial: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    const personalCommunity: CommunityLinks = {};
    if (form.communityBand.trim()) personalCommunity.band = form.communityBand.trim();
    if (form.communityBlog.trim()) personalCommunity.blog = form.communityBlog.trim();
    if (form.communityWebpage.trim()) personalCommunity.webpage = form.communityWebpage.trim();
    if (form.communitySocial.trim()) personalCommunity.social = form.communitySocial.trim();

    registerMutation.mutate({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      description: form.description.trim() || null,
      openKakaoChat: form.openKakaoChat.trim() || null,
      kakao: form.kakao.trim() || null,
      telegram: form.telegram.trim() || null,
      whatsapp: form.whatsapp.trim() || null,
      wechat: form.wechat.trim() || null,
      personalCommunity: Object.keys(personalCommunity).length > 0 ? JSON.stringify(personalCommunity) : null,
    });
  };

  const inputStyle = "w-full px-3 py-2.5 rounded-lg text-sm bg-[rgba(10,14,26,0.8)] border border-[rgba(0,245,255,0.15)] text-[rgba(226,232,240,0.9)] placeholder:text-[rgba(226,232,240,0.25)] focus:outline-none focus:border-[rgba(0,245,255,0.4)]";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "rgba(15,20,35,0.98)", border: "1px solid rgba(0,245,255,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,245,255,0.1)]">
          <div className="flex items-center gap-2">
            <UserPlus size={18} style={{ color: "#00f5ff" }} />
            <h3 className="font-bold text-sm" style={{ color: "rgba(226,232,240,0.95)" }}>{bt("partner.registerBtn")}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[rgba(0,245,255,0.1)] transition-colors">
            <X size={16} style={{ color: "rgba(226,232,240,0.5)" }} />
          </button>
        </div>

        {saved ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "#00f5ff" }} />
            <p className="font-bold" style={{ color: "rgba(226,232,240,0.95)" }}>등록 완료!</p>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.5)" }}>연락처가 등록되었습니다. 자동으로 새로고침됩니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <p className="text-xs mb-2" style={{ color: "rgba(226,232,240,0.4)" }}>
              로그인 없이 간편하게 등록할 수 있습니다. 등록 시 추천자 연락처가 내 연락처로 교체됩니다.
            </p>

            {/* Basic Info */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold" style={{ color: "#00f5ff" }}>기본 정보</p>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>이름 *</label>
                <input className={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="표시될 이름" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>📞 전화번호</label>
                <input className={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+82-10-1234-5678" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>간단한 소개</label>
                <textarea className={`${inputStyle} resize-none`} rows={2} value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="간단한 자기소개를 작성해주세요" />
              </div>
            </div>

            {/* Messenger Info */}
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
              <p className="text-[11px] font-semibold" style={{ color: "#00f5ff" }}>연락 수단 (복사 버튼으로 쉽게 공유)</p>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>💬 오픈카카오채팅방 주소</label>
                <input className={inputStyle} value={form.openKakaoChat} onChange={e => setForm(f => ({ ...f, openKakaoChat: e.target.value }))} placeholder="https://open.kakao.com/o/..." />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>💛 개인 카카오아이디</label>
                <input className={inputStyle} value={form.kakao} onChange={e => setForm(f => ({ ...f, kakao: e.target.value }))} placeholder="카카오톡 ID" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>✈️ 개인 텔레그램 아이디</label>
                <input className={inputStyle} value={form.telegram} onChange={e => setForm(f => ({ ...f, telegram: e.target.value }))} placeholder="@username" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>📱 왓츠앱</label>
                <input className={inputStyle} value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="+82-10-1234-5678" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>💚 위챗 아이디</label>
                <input className={inputStyle} value={form.wechat} onChange={e => setForm(f => ({ ...f, wechat: e.target.value }))} placeholder="WeChat ID" />
              </div>
            </div>

            {/* Community Links */}
            <div className="space-y-2 pt-2" style={{ borderTop: "1px solid rgba(0,245,255,0.08)" }}>
              <p className="text-[11px] font-semibold" style={{ color: "#a855f7" }}>개인 커뮤니티 (클릭 시 자동 이동)</p>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>🎵 밴드</label>
                <input className={inputStyle} value={form.communityBand} onChange={e => setForm(f => ({ ...f, communityBand: e.target.value }))} placeholder="https://band.us/..." />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>📝 블로그</label>
                <input className={inputStyle} value={form.communityBlog} onChange={e => setForm(f => ({ ...f, communityBlog: e.target.value }))} placeholder="https://blog.naver.com/..." />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>🌐 웹페이지</label>
                <input className={inputStyle} value={form.communityWebpage} onChange={e => setForm(f => ({ ...f, communityWebpage: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>👥 개인소셜 (인스타/페이스북 등)</label>
                <input className={inputStyle} value={form.communitySocial} onChange={e => setForm(f => ({ ...f, communitySocial: e.target.value }))} placeholder="https://instagram.com/..." />
              </div>
            </div>

            <button type="submit" disabled={registerMutation.isPending}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(0,245,255,0.3)", color: "#00f5ff" }}>
              {registerMutation.isPending ? "등록 중..." : "등록하기"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ========== CS Support Modal ==========
function CsSupportModal({ onClose, lang, bt }: { onClose: () => void; lang: string; bt: (k: string) => string }) {
  const submitMutation = trpc.cs.submit.useMutation({
    onSuccess: (data) => { setTicketNo(data.ticketNo); setSubmitted(true); },
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState("");
  const [form, setForm] = useState({ name: "", contact: "", category: "general", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim() || !form.message.trim()) return;
    submitMutation.mutate({
      name: form.name.trim(),
      contact: form.contact.trim() || undefined,
      category: form.category as any,
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
  };

  const inputStyle = "w-full px-3 py-2.5 rounded-lg text-sm bg-[rgba(10,14,26,0.8)] border border-[rgba(0,245,255,0.15)] text-[rgba(226,232,240,0.9)] placeholder:text-[rgba(226,232,240,0.25)] focus:outline-none focus:border-[rgba(0,245,255,0.4)]";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "rgba(15,20,35,0.98)", border: "1px solid rgba(168,85,247,0.2)" }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-[rgba(168,85,247,0.1)]">
          <div className="flex items-center gap-2">
            <Headphones size={18} style={{ color: "#a855f7" }} />
            <h3 className="font-bold text-sm" style={{ color: "rgba(226,232,240,0.95)" }}>{bt("cs.title")}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[rgba(168,85,247,0.1)] transition-colors">
            <X size={16} style={{ color: "rgba(226,232,240,0.5)" }} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle size={48} className="mx-auto mb-3" style={{ color: "#a855f7" }} />
            <p className="font-bold" style={{ color: "rgba(226,232,240,0.95)" }}>{bt("cs.success")}</p>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.5)" }}>{bt("cs.ticketNo")}: {ticketNo}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <p className="text-xs mb-2" style={{ color: "rgba(226,232,240,0.4)" }}>{bt("cs.subtitle")}</p>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>{bt("cs.name")} *</label>
              <input className={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="이름" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>{bt("cs.contact")}</label>
              <input className={inputStyle} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="연락처 (전화번호, 이메일 등)" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>{bt("cs.category")}</label>
              <select className={inputStyle} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.labels[lang as keyof typeof cat.labels] || cat.labels.en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>{bt("cs.subject")} *</label>
              <input className={inputStyle} value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required placeholder="문의 제목" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>{bt("cs.message")} *</label>
              <textarea className={`${inputStyle} resize-none`} rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required placeholder="문의 내용을 상세히 작성해주세요" />
            </div>
            <button type="submit" disabled={submitMutation.isPending}
              className="w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,245,255,0.2))", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7" }}>
              <Send size={14} />
              {submitMutation.isPending ? "접수 중..." : bt("cs.submit")}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ========== Main Component ==========
export default function CommunicationPartners() {
  const { lang } = useApp();
  const [showMyContact, setShowMyContact] = useState(false);
  const [showCs, setShowCs] = useState(false);

  const bt = (key: string) => {
    const entry = PARTNER_I18N[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  };

  const { data: apiPartners } = trpc.partners.list.useQuery(undefined, { retry: 1, refetchInterval: 60000 });
  const partners: PartnerItem[] = apiPartners && apiPartners.length > 0 ? apiPartners : [];

  const handleRegistered = () => {
    // Partner list will auto-refresh via invalidation in the modal
  };

  return (
    <SectionWrapper id="partners">
      <SectionTitle badge={bt("partner.badge")} title={bt("partner.title")} subtitle={bt("partner.subtitle")} />

      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button onClick={() => setShowMyContact(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all"
            style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.1), rgba(0,245,255,0.05))", border: "1px solid rgba(0,245,255,0.25)", color: "#00f5ff" }}>
            <UserPlus size={18} />
            {bt("partner.registerBtn")}
          </button>
          <button onClick={() => setShowCs(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-bold transition-all"
            style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(168,85,247,0.05))", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}>
            <Headphones size={18} />
            {bt("partner.csBtn")}
          </button>
        </div>

        {/* Partner Card - single, large */}
        {partners.length > 0 ? (
          <div>
            <PartnerCard partner={partners[0]} />
          </div>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4" style={{ color: "rgba(226,232,240,0.2)" }} />
            <p style={{ color: "rgba(226,232,240,0.4)" }}>{bt("partner.noPartners")}</p>
            <p className="text-xs mt-2" style={{ color: "rgba(226,232,240,0.25)" }}>
              위의 '내 연락처 등록' 버튼을 눌러 첫 번째 파트너가 되어보세요!
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showMyContact && <MyContactModal onClose={() => setShowMyContact(false)} onRegistered={handleRegistered} lang={lang} bt={bt} />}
        {showCs && <CsSupportModal onClose={() => setShowCs(false)} lang={lang} bt={bt} />}
      </AnimatePresence>
    </SectionWrapper>
  );
}
