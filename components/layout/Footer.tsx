'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const isReader =
    (pathname?.startsWith('/novel/') && pathname?.includes('/chapter/')) ||
    pathname?.includes('/preview');

  if (isReader) {
    return null; // Pure distraction-free reading canvas
  }
  return (
    <footer className="border-t border-stone-200/80 dark:border-stone-800/80 bg-[#f7f5ef]/80 dark:bg-[#0e0f12] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl overflow-hidden bg-white shadow-2xs border border-stone-200/80 dark:border-stone-800 flex items-center justify-center p-0.5">
                <img
                  src="/logo.png"
                  alt="Taunovel Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif">
                Taunovel
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md leading-relaxed font-sans">
              Platform membaca novel online dengan pengalaman membaca yang tenang, elegan, dan imersif. Menghubungkan pembaca dengan kisah-kisah memikat tanpa distraksi.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-200/60 dark:bg-stone-800 text-[11px] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Sistem Aktif & Terhubung
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 md:col-start-7 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-sans">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/novels" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Semua Novel
                </Link>
              </li>
              <li>
                <Link href="/novels?sort=popular" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Paling Populer
                </Link>
              </li>
              <li>
                <Link href="/library" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Library Saya
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-sans">
              Genre Pilihan
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/novels?genre=fantasy" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Fantasy
                </Link>
              </li>
              <li>
                <Link href="/novels?genre=action" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/novels?genre=romance" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Romance
                </Link>
              </li>
              <li>
                <Link href="/novels?genre=sci-fi" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider font-sans">
              Akun & Admin
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              <li>
                <Link href="/login" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Daftar Pembaca
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Panel Administrator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200/70 dark:border-stone-800/70 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-3">
          <p>&copy; {new Date().getFullYear()} Taunovel. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="italic font-serif opacity-75">
            Didesain untuk kenyamanan membaca novel digital.
          </p>
        </div>
      </div>
    </footer>
  );
}
