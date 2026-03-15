/*
 * XPLAY Revenue Structure Analysis — Main Page
 * Design: Cyberpunk Data Terminal — Mobile-first
 * Colors: Deep Navy (#0a0e1a) + Neon Cyan (#00f5ff) + Purple (#a855f7)
 * Typography: Space Grotesk (display) + DM Sans (body)
 *
 * Section Order:
 * 1. UrgentBanner (최상단 — 회의 공지 한줄 띠)
 * 2. Navbar
 * 3. Hero (title + stats + CTA)
 * 4. About XPLAY (detail intro + intro video) — embedded in HeroSection
 * 5. LiveTransactionFeed (global revenue live feed)
 * 6. BusinessSection
 * 7. GameSection
 * 8. StakingSection
 * 9. TeamSection
 * 10. TokenomicsSection
 * 11. RoadmapSection
 * 12. FlywheelSection
 * 13. SimulatorSection
 * 14. LiveChatSection
 * 15. AnnouncementBoard (공지방 + 뉴스)
 * 16. ResourcesSection (자료실)
 * 17. TutorialSection
 * 18. MediaGallerySection
 * 19. CommunicationPartners (소통 파트너 — 맨 아래)
 * 20. LeaderReferralSection (리더 추천 — 맨 아래)
 * 21. ReferralSection (소개자 — 맨 아래)
 * 22. Footer
 */

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BusinessSection from "@/components/sections/BusinessSection";
import FlywheelSection from "@/components/sections/FlywheelSection";
import GameSection from "@/components/sections/GameSection";
import HeroSection from "@/components/sections/HeroSection";
import ReferralSection from "@/components/sections/ReferralSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import StakingSection from "@/components/sections/StakingSection";
import TeamSection from "@/components/sections/TeamSection";
import SimulatorSection from "@/components/sections/SimulatorSection";
import RoadmapSection from "@/components/sections/RoadmapSection";
import TokenomicsSection from "@/components/sections/TokenomicsSection";
import LiveTransactionFeed from "@/components/sections/LiveTransactionFeed";
import LiveChatSection from "@/components/sections/LiveChatSection";
import MediaGallerySection from "@/components/sections/MediaGallerySection";
import TutorialSection from "@/components/sections/TutorialSection";
import AnnouncementBoard from "@/components/sections/AnnouncementBoard";
import CommunicationPartners from "@/components/sections/CommunicationPartners";
import LeaderReferralSection from "@/components/sections/LeaderReferralSection";
import UrgentBanner from "@/components/UrgentBanner";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>
      <UrgentBanner />
      <Navbar />
      <HeroSection />
      <LiveTransactionFeed />
      <BusinessSection />
      <GameSection />
      <StakingSection />
      <TeamSection />
      <TokenomicsSection />
      <RoadmapSection />
      <FlywheelSection />
      <SimulatorSection />
      <LiveChatSection />
      <AnnouncementBoard />
      <ResourcesSection />
      <TutorialSection />
      <MediaGallerySection />
      <CommunicationPartners />
      <LeaderReferralSection />
      <ReferralSection />
      <Footer />
    </div>
  );
}
