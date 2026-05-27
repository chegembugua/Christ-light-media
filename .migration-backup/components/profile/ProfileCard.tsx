'use client';

import { User, Heart, Award, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProfileMemberInfo {
  joinedAt: string | Date;
  challengeDay: number;
  totalChallengesCompleted: number;
}

interface ProfileCardProps {
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    role: string;
    createdAt: string;
  };
  movementMember?: ProfileMemberInfo | null;
  prayersShared: number;
  prayersAnswered: number;
  challengeDays: number;
  onEditClick: () => void;
}

export default function ProfileCard({
  user,
  movementMember,
  prayersShared,
  prayersAnswered,
  challengeDays,
  onEditClick,
}: ProfileCardProps) {
  const initial = (user.fullName ?? user.email ?? 'U')[0].toUpperCase();
  const joinedAt = movementMember?.joinedAt ?? user.createdAt;
  const joinedStr = new Date(joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-card border border-white/10 rounded-2xl p-6 text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-[#C8A24A]/20 border-2 border-[#C8A24A]/40 flex items-center justify-center mx-auto">
          {user.avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.avatarUrl}
              alt={user.fullName ?? 'Profile'}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-[#C8A24A] font-cinzel">
              {initial}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-xl text-white">
            {user.fullName ?? ' believer'}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Joined {joinedStr}</p>
        </div>

        {user.bio && (
          <p className="text-sm text-gray-400 leading-relaxed">{user.bio}</p>
        )}

        <button
          onClick={onEditClick}
          className="w-full flex items-center justify-center gap-2 bg-surface border border-white/10 text-gray-300 hover:text-white hover:border-[#C8A24A]/40 rounded-xl py-2.5 text-sm font-medium transition-all"
        >
          <Edit3 size={14} />
          Edit Profile
        </button>

        {movementMember && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C8A24A]/20 to-amber-600/20 border border-[#C8A24A]/30">
            <Award size={14} className="text-[#C8A24A]" />
            <span className="text-xs font-semibold text-[#C8A24A]">
              In for Christ
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <StatCard
          icon={<Heart size={16} className="text-[#C8A24A]" />}
          label="Prayers Shared"
          value={prayersShared}
          subtext="prayer requests"
        />
        <StatCard
          icon={<Heart size={16} className="text-green-500" />}
          label="Prayers Answered"
          value={prayersAnswered}
          subtext="God at work"
        />
        <StatCard
          icon={<Award size={16} className="text-[#C8A24A]" />}
          label="Challenge Days"
          value={challengeDays}
          subtext="completed"
        />
      </div>

      {/* Navigation Links */}
      <nav className="bg-card border border-white/10 rounded-2xl p-2 space-y-1">
        {[
          { label: 'Dashboard', href: '/profile' },
          { label: 'My Prayers', href: '/profile?tab=prayers' },
          { label: 'My Testimonies', href: '/profile?tab=activity' },
          { label: 'Saved Content', href: '/profile?tab=saved' },
          { label: 'My Challenges', href: '/profile?tab=challenges' },
          { label: 'Settings', href: '/profile/settings' },
          { label: 'Help &amp; Support', href: '#help' },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors',
              item.label === 'Dashboard'
                ? 'text-[#C8A24A] bg-[#C8A24A]/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            )}
          >
            <User size={14} />
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtext: string;
}) {
  return (
    <div className="bg-surface border border-white/10 rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-card flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-white font-cinzel leading-none">
          {value}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{subtext}</p>
      </div>
    </div>
  );
}
