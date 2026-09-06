'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Eye,
  Trash2,
  Edit2,
  Scissors,
  Merge,
  ArrowUp,
  ArrowDown,
  Save,
  Send,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { ChapterEditor } from './ChapterEditor';
import { ChapterReader } from '@/components/reader/ChapterReader';
import { ParsedResult, ParsedChapter } from '@/lib/docx-parser/types';

interface ImportReviewProps {
  initialResult: ParsedResult;
  historyId?: string;
  onReset: () => void;
}

export function ImportReview({ initialResult, historyId, onReset }: ImportReviewProps) {
  const router = useRouter();

  // 1. Metadata state
  const [metadata, setMetadata] = useState({
    title: initialResult.metadata.title || '',
    author: initialResult.metadata.author || '',
    genres: initialResult.metadata.genres || [],
    language: initialResult.metadata.language || 'Indonesia',
    status: initialResult.metadata.status || 'ONGOING',
    description: initialResult.metadata.description || '',
    coverUrl: '',
  });

  const [genreInput, setGenreInput] = useState(metadata.genres.join(', '));

  // 2. Chapters state
  const [chapters, setChapters] = useState<ParsedChapter[]>(initialResult.chapters || []);

  // 3. Modals state
  const [editingChapterIndex, setEditingChapterIndex] = useState<number | null>(null);
  const [splitChapterIndex, setSplitChapterIndex] = useState<number | null>(null);
  const [splitMarker, setSplitMarker] = useState('');
  const [splitNewTitle, setSplitNewTitle] = useState('');

  const [mergeSelectedIndices, setMergeSelectedIndices] = useState<number[]>([]);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);

  const [previewChapterIndex, setPreviewChapterIndex] = useState<number | null>(null);

  // 4. Save state
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Chapter operations
  const normalizeChapterNumbers = (list: ParsedChapter[]) => {
    return list.map((ch, idx) => ({
      ...ch,
      chapterNumber: idx + 1,
    }));
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === chapters.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newChapters = [...chapters];
    const temp = newChapters[index];
    newChapters[index] = newChapters[targetIndex];
    newChapters[targetIndex] = temp;

    setChapters(normalizeChapterNumbers(newChapters));
  };

  const deleteChapter = (index: number) => {
    if (!confirm(`Hapus bab "${chapters[index].title}"?`)) return;
    const updated = chapters.filter((_, i) => i !== index);
    setChapters(normalizeChapterNumbers(updated));
  };

  const handleSaveEditedChapter = async (data: {
    chapterNumber: number;
    title: string;
    content: string;
  }) => {
    if (editingChapterIndex === null) return;
    const updated = [...chapters];
    updated[editingChapterIndex] = {
      ...updated[editingChapterIndex],
      chapterNumber: data.chapterNumber,
      title: data.title,
      content: data.content,
    };
    setChapters(updated);
    setEditingChapterIndex(null);
  };

  const executeSplit = () => {
    if (splitChapterIndex === null) return;
    const target = chapters[splitChapterIndex];
    let part1 = '';
    let part2 = '';

    if (splitMarker.trim() && target.content.includes(splitMarker)) {
      const parts = target.content.split(splitMarker);
      part1 = parts[0].trim();
      part2 = parts.slice(1).join(splitMarker).trim();
    } else {
      // Split at halfway point
      const mid = Math.floor(target.content.length / 2);
      part1 = target.content.slice(0, mid).trim();
      part2 = target.content.slice(mid).trim();
    }

    const updated = [...chapters];
    updated[splitChapterIndex] = {
      ...target,
      content: part1,
    };

    const newChapter: ParsedChapter = {
      chapterNumber: target.chapterNumber + 1,
      title: splitNewTitle.trim() || `${target.title} (Bagian 2)`,
      content: part2,
    };

    updated.splice(splitChapterIndex + 1, 0, newChapter);
    setChapters(normalizeChapterNumbers(updated));

    setSplitChapterIndex(null);
    setSplitMarker('');
    setSplitNewTitle('');
  };

  const executeMerge = () => {
    if (mergeSelectedIndices.length < 2) return;
    const sortedIndices = [...mergeSelectedIndices].sort((a, b) => a - b);
    const firstIdx = sortedIndices[0];
    const firstCh = chapters[firstIdx];

    const mergedContent = sortedIndices
      .map((idx) => chapters[idx].content)
      .join('\n<hr />\n');

    const updated = chapters.filter((_, i) => !sortedIndices.includes(i) || i === firstIdx);
    const finalIndex = updated.findIndex((c) => c === firstCh);
    updated[finalIndex] = {
      ...firstCh,
      content: mergedContent,
    };

    setChapters(normalizeChapterNumbers(updated));
    setMergeSelectedIndices([]);
    setIsMergeModalOpen(false);
  };

  const handleSaveToDatabase = async (publishNow: boolean) => {
    setIsSaving(true);
    setErrorMessage('');

    try {
      const genresArray = genreInput
        .split(/[,;/]/)
        .map((g) => g.trim())
        .filter(Boolean);

      const payload = {
        metadata: {
          ...metadata,
          genres: genresArray,
        },
        chapters: chapters.map((ch) => ({
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          content: ch.content,
        })),
        publishNow,
        historyId,
      };

      const res = await fetch('/api/admin/novels/import/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal menyimpan novel hasil import');
      }

      await res.json();
      router.push(`/admin/novels`);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan novel');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Warnings & Status Banner */}
      {initialResult.warnings && initialResult.warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Peringatan Hasil Analisis Dokumen ({initialResult.warnings.length})</span>
          </div>
          <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-400 space-y-1">
            {initialResult.warnings.map((w, idx) => (
              <li key={idx}>{w.message}</li>
            ))}
          </ul>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs font-medium animate-fadeIn">
          {errorMessage}
        </div>
      )}

      {/* STEP 3: METADATA REVIEW */}
      <div className="p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800/80 pb-3">
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            <span>1. Review & Sesuaikan Metadata Novel</span>
          </h3>
          <span className="text-xs text-stone-400">Dapat diedit sebelum disimpan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Judul Novel <span className="text-red-500">*</span>
            </label>
            <Input
              value={metadata.title}
              onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
              placeholder="Judul Novel"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Penulis <span className="text-red-500">*</span>
            </label>
            <Input
              value={metadata.author}
              onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
              placeholder="Nama Penulis"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Genre (pisahkan dengan koma)
            </label>
            <Input
              value={genreInput}
              onChange={(e) => setGenreInput(e.target.value)}
              placeholder="Contoh: Fantasy, Action, Romance"
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Bahasa
            </label>
            <Input
              value={metadata.language}
              onChange={(e) => setMetadata({ ...metadata, language: e.target.value })}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Status Novel
            </label>
            <select
              value={metadata.status}
              onChange={(e) => setMetadata({ ...metadata, status: e.target.value as any })}
              className="w-full h-10 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="HIATUS">Hiatus</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              URL Cover Gambar (Opsional)
            </label>
            <Input
              value={metadata.coverUrl}
              onChange={(e) => setMetadata({ ...metadata, coverUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Sinopsis / Deskripsi
            </label>
            <textarea
              rows={4}
              value={metadata.description}
              onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
              placeholder="Sinopsis cerita novel..."
              className="w-full p-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* STEP 4: CHAPTER REVIEW & TOOLS */}
      <div className="p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800/80 pb-3">
          <div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
              2. Review & Kelola Bab ({chapters.length} Bab Terdeteksi)
            </h3>
            <p className="text-xs text-stone-500">
              Periksa bab yang terdeteksi. Anda dapat mengedit, menghapus, memecah (split), menggabung (merge), atau mengubah urutan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMergeModalOpen(true)}
              className="text-xs flex items-center gap-1.5 rounded-xl border-stone-300 dark:border-stone-700"
            >
              <Merge className="h-3.5 w-3.5" />
              <span>Gabung Bab (Merge)</span>
            </Button>
          </div>
        </div>

        {chapters.length === 0 ? (
          <div className="p-12 text-center text-sm text-stone-500 border border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
            Tidak ada bab terdeteksi. Silakan periksa kembali format dokumen Word atau gunakan template resmi.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-stone-800/60 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl overflow-hidden">
            {chapters.map((ch, idx) => (
              <div
                key={idx}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-stone-50/80 dark:hover:bg-stone-850/60 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg shrink-0">
                    #{ch.chapterNumber}
                  </span>
                  <div className="truncate">
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {ch.title}
                    </h4>
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      {ch.content ? `${ch.content.length.toLocaleString('id-ID')} karakter teks` : '⚠️ Konten kosong'}
                    </span>
                  </div>
                </div>

                {/* Chapter actions */}
                <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveChapter(idx, 'up')}
                    disabled={idx === 0}
                    title="Pindahkan Ke Atas"
                    className="h-8 w-8 text-stone-500 hover:text-stone-900 rounded-lg"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveChapter(idx, 'down')}
                    disabled={idx === chapters.length - 1}
                    title="Pindahkan Ke Bawah"
                    className="h-8 w-8 text-stone-500 hover:text-stone-900 rounded-lg"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPreviewChapterIndex(idx)}
                    title="Preview Reader"
                    className="h-8 w-8 text-stone-500 hover:text-amber-600 hover:bg-amber-500/10 rounded-lg"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSplitChapterIndex(idx);
                      setSplitNewTitle(`${ch.title} (Bagian 2)`);
                    }}
                    title="Pecah Bab (Split)"
                    className="h-8 w-8 text-stone-500 hover:text-blue-600 hover:bg-blue-500/10 rounded-lg"
                  >
                    <Scissors className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingChapterIndex(idx)}
                    title="Edit Konten"
                    className="h-8 w-8 text-stone-500 hover:text-stone-900 rounded-lg"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteChapter(idx)}
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
      </div>

      {/* STEP 5 & 6: PREVIEW, SAVE DRAFT, PUBLISH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xs shadow-md">
        <Button variant="outline" onClick={onReset} disabled={isSaving} className="rounded-xl border-stone-300 dark:border-stone-700">
          Batal & Unggah Ulang
        </Button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => handleSaveToDatabase(false)}
            disabled={isSaving || chapters.length === 0}
            className="flex-1 sm:flex-initial flex items-center gap-2 rounded-xl border-stone-300 dark:border-stone-700"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Draft</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => handleSaveToDatabase(true)}
            disabled={isSaving || chapters.length === 0}
            className="flex-1 sm:flex-initial flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs"
          >
            <Send className="h-4 w-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Publikasikan Novel'}</span>
          </Button>
        </div>
      </div>

      {/* Chapter Edit Modal */}
      {editingChapterIndex !== null && (
        <Modal
          isOpen={true}
          onClose={() => setEditingChapterIndex(null)}
          title={`Edit Bab ${chapters[editingChapterIndex].chapterNumber}: ${chapters[editingChapterIndex].title}`}
          maxWidth="max-w-3xl"
        >
          <ChapterEditor
            initialData={chapters[editingChapterIndex]}
            onSave={handleSaveEditedChapter}
            onCancel={() => setEditingChapterIndex(null)}
          />
        </Modal>
      )}

      {/* Split Modal */}
      {splitChapterIndex !== null && (
        <Modal
          isOpen={true}
          onClose={() => setSplitChapterIndex(null)}
          title={`Pecah Bab ${chapters[splitChapterIndex].chapterNumber}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4 text-xs">
            <p className="text-stone-600 dark:text-stone-400">
              Tentukan teks atau kata pemisah (misal: <code>***</code> atau <code>---</code> atau cuplikan kalimat) di mana bab akan dipecah menjadi dua. Jika dikosongkan, bab akan dipecah tepat di tengah konten.
            </p>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Judul Bab Baru (Bab Kedua)
              </label>
              <Input
                value={splitNewTitle}
                onChange={(e) => setSplitNewTitle(e.target.value)}
                placeholder="Contoh: Bab 1 (Lanjutan)"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">
                Tanda / Frasa Pemisah
              </label>
              <Input
                value={splitMarker}
                onChange={(e) => setSplitMarker(e.target.value)}
                placeholder="Contoh: *** atau kata pertama paragraf kedua"
                className="rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Button variant="outline" size="sm" onClick={() => setSplitChapterIndex(null)} className="rounded-xl">
                Batal
              </Button>
              <Button size="sm" onClick={executeSplit} className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white">
                Lakukan Split
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
          title="Gabung Bab (Merge)"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-stone-600 dark:text-stone-400">
              Pilih minimal 2 bab yang ingin digabungkan isinya menjadi satu:
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2 border p-2 rounded-xl border-stone-200 dark:border-stone-800">
              {chapters.map((ch, idx) => {
                const isSelected = mergeSelectedIndices.includes(idx);
                return (
                  <label
                    key={idx}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300' : 'hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setMergeSelectedIndices((prev) =>
                          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                        );
                      }}
                      className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium">
                      Bab {ch.chapterNumber}: {ch.title}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <Button variant="outline" size="sm" onClick={() => setIsMergeModalOpen(false)} className="rounded-xl">
                Batal
              </Button>
              <Button
                size="sm"
                onClick={executeMerge}
                disabled={mergeSelectedIndices.length < 2}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white"
              >
                Gabungkan Bab
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Live Reader Preview Modal */}
      {previewChapterIndex !== null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-50 dark:bg-stone-950">
          <ChapterReader
            novel={{
              id: 'preview-id',
              title: metadata.title || 'Novel Preview',
              slug: 'preview-slug',
            }}
            chapter={{
              id: `preview-ch-${previewChapterIndex}`,
              chapterNumber: chapters[previewChapterIndex].chapterNumber,
              title: chapters[previewChapterIndex].title,
              content: chapters[previewChapterIndex].content,
            }}
            prevChapterNumber={
              previewChapterIndex > 0 ? chapters[previewChapterIndex - 1].chapterNumber : null
            }
            nextChapterNumber={
              previewChapterIndex < chapters.length - 1
                ? chapters[previewChapterIndex + 1].chapterNumber
                : null
            }
            totalChapters={chapters.length}
            allChapters={chapters.map((c) => ({
              id: `preview-${c.chapterNumber}`,
              chapterNumber: c.chapterNumber,
              title: c.title,
            }))}
            isPreview={true}
          />

          <div className="fixed bottom-6 right-6 z-50">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setPreviewChapterIndex(null)}
              className="shadow-xl bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl"
            >
              Tutup Preview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
