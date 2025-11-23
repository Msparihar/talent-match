"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Chrome, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
}

export function AuthDialog({ open, onOpenChange, defaultTab = "signin" }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleGoogleAuth = async (isSignUp: boolean) => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      // Dialog will close automatically when redirecting
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to TalentMatch
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to start screening resumes with AI
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2 text-center text-sm text-muted-foreground">
                <p>Sign in with your Google account to continue</p>
              </div>

              <Button
                onClick={() => handleGoogleAuth(false)}
                disabled={isLoading}
                size="lg"
                className="w-full"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-5 w-5" />
                )}
                Continue with Google
              </Button>

              <div className="text-xs text-center text-muted-foreground">
                By continuing, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2 text-center text-sm text-muted-foreground">
                <p>Create your account and start screening resumes instantly</p>
                <ul className="text-left space-y-1 mt-4">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    AI-powered resume analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Smart candidate matching
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Free 14-day trial
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => handleGoogleAuth(true)}
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Chrome className="mr-2 h-5 w-5" />
                )}
                Sign up with Google
              </Button>

              <div className="text-xs text-center text-muted-foreground">
                By signing up, you agree to our{" "}
                <a href="#" className="underline hover:text-foreground">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline hover:text-foreground">
                  Privacy Policy
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
