/*
 * XPLAY Revenue Structure Analysis — Main Page
 * Design: Cyberpunk Data Terminal
 * Colors: Deep Navy (#0a0e1a) + Neon Cyan (#00f5ff) + Purple (#a855f7)
 * Typography: Space Grotesk (display) + DM Sans (body)
 */

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ReferralModal from "@/components/ReferralModal";
import BusinessSection from "@/components/sections/BusinessSection";
import FlywheelSection from "@/components/sections/FlywheelSection";
import GameSection from "@/components/sections/GameSection";
import HeroSection from "@/components/sections/HeroSection";
import ReferralSection from "@/components/sections/ReferralSection";
import ResourcesSection from "@/components/sections/ResourcesSection";
import StakingSection from "@/components/sections/StakingSection";
import TeamSection from "@/components/sections/TeamSection";
import TokenomicsSection from "@/components/sections/TokenomicsSection";
import { useState } from "react";

export default function Home() {
  const [referralOpen, setReferralOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#0a0e1a" }}>
      <Navbar onOpenReferral={() => setReferralOpen(true)} />
      <ReferralModal open={referralOpen} onClose={() => setReferralOpen(false)} />
      <HeroSection />
      <BusinessSection />
      <GameSection />
      <StakingSection />
      <ReferralSection />
      <TeamSection />
      <TokenomicsSection />
      <FlywheelSection />
      <ResourcesSection />
      <Footer />
    </div>
  );
}
