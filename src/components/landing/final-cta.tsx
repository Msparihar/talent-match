"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mail, BookOpen } from "lucide-react";
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
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-500/10" />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          {/* Main headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Start screening smarter today
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {session
              ? `Welcome back! Continue to your dashboard`
              : `Join hundreds of recruiting teams using AI to find the perfect candidates faster`}
          </p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button
              onClick={handleGetStarted}
              disabled={isPending}
              size="lg"
              className="text-lg px-8 py-6 group"
            >
              {session ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform ml-2" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="/chat" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Sales
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="#features" className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                View Documentation
              </Link>
            </Button>
          </motion.div>

          {/* Additional info */}
          {!session && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-sm text-muted-foreground pt-8"
            >
              No credit card required • 14-day free trial • Cancel anytime
            </motion.p>
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
