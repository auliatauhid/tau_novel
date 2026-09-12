'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { normalizeImageUrl } from '@/lib/utils/image-utils';
import {
  Link as LinkIcon,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  HelpCircle,
} from 'lucide-react';

interface CoverUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CoverUploadField({ value, onChange, disabled = false }: CoverUploadFieldProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'file'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset image load status when value changes
  useEffect(() => {
    if (!value) {
      setImageLoadError(false);
      setImageLoaded(false);
    } else {
      setImageLoadError(false);
      setImageLoaded(false);
    }
  }, [value]);

  const handleUrlChange = (newVal: string) => {
    onChange(newVal);
  };

  const handleUrlBlur = () => {
    if (value && value.trim()) {
      const normalized = normalizeImageUrl(value);
      if (normalized !== value) {
        onChange(normalized);
      }
    }
  };

  const handleFileSelected = async (file: File) => {
    if (!file) return;

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('Ukuran file gambar melebihi batas maksimal 5 MB.');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Format file tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau GIF.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/novels/upload-cover', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengunggah gambar cover.');
      }

      onChange(data.url);
      setActiveTab('url');
    } catch (err: any) {
      setUploadError(err.message || 'Terjadi kesalahan saat mengunggah file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setUploadError('');
    setImageLoadError(false);
    setImageLoaded(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
          <span>Cover Novel</span>
          <span className="text-[11px] font-normal text-stone-400 dark:text-stone-500">(Opsional)</span>
        </label>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>Tautan / URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'file'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Upload className="h-3 w-3" />
            <span>Upload Berkas</span>
          </button>
        </div>
      </div>

      {activeTab === 'url' ? (
        <div className="space-y-2">
          <div className="relative">
            <Input
              value={value}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleUrlBlur}
              disabled={disabled}
              placeholder="Contoh: https://images.unsplash.com/... atau tautan Google Drive / Dropbox"
              className="h-11 rounded-xl pr-10 font-mono text-xs"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-md"
                title="Hapus tautan cover"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-start gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
            <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-500" />
            <span>
              <strong>Didukung otomatis:</strong> Link gambar langsung (.jpg, .png, .webp), Google Drive (otomatis dikonversi ke direct link), Dropbox, Unsplash, Imgur, Pinterest, dll.
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelected(file);
            }}
            className="hidden"
            disabled={disabled || isUploading}
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (isUploading) return;
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileSelected(file);
            }}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
              isUploading
                ? 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-stone-300 dark:border-stone-700 hover:border-amber-500/60 dark:hover:border-amber-500/60 bg-stone-50/50 dark:bg-stone-950/30'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Mengunggah gambar cover...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-1.5">
                <Upload className="h-6 w-6 text-stone-400 dark:text-stone-500" />
                <div className="text-xs text-stone-600 dark:text-stone-400">
                  <span className="font-semibold text-amber-700 dark:text-amber-500">Klik untuk memilih gambar</span> atau seret file ke sini
                </div>
                <span className="text-[11px] text-stone-400 dark:text-stone-500">
                  PNG, JPG, WEBP, GIF (Maksimal 5 MB)
                </span>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
        </div>
      )}

      {/* Live Preview Section */}
      {value && (
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/80 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-stone-500" />
              <span>Preview Cover</span>
            </span>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 px-2 text-xs text-stone-500 hover:text-red-600 dark:hover:text-red-400"
            >
              Hapus Cover
            </Button>
          </div>

          <div className="flex items-start gap-3.5">
            {/* Thumbnail Box */}
            <div className="w-20 h-28 rounded-xl overflow-hidden border border-stone-300 dark:border-stone-700 shrink-0 shadow-xs relative bg-stone-100 dark:bg-stone-900">
              <img
                src={value}
                alt="Preview Cover"
                referrerPolicy="no-referrer"
                onLoad={() => {
                  setImageLoaded(true);
                  setImageLoadError(false);
                }}
                onError={() => {
                  setImageLoadError(true);
                  setImageLoaded(false);
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
            </div>

            {/* Status Information */}
            <div className="flex-1 min-w-0 space-y-1.5 pt-1">
              {imageLoaded && (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Gambar berhasil dimuat & valid</span>
                </div>
              )}

              {imageLoadError && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>Gambar gagal dimuat</span>
                  </div>
                  <p className="text-[11px] text-amber-700/90 dark:text-amber-400/90 leading-relaxed">
                    Pastikan tautan dapat diakses secara publik dan mengarah langsung ke file gambar (.jpg, .png, .webp). Jika menggunakan Google Drive, pastikan file memiliki izin <em>&quot;Siapa saja yang memiliki link&quot;</em>.
                  </p>
                </div>
              )}

              <p className="text-[11px] text-stone-500 dark:text-stone-400 break-all line-clamp-2 font-mono">
                {value}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
