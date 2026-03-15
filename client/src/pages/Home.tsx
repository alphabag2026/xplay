/*
 * XPLAY Revenue Structure Analysis — Main Page
 * Design: Cyberpunk Data Terminal — Mobile-first
 * Colors: Deep Navy (#0a0e1a) + Neon Cyan (#00f5ff) + Purple (#a855f7)
 * Typography: Space Grotesk (display) + DM Sans (body)
 *
 * Section Order:
 * 1. Hero (title + stats + CTA)
 * 2. About XPLAY (detail intro + intro video) — embedded in HeroSection
 * 3. LiveTransactionFeed (global revenue live feed)
 * 4. BusinessSection
 * 5. GameSection
 * 6. StakingSection
 * 7. ReferralSection
 * 8. TeamSection
 * 9. TokenomicsSection
 * 10. RoadmapSection
 * 11. FlywheelSection
 * 12. SimulatorSection
 * 13. LiveChatSection
 * 14. AnnouncementBoard (공지방 + 뉴스)
 * 15. CommunicationPartners (소통 파트너)
 * 16. ResourcesSection (자료실)
 * 17. TutorialSection (자료실 아래)
 * 18. MediaGallerySection (자료실 아래)
 * 19. Footer
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

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>
      <Navbar />
      <HeroSection />
      <LiveTransactionFeed />
      <BusinessSection />
      <GameSection />
      <StakingSection />
      <ReferralSection />
      <TeamSection />
      <TokenomicsSection />
      <RoadmapSection />
      <FlywheelSection />
      <SimulatorSection />
      <LiveChatSection />
      <AnnouncementBoard />
      <LeaderReferralSection />
      <CommunicationPartners />
      <ResourcesSection />
      <TutorialSection />
      <MediaGallerySection />
      <Footer />
    </div>
  );
}
