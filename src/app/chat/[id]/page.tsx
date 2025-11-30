"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useState, useEffect, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { DocumentCard } from "@/components/resume/document-card";
import { MatchScore } from "@/components/resume/match-score";
import { InsightsPanel } from "@/components/resume/insights-panel";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useSessionStore } from "@/store/session-store";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h1 className="mt-2 mb-3 text-2xl font-bold" {...props} />
);
const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h2 className="mt-2 mb-2 text-xl font-semibold" {...props} />
);
const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h3 className="mt-2 mb-2 text-lg font-semibold" {...props} />
);
const Paragraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = (
  props
) => <p className="mb-3 leading-7 text-sm" {...props} />;
const UL: React.FC<React.HTMLAttributes<HTMLUListElement>> = (props) => (
  <ul className="mb-3 ml-5 list-disc space-y-1 text-sm" {...props} />
);
const OL: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = (props) => (
  <ol className="mb-3 ml-5 list-decimal space-y-1 text-sm" {...props} />
);
const LI: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = (props) => (
  <li className="leading-6" {...props} />
);
const Anchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props
) => (
  <a
    className="underline underline-offset-2 text-primary hover:opacity-90"
    target="_blank"
    rel="noreferrer noopener"
    {...props}
  />
);
const Blockquote: React.FC<React.BlockquoteHTMLAttributes<HTMLElement>> = (
  props
) => (
  <blockquote
    className="mb-3 border-l-2 border-border pl-3 text-muted-foreground"
    {...props}
  />
);
const Code: Components["code"] = ({ children, className, ...props }) => {
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match;

  if (isInline) {
    return (
      <code className="rounded bg-muted px-1 py-0.5 text-xs" {...props}>
        {children}
      </code>
    );
  }
  return (
    <pre className="mb-3 w-full overflow-x-auto rounded-md bg-muted p-3">
      <code className="text-xs leading-5" {...props}>
        {children}
      </code>
    </pre>
  );
};
const HR: React.FC<React.HTMLAttributes<HTMLHRElement>> = (props) => (
  <hr className="my-4 border-border" {...props} />
);
const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = (
  props
) => (
  <div className="mb-3 overflow-x-auto">
    <table className="w-full border-collapse text-sm" {...props} />
  </div>
);
const TH: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = (props) => (
  <th
    className="border border-border bg-muted px-2 py-1 text-left"
    {...props}
  />
);
const TD: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = (props) => (
  <td className="border border-border px-2 py-1" {...props} />
);

const markdownComponents: Components = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: Paragraph,
  ul: UL,
  ol: OL,
  li: LI,
  a: Anchor,
  blockquote: Blockquote,
  code: Code,
  hr: HR,
  table: Table,
  th: TH,
  td: TD,
};

type TextPart = { type?: string; text?: string };
type MaybePartsMessage = {
  display?: ReactNode;
  parts?: TextPart[];
  content?: TextPart[];
};

function renderMessageContent(message: MaybePartsMessage): ReactNode {
  if (message.display) return message.display;
  const parts = Array.isArray(message.parts)
    ? message.parts
    : Array.isArray(message.content)
    ? message.content
    : [];
  return parts.map((p, idx) =>
    p?.type === "text" && p.text ? (
      <ReactMarkdown key={idx} components={markdownComponents}>
        {p.text}
      </ReactMarkdown>
    ) : null
  );
}

interface DocumentType {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  createdAt: Date;
  contentLength?: number;
}

interface AnalysisType {
  matchScore: number;
  strengths: string[];
  gaps: string[];
  insights: string[];
  summary: string;
}

interface SessionData {
  resume: DocumentType;
  jobDescription: DocumentType;
  analysis: AnalysisType | null;
}

async function fetchSessionData(sessionId: string): Promise<SessionData> {
  const sessionResponse = await fetch(`/api/sessions/${sessionId}`);
  if (!sessionResponse.ok) {
    throw new Error("Session not found");
  }

  const sessionData = await sessionResponse.json();

  const resume: DocumentType = {
    id: sessionData.resume.id,
    fileName: sessionData.resume.fileName,
    fileType: sessionData.resume.fileType,
    mimeType: "",
    createdAt: new Date(),
  };

  const jobDescription: DocumentType = {
    id: sessionData.jobDescription.id,
    fileName: sessionData.jobDescription.fileName,
    fileType: sessionData.jobDescription.fileType,
    mimeType: "",
    createdAt: new Date(),
  };

  const analysis: AnalysisType | null =
    sessionData.session.matchScore !== null
      ? {
          matchScore: sessionData.session.matchScore,
          strengths: sessionData.session.strengths || [],
          gaps: sessionData.session.gaps || [],
          insights: sessionData.session.insights || [],
          summary: sessionData.session.summary || "",
        }
      : null;

  return { resume, jobDescription, analysis };
}

export default function ChatSessionPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;

  const { createSession } = useSessionStore();

  // Manual message state since @ai-sdk/react's useChat doesn't support query params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    data: sessionData,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => fetchSessionData(sessionId),
    enabled: Boolean(sessionId && session?.user),
  });

  // Handle query error
  useEffect(() => {
    if (error) {
      toast.error("Session not found");
      router.push("/chat");
    }
  }, [error, router]);

  // Update Zustand store when session data loads
  useEffect(() => {
    if (sessionData && sessionId) {
      createSession(sessionId);
    }
  }, [sessionData, sessionId, createSession]);

  const resume = sessionData?.resume ?? null;
  const jobDescription = sessionData?.jobDescription ?? null;
  const analysis = sessionData?.analysis ?? null;

  if (isPending || loading) {
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
          <p>Please log in to view this session.</p>
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
        <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Resume</h3>
              {resume && <DocumentCard document={resume} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Job Description</h3>
              {jobDescription && <DocumentCard document={jobDescription} />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <MatchScore score={analysis.matchScore} />
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{analysis.summary}</p>
              </CardContent>
            </Card>
          </div>

          <InsightsPanel
            strengths={analysis.strengths}
            gaps={analysis.gaps}
            insights={analysis.insights}
          />
        </>
      )}

      {/* Chat Interface */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Ask Questions About This Candidate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] max-h-[600px] overflow-y-auto space-y-4 mb-4 p-4 border rounded-md">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground">
                  <p>Ask questions about the candidate&apos;s resume.</p>
                  <p className="text-xs mt-2">Examples:</p>
                  <ul className="text-xs mt-2 space-y-1">
                    <li>• Does this candidate have experience with React?</li>
                    <li>• What is their educational background?</li>
                    <li>• Can they handle backend architecture?</li>
                  </ul>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                      : "bg-muted max-w-[80%]"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <div>{renderMessageContent(message as MaybePartsMessage)}</div>
                </div>
              ))}
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const text = formData.get('message') as string;
                if (!text.trim()) return;

                const userMessage = {
                  id: Date.now().toString(),
                  role: 'user' as const,
                  content: text,
                  parts: [{ type: 'text', text }],
                };

                setMessages((prev) => [...prev, userMessage]);
                e.currentTarget.reset();
                setIsStreaming(true);

                try {
                  const response = await fetch(`/api/chat?sessionId=${sessionId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      messages: [...messages, userMessage],
                    }),
                  });

                  if (!response.ok) {
                    toast.error('Failed to send message');
                    return;
                  }

                  const reader = response.body?.getReader();
                  const decoder = new TextDecoder();
                  let assistantContent = '';

                  const assistantMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant' as const,
                    content: '',
                    parts: [{ type: 'text', text: '' }],
                  };

                  setMessages((prev) => [...prev, assistantMessage]);

                  if (reader) {
                    while (true) {
                      const { done, value } = await reader.read();
                      if (done) break;

                      const chunk = decoder.decode(value);
                      const lines = chunk.split('\n').filter((line) => line.trim());

                      for (const line of lines) {
                        if (line.startsWith('data: ')) {
                          const dataStr = line.slice(6); // Remove 'data: ' prefix
                          if (dataStr === '[DONE]') continue;

                          try {
                            const data = JSON.parse(dataStr);
                            if (data.type === 'text-delta' && data.delta) {
                              assistantContent += data.delta;
                              setMessages((prev) =>
                                prev.map((msg) =>
                                  msg.id === assistantMessage.id
                                    ? {
                                        ...msg,
                                        content: assistantContent,
                                        parts: [{ type: 'text', text: assistantContent }]
                                      }
                                    : msg
                                )
                              );
                            }
                          } catch {
                            // Skip invalid JSON
                          }
                        }
                      }
                    }
                  }
                } catch (error) {
                  console.error('Error sending message:', error);
                  toast.error('Failed to send message');
                } finally {
                  setIsStreaming(false);
                }
              }}
              className="flex gap-2"
            >
              <input
                name="message"
                placeholder="Ask a question about the candidate..."
                className="flex-1 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isStreaming}
              />
              <Button
                type="submit"
                disabled={isStreaming}
              >
                Send
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </div>
  );
}
