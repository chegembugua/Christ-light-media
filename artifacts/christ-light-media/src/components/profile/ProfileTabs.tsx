
import { cn } from '@/lib/utils';
import {  useLocation } from 'wouter';

interface ProfileTabsProps {
  activeTab: string;
}

const TABS = [
  'Overview',
  'Prayers',
  'Challenges',
  'Saved',
  'Activity',
];

export default function ProfileTabs({ activeTab }: ProfileTabsProps) {
  const [, navigate] = useLocation();

  const switchTab = (tab: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab.toLowerCase());
    navigate(`/profile?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-white/10">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.toLowerCase();
        return (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              isActive
                ? 'bg-gradient-to-r from-[#C8A24A] to-amber-600 text-black shadow-lg shadow-[#C8A24A]/20'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
