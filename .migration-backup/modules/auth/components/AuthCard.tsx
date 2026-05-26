/**
 * Shared card wrapper for auth screens.
 */
interface AuthCardProps {
  verse: string;
  subtitle: string;
  children: React.ReactNode;
  accent?: 'left' | 'right';
}

export function AuthCard({ verse, subtitle, children, accent = 'right' }: AuthCardProps) {
  return (
    <div className="w-full max-w-md animate-fadeUp">
      <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-surface p-8 shadow-2xl backdrop-blur-xl md:p-10">
        <div
          className={`absolute h-24 w-24 bg-gold/5 blur-3xl ${
            accent === 'right' ? '-right-12 -top-12' : '-left-12 -top-12'
          }`}
        />

        <header className="mb-10 text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            {verse}
          </p>
          <div className="mb-2 flex items-center justify-center gap-3">
            <span className="font-cinzel text-3xl leading-none text-gold">✦</span>
            <h1 className="font-cinzel text-3xl font-bold tracking-tighter text-white">
              Christ Light
            </h1>
          </div>
          <p className="font-inter text-[10px] uppercase tracking-[3px] text-gray-500">Media House</p>
          <p className="mt-2 font-inter text-xs uppercase tracking-widest text-gray-500">{subtitle}</p>
        </header>

        {children}
      </div>
    </div>
  );
}
