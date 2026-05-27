import Link from 'next/link';
import { BookOpen, Upload, Users, Radio } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import prisma from '@/lib/prisma';
import { countDevotions } from '@/modules/devotions/server/devotion.server';
import { countMedia } from '@/modules/media/server/media.server';

export async function AdminDashboard() {
  const [users, devotions, media] = await Promise.all([
    prisma.user.count(),
    countDevotions(),
    countMedia(),
  ]);

  const stats = [
    { label: 'Users', value: users, icon: Users, href: '/admin' },
    {
      label: 'Devotions',
      value: devotions.published,
      sub: `${devotions.total} total`,
      icon: BookOpen,
      href: '/admin/devotions',
    },
    {
      label: 'Media',
      value: media.published,
      sub: `${media.total} total`,
      icon: Radio,
      href: '/admin/media',
    },
  ];

  const actions = [
    {
      title: 'New Devotion',
      desc: 'Publish daily Scripture and reflection',
      href: '/admin/devotions/new',
      icon: BookOpen,
    },
    {
      title: 'Upload Media',
      desc: 'Sermons, music, worship, podcasts',
      href: '/admin/media/new',
      icon: Upload,
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-cinzel text-3xl text-white">Dashboard</h1>
        <p className="mt-2 text-gray-400">Christ Light Media — Phase 1 foundation</p>
      </header>

      <section className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover className="h-full">
              <stat.icon className="mb-4 text-gold" size={24} />
              <p className="font-cinzel text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
              {stat.sub && <p className="mt-1 text-xs text-gray-600">{stat.sub}</p>}
            </Card>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="mb-4 font-cinzel text-xl text-white">Quick actions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {actions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="flex items-start gap-4">
                <action.icon className="shrink-0 text-gold" size={28} />
                <div>
                  <h3 className="font-cinzel text-lg text-white">{action.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{action.desc}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
