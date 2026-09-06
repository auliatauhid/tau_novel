import { prisma } from '@/lib/db/prisma';

export async function saveReadingProgress(
  userId: string,
  novelId: string,
  chapterId: string,
  progress: number
) {
  if (!userId) return null;

  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress * 10) / 10));

  return prisma.readingProgress.upsert({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
    update: {
      chapterId,
      progress: clampedProgress,
    },
    create: {
      userId,
      novelId,
      chapterId,
      progress: clampedProgress,
    },
  });
}

export async function getUserReadingProgress(userId: string, novelId: string) {
  if (!userId) return null;

  return prisma.readingProgress.findUnique({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
    include: {
      chapter: {
        select: {
          id: true,
          chapterNumber: true,
          title: true,
        },
      },
    },
  });
}

export async function getUserContinueReadingList(userId: string, limit = 4) {
  if (!userId) return [];

  const items = await prisma.readingProgress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      novel: {
        include: {
          genres: { include: { genre: true } },
          _count: { select: { chapters: true } },
        },
      },
      chapter: {
        select: {
          id: true,
          chapterNumber: true,
          title: true,
        },
      },
    },
  });

  return items.map((item) => ({
    id: item.id,
    progress: item.progress,
    updatedAt: item.updatedAt,
    chapter: item.chapter,
    novel: {
      ...item.novel,
      genres: item.novel.genres.map((g) => g.genre),
      chapterCount: item.novel._count.chapters,
    },
  }));
}
