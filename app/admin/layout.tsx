/**
 * Admin layout — nested under /admin (protected by middleware: ADMIN role required).
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-white/5 px-6 py-4">
        <h1 className="font-cinzel text-xl text-gold">Admin Dashboard</h1>
      </header>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
