import Link from 'next/link';
import { BookOpen, RotateCcw } from 'lucide-react';
import { NovelCard } from './NovelCard';
import { Button } from '@/components/ui/button';

interface NovelGridProps {
  novels: Array<{
    id: string;
    title: string;
    slug: string;
    author: string;
    coverUrl?: string | null;
    status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
    genres?: Array<{ id: string; name: string; slug: string }>;
    chapterCount?: number;
    viewCount?: number;
  }>;
  emptyMessage?: string;
  resetHref?: string;
}

export function NovelGrid({
  novels,
  emptyMessage = 'Tidak ada novel yang sesuai dengan kriteria yang dipilih.',
  resetHref = '/novels',
}: NovelGridProps) {
  if (!novels || novels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/30 text-center space-y-4 animate-fadeIn">
        <div className="h-16 w-16 rounded-3xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-700 dark:text-amber-400 border border-amber-500/20 shadow-xs">
          <BookOpen className="h-8 w-8 opacity-80" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 dark:text-stone-100">
            Tidak Menemukan Novel
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
            {emptyMessage}
          </p>
        </div>

        {resetHref && (
          <div className="pt-2">
            <Link href={resetHref}>
              <Button variant="outline" size="sm" className="rounded-xl inline-flex items-center gap-2 border-stone-300 dark:border-stone-700">
                <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                <span>Reset Filter & Pencarian</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 lg:gap-6">
      {novels.map((novel) => (
        <NovelCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}

