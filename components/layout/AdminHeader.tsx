'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AdminHeader({ title = 'Taunovel Admin', subtitle }: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-stone-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* User Pill */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60">
          <div className="h-7 w-7 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
            {session?.user?.name?.[0] || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 leading-tight flex items-center gap-1">
              <span>{session?.user?.name || 'Administrator'}</span>
              <ShieldCheck className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-[10px] text-stone-500 leading-tight truncate max-w-[140px]">
              {session?.user?.email || 'Administrator'}
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="h-9 px-3 rounded-xl text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          title="Keluar dari Admin"
        >
          <LogOut className="h-4 w-4 sm:mr-1.5" />
          <span className="hidden sm:inline text-xs font-semibold">Logout</span>
        </Button>
      </div>
    </header>
  );
}
