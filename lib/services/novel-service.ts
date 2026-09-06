import { prisma } from '@/lib/db/prisma';
import { NovelStatus } from '@prisma/client';

export interface GetNovelsParams {
  page?: number;
  limit?: number;
  query?: string;
  genreSlug?: string;
  status?: NovelStatus;
  sort?: 'latest' | 'popular' | 'title';
  publishedOnly?: boolean;
}

export async function getNovels({
  page = 1,
  limit = 12,
  query = '',
  genreSlug = '',
  status,
  sort = 'latest',
  publishedOnly = true,
}: GetNovelsParams) {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (publishedOnly) {
    where.published = true;
  }

  if (query.trim()) {
    const q = query.trim();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { author: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (genreSlug) {
    where.genres = {
      some: {
        genre: {
          slug: genreSlug,
        },
      },
    };
  }

  if (status) {
    where.status = status;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'popular') {
    orderBy = { views: { _count: 'desc' } };
  } else if (sort === 'title') {
    orderBy = { title: 'asc' };
  }

  const [novels, total] = await Promise.all([
    prisma.novel.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        _count: {
          select: { chapters: true, views: true },
        },
      },
    }),
    prisma.novel.count({ where }),
  ]);

  return {
    novels: novels.map((n) => ({
      ...n,
      genres: n.genres.map((g) => g.genre),
      chapterCount: n._count.chapters,
      viewCount: n._count.views,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getNovelBySlug(slug: string) {
  const novel = await prisma.novel.findUnique({
    where: { slug },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
      _count: {
        select: { views: true },
      },
    },
  });

  if (!novel) return null;

  return {
    ...novel,
    genres: novel.genres.map((g) => g.genre),
    viewCount: novel._count.views,
    chapterCount: novel.chapters.length,
  };
}

export async function getNovelById(id: string) {
  const novel = await prisma.novel.findUnique({
    where: { id },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
      _count: {
        select: { views: true },
      },
    },
  });

  if (!novel) return null;

  return {
    ...novel,
    genres: novel.genres.map((g) => g.genre),
    viewCount: novel._count.views,
    chapterCount: novel.chapters.length,
  };
}

export async function getFeaturedNovels() {
  const novels = await prisma.novel.findMany({
    where: { published: true },
    take: 4,
    orderBy: { createdAt: 'desc' },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, views: true } },
    },
  });

  return novels.map((n) => ({
    ...n,
    genres: n.genres.map((g) => g.genre),
    chapterCount: n._count.chapters,
    viewCount: n._count.views,
  }));
}

export async function getLatestNovels() {
  const novels = await prisma.novel.findMany({
    where: { published: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, views: true } },
    },
  });

  return novels.map((n) => ({
    ...n,
    genres: n.genres.map((g) => g.genre),
    chapterCount: n._count.chapters,
    viewCount: n._count.views,
  }));
}

export async function getPopularNovels() {
  const novels = await prisma.novel.findMany({
    where: { published: true },
    take: 6,
    orderBy: { views: { _count: 'desc' } },
    include: {
      genres: { include: { genre: true } },
      _count: { select: { chapters: true, views: true } },
    },
  });

  return novels.map((n) => ({
    ...n,
    genres: n.genres.map((g) => g.genre),
    chapterCount: n._count.chapters,
    viewCount: n._count.views,
  }));
}

export async function getAllGenres() {
  return prisma.genre.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function incrementNovelViews(novelId: string, userId?: string) {
  try {
    await prisma.novelView.create({
      data: {
        novelId,
        userId: userId || null,
      },
    });
  } catch (e) {
    console.error('Failed to increment novel view:', e);
  }
}

export async function createNovel(data: {
  title: string;
  slug?: string;
  author: string;
  description: string;
  coverUrl?: string;
  language?: string;
  status?: NovelStatus;
  published?: boolean;
  genreIds?: string[];
}) {
  const slug = data.slug || generateSlug(data.title);

  return prisma.novel.create({
    data: {
      title: data.title,
      slug,
      author: data.author,
      description: data.description,
      coverUrl: data.coverUrl || null,
      language: data.language || 'Indonesia',
      status: data.status || NovelStatus.ONGOING,
      published: data.published ?? false,
      genres: data.genreIds
        ? {
            create: data.genreIds.map((genreId) => ({
              genre: { connect: { id: genreId } },
            })),
          }
        : undefined,
    },
  });
}

export async function updateNovel(
  id: string,
  data: {
    title?: string;
    slug?: string;
    author?: string;
    description?: string;
    coverUrl?: string;
    language?: string;
    status?: NovelStatus;
    published?: boolean;
    genreIds?: string[];
  }
) {
  // Reset genres if provided
  if (data.genreIds) {
    await prisma.novelGenre.deleteMany({ where: { novelId: id } });
  }

  return prisma.novel.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      author: data.author,
      description: data.description,
      coverUrl: data.coverUrl,
      language: data.language,
      status: data.status,
      published: data.published,
      genres: data.genreIds
        ? {
            create: data.genreIds.map((genreId) => ({
              genre: { connect: { id: genreId } },
            })),
          }
        : undefined,
    },
  });
}

export async function deleteNovel(id: string) {
  return prisma.novel.delete({
    where: { id },
  });
}

export async function togglePublishNovel(id: string, publishedState?: boolean) {
  const current = await prisma.novel.findUnique({ where: { id }, select: { published: true } });
  if (!current) throw new Error('Novel not found');

  const newStatus = publishedState !== undefined ? publishedState : !current.published;

  return prisma.novel.update({
    where: { id },
    data: { published: newStatus },
  });
}

export async function getAdminStats() {
  const [totalNovels, publishedNovels, draftNovels, totalChapters, totalUsers, totalViews] =
    await Promise.all([
      prisma.novel.count(),
      prisma.novel.count({ where: { published: true } }),
      prisma.novel.count({ where: { published: false } }),
      prisma.chapter.count(),
      prisma.user.count(),
      prisma.novelView.count(),
    ]);

  return {
    totalNovels,
    publishedNovels,
    draftNovels,
    totalChapters,
    totalUsers,
    totalViews,
  };
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
