'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Flame, BookOpen, Quote, ChevronRight, CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import { useAuth } from '@/context/AuthContext';
import { useApi, useMutation } from '@/hooks/useApi';

interface Testimony {
  id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  photoUrl: string | null;
  authorTitle: string | null;
  location: string | null;
  isFeatured: boolean;
  publishedAt: string | null;
  user: { fullName: string | null; avatarUrl: string | null };
}

interface MovementUpdate {
  id: string;
  title: string;
  author: string;
  authorTitle: string;
  date: string;
  preview: string;
}

// Static movement updates (leader posts)
const MOVEMENT_UPDATES: MovementUpdate[] = [
  {
    id: '1',
    title: 'A Word for the Season: Press In',
    author: 'Pastor David Chen',
    authorTitle: 'Founder, Christ Light Media',
    date: 'May 18, 2026',
    preview: 'The Lord is calling His people to a deeper place of consecration. This is not a time to pull back — it is a time to press in with everything we have...',
  },
  {
    id: '2',
    title: '21 Days of Prayer — What We Saw',
    author: 'Minister Grace Osei',
    authorTitle: 'Prayer Director',
    date: 'May 10, 2026',
    preview: 'Over 1,200 believers completed the 21 Days of Prayer challenge. The testimonies flooding in are extraordinary. Here is a glimpse of what God did...',
  },
  {
    id: '3',
    title: 'New Challenge Launching June 1st',
    author: 'Elder James Mwangi',
    authorTitle: 'Discipleship Lead',
    date: 'May 5, 2026',
    preview: 'We are excited to announce the 40 Days of Scripture challenge beginning June 1st. This is a call to saturate yourself in the Word of God...',
  },
];

// Circular progress component
function CircularProgress({ current, total, size = 80 }: { current: number; total: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(200,162,74,0.15)" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="#c8a24a" strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-gold font-bold text-sm leading-none">{current}</span>
        <span className="text-gray-500 text-[9px] leading-none mt-0.5">/{total}</span>
      </div>
    </div>
  );
}

export default function MovementPage() {
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [joining, setJoining] = useState(false);

  const { data: membershipData } = useApi<{ isMember: boolean }>(
    '/api/movement/membership',
    {},
    !!user
  );

  const { data: testimoniesData } = useApi<{ testimonies: Testimony[] }>(
    '/api/movement/testimonies?featured=true&limit=4'
  );

  const { execute: joinMovement } = useMutation('/api/movement/join', { method: 'POST' });

  useEffect(() => {
    if (membershipData?.isMember) setIsMember(true);
  }, [membershipData]);

  const handleQuickJoin = async () => {
    if (!user) { window.location.href = '/login?redirect=/movement/join'; return; }
    setJoining(true);
    const ok = await joinMovement({});
    if (ok) setIsMember(true);
    setJoining(false);
  };

  const testimonies = testimoniesData?.testimonies ?? [];
  const featured = testimonies.find((t) => t.isFeatured) ?? testimonies[0];
  const recent = testimonies.filter((t) => t.id !== featured?.id).slice(0, 3);

  const getAuthorName = (t: Testimony) =>
    t.isAnonymous ? 'Anonymous' : (t.user.fullName ?? 'Community Member');

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070"
            alt="In for Christ Movement"
            fill
            className="object-cover opacity-20 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/60 via-[#0A0A0A]/80 to-[#0A0A0A]" />
          {/* Gold radial glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gold/8 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="container mx-auto max-w-5xl px-6 relative z-10 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-gold tracking-[0.4em] uppercase text-xs font-bold mb-6">
              A GLOBAL DISCIPLESHIP MOVEMENT
            </p>
            <h1 className="text-6xl md:text-8xl font-cinzel font-bold mb-6 gradient-text leading-tight">
              In for Christ
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-6 font-inter leading-relaxed">
              A global discipleship movement for radical faith
            </p>
            <blockquote className="text-gray-400 italic text-sm md:text-base max-w-xl mx-auto mb-10 border-l-2 border-gold/40 pl-4 text-left">
              &ldquo;If anyone would come after me, let him deny himself and take up his cross and follow me.&rdquo;
              <span className="block mt-1 text-gold/70 not-italic text-xs tracking-widest uppercase">— Matthew 16:24</span>
            </blockquote>

            {isMember ? (
              <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 text-gold px-8 py-4 rounded-full font-bold text-base">
                <CheckCircle size={20} />
                You&apos;re in! ✓
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/movement/join">
                  <Button variant="gold" size="lg" className="px-10 py-4 text-base rounded-full shadow-xl shadow-gold/25">
                    Join the Movement
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-4 text-base rounded-full"
                  onClick={handleQuickJoin}
                  disabled={joining}
                >
                  {joining ? 'Joining...' : 'Quick Join'}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/5 bg-surface/20">
        <div className="container mx-auto px-6">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: '4,847', label: 'committed believers', color: 'text-gold' },
              { icon: Flame, value: '2', label: 'active challenges', color: 'text-orange-400' },
              { icon: BookOpen, value: '1,203', label: 'stories of transformation', color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <stat.icon className={`mx-auto mb-3 ${stat.color} opacity-70`} size={28} />
                <p className="text-5xl font-cinzel font-bold mb-1 text-white">{stat.value}</p>
                <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Active Challenges ─────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">DISCIPLINES</p>
              <h2 className="text-3xl md:text-4xl font-cinzel font-bold">Active Challenges</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Challenge 1 */}
            <ScrollReveal delay={100}>
              <div className="bg-card border border-white/5 rounded-3xl p-8 hover:border-gold/30 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-gold/5 rounded-tl-full blur-2xl group-hover:bg-gold/10 transition-all" />
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Prayer</span>
                    <h3 className="text-2xl font-cinzel font-bold mt-3 mb-2">21 Days of Prayer</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Join thousands in 21 days of deepening your prayer life through structured daily intercession.
                    </p>
                  </div>
                  <CircularProgress current={14} total={21} size={72} />
                </div>
                <p className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <Calendar size={12} />
                  Day 14 / 21 — 1,247 enrolled
                </p>
                <div className="flex gap-3">
                  <Link href="/movement/challenges/prayer-21" className="flex-1">
                    <Button variant="gold" size="sm" className="w-full">Learn More</Button>
                  </Link>
                  {!isMember && (
                    <Link href="/movement/join">
                      <Button variant="outline" size="sm">Enroll</Button>
                    </Link>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Challenge 2 */}
            <ScrollReveal delay={200}>
              <div className="bg-card border border-white/5 rounded-3xl p-8 hover:border-gold/30 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-gold/5 rounded-tl-full blur-2xl group-hover:bg-gold/10 transition-all" />
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Scripture</span>
                    <h3 className="text-2xl font-cinzel font-bold mt-3 mb-2">40 Days of Scripture</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Read and meditate on Scripture daily, allowing the Word to transform your mind and heart.
                    </p>
                  </div>
                  <CircularProgress current={8} total={40} size={72} />
                </div>
                <p className="text-xs text-gray-500 mb-6 flex items-center gap-2">
                  <Calendar size={12} />
                  Day 8 / 40 — 892 enrolled
                </p>
                <div className="flex gap-3">
                  <Link href="/movement/challenges/scripture-40" className="flex-1">
                    <Button variant="gold" size="sm" className="w-full">Learn More</Button>
                  </Link>
                  {!isMember && (
                    <Link href="/movement/join">
                      <Button variant="outline" size="sm">Enroll</Button>
                    </Link>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="text-center mt-8">
            <Link href="/movement/challenges" className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors text-sm font-semibold">
              View All Challenges <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonies ───────────────────────────────────────────────── */}
      <section className="py-24 bg-surface/20">
        <div className="container mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-4">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">IMPACT</p>
                <h2 className="text-3xl md:text-4xl font-cinzel font-bold">Stories of Transformation</h2>
              </div>
              <Link href="/movement/testimonies" className="text-gray-400 hover:text-gold transition-colors flex items-center gap-2 text-sm font-medium">
                View All <ChevronRight size={16} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Featured testimony */}
          {featured && (
            <ScrollReveal>
              <Link href={`/movement/testimonies/${featured.id}`}>
                <div className="bg-card border border-gold/10 rounded-3xl p-8 md:p-10 mb-8 hover:border-gold/40 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold/3 rounded-bl-full blur-3xl group-hover:bg-gold/6 transition-all" />
                  <Quote className="text-gold/20 mb-4" size={40} />
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-shrink-0">
                      {featured.photoUrl || featured.user.avatarUrl ? (
                        <Image
                          src={(featured.photoUrl ?? featured.user.avatarUrl) as string}
                          alt={getAuthorName(featured)}
                          width={80} height={80}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gold/30"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold/30 flex items-center justify-center text-gold text-2xl font-bold">
                          {getAuthorName(featured)[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white/90 text-lg italic leading-relaxed mb-4 line-clamp-3">
                        &ldquo;{featured.content}&rdquo;
                      </p>
                      <p className="font-semibold text-white">{getAuthorName(featured)}</p>
                      {featured.authorTitle && (
                        <p className="text-gold/70 text-sm">{featured.authorTitle}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                        Read Full Story <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          )}

          {/* Recent testimonies grid */}
          {recent.length > 0 && (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recent.map((t) => (
                <Link key={t.id} href={`/movement/testimonies/${t.id}`}>
                  <div className="bg-card border border-white/5 rounded-2xl p-6 hover:border-gold/30 transition-all duration-300 group h-full">
                    <div className="flex items-center gap-3 mb-4">
                      {t.photoUrl || t.user.avatarUrl ? (
                        <Image
                          src={(t.photoUrl ?? t.user.avatarUrl) as string}
                          alt={getAuthorName(t)}
                          width={48} height={48}
                          className="w-12 h-12 rounded-full object-cover border border-gold/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold">
                          {getAuthorName(t)[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-white">{getAuthorName(t)}</p>
                        {t.authorTitle && <p className="text-xs text-gray-500">{t.authorTitle}</p>}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold/70 bg-gold/10 px-2 py-0.5 rounded-full">
                      {t.category}
                    </span>
                    <p className="text-gray-400 text-sm italic mt-3 line-clamp-2">&ldquo;{t.content}&rdquo;</p>
                    <span className="inline-flex items-center gap-1 text-gold/70 text-xs font-semibold mt-4 group-hover:text-gold transition-colors">
                      Read Story <ChevronRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </StaggerContainer>
          )}

          {/* Fallback if no testimonies yet */}
          {testimonies.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="mx-auto mb-4 opacity-30" size={40} />
              <p>Testimonies coming soon. Be the first to share your story.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Movement Updates ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">LEADERSHIP</p>
              <h2 className="text-3xl md:text-4xl font-cinzel font-bold">From Our Leaders</h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOVEMENT_UPDATES.map((update) => (
              <Card key={update.id} className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">
                    {update.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white leading-tight">{update.author}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{update.authorTitle}</p>
                  </div>
                </div>
                <h3 className="font-cinzel font-semibold text-base mb-2 group-hover:text-gold transition-colors">
                  {update.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1">{update.preview}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-600">{update.date}</span>
                  <button className="text-gold text-xs font-semibold hover:text-gold/80 transition-colors flex items-center gap-1">
                    Read <ChevronRight size={12} />
                  </button>
                </div>
              </Card>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/3 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto max-w-3xl px-6 text-center relative z-10">
          <ScrollReveal>
            <p className="text-gold tracking-widest uppercase text-xs mb-4 font-bold">THE CALL</p>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">Ready to go deeper?</h2>
            <p className="text-gray-400 text-lg mb-10 font-inter leading-relaxed">
              Join thousands on a journey of radical discipleship. Commit your life fully to Christ and walk with a community that holds you accountable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/movement/join">
                <Button variant="gold" size="lg" className="px-10 py-4 rounded-full shadow-xl shadow-gold/20">
                  Join In for Christ
                </Button>
              </Link>
              <Link href="/movement/challenges">
                <Button variant="outline" size="lg" className="px-10 py-4 rounded-full">
                  Learn About Challenges
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
