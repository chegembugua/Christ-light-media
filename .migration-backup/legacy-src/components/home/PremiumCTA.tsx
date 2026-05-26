import { ArrowRight, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';

export default function PremiumCTA() {
  return (
    <section className="bg-primary-base py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/5 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-base to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <ScrollReveal animation="fade-in-scale">
               <h2 className="font-serif text-5xl md:text-6xl text-white mb-6 drop-shadow-lg">Become Part of the Lampstand</h2>
               <p className="text-gray-300 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                 Join a global community of believers growing in faith, worship, and the Word.<br/>
                 <span className="italic text-gray-400 block mt-4 text-base">"For where two or three are gathered in my name, there am I among them." — Matthew 18:20</span>
               </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link 
                     to="/admin/login" 
                     className="px-8 py-4 bg-gold text-black rounded-full font-semibold tracking-[0.15em] uppercase text-sm hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-3 accent-glow outline-none"
                  >
                     <UserPlus className="w-5 h-5" /> Join the Community
                  </Link>
                  
                  <Link 
                     to="/devotions" 
                     className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium tracking-widest uppercase text-sm hover:bg-white/10 hover:border-gold/50 transition-all flex items-center justify-center gap-3 outline-none"
                  >
                     Read Devotions <ArrowRight className="w-4 h-4" />
                  </Link>
              </div>
            </ScrollReveal>
        </div>
    </section>
  );
}
