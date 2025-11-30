"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { AuthDialog } from "@/components/auth/auth-dialog";

export function FinalCTA() {
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
    <section className="py-32 lg:py-40 relative overflow-hidden noise">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-primary/30 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute inset-0 bg-accent/20 rounded-full blur-[120px] translate-x-20"
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-6 md:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-primary" />
            <span className="text-sm font-medium tracking-widest uppercase text-primary">
              Get Started
            </span>
            <div className="h-px w-12 bg-primary" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8">
            {session ? (
              <>Welcome back</>
            ) : (
              <>
                Ready to hire<br />
                <span className="text-gradient-cyan">smarter?</span>
              </>
            )}
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto mb-12">
            {session
              ? "Continue where you left off."
              : "Join teams who've transformed their recruiting with AI-powered screening."}
          </p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={handleGetStarted}
              disabled={isPending}
              size="lg"
              className="text-base px-10 py-7 group glow-cyan"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {session ? "Go to Dashboard" : "Start Free Trial"}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-base px-8 py-7 border border-border/50 hover:bg-card hover:border-primary/30"
            >
              <Link href="/chat">
                Talk to Sales
              </Link>
            </Button>
          </motion.div>

          {/* Trust line */}
          {!session && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                14-day free trial
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Cancel anytime
              </span>
            </motion.div>
          )}
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
