'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  strengths: string[];
  gaps: string[];
  insights: string[];
}

export function InsightsPanel({ strengths, gaps, insights }: InsightsPanelProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((strength, index) => (
                <li key={index} className="text-sm">
                  <span className="text-green-600 mr-2">•</span>
                  {strength}
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No strengths identified</p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <XCircle className="mr-2 h-5 w-5" />
            Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {gaps.length > 0 ? (
              gaps.map((gap, index) => (
                <li key={index} className="text-sm">
                  <span className="text-red-600 mr-2">•</span>
                  {gap}
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No gaps identified</p>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-blue-600">
            <Lightbulb className="mr-2 h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <li key={index} className="text-sm">
                  <span className="text-blue-600 mr-2">•</span>
                  {insight}
                </li>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No insights available</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
