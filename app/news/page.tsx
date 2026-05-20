'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Share2, Bookmark } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';

const CATEGORIES = ['All', 'Announcements', 'Missions', 'Events', 'Testimonies', 'Ministry'];

const NEWS = [
  {
    id: 'n1',
    title: 'Christ Light Media Launches 40-Day Prayer Challenge',
    excerpt: 'Join thousands of believers across the globe as we embark on a journey of deep intercession and spiritual renewal starting this June.',
    category: 'Events',
    author: 'Pastor David Chen',
    date: new Date('2026-05-18T10:00:00'),
    image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070',
    featured: true,
  },
  {
    id: 'n2',
    title: 'New Worship Album "Throne Room" Reaches #1 on Gospel Charts',
    excerpt: 'Grace Melody\'s latest project has touched millions, featuring anthems that are rapidly becoming staples in Sunday worship globally.',
    category: 'Ministry',
    author: 'Media Team',
    date: new Date('2026-05-15T14:30:00'),
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2000',
    featured: false,
  },
  {
    id: 'n3',
    title: 'Kenya Mission Trip: Rebuilding the Hope Center',
    excerpt: 'Read the incredible testimony of how our community raised funds and sent 50 volunteers to rebuild a local community center in Nairobi.',
    category: 'Missions',
    author: 'Sarah Okafor',
    date: new Date('2026-05-10T09:15:00'),
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070',
    featured: false,
  },
  {
    id: 'n4',
    title: 'Upcoming Conference: "The Unfailing Light 2026"',
    excerpt: 'Registration is now open for our annual leadership and worship conference in August. Early bird tickets available until June 30th.',
    category: 'Announcements',
    author: 'Events Team',
    date: new Date('2026-05-05T11:00:00'),
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070',
    featured: false,
  },
  {
    id: 'n5',
    title: 'Testimony: "How the Word Changed My Family"',
    excerpt: 'A powerful story from a listener in Brazil whose marriage was restored after tuning into the "Family — God\'s First Institution" series.',
    category: 'Testimonies',
    author: 'Community Member',
    date: new Date('2026-05-01T08:45:00'),
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2070',
    featured: false,
  },
];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const featured = NEWS.find(n => n.featured) || NEWS[0];
  const articles = activeCategory === 'All' 
    ? NEWS.filter(n => n.id !== featured.id)
    : NEWS.filter(n => n.category === activeCategory && n.id !== featured.id);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="UPDATES" 
        title="News" 
        description="Stories, announcements, and testimonies from the Christ Light Media community around the world." 
      />

      {/* ── Featured Article ────────────────────────────────────────── */}
      {activeCategory === 'All' && (
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <Link href={`/news/${featured.id}`}>
                <Card variant="featured" className="p-0 overflow-hidden group">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[500px]">
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:aspect-auto">
                      <Image 
                        src={featured.image} 
                        alt={featured.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] lg:bg-gradient-to-r lg:from-transparent lg:to-[#1A1A1A] to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-gold text-black px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-gold/20">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-14 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gold mb-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {format(featured.date, 'MMM dd, yyyy')}</span>
                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-gray-400">{featured.category}</span>
                      </div>
                      
                      <h2 className="text-3xl lg:text-5xl font-cinzel font-bold mb-6 leading-tight group-hover:text-gold transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-gray-400 text-lg font-inter leading-relaxed mb-8">
                        {featured.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-8 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/5">
                            <User size={16} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{featured.author}</p>
                          </div>
                        </div>
                        <span className="flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs group-hover:gap-4 transition-all">
                          Read Story <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── Articles Grid ───────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-gold tracking-widest uppercase text-xs mb-2 font-bold">ALL POSTS</p>
                <h2 className="text-3xl font-cinzel font-medium">Latest News</h2>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal>
            <div className="flex gap-3 mb-12 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-gold text-black shadow-lg shadow-gold/20'
                      : 'bg-card text-gray-400 hover:text-white border border-white/5 hover:border-gold/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`}>
                <Card className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="relative aspect-[16/10] w-full">
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold mb-4">
                      <Calendar size={12} /> {format(article.date, 'MMM dd, yyyy')}
                    </div>
                    
                    <h3 className="text-xl font-cinzel font-bold mb-3 group-hover:text-gold transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 font-inter line-clamp-3 mb-6">
                      {article.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-semibold">{article.author}</p>
                      <div className="flex gap-2">
                        <button className="text-gray-500 hover:text-white p-1" onClick={(e) => e.preventDefault()} aria-label="Bookmark">
                          <Bookmark size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-white p-1" onClick={(e) => e.preventDefault()} aria-label="Share">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </StaggerContainer>
          
          {articles.length === 0 && (
            <div className="text-center py-20 text-gray-500 font-inter">
              No news found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
