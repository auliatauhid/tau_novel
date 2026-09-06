import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { createNovelFromImport } from '@/lib/services/import-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Administrator.' }, { status: 403 });
    }

    const body = await req.json();
    const { metadata, chapters, publishNow, historyId } = body;

    if (!metadata || !metadata.title || !metadata.author) {
      return NextResponse.json({ error: 'Judul dan penulis novel wajib diisi.' }, { status: 400 });
    }

    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json({ error: 'Novel harus memiliki minimal 1 chapter.' }, { status: 400 });
    }

    const novel = await createNovelFromImport({
      metadata,
      chapters,
      publishNow: Boolean(publishNow),
      historyId,
    });

    return NextResponse.json({
      success: true,
      novelId: novel.id,
      slug: novel.slug,
      message: publishNow
        ? 'Novel berhasil dipublikasikan ke Taunovel!'
        : 'Novel berhasil disimpan sebagai Draft.',
    });
  } catch (error: any) {
    console.error('Create novel from import error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menyimpan novel hasil import.' },
      { status: 500 }
    );
  }
}
