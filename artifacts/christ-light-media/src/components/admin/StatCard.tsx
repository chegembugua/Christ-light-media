
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#C8A24A]/20 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-[#C8A24A] text-3xl">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-1">{label}</p>
      </div>
    </div>
  );
}
