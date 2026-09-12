import Link from 'next/link';
import { Layers } from 'lucide-react';
import { NovelCoverImage } from '@/components/novel/NovelCoverImage';

interface NovelCardProps {
  novel: {
    id: string;
    title: string;
    slug: string;
    author: string;
    description?: string;
    coverUrl?: string | null;
    status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
    genres?: Array<{ id: string; name: string; slug: string }>;
    chapterCount?: number;
    viewCount?: number;
  };
}

export function NovelCard({ novel }: NovelCardProps) {
  const statusConfig = {
    ONGOING: {
      label: 'Ongoing',
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-stone-950/70 text-emerald-300 border-stone-800/80 backdrop-blur-md',
    },
    COMPLETED: {
      label: 'Tamat',
      dotClass: 'bg-blue-500',
      badgeClass: 'bg-stone-950/70 text-blue-300 border-stone-800/80 backdrop-blur-md',
    },
    HIATUS: {
      label: 'Hiatus',
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-stone-950/70 text-amber-300 border-stone-800/80 backdrop-blur-md',
    },
  };

  const currentStatus = statusConfig[novel.status] || statusConfig.ONGOING;
  const primaryGenre = novel.genres && novel.genres.length > 0 ? novel.genres[0] : null;

  return (
    <Link
      href={`/novel/${novel.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
    >
      {/* 1. COVER: DOMINANT VISUAL ELEMENT */}
      <div className="relative aspect-[3/4] w-full bg-stone-100 dark:bg-stone-800/60 overflow-hidden book-spine-effect">
        <NovelCoverImage
          src={novel.coverUrl}
          alt={novel.title}
          fallbackTitle={novel.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        {/* Subtle Hover Overlay with CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-3 pointer-events-none">
          <span className="text-[11px] font-bold text-white bg-amber-600/90 backdrop-blur-xs px-3 py-1 rounded-full shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
            Baca
          </span>
        </div>

        {/* Status Badge (Subtle, Top Left) */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${currentStatus.badgeClass}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dotClass}`} />
            <span>{currentStatus.label}</span>
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT: Title -> Author -> Metadata */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5">
        {/* Title */}
        <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-[15px] leading-snug line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {novel.title}
        </h3>

        {/* Author */}
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1 font-sans">
          {novel.author}
        </p>

        {/* Metadata: Genre & Chapters */}
        <div className="mt-auto pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          {primaryGenre ? (
            <span className="font-medium text-stone-600 dark:text-stone-400 truncate max-w-[90px]">
              {primaryGenre.name}
            </span>
          ) : (
            <span className="text-stone-400">Fiksi</span>
          )}

          <div className="flex items-center gap-1 shrink-0" title={`${novel.chapterCount ?? 0} Bab`}>
            <Layers className="h-3.5 w-3.5 opacity-60 text-stone-400" />
            <span>{novel.chapterCount ?? 0} Bab</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

