
import { Link } from 'wouter';
;
import { useLocation } from 'wouter';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { MediaDTO } from '../types';

export function MediaAdminList({ items }: { items: MediaDTO[] }) {
  const [, navigate] = useLocation();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Failed to delete');
      return;
    }
    toast.success('Deleted');
    
  };

  const togglePublish = async (item: MediaDTO) => {
    const res = await fetch(`/api/admin/media/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    if (!res.ok) {
      toast.error('Failed to update');
      return;
    }
    toast.success(item.isPublished ? 'Unpublished' : 'Published');
    
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-cinzel text-3xl text-white">Media library</h1>
        <Link href="/admin/media/new">
          <Button size="sm" className="gap-2">
            <Plus size={16} /> Upload
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No media uploaded yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-2xl border border-white/5 bg-card p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                {item.coverImage ? (
                  <img src={item.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-600">
                    No cover
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-cinzel text-lg text-white">{item.title}</h3>
                  <Badge variant="muted">{item.type}</Badge>
                  <Badge variant={item.isPublished ? 'success' : 'draft'}>
                    {item.isPublished ? 'Live' : 'Draft'}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {item.speaker ?? '—'} · {item.duration ?? '—'}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => togglePublish(item)}>
                  {item.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400"
                  onClick={() => handleDelete(item.id, item.title)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
