import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getNovelBySlug, incrementNovelViews } from '@/lib/services/novel-service';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { isBookmarked } from '@/lib/services/bookmark-service';
import { getUserReadingProgress } from '@/lib/services/reading-progress-service';
import { NovelDetail } from '@/components/novel/NovelDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);

  if (!novel) {
    return {
      title: 'Novel Tidak Ditemukan — Taunovel',
    };
  }

  return {
    title: `${novel.title} karya ${novel.author} — Taunovel`,
    description: novel.description.slice(0, 160),
    openGraph: {
      title: `${novel.title} — Taunovel`,
      description: novel.description.slice(0, 160),
      images: novel.coverUrl ? [{ url: novel.coverUrl }] : [],
    },
  };
}

export default async function NovelDetailPage({ params }: Props) {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);

  if (!novel) {
    notFound();
  }

  const user = await getCurrentUser();

  // Increment views
  await incrementNovelViews(novel.id, user?.id);

  // Check bookmark and user reading progress
  const [bookmarked, progress] = await Promise.all([
    user ? isBookmarked(user.id, novel.id) : Promise.resolve(false),
    user ? getUserReadingProgress(user.id, novel.id) : Promise.resolve(null),
  ]);

  return (
    <NovelDetail
      novel={novel}
      isBookmarked={bookmarked}
      userProgress={progress}
    />
  );
}
