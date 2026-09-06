import { requireAdmin } from '@/lib/auth/auth-utils';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';

export const metadata = {
  title: 'Taunovel Admin',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side authorization check: only ADMIN allowed
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-[#f7f5f0] dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-fadeIn">{children}</main>
      </div>
    </div>
  );
}
