export default function SermonsLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] px-6 pb-24 pt-28">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="space-y-4">
          <div className="h-4 w-36 animate-pulse rounded bg-gold/20" />
          <div className="h-14 w-72 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-full max-w-lg animate-pulse rounded bg-white/10" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl bg-white/10" />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
