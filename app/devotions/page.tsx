'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Share2, Heart, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

const DEVOTIONS = [
  {
    id: 'd1', title: 'Walking in the Light', verse: 'John 8:12',
    verseText: '"I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."',
    reflection: 'In a world clouded by confusion and fear, Christ offers the only true light. When we choose to follow Him, we step out of the shadow of uncertainty and into a path illuminated by His presence. Today, ask yourself: where am I walking in darkness? Invite His light into those places.',
    date: 'May 19, 2026', image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070',
  },
  {
    id: 'd2', title: 'Strength in Stillness', verse: 'Psalm 46:10',
    verseText: '"Be still, and know that I am God."',
    reflection: 'Our culture celebrates busyness, but God invites us to stillness. In the quiet, we find His sovereignty. In the pause, we discover His peace. Make time today to simply be — no agenda, no requests — just resting in the awareness that He is God.',
    date: 'May 18, 2026', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2070',
  },
  {
    id: 'd3', title: 'Rooted in Love', verse: 'Ephesians 3:17',
    verseText: '"So that Christ may dwell in your hearts through faith — that you, being rooted and grounded in love…"',
    reflection: 'A tree with deep roots withstands the fiercest storms. When our identity is rooted in the love of Christ, we find an unshakeable foundation. Let His love be the soil in which you grow today.',
    date: 'May 17, 2026', image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070',
  },
  {
    id: 'd4', title: 'A New Mercy', verse: 'Lamentations 3:22-23',
    verseText: '"The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning."',
    reflection: 'No matter what yesterday held — failure, grief, or regret — today is a fresh canvas painted with mercy. God does not hold your past against you. He greets you this morning with new grace and new possibilities.',
    date: 'May 16, 2026', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073',
  },
];

export default function DevotionsPage() {
  const today = DEVOTIONS[0];
  const past = DEVOTIONS.slice(1);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader label="DAILY WORD" title="Devotions" description="Start each day anchored in God's Word. Brief, powerful insights for your walk of faith." />

      {/* Today's Devotion */}
      <section className="pb-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <Card variant="featured" className="overflow-hidden p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[480px]">
                  <Image src={today.image} alt={today.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-5 left-5">
                    <span className="bg-gold text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Today</span>
                  </div>
                </div>
                <div className="p-8 lg:p-14 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-6">
                    <Calendar size={14} /> {today.date}
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-cinzel font-bold mb-6 leading-tight">{today.title}</h2>
                  <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6 mb-8">
                    <BookOpen size={20} className="text-gold mb-3" />
                    <p className="italic text-gray-300 font-inter leading-relaxed text-[15px]">{today.verseText}</p>
                    <p className="text-gold font-bold text-sm mt-3">— {today.verse}</p>
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Reflection</h3>
                  <p className="text-gray-400 font-inter leading-[1.8] mb-8">{today.reflection}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-gold hover:border-gold/30 transition-all">
                      <Heart size={16} /> Amen
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-gray-400 hover:text-gold hover:border-gold/30 transition-all">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      <div className="section-divider" />

      {/* Past Devotions */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-2 font-bold">ARCHIVE</p>
                <h2 className="text-3xl font-cinzel font-medium">Past Devotions</h2>
              </div>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {past.map((dev, i) => (
              <Card key={dev.id} className="cursor-pointer h-full">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden mb-5">
                  <Image src={dev.image} alt={dev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                  <Calendar size={12} className="text-gold/60" /> {dev.date}
                </div>
                <h3 className="font-cinzel font-semibold text-lg mb-2 group-hover:text-gold transition-colors leading-tight">{dev.title}</h3>
                <p className="text-gold text-sm font-bold mb-3">{dev.verse}</p>
                <p className="text-gray-500 text-sm font-inter line-clamp-3 leading-relaxed">{dev.reflection}</p>
              </Card>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Verse of the Day */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="relative bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <BookOpen size={32} className="text-gold mx-auto mb-6" />
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold mb-8">Verse of the Day</p>
                <blockquote className="text-2xl md:text-3xl font-cinzel text-white leading-relaxed max-w-3xl mx-auto mb-6 font-medium">
                  &ldquo;For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.&rdquo;
                </blockquote>
                <p className="text-gold font-bold tracking-widest">— John 3:16</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
