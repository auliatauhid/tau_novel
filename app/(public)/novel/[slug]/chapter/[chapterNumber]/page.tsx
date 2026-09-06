import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getChapterByNumber } from '@/lib/services/chapter-service';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { getUserReadingProgress } from '@/lib/services/reading-progress-service';
import { incrementNovelViews } from '@/lib/services/novel-service';
import { ChapterReader } from '@/components/reader/ChapterReader';

interface Props {
  params: Promise<{ slug: string; chapterNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, chapterNumber } = await params;
  const num = parseInt(chapterNumber, 10);
  if (isNaN(num)) return { title: 'Chapter Tidak Ditemukan — Taunovel' };

  const data = await getChapterByNumber(slug, num);
  if (!data) return { title: 'Chapter Tidak Ditemukan — Taunovel' };

  return {
    title: `Bab ${data.chapter.chapterNumber}: ${data.chapter.title} — ${data.novel.title} | Taunovel`,
    description: `Baca bab ${data.chapter.chapterNumber} novel ${data.novel.title} online di Taunovel.`,
  };
}

export default async function ChapterReaderPage({ params }: Props) {
  const { slug, chapterNumber } = await params;
  const num = parseInt(chapterNumber, 10);

  if (isNaN(num)) {
    notFound();
  }

  const data = await getChapterByNumber(slug, num);
  if (!data) {
    notFound();
  }

  const user = await getCurrentUser();

  // Increment views
  await incrementNovelViews(data.novel.id, user?.id);

  // Fetch initial reading progress if logged in
  const progressRecord = user
    ? await getUserReadingProgress(user.id, data.novel.id)
    : null;

  const initialProgress =
    progressRecord && progressRecord.chapterId === data.chapter.id
      ? progressRecord.progress
      : 0;

  return (
    <ChapterReader
      novel={data.novel}
      chapter={data.chapter}
      prevChapterNumber={data.prevChapterNumber}
      nextChapterNumber={data.nextChapterNumber}
      totalChapters={data.totalChapters}
      allChapters={data.allChapters}
      initialProgress={initialProgress}
      isPreview={false}
    />
  );
}
