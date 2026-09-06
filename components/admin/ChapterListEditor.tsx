'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Scissors,
  Merge,
  Plus,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { ChapterEditor } from './ChapterEditor';

interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: Date | string;
}

interface ChapterListEditorProps {
  novelId: string;
  novelSlug: string;
  novelTitle: string;
  chapters: Chapter[];
}

export function ChapterListEditor({
  novelId,
  novelSlug,
  novelTitle,
  chapters: initialChapters,
}: ChapterListEditorProps) {
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);

  // States for modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [splitChapter, setSplitChapter] = useState<Chapter | null>(null);
  const [splitMarker, setSplitMarker] = useState('');
  const [splitTitle, setSplitTitle] = useState('');

  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [mergeIds, setMergeIds] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Reorder chapters (Move Up / Down)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === chapters.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...chapters];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Optimistically update
    setChapters(
      reordered.map((ch, i) => ({
        ...ch,
        chapterNumber: i + 1,
      }))
    );

    try {
      await fetch('/api/admin/chapters/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId,
          orderedChapterIds: reordered.map((c) => c.id),
        }),
      });
      router.refresh();
    } catch {
      router.refresh();
    }
  };

  // Delete chapter
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus bab "${title}"? Bab setelahnya akan dinomori ulang otomatis.`)) return;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/chapters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setChapters((prev) => prev.filter((c) => c.id !== id));
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create chapter
  const handleCreate = async (data: {
    chapterNumber: number;
    title: string;
    content: string;
    published: boolean;
  }) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          novelId,
          ...data,
        }),
      });
      if (res.ok) {
        setIsNewModalOpen(false);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Update chapter
  const handleUpdate = async (data: {
    chapterNumber: number;
    title: string;
    content: string;
    published: boolean;
  }) => {
    if (!editingChapter) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/chapters/${editingChapter.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setEditingChapter(null);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Split
  const handleExecuteSplit = async () => {
    if (!splitChapter) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/chapters/split', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: splitChapter.id,
          splitContent: splitMarker,
          newTitle: splitTitle,
        }),
      });
      if (res.ok) {
        setSplitChapter(null);
        setSplitMarker('');
        setSplitTitle('');
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Execute Merge
  const handleExecuteMerge = async () => {
    if (mergeIds.length !== 2) return;
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/chapters/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId1: mergeIds[0],
          chapterId2: mergeIds[1],
        }),
      });
      if (res.ok) {
        setIsMergeModalOpen(false);
        setMergeIds([]);
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-stone-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 mb-1">
            <span>Manajemen Bab</span>
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            <span>{chapters.length} Bab Terdaftar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Daftar Bab Novel
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Kelola teks bab untuk novel &ldquo;{novelTitle}&rdquo;, ubah urutan nomor bab, pisahkan (split) atau gabungkan (merge) bab novel.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMergeModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border-stone-300 dark:border-stone-700 text-xs font-semibold"
          >
            <Merge className="h-4 w-4" />
            <span>Gabung Bab</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Bab</span>
          </Button>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="p-16 text-center border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-3xl text-stone-400 space-y-2">
          <p className="font-serif font-bold text-base text-stone-700 dark:text-stone-300">Belum Ada Bab Terdaftar</p>
          <p className="text-xs">Klik tombol &ldquo;Tambah Bab&rdquo; di atas untuk mulai menulis bab pertama.</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100 dark:divide-stone-800/60 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl overflow-hidden bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs shadow-xs">
          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-stone-50/80 dark:hover:bg-stone-850/60 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg shrink-0">
                  #{ch.chapterNumber}
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {ch.title}
                    </h4>
                    {ch.published ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                        Draft
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-stone-400 block mt-0.5">
                    Diperbarui {new Date(ch.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReorder(idx, 'up')}
                  disabled={idx === 0 || isLoading}
                  title="Naikkan Urutan"
                  className="h-8 w-8 text-stone-500 hover:text-stone-900 rounded-lg"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReorder(idx, 'down')}
                  disabled={idx === chapters.length - 1 || isLoading}
                  title="Turunkan Urutan"
                  className="h-8 w-8 text-stone-500 hover:text-stone-900 rounded-lg"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>

                <a
                  href={`/novel/${novelSlug}/chapter/${ch.chapterNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg text-stone-500 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                  title="Lihat Reader"
                >
                  <Eye className="h-4 w-4" />
                </a>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSplitChapter(ch);
                    setSplitTitle(`${ch.title} (Bagian 2)`);
                  }}
                  title="Pecah Bab (Split)"
                  className="h-8 w-8 text-stone-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg"
                >
                  <Scissors className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingChapter(ch)}
                  title="Edit Bab"
                  className="h-8 w-8 text-stone-500 hover:text-stone-900 rounded-lg"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(ch.id, ch.title)}
                  disabled={isLoading}
                  title="Hapus Bab"
                  className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Chapter Modal */}
      {isNewModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsNewModalOpen(false)}
          title="Tambah Bab Baru"
          maxWidth="max-w-3xl"
        >
          <ChapterEditor
            initialData={{
              chapterNumber: chapters.length + 1,
              title: `Bab ${chapters.length + 1}`,
              content: '',
              published: true,
            }}
            onSave={handleCreate}
            onCancel={() => setIsNewModalOpen(false)}
            isSaving={isLoading}
          />
        </Modal>
      )}

      {/* Edit Chapter Modal */}
      {editingChapter && (
        <Modal
          isOpen={true}
          onClose={() => setEditingChapter(null)}
          title={`Edit Bab ${editingChapter.chapterNumber}: ${editingChapter.title}`}
          maxWidth="max-w-3xl"
        >
          <ChapterEditor
            initialData={editingChapter}
            onSave={handleUpdate}
            onCancel={() => setEditingChapter(null)}
            isSaving={isLoading}
          />
        </Modal>
      )}

      {/* Split Modal */}
      {splitChapter && (
        <Modal
          isOpen={true}
          onClose={() => setSplitChapter(null)}
          title={`Pecah Bab ${splitChapter.chapterNumber}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <p className="text-stone-600 dark:text-stone-400">
              Tentukan frasa teks di mana bab akan dipecah menjadi dua bagian. Konten setelah frasa ini akan menjadi bab baru.
            </p>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Judul Bab Baru
              </label>
              <Input
                value={splitTitle}
                onChange={(e) => setSplitTitle(e.target.value)}
                placeholder="Contoh: Bab 2 (Bagian 2)"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Frasa / Penanda Pemisah
              </label>
              <Input
                value={splitMarker}
                onChange={(e) => setSplitMarker(e.target.value)}
                placeholder="Contoh: *** atau kata pertama paragraf kedua"
                className="rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Button variant="outline" size="sm" onClick={() => setSplitChapter(null)} className="rounded-xl">
                Batal
              </Button>
              <Button size="sm" onClick={handleExecuteSplit} disabled={isLoading} className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
                Pecah Bab Sekarang
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Merge Modal */}
      {isMergeModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsMergeModalOpen(false)}
          title="Gabung 2 Bab Novel"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-stone-600 dark:text-stone-400">
              Pilih 2 bab yang ingin digabungkan secara berurutan:
            </p>

            <div className="space-y-2">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Bab Pertama</label>
              <select
                value={mergeIds[0] || ''}
                onChange={(e) => setMergeIds([e.target.value, mergeIds[1] || ''])}
                className="w-full h-10 px-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">Pilih Bab Pertama</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Bab {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Bab Kedua</label>
              <select
                value={mergeIds[1] || ''}
                onChange={(e) => setMergeIds([mergeIds[0] || '', e.target.value])}
                className="w-full h-10 px-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="">Pilih Bab Kedua</option>
                {chapters.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    Bab {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button variant="outline" size="sm" onClick={() => setIsMergeModalOpen(false)} className="rounded-xl">
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleExecuteMerge}
                disabled={isLoading || !mergeIds[0] || !mergeIds[1] || mergeIds[0] === mergeIds[1]}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
              >
                Gabung Bab
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
