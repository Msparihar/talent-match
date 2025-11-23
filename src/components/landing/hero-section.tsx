"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { AuthDialog } from "@/components/auth/auth-dialog";

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
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="text-sm text-muted-foreground">
                Trusted by 1000+ recruiting teams
              </span>
            </motion.div>

            {/* Main headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  AI-Powered Resume Screening
                </span>
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-muted-foreground">
                Find the Perfect Match
              </h2>
            </div>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              Intelligent resume screening tool that matches candidates with job descriptions using advanced AI-powered analysis and semantic search.
            </p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleGetStarted}
                disabled={isPending}
                size="lg"
                className="text-lg px-8 py-6 group"
              >
                {session ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="#features" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  View Demo
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
            >
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Resumes Processed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">80%</div>
                <div className="text-sm text-muted-foreground">Time Saved</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - 3D Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Animated gradient orb */}
            <div className="relative aspect-square">
              {/* Main orb */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-purple-500/30 blur-3xl"
              />

              {/* Secondary orb */}
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tl from-blue-500/20 via-primary/30 to-pink-500/20 blur-2xl"
              />

              {/* Floating cards */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-48 h-32 bg-card border border-border rounded-lg shadow-2xl p-4 backdrop-blur-sm"
              >
                <div className="text-xs text-muted-foreground mb-2">Match Score</div>
                <div className="text-3xl font-bold text-green-500">94%</div>
                <div className="text-xs text-muted-foreground mt-2">Senior Developer</div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [5, -5, 5],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-1/4 right-1/4 w-48 h-32 bg-card border border-border rounded-lg shadow-2xl p-4 backdrop-blur-sm"
              >
                <div className="text-xs text-muted-foreground mb-2">Skills Matched</div>
                <div className="flex gap-1 flex-wrap">
                  <span className="px-2 py-1 bg-primary/20 rounded text-xs">React</span>
                  <span className="px-2 py-1 bg-primary/20 rounded text-xs">TypeScript</span>
                  <span className="px-2 py-1 bg-primary/20 rounded text-xs">Node.js</span>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-1/2 right-0 w-40 h-28 bg-card border border-border rounded-lg shadow-2xl p-4 backdrop-blur-sm"
              >
                <div className="text-xs text-muted-foreground mb-2">AI Analysis</div>
                <div className="space-y-1">
                  <div className="h-2 bg-primary/30 rounded w-full" />
                  <div className="h-2 bg-primary/30 rounded w-3/4" />
                  <div className="h-2 bg-primary/30 rounded w-1/2" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* Auth Dialog */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultTab="signup"
      />
    </section>
  );
}
