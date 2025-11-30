"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
}

export function AuthDialog({ open, onOpenChange, defaultTab = "signin" }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 border-border/50 bg-card overflow-hidden">
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Sign in to TalentMatch</DialogTitle>

        {/* Header with logo */}
        <div className="p-8 pb-6 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-50" />
            </div>
          </div>

          {/* Brand name */}
          <h1 className="text-xl font-semibold tracking-tight mb-2">
            <span className="text-foreground">Talent</span>
            <span className="text-gradient-cyan">Match</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            AI-powered resume screening
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="pt-6 pb-2">
              <div className="space-y-6">
                <p className="text-center text-sm text-muted-foreground">
                  Welcome back! Sign in to continue.
                </p>

                <Button
                  onClick={() => handleGoogleAuth()}
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 glow-cyan"
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="pt-6 pb-2">
              <div className="space-y-6">
                {/* Features list */}
                <div className="space-y-3">
                  {[
                    "AI-powered resume analysis",
                    "Smart candidate matching",
                    "14-day free trial"
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleGoogleAuth()}
                  disabled={isLoading}
                  size="lg"
                  className="w-full h-12 glow-cyan"
                >
                  {isLoading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  Get Started with Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 mt-4 border-t border-border/50 bg-muted/20">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
