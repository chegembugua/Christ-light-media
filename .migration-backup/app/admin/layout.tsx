import { AdminSidebar } from '@/modules/admin';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg pt-20">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 md:p-10">{children}</main>
    </div>
  );
}
