import Link from 'next/link';
import { getNovels, getAllGenres } from '@/lib/services/novel-service';
import { Button } from '@/components/ui/button';
import { FileUp, PlusCircle } from 'lucide-react';
import { AdminNovelsTable } from './AdminNovelsTable';

export default async function AdminNovelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    genre?: string;
    status?: any;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const query = resolvedParams.query || '';
  const genreSlug = resolvedParams.genre || '';
  const status = resolvedParams.status || undefined;

  const [{ novels, pagination }, genres] = await Promise.all([
    getNovels({
      page,
      limit: 15,
      query,
      genreSlug,
      status,
      publishedOnly: false, // Admin views ALL novels including drafts
      sort: 'latest',
    }),
    getAllGenres(),
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-1">
            <span>Katalog Master</span>
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            <span>{pagination.total} Novel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Kelola Novel
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Daftar seluruh novel terbit dan draft pada platform Taunovel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/novels/import">
            <Button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs">
              <FileUp className="h-4 w-4" />
              <span>Import Word</span>
            </Button>
          </Link>
          <Link href="/admin/novels/new">
            <Button variant="outline" className="flex items-center gap-2 rounded-xl border-stone-300 dark:border-stone-700 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:bg-stone-800">
              <PlusCircle className="h-4 w-4" />
              <span>Tambah Manual</span>
            </Button>
          </Link>
        </div>
      </div>

      <AdminNovelsTable
        novels={novels}
        pagination={pagination}
        genres={genres}
        currentQuery={query}
        currentGenre={genreSlug}
        currentStatus={status}
      />
    </div>
  );
}
