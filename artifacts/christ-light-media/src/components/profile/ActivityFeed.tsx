
import { Heart, Award, BookOpen, Cross } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Activity {
  id: string;
  type: 'prayer_shared' | 'prayer_answered' | 'challenge_enrolled' | 'challenge_completed' | 'testimony_shared';
  description: string;
  timestamp: Date | string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const typeConfig: Record<
  Activity['type'],
  { icon: React.ReactNode; color: string; bg: string }
> = {
  prayer_shared: { icon: <Heart size={14} />, color: 'text-[#C8A24A]', bg: 'bg-[#C8A24A]/20' },
  prayer_answered: {
    icon: <Heart size={14} />,
    color: 'text-green-500',
    bg: 'bg-green-500/20',
  },
  challenge_enrolled: {
    icon: <BookOpen size={14} />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/20',
  },
  challenge_completed: {
    icon: <Award size={14} />,
    color: 'text-[#C8A24A]',
    bg: 'bg-[#C8A24A]/20',
  },
  testimony_shared: {
    icon: <Cross size={14} />,
    color: 'text-purple-400',
    bg: 'bg-purple-500/20',
  },
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-surface border border-white/10 rounded-2xl p-6 text-center text-gray-500 text-sm">
        No recent activity yet.
      </div>
    );
  }

  return (
    <div className="space-y-0 relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[18px] top-2 bottom-2 w-px bg-white/10" />

      {activities.map((activity) => {
        const config = typeConfig[activity.type];
        return (
          <div
            key={activity.id}
            className="relative flex items-start gap-4 pb-5 last:pb-0"
          >
            {/* Dot */}
            <div
              className={cn(
                'z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0',
                config.bg
              )}
            >
              <span className={config.color}>{config.icon}</span>
            </div>

            {/* Content */}
            <div className="pt-1.5 flex-1 min-w-0">
              <p className="text-sm text-gray-200">{activity.description}</p>
              <p className="text-xs text-gray-600 mt-0.5">
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
