import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { splitChapter } from '@/lib/services/chapter-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { chapterId, splitContent, newTitle } = await req.json();

    if (!chapterId || !splitContent) {
      return NextResponse.json({ error: 'Chapter ID and split marker are required' }, { status: 400 });
    }

    const newChapter = await splitChapter(chapterId, splitContent, newTitle);
    return NextResponse.json({ success: true, newChapter });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
