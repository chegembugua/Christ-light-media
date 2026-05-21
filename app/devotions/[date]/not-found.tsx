import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="font-cinzel text-4xl text-white mb-4">Devotion not found</h1>
        <p className="text-gray-400 mb-8">
          Check the date and try again.
        </p>
        <Link
          href="/devotions"
          className="inline-flex items-center gap-2 text-[#C8A24A] hover:text-[#C8A24A]/80 transition"
        >
          <ArrowLeft size={18} />
          Back to Devotions
        </Link>
      </div>
    </div>
  );
}