'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';

interface CatalogSearchBarProps {
  defaultValue?: string;
  placeholder?: string;
}

export function CatalogSearchBar({
  defaultValue = '',
  placeholder = 'Cari judul novel, nama penulis, atau kata kunci sinopsis...',
}: CatalogSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(defaultValue);

  // Sync state if URL changes externally
  useEffect(() => {
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  // Debounced navigation
  useEffect(() => {
    const currentQueryInUrl = searchParams.get('query') || '';
    if (query === currentQueryInUrl) return;

    const handler = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
          params.set('query', query.trim());
        } else {
          params.delete('query');
        }
        params.delete('page');
        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
      });
    }, 350);

    return () => clearTimeout(handler);
  }, [query, pathname, router, searchParams]);

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    params.delete('page');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return (
    <div className="relative w-full group">
      <div className="relative flex items-center">
        {/* Search Icon */}
        <div className="absolute left-4 flex items-center pointer-events-none text-stone-400 dark:text-stone-500 group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400 transition-colors">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-13 pl-12 pr-12 rounded-2xl bg-white/95 dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500/60 shadow-xs hover:border-stone-300 dark:hover:border-stone-700 transition-all"
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
            title="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
