import { prisma } from '@/lib/db/prisma';

export async function toggleBookmark(userId: string, novelId: string) {
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_novelId: {
        userId,
        novelId,
      },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id },
    });
    return { bookmarked: false };
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        novelId,
      },
    });
    return { bookmarked: true };
  }
}

export async function isBookmarked(userId: string, novelId: string) {
  if (!userId) return false;

  const count = await prisma.bookmark.count({
    where: {
      userId,
      novelId,
    },
  });

  return count > 0;
}

export async function getUserBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      novel: {
        include: {
          genres: { include: { genre: true } },
          _count: { select: { chapters: true, views: true } },
        },
      },
    },
  });

  return bookmarks.map((b) => ({
    ...b.novel,
    genres: b.novel.genres.map((g) => g.genre),
    chapterCount: b.novel._count.chapters,
    viewCount: b.novel._count.views,
    bookmarkedAt: b.createdAt,
  }));
}
