"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionCard } from "./session-card";
import { SessionCardSkeletonGroup } from "./session-card-skeleton";
import { Plus, Search, Archive } from "lucide-react";
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

interface ChatSidebarProps {
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

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onViewArchived,
  onDeleteSession,
  onTogglePin,
  onRenameSession,
  isLoading = false,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) {
      return sessions;
    }

    const query = searchQuery.toLowerCase();
    return sessions.filter((session) => {
      const title = session.title?.toLowerCase() || "";
      const candidateName = session.candidateName?.toLowerCase() || "";
      const jobTitle = session.jobTitle?.toLowerCase() || "";
      return (
        title.includes(query) ||
        candidateName.includes(query) ||
        jobTitle.includes(query)
      );
    });
  }, [searchQuery, sessions]);

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

  return (
    <div className="flex flex-col h-full bg-gradient-radial border-r border-border backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-border/50 space-y-3">
        <Button onClick={onNewSession} className="w-full shadow-linear" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-strong"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="skeleton skeleton-text-sm w-24 mb-3 px-2" />
              <SessionCardSkeletonGroup count={3} />
            </div>
            <div className="space-y-2">
              <div className="skeleton skeleton-text-sm w-20 mb-3 px-2" />
              <SessionCardSkeletonGroup count={2} />
            </div>
          </div>
        ) : filteredSessions.length === 0 ? (
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
        ) : (
          <>
            {/* Pinned */}
            {grouped.pinned.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                  Pinned ({grouped.pinned.length})
                </h3>
                <div className="space-y-1">
                  {grouped.pinned.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onClick={() => onSessionSelect(session.id)}
                      onDelete={onDeleteSession}
                      onTogglePin={onTogglePin}
                      onRename={onRenameSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Today */}
            {grouped.today.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                  Today ({grouped.today.length})
                </h3>
                <div className="space-y-1">
                  {grouped.today.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onClick={() => onSessionSelect(session.id)}
                      onDelete={onDeleteSession}
                      onTogglePin={onTogglePin}
                      onRename={onRenameSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Yesterday */}
            {grouped.yesterday.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                  Yesterday ({grouped.yesterday.length})
                </h3>
                <div className="space-y-1">
                  {grouped.yesterday.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onClick={() => onSessionSelect(session.id)}
                      onDelete={onDeleteSession}
                      onTogglePin={onTogglePin}
                      onRename={onRenameSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* This Week */}
            {grouped.thisWeek.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                  This Week ({grouped.thisWeek.length})
                </h3>
                <div className="space-y-1">
                  {grouped.thisWeek.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onClick={() => onSessionSelect(session.id)}
                      onDelete={onDeleteSession}
                      onTogglePin={onTogglePin}
                      onRename={onRenameSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Older */}
            {grouped.older.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
                  Older ({grouped.older.length})
                </h3>
                <div className="space-y-1">
                  {grouped.older.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      isActive={session.id === activeSessionId}
                      onClick={() => onSessionSelect(session.id)}
                      onDelete={onDeleteSession}
                      onTogglePin={onTogglePin}
                      onRename={onRenameSession}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {archivedCount > 0 && (
        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewArchived}
            className="w-full justify-start"
          >
            <Archive className="h-4 w-4 mr-2" />
            View Archived ({archivedCount})
          </Button>
        </div>
      )}
    </div>
  );
}
