'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MatchScoreProps {
  score: number;
}

export function MatchScore({ score }: MatchScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 75) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className={`${getScoreBackground(score)} rounded-full p-8`}>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                {Math.round(score)}%
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Match
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
