'use client';

import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export type ImportStep =
  | 'idle'
  | 'uploading'
  | 'reading'
  | 'metadata'
  | 'chapters'
  | 'processing'
  | 'done'
  | 'error';

interface ImportProgressProps {
  currentStep: ImportStep;
  error?: string | null;
}

export function ImportProgress({ currentStep, error }: ImportProgressProps) {
  const steps: Array<{ id: ImportStep; label: string }> = [
    { id: 'uploading', label: 'Mengunggah berkas' },
    { id: 'reading', label: 'Membaca dokumen Word' },
    { id: 'metadata', label: 'Mengekstrak metadata novel' },
    { id: 'chapters', label: 'Mendeteksi bab & nomor urut' },
    { id: 'processing', label: 'Menormalkan & membersihkan konten' },
  ];

  const getStepStatus = (stepId: ImportStep) => {
    if (error) return 'error';
    const order: ImportStep[] = ['uploading', 'reading', 'metadata', 'chapters', 'processing', 'done'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex || currentStep === 'done') return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs shadow-md space-y-5 max-w-lg mx-auto animate-fadeIn">
      <div className="border-b border-stone-100 dark:border-stone-800/80 pb-3">
        <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100">
          Memproses Dokumen Word (.docx)
        </h4>
        <p className="text-xs text-stone-500 mt-0.5">
          Sistem sedang mengekstrak struktur novel dan mendeteksi bab secara otomatis...
        </p>
      </div>

      <div className="space-y-3.5">
        {steps.map((step) => {
          const status = getStepStatus(step.id);

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3.5 p-3 rounded-2xl text-xs transition-all ${
                status === 'active'
                  ? 'bg-amber-500/10 border border-amber-500/25'
                  : status === 'completed'
                  ? 'bg-emerald-500/5'
                  : 'opacity-60'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : status === 'active' ? (
                <Loader2 className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-spin shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-stone-300 dark:text-stone-700 shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <span
                  className={`font-semibold block ${
                    status === 'completed'
                      ? 'text-stone-900 dark:text-stone-200'
                      : status === 'active'
                      ? 'text-amber-800 dark:text-amber-300 font-bold'
                      : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-red-500/10 text-red-700 dark:text-red-300 text-xs font-medium border border-red-500/20 animate-fadeIn">
          {error}
        </div>
      )}
    </div>
  );
}
