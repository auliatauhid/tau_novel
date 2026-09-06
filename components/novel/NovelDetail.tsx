'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Book, Play, Share2, Check, PenTool } from 'lucide-react';
import { BookmarkButton } from './BookmarkButton';
import { ChapterList } from './ChapterList';
import { Button } from '@/components/ui/button';

interface NovelDetailProps {
  novel: {
    id: string;
    title: string;
    slug: string;
    author: string;
    description: string;
    coverUrl?: string | null;
    language: string;
    status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
    published: boolean;
    genres: Array<{ id: string; name: string; slug: string }>;
    chapters: Array<{
      id: string;
      chapterNumber: number;
      title: string;
      createdAt: Date | string;
    }>;
    viewCount?: number;
    chapterCount?: number;
  };
  isBookmarked?: boolean;
  userProgress?: {
    chapterId: string;
    progress: number;
    chapter: {
      id: string;
      chapterNumber: number;
      title: string;
    };
  } | null;
}

export function NovelDetail({ novel, isBookmarked = false, userProgress }: NovelDetailProps) {
  const [copied, setCopied] = useState(false);

  const statusConfig = {
    ONGOING: { label: 'Ongoing', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-400' },
    COMPLETED: { label: 'Tamat', dot: 'bg-blue-500', text: 'text-blue-700 dark:text-blue-400' },
    HIATUS: { label: 'Hiatus', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400' },
  };

  const currentStatus = statusConfig[novel.status] || statusConfig.ONGOING;
  const firstChapter = novel.chapters[0];
  const continueChapter = userProgress?.chapter;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-12">
      {/* Subtle Atmospheric Ambient Background Glow */}
      {novel.coverUrl && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 opacity-15 dark:opacity-10 blur-3xl pointer-events-none -z-10 rounded-full"
          style={{
            backgroundImage: `radial-gradient(circle, #d97706 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Novel Header Info */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        {/* Book Cover */}
        <div className="w-56 sm:w-64 shrink-0 mx-auto md:mx-0">
          <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden book-cover-shadow book-spine-effect border border-stone-200/80 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 relative">
            {novel.coverUrl ? (
              <img
                src={novel.coverUrl}
                alt={novel.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-stone-400 dark:text-stone-600 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-200 dark:from-stone-900 dark:to-stone-950">
                <Book className="h-16 w-16 mb-3 opacity-40 text-amber-700/60" />
                <span className="font-serif font-bold text-sm text-stone-700 dark:text-stone-300">
                  {novel.title}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details & Action Controls */}
        <div className="flex-1 space-y-5 w-full">
          {/* Genre Badges & Status */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/70 dark:border-stone-700/70">
              <span className={`h-1.5 w-1.5 rounded-full ${currentStatus.dot}`} />
              <span>{currentStatus.label}</span>
            </span>

            {novel.genres.map((g) => (
              <Link
                key={g.id}
                href={`/novels?genre=${g.slug}`}
                className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100/90 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>

          {/* Title & Author */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.12]">
              {novel.title}
            </h1>

            <div className="flex items-center gap-2 text-sm sm:text-base text-stone-600 dark:text-stone-400 font-medium">
              <PenTool className="h-4 w-4 text-amber-600 dark:text-amber-500 opacity-80" />
              <span>Karya</span>
              <span className="text-stone-900 dark:text-stone-200 font-semibold">{novel.author}</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 py-3.5 px-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/70 text-xs sm:text-sm">
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-400 font-medium">Status</span>
              <span className={`font-semibold mt-0.5 ${currentStatus.text}`}>
                {currentStatus.label}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-400 font-medium">Total Bab</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                {novel.chapters.length} Bab
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-400 font-medium">Bahasa</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                {novel.language}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-stone-400 font-medium">Dibaca</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
                {(novel.viewCount ?? 0).toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Call-To-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {continueChapter ? (
              <Link href={`/novel/${novel.slug}/chapter/${continueChapter.chapterNumber}`}>
                <Button size="lg" className="h-12 px-6 text-sm font-semibold flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm">
                  <Play className="h-4 w-4 fill-current" />
                  <span>Lanjut Bab {continueChapter.chapterNumber} ({userProgress.progress}%)</span>
                </Button>
              </Link>
            ) : firstChapter ? (
              <Link href={`/novel/${novel.slug}/chapter/${firstChapter.chapterNumber}`}>
                <Button size="lg" className="h-12 px-7 text-sm font-semibold flex items-center gap-2 shadow-sm bg-[#1c1d21] hover:bg-[#2e2f38] text-white">
                  <Play className="h-4 w-4 fill-current text-amber-400" />
                  <span>Mulai Membaca</span>
                </Button>
              </Link>
            ) : (
              <Button size="lg" disabled className="h-12 text-sm opacity-50">
                Belum Ada Bab
              </Button>
            )}

            <BookmarkButton novelId={novel.id} initialBookmarked={isBookmarked} />

            <Button
              variant="outline"
              size="md"
              onClick={handleShare}
              className="h-12 px-4 rounded-xl text-stone-600 dark:text-stone-300"
              title="Salin tautan novel"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-600">Disalin</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Bagikan</span>
                </>
              )}
            </Button>
          </div>

          {/* Synopsis / Blurb */}
          <div className="pt-3 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 font-sans">
              Sinopsis Cerita
            </h2>
            <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line bg-white dark:bg-stone-900/60 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-2xs font-sans">
              {novel.description}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Section */}
      <div className="space-y-5 pt-8 border-t border-stone-200/70 dark:border-stone-800/70">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              Daftar Bab ({novel.chapters.length})
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pilih bab untuk mulai membaca cerita.
            </p>
          </div>
        </div>

        <ChapterList
          novelSlug={novel.slug}
          chapters={novel.chapters}
          lastReadChapterId={userProgress?.chapterId}
        />
      </div>
    </div>
  );
}
