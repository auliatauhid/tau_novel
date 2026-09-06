import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth-utils';
import { validateDocxFile, processDocxUpload } from '@/lib/services/import-service';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Administrator.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'File dokumen Word .docx wajib diunggah.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate file
    const validation = validateDocxFile({
      name: file.name,
      size: file.size,
      type: file.type,
      buffer,
    });

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await processDocxUpload(buffer, file.name, user.email || user.name || 'admin');

    return NextResponse.json({
      success: true,
      data: result.parsed,
      historyId: result.historyId,
    });
  } catch (error: any) {
    console.error('DOCX parsing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal memproses dokumen Word.' },
      { status: 500 }
    );
  }
}
