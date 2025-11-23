'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, X } from 'lucide-react';

interface DocumentCardProps {
  document: {
    id: string;
    fileName: string;
    fileType: string;
    mimeType: string;
    createdAt: Date;
    contentLength?: number;
  };
  onRemove?: (id: string) => void;
}

export function DocumentCard({ document, onRemove }: DocumentCardProps) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const getFileTypeLabel = (type: string) => {
    return type === 'resume' ? 'Resume' : 'Job Description';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-1">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {document.fileName}
              </p>
              <p className="text-xs text-muted-foreground">
                {getFileTypeLabel(document.fileType)} • {formatFileSize(document.contentLength)}
              </p>
            </div>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(document.id)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
