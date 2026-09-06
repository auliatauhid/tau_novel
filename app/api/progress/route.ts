import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { saveReadingProgress } from '@/lib/services/reading-progress-service';
import { z } from 'zod';

const progressSchema = z.object({
  novelId: z.string().min(1),
  chapterId: z.string().min(1),
  progress: z.number().min(0).max(100),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = progressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const saved = await saveReadingProgress(
      user.id,
      result.data.novelId,
      result.data.chapterId,
      result.data.progress
    );

    return NextResponse.json({ success: true, progress: saved });
  } catch (error: any) {
    console.error('Error saving reading progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
