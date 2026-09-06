import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { createChapter } from '@/lib/services/chapter-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { novelId, chapterNumber, title, content, published } = body;

    if (!novelId || !title || !content) {
      return NextResponse.json({ error: 'Novel ID, title, and content are required' }, { status: 400 });
    }

    const chapter = await createChapter({
      novelId,
      chapterNumber,
      title,
      content,
      published,
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
