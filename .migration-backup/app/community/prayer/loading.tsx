export default function PrayerLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header skeleton */}
        <div className="mb-10 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-10 w-64 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-96 animate-pulse rounded bg-white/5" />
          <div className="h-4 w-80 animate-pulse rounded bg-white/5" />
        </div>

        {/* Stats skeleton */}
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-[#161616] p-5 text-center">
              <div className="mx-auto mb-3 h-3 w-24 rounded bg-white/10" />
              <div className="mx-auto h-8 w-20 rounded bg-white/5" />
              <div className="mx-auto mt-2 h-3 w-28 rounded bg-white/5" />
            </div>
          ))}
        </div>

        {/* CTA skeleton */}
        <div className="mb-10 animate-pulse rounded-3xl border border-white/10 bg-[#1A1A1A] p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-white/5" />
              <div className="h-4 w-72 rounded bg-white/5" />
            </div>
            <div className="h-12 w-52 rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Filter skeleton */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
          ))}
          <div className="ml-auto h-8 w-36 animate-pulse rounded-xl bg-white/10" />
          <div className="h-8 w-44 animate-pulse rounded-xl bg-white/10" />
          <div className="h-8 w-44 animate-pulse rounded-xl bg-white/10" />
          <div className="h-8 w-44 animate-pulse rounded-xl bg-white/10" />
        </div>

        {/* Card skeletons */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-[#1A1A1A] p-5">
              <div className="mb-3 h-4 w-20 rounded-full bg-white/10" />
              <div className="mb-2 h-5 w-3/4 rounded bg-white/5" />
              <div className="mb-1 h-3 w-full rounded bg-white/5" />
              <div className="mb-1 h-3 w-5/6 rounded bg-white/5" />
              <div className="mb-4 h-3 w-2/3 rounded bg-white/5" />
              <div className="mb-2 h-3 w-32 rounded bg-white/5" />
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-24 rounded bg-white/5" />
                  <div className="h-8 w-20 rounded-lg bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
