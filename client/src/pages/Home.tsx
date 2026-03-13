/*
 * XPLAY Revenue Structure Analysis — Main Page
 * Design: Cyberpunk Data Terminal — Mobile-first
 * Colors: Deep Navy (#0a0e1a) + Neon Cyan (#00f5ff) + Purple (#a855f7)
 * Typography: Space Grotesk (display) + DM Sans (body)
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
      <MediaGallerySection />
      <FlywheelSection />
      <SimulatorSection />
      <LiveChatSection />
      <ResourcesSection />
      <Footer />
    </div>
  );
}
