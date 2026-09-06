import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  createPageUrl: (page: number) => string;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  createPageUrl,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  // Generate pagination items
  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav aria-label="Navigasi Halaman Katalog" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 pb-4 border-t border-stone-200/80 dark:border-stone-800/80">
      {/* Information text */}
      <span className="text-xs text-stone-500 order-2 sm:order-1 font-medium">
        Halaman <strong className="text-stone-900 dark:text-stone-100 font-bold">{currentPage}</strong> dari{' '}
        <strong className="text-stone-900 dark:text-stone-100 font-bold">{totalPages}</strong>
      </span>

      {/* Pagination control pills */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        <Link
          href={createPageUrl(currentPage - 1)}
          aria-disabled={isFirstPage}
          tabIndex={isFirstPage ? -1 : 0}
          className={`h-9 px-3 rounded-xl inline-flex items-center gap-1 text-xs font-semibold border transition-all ${
            isFirstPage
              ? 'pointer-events-none opacity-40 border-stone-200 dark:border-stone-800 text-stone-400'
              : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 active:scale-95'
          }`}
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>

        {/* Page Number Pills */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((item, idx) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-9 flex items-center justify-center text-xs text-stone-400 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(item);
            const isCurrent = pageNum === currentPage;

            return (
              <Link
                key={pageNum}
                href={createPageUrl(pageNum)}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                  isCurrent
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-200 dark:hover:border-stone-700'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        <Link
          href={createPageUrl(currentPage + 1)}
          aria-disabled={isLastPage}
          tabIndex={isLastPage ? -1 : 0}
          className={`h-9 px-3 rounded-xl inline-flex items-center gap-1 text-xs font-semibold border transition-all ${
            isLastPage
              ? 'pointer-events-none opacity-40 border-stone-200 dark:border-stone-800 text-stone-400'
              : 'border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 active:scale-95'
          }`}
          title="Halaman Selanjutnya"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}
