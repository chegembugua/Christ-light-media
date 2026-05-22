import Link from 'next/link';
import Image from 'next/image';
import {
  Play, BookOpen, Music, Radio, Mic,
  ChevronRight, Heart, Users, MessageSquare,
  Flame, ArrowRight, Star, Zap,
} from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';

/* ─── Static data ─────────────────────────────────────────────────────────── */
const OFFERINGS = [
  { title: 'Sermons',        icon: Play,     desc: 'Powerful messages from anointed teachers.',  color: '#3B82F6', href: '/sermons' },
  { title: 'Podcasts',       icon: Mic,      desc: 'Faith conversations for daily growth.',       color: '#C8A24A', href: '/podcasts' },
  { title: 'Worship Music',  icon: Music,    desc: 'Worship that transcends the ordinary.',       color: '#A855F7', href: '/music' },
  { title: 'Devotions',      icon: BookOpen, desc: 'Brief, powerful insights for your walk.',     color: '#22C55E', href: '/devotions' },
  { title: 'Live Radio',     icon: Radio,    desc: 'Continuous stream of faith and truth.',       color: '#EF4444', href: '/radio' },
  { title: 'Community',      icon: Users,    desc: 'Prayer wall, chat, and impact stories.',      color: '#F97316', href: '/community' },
];

const STATS = [
  { value: '25k+', label: 'Lives Impacted',     icon: Heart },
  { value: '8.4k', label: 'Community Members',  icon: Users },
  { value: '1.2k', label: 'Prayer Requests',    icon: MessageSquare },
  { value: '480+', label: 'Episodes Released',  icon: Mic },
];

const TESTIMONIALS = [
  {
    text: "The 'Rooted in Grace' series completely shifted my perspective on God's love. I've never felt so free from performance anxiety in my faith.",
    author: 'Sarah Jenkins', role: 'Community Member', initial: 'S',
  },
  {
    text: 'I tune in to Christ Light Radio every morning on my commute. It sets the tone for my entire day and keeps me anchored in truth.',
    author: 'Michael T.', role: 'Daily Listener', initial: 'M',
  },
  {
    text: 'The prayer wall is my favorite feature. Knowing that believers around the world are standing with me in prayer is incredibly comforting.',
    author: 'Elena Rodriguez', role: 'Movement Partner', initial: 'E',
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">

      {/* ══════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073"
            alt="Hero — worship gathering"
            fill
            className="object-cover object-center opacity-20"
            priority
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/80 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/70 via-transparent to-[#0A0A0A]/40" />
        </div>

        {/* Gold radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse at top, rgba(200,162,74,0.1) 0%, transparent 65%)' }}
        />

        {/* Floating orbs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none z-0 animate-divineGlow"
          style={{ background: 'rgba(200,162,74,0.04)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full pointer-events-none z-0 animate-divineGlow"
          style={{ background: 'rgba(168,85,247,0.04)', filter: 'blur(60px)', animationDelay: '3s' }} />

        <div className="container mx-auto max-w-6xl px-6 relative z-10 pt-32 pb-20">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(200,162,74,0.1)', border: '1px solid rgba(200,162,74,0.2)', color: '#C8A24A' }}>
                  <Zap size={11} className="fill-gold" />
                  Premium Christian Media Platform
                </div>
              </div>
            </ScrollReveal>

            {/* Headline */}
            <ScrollReveal delay={100}>
              <h1 className="font-cinzel font-bold text-white mb-6 leading-[1.08]"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', letterSpacing: '-0.02em' }}>
                Where Faith Meets{' '}
                <span className="text-shine">World-Class</span>{' '}
                Media
              </h1>
            </ScrollReveal>

            {/* Sub */}
            <ScrollReveal delay={200}>
              <p className="text-white/55 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl font-inter">
                Sermons, podcasts, worship, and devotional resources — crafted for believers who refuse to settle for ordinary. Join a global community growing in radical faith.
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link href="/sermons">
                  <button
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-black text-base transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #C8A24A 0%, #E6D5A8 50%, #B38A3D 100%)',
                      boxShadow: '0 0 30px rgba(200,162,74,0.35), 0 4px 16px rgba(0,0,0,0.3)',
                    }}
                  >
                    <Play size={18} className="fill-black" />
                    Explore Sermons
                  </button>
                </Link>
                <Link href="/movement">
                  <button
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white text-base transition-all hover:bg-white/8 active:scale-95"
                    style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    <Flame size={18} className="text-gold" />
                    Join the Movement
                  </button>
                </Link>
              </div>
            </ScrollReveal>

            {/* Social proof */}
            <ScrollReveal delay={400}>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2.5">
                  {['S','M','E','J','A'].map((l, i) => (
                    <div key={i}
                      className="w-9 h-9 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-bold text-black"
                      style={{ background: `linear-gradient(135deg, #C8A24A, #B38A3D)`, zIndex: 5 - i }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} className="text-gold fill-gold" />)}
                  </div>
                  <p className="text-xs text-white/40 font-inter">Trusted by 25,000+ believers worldwide</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════════════════════════════
          OFFERINGS GRID
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="container mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70 mb-3">RESOURCES</p>
                <h2 className="font-cinzel font-bold text-white">Digital Ministry</h2>
              </div>
              <Link href="/sermons"
                className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-gold transition-colors group">
                View All
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {OFFERINGS.map((item) => (
              <Link key={item.title} href={item.href}
                className="group relative rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200,162,74,0.25)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(200,162,74,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                  <item.icon size={22} style={{ color: item.color }} />
                </div>

                <h3 className="font-cinzel font-semibold text-white text-xl mb-3 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed font-inter">{item.desc}</p>

                <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold text-white/25 group-hover:text-gold/70 transition-colors">
                  Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Corner glow */}
                <div className="absolute -bottom-4 -right-4 w-28 h-28 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${item.color}12 0%, transparent 70%)`, filter: 'blur(16px)' }} />
              </Link>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FEATURED SERMON SPOTLIGHT
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0E0E0E 100%)' }}>
        {/* Background glow */}
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,162,74,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Video thumbnail */}
            <ScrollReveal direction="right">
              <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                <Image
                  src="https://images.unsplash.com/photo-1544427928-c49cdfebf193?q=80&w=2070"
                  alt="Latest Sermon"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-18 h-18 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      width: 72, height: 72,
                      background: 'linear-gradient(135deg, #C8A24A, #B38A3D)',
                      boxShadow: '0 0 40px rgba(200,162,74,0.5)',
                    }}
                  >
                    <Play size={28} className="text-black ml-1" fill="currentColor" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
                  style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                  42:18
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal delay={150}>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70 mb-4">LATEST SERMON</p>
              <h2 className="font-cinzel font-bold text-white mb-5 leading-tight">
                The Unfailing Light in a Dark World
              </h2>
              <p className="text-white/45 text-base leading-relaxed mb-4 font-inter">
                Pastor David Chen explores Christ as the Light of the World in John 8:12 — a powerful journey through hope, truth, and transformation.
              </p>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg, #C8A24A, #B38A3D)' }}>D</div>
                <div>
                  <p className="text-sm font-medium text-white/80">Pastor David Chen</p>
                  <p className="text-xs text-white/30">John 8:12 · Sunday Service</p>
                </div>
              </div>
              <Link href="/sermons"
                className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest text-gold hover:gap-4 transition-all group">
                Watch Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-20 relative"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', background: '#0C0C0C' }}>
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <div className="group">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-4 flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ background: 'rgba(200,162,74,0.08)', border: '1px solid rgba(200,162,74,0.15)' }}>
                    <stat.icon size={18} className="text-gold/60 group-hover:text-gold transition-colors" />
                  </div>
                  <p className="font-cinzel font-bold text-white mb-1.5 group-hover:text-gold transition-colors"
                    style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25 font-inter">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          MOVEMENT BANNER
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(200,162,74,0.15)' }}>
              {/* Background */}
              <Image
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070"
                alt="In for Christ Movement"
                fill
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/95 via-[#0A0A0A]/80 to-transparent" />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at left, rgba(200,162,74,0.08) 0%, transparent 60%)' }} />

              <div className="relative z-10 p-10 md:p-16 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                  style={{ background: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.25)', color: '#C8A24A' }}>
                  <Flame size={11} className="fill-gold" />
                  IN FOR CHRIST MOVEMENT
                </div>
                <h2 className="font-cinzel font-bold text-white mb-5 leading-tight">
                  A Global Call to Radical Discipleship
                </h2>
                <p className="text-white/50 text-base leading-relaxed mb-8 font-inter">
                  Join thousands of believers committed to prayer, Scripture, and authentic witness. 21-day and 40-day challenges designed to transform your walk with God.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/movement/join">
                    <button
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-black text-sm transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: 'linear-gradient(135deg, #C8A24A, #B38A3D)',
                        boxShadow: '0 0 24px rgba(200,162,74,0.3)',
                      }}
                    >
                      <Flame size={16} className="fill-black" />
                      Join the Movement
                    </button>
                  </Link>
                  <Link href="/movement/challenges">
                    <button
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:bg-white/8"
                      style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      View Challenges <ArrowRight size={15} />
                    </button>
                  </Link>
                </div>

                {/* Member count */}
                <div className="flex items-center gap-3 mt-8">
                  <div className="flex -space-x-2">
                    {['A','B','C','D'].map((l, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center text-[10px] font-bold text-black"
                        style={{ background: 'linear-gradient(135deg, #C8A24A, #B38A3D)', zIndex: 4 - i }}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/35 font-inter">4,847 committed believers</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: '#0C0C0C' }}>
        {/* Center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(200,162,74,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="container mx-auto max-w-6xl px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70 mb-4">IMPACT</p>
              <h2 className="font-cinzel font-bold text-white">Transformed Lives</h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i}
                className="relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 group"
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,162,74,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}
              >
                {/* Quote mark */}
                <div className="text-5xl font-serif text-gold/12 leading-none mb-4 select-none">&ldquo;</div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} className="text-gold fill-gold" />)}
                </div>

                <p className="text-white/55 text-sm leading-relaxed mb-7 font-inter">{t.text}</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #C8A24A, #B38A3D)' }}>
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{t.author}</p>
                    <p className="text-[11px] text-white/30 uppercase tracking-wider font-inter">{t.role}</p>
                  </div>
                </div>

                {/* Corner glow */}
                <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(200,162,74,0.08) 0%, transparent 70%)', filter: 'blur(12px)' }} />
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════ */}
      <section className="py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0D0D0D 100%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(200,162,74,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="container mx-auto max-w-3xl px-6 text-center relative z-10">
          <ScrollReveal>
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px flex-1 max-w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,162,74,0.3))' }} />
              <div className="w-2 h-2 rounded-full bg-gold/50" />
              <div className="h-px flex-1 max-w-16" style={{ background: 'linear-gradient(90deg, rgba(200,162,74,0.3), transparent)' }} />
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/70 mb-5">BEGIN YOUR JOURNEY</p>
            <h2 className="font-cinzel font-bold text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Ready to Go Deeper?
            </h2>
            <p className="text-white/45 text-lg leading-relaxed mb-10 font-inter max-w-xl mx-auto">
              Join thousands of believers growing in faith daily. Create a free account to track progress, save favorites, and connect with the community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <button
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl font-semibold text-black text-base transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #C8A24A 0%, #E6D5A8 50%, #B38A3D 100%)',
                    boxShadow: '0 0 40px rgba(200,162,74,0.3), 0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  Create Free Account
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/sermons">
                <button
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl font-semibold text-white text-base transition-all hover:bg-white/6 active:scale-95"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Play size={18} className="text-gold" />
                  Browse Content
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
              {['Free to join', 'No credit card', 'Cancel anytime'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-xs text-white/25 font-inter">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                  {badge}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
