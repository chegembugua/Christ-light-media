'use client';

import Link from 'next/link';
import { Heart, Mail, Youtube, Instagram, Twitter, Facebook, ArrowUpRight, Sparkles } from 'lucide-react';

/* ── Link configurations ──────────────────────────────────────────── */
const FOOTER_LINKS = {
  Ministry: [
    { name: 'Sermons',    href: '/sermons' },
    { name: 'Podcasts',   href: '/podcasts' },
    { name: 'Music',      href: '/music' },
    { name: 'Worship',    href: '/worship' },
    { name: 'Live Radio', href: '/radio' },
  ],
  Community: [
    { name: 'Prayer Wall',  href: '/community/prayer' },
    { name: 'Community',    href: '/community' },
    { name: 'The Movement', href: '/movement' },
    { name: 'Give',         href: '/give' },
    { name: 'News',         href: '/news' },
  ],
  Learn: [
    { name: 'Bible School',    href: '/school' },
    { name: 'Devotions',       href: '/devotions' },
    { name: 'About Us',        href: '/movement' },
    { name: 'Privacy Policy',  href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIALS = [
  { icon: Youtube,   href: '#', label: 'YouTube',    color: 'hover:text-red-400' },
  { icon: Instagram, href: '#', label: 'Instagram',  color: 'hover:text-pink-400' },
  { icon: Twitter,   href: '#', label: 'Twitter / X',color: 'hover:text-sky-400' },
  { icon: Facebook,  href: '#', label: 'Facebook',   color: 'hover:text-blue-400' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative bg-[#070707] overflow-hidden">

      {/* ── Top gold accent line ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* ── Background glow ── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(200,162,74,0.05) 0%, transparent 68%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Newsletter banner ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-0">
        <div
          className="relative overflow-hidden rounded-2xl p-8 md:p-11"
          style={{
            background: 'linear-gradient(135deg, rgba(200,162,74,0.07) 0%, rgba(200,162,74,0.025) 100%)',
            border: '1px solid rgba(200,162,74,0.13)',
          }}
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(200,162,74,0.12)', border: '1px solid rgba(200,162,74,0.2)' }}
              >
                <Mail className="text-gold" size={20} />
              </div>
              <div>
                <p className="font-cinzel font-semibold text-white text-base leading-tight flex items-center gap-2">
                  Stay Connected
                  <Sparkles size={13} className="text-gold/70" />
                </p>
                <p className="text-sm text-white/40 font-inter mt-0.5">
                  Weekly devotions, updates, and encouragement delivered to your inbox.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); /* TODO wire to API */ }}
              className="flex w-full sm:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="flex-1 sm:w-64 bg-black/40 rounded-xl px-4 py-2.5 text-sm text-white
                           placeholder:text-white/20
                           focus:outline-none focus:ring-1 focus:ring-gold/50
                           border border-white/08 focus:border-gold/40 transition-all"
              />
              <button
                type="submit"
                className="btn-base btn-gold px-5 py-2.5 text-sm whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] gap-10 lg:gap-8 mb-14">

          {/* ── Brand column ── */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <span
                className="inline-block w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-gold"
                style={{
                  background: 'linear-gradient(135deg, #C8A24A 0%, #E6D5A8 50%, #B38A3D 100%)',
                  boxShadow: '0 0 18px rgba(200,162,74,0.28)',
                }}
              >
                <span className="text-black text-lg font-cinzel leading-none">✦</span>
              </span>
              <div>
                <p className="text-[15px] font-bold tracking-tight text-white group-hover:text-gold transition-colors font-cinzel leading-none">
                  Christ Light
                </p>
                <p className="text-[8px] text-white/20 tracking-[0.3em] uppercase font-inter mt-1">
                  Media House
                </p>
              </div>
            </Link>

            <p className="text-sm text-white/30 font-inter leading-relaxed max-w-xs mb-8">
              Equipping this generation with high-quality Christian media, deep theology, and an unwavering commitment to the truth of Christ.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-white/30 transition-all duration-200
                              hover:text-gold hover:bg-gold/8 ${s.color}`}
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns ── */}
          {Object.entries(FOOTER_LINKS).map(([heading, links], idx) => (
            <div key={heading}>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5"
                style={{ color: 'rgba(200,162,74,0.65)' }}
              >
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/30 hover:text-white/80 transition-colors duration-200 font-inter flex items-center gap-1.5 group"
                    >
                      {link.name}
                      <ArrowUpRight
                        size={11}
                        className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-gold/60"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs text-white/18 font-inter tracking-wide">
            © {year} Christ Light Media. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-white/18 font-inter">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className="hover:text-white/50 transition-colors">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              Built with <Heart size={11} className="text-gold fill-gold/60" /> for the Kingdom
            </span>
          </div>
        </div>
      </div>

      {/* ── Back-to-top button ── */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center text-black
                   hover:scale-110 active:scale-95 transition-transform
                   shadow-lg shadow-gold/25"
        style={{
          background: 'linear-gradient(135deg, #C8A24A, #B38A3D)',
          boxShadow: '0 0 22px rgba(200,162,74,0.3)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 10V4M7 4L3.5 7.5M7 4L10.5 7.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </footer>
  );
}
