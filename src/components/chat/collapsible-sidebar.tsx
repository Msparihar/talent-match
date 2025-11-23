"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Search, Archive } from "lucide-react";
import { SidebarHeader } from "./sidebar-header";
import { SessionGroup } from "./session-group";
import { SessionCardSkeletonGroup } from "./session-card-skeleton";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import {
  isToday,
  isYesterday,
  isThisWeek,
} from "date-fns";

interface Session {
  id: string;
  title: string | null;
  candidateName: string | null;
  jobTitle: string | null;
  matchScore: number | null;
  messageCount: number;
  isPinned: boolean;
  isArchived: boolean;
  lastActivityAt: Date;
  createdAt: Date;
}

interface CollapsibleSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onViewArchived: () => void;
  onDeleteSession?: (sessionId: string) => void;
  onTogglePin?: (sessionId: string, isPinned: boolean) => void;
  onRenameSession?: (sessionId: string) => void;
  isLoading?: boolean;
}

export function CollapsibleSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onViewArchived,
  onDeleteSession,
  onTogglePin,
  onRenameSession,
  isLoading = false,
}: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions);

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Filter sessions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSessions(sessions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = sessions.filter((session) => {
      const title = session.title?.toLowerCase() || "";
      const candidateName = session.candidateName?.toLowerCase() || "";
      const jobTitle = session.jobTitle?.toLowerCase() || "";
      return (
        title.includes(query) ||
        candidateName.includes(query) ||
        jobTitle.includes(query)
      );
    });
    setFilteredSessions(filtered);
  }, [searchQuery, sessions]);

  // Group sessions by date
  const groupSessionsByDate = (sessions: Session[]) => {
    const pinned = sessions.filter((s) => s.isPinned);
    const unpinned = sessions.filter((s) => !s.isPinned);

    const today: Session[] = [];
    const yesterday: Session[] = [];
    const thisWeek: Session[] = [];
    const older: Session[] = [];

    unpinned.forEach((session) => {
      const date = new Date(session.lastActivityAt);
      if (isToday(date)) {
        today.push(session);
      } else if (isYesterday(date)) {
        yesterday.push(session);
      } else if (isThisWeek(date, { weekStartsOn: 0 })) {
        thisWeek.push(session);
      } else {
        older.push(session);
      }
    });

    return { pinned, today, yesterday, thisWeek, older };
  };

  const grouped = groupSessionsByDate(filteredSessions);
  const archivedCount = sessions.filter((s) => s.isArchived).length;

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", JSON.stringify(newState));
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header */}
      <SidebarHeader isCollapsed={isCollapsed} onToggle={toggleSidebar} />

      {/* Actions */}
      <div className={cn("p-3 border-b", isCollapsed ? "space-y-2" : "space-y-3")}>
        {isCollapsed ? (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={onNewSession} className="w-full" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>New Session</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <>
            <Button onClick={onNewSession} className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoComplete="off"
              />
            </div>
          </>
        )}
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {isLoading ? (
          !isCollapsed && (
            <div className="space-y-4">
              <SessionCardSkeletonGroup count={3} />
              <SessionCardSkeletonGroup count={2} />
            </div>
          )
        ) : filteredSessions.length === 0 ? (
          !isCollapsed && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">No sessions found</p>
              {searchQuery && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          )
        ) : (
          <>
            <SessionGroup
              title="Pinned"
              sessions={grouped.pinned}
              activeSessionId={activeSessionId}
              isCollapsed={isCollapsed}
              onSessionSelect={onSessionSelect}
              onSessionDelete={onDeleteSession}
              onTogglePin={onTogglePin}
              onRename={onRenameSession}
            />
            <SessionGroup
              title="Today"
              sessions={grouped.today}
              activeSessionId={activeSessionId}
              isCollapsed={isCollapsed}
              onSessionSelect={onSessionSelect}
              onSessionDelete={onDeleteSession}
              onTogglePin={onTogglePin}
              onRename={onRenameSession}
            />
            <SessionGroup
              title="Yesterday"
              sessions={grouped.yesterday}
              activeSessionId={activeSessionId}
              isCollapsed={isCollapsed}
              onSessionSelect={onSessionSelect}
              onSessionDelete={onDeleteSession}
              onTogglePin={onTogglePin}
              onRename={onRenameSession}
            />
            <SessionGroup
              title="This Week"
              sessions={grouped.thisWeek}
              activeSessionId={activeSessionId}
              isCollapsed={isCollapsed}
              onSessionSelect={onSessionSelect}
              onSessionDelete={onDeleteSession}
              onTogglePin={onTogglePin}
              onRename={onRenameSession}
            />
            <SessionGroup
              title="Older"
              sessions={grouped.older}
              activeSessionId={activeSessionId}
              isCollapsed={isCollapsed}
              onSessionSelect={onSessionSelect}
              onSessionDelete={onDeleteSession}
              onTogglePin={onTogglePin}
              onRename={onRenameSession}
            />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t">
        {archivedCount > 0 && (
          <div className="p-3 border-b">
            {isCollapsed ? (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onViewArchived}
                      className="w-full"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>View Archived ({archivedCount})</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewArchived}
                className="w-full"
              >
                <Archive className="h-4 w-4 mr-2" />
                View Archived ({archivedCount})
              </Button>
            )}
          </div>
        )}

        {/* User Profile and Theme Toggle */}
        <div className={cn("p-3", isCollapsed ? "flex flex-col gap-2" : "flex items-center justify-between gap-2")}>
          {isCollapsed ? (
            <>
              <UserProfile />
              <ModeToggle />
            </>
          ) : (
            <>
              <UserProfile />
              <ModeToggle />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
