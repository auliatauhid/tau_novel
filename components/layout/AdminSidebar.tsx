'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileUp,
  PlusCircle,
  Users,
  ArrowLeft,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/novels', label: 'Kelola Novel', icon: BookOpen, exact: false },
    { href: '/admin/novels/import', label: 'Import Word (.docx)', icon: FileUp, exact: true, badge: 'DOCX' },
    { href: '/admin/novels/new', label: 'Tambah Novel', icon: PlusCircle, exact: true },
    { href: '/admin/users', label: 'Pengguna', icon: Users, exact: true },
  ];

  return (
    <aside className="w-64 border-r border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md flex flex-col min-h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800/80">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl overflow-hidden bg-white shadow-2xs border border-stone-200/80 dark:border-stone-800 flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform">
            <img
              src="/logo.png"
              alt="Taunovel Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base leading-tight">
                Taunovel
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                Admin
              </span>
            </div>
            <span className="block text-[11px] text-stone-500">
              Workspace Editorial
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1.5">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Menu Manajemen
        </div>

        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && !pathname.includes('/import') && !pathname.includes('/new');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-amber-500/10 dark:hover:bg-stone-800 hover:text-amber-800 dark:hover:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400 dark:text-amber-600' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-stone-900/20 dark:text-stone-900'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Back to Reader */}
      <div className="p-3 border-t border-stone-200/80 dark:border-stone-800/80 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-stone-100 px-3 py-2 rounded-xl hover:bg-amber-500/10 dark:hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-stone-400" />
          <span>Kembali ke Website</span>
        </Link>
      </div>
    </aside>
  );
}
