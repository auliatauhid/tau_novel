'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocxUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function DocxUploader({ onFileSelected, disabled = false }: DocxUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    setError(null);

    // Extension check
    if (!file.name.toLowerCase().endsWith('.docx')) {
      setError('Format file ditolak. Hanya berkas Microsoft Word berkestensi .docx yang diizinkan.');
      return;
    }

    // Size check (Max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('Ukuran file melebihi batas 25MB.');
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drag & drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
            : 'border-stone-300 dark:border-stone-700 hover:border-amber-500/60 dark:hover:border-amber-500/60 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs'
        } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Unggah Dokumen Novel (.docx)
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
              Tarik dan lepaskan file Microsoft Word novel Anda ke sini, atau klik untuk memilih file dari komputer.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200/80 dark:border-stone-700/80">
            <span>Hanya mendukung berkas .docx (Maks. 25MB)</span>
          </div>
        </div>
      </div>

      {/* Selected File Card */}
      {selectedFile && (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-3.5 truncate">
            <div className="h-11 w-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div className="truncate">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block truncate">
                {selectedFile.name}
              </span>
              <span className="text-xs text-stone-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Microsoft Word (.docx)
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="h-9 w-9 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-700 dark:text-red-300 text-xs font-medium animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Official Template Download Banner */}
      <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Panduan & Template Resmi Taunovel
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            Gunakan format template standar untuk deteksi otomatis bab, judul, dan sinopsis yang paling akurat.
          </p>
        </div>
        <a
          href="/templates/Template_Import_Novel.docx"
          download="Template_Import_Novel.docx"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors shrink-0"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Unduh Template .docx</span>
        </a>
      </div>
    </div>
  );
}
