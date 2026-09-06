import { prisma } from '@/lib/db/prisma';

export async function getChapterByNumber(novelSlug: string, chapterNumber: number) {
  const novel = await prisma.novel.findUnique({
    where: { slug: novelSlug },
    select: { id: true, title: true, slug: true, published: true },
  });

  if (!novel) return null;

  const chapter = await prisma.chapter.findUnique({
    where: {
      novelId_chapterNumber: {
        novelId: novel.id,
        chapterNumber,
      },
    },
  });

  if (!chapter) return null;

  // Get previous & next chapter info
  const [prevChapter, nextChapter, totalChapters] = await Promise.all([
    prisma.chapter.findFirst({
      where: {
        novelId: novel.id,
        chapterNumber: { lt: chapterNumber },
        published: true,
      },
      orderBy: { chapterNumber: 'desc' },
      select: { chapterNumber: true, title: true },
    }),
    prisma.chapter.findFirst({
      where: {
        novelId: novel.id,
        chapterNumber: { gt: chapterNumber },
        published: true,
      },
      orderBy: { chapterNumber: 'asc' },
      select: { chapterNumber: true, title: true },
    }),
    prisma.chapter.count({
      where: { novelId: novel.id, published: true },
    }),
  ]);

  const allChapters = await prisma.chapter.findMany({
    where: { novelId: novel.id, published: true },
    orderBy: { chapterNumber: 'asc' },
    select: { id: true, chapterNumber: true, title: true },
  });

  return {
    chapter,
    novel,
    prevChapterNumber: prevChapter?.chapterNumber ?? null,
    nextChapterNumber: nextChapter?.chapterNumber ?? null,
    totalChapters,
    allChapters,
  };
}

export async function getChapterById(id: string) {
  return prisma.chapter.findUnique({
    where: { id },
    include: {
      novel: {
        select: { id: true, title: true, slug: true },
      },
    },
  });
}

export async function createChapter(data: {
  novelId: string;
  chapterNumber?: number;
  title: string;
  content: string;
  published?: boolean;
}) {
  let number = data.chapterNumber;
  if (!number) {
    const maxCh = await prisma.chapter.findFirst({
      where: { novelId: data.novelId },
      orderBy: { chapterNumber: 'desc' },
      select: { chapterNumber: true },
    });
    number = (maxCh?.chapterNumber || 0) + 1;
  }

  return prisma.chapter.create({
    data: {
      novelId: data.novelId,
      chapterNumber: number,
      title: data.title,
      content: data.content,
      published: data.published ?? true,
    },
  });
}

export async function updateChapter(
  id: string,
  data: {
    title?: string;
    content?: string;
    chapterNumber?: number;
    published?: boolean;
  }
) {
  return prisma.chapter.update({
    where: { id },
    data,
  });
}

export async function deleteChapter(id: string) {
  const chapter = await prisma.chapter.findUnique({ where: { id } });
  if (!chapter) throw new Error('Chapter not found');

  const novelId = chapter.novelId;

  await prisma.chapter.delete({ where: { id } });

  // Re-normalize chapter numbers
  const remainingChapters = await prisma.chapter.findMany({
    where: { novelId },
    orderBy: { chapterNumber: 'asc' },
  });

  for (let i = 0; i < remainingChapters.length; i++) {
    const expectedNum = i + 1;
    if (remainingChapters[i].chapterNumber !== expectedNum) {
      await prisma.chapter.update({
        where: { id: remainingChapters[i].id },
        data: { chapterNumber: expectedNum },
      });
    }
  }

  return true;
}

export async function reorderChapters(novelId: string, orderedChapterIds: string[]) {
  for (let i = 0; i < orderedChapterIds.length; i++) {
    const newNumber = i + 1;
    await prisma.chapter.update({
      where: { id: orderedChapterIds[i] },
      data: { chapterNumber: newNumber },
    });
  }
  return true;
}

export async function splitChapter(
  chapterId: string,
  splitContentIndexOrHtml: string,
  newTitle?: string
) {
  const original = await prisma.chapter.findUnique({ where: { id: chapterId } });
  if (!original) throw new Error('Original chapter not found');

  const content = original.content;
  let part1 = '';
  let part2 = '';

  if (content.includes(splitContentIndexOrHtml)) {
    const parts = content.split(splitContentIndexOrHtml);
    part1 = parts[0].trim();
    part2 = parts.slice(1).join(splitContentIndexOrHtml).trim();
  } else {
    // Half split fallback
    const mid = Math.floor(content.length / 2);
    part1 = content.slice(0, mid).trim();
    part2 = content.slice(mid).trim();
  }

  // Update original chapter content
  await prisma.chapter.update({
    where: { id: chapterId },
    data: { content: part1 },
  });

  // Shift following chapters
  const following = await prisma.chapter.findMany({
    where: {
      novelId: original.novelId,
      chapterNumber: { gt: original.chapterNumber },
    },
    orderBy: { chapterNumber: 'desc' },
  });

  for (const ch of following) {
    await prisma.chapter.update({
      where: { id: ch.id },
      data: { chapterNumber: ch.chapterNumber + 1 },
    });
  }

  // Insert new chapter right after original
  const newChapter = await prisma.chapter.create({
    data: {
      novelId: original.novelId,
      chapterNumber: original.chapterNumber + 1,
      title: newTitle || `${original.title} (Bagian 2)`,
      content: part2,
      published: original.published,
    },
  });

  return newChapter;
}

export async function mergeChapters(chapterId1: string, chapterId2: string) {
  const [ch1, ch2] = await Promise.all([
    prisma.chapter.findUnique({ where: { id: chapterId1 } }),
    prisma.chapter.findUnique({ where: { id: chapterId2 } }),
  ]);

  if (!ch1 || !ch2) throw new Error('One or both chapters not found');
  if (ch1.novelId !== ch2.novelId) throw new Error('Chapters belong to different novels');

  const mergedContent = `${ch1.content}\n<hr />\n${ch2.content}`;

  // Keep ch1, update content
  await prisma.chapter.update({
    where: { id: ch1.id },
    data: { content: mergedContent },
  });

  // Delete ch2 & renormalize
  await deleteChapter(ch2.id);

  return true;
}
