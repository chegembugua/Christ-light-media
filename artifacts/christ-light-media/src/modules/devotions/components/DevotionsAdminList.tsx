
import { Link } from 'wouter';
import { useLocation } from 'wouter';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { DevotionDTO } from '../types';

export function DevotionsAdminList({ devotions }: { devotions: DevotionDTO[] }) {
  const [, navigate] = useLocation();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/admin/devotions/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      toast.error('Failed to delete');
      return;
    }
    toast.success('Deleted');
    
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-cinzel text-3xl text-white">Devotions</h1>
        <Link href="/admin/devotions/new">
          <Button size="sm" className="gap-2">
            <Plus size={16} /> New devotion
          </Button>
        </Link>
      </div>

      {devotions.length === 0 ? (
        <p className="text-gray-500">No devotions yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-card text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devotions.map((d) => (
                <tr key={d.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white">{d.title}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(d.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={d.isPublished ? 'success' : 'draft'}>
                      {d.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/devotions/${d.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400"
                        onClick={() => handleDelete(d.id, d.title)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
