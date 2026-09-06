'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface GenreFilterProps {
  genres: Array<{ id: string; name: string; slug: string }>;
}

export function GenreFilter({ genres }: GenreFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedGenre = searchParams.get('genre') || '';
  const selectedStatus = searchParams.get('status') || '';
  const selectedSort = searchParams.get('sort') || 'latest';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

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

  const hasActiveFilters = Boolean(selectedGenre || selectedStatus || selectedSort !== 'latest');

  const handleReset = () => {
    const params = new URLSearchParams();
    const query = searchParams.get('query');
    if (query) params.set('query', query);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Genres pill list */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => updateParam('genre', '')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            !selectedGenre
              ? 'bg-[#1c1d21] text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-750'
          }`}
        >
          Semua Genre
        </button>

        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => updateParam('genre', g.slug === selectedGenre ? '' : g.slug)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedGenre === g.slug
                ? 'bg-[#1c1d21] text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-750'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Status, Sort & Reset controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-stone-400 font-medium mr-1">Status:</span>
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => updateParam('status', s.value)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                selectedStatus === s.value
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 font-medium">Urutkan:</span>
            <select
              value={selectedSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 rounded-xl px-3 py-1.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
            >
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value} className="bg-white dark:bg-stone-900">
                  {sort.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400 hover:underline cursor-pointer ml-1"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
