'use client';

interface PrayerStatsProps {
  activePrayers: number;
  answeredPrayers: number;
  peoplePraying: number;
}

export default function PrayerStats({
  activePrayers,
  answeredPrayers,
  peoplePraying,
}: PrayerStatsProps) {
  const cards = [
    {
      label: 'Active Prayers',
      value: activePrayers.toLocaleString(),
      sub: 'unmet prayer requests',
      icon: '🙏',
    },
    {
      label: 'Prayers Answered',
      value: answeredPrayers.toLocaleString(),
      sub: 'answered this month',
      icon: '✨',
    },
    {
      label: 'People Praying',
      value: `${peoplePraying.toLocaleString()}+`,
      sub: 'believers interceding',
      icon: '🕊️',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/5 bg-[#161616] p-5 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-bold font-cinzel text-white">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-gray-500">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
