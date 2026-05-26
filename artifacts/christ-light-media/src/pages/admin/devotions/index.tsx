
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { DevotionForm, type Devotion } from '@/components/admin/DevotionForm';

type StatusFilter = 'all' | 'published' | 'draft';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={
        published
          ? 'rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400'
          : 'rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300'
      }
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

function SkeletonRows() {
  return (
    <div className="divide-y divide-white/10">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="grid gap-4 p-4 md:grid-cols-[1.5fr_1fr_1fr_0.8fr_96px]">
          {Array.from({ length: 5 }).map((__, cell) => (
            <div key={cell} className="h-5 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function AdminDevotionsPage() {
  const [devotions, setDevotions] = useState<Devotion[]>([]);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);

  const fetchDevotions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/devotions?status=${status}`);
      const result = (await response.json()) as { devotions?: Devotion[]; error?: string };

      if (!response.ok || !result.devotions) {
        throw new Error(result.error ?? 'Unable to load devotions.');
      }

      setDevotions(result.devotions);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load devotions.');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    void fetchDevotions();
  }, [fetchDevotions]);

  const handleDelete = async (devotion: Devotion) => {
    if (!confirm(`Delete "${devotion.title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/devotions/${devotion.id}`, { method: 'DELETE' });
      const result = (await response.json()) as { success?: boolean; error?: string };

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? 'Unable to delete devotion.');
      }

      setDevotions((current) => current.filter((item) => item.id !== devotion.id));
      toast.success('Devotion deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete devotion.');
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-cinzel text-3xl text-white">Devotions</h1>
          <p className="mt-2 text-sm text-gray-400">Create and manage daily devotion content</p>
        </div>
        <Link href="/admin/devotions/new">
          <Button>
            <span className="inline-flex items-center gap-2">
              <Plus size={16} /> New Devotion
            </span>
          </Button>
        </Link>
      </header>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <DevotionForm mode="create" onSubmit={() => void fetchDevotions()} />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-cinzel text-2xl text-white">Devotions</h2>
            <div className="flex rounded-lg border border-white/10 bg-card p-1">
              {[
                { label: 'All', value: 'all' },
                { label: 'Published', value: 'published' },
                { label: 'Drafts', value: 'draft' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value as StatusFilter)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    status === tab.value
                      ? 'bg-gold text-black'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="hidden grid-cols-[1.5fr_1fr_1fr_0.8fr_96px] gap-4 border-b border-white/10 bg-card px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 md:grid">
              <span>Title</span>
              <span>Verse</span>
              <span>Date</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {loading ? (
              <SkeletonRows />
            ) : devotions.length === 0 ? (
              <p className="p-6 text-sm text-gray-500">
                No devotions yet. Create one to get started!
              </p>
            ) : (
              <div className="divide-y divide-white/10">
                {devotions.map((devotion) => (
                  <div
                    key={devotion.id}
                    className="grid gap-3 p-4 transition hover:bg-white/5 md:grid-cols-[1.5fr_1fr_1fr_0.8fr_96px] md:items-center md:gap-4"
                  >
                    <Link
                      href={`/admin/devotions/${devotion.id}/edit`}
                      className="font-medium text-white transition hover:text-gold"
                    >
                      {devotion.title}
                    </Link>
                    <span className="text-sm text-gray-400">{devotion.verse}</span>
                    <span className="text-sm text-gray-400">{formatDate(devotion.date)}</span>
                    <StatusBadge published={devotion.isPublished} />
                    <div className="flex justify-start gap-2 md:justify-end">
                      <Link href={`/admin/devotions/${devotion.id}/edit`}>
                        <Button variant="ghost" size="sm" aria-label={`Edit ${devotion.title}`}>
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => void handleDelete(devotion)}
                        aria-label={`Delete ${devotion.title}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!loading && devotions.length >= 20 && (
            <Button variant="surface" className="w-full" disabled>
              Load more
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
