"use client";

import { Button } from "@/components/ui/button";
import { Bot, PanelLeftClose, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {!isCollapsed && (
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-semibold truncate">
            TalentMatch
          </span>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 cursor-pointer",
          isCollapsed && "w-full"
        )}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <PanelLeft className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
