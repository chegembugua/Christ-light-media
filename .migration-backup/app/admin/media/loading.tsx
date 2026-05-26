export default function AdminMediaLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-9 w-64 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/10" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,32rem)_1fr]">
        <div className="max-w-lg rounded-2xl border border-white/10 bg-card/80 p-5">
          <div className="h-7 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-6 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
              </div>
            ))}
            <div className="h-32 w-full animate-pulse rounded-xl bg-white/10" />
            <div className="h-32 w-full animate-pulse rounded-xl bg-white/10" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-gold/20" />
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-card/80 p-5">
          <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
          <div className="mt-5 rounded-xl border border-white/10">
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-7 gap-4 border-b border-white/10 p-3 last:border-0"
              >
                {Array.from({ length: 7 }).map((__, cellIndex) => (
                  <div
                    key={cellIndex}
                    className="h-4 animate-pulse rounded bg-white/10"
                    style={{ width: cellIndex === 0 ? '80%' : '60%' }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
