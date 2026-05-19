import Image from "next/image";
import Link from "next/link";
import { Play, BookOpen, Music, Radio, Mic, ChevronRight, Heart, Users, MessageSquare } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerContainer from "@/components/animations/StaggerContainer";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073"
            alt="Hero Background"
            fill
            className="object-cover opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/50 to-[#0A0A0A]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
            <p className="text-gold tracking-[0.4em] uppercase text-sm mb-6 font-medium">BEYOND THE LIGHT</p>
            <h1 className="text-6xl md:text-8xl font-cinzel font-bold mb-8 tracking-tighter text-shine leading-tight">
              A Movement <br /> Of Grace
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl font-inter mb-12 leading-relaxed">
              Equipping this generation with high-quality Christian media, 
              deep theology, and an unwavering commitment to the truth of Christ.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/sermons" className="bg-gold text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold-dark transition-all transform hover:scale-105 shadow-xl shadow-gold/20">
                Explore Sermons
              </Link>
              <Link href="/movement" className="glass px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all">
                Join the Movement
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="divine-rays" />
      </section>

      {/* Offerings Grid */}
      <section className="py-24 bg-surface/30">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">RESOURCES</p>
                <h2 className="text-4xl md:text-5xl font-cinzel font-medium">Digital Ministry</h2>
              </div>
              <Link href="/sermons" className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 font-medium">
                View All <ChevronRight size={20} />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Sermons", icon: Play, desc: "Watch and listen to the latest messages.", color: "bg-blue-500/10", href: "/sermons" },
              { title: "Podcasts", icon: Mic, desc: "Faith-filled conversations for daily growth.", color: "bg-gold/10", href: "/podcasts" },
              { title: "Music", icon: Music, desc: "Worship that transcends the mundane.", color: "bg-purple-500/10", href: "/music" },
              { title: "Daily Devotions", icon: BookOpen, desc: "Brief, powerful insights for your walk.", color: "bg-green-500/10", href: "/devotions" },
              { title: "Live Radio", icon: Radio, desc: "Continuous stream of faith and truth.", color: "bg-red-500/10", href: "/radio" },
              { title: "Community", icon: Users, desc: "Prayer wall and engagement hub.", color: "bg-orange-500/10", href: "/community" },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="group relative bg-[#1A1A1A] p-10 rounded-2xl border border-white/5 hover:border-gold/30 transition-all overflow-hidden">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="text-white group-hover:text-gold transition-colors" size={28} />
                </div>
                <h3 className="text-2xl font-cinzel font-semibold mb-4 group-hover:text-gold transition-colors">{item.title}</h3>
                <p className="text-gray-400 font-inter leading-relaxed">{item.desc}</p>
                
                <div className="absolute -bottom-1 -right-1 w-24 h-24 bg-gold/5 rounded-tl-full blur-2xl group-hover:bg-gold/10 transition-all" />
              </Link>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Latest Sermon / Spotlight */}
      <section className="py-32 bg-[#0A0A0A]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
              <Image 
                src="https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2070"
                alt="Latest Sermon"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center transform hover:scale-110 transition-all shadow-[0_0_30px_rgba(200,162,74,0.5)] cursor-pointer">
                  <Play size={32} className="text-black ml-1" fill="currentColor" />
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">LATEST SERMON</p>
              <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6 leading-tight">The Unfailing Light in a Dark World</h2>
              <p className="text-gray-400 text-lg mb-10 font-inter leading-relaxed">
                Join Pastor David Chen as he explores the central theme of Christ as the Light of the World in John 8:12. 
                A powerful exploration of hope, truth, and the transformation that occurs when we follow the Light.
              </p>
              <Link href="/sermons" className="inline-flex items-center gap-3 text-gold font-bold uppercase tracking-widest text-sm hover:gap-5 transition-all">
                Watch Now <ChevronRight size={18} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Engagement Stats */}
      <section className="py-24 border-y border-white/5 bg-surface/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Lives Impacted", value: "25k+", icon: Heart },
              { label: "Community Members", value: "8.4k", icon: Users },
              { label: "Prayer Requests", value: "1.2k", icon: MessageSquare },
              { label: "Episodes Released", value: "480+", icon: Mic },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <stat.icon className="mx-auto mb-4 text-gold/60" size={24} />
                <p className="text-4xl md:text-5xl font-cinzel font-bold mb-2 group-hover:text-gold transition-colors">{stat.value}</p>
                <p className="text-gray-500 font-inter uppercase tracking-widest text-[10px]">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
