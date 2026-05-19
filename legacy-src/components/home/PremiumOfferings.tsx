import { Radio, Heart, BookOpen, Music, Mic2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';
import StaggerContainer from '../animations/StaggerContainer';

const offerings = [
  { icon: Radio, title: "24/7 Christ Light Radio", desc: "Non-stop worship, teachings, and uplifting content.", link: "/radio" },
  { icon: Mic2, title: "Anointed Sermons", desc: "Life-changing messages from seasoned ministers.", link: "/sermons" },
  { icon: BookOpen, title: "Daily Devotions", desc: "Start your day with the Word of God.", link: "/devotions" },
  { icon: Heart, title: "Prayer Community", desc: "Stand in the gap with believers worldwide.", link: "/community/prayer-requests" },
  { icon: FileText, title: "Latest News", desc: "Stay updated on kingdom events and testimonies.", link: "/news" },
  { icon: Music, title: "Worship Music", desc: "Curated playlists for every spiritual season.", link: "/music" },
];

export default function PremiumOfferings() {
  return (
    <section className="py-24 bg-surface-base relative border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">What We Offer</h2>
            <div className="w-16 h-1 bg-gold mx-auto rounded-full opacity-50" />
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={100} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {offerings.map((item, idx) => (
            <Link 
              key={idx} 
              to={item.link}
              className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-gold/30 transition-all duration-500 overflow-hidden relative outline-none"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:text-gold text-gray-400 border border-white/10 group-hover:border-gold/20">
                <item.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3 tracking-wide">{item.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
