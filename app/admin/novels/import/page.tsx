import { DocxImportClient } from './DocxImportClient';

export const metadata = {
  title: 'Import Novel Word (.docx) — Taunovel Admin',
};

export default function AdminDocxImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Import Dokumen Word (.docx)
        </h1>
        <p className="text-xs text-zinc-500">
          Unggah file Microsoft Word untuk mengekstrak metadata dan mendeteksi bab secara otomatis.
        </p>
      </div>

      <DocxImportClient />
    </div>
  );
}
