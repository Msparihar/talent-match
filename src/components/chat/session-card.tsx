"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, MessageSquare, Pin, Trash2, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: {
    id: string;
    title: string | null;
    candidateName: string | null;
    jobTitle: string | null;
    matchScore: number | null;
    messageCount: number;
    isPinned: boolean;
    lastActivityAt: Date;
  };
  isActive?: boolean;
  isCollapsed?: boolean;
  onClick: () => void;
  onDelete?: (sessionId: string) => void;
  onTogglePin?: (sessionId: string, isPinned: boolean) => void;
  onRename?: (sessionId: string) => void;
}

export function SessionCard({ session, isActive, isCollapsed = false, onClick, onDelete, onTogglePin, onRename }: SessionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getMatchScoreColor = (score: number | null) => {
    if (!score) return "secondary";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const title = session.title || `${session.candidateName || "Candidate"} - ${session.jobTitle || "Position"}`;

  // Get initials for collapsed mode
  const getInitials = () => {
    if (session.candidateName) {
      const names = session.candidateName.split(" ");
      return names.length > 1
        ? `${names[0][0]}${names[names.length - 1][0]}`
        : names[0][0];
    }
    return "C";
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(session.id);
    }
  };

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(session.id, !session.isPinned);
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRename) {
      onRename(session.id);
    }
  };

  // Tooltip content for collapsed mode
  const tooltipContent = (
    <div className="text-xs space-y-1">
      <div className="font-semibold">{title}</div>
      {session.matchScore !== null && (
        <div>Match: {Math.round(session.matchScore)}%</div>
      )}
      <div>{session.messageCount} messages</div>
      <div className="text-muted-foreground">
        {formatDistanceToNow(new Date(session.lastActivityAt), { addSuffix: true })}
      </div>
    </div>
  );

  // Collapsed mode: icon only with tooltip
  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className={cn(
                "w-full flex items-center justify-center p-3 rounded-lg transition-colors relative cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-semibold">
                {getInitials()}
              </div>
              {session.isPinned && (
                <Pin className="absolute top-1 right-1 h-2.5 w-2.5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Expanded mode: full details
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <button
        onClick={onClick}
        className={cn(
          "w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer hover-lift",
          isActive
            ? "bg-primary text-primary-foreground shadow-linear"
            : "hover:bg-accent/50 glass-strong"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <FileText className="h-4 w-4 flex-shrink-0 opacity-70" />
              <h3 className="font-medium text-sm truncate">{title}</h3>
              {session.isPinned && (
                <Pin className="h-3 w-3 flex-shrink-0 fill-current opacity-70" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {session.matchScore !== null && (
                <Badge variant={getMatchScoreColor(session.matchScore)} className="text-xs font-medium">
                  {Math.round(session.matchScore)}%
                </Badge>
              )}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {session.messageCount}
              </span>
            </div>
          </div>
          {isHovered && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {onTogglePin && (
                <div
                  className="h-7 w-7 flex-shrink-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                  onClick={handleTogglePin}
                  title={session.isPinned ? "Unpin" : "Pin"}
                >
                  <Pin className={cn("h-3.5 w-3.5", session.isPinned && "fill-current")} />
                </div>
              )}
              {onRename && (
                <div
                  className="h-7 w-7 flex-shrink-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                  onClick={handleRename}
                  title="Rename"
                >
                  <Edit className="h-3.5 w-3.5" />
                </div>
              )}
              {onDelete && (
                <div
                  className="h-7 w-7 flex-shrink-0 inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground hover:text-destructive transition-colors cursor-pointer"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-2 opacity-70">
          {formatDistanceToNow(new Date(session.lastActivityAt), { addSuffix: true })}
        </div>
      </button>
    </div>
  );
}
