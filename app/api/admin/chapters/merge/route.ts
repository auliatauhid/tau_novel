import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { mergeChapters } from '@/lib/services/chapter-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { chapterId1, chapterId2 } = await req.json();

    if (!chapterId1 || !chapterId2) {
      return NextResponse.json({ error: 'Both chapter IDs are required' }, { status: 400 });
    }

    await mergeChapters(chapterId1, chapterId2);
    return NextResponse.json({ success: true, message: 'Chapters successfully merged' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
