"use client";

import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/chat/chat-layout";
import { CollapsibleSidebar } from "@/components/chat/collapsible-sidebar";
import { ConfirmationModal } from "@/components/chat/confirmation-modal";
import { RenameSessionModal } from "@/components/chat/rename-session-modal";
import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

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

export default function ChatLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Extract active session ID from pathname
  const activeSessionId = pathname.match(/^\/chat\/([^/]+)$/)?.[1] || null;

  // Session management state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Rename modal state
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<Session | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);

  // Fetch sessions on mount
  useEffect(() => {
    if (session?.user) {
      fetchSessions();
    }
  }, [session?.user]);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const response = await fetch('/api/sessions?limit=50');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleNewSession = () => {
    router.push('/chat');
  };

  const handleViewArchived = () => {
    console.log('View archived sessions');
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/sessions/${sessionToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete));

      // If the deleted session was the current one, go to new session
      if (activeSessionId === sessionToDelete) {
        handleNewSession();
      }

      toast.success('Session archived', {
        description: 'The session has been moved to the archive.',
      });

      fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session', {
        description: 'An error occurred while deleting the session.',
      });
    } finally {
      setIsDeleting(false);
      setSessionToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleTogglePin = async (sessionId: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, isPinned } : s))
      );

      toast.success(isPinned ? 'Session pinned' : 'Session unpinned');
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update session');
    }
  };

  const handleRenameSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSessionToRename(session);
      setRenameModalOpen(true);
    }
  };

  const confirmRenameSession = async (newTitle: string) => {
    if (!sessionToRename) return;

    setIsRenaming(true);
    try {
      const response = await fetch(`/api/sessions/${sessionToRename.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename session');
      }

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionToRename.id ? { ...s, title: newTitle } : s
        )
      );

      toast.success('Session renamed successfully');
      setRenameModalOpen(false);
      setSessionToRename(null);
    } catch (error) {
      console.error('Error renaming session:', error);
      toast.error('Failed to rename session');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      <ChatLayout
        sidebar={
          <CollapsibleSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={(id) => router.push(`/chat/${id}`)}
            onNewSession={handleNewSession}
            onViewArchived={handleViewArchived}
            onDeleteSession={handleDeleteSession}
            onTogglePin={handleTogglePin}
            onRenameSession={handleRenameSession}
            isLoading={sessionsLoading}
          />
        }
      >
        {children}
      </ChatLayout>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSessionToDelete(null);
        }}
        onConfirm={confirmDeleteSession}
        title="Archive Session"
        description="Are you sure you want to archive this session? You can restore it later from the archived sessions."
        confirmText={isDeleting ? "Archiving..." : "Archive"}
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Rename Session Modal */}
      <RenameSessionModal
        isOpen={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
          setSessionToRename(null);
        }}
        onRename={confirmRenameSession}
        currentTitle={
          sessionToRename?.title ||
          `${sessionToRename?.candidateName || "Candidate"} - ${sessionToRename?.jobTitle || "Position"}`
        }
        isLoading={isRenaming}
      />
    </>
  );
}
