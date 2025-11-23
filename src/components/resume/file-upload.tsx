'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';

interface DocumentType {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  createdAt: Date;
  contentLength?: number;
}

interface FileUploadProps {
  fileType: 'resume' | 'job_description';
  onUploadSuccess: (document: DocumentType) => void;
  label?: string;
}

export function FileUpload({ fileType, onUploadSuccess, label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt')) {
      setError('Only PDF and TXT files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      const uploadRes = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const uploadData = await uploadRes.json();

      // Process document to generate embeddings
      const processRes = await fetch('/api/documents/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: uploadData.document.id }),
      });

      if (!processRes.ok) {
        throw new Error('Failed to process document');
      }

      onUploadSuccess(uploadData.document);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const displayLabel = label || (fileType === 'resume' ? 'Upload Resume' : 'Upload Job Description');

  return (
    <div className="space-y-2">
      <label className="block">
        <input
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${fileType}`}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById(`file-upload-${fileType}`)?.click()}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {displayLabel}
            </>
          )}
        </Button>
      </label>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
