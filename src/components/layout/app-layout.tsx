"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  isSidebarCollapsed?: boolean;
}

export function AppLayout({ sidebar, children, isSidebarCollapsed = false }: AppLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        {isMobileSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Sidebar - Desktop */}
      {!isSidebarCollapsed && (
        <aside className="hidden lg:block w-80 flex-shrink-0">
          {sidebar}
        </aside>
      )}

      {/* Sidebar - Mobile Drawer */}
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            {sidebar}
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
