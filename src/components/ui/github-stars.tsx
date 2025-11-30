"use client";

import { useQuery } from "@tanstack/react-query";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubStarsProps {
  repo: string;
}

async function fetchGitHubStars(repo: string): Promise<number> {
  const response = await fetch(`https://api.github.com/repos/${repo}`);
  if (!response.ok) throw new Error("Failed to fetch");
  const data = await response.json();
  return data.stargazers_count;
}

export function GitHubStars({ repo }: GitHubStarsProps) {
  const { data: stars, isLoading } = useQuery({
    queryKey: ["github-stars", repo],
    queryFn: () => fetchGitHubStars(repo),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const formatStars = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={`https://github.com/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <Github className="h-4 w-4" />
        {isLoading ? "..." : stars !== undefined ? formatStars(stars) : "0"}
      </a>
    </Button>
  );
}