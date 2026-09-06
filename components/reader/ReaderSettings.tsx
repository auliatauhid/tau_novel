'use client';

import {
  Settings,
  Sun,
  Moon,
  Coffee,
  Leaf,
  CloudMoon,
  AlignJustify,
  AlignLeft,
  Check,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export type ReaderTheme = 'cream' | 'sepia' | 'sage' | 'dusk' | 'dark' | 'light';
export type ReaderFontFamily = 'serif' | 'sans' | 'mono';
export type ReaderFontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';
export type ReaderLineHeight = 'compact' | 'normal' | 'loose';
export type ReaderWidth = 'compact' | 'normal' | 'wide';
export type ReaderAlign = 'justify' | 'left';

export interface ReaderSettingsProps {
  theme: ReaderTheme;
  setTheme: (t: ReaderTheme) => void;
  fontFamily: ReaderFontFamily;
  setFontFamily: (f: ReaderFontFamily) => void;
  fontSize: ReaderFontSize;
  setFontSize: (s: ReaderFontSize) => void;
  lineHeight: ReaderLineHeight;
  setLineHeight: (l: ReaderLineHeight) => void;
  width: ReaderWidth;
  setWidth: (w: ReaderWidth) => void;
  align: ReaderAlign;
  setAlign: (a: ReaderAlign) => void;
  indent: boolean;
  setIndent: (i: boolean) => void;
}

export function ReaderSettings({
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  width,
  setWidth,
  align,
  setAlign,
  indent,
  setIndent,
}: ReaderSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themes: Array<{
    id: ReaderTheme;
    name: string;
    sublabel: string;
    icon: any;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }> = [
    {
      id: 'cream',
      name: 'Cream',
      sublabel: 'Mata Nyaman',
      icon: Coffee,
      bgClass: 'bg-[#f7f4ea]',
      textClass: 'text-[#2c2621]',
      borderClass: 'border-[#dfd8c5]',
    },
    {
      id: 'sepia',
      name: 'Sepia',
      sublabel: 'Kertas Antik',
      icon: Coffee,
      bgClass: 'bg-[#eee4cc]',
      textClass: 'text-[#3e301d]',
      borderClass: 'border-[#d8caa8]',
    },
    {
      id: 'sage',
      name: 'Sage',
      sublabel: 'Hijau Teduh',
      icon: Leaf,
      bgClass: 'bg-[#eaf1eb]',
      textClass: 'text-[#1e3327]',
      borderClass: 'border-[#cfded1]',
    },
    {
      id: 'dusk',
      name: 'Dusk',
      sublabel: 'Malam Slate',
      icon: CloudMoon,
      bgClass: 'bg-[#1a1e25]',
      textClass: 'text-[#d6dce5]',
      borderClass: 'border-[#2e3541]',
    },
    {
      id: 'dark',
      name: 'Dark',
      sublabel: 'OLED Hitam',
      icon: Moon,
      bgClass: 'bg-[#0d0e11]',
      textClass: 'text-[#d8d9de]',
      borderClass: 'border-[#22242a]',
    },
    {
      id: 'light',
      name: 'Light',
      sublabel: 'Kertas Terang',
      icon: Sun,
      bgClass: 'bg-[#f7f5f0]',
      textClass: 'text-[#1c1d21]',
      borderClass: 'border-[#dfd8c5]',
    },
  ];

  const fonts: Array<{ id: ReaderFontFamily; label: string; desc: string }> = [
    { id: 'serif', label: 'Buku', desc: 'Serif Klasik' },
    { id: 'sans', label: 'Modern', desc: 'Sans-Serif' },
    { id: 'mono', label: 'Ketik', desc: 'Monospace' },
  ];

  const fontSizes: Array<{ id: ReaderFontSize; label: string }> = [
    { id: 'sm', label: 'A-' },
    { id: 'base', label: 'A' },
    { id: 'lg', label: 'A+' },
    { id: 'xl', label: 'A++' },
    { id: '2xl', label: 'A+++' },
  ];

  const lineHeights: Array<{ id: ReaderLineHeight; label: string }> = [
    { id: 'compact', label: 'Rapat' },
    { id: 'normal', label: 'Standar' },
    { id: 'loose', label: 'Lapang' },
  ];

  const widths: Array<{ id: ReaderWidth; label: string }> = [
    { id: 'compact', label: 'Ramping' },
    { id: 'normal', label: 'Proporsional' },
    { id: 'wide', label: 'Lebar' },
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        title="Pengaturan Kenyamanan Membaca"
      >
        <Settings className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl space-y-5 text-xs animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                  Kenyamanan Membaca
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Sesuaikan tampilan untuk membaca lama tanpa lelah
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 1. Theme Palette Selector */}
            <div className="space-y-2">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                Palet Warna Tampilan
              </span>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => {
                  const Icon = t.icon;
                  const isSelected = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border text-left transition-all ${
                        t.bgClass
                      } ${t.textClass} ${t.borderClass} ${
                        isSelected
                          ? 'ring-2 ring-amber-500 shadow-sm font-bold'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                          <Check className="h-2.5 w-2.5" />
                        </div>
                      )}
                      <Icon className="h-4 w-4 mb-1 opacity-80" />
                      <span className="text-[11px] font-semibold leading-tight">{t.name}</span>
                      <span className="text-[9px] opacity-70 mt-0.5">{t.sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Font Family */}
            <div className="space-y-2">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                Jenis Huruf
              </span>
              <div className="grid grid-cols-3 gap-2">
                {fonts.map((f) => {
                  const isSelected = fontFamily === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id)}
                      className={`py-2 px-2.5 rounded-xl border transition-all text-center ${
                        isSelected
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 font-semibold shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="text-xs">{f.label}</div>
                      <div className="text-[9px] opacity-60 mt-0.5">{f.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Font Size Scaling */}
            <div className="space-y-2">
              <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                Ukuran Huruf
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {fontSizes.map((s) => {
                  const isSelected = fontSize === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setFontSize(s.id)}
                      className={`h-9 rounded-xl border transition-all font-bold text-xs ${
                        isSelected
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-xs'
                          : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Line Spacing & Page Width */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Line Spacing */}
              <div className="space-y-2">
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                  Jarak Baris
                </span>
                <div className="flex flex-col gap-1.5">
                  {lineHeights.map((l) => {
                    const isSelected = lineHeight === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setLineHeight(l.id)}
                        className={`h-8 rounded-lg border text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                            : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                        }`}
                      >
                        {l.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Page Width */}
              <div className="space-y-2">
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                  Lebar Baca
                </span>
                <div className="flex flex-col gap-1.5">
                  {widths.map((w) => {
                    const isSelected = width === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => setWidth(w.id)}
                        className={`h-8 rounded-lg border text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
                            : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/60 hover:bg-zinc-100'
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Text Alignment & Paragraph Format */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-700 dark:text-zinc-300 font-semibold">
                  Perataan Paragraf
                </span>
                <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-700/60 p-0.5 bg-zinc-50 dark:bg-zinc-800">
                  <button
                    onClick={() => setAlign('justify')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      align === 'justify'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                    title="Rata Kiri-Kanan"
                  >
                    <AlignJustify className="h-3 w-3" />
                    <span>Justify</span>
                  </button>
                  <button
                    onClick={() => setAlign('left')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      align === 'left'
                        ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                    }`}
                    title="Rata Kiri"
                  >
                    <AlignLeft className="h-3 w-3" />
                    <span>Rata Kiri</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold block">
                    Gaya Indentasi Paragraf
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Menjorokkan baris awal seperti buku cetak
                  </span>
                </div>
                <button
                  onClick={() => setIndent(!indent)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    indent ? 'bg-amber-600' : 'bg-zinc-200 dark:bg-zinc-700'
                  }`}
                  role="switch"
                  aria-checked={indent}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      indent ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
