
import { Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type Media = {
  id: string;
  title: string;
  speaker: string | null;
  type: string;
  category: string | null;
  duration: string | null;
  createdAt: string | Date;
};

type MediaTableProps = {
  media: Media[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
};

function formatRelativeTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const divisions: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: 'second' },
    { amount: 60, unit: 'minute' },
    { amount: 24, unit: 'hour' },
    { amount: 7, unit: 'day' },
    { amount: 4.345, unit: 'week' },
    { amount: 12, unit: 'month' },
    { amount: Number.POSITIVE_INFINITY, unit: 'year' },
  ];

  let duration = diffSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(0, 'second');
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <tr key={index} className="border-b border-white/10">
          {Array.from({ length: 7 }).map((__, cellIndex) => (
            <td key={cellIndex} className="p-3">
              <div className={cn('h-4 animate-pulse rounded bg-white/10', cellIndex === 0 ? 'w-36' : 'w-20')} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function MediaTable({ media, loading = false, onDelete, onEdit }: MediaTableProps) {
  const handleDelete = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation();
    if (!window.confirm('Delete this media? This cannot be undone.')) return;
    onDelete(id);
  };

  if (!loading && media.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-surface p-8 text-center text-sm text-gray-400">
        No media uploaded yet. Add one using the form on the left.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="min-w-[760px] w-full border-collapse text-left text-sm">
        <thead className="bg-surface text-xs uppercase tracking-widest text-gray-500">
          <tr>
            <th className="p-3 font-semibold">Title</th>
            <th className="p-3 font-semibold">Speaker</th>
            <th className="p-3 font-semibold">Type</th>
            <th className="p-3 font-semibold">Category</th>
            <th className="p-3 font-semibold">Duration</th>
            <th className="p-3 font-semibold">Uploaded</th>
            <th className="p-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows />
          ) : (
            media.map((item) => (
              <tr
                key={item.id}
                onClick={() => onEdit?.(item.id)}
                className="cursor-pointer border-b border-white/10 transition last:border-0 hover:bg-white/5"
              >
                <td className="max-w-[220px] truncate p-3 font-medium text-white">{item.title}</td>
                <td className="max-w-[160px] truncate p-3 text-gray-300">{item.speaker ?? '-'}</td>
                <td className="p-3 text-gray-300">{item.type}</td>
                <td className="p-3 text-gray-300">{item.category ?? '-'}</td>
                <td className="p-3 text-gray-300">{item.duration || '-'}</td>
                <td className="p-3 text-gray-400">{formatRelativeTime(item.createdAt)}</td>
                <td className="p-3 text-right">
                  <button
                    type="button"
                    onClick={(event) => handleDelete(event, item.id)}
                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
