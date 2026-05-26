
import { useLocation } from 'wouter';
import { NewsForm } from '@/components/admin/NewsForm';

export default function NewArticlePage() {
  const [, navigate] = useLocation();

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-black/20 p-5">
      <NewsForm mode="create" onSubmit={() => navigate('/admin/news')} />
    </section>
  );
}
