'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { DevotionFeatured } from '@/components/devotions/DevotionFeatured';
import { DevotionArchiveCard } from '@/components/devotions/DevotionArchiveCard';
import { formatDevotionDate } from '@/lib/utils';
import type { DevotionDTO } from '@/modules/devotions/types';

type FilterPeriod = '7' | '30' | 'all';

export default function DevotionsPage() {
  const router = useRouter();
  const [devotions, setDevotions] = useState<DevotionDTO[]>([]);
  const [todayDevotion, setTodayDevotion] = useState<DevotionDTO | null>(null);
  const [archive, setArchive] = useState<DevotionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('30');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const fetchDevotions = async () => {
    try {
      const response = await fetch(`/api/devotions?limit=30`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to load devotions');
      }

      const allDevotions: DevotionDTO[] = data.devotions || [];
      setDevotions(allDevotions);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayDev = allDevotions.find(d => {
        const devotionDate = new Date(d.date);
        devotionDate.setHours(0, 0, 0, 0);
        return devotionDate.getTime() === today.getTime();
      }) || allDevotions[0];
      
      setTodayDevotion(todayDev);
      setArchive(allDevotions.filter(d => d.id !== todayDev?.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load devotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevotions();
  }, []);

  const handleArchiveClick = (devotion: DevotionDTO) => {
    const dateStr = new Date(devotion.date).toISOString().split('T')[0];
    router.push(`/devotions/${dateStr}`);
  };

  const handleBookmark = (devotionId: string) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(devotionId)) {
        newSet.delete(devotionId);
      } else {
        newSet.add(devotionId);
      }
      return newSet;
    });
  };

  const filteredArchive = archive.filter(d => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      d.title.toLowerCase().includes(searchLower) ||
      d.verse.toLowerCase().includes(searchLower) ||
      d.verseText?.toLowerCase().includes(searchLower) ||
      d.reflection.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="container mx-auto px-6 py-20">
          <div className="h-[400px] animate-pulse rounded-3xl bg-white/5" />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h1 className="font-cinzel text-4xl text-white mb-4 md:text-5xl">Daily Devotions</h1>
            <p className="text-gray-400 text-lg">
              Start your day in the Word. A verse and reflection for spiritual growth.
            </p>
            <p className="text-[#C8A24A] text-sm mt-4 italic">
              &ldquo;Your Word is a lamp to my feet and a light to my path.&rdquo; — Psalm 119:105
            </p>
          </div>

          {todayDevotion && (
            <DevotionFeatured
              devotion={todayDevotion}
              onBookmark={() => handleBookmark(todayDevotion.id)}
              isBookmarked={bookmarkedIds.has(todayDevotion.id)}
            />
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <h2 className="font-cinzel text-2xl text-white mb-6">Recent Devotions</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by verse or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-full border border-white/10 bg-[#1A1A1A] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#C8A24A]/30 focus:outline-none"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {(['7', '30', 'all'] as FilterPeriod[]).map(period => (
                  <button
                    key={period}
                    onClick={() => setFilterPeriod(period)}
                    className={`rounded-full px-4 py-2 text-xs transition ${
                      filterPeriod === period
                        ? 'bg-[#C8A24A] text-black'
                        : 'border border-white/10 bg-white/5 text-gray-400 hover:border-[#C8A24A]/30'
                    }`}
                  >
                    {period === 'all' ? 'All time' : `Last ${period} days`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredArchive.length === 0 ? (
            <p className="text-center text-gray-500">No devotions found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredArchive.map((devotion) => (
                <DevotionArchiveCard
                  key={devotion.id}
                  date={new Date(devotion.date)}
                  verse={devotion.verse}
                  title={devotion.title}
                  reflection={devotion.reflection}
                  onClick={() => handleArchiveClick(devotion)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}