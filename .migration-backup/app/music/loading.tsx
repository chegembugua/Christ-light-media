export default function MusicLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-24 pt-28">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded bg-gold/20" />
          <div className="h-14 w-80 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-full max-w-xl animate-pulse rounded bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-4 rounded-2xl border border-white/10 bg-card p-3">
              <div className="aspect-square animate-pulse rounded-2xl bg-white/10" />
              <div className="h-5 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
