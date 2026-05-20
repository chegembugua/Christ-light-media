'use client';

import Image from 'next/image';
import { ArrowRight, Flame, Target, Book, Shield } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const PILLARS = [
  { icon: Flame, title: 'Deep Intimacy', desc: 'Seeking God\'s face above His hand through intense prayer and worship.' },
  { icon: Book, title: 'Radical Truth', desc: 'Unyielding commitment to biblical orthodoxy in a shifting culture.' },
  { icon: Target, title: 'Intentional Mission', desc: 'Carrying the light into every sphere of influence — marketplace, arts, and education.' },
  { icon: Shield, title: 'Fierce Purity', desc: 'A generation dedicated to holiness and consecration.' },
];

export default function MovementPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="THE VISION" 
        title="The Movement" 
        description="We are more than a media platform. We are a generation awakening to the reality of Christ, committed to carrying His light into the darkest places." 
      />

      {/* ── Challenge Hero ────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden min-h-[500px] flex items-center shadow-[0_0_50px_rgba(200,162,74,0.15)]">
              <Image 
                src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070" 
                alt="Worship gathering" 
                fill 
                className="object-cover opacity-50 grayscale mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              
              <div className="relative z-10 p-8 md:p-16 max-w-2xl">
                <span className="bg-gold text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-6">
                  Next Challenge: June 1st
                </span>
                <h2 className="text-5xl md:text-6xl font-cinzel font-bold mb-6 text-shine leading-tight">
                  40 Days of Transformation
                </h2>
                <p className="text-gray-300 text-lg font-inter leading-relaxed mb-10">
                  A global solemn assembly. For 40 days, we unite in fasting, targeted prayer, 
                  and Scripture saturation. Will you answer the call to deeper consecration?
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="flex items-center justify-center gap-2">
                    Join the Waitlist <ArrowRight size={18} />
                  </Button>
                  <Button variant="outline" size="lg">
                    Read the Manifesto
                  </Button>
                </div>
                
                <div className="mt-12 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                        <Image src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop&crop=faces&random=${i}`} alt="Member" width={40} height={40} />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-black bg-gold flex items-center justify-center text-xs font-bold text-black">
                      +10k
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-300">Believers committed</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Core Pillars ─────────────────────────────────────────────── */}
      <section className="py-20 bg-surface/30">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-gold tracking-widest uppercase text-xs mb-3 font-bold">DNA</p>
              <h2 className="text-3xl md:text-4xl font-cinzel font-bold">Our Core Pillars</h2>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar, i) => (
              <Card key={i} className="text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
                  <pillar.icon size={28} />
                </div>
                <h3 className="font-cinzel font-semibold text-xl mb-3">{pillar.title}</h3>
                <p className="text-sm text-gray-400 font-inter leading-relaxed">{pillar.desc}</p>
              </Card>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
