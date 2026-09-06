import { getAllGenres } from '@/lib/services/novel-service';
import { NovelForm } from '@/components/admin/NovelForm';

export const metadata = {
  title: 'Tambah Novel Baru — Taunovel Admin',
};

export default async function AdminNewNovelPage() {
  const allGenres = await getAllGenres();

  return (
    <div className="space-y-6">
      <NovelForm allGenres={allGenres} isEdit={false} />
    </div>
  );
}
