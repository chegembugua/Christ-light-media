import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-primary-base flex items-center justify-center px-4 relative overflow-hidden text-white">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/40 rounded-full blur-[160px]"></div>
      </div>
      
      <div className="z-10 bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-3 font-serif">Access Denied</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          You do not have the required permissions to view this page. This area is restricted to administrators.
        </p>
        
        <Link 
          to="/"
          className="inline-block w-full bg-surface-hover hover:bg-white/10 border border-white/10 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
