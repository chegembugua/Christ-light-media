
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/devotions', label: 'Devotions', icon: BookOpen },
  { href: '/admin/media', label: 'Media Upload', icon: Upload },
];

export function AdminSidebar() {
  const [pathname] = useLocation();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/5 bg-card/50">
      <div className="border-b border-white/5 p-6">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gold">
          <ArrowLeft size={16} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Site</span>
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <Shield className="text-gold" size={20} />
          <div>
            <p className="font-cinzel text-lg text-white">Admin</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Christ Light Media</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                active
                  ? 'bg-gold/10 text-gold'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
