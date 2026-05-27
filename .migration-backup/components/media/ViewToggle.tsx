'use client';

import { Grid2X2, List } from 'lucide-react';

type ViewToggleProps = {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
};

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-card p-1">
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`rounded-md p-2 transition ${
          view === 'grid' ? 'bg-gold text-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'
        }`}
        aria-label="Grid view"
      >
        <Grid2X2 size={18} />
      </button>
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`rounded-md p-2 transition ${
          view === 'list' ? 'bg-gold text-black' : 'text-gray-500 hover:bg-white/5 hover:text-white'
        }`}
        aria-label="List view"
      >
        <List size={18} />
      </button>
    </div>
  );
}
