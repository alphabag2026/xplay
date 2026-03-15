/*
 * XPLAY Revenue Structure Analysis — Main Page
 * Design: Cyberpunk Data Terminal — Mobile-first
 * Colors: Deep Navy (#0a0e1a) + Neon Cyan (#00f5ff) + Purple (#a855f7)
 * Typography: Space Grotesk (display) + DM Sans (body)
 *
 * Section Order (Updated):
 * 1. UrgentBanner
 * 2. Navbar
 * 3. Hero
 * 4. BusinessSection
 * 5. GameSection
 * 6. ReferralSection (직추천 수익 — 팀수익 위에)
 * 7. StakingSection
 * 8. TeamSection
 * 9. TokenomicsSection
 * 10. RoadmapSection
 * 11. LiveTransactionFeed (실시간 글로벌 매출 — 로드맵 다음)
 * 12. FlywheelSection
 * 13. SimulatorSection
 * 14. LiveChatSection
 * 15. AnnouncementBoard
 * 16. ResourcesSection
 * 17. TutorialSection
 * 18. MediaGallerySection
 * 19. CommunicationPartners
 * 20. LeaderReferralSection
 * 21. Footer
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
      <BusinessSection />
      <GameSection />
      <ReferralSection />
      <StakingSection />
      <TeamSection />
      <TokenomicsSection />
      <RoadmapSection />
      <LiveTransactionFeed />
      <FlywheelSection />
      <SimulatorSection />
      <LiveChatSection />
      <AnnouncementBoard />
      <ResourcesSection />
      <TutorialSection />
      <MediaGallerySection />
      <CommunicationPartners />
      <LeaderReferralSection />
      <Footer />
    </div>
  );
}
