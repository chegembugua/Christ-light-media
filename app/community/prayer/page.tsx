'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Flame, Plus, Lock } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const PRAYERS = [
  {
    id: 'p1',
    author: 'Sarah O.',
    category: 'Healing',
    content: 'Please pray for my mother who is undergoing surgery tomorrow morning. Praying for the doctors\' hands and a speedy recovery.',
    prays: 142,
    timeAgo: '2h ago',
    isAnswered: false,
  },
  {
    id: 'p2',
    author: 'Daniel K.',
    category: 'Provision',
    content: 'Believing God for a job breakthrough this week after 6 months of searching. I know He is faithful!',
    prays: 89,
    timeAgo: '4h ago',
    isAnswered: false,
  },
  {
    id: 'p3',
    author: 'Anonymous',
    category: 'Family',
    content: 'Praying for restoration in my marriage. It\'s been a difficult season, but I believe God can restore what is broken.',
    prays: 215,
    timeAgo: '1d ago',
    isAnswered: false,
  },
  {
    id: 'p4',
    author: 'Grace M.',
    category: 'Healing',
    content: 'Praise report! The latest scan showed no sign of the illness. Thank you all for standing with me in prayer over the last year!',
    prays: 534,
    timeAgo: '2d ago',
    isAnswered: true,
  },
  {
    id: 'p5',
    author: 'James T.',
    category: 'Guidance',
    content: 'Need wisdom regarding a major life decision involving relocation for ministry.',
    prays: 67,
    timeAgo: '3d ago',
    isAnswered: false,
  },
];

export default function PrayerPage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'answered'>('recent');

  const filteredPrayers = activeTab === 'recent' 
    ? PRAYERS.filter(p => !p.isAnswered) 
    : PRAYERS.filter(p => p.isAnswered);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="COMMUNITY" 
        title="Prayer Wall" 
        description="Bear one another's burdens, and so fulfill the law of Christ. Share your requests and stand in faith with believers worldwide." 
      />

      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Submit Prayer CTA */}
          <ScrollReveal>
            <div className="bg-gradient-to-r from-card to-card/50 border border-white/10 rounded-3xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h2 className="text-xl font-cinzel font-bold mb-2">Need Prayer?</h2>
                <p className="text-sm text-gray-400 font-inter">Submit your request securely. Our intercessory team and community are ready to stand with you.</p>
              </div>
              <Button className="shrink-0 flex items-center gap-2 relative z-10">
                <Plus size={16} /> Share Request
              </Button>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal>
            <div className="flex border-b border-white/5 mb-8">
              <button 
                onClick={() => setActiveTab('recent')}
                className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'recent' ? 'text-gold border-gold' : 'text-gray-500 border-transparent hover:text-white'
                }`}
              >
                Recent Requests
              </button>
              <button 
                onClick={() => setActiveTab('answered')}
                className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === 'answered' ? 'text-gold border-gold' : 'text-gray-500 border-transparent hover:text-white'
                }`}
              >
                Answered <Flame size={14} className={activeTab === 'answered' ? 'text-gold' : 'text-gray-500'} />
              </button>
            </div>
          </ScrollReveal>

          {/* List */}
          <StaggerContainer className="space-y-4">
            {filteredPrayers.map((prayer) => (
              <Card key={prayer.id} className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold text-gray-300">
                      {prayer.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{prayer.author}</p>
                      <p className="text-xs text-gray-500">{prayer.timeAgo}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {prayer.category}
                  </span>
                </div>
                
                <p className="text-gray-300 font-inter leading-relaxed mb-6">
                  {prayer.content}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors group">
                      <Heart size={16} className="group-hover:fill-gold/20" /> 
                      <span>{prayer.prays} praying</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                      <MessageCircle size={16} /> Comment
                    </button>
                  </div>
                  
                  {prayer.isAnswered && (
                    <span className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                      <Flame size={14} /> Answered
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </StaggerContainer>
          
        </div>
      </section>
    </div>
  );
}
