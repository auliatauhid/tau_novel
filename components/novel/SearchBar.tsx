'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = 'Cari judul novel atau nama penulis...', className }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentQuery = searchParams.get('query') || '';
      if (query !== currentQuery) {
        const params = new URLSearchParams(searchParams.toString());
        if (query.trim()) {
          params.set('query', query.trim());
          params.set('page', '1');
        } else {
          params.delete('query');
        }

        // If we're not on /novels, navigate there
        if (pathname !== '/novels') {
          router.push(`/novels?${params.toString()}`);
        } else {
          router.push(`${pathname}?${params.toString()}`);
        }
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [query, pathname, router, searchParams]);

  return (
    <div className={`relative ${className || ''}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-9 h-11 text-sm bg-white dark:bg-stone-900/90 border-stone-200/90 dark:border-stone-800 rounded-2xl shadow-2xs"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="Hapus pencarian"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
