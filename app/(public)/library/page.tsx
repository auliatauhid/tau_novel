import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { getUserBookmarks } from '@/lib/services/bookmark-service';
import { getUserContinueReadingList } from '@/lib/services/reading-progress-service';
import { NovelGrid } from '@/components/novel/NovelGrid';
import { NovelCoverImage } from '@/components/novel/NovelCoverImage';
import { Button } from '@/components/ui/button';
import { BookMarked, Play, Bookmark, BookOpen, Compass, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Library Saya — Taunovel',
  description: 'Riwayat bacaan dan novel yang Anda simpan di Taunovel.',
};

export default async function LibraryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-inner">
          <BookMarked className="h-10 w-10" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center text-xs font-bold shadow-md">
            +
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Perpustakaan Pribadi Anda
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            Masuk atau buat akun untuk menyimpan novel favorit, melanjutkan chapter terakhir yang dibaca, dan sinkronisasi otomatis di seluruh perangkat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link href="/login?callbackUrl=/library" className="flex-1">
            <Button size="lg" className="w-full h-11 rounded-xl shadow-xs">
              Masuk ke Akun
            </Button>
          </Link>
          <Link href="/register" className="flex-1">
            <Button variant="outline" size="lg" className="w-full h-11 rounded-xl border-stone-300 dark:border-stone-700">
              Daftar Akun Baru
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800/80">
          <Link
            href="/novels"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 transition-colors"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Jelajahi Novel Tanpa Masuk</span>
          </Link>
        </div>
      </div>
    );
  }

  const [bookmarks, continueReading] = await Promise.all([
    getUserBookmarks(user.id),
    getUserContinueReadingList(user.id, 12),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-2">
            <span>Perpustakaan Saya</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Library
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            Halo <strong className="text-stone-900 dark:text-stone-200">{user.name || 'Pembaca'}</strong>, lanjutkan petualangan cerita favorit Anda dari bab terakhir.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/novels">
            <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 border-stone-200 dark:border-stone-800">
              <Compass className="h-4 w-4 text-amber-600" />
              <span>Cari Novel Lain</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* SECTION 1: CONTINUE READING */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Play className="h-4 w-4 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Sedang Dibaca
              </h2>
              <span className="text-xs text-stone-500">
                {continueReading.length} novel tersimpan dengan progress membaca
              </span>
            </div>
          </div>
        </div>

        {continueReading.length === 0 ? (
          <div className="p-8 sm:p-12 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-white/40 dark:bg-stone-900/30 space-y-3">
            <BookOpen className="h-8 w-8 mx-auto text-stone-400" />
            <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Belum ada riwayat novel yang sedang dibaca.
            </p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Buka novel mana saja di katalog dan mulai membaca. Halaman bacaan akan otomatis tercatat di sini!
            </p>
            <div className="pt-2">
              <Link href="/novels">
                <Button size="sm" className="rounded-xl">
                  Buka Katalog Novel
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueReading.map((item) => (
              <Link
                key={item.id}
                href={`/novel/${item.novel.slug}/chapter/${item.chapter.chapterNumber}`}
                className="group relative flex gap-4 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/70 backdrop-blur-xs hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Book Thumbnail */}
                <div className="w-16 h-22 rounded-lg shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 relative shadow-sm">
                  <NovelCoverImage
                    src={item.novel.coverUrl}
                    alt={item.novel.title}
                    fallbackIcon={<BookOpen className="h-6 w-6 opacity-60" />}
                    fallbackClassName="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100 dark:bg-stone-800"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/25 via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Info & Progress */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                        Bab {item.chapter.chapterNumber}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {item.progress}%
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors truncate">
                      {item.novel.title}
                    </h3>
                    <p className="text-xs text-stone-500 truncate">
                      {item.chapter.title}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 group-hover:text-amber-600 transition-colors">
                      <span>Lanjut Baca</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: BOOKMARKS */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
            <Bookmark className="h-4 w-4 fill-current" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Bookmark Disimpan
            </h2>
            <span className="text-xs text-stone-500">
              {bookmarks.length} novel tersimpan di perpustakaan Anda
            </span>
          </div>
        </div>

        <NovelGrid
          novels={bookmarks as any}
          emptyMessage="Anda belum menambahkan novel ke daftar bookmark. Buka halaman novel mana saja dan klik tombol 'Simpan ke Library' untuk mengoleksinya."
        />
      </section>
    </div>
  );
}
