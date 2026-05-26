
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { DevotionFeatured } from '@/components/devotions/DevotionFeatured';
import { DevotionShare } from '@/components/devotions/DevotionShare';
import { formatDevotionDate } from '@/lib/utils';
import type { DevotionDTO } from '@/modules/devotions/types';

interface DevotionDetailPageProps {
  params: { date: string };
}

export default function DevotionDetailPage({ params }: DevotionDetailPageProps) {
  const [, navigate] = useLocation();
  const [devotion, setDevotion] = useState<DevotionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const fetchDevotion = useCallback(async () => {
    try {
      const response = await fetch(`/api/devotions/${params.date}`);
      if (!response.ok) {
        if (response.status === 404) { navigate('/devotions/not-found'); return; }
        throw new Error('Unable to load devotion');
      }
      const data = await response.json();

      setDevotion(data.devotion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load devotion');
    } finally {
      setLoading(false);
    }
  }, [params.date]);

  useEffect(() => {
    fetchDevotion();
  }, [fetchDevotion]);

  const handleBookmark = () => {
    if (devotion) {
      setBookmarkedIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(devotion.id)) {
          newSet.delete(devotion.id);
        } else {
          newSet.add(devotion.id);
        }
        return newSet;
      });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (!devotion) return;
    
    const currentDate = new Date(devotion.date);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    
    const dateStr = newDate.toISOString().split('T')[0];
    navigate(`/devotions/${dateStr}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <div className="container mx-auto px-6 py-20">
          <div className="h-[500px] animate-pulse rounded-3xl bg-white/5" />
        </div>
      </div>
    );
  }

  if (error || !devotion) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-red-400">{error || 'Devotion not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate('/devotions')}
              className="text-gray-400 hover:text-[#C8A24A] transition flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Back to Devotions
            </button>
            
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarIcon size={16} />
              {formatDevotionDate(new Date(devotion.date))}
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigateDate('prev')}
              className="text-gray-400 hover:text-[#C8A24A] transition"
            >
              ← Previous
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="text-gray-400 hover:text-[#C8A24A] transition"
            >
              Next →
            </button>
          </div>

          <DevotionFeatured
            devotion={devotion}
            onBookmark={handleBookmark}
            isBookmarked={bookmarkedIds.has(devotion.id)}
          />

          <div className="mt-12">
            <h3 className="font-cinzel text-lg text-white mb-4">Share this devotion</h3>
            <DevotionShare
              date={new Date(devotion.date)}
              title={devotion.title}
              verse={devotion.verse}
            />
          </div>
        </div>
      </section>
    </div>
  );
}