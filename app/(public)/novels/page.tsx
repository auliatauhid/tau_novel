import { getNovels, getAllGenres } from '@/lib/services/novel-service';
import { NovelGrid } from '@/components/novel/NovelGrid';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { CatalogSearchBar } from '@/components/catalog/CatalogSearchBar';
import { CatalogFilterBar } from '@/components/catalog/CatalogFilterBar';
import { CatalogPagination } from '@/components/catalog/CatalogPagination';

export const metadata = {
  title: 'Katalog Novel — Taunovel',
  description: 'Daftar lengkap novel online berbagai genre di Taunovel. Jelajahi karya fiksi pilihan dengan format baca yang nyaman.',
};

export default async function NovelsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    genre?: string;
    status?: any;
    sort?: any;
    page?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || '1', 10);
  const query = resolvedParams.query || '';
  const genreSlug = resolvedParams.genre || '';
  const status = resolvedParams.status || undefined;
  const sort = resolvedParams.sort || 'latest';

  const [{ novels, pagination }, genres] = await Promise.all([
    getNovels({
      page,
      limit: 18,
      query,
      genreSlug,
      status,
      sort,
      publishedOnly: true,
    }),
    getAllGenres(),
  ]);

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (genreSlug) params.set('genre', genreSlug);
    if (status) params.set('status', status);
    if (sort && sort !== 'latest') params.set('sort', sort);
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }
    const queryString = params.toString();
    return queryString ? `/novels?${queryString}` : '/novels';
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#F7F5F0] dark:bg-[#121316] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fadeIn">
        {/* 1. Header Section with Breadcrumbs & Badge */}
        <CatalogHeader totalNovels={pagination.total} />

        {/* 2. Prominent Real-Time Search Bar */}
        <div className="w-full">
          <CatalogSearchBar defaultValue={query} />
        </div>

        {/* 3. Filter & Sort Bar (Desktop Dropdowns + Active Chips + Mobile Drawer) */}
        <CatalogFilterBar genres={genres} totalResults={pagination.total} />

        {/* 4. Novels Grid */}
        <main aria-label="Daftar Novel">
          <NovelGrid
            novels={novels}
            emptyMessage={
              query
                ? `Tidak ada novel yang cocok dengan pencarian "${query}". Coba kata kunci lain atau reset filter.`
                : 'Belum ada novel yang sesuai dengan kombinasi filter yang dipilih.'
            }
            resetHref="/novels"
          />
        </main>

        {/* 5. Modern Numeric Pagination */}
        <CatalogPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          createPageUrl={createPageUrl}
        />
      </div>
    </div>
  );
}
