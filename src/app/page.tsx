"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { FeaturesShowcase } from "@/components/landing/features-showcase";
import { IntegrationSection } from "@/components/landing/integration-section";
import { TrustSection } from "@/components/landing/trust-section";
import { FinalCTA } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <SocialProof />
      <FeaturesShowcase />
      <IntegrationSection />
      <TrustSection />
      <FinalCTA />
    </main>
  );
}
