export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="h-[400px] animate-pulse rounded-3xl bg-white/5" />
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="mb-6 h-8 w-48 animate-pulse rounded bg-white/5" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}