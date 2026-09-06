'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Search, Shield, LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in reading mode, Navbar is hidden because reader has its own dedicated distraction-free chrome
  const isReader =
    (pathname?.startsWith('/novel/') && pathname?.includes('/chapter/')) ||
    pathname?.includes('/preview');

  if (isReader) {
    return null;
  }

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/novels', label: 'Katalog Novel' },
    { href: '/library', label: 'Library Saya' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/70 dark:border-stone-800/70 bg-[#f7f5f0]/90 dark:bg-[#111215]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl overflow-hidden bg-white shadow-2xs border border-stone-200/80 dark:border-stone-800 flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Taunovel Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif leading-none">
                Taunovel
              </span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-500 mt-0.5">
                Digital Library
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-stone-200/70 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-semibold shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-850'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick search shortcut pill */}
          <Link
            href="/novels"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-100/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-all group"
          >
            <Search className="h-3.5 w-3.5 text-stone-400 group-hover:text-amber-600 transition-colors" />
            <span className="hidden lg:inline">Cari novel atau penulis...</span>
            <span className="lg:hidden">Cari</span>
            <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md">
              /
            </kbd>
          </Link>

          {/* Mobile search icon */}
          <Link
            href="/novels"
            className="sm:hidden text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Cari novel"
          >
            <Search className="h-5 w-5" />
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-2">
              {/* If user is ADMIN, show link to Admin Dashboard */}
              {(session.user as any).role === 'ADMIN' && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center gap-1.5 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-xs font-semibold"
                  >
                    <Shield className="h-3.5 w-3.5 text-amber-600" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}

              <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-stone-200 dark:border-stone-800">
                <div className="h-7 w-7 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 text-xs font-semibold">
                  {session.user.name?.[0]?.toUpperCase() || <User className="h-3.5 w-3.5" />}
                </div>
                <div className="max-w-[120px] truncate text-left">
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block truncate leading-tight">
                    {session.user.name || 'Pembaca'}
                  </span>
                  <span className="text-[10px] text-stone-400 block truncate leading-tight">
                    {session.user.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="h-8 px-2 text-xs text-stone-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Keluar"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs font-medium">
                  Masuk
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm" className="text-xs shadow-xs font-semibold">
                  Daftar
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Menu navigasi"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 dark:border-stone-800 bg-[#faf9f6] dark:bg-[#111215] px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-850'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {session?.user && (session.user as any).role === 'ADMIN' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/40"
            >
              <Shield className="h-4 w-4 text-amber-600" />
              <span>Taunovel Admin Dashboard</span>
            </Link>
          )}

          {session?.user ? (
            <div className="pt-3 border-t border-stone-200/70 dark:border-stone-800/70 flex justify-between items-center px-3.5">
              <div className="truncate">
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block truncate">
                  {session.user.name || 'Pembaca'}
                </span>
                <span className="text-[11px] text-stone-400 block truncate">
                  {session.user.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="h-3.5 w-3.5 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-stone-200/70 dark:border-stone-800/70 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Masuk
                </Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
