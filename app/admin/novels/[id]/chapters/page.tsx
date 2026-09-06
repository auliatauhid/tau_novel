import { notFound } from 'next/navigation';
import { getNovelById } from '@/lib/services/novel-service';
import { ChapterListEditor } from '@/components/admin/ChapterListEditor';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminNovelChaptersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const novel = await getNovelById(id);

  if (!novel) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/novels/${novel.id}`}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs text-zinc-400">Kelola Bab Novel</span>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{novel.title}</h1>
        </div>
      </div>

      <ChapterListEditor
        novelId={novel.id}
        novelSlug={novel.slug}
        novelTitle={novel.title}
        chapters={novel.chapters}
      />
    </div>
  );
}
