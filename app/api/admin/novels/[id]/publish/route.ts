import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { togglePublishNovel } from '@/lib/services/novel-service';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    let publishedState: boolean | undefined;

    try {
      const body = await req.json();
      if (body && typeof body.published === 'boolean') {
        publishedState = body.published;
      }
    } catch {
      // Body may be empty, which triggers simple toggle
    }

    const updated = await togglePublishNovel(id, publishedState);
    return NextResponse.json({
      success: true,
      published: updated.published,
      message: updated.published
        ? 'Novel berhasil dipublikasikan'
        : 'Novel dialihkan ke status Draft',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
