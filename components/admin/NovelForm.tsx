'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface NovelFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug?: string;
    author: string;
    description: string;
    coverUrl?: string | null;
    language?: string;
    status?: 'ONGOING' | 'COMPLETED' | 'HIATUS';
    published?: boolean;
    genres?: Genre[];
  };
  allGenres?: Genre[];
  isEdit?: boolean;
}

export function NovelForm({ initialData, allGenres = [], isEdit = false }: NovelFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverUrl, setCoverUrl] = useState(initialData?.coverUrl || '');
  const [language, setLanguage] = useState(initialData?.language || 'Indonesia');
  const [status, setStatus] = useState<'ONGOING' | 'COMPLETED' | 'HIATUS'>(
    initialData?.status || 'ONGOING'
  );
  const [published, setPublished] = useState(initialData?.published || false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(
    initialData?.genres?.map((g) => g.id) || []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleGenre = (genreId: string) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        title,
        slug: slug.trim() || undefined,
        author,
        description,
        coverUrl: coverUrl.trim() || undefined,
        language,
        status,
        published,
        genreIds: selectedGenreIds,
      };

      const url = isEdit ? `/api/admin/novels/${initialData?.id}` : '/api/admin/novels';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan novel');
      }

      router.push('/admin/novels');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-md border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs rounded-3xl p-2 sm:p-4">
      <CardHeader className="pb-4 border-b border-stone-100 dark:border-stone-800/80">
        <CardTitle className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
          {isEdit ? 'Edit Informasi Novel' : 'Tambah Novel Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 text-xs font-medium bg-red-500/10 text-red-700 dark:text-red-300 rounded-xl border border-red-500/20 animate-fadeIn">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Judul Novel <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Legenda Pedang Bintang"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Slug URL (Opsional)
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dibuat otomatis jika dikosongkan"
                className="h-11 rounded-xl font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Penulis <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nama penulis atau penerbit"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Status Rilis Novel
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-11 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="ONGOING">Ongoing (Sedang Berjalan)</option>
                <option value="COMPLETED">Completed (Tamat)</option>
                <option value="HIATUS">Hiatus (Dijeda Sementara)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Bahasa
              </label>
              <Input
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Indonesia"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                URL Cover Gambar
              </label>
              <Input
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... atau URL gambar eksternal"
                className="h-11 rounded-xl"
              />
              {coverUrl && (
                <div className="mt-2 flex items-center gap-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-950/50 border border-stone-200/80 dark:border-stone-800">
                  <div className="w-16 h-22 rounded-lg overflow-hidden border border-stone-300 dark:border-stone-700 shrink-0 shadow-xs relative">
                    <img src={coverUrl} alt="Preview Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                  </div>
                  <div className="text-xs text-stone-500 space-y-0.5">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block">Preview Cover Novel</span>
                    <span>Pastikan URL gambar dapat diakses secara publik dengan rasio vertikal (2:3 atau 3:4).</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Genre & Kategori
                </label>
                <span className="text-[11px] text-stone-400">Pilih satu atau lebih genre</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-0.5">
                {allGenres.map((genre) => {
                  const isChecked = selectedGenreIds.includes(genre.id);
                  return (
                    <button
                      type="button"
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200/80 dark:border-stone-700/80'
                      }`}
                    >
                      {genre.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                Sinopsis / Deskripsi <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan sinopsis lengkap novel yang menarik perhatian pembaca..."
                className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <input
                type="checkbox"
                id="publishCheckbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="publishCheckbox" className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 cursor-pointer">
                Langsung Publikasikan (Karya ini akan langsung dapat diakses dan dibaca oleh pengunjung)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-stone-200/80 dark:border-stone-800/80">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="rounded-xl border-stone-300 dark:border-stone-700"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs">
              {isLoading ? 'Menyimpan...' : isEdit ? 'Perbarui Novel' : 'Simpan Novel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
