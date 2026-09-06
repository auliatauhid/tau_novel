import { prisma } from '@/lib/db/prisma';
import { parseDocx, ParsedResult } from '@/lib/docx-parser';
import { NovelStatus } from '@prisma/client';
import { generateSlug } from './novel-service';

export interface DocxValidationResult {
  valid: boolean;
  error?: string;
}

export function validateDocxFile(file: {
  name: string;
  size: number;
  type?: string;
  buffer: Buffer;
}): DocxValidationResult {
  // 1. Extension check
  if (!file.name.toLowerCase().endsWith('.docx')) {
    return { valid: false, error: 'Format file tidak didukung. Hanya file Microsoft Word .docx yang diperbolehkan.' };
  }

  // 2. File size check (Max 25MB)
  const MAX_SIZE = 25 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Ukuran file melebihi batas maksimal (25MB).' };
  }

  // 3. Magic number check: DOCX is a zip archive, starts with PK\x03\x04 (0x50, 0x4B, 0x03, 0x04)
  if (file.buffer.length < 4) {
    return { valid: false, error: 'File korup atau kosong.' };
  }

  const isZip =
    file.buffer[0] === 0x50 &&
    file.buffer[1] === 0x4b &&
    (file.buffer[2] === 0x03 || file.buffer[2] === 0x05 || file.buffer[2] === 0x07) &&
    (file.buffer[3] === 0x04 || file.buffer[3] === 0x06 || file.buffer[3] === 0x08);

  if (!isZip) {
    return {
      valid: false,
      error: 'File bukan dokumen Word .docx yang valid (header berkas tidak sesuai). Tolak format .doc, .pdf, .txt, .exe, dll.',
    };
  }

  return { valid: true };
}

export async function processDocxUpload(
  buffer: Buffer,
  filename: string,
  userEmail: string
): Promise<{
  parsed: ParsedResult;
  historyId: string;
}> {
  const parsed = await parseDocx(buffer, filename);

  const history = await prisma.importHistory.create({
    data: {
      filename,
      importedBy: userEmail,
      status: parsed.status,
    },
  });

  return {
    parsed,
    historyId: history.id,
  };
}

export async function createNovelFromImport(params: {
  metadata: {
    title: string;
    slug?: string;
    author: string;
    description: string;
    coverUrl?: string;
    language?: string;
    status?: NovelStatus;
    genres: string[];
  };
  chapters: Array<{
    chapterNumber: number;
    title: string;
    content: string;
  }>;
  publishNow?: boolean;
  historyId?: string;
}) {
  const { metadata, chapters, publishNow = false, historyId } = params;

  // Resolve genres
  const genreConnects = [];
  for (const genreName of metadata.genres) {
    const trimmed = genreName.trim();
    if (!trimmed) continue;
    const slug = generateSlug(trimmed);
    const genre = await prisma.genre.upsert({
      where: { slug },
      update: {},
      create: {
        name: trimmed,
        slug,
      },
    });
    genreConnects.push({ genreId: genre.id });
  }

  let slug = metadata.slug ? generateSlug(metadata.slug) : generateSlug(metadata.title);
  // Ensure unique slug
  let slugExists = await prisma.novel.findUnique({ where: { slug } });
  let counter = 1;
  while (slugExists) {
    slug = `${generateSlug(metadata.title)}-${counter++}`;
    slugExists = await prisma.novel.findUnique({ where: { slug } });
  }

  const novel = await prisma.novel.create({
    data: {
      title: metadata.title,
      slug,
      author: metadata.author,
      description: metadata.description,
      coverUrl: metadata.coverUrl || null,
      language: metadata.language || 'Indonesia',
      status: metadata.status || NovelStatus.ONGOING,
      published: publishNow,
      genres: {
        create: genreConnects,
      },
      chapters: {
        create: chapters.map((ch, idx) => ({
          chapterNumber: ch.chapterNumber || idx + 1,
          title: ch.title,
          content: ch.content,
          published: true,
        })),
      },
    },
    include: {
      chapters: true,
      genres: { include: { genre: true } },
    },
  });

  if (historyId) {
    await prisma.importHistory.update({
      where: { id: historyId },
      data: {
        novelId: novel.id,
        status: publishNow ? 'PUBLISHED' : 'DRAFT_CREATED',
      },
    });
  }

  return novel;
}

export async function getImportHistories(limit = 10) {
  return prisma.importHistory.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      novel: {
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
        },
      },
    },
  });
}
