import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Administrator.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file gambar yang diunggah.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Harap gunakan format JPG, PNG, WEBP, GIF, atau AVIF.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file gambar melebihi batas maksimal (5 MB).' },
        { status: 400 }
      );
    }

    // Determine safe file extension
    let ext = '.jpg';
    if (file.type === 'image/png') ext = '.png';
    else if (file.type === 'image/webp') ext = '.webp';
    else if (file.type === 'image/gif') ext = '.gif';
    else if (file.type === 'image/avif') ext = '.avif';

    const safeFilename = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'covers');

    // Ensure upload directory exists
    await fs.promises.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, safeFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/covers/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
    });
  } catch (error: any) {
    console.error('Error uploading cover image:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal mengunggah gambar cover.' },
      { status: 500 }
    );
  }
}
