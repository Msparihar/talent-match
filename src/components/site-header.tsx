import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Sparkles className="h-5 w-5 text-primary" />
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-medium tracking-tight">
            <span className="text-foreground">Talent</span>
            <span className="text-gradient-cyan">Match</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <UserProfile />
          <div className="w-px h-6 bg-border/50" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
