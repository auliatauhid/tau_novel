import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { toggleBookmark, isBookmarked } from '@/lib/services/bookmark-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu' }, { status: 401 });
    }

    const { novelId } = await req.json();
    if (!novelId) {
      return NextResponse.json({ error: 'Novel ID is required' }, { status: 400 });
    }

    const result = await toggleBookmark(user.id, novelId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Bookmark toggle error:', error);
    return NextResponse.json({ error: 'Failed to toggle bookmark' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ bookmarked: false });
    }

    const { searchParams } = new URL(req.url);
    const novelId = searchParams.get('novelId');

    if (!novelId) {
      return NextResponse.json({ error: 'Novel ID is required' }, { status: 400 });
    }

    const bookmarked = await isBookmarked(user.id, novelId);
    return NextResponse.json({ bookmarked });
  } catch (error: any) {
    console.error('Check bookmark error:', error);
    return NextResponse.json({ bookmarked: false });
  }
}
