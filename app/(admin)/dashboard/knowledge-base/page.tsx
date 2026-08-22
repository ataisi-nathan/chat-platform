'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export default function DocumentUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setStatus({ type: 'error', message: 'Please upload a valid PDF file.' });
      return;
    }
    setStatus(null);
    setFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ingest/pdf', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed.');
      }

      setStatus({
        type: 'success',
        message: `Successfully ingested "${data.documentName || file.name}" into ${data.chunkCount || 'vector'} chunks.`,
      });
      setFile(null);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Knowledge Base</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload PDF documentation to automatically embed and ground your chatbot responses.
          </p>
        </div>

        {/* Main Upload Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-950/30'
                : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              accept="application/pdf"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-blue-950/60 text-blue-400 rounded-full border border-blue-900/50">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-400 mt-1">PDF files only (max 10MB)</p>
              </div>
            </div>
          </div>

          {/* Selected File State */}
          {file && (
            <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-blue-400 shrink-0" />
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-100 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  disabled={loading}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    'Ingest Document'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <div
              className={`mt-4 p-4 rounded-lg border flex items-center gap-3 text-xs ${
                status.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              )}
              <p>{status.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}