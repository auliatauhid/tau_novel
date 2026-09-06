'use client';

import { useState, useRef } from 'react';
import { Bold, Italic, Heading, Quote, CornerDownLeft, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChapterEditorProps {
  initialData?: {
    id?: string;
    chapterNumber?: number;
    title?: string;
    content?: string;
    published?: boolean;
  };
  onSave: (data: { chapterNumber: number; title: string; content: string; published: boolean }) => Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

export function ChapterEditor({
  initialData,
  onSave,
  onCancel,
  isSaving = false,
}: ChapterEditorProps) {
  const [chapterNumber, setChapterNumber] = useState(initialData?.chapterNumber || 1);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [previewMode, setPreviewMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (startTag: string, endTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${startTag}${selectedText || 'teks'}${endTag}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, start + startTag.length + (selectedText.length || 4));
    }, 0);
  };

  const insertLineBreak = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const replacement = '<br />\n';

    setContent(content.substring(0, start) + replacement + content.substring(end));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      chapterNumber: Number(chapterNumber),
      title: title.trim(),
      content,
      published,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-1 space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Nomor Bab</label>
          <Input
            type="number"
            min={1}
            required
            value={chapterNumber}
            onChange={(e) => setChapterNumber(parseInt(e.target.value, 10) || 1)}
            className="h-10 rounded-xl"
          />
        </div>

        <div className="sm:col-span-3 space-y-1.5">
          <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">Judul Bab</label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Awal Pertemuan yang Tak Terduga"
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 border border-stone-200/80 dark:border-stone-800/80 rounded-2xl bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-xs">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection('<b>', '</b>')}
            title="Tebal (Bold)"
            className="h-8 px-2.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <Bold className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection('<i>', '</i>')}
            title="Miring (Italic)"
            className="h-8 px-2.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection('<h2>', '</h2>')}
            title="Subjudul (Heading)"
            className="h-8 px-2.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <Heading className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection('<blockquote>', '</blockquote>')}
            title="Kutipan (Quote)"
            className="h-8 px-2.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertLineBreak}
            title="Ganti Baris (Break)"
            className="h-8 px-2.5 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection('<p>', '</p>')}
            title="Paragraf"
            className="h-8 px-2.5 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
          >
            &para; Paragraf
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          className="h-8 px-3 text-xs flex items-center gap-1.5 rounded-xl border-stone-300 dark:border-stone-700"
        >
          {previewMode ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          <span>{previewMode ? 'Mode Edit' : 'Preview Tampilan'}</span>
        </Button>
      </div>

      {/* Editor or Preview Container */}
      {previewMode ? (
        <div className="p-6 sm:p-8 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-[#fbfbf9] dark:bg-[#15161a] min-h-[340px] max-h-[500px] overflow-y-auto">
          <div className="mb-6 pb-3 border-b border-stone-200/80 dark:border-stone-800 text-center">
            <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full">
              BAB {chapterNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">{title || 'Judul Bab'}</h2>
          </div>
          <div
            className="reader-content font-serif text-base sm:text-lg leading-relaxed text-stone-800 dark:text-stone-200 space-y-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          required
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tuliskan atau tempel konten bab di sini dalam format teks atau HTML (&lt;p&gt;, &lt;b&gt;, dsb)..."
          className="w-full p-4 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 font-mono text-xs sm:text-sm leading-relaxed text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
        />
      )}

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-800 dark:text-stone-200">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
          />
          <span>Publikasikan Bab ini langsung</span>
        </label>

        <div className="flex items-center gap-2">
          {onCancel && (
            <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isSaving} className="rounded-xl border-stone-300 dark:border-stone-700">
              Batal
            </Button>
          )}
          <Button type="submit" size="sm" disabled={isSaving} className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-xs">
            {isSaving ? 'Menyimpan...' : 'Simpan Bab'}
          </Button>
        </div>
      </div>
    </form>
  );
}
