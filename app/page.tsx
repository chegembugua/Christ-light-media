'use client'

import Link from 'next/link';
import { Play, Heart, Radio, Users, BookOpen, Zap, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import StaggerContainer from '@/components/animations/StaggerContainer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        
        {/* Background Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          
          {/* Badge */}
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-6 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              <span className="text-sm text-gold font-medium tracking-wide">WELCOME TO THE LIGHT</span>
            </div>
          </ScrollReveal>

          {/* Main Headline */}
          <ScrollReveal animation="slide-up" delay={200}>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold tracking-tighter mb-6">
              Let Your
              <br />
              <span className="text-gradient">Light Shine</span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal animation="slide-up" delay={400}>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              A premium digital sanctuary for worship, teaching, prayer, and discipleship. 
              Join thousands growing deeper in Christ.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal animation="slide-up" delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              
              {/* Primary CTA */}
              <Link href="/login">
                <button className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-dark text-black font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-lg">
                  Start Your Journey
                  <ArrowRight size={20} />
                </button>
              </Link>

              {/* Secondary CTA */}
              <Link href="/radio">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-white/30 hover:border-gold text-white font-semibold rounded-xl transition-all duration-300 hover:bg-gold/5 flex items-center justify-center gap-2">
                  Listen Now
                  <Play size={20} />
                </button>
              </Link>

            </div>
          </ScrollReveal>

          {/* Social Proof */}
          <ScrollReveal animation="slide-up" delay={800}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-text-secondary">
              
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gold" />
                <span>28,000+ Believers</span>
              </div>

              <div className="hidden sm:block w-px h-5 bg-text-tertiary"></div>

              <div className="flex items-center gap-2">
                <Heart size={18} className="text-gold" />
                <span>1,800+ Prayers Answered</span>
              </div>

              <div className="hidden sm:block w-px h-5 bg-text-tertiary"></div>

              <div className="flex items-center gap-2">
                <Radio size={18} className="text-gold" />
                <span>24/7 Live Worship</span>
              </div>

            </div>
          </ScrollReveal>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-gold/40 rounded-full flex items-center justify-center">
            <div className="w-1 h-2 bg-gold rounded-full animate-pulse"></div>
          </div>
        </div>

      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-gold/5 to-transparent">
        
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
                Everything You Need to Grow
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                A complete digital ecosystem designed to deepen your faith, 
                connect with believers, and encounter God daily.
              </p>
            </div>
          </ScrollReveal>

          {/* Features Grid */}
          <StaggerContainer staggerDelay={150} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1: Radio */}
            <div className="group bg-bg-tertiary border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-sm">
              
              <div className="w-12 h-12 bg-gold/20 group-hover:bg-gold/30 rounded-lg flex items-center justify-center mb-5 transition-colors">
                <Radio className="text-gold" size={28} />
              </div>

              <h3 className="text-xl font-cinzel font-semibold mb-3">24/7 Christ Light Radio</h3>

              <p className="text-text-secondary mb-5">
                Uninterrupted worship, teaching, and encouragement streaming live all day, every day.
              </p>

              <Link href="/radio" className="text-gold text-sm font-medium flex items-center gap-2 group/link">
                Tune In 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* Feature 2: Prayer */}
            <div className="group bg-bg-tertiary border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-sm">
              
              <div className="w-12 h-12 bg-gold/20 group-hover:bg-gold/30 rounded-lg flex items-center justify-center mb-5 transition-colors">
                <Heart className="text-gold" size={28} />
              </div>

              <h3 className="text-xl font-cinzel font-semibold mb-3">Prayer Wall & Community</h3>

              <p className="text-text-secondary mb-5">
                Share your prayer requests, intercede for thousands, and experience the power of united prayer.
              </p>

              <Link href="/community/prayer" className="text-gold text-sm font-medium flex items-center gap-2 group/link">
                Pray Together 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* Feature 3: Devotions */}
            <div className="group bg-bg-tertiary border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-sm">
              
              <div className="w-12 h-12 bg-gold/20 group-hover:bg-gold/30 rounded-lg flex items-center justify-center mb-5 transition-colors">
                <BookOpen className="text-gold" size={28} />
              </div>

              <h3 className="text-xl font-cinzel font-semibold mb-3">Daily Devotions & Teaching</h3>

              <p className="text-text-secondary mb-5">
                Start each day with Scripture, powerful sermons, and wisdom to guide your faith journey.
              </p>

              <Link href="/devotions" className="text-gold text-sm font-medium flex items-center gap-2 group/link">
                Read Today 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* Feature 4: Community */}
            <div className="group bg-bg-tertiary border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-sm">
              
              <div className="w-12 h-12 bg-gold/20 group-hover:bg-gold/30 rounded-lg flex items-center justify-center mb-5 transition-colors">
                <Users className="text-gold" size={28} />
              </div>

              <h3 className="text-xl font-cinzel font-semibold mb-3">Discipleship Challenges</h3>

              <p className="text-text-secondary mb-5">
                Join 21-day and 40-day spiritual challenges with thousands of believers worldwide.
              </p>

              <Link href="/movement" className="text-gold text-sm font-medium flex items-center gap-2 group/link">
                Join a Challenge 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* Feature 5: Worship */}
            <div className="group bg-bg-tertiary border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-sm">
              
              <div className="w-12 h-12 bg-gold/20 group-hover:bg-gold/30 rounded-lg flex items-center justify-center mb-5 transition-colors">
                <Zap className="text-gold" size={28} />
              </div>

              <h3 className="text-xl font-cinzel font-semibold mb-3">Live Worship & Events</h3>

              <p className="text-text-secondary mb-5">
                Experience live worship moments, prayer nights, and special spiritual events together.
              </p>

              <Link href="/worship" className="text-gold text-sm font-medium flex items-center gap-2 group/link">
                Explore Events 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>

            </div>

            {/* Feature 6: Movement */}
            <div className="group bg-bg-tertiary border border-white/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-gold-sm">
              
              <div className="w-12 h-12 bg-gold/20 group-hover:bg-gold/30 rounded-lg flex items-center justify-center mb-5 transition-colors">
                <Heart className="text-gold" size={28} />
              </div>

              <h3 className="text-xl font-cinzel font-semibold mb-3">In for Christ Movement</h3>

              <p className="text-text-secondary mb-5">
                Join a global spiritual movement committed to radical faith, discipleship, and transformation.
              </p>

              <Link href="/movement" className="text-gold text-sm font-medium flex items-center gap-2 group/link">
                Go Deeper 
                <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </Link>

            </div>

          </StaggerContainer>

        </div>

      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-24 px-6 bg-gradient-to-r from-gold/10 via-transparent to-gold/5">
        
        <div className="max-w-3xl mx-auto text-center">
          
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-cinzel font-bold mb-6">
              Ready to Encounter God?
            </h2>

            <p className="text-text-secondary text-lg mb-10">
              Join 28,000+ believers in a movement of radical faith, deep worship, 
              and life-changing discipleship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              
              <Link href="/register">
                <button className="w-full sm:w-auto px-10 py-4 bg-gold hover:bg-gold-dark text-black font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-lg">
                  Create Your Free Account
                  <ArrowRight size={20} />
                </button>
              </Link>

              <Link href="/radio">
                <button className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 hover:border-gold text-white font-semibold rounded-xl transition-all duration-300 hover:bg-gold/5">
                  Listen to Christ Light Radio
                </button>
              </Link>

            </div>
          </ScrollReveal>

        </div>

      </section>

    </div>
  );
}