'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Search, ArrowUpDown, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ChapterListProps {
  novelSlug: string;
  chapters: Array<{
    id: string;
    chapterNumber: number;
    title: string;
    createdAt: Date | string;
  }>;
  currentChapterId?: string;
  lastReadChapterId?: string;
}

export function ChapterList({
  novelSlug,
  chapters,
  currentChapterId,
  lastReadChapterId,
}: ChapterListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredChapters = useMemo(() => {
    let result = [...chapters];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.chapterNumber.toString().includes(term)
      );
    }
    if (sortOrder === 'desc') {
      result.reverse();
    }
    return result;
  }, [chapters, searchTerm, sortOrder]);

  if (!chapters || chapters.length === 0) {
    return (
      <div className="py-12 text-center rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 text-sm text-stone-500 dark:text-stone-400 bg-stone-50/50 dark:bg-stone-900/30">
        Belum ada bab yang dipublikasikan untuk novel ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chapter Search and Sort Toolbar */}
      {chapters.length > 5 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/70">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nomor atau judul bab..."
              className="h-9 pl-9 text-xs rounded-xl bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800"
            />
          </div>

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors cursor-pointer self-end sm:self-auto"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-stone-400" />
            <span>
              {sortOrder === 'asc' ? 'Urutan Pertama (1 → N)' : 'Urutan Terakhir (N → 1)'}
            </span>
          </button>
        </div>
      )}

      {/* Chapters Container */}
      <div className="divide-y divide-stone-100 dark:divide-stone-800/70 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl overflow-hidden bg-white dark:bg-stone-900/70 shadow-2xs">
        {filteredChapters.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-400">
            Tidak ada bab yang cocok dengan pencarian &quot;{searchTerm}&quot;.
          </div>
        ) : (
          filteredChapters.map((ch) => {
            const isCurrent = currentChapterId === ch.id;
            const isLastRead = lastReadChapterId === ch.id;

            return (
              <Link
                key={ch.id}
                href={`/novel/${novelSlug}/chapter/${ch.chapterNumber}`}
                className={`flex items-center justify-between p-4 sm:px-5 hover:bg-stone-50 dark:hover:bg-stone-850/60 transition-colors group ${
                  isCurrent ? 'bg-amber-500/10 dark:bg-amber-500/15 font-medium' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 truncate">
                  <span className="inline-flex items-center justify-center h-7 w-9 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs font-mono font-bold text-stone-500 dark:text-stone-400 shrink-0">
                    #{ch.chapterNumber}
                  </span>
                  <div className="truncate">
                    <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors block truncate">
                      {ch.title}
                    </span>
                    {isLastRead && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Terakhir Dibaca
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-stone-400 shrink-0 ml-4">
                  <span className="hidden sm:inline-flex items-center gap-1 opacity-75">
                    <Clock className="h-3 w-3" />
                    {new Date(ch.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <ArrowRight className="h-4 w-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
