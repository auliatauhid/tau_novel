import { prisma } from '@/lib/db/prisma';
import { User as UserIcon, Shield, Sparkles, BookMarked, Compass } from 'lucide-react';

export const metadata = {
  title: 'Pengguna — Taunovel Admin',
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          bookmarks: true,
          readingProgress: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>{users.length} Akun Terdaftar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Daftar Pengguna
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Daftar pembaca dan administrator yang memiliki akses ke platform Taunovel.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs overflow-x-auto shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100/70 dark:bg-stone-800/50 border-b border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Pengguna</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Peran (Role)</th>
              <th className="py-3.5 px-4">Bookmark</th>
              <th className="py-3.5 px-4">Progress Bacaan</th>
              <th className="py-3.5 px-4">Terdaftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-850/60 transition-colors">
                <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                      {u.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span>{u.name || 'Tanpa Nama'}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-stone-600 dark:text-stone-400 font-mono text-[11px]">
                  {u.email}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25'
                        : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {u.role === 'ADMIN' ? (
                      <Shield className="h-3 w-3 text-amber-600" />
                    ) : (
                      <UserIcon className="h-3 w-3 text-stone-500" />
                    )}
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-stone-700 dark:text-stone-300">
                  <span className="inline-flex items-center gap-1">
                    <BookMarked className="h-3 w-3 text-stone-400" />
                    {u._count.bookmarks}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-stone-700 dark:text-stone-300">
                  <span className="inline-flex items-center gap-1">
                    <Compass className="h-3 w-3 text-stone-400" />
                    {u._count.readingProgress}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-stone-400 whitespace-nowrap text-[11px]">
                  {new Date(u.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
