import { notFound } from 'next/navigation';
import { getNovelById } from '@/lib/services/novel-service';
import { ChapterReader } from '@/components/reader/ChapterReader';

export const metadata = {
  title: 'Preview Reader — Taunovel Admin',
};

export default async function AdminNovelPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ chapter?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const novel = await getNovelById(id);
  if (!novel) {
    notFound();
  }

  if (novel.chapters.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Novel Belum Memiliki Chapter</h2>
        <p className="text-sm text-zinc-500 max-w-sm">
          Silakan tambahkan bab terlebih dahulu untuk melihat preview reader.
        </p>
      </div>
    );
  }

  const requestedChapterNumber = parseInt(resolvedSearchParams.chapter || '1', 10);
  const currentChapter =
    novel.chapters.find((c) => c.chapterNumber === requestedChapterNumber) || novel.chapters[0];

  const currentIndex = novel.chapters.findIndex((c) => c.id === currentChapter.id);
  const prevChapter = currentIndex > 0 ? novel.chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < novel.chapters.length - 1 ? novel.chapters[currentIndex + 1] : null;

  return (
    <ChapterReader
      novel={{
        id: novel.id,
        title: novel.title,
        slug: novel.slug,
      }}
      chapter={{
        id: currentChapter.id,
        chapterNumber: currentChapter.chapterNumber,
        title: currentChapter.title,
        content: currentChapter.content,
      }}
      prevChapterNumber={prevChapter ? prevChapter.chapterNumber : null}
      nextChapterNumber={nextChapter ? nextChapter.chapterNumber : null}
      totalChapters={novel.chapters.length}
      allChapters={novel.chapters.map((c) => ({
        id: c.id,
        chapterNumber: c.chapterNumber,
        title: c.title,
      }))}
      isPreview={true}
    />
  );
}
