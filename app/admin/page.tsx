import Link from 'next/link';
import {
  BookOpen,
  CheckCircle,
  FileText,
  Users,
  Eye,
  FileUp,
  PlusCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';
import { getAdminStats } from '@/lib/services/novel-service';
import { getImportHistories } from '@/lib/services/import-service';
import { prisma } from '@/lib/db/prisma';
import { Button } from '@/components/ui/button';

export default async function AdminDashboardPage() {
  const [stats, importHistories, recentNovels] = await Promise.all([
    getAdminStats(),
    getImportHistories(5),
    prisma.novel.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { chapters: true, views: true } },
      },
    }),
  ]);

  const statCards = [
    {
      label: 'Total Novel',
      value: stats.totalNovels,
      icon: BookOpen,
      bg: 'bg-blue-500/10 dark:bg-blue-400/10',
      color: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/20',
      desc: 'Semua karya dalam katalog',
    },
    {
      label: 'Novel Terbit',
      value: stats.publishedNovels,
      icon: CheckCircle,
      bg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
      color: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/20',
      desc: 'Dapat dibaca oleh publik',
    },
    {
      label: 'Novel Draft',
      value: stats.draftNovels,
      icon: FileText,
      bg: 'bg-amber-500/10 dark:bg-amber-400/10',
      color: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/20',
      desc: 'Belum dipublikasikan',
    },
    {
      label: 'Total Bab',
      value: stats.totalChapters,
      icon: Layers,
      bg: 'bg-purple-500/10 dark:bg-purple-400/10',
      color: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/20',
      desc: 'Konten bab tersimpan',
    },
    {
      label: 'Total Pengguna',
      value: stats.totalUsers,
      icon: Users,
      bg: 'bg-indigo-500/10 dark:bg-indigo-400/10',
      color: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/20',
      desc: 'Pembaca & administrator',
    },
    {
      label: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      bg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
      color: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/20',
      desc: 'Akumulasi tayangan novel',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-1">
            <Sparkles className="h-3 w-3" />
            <span>Editorial Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Dashboard Admin
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Ringkasan status platform membaca novel Taunovel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/novels/import">
            <Button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs">
              <FileUp className="h-4 w-4" />
              <span>Import Word (.docx)</span>
            </Button>
          </Link>
          <Link href="/admin/novels/new">
            <Button variant="outline" className="flex items-center gap-2 rounded-xl border-stone-300 dark:border-stone-700">
              <PlusCircle className="h-4 w-4" />
              <span>Tambah Novel</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs shadow-xs space-y-3 hover:border-stone-300 dark:hover:border-stone-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl ${card.bg} ${card.color} flex items-center justify-center border ${card.border}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 tracking-tight">
                  {card.value.toLocaleString('id-ID')}
                </div>
                <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                  {card.label}
                </div>
                <div className="text-[11px] text-stone-400 truncate mt-0.5">
                  {card.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Novels */}
        <div className="p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Novel Terakhir Diperbarui
              </h3>
              <p className="text-xs text-stone-500">Daftar novel yang baru saja diedit atau diimpor</p>
            </div>
            <Link
              href="/admin/novels"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline"
            >
              <span>Kelola Semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
            {recentNovels.map((novel) => (
              <div key={novel.id} className="py-3 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-12 rounded-md overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-stone-200/80 dark:border-stone-700/80">
                    {novel.coverUrl ? (
                      <img src={novel.coverUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <BookOpen className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="truncate">
                    <Link
                      href={`/admin/novels/${novel.id}`}
                      className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors truncate block"
                    >
                      {novel.title}
                    </Link>
                    <span className="text-xs text-stone-500 block truncate">
                      {novel.author} &bull; {novel._count.chapters} Bab &bull; {novel._count.views} Views
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      novel.published
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {novel.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Import History */}
        <div className="p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-stone-900/80 backdrop-blur-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-3">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Riwayat Impor Dokumen (.docx)
              </h3>
              <p className="text-xs text-stone-500">Berkas Microsoft Word yang diimpor ke sistem</p>
            </div>
            <Link
              href="/admin/novels/import"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline"
            >
              <span>Impor Baru</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {importHistories.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-400 space-y-2">
              <FileCheck className="h-8 w-8 mx-auto opacity-50" />
              <p>Belum ada riwayat impor dokumen Word.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {importHistories.map((hist) => (
                <div key={hist.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <FileUp className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate">
                        {hist.filename}
                      </span>
                      <span className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {new Date(hist.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      hist.status === 'SUCCESS' || hist.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                        : hist.status === 'NEEDS_REVIEW'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    {hist.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
