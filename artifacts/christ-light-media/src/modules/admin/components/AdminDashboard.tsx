import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, Upload, Users, Radio } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const actions = [
    { title: 'New Devotion', desc: 'Publish daily Scripture and reflection', href: '/admin/devotions/new', icon: BookOpen },
    { title: 'Upload Media', desc: 'Sermons, music, worship, podcasts', href: '/admin/media/new', icon: Upload },
  ];

  if (loading) return <div className="p-6"><div className="h-28 bg-bg-tertiary animate-pulse rounded-xl" /></div>;

  return (
    <div className="space-y-10 p-6">
      <header>
        <h1 className="font-cinzel text-3xl text-white">Dashboard</h1>
        <p className="mt-2 text-text-secondary">In For Christ Media Admin</p>
      </header>
      <section>
        <h2 className="mb-4 font-cinzel text-xl text-white">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="flex items-start gap-4 cursor-pointer hover:border-gold/30 transition-all">
                <action.icon className="shrink-0 text-gold" size={28} />
                <div>
                  <h3 className="font-cinzel text-lg text-white">{action.title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{action.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
