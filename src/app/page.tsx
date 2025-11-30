"use client";

import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { FeaturesShowcase } from "@/components/landing/features-showcase";
import { IntegrationSection } from "@/components/landing/integration-section";
import { TrustSection } from "@/components/landing/trust-section";
import { FinalCTA } from "@/components/landing/final-cta";
import { MatchConstellation } from "@/components/landing/match-constellation";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />

      {/* Experimental: Constellation visualization */}
      <section className="py-24 border-t border-border/30">
        <div className="container mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-4">Experimental</p>
            <h2 className="text-3xl font-light">Match Constellation</h2>
            <p className="text-muted-foreground mt-2">Candidates drift closer based on match quality</p>
          </div>
          <div className="flex justify-center">
            <MatchConstellation />
          </div>
        </div>
      </section>

      <SocialProof />
      <FeaturesShowcase />
      <IntegrationSection />
      <TrustSection />
      <FinalCTA />
    </main>
  );
}
