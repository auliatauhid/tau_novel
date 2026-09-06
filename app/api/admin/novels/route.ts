import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { createNovel } from '@/lib/services/novel-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { title, slug, author, description, coverUrl, language, status, published, genreIds } = body;

    if (!title || !author || !description) {
      return NextResponse.json({ error: 'Judul, penulis, dan deskripsi wajib diisi' }, { status: 400 });
    }

    const novel = await createNovel({
      title,
      slug,
      author,
      description,
      coverUrl,
      language,
      status,
      published,
      genreIds,
    });

    return NextResponse.json(novel, { status: 201 });
  } catch (error: any) {
    console.error('Error creating novel:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
