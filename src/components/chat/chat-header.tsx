"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreVertical, Pin, Archive, Trash2, Download } from "lucide-react";

interface ChatHeaderProps {
  session: {
    id: string;
    title: string | null;
    candidateName: string | null;
    jobTitle: string | null;
    matchScore: number | null;
    messageCount: number;
    isPinned: boolean;
  };
  resumeFileName: string;
  jobDescriptionFileName: string;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export function ChatHeader({
  session,
  resumeFileName,
  jobDescriptionFileName,
  onPin,
  onArchive,
  onDelete,
  onDownload,
}: ChatHeaderProps) {
  const title = session.title || `${session.candidateName || "Candidate"} - ${session.jobTitle || "Position"}`;

  const getMatchScoreColor = (score: number | null) => {
    if (!score) return "secondary";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="border-b bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 flex-shrink-0" />
            <h2 className="text-xl font-semibold truncate">{title}</h2>
            {session.isPinned && <Pin className="h-4 w-4 text-primary" />}
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Resume: {resumeFileName}</span>
              <span>•</span>
              <span>JD: {jobDescriptionFileName}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {session.matchScore !== null && (
                <>
                  <span className="flex items-center gap-1">
                    Match:
                    <Badge variant={getMatchScoreColor(session.matchScore)} className="text-xs">
                      {Math.round(session.matchScore)}%
                    </Badge>
                  </span>
                  <span>•</span>
                </>
              )}
              <span>{session.messageCount} messages</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onPin}>
              <Pin className="h-4 w-4 mr-2" />
              {session.isPinned ? "Unpin" : "Pin"} Session
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Session
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
