import { Play, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';

export default function PremiumRadioSpotlight() {
  return (
    <section className="py-24 bg-primary-base relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-in-scale">
          <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col items-center text-center overflow-hidden relative glass shadow-[0_0_30px_rgba(200,162,74,0.1)] hover:border-gold/30 hover:shadow-[0_0_40px_rgba(200,162,74,0.15)] transition-all duration-700">
            
            <div className="absolute top-0 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 mb-8 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-mono uppercase tracking-widest font-bold">Live Now</span>
            </div>

            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Christ Light Radio</h2>
            <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl">
              Join thousands of listeners tuning in right now for continuous worship, anointed teachings, and moments of divine encounter.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/radio"
                className="px-10 py-5 bg-gold text-black rounded-full font-semibold tracking-widest uppercase flex items-center gap-3 hover:scale-105 active:scale-95 transition-transform accent-glow outline-none"
              >
                <Play className="w-5 h-5 fill-black" /> Join Live Radio
              </Link>

              <div className="flex items-center gap-4 bg-white/5 px-6 py-5 rounded-full border border-white/10">
                <Users className="w-5 h-5 text-gray-400" />
                <div className="flex flex-col items-start">
                   <span className="text-white font-mono leading-none">1,248</span>
                   <span className="text-xs text-gray-500 uppercase tracking-widest leading-none mt-1">Listeners</span>
                </div>
              </div>
            </div>
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
