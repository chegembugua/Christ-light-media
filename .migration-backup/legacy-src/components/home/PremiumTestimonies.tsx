import { Quote } from 'lucide-react';

const testimonies = [
  { quote: "The daily devotions have completely transformed my morning routine. I feel more connected to God than ever before.", author: "Sarah Jenkins", role: "Listener" },
  { quote: "Christ Light Radio is my sanctuary in the middle of a busy workday. The music selection is truly anointed.", author: "David M.", role: "Premium Member" },
  { quote: "I requested prayer last week, and the support from this community brought me to tears. God is moving here.", author: "Elena R.", role: "Community Member" },
];

export default function PremiumTestimonies() {
  return (
    <section className="py-32 bg-primary-base border-t border-white/5 relative overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center mb-20">
               <span className="text-gold font-mono text-sm tracking-[0.2em] uppercase mb-4">In The Light</span>
               <h2 className="font-serif text-4xl md:text-5xl text-white">Voices of the Community</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {testimonies.map((item, idx) => (
                  <div key={idx} className="bg-surface-base p-10 rounded-[2rem] border border-white/10 relative group hover:-translate-y-2 transition-transform duration-500">
                     <Quote className="w-10 h-10 text-white/5 absolute top-8 left-8 group-hover:text-gold/10 transition-colors" />
                     <p className="text-gray-300 font-light leading-relaxed italic mb-8 relative z-10 text-lg">"{item.quote}"</p>
                     <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/40 to-primary-base border border-white/10" />
                        <div>
                           <h4 className="text-white font-medium">{item.author}</h4>
                           <span className="text-xs text-gray-500 uppercase tracking-widest">{item.role}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
        </div>
    </section>
  );
}
