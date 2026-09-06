import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CatalogHeaderProps {
  totalNovels: number;
}

export function CatalogHeader({ totalNovels }: CatalogHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Breadcrumb Context */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500">
        <Link
          href="/"
          className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors font-medium"
        >
          Beranda
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
        <span className="text-stone-700 dark:text-stone-300 font-semibold" aria-current="page">
          Katalog Novel
        </span>
      </nav>

      {/* Main Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-500/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Koleksi Digital Terkurasi</span>
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            <span>{totalNovels} Judul Tersedia</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Katalog Novel
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            Temukan cerita fiksi berkualitas dari berbagai genre pilihan. Mulai petualangan membaca Anda kapan saja dengan format baca yang nyaman.
          </p>
        </div>
      </div>
    </div>
  );
}
