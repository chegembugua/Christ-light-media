export default function ChatLoading() {
  return (
    <div className="flex min-h-screen flex-col gap-0 bg-[#0A0A0A] pb-24 pt-28">
      <div className="mx-auto flex max-w-7xl flex-1 gap-0 px-4 md:flex-row">
        {/* Sidebar skeleton */}
        <aside className="hidden w-64 border-r border-white/5 bg-[#0F0F0F] md:block">
          <div className="border-b border-white/5 p-4">
            <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
          </div>
          <div className="p-2 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        </aside>

        {/* Messages skeleton */}
        <div className="flex flex-1 flex-col border-x border-white/5">
          {/* Header skeleton */}
          <div className="border-b border-white/5 p-4">
            <div className="mb-2 h-5 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-64 animate-pulse rounded bg-white/5" />
          </div>
          {/* Message skeletons */}
          <div className="flex-1 space-y-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-28 animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
          {/* Input skeleton */}
          <div className="border-t border-white/5 p-4">
            <div className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
