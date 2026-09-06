'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Genre {
  id: string;
  name: string;
  slug: string;
}

interface CatalogFilterBarProps {
  genres: Genre[];
  totalResults: number;
}

export function CatalogFilterBar({ genres, totalResults }: CatalogFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedGenre = searchParams.get('genre') || '';
  const selectedStatus = searchParams.get('status') || '';
  const selectedSort = searchParams.get('sort') || 'latest';
  const currentQuery = searchParams.get('query') || '';

  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const statuses = [
    { label: 'Semua Status', value: '' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Tamat', value: 'COMPLETED' },
    { label: 'Hiatus', value: 'HIATUS' },
  ];

  const sorts = [
    { label: 'Terbaru', value: 'latest' },
    { label: 'Terpopuler', value: 'popular' },
    { label: 'Judul (A-Z)', value: 'title' },
  ];

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.delete('page');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const resetAllFilters = () => {
    const params = new URLSearchParams();
    if (currentQuery) {
      params.set('query', currentQuery);
    }
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
    setIsMobileOpen(false);
  };

  // Find label names for active chips
  const activeGenreObject = genres.find((g) => g.slug === selectedGenre);
  const activeStatusObject = statuses.find((s) => s.value === selectedStatus && s.value !== '');
  const activeSortObject = sorts.find((s) => s.value === selectedSort && s.value !== 'latest');

  const activeFiltersCount =
    (selectedGenre ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    (selectedSort !== 'latest' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* DESKTOP & TABLET CONTROLS BAR */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 backdrop-blur-sm shadow-2xs">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Genre Dropdown */}
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => updateParam('genre', e.target.value)}
              className="appearance-none pl-3.5 pr-8 h-10 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100/90 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/90 dark:border-stone-700/80 hover:border-amber-500/50 dark:hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-all"
            >
              <option value="">Semua Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug} className="bg-white dark:bg-stone-900">
                  {g.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => updateParam('status', e.target.value)}
              className="appearance-none pl-3.5 pr-8 h-10 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100/90 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/90 dark:border-stone-700/80 hover:border-amber-500/50 dark:hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-all"
            >
              {statuses.map((s) => (
                <option key={s.value} value={s.value} className="bg-white dark:bg-stone-900">
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Sort & Total Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Urutkan:</span>
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none pl-3 pr-8 h-10 rounded-xl text-xs sm:text-sm font-semibold bg-stone-100/90 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/90 dark:border-stone-700/80 hover:border-amber-500/50 dark:hover:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-all"
              >
                {sorts.map((sort) => (
                  <option key={sort.value} value={sort.value} className="bg-white dark:bg-stone-900">
                    {sort.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE TRIGGER BUTTONS */}
      <div className="sm:hidden flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold shadow-2xs cursor-pointer active:scale-[0.98] transition-all"
        >
          <SlidersHorizontal className="h-4 w-4 text-amber-600" />
          <span>Filter & Urutkan</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center ml-1">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={resetAllFilters}
            className="h-11 px-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 hover:text-stone-900 text-xs font-semibold cursor-pointer"
            title="Reset Filter"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ACTIVE FILTER CHIPS ROW */}
      {(currentQuery || activeGenreObject || activeStatusObject || activeSortObject) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-stone-400 font-medium mr-1">Filter aktif:</span>

          {/* Search Query Chip */}
          {currentQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
              <span>Kata kunci: &ldquo;{currentQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => removeFilter('query')}
                className="hover:text-red-500 transition-colors cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Genre Chip */}
          {activeGenreObject && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
              <span>Genre: {activeGenreObject.name}</span>
              <button
                type="button"
                onClick={() => removeFilter('genre')}
                className="hover:text-red-500 transition-colors cursor-pointer"
                title="Hapus filter genre"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Status Chip */}
          {activeStatusObject && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
              <span>Status: {activeStatusObject.label}</span>
              <button
                type="button"
                onClick={() => removeFilter('status')}
                className="hover:text-red-500 transition-colors cursor-pointer"
                title="Hapus filter status"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {/* Sort Chip */}
          {activeSortObject && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
              <span>Urutan: {activeSortObject.label}</span>
              <button
                type="button"
                onClick={() => removeFilter('sort')}
                className="hover:text-red-500 transition-colors cursor-pointer"
                title="Kembalikan urutan default"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={resetAllFilters}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline cursor-pointer ml-1"
          >
            Reset Semua
          </button>
        </div>
      )}

      {/* MOBILE FILTER MODAL / DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sheet Body */}
          <div className="relative w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-stone-900 rounded-t-3xl border-t border-stone-200 dark:border-stone-800 p-6 space-y-6 shadow-2xl z-10 animate-slideUp">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  Filter & Urutkan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Section */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Status Novel
              </span>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map((s) => (
                  <button
                    type="button"
                    key={s.value}
                    onClick={() => updateParam('status', s.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedStatus === s.value
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{s.label}</span>
                    {selectedStatus === s.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Section */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Urutan Tampilan
              </span>
              <div className="grid grid-cols-3 gap-2">
                {sorts.map((sort) => (
                  <button
                    type="button"
                    key={sort.value}
                    onClick={() => updateParam('sort', sort.value)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                      selectedSort === sort.value
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Section */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Genre ({genres.length})
              </span>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => updateParam('genre', '')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    !selectedGenre
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Semua
                </button>
                {genres.map((g) => (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => updateParam('genre', g.slug === selectedGenre ? '' : g.slug)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedGenre === g.slug
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sheet Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <Button
                variant="outline"
                className="flex-1 rounded-xl h-11 border-stone-200 dark:border-stone-800"
                onClick={resetAllFilters}
              >
                Reset Filter
              </Button>
              <Button
                className="flex-1 rounded-xl h-11 bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                onClick={() => setIsMobileOpen(false)}
              >
                Terapkan ({totalResults})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
