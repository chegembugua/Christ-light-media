import Image from "next/image";
import Link from "next/link";
import { Play, BookOpen, Music, Radio, Mic, ChevronRight, Heart, Users, MessageSquare } from "lucide-react";
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerContainer from "@/components/animations/StaggerContainer";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073"
            alt="Hero Background"
            fill
            className="object-cover object-center opacity-30 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A]/70 via-[#0A0A0A]/95 to-[#0A0A0A]" />
        </div>

        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl p-10 md:p-14 shadow-2xl shadow-black/40">
              <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                <div className="max-w-2xl">
                  <p className="text-gold tracking-[0.35em] uppercase text-sm mb-4 font-semibold">BEYOND THE LIGHT</p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold mb-6 leading-tight text-white">
                    Professional Christian media built for modern ministry.
                  </h1>
                  <p className="text-gray-300 max-w-xl text-base md:text-lg leading-relaxed mb-8">
                    Experience sermons, podcasts, worship, and devotional resources with a premium digital feel — designed to help your community connect, grow, and thrive.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/sermons" className="inline-block">
                      <Button variant="gold" size="lg" className="px-8">Explore Sermons</Button>
                    </Link>
                    <Link href="/movement" className="inline-block">
                      <Button variant="ghost" size="lg" className="px-8">Join the Movement</Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: 'Live Worship', subtitle: '24/7 station with curated praise.', icon: Music },
                    { title: 'Daily Devotions', subtitle: 'Brief, powerful scripture reflections.', icon: BookOpen },
                    { title: 'Community', subtitle: 'Prayer wall, chat, and impact stories.', icon: Users },
                  ].map((item, index) => (
                    <Card key={index} variant="compact" className="border-white/10 bg-white/5">
                      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gold/10 text-gold mb-4">
                        <item.icon size={22} />
                      </div>
                      <h3 className="font-semibold text-white text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.subtitle}</p>
                    </Card>
                  ))}
                </div>
              </div>
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

      {/* Testimonials */}
      <section className="py-32 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">IMPACT</p>
              <h2 className="text-3xl md:text-5xl font-cinzel font-bold">Transformed Lives</h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The 'Rooted in Grace' series completely shifted my perspective on God's love. I've never felt so free from performance anxiety in my faith.",
                author: "Sarah Jenkins",
                role: "Community Member",
              },
              {
                text: "I tune in to Christ Light Radio every morning on my commute. It sets the tone for my entire day and keeps me anchored in truth.",
                author: "Michael T.",
                role: "Daily Listener",
              },
              {
                text: "The prayer wall is my favorite feature. Knowing that believers around the world are standing with me in prayer is incredibly comforting.",
                author: "Elena Rodriguez",
                role: "Movement Partner",
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 relative hover:-translate-y-2 transition-transform duration-500">
                <span className="text-6xl text-gold/20 font-serif absolute top-4 left-6">&ldquo;</span>
                <p className="text-gray-300 font-inter leading-relaxed mb-8 relative z-10 pt-4">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{testimonial.author}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0A0A0A] to-[#111]">
        <div className="container mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-cinzel font-bold mb-6">Ready to go deeper?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 font-inter">
              Join thousands of believers who are growing in their faith daily. 
              Create a free account to track your progress, save favorites, and join the community.
            </p>
            <Link href="/register" className="inline-block bg-gold text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gold-dark transition-all transform hover:scale-105 shadow-xl shadow-gold/20">
              Create Free Account
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
