import { notFound } from 'next/navigation';
import { getNovelById, getAllGenres } from '@/lib/services/novel-service';
import { NovelForm } from '@/components/admin/NovelForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { List, Eye } from 'lucide-react';

export default async function AdminEditNovelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [novel, allGenres] = await Promise.all([
    getNovelById(id),
    getAllGenres(),
  ]);

  if (!novel) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-1">
            <span>Edit Metadata</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{novel.title}</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">Edit metadata, genre, dan status publikasi novel.</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/admin/novels/${novel.id}/chapters`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 rounded-xl border-stone-300 dark:border-stone-700">
              <List className="h-4 w-4" />
              <span>Kelola Bab ({novel.chapters.length})</span>
            </Button>
          </Link>
          <Link href={`/admin/novels/${novel.id}/preview`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 rounded-xl border-amber-500/30 bg-amber-500/5">
              <Eye className="h-4 w-4" />
              <span>Preview Reader</span>
            </Button>
          </Link>
        </div>
      </div>

      <NovelForm
        initialData={{
          id: novel.id,
          title: novel.title,
          slug: novel.slug,
          author: novel.author,
          description: novel.description,
          coverUrl: novel.coverUrl,
          language: novel.language,
          status: novel.status,
          published: novel.published,
          genres: novel.genres,
        }}
        allGenres={allGenres}
        isEdit={true}
      />
    </div>
  );
}
