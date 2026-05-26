
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import toast from 'react-hot-toast';
import { DevotionForm, type Devotion } from '@/components/admin/DevotionForm';

export default function EditDevotionPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [devotion, setDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDevotion() {
      try {
        const response = await fetch(`/api/admin/devotions/${params.id}`);
        const result = (await response.json()) as { devotion?: Devotion; error?: string };

        if (response.status === 404) {
          navigate('/admin/devotions');
          toast.error('Devotion not found.');
          return;
        }

        if (!response.ok || !result.devotion) {
          throw new Error(result.error ?? 'Unable to load devotion.');
        }

        setDevotion(result.devotion);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to load devotion.');
      } finally {
        setLoading(false);
      }
    }

    void fetchDevotion();
  }, [params.id]);

  if (loading) {
    return (
      <section className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
        <div className="h-8 w-56 animate-pulse rounded bg-white/10" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-white/10" />
        ))}
      </section>
    );
  }

  if (!devotion) {
    return <p className="text-sm text-gray-500">Unable to load this devotion.</p>;
  }

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <DevotionForm
        mode="edit"
        devotion={devotion}
        onSubmit={() => navigate('/admin/devotions')}
      />
    </section>
  );
}
