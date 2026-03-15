/*
 * LeaderReferralSection — Leader Recommendation Program
 * Up to $10M USD reward for recommending leaders
 * Form: recommender info, leader info, experience, team, organization, self/referral type
 */

import { useApp } from "@/contexts/AppContext";
import SectionTitle from "@/components/SectionTitle";
import SectionWrapper from "@/components/SectionWrapper";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Users, Trophy, Star, X, CheckCircle, ChevronDown, Send, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const LEADER_I18N: Record<string, Record<string, string>> = {
  "leader.badge": { ko: "LEADER PROGRAM", en: "LEADER PROGRAM", zh: "领袖计划", ja: "リーダープログラム", vi: "CHƯƠNG TRÌNH LÃNH ĐẠO", th: "โปรแกรมผู้นำ" },
  "leader.title": { ko: "리더 추천 프로그램", en: "Leader Referral Program", zh: "领袖推荐计划", ja: "リーダー紹介プログラム", vi: "Chương trình giới thiệu lãnh đạo", th: "โปรแกรมแนะนำผู้นำ" },
  "leader.subtitle": { ko: "최대 $10,000,000 USD 보상! 뛰어난 리더를 추천해주세요", en: "Up to $10,000,000 USD reward! Recommend outstanding leaders", zh: "最高$10,000,000美元奖励！推荐优秀领袖", ja: "最大$10,000,000 USD報酬！優れたリーダーを推薦してください", vi: "Phần thưởng lên đến $10,000,000 USD! Giới thiệu nhà lãnh đạo xuất sắc", th: "รางวัลสูงสุด $10,000,000 USD! แนะนำผู้นำที่โดดเด่น" },
  "leader.applyBtn": { ko: "리더 추천하기", en: "Recommend a Leader", zh: "推荐领袖", ja: "リーダーを推薦", vi: "Giới thiệu lãnh đạo", th: "แนะนำผู้นำ" },
  "leader.selfApply": { ko: "본인 추천 (자기 추천)", en: "Self Recommendation", zh: "自我推荐", ja: "自己推薦", vi: "Tự giới thiệu", th: "แนะนำตัวเอง" },
  "leader.referOther": { ko: "지인 추천", en: "Refer Someone", zh: "推荐他人", ja: "他者を推薦", vi: "Giới thiệu người khác", th: "แนะนำผู้อื่น" },
  "leader.referrerName": { ko: "추천자 이름", en: "Your Name", zh: "推荐人姓名", ja: "推薦者名", vi: "Tên người giới thiệu", th: "ชื่อผู้แนะนำ" },
  "leader.referrerContact": { ko: "추천자 연락처", en: "Your Contact", zh: "推荐人联系方式", ja: "推薦者連絡先", vi: "Liên hệ của bạn", th: "ข้อมูลติดต่อ" },
  "leader.referrerEmail": { ko: "추천자 이메일 (선택)", en: "Your Email (optional)", zh: "推荐人邮箱（选填）", ja: "推薦者メール（任意）", vi: "Email (tùy chọn)", th: "อีเมล (ไม่บังคับ)" },
  "leader.leaderName": { ko: "리더 이름", en: "Leader's Name", zh: "领袖姓名", ja: "リーダー名", vi: "Tên lãnh đạo", th: "ชื่อผู้นำ" },
  "leader.leaderContact": { ko: "리더 연락처", en: "Leader's Contact", zh: "领袖联系方式", ja: "リーダー連絡先", vi: "Liên hệ lãnh đạo", th: "ข้อมูลติดต่อผู้นำ" },
  "leader.experience": { ko: "이전 이력 / 경력", en: "Previous Experience", zh: "过往经历", ja: "過去の経歴", vi: "Kinh nghiệm trước đây", th: "ประสบการณ์ก่อนหน้า" },
  "leader.teamSize": { ko: "팀 규모 (인원수)", en: "Team Size", zh: "团队规模", ja: "チーム規模", vi: "Quy mô đội ngũ", th: "ขนาดทีม" },
  "leader.orgStructure": { ko: "조직 구성", en: "Organization Structure", zh: "组织架构", ja: "組織構成", vi: "Cơ cấu tổ chức", th: "โครงสร้างองค์กร" },
  "leader.region": { ko: "활동 지역 / 국가", en: "Region / Country", zh: "活动地区/国家", ja: "活動地域/国", vi: "Khu vực / Quốc gia", th: "ภูมิภาค / ประเทศ" },
  "leader.expertise": { ko: "주요 활동 분야", en: "Area of Expertise", zh: "主要活动领域", ja: "主な活動分野", vi: "Lĩnh vực chuyên môn", th: "สาขาความเชี่ยวชาญ" },
  "leader.introduction": { ko: "소개글 / 자기소개", en: "Introduction", zh: "介绍/自我介绍", ja: "紹介文", vi: "Giới thiệu", th: "แนะนำตัว" },
  "leader.additionalNotes": { ko: "추가 메모", en: "Additional Notes", zh: "补充说明", ja: "追加メモ", vi: "Ghi chú thêm", th: "หมายเหตุเพิ่มเติม" },
  "leader.submit": { ko: "추천서 제출", en: "Submit Referral", zh: "提交推荐", ja: "推薦を送信", vi: "Gửi giới thiệu", th: "ส่งการแนะนำ" },
  "leader.success": { ko: "리더 추천이 접수되었습니다!", en: "Leader referral submitted!", zh: "领袖推荐已提交！", ja: "リーダー推薦が送信されました！", vi: "Đã gửi giới thiệu lãnh đạo!", th: "ส่งการแนะนำผู้นำแล้ว!" },
  "leader.successMsg": { ko: "검토 후 연락드리겠습니다. 감사합니다!", en: "We will contact you after review. Thank you!", zh: "审核后会联系您，谢谢！", ja: "審査後にご連絡いたします。ありがとうございます！", vi: "Chúng tôi sẽ liên hệ sau khi xem xét. Cảm ơn bạn!", th: "เราจะติดต่อคุณหลังจากตรวจสอบ ขอบคุณ!" },
  "leader.reward1": { ko: "최대 $10,000,000", en: "Up to $10,000,000", zh: "最高$10,000,000", ja: "最大$10,000,000", vi: "Lên đến $10,000,000", th: "สูงสุด $10,000,000" },
  "leader.reward1Desc": { ko: "USD 보상금", en: "USD Reward", zh: "美元奖励", ja: "USD報酬", vi: "USD Phần thưởng", th: "รางวัล USD" },
  "leader.reward2": { ko: "글로벌 네트워크", en: "Global Network", zh: "全球网络", ja: "グローバルネットワーク", vi: "Mạng lưới toàn cầu", th: "เครือข่ายทั่วโลก" },
  "leader.reward2Desc": { ko: "전 세계 리더 연결", en: "Connect leaders worldwide", zh: "连接全球领袖", ja: "世界中のリーダーを繋ぐ", vi: "Kết nối lãnh đạo toàn cầu", th: "เชื่อมต่อผู้นำทั่วโลก" },
  "leader.reward3": { ko: "독점 혜택", en: "Exclusive Benefits", zh: "独家福利", ja: "独占特典", vi: "Quyền lợi độc quyền", th: "สิทธิพิเศษ" },
  "leader.reward3Desc": { ko: "리더 전용 프리미엄 혜택", en: "Premium benefits for leaders", zh: "领袖专属高级福利", ja: "リーダー専用プレミアム特典", vi: "Quyền lợi cao cấp cho lãnh đạo", th: "สิทธิพิเศษสำหรับผู้นำ" },
};

const EXPERTISE_OPTIONS = [
  { value: "crypto", label: "Crypto / Blockchain" },
  { value: "forex", label: "Forex / Trading" },
  { value: "mlm", label: "MLM / Network Marketing" },
  { value: "finance", label: "Finance / Investment" },
  { value: "tech", label: "Technology / IT" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "real_estate", label: "Real Estate" },
  { value: "other", label: "Other" },
];

function RewardCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-center p-5 rounded-xl"
      style={{ background: "rgba(255,215,0,0.03)", border: "1px solid rgba(255,215,0,0.12)" }}>
      <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.15))", border: "1px solid rgba(255,215,0,0.2)" }}>
        <Icon size={22} style={{ color: "#FFD700" }} />
      </div>
      <h4 className="text-sm font-bold mb-1" style={{ color: "#FFD700", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h4>
      <p className="text-xs" style={{ color: "rgba(226,232,240,0.5)" }}>{desc}</p>
    </motion.div>
  );
}

// ========== Leader Referral Form Modal ==========
function LeaderReferralModal({ onClose, lang, bt }: { onClose: () => void; lang: string; bt: (k: string) => string }) {
  const submitMutation = trpc.leaderReferral.submit.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const [submitted, setSubmitted] = useState(false);
  const [referralType, setReferralType] = useState<"self" | "acquaintance">("self");
  const [form, setForm] = useState({
    referrerName: "", referrerContact: "", referrerEmail: "",
    leaderName: "", leaderContact: "",
    previousExperience: "", teamSize: "", organizationStructure: "",
    region: "", expertise: "", introduction: "", additionalNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.referrerName.trim() || !form.referrerContact.trim()) return;
    submitMutation.mutate({
      referralType,
      referrerName: form.referrerName,
      referrerContact: form.referrerContact,
      referrerEmail: form.referrerEmail || null,
      leaderName: referralType === "acquaintance" ? (form.leaderName || null) : null,
      leaderContact: referralType === "acquaintance" ? (form.leaderContact || null) : null,
      previousExperience: form.previousExperience || null,
      teamSize: form.teamSize || null,
      organizationStructure: form.organizationStructure || null,
      region: form.region || null,
      expertise: form.expertise || null,
      introduction: form.introduction || null,
      additionalNotes: form.additionalNotes || null,
    });
  };

  const inputStyle = "w-full px-3 py-2.5 rounded-lg text-sm bg-[rgba(10,14,26,0.8)] border border-[rgba(255,215,0,0.12)] text-[rgba(226,232,240,0.9)] placeholder:text-[rgba(226,232,240,0.25)] focus:outline-none focus:border-[rgba(255,215,0,0.35)]";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "rgba(15,20,35,0.98)", border: "1px solid rgba(255,215,0,0.2)" }}
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(255,215,0,0.1)]"
          style={{ background: "linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,165,0,0.03))" }}>
          <div className="flex items-center gap-2">
            <Crown size={20} style={{ color: "#FFD700" }} />
            <h3 className="font-bold text-sm" style={{ color: "#FFD700", fontFamily: "'Space Grotesk', sans-serif" }}>
              {bt("leader.applyBtn")}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[rgba(255,215,0,0.1)] transition-colors">
            <X size={16} style={{ color: "rgba(226,232,240,0.5)" }} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle size={48} className="mx-auto" style={{ color: "#FFD700" }} />
            <p className="font-bold" style={{ color: "rgba(226,232,240,0.95)" }}>{bt("leader.success")}</p>
            <p className="text-sm" style={{ color: "rgba(226,232,240,0.5)" }}>{bt("leader.successMsg")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Referral Type Toggle */}
            <div>
              <label className="text-xs font-medium mb-2 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                추천 유형 *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setReferralType("self")}
                  className="py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: referralType === "self" ? "rgba(255,215,0,0.15)" : "rgba(10,14,26,0.5)",
                    border: referralType === "self" ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,215,0,0.1)",
                    color: referralType === "self" ? "#FFD700" : "rgba(226,232,240,0.5)",
                  }}>
                  {bt("leader.selfApply")}
                </button>
                <button type="button" onClick={() => setReferralType("acquaintance")}
                  className="py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: referralType === "acquaintance" ? "rgba(255,215,0,0.15)" : "rgba(10,14,26,0.5)",
                    border: referralType === "acquaintance" ? "1px solid rgba(255,215,0,0.4)" : "1px solid rgba(255,215,0,0.1)",
                    color: referralType === "acquaintance" ? "#FFD700" : "rgba(226,232,240,0.5)",
                  }}>
                  {bt("leader.referOther")}
                </button>
              </div>
            </div>

            {/* Referrer Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.6)" }}>
                {referralType === "self" ? "본인 정보" : "추천자 정보"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {bt("leader.referrerName")} *
                  </label>
                  <input className={inputStyle} value={form.referrerName}
                    onChange={e => setForm(f => ({ ...f, referrerName: e.target.value }))} required placeholder="이름" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {bt("leader.referrerContact")} *
                  </label>
                  <input className={inputStyle} value={form.referrerContact}
                    onChange={e => setForm(f => ({ ...f, referrerContact: e.target.value }))} required placeholder="전화/텔레그램/카카오" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {bt("leader.referrerEmail")}
                </label>
                <input className={inputStyle} type="email" value={form.referrerEmail}
                  onChange={e => setForm(f => ({ ...f, referrerEmail: e.target.value }))} placeholder="email@example.com" />
              </div>
            </div>

            {/* Leader Info (only for acquaintance referral) */}
            <AnimatePresence>
              {referralType === "acquaintance" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden">
                  <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.6)" }}>
                    추천 리더 정보
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                        {bt("leader.leaderName")}
                      </label>
                      <input className={inputStyle} value={form.leaderName}
                        onChange={e => setForm(f => ({ ...f, leaderName: e.target.value }))} placeholder="리더 이름" />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                        {bt("leader.leaderContact")}
                      </label>
                      <input className={inputStyle} value={form.leaderContact}
                        onChange={e => setForm(f => ({ ...f, leaderContact: e.target.value }))} placeholder="리더 연락처" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Experience & Team */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.6)" }}>
                경력 및 조직 정보
              </h4>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {bt("leader.experience")}
                </label>
                <textarea className={`${inputStyle} resize-none`} rows={3} value={form.previousExperience}
                  onChange={e => setForm(f => ({ ...f, previousExperience: e.target.value }))}
                  placeholder="이전 경력, 활동 이력, 성과 등을 자유롭게 작성해주세요" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {bt("leader.teamSize")}
                  </label>
                  <input className={inputStyle} value={form.teamSize}
                    onChange={e => setForm(f => ({ ...f, teamSize: e.target.value }))} placeholder="예: 50명, 100+명" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                    {bt("leader.region")}
                  </label>
                  <input className={inputStyle} value={form.region}
                    onChange={e => setForm(f => ({ ...f, region: e.target.value }))} placeholder="예: 한국, 동남아시아" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {bt("leader.orgStructure")}
                </label>
                <textarea className={`${inputStyle} resize-none`} rows={2} value={form.organizationStructure}
                  onChange={e => setForm(f => ({ ...f, organizationStructure: e.target.value }))}
                  placeholder="조직의 구성, 팀 구조, 운영 방식 등" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {bt("leader.expertise")}
                </label>
                <select className={inputStyle} value={form.expertise}
                  onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}>
                  <option value="">선택해주세요</option>
                  {EXPERTISE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Introduction & Notes */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,215,0,0.6)" }}>
                소개 및 추가 정보
              </h4>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {bt("leader.introduction")}
                </label>
                <textarea className={`${inputStyle} resize-none`} rows={4} value={form.introduction}
                  onChange={e => setForm(f => ({ ...f, introduction: e.target.value }))}
                  placeholder="본인 또는 추천 리더에 대한 상세한 소개를 작성해주세요. 경력, 성과, 비전 등을 포함하면 좋습니다." />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(226,232,240,0.6)" }}>
                  {bt("leader.additionalNotes")}
                </label>
                <textarea className={`${inputStyle} resize-none`} rows={2} value={form.additionalNotes}
                  onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))}
                  placeholder="추가로 전달하고 싶은 내용이 있으면 작성해주세요" />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={submitMutation.isPending}
              className="w-full py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.15))",
                border: "1px solid rgba(255,215,0,0.35)",
                color: "#FFD700",
              }}>
              <Send size={14} />
              {submitMutation.isPending ? "제출 중..." : bt("leader.submit")}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ========== Main Section ==========
export default function LeaderReferralSection() {
  const { lang } = useApp();
  const [showModal, setShowModal] = useState(false);

  const bt = (key: string) => {
    const entry = LEADER_I18N[key];
    if (!entry) return key;
    return entry[lang] || entry["en"] || key;
  };

  return (
    <SectionWrapper id="leader-referral">
      <SectionTitle badge={bt("leader.badge")} title={bt("leader.title")} subtitle={bt("leader.subtitle")} />

      <div className="max-w-4xl mx-auto">
        {/* Reward Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <RewardCard icon={Trophy} title={bt("leader.reward1")} desc={bt("leader.reward1Desc")} />
          <RewardCard icon={Users} title={bt("leader.reward2")} desc={bt("leader.reward2Desc")} />
          <RewardCard icon={Award} title={bt("leader.reward3")} desc={bt("leader.reward3Desc")} />
        </div>

        {/* CTA Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center p-8 rounded-xl mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,165,0,0.03), rgba(255,215,0,0.06))",
            border: "1px solid rgba(255,215,0,0.15)",
          }}>
          <Crown size={40} className="mx-auto mb-4" style={{ color: "#FFD700" }} />
          <h3 className="text-lg font-bold mb-2" style={{ color: "#FFD700", fontFamily: "'Space Grotesk', sans-serif" }}>
            {bt("leader.reward1")} USD
          </h3>
          <p className="text-sm mb-6" style={{ color: "rgba(226,232,240,0.5)" }}>
            {lang === "ko"
              ? "뛰어난 리더를 추천하시면 최대 $10,000,000 USD의 보상을 받으실 수 있습니다. 본인 추천 또는 지인 추천 모두 가능합니다."
              : "Recommend outstanding leaders and receive up to $10,000,000 USD in rewards. Both self-recommendation and referrals are welcome."}
          </p>
          <button onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,165,0,0.15))",
              border: "1px solid rgba(255,215,0,0.35)",
              color: "#FFD700",
              boxShadow: "0 0 20px rgba(255,215,0,0.1)",
            }}>
            <Crown size={18} />
            {bt("leader.applyBtn")}
          </button>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && <LeaderReferralModal onClose={() => setShowModal(false)} lang={lang} bt={bt} />}
      </AnimatePresence>
    </SectionWrapper>
  );
}
