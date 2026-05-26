export default function WorshipLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-24 pt-28">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <div className="h-4 w-44 animate-pulse rounded bg-gold/20" />
          <div className="h-14 w-96 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-white/10" />
        </div>

        {/* Countdown skeleton */}
        <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-white/10 bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500/30" />
          </div>
          <div className="h-16 w-72 animate-pulse rounded bg-gold/20" />
          <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>

        {/* Card skeletons */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-2xl border border-white/10 bg-card p-3">
              <div className="aspect-video animate-pulse rounded-2xl bg-white/10" />
              <div className="h-5 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
