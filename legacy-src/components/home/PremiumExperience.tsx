import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Headphones } from 'lucide-react';
import { DevotionItem } from '../../services/devotionService';
import { SermonItem } from '../../services/sermonService';
import ScrollReveal from '../animations/ScrollReveal';

export default function PremiumExperience({ 
  devotion, 
  sermon 
}: { 
  devotion?: DevotionItem | null; 
  sermon?: SermonItem | null; 
}) {
  return (
    <section className="py-24 bg-primary-base relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <ScrollReveal animation="light-reveal" delay={100}>
              <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
                A Sacred Space for <span className="text-gold italic">Reflection</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl">
                Immerse yourself in anointed teachings and daily devotions designed to elevate your spirit and draw you closer to the Light.
              </p>
            </ScrollReveal>
            
            <div className="space-y-4 pt-4">
              {devotion && (
                <ScrollReveal animation="fade-up" delay={300}>
                  <Link to={`/devotions/${devotion.id}`} className="group block bg-surface-base border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all outline-none">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20 text-gold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg group-hover:text-gold transition-colors">{devotion.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">Today's Devotion • {devotion.scriptureReference}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {sermon && (
                <ScrollReveal animation="fade-up" delay={400}>
                  <Link to={`/sermons/${sermon.id}`} className="group block bg-surface-base border border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all outline-none">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-gray-300">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg group-hover:text-gold transition-colors">{sermon.title}</h4>
                        <p className="text-gray-500 text-sm mt-1">Trending Sermon • {sermon.speaker}</p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}
            </div>

            <ScrollReveal animation="fade-up" delay={500}>
              <Link to="/devotions" className="inline-flex items-center gap-2 text-gold hover:text-yellow-400 font-mono text-sm tracking-widest uppercase transition-colors">
                Explore All Content <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Visual Element */}
          <div className="flex-1 w-full relative h-[500px] rounded-[2rem] overflow-hidden border border-white/10 group">
             <ScrollReveal animation="fade-in-scale" delay={300} className="w-full h-full">
               <div className="absolute inset-0 bg-gradient-to-t from-primary-base via-transparent to-transparent z-10" />
               <img 
                 src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2822&auto=format&fit=crop" 
                 alt="Holy Bible"
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
               />
               <div className="absolute bottom-10 left-10 right-10 z-20">
                  <div className="px-4 py-2 w-fit bg-black/50 backdrop-blur-md rounded-full border border-white/10 mb-4 text-xs font-mono uppercase tracking-widest text-gold">Featured</div>
                  <h3 className="font-serif text-3xl text-white mb-2">{sermon ? sermon.title : "Finding Peace in His Presence"}</h3>
                  <p className="text-gray-300">{sermon ? sermon.speaker : "Pastor John Doe"}</p>
               </div>
             </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
