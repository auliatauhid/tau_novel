'use client';

import { useState } from 'react';
import { DocxUploader } from '@/components/admin/DocxUploader';
import { ImportProgress, ImportStep } from '@/components/admin/ImportProgress';
import { ImportReview } from '@/components/admin/ImportReview';
import { ParsedResult } from '@/lib/docx-parser/types';

export function DocxImportClient() {
  const [step, setStep] = useState<ImportStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResult | null>(null);
  const [historyId, setHistoryId] = useState<string | undefined>();

  const handleFileSelected = async (file: File) => {
    setError(null);
    setStep('uploading');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate subtle stage transition
      setTimeout(() => setStep('reading'), 400);
      setTimeout(() => setStep('metadata'), 800);
      setTimeout(() => setStep('chapters'), 1200);
      setTimeout(() => setStep('processing'), 1600);

      const res = await fetch('/api/admin/novels/import/parse', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Gagal memproses file Word');
      }

      setStep('done');
      setParsedData(json.data);
      setHistoryId(json.historyId);
    } catch (err: any) {
      setError(err.message || 'Gagal mengimpor file DOCX');
      setStep('error');
    }
  };

  const handleReset = () => {
    setStep('idle');
    setError(null);
    setParsedData(null);
    setHistoryId(undefined);
  };

  // If parsing is done and we have data, show the Review UI
  if (parsedData) {
    return (
      <ImportReview
        initialResult={parsedData}
        historyId={historyId}
        onReset={handleReset}
      />
    );
  }

  // Otherwise show uploader or progress
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {step === 'idle' || step === 'error' ? (
        <DocxUploader onFileSelected={handleFileSelected} />
      ) : (
        <ImportProgress currentStep={step} error={error} />
      )}

      {step === 'error' && (
        <div className="text-center">
          <button
            onClick={handleReset}
            className="text-xs font-semibold text-amber-600 hover:underline"
          >
            Coba Unggah File Lain
          </button>
        </div>
      )}
    </div>
  );
}
