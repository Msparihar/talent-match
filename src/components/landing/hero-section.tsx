"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { MatchRadar } from "./match-radar";

export function HeroSection() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const handleGetStarted = () => {
    if (session) {
      window.location.href = "/dashboard";
    } else {
      setAuthDialogOpen(true);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden noise">
      {/* Ambient glow - asymmetric placement */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/6 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

      {/* Grid overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto lg:mx-0">
          {/* Orchestrated reveal sequence */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* Eyebrow with geometric accent */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="h-px w-12 bg-primary" />
              <span className="text-sm font-medium tracking-widest uppercase text-primary">
                AI-Powered Recruitment
              </span>
            </motion.div>

            {/* Main headline - dramatic serif typography */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
              >
                <span className="text-foreground">Find talent</span>
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight"
              >
                <span className="text-gradient-cyan">that fits.</span>
              </motion.h1>
            </div>

            {/* Subheading - refined and concise */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              Intelligent resume screening powered by semantic AI.
              Match candidates to roles with precision, not guesswork.
            </motion.p>

            {/* CTA group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={handleGetStarted}
                disabled={isPending}
                size="lg"
                className="text-base px-8 py-6 group glow-cyan"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {session ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-base px-8 py-6 border border-border/50 hover:bg-card hover:border-primary/30"
              >
                <Link href="#features">
                  See How It Works
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats row - asymmetric layout with emphasis */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-24 flex flex-wrap items-end gap-12 md:gap-20"
          >
            <div className="space-y-1">
              <div className="text-5xl md:text-6xl font-light text-gradient-cyan">10K+</div>
              <div className="text-sm text-muted-foreground tracking-wide">Resumes analyzed</div>
            </div>
            <div className="space-y-1">
              <div className="text-5xl md:text-6xl font-light text-foreground">95<span className="text-primary">%</span></div>
              <div className="text-sm text-muted-foreground tracking-wide">Match accuracy</div>
            </div>
            <div className="space-y-1">
              <div className="text-5xl md:text-6xl font-light text-foreground">4<span className="text-accent">x</span></div>
              <div className="text-sm text-muted-foreground tracking-wide">Faster screening</div>
            </div>
          </motion.div>
        </div>

        {/* Interactive Match Radar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <MatchRadar />
        </motion.div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultTab="signup"
      />
    </section>
  );
}
