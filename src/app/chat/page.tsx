"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { FileUpload } from "@/components/resume/file-upload";
import { DocumentCard } from "@/components/resume/document-card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useSessionStore } from "@/store/session-store";
import { useRouter } from "next/navigation";

interface DocumentType {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  createdAt: Date;
  contentLength?: number;
}

export default function ChatPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { createSession, setProcessing, reset: resetStore } = useSessionStore();

  const [resume, setResume] = useState<DocumentType | null>(null);
  const [jobDescription, setJobDescription] = useState<DocumentType | null>(null);
  const [creating, setCreating] = useState(false);

  // Reset store when landing on new session page
  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const handleCreateSession = async () => {
    if (!resume || !jobDescription) return;

    setCreating(true);
    setProcessing('uploading');

    try {
      // Create session
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: resume.id,
          jobDescriptionId: jobDescription.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      const data = await response.json();
      const newSessionId = data.session.id;

      // Update Zustand store
      createSession(newSessionId, [
        { ...resume, type: 'resume' as const },
        { ...jobDescription, type: 'job_description' as const }
      ]);

      // Start processing (analysis will happen in the background)
      setProcessing('processing', 50);

      // Redirect to the new session
      router.push(`/chat/${newSessionId}`);

      toast.success('Session created', {
        description: 'Starting analysis...',
      });
    } catch (error) {
      console.error('Error creating session:', error);
      setProcessing('error');
      toast.error('Failed to create session', {
        description: 'An error occurred while creating the session.',
      });
    } finally {
      setCreating(false);
    }
  };

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p>Please log in to create a session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <h1 className="text-xl md:text-2xl font-bold">Resume Screening Tool</h1>
        <span className="text-xs md:text-sm text-muted-foreground">
          Welcome, {session.user.name}!
        </span>
      </div>

      {/* Main content with scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="text-center space-y-2 py-8">
              <h2 className="text-3xl font-bold">Start a New Screening Session</h2>
              <p className="text-muted-foreground">
                Upload a resume and job description to analyze candidate fit and start chatting
              </p>
            </div>

            {/* File Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FileUpload
                      fileType="resume"
                      onUploadSuccess={setResume}
                      label="Upload Resume"
                    />
                    {resume && <DocumentCard document={resume} onRemove={() => setResume(null)} />}
                  </div>
                  <div className="space-y-2">
                    <FileUpload
                      fileType="job_description"
                      onUploadSuccess={setJobDescription}
                      label="Upload Job Description"
                    />
                    {jobDescription && (
                      <DocumentCard document={jobDescription} onRemove={() => setJobDescription(null)} />
                    )}
                  </div>
                </div>

                {resume && jobDescription && (
                  <Button
                    onClick={handleCreateSession}
                    disabled={creating}
                    className="w-full"
                    size="lg"
                  >
                    {creating ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Creating Session...
                      </>
                    ) : (
                      'Start Analysis & Chat'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
