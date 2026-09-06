import Link from 'next/link';
import {
  getFeaturedNovels,
  getLatestNovels,
  getPopularNovels,
  getAllGenres,
} from '@/lib/services/novel-service';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { getUserContinueReadingList } from '@/lib/services/reading-progress-service';
import { NovelGrid } from '@/components/novel/NovelGrid';
import { SearchBar } from '@/components/novel/SearchBar';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  Play,
} from 'lucide-react';

export default async function HomePage() {
  const user = await getCurrentUser();

  const [featured, latest, popular, genres, continueReading] = await Promise.all([
    getFeaturedNovels(),
    getLatestNovels(),
    getPopularNovels(),
    getAllGenres(),
    user ? getUserContinueReadingList(user.id, 4) : Promise.resolve([]),
  ]);
  const spotlight = featured && featured.length > 0 ? featured[0] : null;
  const remainingFeatured = featured && featured.length > 1 ? featured.slice(1) : featured;

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* HERO SECTION - CINEMATIC & EDITORIAL */}
      <section className="relative overflow-hidden border-b border-stone-200/70 dark:border-stone-800/70 bg-gradient-to-b from-[#f5f2ea]/80 via-[#f7f5f0] to-[#f7f5f0] dark:from-[#15171c] dark:via-[#111215] dark:to-[#111215] py-12 sm:py-20 transition-colors">
        {/* Subtle ambient light blur */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {spotlight ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Spotlight Editorial Copy */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700/80 shadow-2xs backdrop-blur-xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Koleksi Pilihan Editor</span>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {spotlight.genres?.map((g) => (
                      <Link
                        key={g.id}
                        href={`/novels?genre=${g.slug}`}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-200/60 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]">
                    <Link
                      href={`/novel/${spotlight.slug}`}
                      className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      {spotlight.title}
                    </Link>
                  </h1>

                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 font-medium">
                    Karya Penulis <span className="text-stone-900 dark:text-stone-200 font-semibold">{spotlight.author}</span>
                  </p>
                </div>

                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed max-w-xl">
                  {spotlight.description || 'Nikmati kisah mendalam dengan alur cerita yang memukau.'}
                </p>

                {/* Spotlight Actions & Search */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href={`/novel/${spotlight.slug}`}>
                    <Button size="lg" className="h-12 px-7 text-sm font-semibold shadow-md bg-[#1c1d21] hover:bg-[#2e2f38] text-white flex items-center gap-2">
                      <Play className="h-4 w-4 fill-current text-amber-400" />
                      <span>Baca Sekarang</span>
                    </Button>
                  </Link>
                  <Link href="/novels">
                    <Button variant="outline" size="lg" className="h-12 px-5 text-sm font-medium">
                      <span>Jelajahi Katalog</span>
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>

                {/* Instant Search in Hero */}
                <div className="pt-4 max-w-lg">
                  <SearchBar placeholder="Cari judul novel favoritmu..." />
                  {genres.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-3 overflow-x-auto scrollbar-none text-xs text-stone-500">
                      <span className="shrink-0 text-[11px] font-medium opacity-70">Tren:</span>
                      {genres.slice(0, 5).map((g) => (
                        <Link
                          key={g.id}
                          href={`/novels?genre=${g.slug}`}
                          className="shrink-0 px-2 py-0.5 rounded-md hover:bg-stone-200/70 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                        >
                          {g.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Spotlight Book Cover Display */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <Link
                  href={`/novel/${spotlight.slug}`}
                  className="group relative block w-60 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden book-cover-shadow book-spine-effect transition-transform duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                >
                  {spotlight.coverUrl ? (
                    <img
                      src={spotlight.coverUrl}
                      alt={spotlight.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 dark:from-stone-900 dark:to-stone-950">
                      <Sparkles className="h-12 w-12 text-amber-600 mb-3 opacity-60" />
                      <span className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
                        {spotlight.title}
                      </span>
                    </div>
                  )}
                  {/* Subtle glass badge overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-stone-950/70 backdrop-blur-md border border-white/10 text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                      Novel Pilihan
                    </span>
                    <span className="text-xs font-serif font-bold block truncate">
                      {spotlight.title}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 sm:py-10">
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700/80 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Perpustakaan Novel Digital Modern</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.12]">
                  Temukan kisah memikat berikutnya.
                </h1>

                <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed font-sans">
                  Baca novel online dengan pengalaman membaca yang tenang, elegan, dan dirancang khusus untuk kenyamanan mata Anda.
                </p>

                <div className="max-w-lg pt-1">
                  <SearchBar placeholder="Cari judul novel atau nama penulis..." />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href="/novels">
                    <Button size="lg" className="h-12 px-7 text-sm font-semibold shadow-md bg-[#1c1d21] hover:bg-[#2e2f38] text-white flex items-center gap-2">
                      <Play className="h-4 w-4 fill-current text-amber-400" />
                      <span>Jelajahi Novel</span>
                    </Button>
                  </Link>
                  <Link href="/novels?sort=popular">
                    <Button variant="outline" size="lg" className="h-12 px-5 text-sm font-medium">
                      <span>Paling Populer</span>
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-800 group">
                  <img
                    src="/images/library-cozy.jpg"
                    alt="Taunovel Digital Library"
                    className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Koleksi Terlengkap
                    </span>
                    <h3 className="font-serif font-bold text-lg leading-snug">
                      Ribuan Bab Cerita Siap Dibaca Kapan Saja
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Dari fantasi epik hingga drama romansa hangat, temukan kisah yang memikat imajinasi Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTINUE READING (IF LOGGED IN AND HAS PROGRESS) */}
      {continueReading.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Play className="h-3.5 w-3.5 fill-current" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Lanjutkan Membaca
              </h2>
            </div>
            <Link
              href="/library"
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 group"
            >
              <span>Semua Riwayat</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {continueReading.map((item) => (
              <Link
                key={item.id}
                href={`/novel/${item.novel.slug}/chapter/${item.chapter.chapterNumber}`}
                className="group p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-stone-900/80 hover:border-amber-500/40 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-700 dark:text-amber-400">
                    Bab {item.chapter.chapterNumber}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">{item.progress}%</span>
                </div>

                <div className="truncate">
                  <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors truncate text-sm">
                    {item.novel.title}
                  </h3>
                  <span className="text-xs text-stone-500 block truncate mt-0.5 font-sans">
                    {item.chapter.title}
                  </span>
                </div>

                <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED NOVELS */}
      {remainingFeatured && remainingFeatured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Novel Pilihan Editor
              </h2>
            </div>
            <Link
              href="/novels"
              className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 group"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <NovelGrid novels={remainingFeatured} />
        </section>
      )}

      {/* EDITORIAL LIBRARY SHOWCASE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 shadow-xs backdrop-blur-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Pengalaman Membaca Tenang</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
                Ruang Membaca Digital yang Dirancang Khusus untuk Kenyamanan Mata Anda
              </h2>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
                Nikmati novel-novel pilihan dengan tata letak buku editorial klasik, warna latar kertas hangat tanpa silau, dan mode baca bebas distraksi di ponsel maupun komputer.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/novels">
                  <Button className="h-11 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs">
                    Jelajahi Perpustakaan
                  </Button>
                </Link>
                <Link href="/novels?sort=popular">
                  <Button variant="outline" className="h-11 px-5 rounded-xl border-stone-300 dark:border-stone-700">
                    Koleksi Terpopuler
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-64 sm:h-80 lg:h-full min-h-[300px] relative overflow-hidden">
              <img
                src="/images/library-cozy.jpg"
                alt="Perpustakaan Digital Taunovel"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white/60 via-transparent to-transparent dark:from-stone-900/70 dark:via-transparent dark:to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR NOVELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-500/15 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Paling Populer
            </h2>
          </div>
          <Link
            href="/novels?sort=popular"
            className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <NovelGrid novels={popular} />
      </section>

      {/* LATEST NOVELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800/70 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-100">
              Rilis & Pembaruan Terbaru
            </h2>
          </div>
          <Link
            href="/novels?sort=latest"
            className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 group"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <NovelGrid novels={latest} />
      </section>

      {/* GENRES LIST */}
      {genres.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-t border-stone-200/70 dark:border-stone-800/70 pt-12 space-y-6">
            <div className="text-center max-w-md mx-auto space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
                Jelajahi Berdasarkan Genre
              </h2>
              <p className="text-xs text-stone-500">
                Pilih genre cerita yang sesuai dengan suasana hati dan preferensi Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/novels?genre=${genre.slug}`}
                  className="group p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-stone-900/80 hover:border-amber-500/50 dark:hover:border-amber-500/40 text-center transition-all shadow-2xs hover:shadow-sm hover:-translate-y-0.5"
                >
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors block">
                    {genre.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
