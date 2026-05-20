'use client';

import { useState } from 'react';
import { Heart, Globe, Radio, BookOpen, Check, ArrowRight, Lock } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const IMPACT_AREAS = [
  { icon: Radio, title: 'Global Broadcasts', desc: 'Keeping our servers running 24/7 to stream the gospel to 120+ countries.' },
  { icon: BookOpen, title: 'Resource Creation', desc: 'Funding production of high-quality courses, podcasts, and devotions.' },
  { icon: Globe, title: 'Mission Initiatives', desc: 'Direct support for on-the-ground church plants and relief efforts.' },
];

export default function GivePage() {
  const [amount, setAmount] = useState('50');
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <PageHeader 
        label="PARTNER WITH US" 
        title="Give" 
        description="Your generosity fuels the spread of the Gospel. Partner with us to equip a generation with truth and light." 
      />

      <section className="pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Giving Form Side */}
            <ScrollReveal direction="right">
              <Card variant="featured" className="border-gold/20 shadow-[0_0_50px_rgba(200,162,74,0.05)] relative overflow-visible">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-[60px] pointer-events-none" />
                
                <h3 className="text-2xl font-cinzel font-bold mb-8 relative z-10">Make a Donation</h3>
                
                {/* Type toggle */}
                <div className="flex p-1 bg-black/50 border border-white/5 rounded-xl mb-8 relative z-10">
                  <button 
                    onClick={() => setIsMonthly(true)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${isMonthly ? 'bg-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setIsMonthly(false)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest rounded-lg transition-all ${!isMonthly ? 'bg-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    One Time
                  </button>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
                  {['25', '50', '100', '250', '500', 'Other'].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-4 rounded-xl border font-mono text-lg font-bold transition-all ${
                        amount === amt 
                          ? 'border-gold bg-gold/10 text-gold' 
                          : 'border-white/10 bg-[#121212] text-white hover:border-white/30'
                      }`}
                    >
                      {amt !== 'Other' && '$'}{amt}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                {amount === 'Other' && (
                  <div className="mb-6 relative z-10">
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      label="Custom Amount (USD)"
                      className="text-2xl font-mono"
                    />
                  </div>
                )}

                <div className="space-y-4 mb-8 relative z-10">
                  <Button className="w-full h-14 text-lg">
                    Continue to Payment
                  </Button>
                  <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                    <Lock size={12} /> Secure encrypted transaction via Stripe
                  </p>
                </div>
              </Card>
            </ScrollReveal>

            {/* Impact Info Side */}
            <ScrollReveal direction="left" delay={200}>
              <div className="pt-8">
                <h2 className="text-3xl md:text-4xl font-cinzel font-bold mb-6 leading-tight">
                  Where Does Your Seed Go?
                </h2>
                <p className="text-gray-400 font-inter text-lg leading-relaxed mb-12">
                  Christ Light Media operates entirely through the faithful partnership of believers. 
                  Every dollar goes directly toward ministry expansion, operational costs, and global outreach.
                </p>

                <div className="space-y-8">
                  {IMPACT_AREAS.map((area, i) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-black transition-all">
                        <area.icon size={24} />
                      </div>
                      <div>
                        <h4 className="font-cinzel font-bold text-lg mb-2">{area.title}</h4>
                        <p className="text-gray-400 text-sm font-inter leading-relaxed">{area.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tax info box */}
                <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-4 items-start">
                  <Check size={20} className="text-gold shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-400 leading-relaxed font-inter">
                    Christ Light Media is a registered 501(c)(3) non-profit organization. 
                    All donations are tax-deductible to the full extent allowed by law. 
                    A receipt will be emailed instantly.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </div>
  );
}
