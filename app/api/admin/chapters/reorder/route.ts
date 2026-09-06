import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { reorderChapters } from '@/lib/services/chapter-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { novelId, orderedChapterIds } = await req.json();

    if (!novelId || !Array.isArray(orderedChapterIds)) {
      return NextResponse.json({ error: 'Novel ID and ordered chapter IDs array required' }, { status: 400 });
    }

    await reorderChapters(novelId, orderedChapterIds);
    return NextResponse.json({ success: true, message: 'Chapters successfully reordered' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
