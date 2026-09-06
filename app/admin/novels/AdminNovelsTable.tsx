'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Search,
  Eye,
  Edit2,
  List,
  Trash2,
  Globe,
  Lock,
  ChevronLeft,
  ChevronRight,
  Book,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminNovelsTableProps {
  novels: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  genres: Array<{ id: string; name: string; slug: string }>;
  currentQuery: string;
  currentGenre: string;
  currentStatus?: string;
}

export function AdminNovelsTable({
  novels,
  pagination,
  genres,
  currentQuery,
  currentGenre,
  currentStatus,
}: AdminNovelsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(currentQuery);
  const [isActing, setIsActing] = useState(false);

  const updateParam = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val) {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTogglePublish = async (novelId: string, currentPublished: boolean) => {
    try {
      setIsActing(true);
      const res = await fetch(`/api/admin/novels/${novelId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsActing(false);
    }
  };

  const handleDelete = async (novelId: string, title: string) => {
    if (!confirm(`Hapus novel "${title}" beserta seluruh chapternya secara permanen?`)) return;

    try {
      setIsActing(true);
      const res = await fetch(`/api/admin/novels/${novelId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setIsActing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParam({ query: query.trim(), page: '1' });
          }}
          className="relative w-full sm:w-80"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau penulis..."
            className="pl-10 h-10 text-xs rounded-xl border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950/50"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={currentGenre}
            onChange={(e) => updateParam({ genre: e.target.value, page: '1' })}
            className="h-10 px-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950/50 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="">Semua Genre</option>
            {genres.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>

          <select
            value={currentStatus || ''}
            onChange={(e) => updateParam({ status: e.target.value, page: '1' })}
            className="h-10 px-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-950/50 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option value="">Semua Status</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="HIATUS">Hiatus</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100/70 dark:bg-stone-800/50 border-b border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Novel</th>
              <th className="py-3.5 px-4">Penulis</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Publikasi</th>
              <th className="py-3.5 px-4">Bab</th>
              <th className="py-3.5 px-4">Views</th>
              <th className="py-3.5 px-4">Diperbarui</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {novels.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-stone-400 space-y-2">
                  <Book className="h-8 w-8 mx-auto opacity-40 mb-2" />
                  <p className="font-medium text-stone-500">Tidak ada novel ditemukan.</p>
                  <p className="text-[11px]">Coba ubah kata kunci pencarian atau reset filter.</p>
                </td>
              </tr>
            ) : (
              novels.map((novel) => (
                <tr
                  key={novel.id}
                  className="hover:bg-amber-500/[0.06] dark:hover:bg-amber-500/[0.06] transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200 dark:border-stone-700 relative shadow-xs">
                        {novel.coverUrl ? (
                          <img
                            src={novel.coverUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Book className="h-4 w-4 opacity-60" />
                          </div>
                        )}
                        <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
                      </div>
                      <div className="max-w-[220px] truncate">
                        <Link
                          href={`/admin/novels/${novel.id}`}
                          className="font-serif font-bold text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 truncate block text-sm transition-colors"
                        >
                          {novel.title}
                        </Link>
                        <span className="text-[11px] text-stone-400 font-mono block truncate mt-0.5">
                          /{novel.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300 font-medium">
                    {novel.author}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                      {novel.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(novel.id, novel.published)}
                      disabled={isActing}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        novel.published
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                      }`}
                      title={novel.published ? 'Klik untuk Unpublish' : 'Klik untuk Publish'}
                    >
                      {novel.published ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                      <span>{novel.published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-semibold text-stone-800 dark:text-stone-200">
                    {novel.chapterCount}
                  </td>

                  <td className="py-3.5 px-4 text-stone-500 font-mono">
                    {novel.viewCount.toLocaleString('id-ID')}
                  </td>

                  <td className="py-3.5 px-4 text-stone-400 whitespace-nowrap text-[11px]">
                    {new Date(novel.updatedAt).toLocaleDateString('id-ID')}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View on public site */}
                      <Link
                        href={`/novel/${novel.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 transition-colors"
                        title="Lihat Website Publik"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      {/* Preview in reader */}
                      <Link
                        href={`/admin/novels/${novel.id}/preview`}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 transition-colors"
                        title="Preview Reader"
                      >
                        <Book className="h-4 w-4" />
                      </Link>

                      {/* Manage Chapters */}
                      <Link
                        href={`/admin/novels/${novel.id}/chapters`}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-blue-600 hover:bg-blue-500/10 dark:hover:bg-blue-500/15 transition-colors"
                        title="Kelola Bab"
                      >
                        <List className="h-4 w-4" />
                      </Link>

                      {/* Edit Metadata */}
                      <Link
                        href={`/admin/novels/${novel.id}`}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-500/10 dark:hover:bg-amber-500/15 transition-colors"
                        title="Edit Novel"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(novel.id, novel.title)}
                        disabled={isActing}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Hapus Novel"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 px-1">
          <span>
            Menampilkan halaman <strong className="text-stone-800 dark:text-stone-200">{pagination.page}</strong> dari{' '}
            <strong className="text-stone-800 dark:text-stone-200">{pagination.totalPages}</strong> ({pagination.total} novel)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParam({ page: (pagination.page - 1).toString() })}
              disabled={pagination.page <= 1}
              className="h-9 px-3 rounded-xl border-stone-200 dark:border-stone-700 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:bg-stone-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span>Sebelumnya</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateParam({ page: (pagination.page + 1).toString() })}
              disabled={pagination.page >= pagination.totalPages}
              className="h-9 px-3 rounded-xl border-stone-200 dark:border-stone-700 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:bg-stone-800"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
