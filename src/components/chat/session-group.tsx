"use client";

import { SessionCard } from "./session-card";

interface Session {
  id: string;
  title: string | null;
  candidateName: string | null;
  jobTitle: string | null;
  matchScore: number | null;
  messageCount: number;
  isPinned: boolean;
  lastActivityAt: Date;
}

interface SessionGroupProps {
  title: string;
  sessions: Session[];
  activeSessionId: string | null;
  isCollapsed: boolean;
  onSessionSelect: (sessionId: string) => void;
  onSessionDelete?: (sessionId: string) => void;
  onTogglePin?: (sessionId: string, isPinned: boolean) => void;
  onRename?: (sessionId: string) => void;
}

export function SessionGroup({
  title,
  sessions,
  activeSessionId,
  isCollapsed,
  onSessionSelect,
  onSessionDelete,
  onTogglePin,
  onRename,
}: SessionGroupProps) {
  if (sessions.length === 0) return null;

  return (
    <div>
      {!isCollapsed && (
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-2">
          {title} ({sessions.length})
        </h3>
      )}
      <div className="space-y-1">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            isCollapsed={isCollapsed}
            onClick={() => onSessionSelect(session.id)}
            onDelete={onSessionDelete}
            onTogglePin={onTogglePin}
            onRename={onRename}
          />
        ))}
      </div>
    </div>
  );
}
