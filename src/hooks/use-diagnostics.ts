"use client";

import { useQuery } from "@tanstack/react-query";

type DiagnosticsResponse = {
  timestamp: string;
  env: {
    POSTGRES_URL: boolean;
    BETTER_AUTH_SECRET: boolean;
    GOOGLE_CLIENT_ID: boolean;
    GOOGLE_CLIENT_SECRET: boolean;
    OPENAI_API_KEY: boolean;
    NEXT_PUBLIC_APP_URL: boolean;
  };
  database: {
    connected: boolean;
    schemaApplied: boolean;
    error?: string;
  };
  auth: {
    configured: boolean;
    routeResponding: boolean | null;
  };
  ai: {
    configured: boolean;
  };
  overallStatus: "ok" | "warn" | "error";
};

async function fetchDiagnostics(): Promise<DiagnosticsResponse> {
  const res = await fetch("/api/diagnostics", { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export function useDiagnostics() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["diagnostics"],
    queryFn: fetchDiagnostics,
    staleTime: 30 * 1000, // 30 seconds
  });

  const isAuthReady =
    data?.auth.configured &&
    data?.database.connected &&
    data?.database.schemaApplied;
  const isAiReady = data?.ai.configured;

  return {
    data: data ?? null,
    loading: isLoading,
    error: error?.message ?? null,
    refetch,
    isAuthReady: Boolean(isAuthReady),
    isAiReady: Boolean(isAiReady),
  };
}
